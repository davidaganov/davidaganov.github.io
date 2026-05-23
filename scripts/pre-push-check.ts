import { execSync } from "child_process"
import readline from "readline"

async function getChangedFiles(): Promise<string[]> {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    })

    let inputData = ""

    // Set a timeout of 100ms to read stdin. If stdin is not a TTY or is empty,
    // we fallback to the manual check using git diff.
    const timer = setTimeout(() => {
      rl.close()
    }, 100)

    rl.on("line", (line) => {
      inputData += line + "\n"
    })

    rl.on("close", () => {
      clearTimeout(timer)
      const lines = inputData.trim().split("\n").filter(Boolean)

      if (lines.length === 0) {
        console.log("No stdin input received. Falling back to git diff against upstream...")
        try {
          const files = execSync("git diff --name-only @{u}...HEAD", { encoding: "utf8" })
            .trim()
            .split("\n")
            .filter(Boolean)
          resolve(files)
        } catch {
          try {
            const files = execSync("git diff --name-only origin/main...HEAD", { encoding: "utf8" })
              .trim()
              .split("\n")
              .filter(Boolean)
            resolve(files)
          } catch {
            resolve([])
          }
        }
        return
      }

      const filesSet = new Set<string>()
      for (const line of lines) {
        const parts = line.split(" ")
        if (parts.length < 4) continue
        const [_localRef, local_sha, _remoteRef, remote_sha] = parts

        // If deleting a branch, skip checks for it
        if (local_sha === "0000000000000000000000000000000000000000") {
          continue
        }

        let diffCmd = ""
        if (remote_sha === "0000000000000000000000000000000000000000") {
          // New branch. Diff against merge base with main or origin/main
          let base = "main"
          try {
            execSync("git rev-parse --verify origin/main", { stdio: "ignore" })
            base = "origin/main"
          } catch {
            // Fallback if origin/main doesn't exist
          }
          try {
            const mergeBase = execSync(`git merge-base ${base} ${local_sha}`, {
              encoding: "utf8"
            }).trim()
            diffCmd = `git diff --name-only ${mergeBase} ${local_sha}`
          } catch {
            diffCmd = `git diff --name-only ${base} ${local_sha}`
          }
        } else {
          diffCmd = `git diff --name-only ${remote_sha} ${local_sha}`
        }

        try {
          const files = execSync(diffCmd, { encoding: "utf8" }).trim().split("\n").filter(Boolean)
          files.forEach((f) => filesSet.add(f))
        } catch (e) {
          console.error(`Error running diff: ${e}`)
        }
      }
      resolve(Array.from(filesSet))
    })
  })
}

async function run() {
  try {
    const files = await getChangedFiles()

    // Filter files by extension
    const checkExtensions = [".vue", ".ts", ".js", ".mjs", ".json", ".css", ".md", ".yml", ".yaml"]
    const filteredFiles = files.filter((f) => checkExtensions.some((ext) => f.endsWith(ext)))

    if (filteredFiles.length === 0) {
      console.log("No relevant files changed in this push. Skipping checks.")
      return
    }

    console.log(`🔍 Checking ${filteredFiles.length} changed files in this push...`)

    // 1. Run Prettier check
    console.log("✨ Running Prettier formatting check...")
    try {
      // Escape spaces in file paths for terminal command execution
      const escapedFiles = filteredFiles.map((f) => `"${f}"`).join(" ")
      execSync(`npx prettier --check ${escapedFiles}`, { stdio: "inherit" })
    } catch {
      console.error("❌ Prettier check failed! Please fix formatting before pushing.")
      process.exit(1)
    }

    // 2. Run ESLint check
    const eslintExtensions = [".vue", ".ts", ".js", ".mjs"]
    const eslintFiles = filteredFiles.filter((f) => eslintExtensions.some((ext) => f.endsWith(ext)))
    if (eslintFiles.length > 0) {
      console.log("🧹 Running ESLint check...")
      try {
        const escapedEslintFiles = eslintFiles.map((f) => `"${f}"`).join(" ")
        execSync(`npx eslint ${escapedEslintFiles}`, { stdio: "inherit" })
      } catch {
        console.error("❌ ESLint check failed! Please fix lint issues before pushing.")
        process.exit(1)
      }
    }

    // 3. Run Translate sync
    console.log("🌐 Running translation sync...")
    try {
      execSync("npm run translate", { stdio: "inherit" })
    } catch {
      console.error("❌ Translation sync failed!")
      process.exit(1)
    }

    console.log("✅ All checks passed successfully! Proceeding with push...")
  } catch (error) {
    console.error("💥 Pre-push check encountered an error:", error)
    process.exit(1)
  }
}

run()
