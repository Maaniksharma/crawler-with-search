#!/usr/bin/env node

import { KeywordSearcher } from './src/KeywordSearcher.js';

async function main() {
    const keyword = process.argv[2];
    
    if (!keyword) {
        console.error('❌ Usage: node search.js [keyword]');
        process.exit(1);
    }
    
    try {
        const searcher = new KeywordSearcher('./pages');
        const results = await searcher.search(keyword);
        
        console.log(`🔍 Search results for "${keyword}":`);
        console.log('');
        
        if (results.length === 0) {
            console.log('No pages found containing this keyword.');
        } else {
            results.forEach((url, index) => {
                console.log(`${index + 1}. ${url}`);
            });
        }
        
    } catch (error) {
        console.error(`❌ Search error: ${error.message}`);
        process.exit(1);
    }
}

main();