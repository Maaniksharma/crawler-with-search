import { execSync } from "child_process";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import crypto from "crypto";

export class URLDownloader {
  constructor(targetDirectory) {
    this.targetDirectory = targetDirectory;
    this.pagesDir = join(targetDirectory, "pages");

    // Ensure pages directory exists
    if (!existsSync(this.pagesDir)) {
      mkdirSync(this.pagesDir, { recursive: true });
    }
  }

  async download(url) {
    try {
      // Create unique filename based on URL hash
      const urlHash = crypto.createHash("md5").update(url).digest("hex");
      const filename = `page_${urlHash}.html`;
      const filepath = join(this.pagesDir, filename);

      // Use wget to download the page
      const wgetCommand = `wget -q -O "${filepath}" --timeout=10 --tries=2 "${url}"`;

      try {
        execSync(wgetCommand, { stdio: "pipe" });
      } catch (wgetError) {
        // If wget fails, try with curl as fallback
        const curlCommand = `curl -s -L --max-time 10 "${url}" -o "${filepath}"`;
        execSync(curlCommand, { stdio: "pipe" });
      }

      // Read and return the downloaded content
      const fs = await import("fs");
      const content = fs.readFileSync(filepath, "utf-8");

      if (content.length === 0) {
        throw new Error("Downloaded content is empty");
      }

      return content;
    } catch (error) {
      throw new Error(`Failed to download ${url}: ${error.message}`);
    }
  }
}
