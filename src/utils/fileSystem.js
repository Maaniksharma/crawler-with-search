import { existsSync, mkdirSync } from 'fs';

export async function setupDirectories(targetDirectory) {
    try {
        // Create target directory if it doesn't exist
        if (!existsSync(targetDirectory)) {
            mkdirSync(targetDirectory, { recursive: true });
            console.log(`📁 Created target directory: ${targetDirectory}`);
        } else {
            console.log(`📁 Using existing directory: ${targetDirectory}`);
        }
        
        return true;
    } catch (error) {
        throw new Error(`Failed to setup directories: ${error.message}`);
    }
}