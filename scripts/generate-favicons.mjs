import { favicons } from "favicons"
import fs from "fs/promises"
import path from "path"

const source = "public/favicon.src.png" // Source image
const dest = "public/favicons" // Output directory

const configuration = {
  path: "/favicons/", // Path for icons in the manifest/html
  appName: "Aganov. Frontend Developer",
  appShortName: "Aganov",
  appDescription:
    "I’m frontend developer. I like to learn new technologies and try new things in every possible way.",
  developerName: "David Aganov",
  developerURL: "https://aganov.dev/",
  start_url: "https://aganov.dev/",
  background: "#3d294f",
  theme_color: "#3d294f",
  icons: {
    android: true,
    appleIcon: true,
    appleStartup: false,
    favicons: true,
    windows: true,
    yandex: false
  }
}

async function generate() {
  try {
    console.log(`Generating favicons from ${source}...`)

    // Ensure destination directory exists
    await fs.mkdir(dest, { recursive: true })

    // Check if source exists
    try {
      await fs.access(source)
    } catch (e) {
      console.error(
        `Error: Source file ${source} not found. Please place your master icon there.`,
        e
      )
      return
    }

    const response = await favicons(source, configuration)

    const KEEP_IMAGES = [
      "favicon.ico",
      "favicon-16x16.png",
      "favicon-32x32.png",
      "apple-touch-icon.png",
      "android-chrome-192x192.png",
      "android-chrome-512x512.png"
    ]

    // Write images
    for (const image of response.images) {
      if (KEEP_IMAGES.includes(image.name)) {
        await fs.writeFile(path.join(dest, image.name), image.contents)
        console.log(`Generated: ${image.name}`)
      }
    }

    // Write files (manifest, browserconfig)
    for (const file of response.files) {
      let fileName = file.name
      if (fileName === "manifest.webmanifest") fileName = "site.webmanifest"

      if (fileName === "site.webmanifest") {
        // Filter manifest icons to only keep 192 and 512
        const manifest = JSON.parse(file.contents)
        manifest.icons = manifest.icons.filter((icon) =>
          ["192x192", "512x512"].includes(icon.sizes)
        )
        await fs.writeFile(path.join(dest, fileName), JSON.stringify(manifest, null, 2))
        console.log(`Generated: ${fileName} (filtered)`)
      } else if (fileName === "browserconfig.xml") {
        // Skip browserconfig if we want to minimize
        continue
      } else {
        await fs.writeFile(path.join(dest, fileName), file.contents)
        console.log(`Generated: ${fileName}`)
      }
    }

    console.log("Favicons generated successfully! (Optimized set)")

    // Optional: Log HTML tags if user needs to update them
    // console.log('\nSuggested HTML tags:');
    // response.html.forEach(tag => console.log(tag));
  } catch (error) {
    console.error("Error generating favicons:", error)
  }
}

generate()
