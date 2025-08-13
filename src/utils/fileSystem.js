import { existsSync, mkdirSync, rmdirSync } from "fs";

export async function setupDirectories(targetDirectory) {
  try {
    // Create target directory if it doesn't exist
    if (!existsSync(targetDirectory)) {
      mkdirSync(targetDirectory, { recursive: true });
      console.log(`📁 Created target directory: ${targetDirectory}`);
    } else {
      rmdirSync(targetDirectory, { recursive: true });
      mkdirSync(targetDirectory, { recursive: true });
      console.log(
        `📁 Cleared and recreated target directory: ${targetDirectory}`
      );
    }

    return true;
  } catch (error) {
    throw new Error(`Failed to setup directories: ${error.message}`);
  }
}
