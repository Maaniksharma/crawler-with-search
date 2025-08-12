import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

export class KeywordIndex {
    constructor(targetDirectory) {
        this.targetDirectory = targetDirectory;
        this.indexFile = join(targetDirectory, 'keywordIndex.txt');
        this.index = new Map();
        
        // Load existing index if file exists
        this.load();
    }
    
    load() {
        try {
            if (existsSync(this.indexFile)) {
                const content = readFileSync(this.indexFile, 'utf-8');
                const lines = content.split('\n').filter(line => line.trim());
                
                for (const line of lines) {
                    const [keyword, ...urls] = line.split(' -> ');
                    if (keyword && urls.length > 0) {
                        const urlList = urls.join(' -> ').split(', ');
                        this.index.set(keyword.toLowerCase(), new Set(urlList));
                    }
                }
            }
        } catch (error) {
            // File doesn't exist or can't be read, start fresh
        }
    }
    
    addKeyword(keyword, url) {
        const lowerKeyword = keyword.toLowerCase();
        
        if (!this.index.has(lowerKeyword)) {
            this.index.set(lowerKeyword, new Set());
        }
        
        this.index.get(lowerKeyword).add(url);
    }
    
    searchKeyword(keyword) {
        const lowerKeyword = keyword.toLowerCase();
        const urls = this.index.get(lowerKeyword);
        return urls ? Array.from(urls) : [];
    }
    
    async save() {
        const indexLines = [];
        
        for (const [keyword, urls] of this.index.entries()) {
            const urlList = Array.from(urls).sort().join(', ');
            indexLines.push(`${keyword} -> ${urlList}`);
        }
        
        indexLines.sort();
        const content = indexLines.join('\n');
        writeFileSync(this.indexFile, content, 'utf-8');
    }
}