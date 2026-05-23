import { execFileSync, execSync } from "child_process"
import readline from "readline"

interface PushRef {
  localSha: string
  remoteSha: string
}

const NULL_SHA = "0000000000000000000000000000000000000000"

const CHECKED_EXTENSIONS = [".vue", ".ts", ".js", ".mjs", ".json", ".css", ".md", ".yml", ".yaml"]
const LINTED_EXTENSIONS = [".vue", ".ts", ".js", ".mjs"]

const gitExec = (...args: string[]): string =>
  execFileSync("git", args, { encoding: "utf8" }).trim()

const resolveBase = (): string => {
  try {
    gitExec("rev-parse", "--verify", "origin/main")
    return "origin/main"
  } catch {
    return "main"
  }
}

const diffFiles = (from: string, to: string): string[] => {
  return gitExec("diff", "--name-only", from, to).split("\n").filter(Boolean)
}

const changedFilesForRef = (ref: PushRef): string[] => {
  const { localSha, remoteSha } = ref
  if (localSha === NULL_SHA) return []

  if (remoteSha === NULL_SHA) {
    const base = resolveBase()
    try {
      const mergeBase = gitExec("merge-base", base, localSha)
      return diffFiles(mergeBase, localSha)
    } catch {
      return diffFiles(base, localSha)
    }
  }

  return diffFiles(remoteSha, localSha)
}

const readPushRefs = async (): Promise<PushRef[]> => {
  if (process.stdin.isTTY) return Promise.resolve([])

  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, terminal: false })
    const refs: PushRef[] = []

    rl.on("line", (line) => {
      const parts = line.trim().split(" ")
      if (parts.length < 4) return
      const [, localSha, , remoteSha] = parts
      refs.push({ localSha, remoteSha })
    })

    rl.on("close", () => resolve(refs))
  })
}

const resolveChangedFiles = async (): Promise<string[]> => {
  const refs = await readPushRefs()

  if (refs.length === 0) {
    console.log("No stdin refs received. Falling back to git diff against upstream...")
    try {
      return diffFiles("@{u}", "HEAD")
    } catch {
      return diffFiles(resolveBase(), "HEAD")
    }
  }

  const filesSet = new Set<string>()

  for (const ref of refs) {
    for (const file of changedFilesForRef(ref)) {
      filesSet.add(file)
    }
  }

  return Array.from(filesSet)
}

const runPrettier = (files: string[]): void => {
  console.log("✨ Running Prettier check...")
  try {
    execFileSync("npx", ["prettier", "--check", ...files], { stdio: "inherit", shell: true })
  } catch {
    console.error("❌ Prettier failed. Fix formatting before pushing.")
    process.exit(1)
  }
}

const runEslint = (files: string[]): void => {
  const targets = files.filter((f) => LINTED_EXTENSIONS.some((ext) => f.endsWith(ext)))
  if (targets.length === 0) return

  console.log("🧹 Running ESLint...")
  try {
    execFileSync("npx", ["eslint", ...targets], { stdio: "inherit", shell: true })
  } catch {
    console.error("❌ ESLint failed. Fix lint issues before pushing.")
    process.exit(1)
  }
}

const runTranslateSync = (): void => {
  console.log("🌐 Running translation sync...")
  try {
    execSync("npm run translate", { stdio: "inherit" })
  } catch {
    console.error("❌ Translation sync failed.")
    process.exit(1)
  }
}

const main = async (): Promise<void> => {
  try {
    const allFiles = await resolveChangedFiles()
    const files = allFiles.filter((f) => CHECKED_EXTENSIONS.some((ext) => f.endsWith(ext)))

    if (files.length === 0) {
      console.log("No relevant files changed. Skipping checks.")
      return
    }

    console.log(`🔍 Checking ${files.length} changed file(s)...`)

    runPrettier(files)
    runEslint(files)
    runTranslateSync()

    console.log("✅ All checks passed. Proceeding with push...")
  } catch (error) {
    console.error("💥 Pre-push hook error:", error)
    process.exit(1)
  }
}

main()
