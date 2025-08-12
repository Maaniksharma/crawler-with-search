#!/usr/bin/env node

import { CrawlerEngine } from './src/CrawlerEngine.js';
import { setupDirectories } from './src/utils/fileSystem.js';

async function runTest() {
    console.log('🧪 Running crawler test...\n');
    
    try {
        const testUrl = 'https://example.com';
        const testDir = './test_pages';
        const maxDepth = 1;
        
        await setupDirectories(testDir);
        
        const crawler = new CrawlerEngine(testUrl, testDir, maxDepth);
        await crawler.start();
        
        console.log('\n✅ Test completed successfully!');
        
    } catch (error) {
        console.error(`❌ Test failed: ${error.message}`);
    }
}

runTest();