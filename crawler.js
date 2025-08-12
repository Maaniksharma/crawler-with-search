#!/usr/bin/env node

import { CrawlerEngine } from './src/CrawlerEngine.js';
import { validateArgs } from './src/utils/validation.js';
import { setupDirectories } from './src/utils/fileSystem.js';

async function main() {
    try {
        // Parse and validate command line arguments
        const args = process.argv.slice(2);
        const { seedUrl, targetDirectory, maxDepth } = validateArgs(args);
        
        console.log(`🚀 Starting crawler with:`);
        console.log(`   URL: ${seedUrl}`);
        console.log(`   Target Directory: ${targetDirectory}`);
        console.log(`   Max Depth: ${maxDepth}`);
        console.log('');

        // Setup required directories
        await setupDirectories(targetDirectory);
        
        // Initialize and run crawler
        const crawler = new CrawlerEngine(seedUrl, targetDirectory, maxDepth);
        await crawler.start();
        
        console.log('\n✅ Crawling completed successfully!');
        console.log('\n📁 Output files:');
        console.log(`   - ${targetDirectory}/visited.txt - All URLs visited`);
        console.log(`   - ${targetDirectory}/keywordIndex.txt - Keyword mappings`);
        console.log(`   - ${targetDirectory}/pages/ - Downloaded HTML files`);
        
        console.log('\n🔍 To search for keywords, use:');
        console.log(`   node search.js [keyword]`);
        
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
}

// Handle uncaught errors
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error.message);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

main();