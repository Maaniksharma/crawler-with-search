import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";

export class VisitedTracker {
  constructor(targetDirectory) {
    this.targetDirectory = targetDirectory;
    this.visitedFile = join(targetDirectory, "visited.txt");
    this.visited = new Set();

    // Load existing visited URLs if file exists
    this.load();
  }

  load() {
    try {
      if (existsSync(this.visitedFile)) {
        const content = readFileSync(this.visitedFile, "utf-8");
        const urls = content.split("\n").filter((url) => url.trim());
        urls.forEach((url) => this.visited.add(url));
      }
    } catch (error) {
      // File doesn't exist or can't be read, start fresh
    }
  }

  isVisited(url) {
    return this.visited.has(url);
  }

  addVisited(url) {
    this.visited.add(url);
  }

  getVisitedCount() {
    return this.visited.size;
  }

  async save() {
    const urlList = Array.from(this.visited).join("\n");
    writeFileSync(this.visitedFile, urlList, "utf-8");
  }
}
