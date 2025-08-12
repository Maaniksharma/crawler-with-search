import { URLDownloader } from './URLDownloader.js';
import { LinkExtractor } from './LinkExtractor.js';
import { KeywordExtractor } from './KeywordExtractor.js';
import { VisitedTracker } from './VisitedTracker.js';
import { KeywordIndex } from './KeywordIndex.js';
import { normalizeUrl } from './utils/urlUtils.js';
import { isValidHtmlUrl } from './utils/validation.js';

export class CrawlerEngine {
    constructor(seedUrl, targetDirectory, maxDepth) {
        this.seedUrl = seedUrl;
        this.targetDirectory = targetDirectory;
        this.maxDepth = maxDepth;
        this.maxLinks = 100; // Global limit to prevent infinite crawling
        this.crawledCount = 0;
        
        // Initialize components
        this.downloader = new URLDownloader(targetDirectory);
        this.linkExtractor = new LinkExtractor();
        this.keywordExtractor = new KeywordExtractor();
        this.visitedTracker = new VisitedTracker(targetDirectory);
        this.keywordIndex = new KeywordIndex(targetDirectory);
    }
    
    async start() {
        console.log('🔄 Initializing crawler...');
        
        // Start DFS crawling
        await this.crawl(this.seedUrl, 0);
        
        // Save final results
        await this.visitedTracker.save();
        await this.keywordIndex.save();
        
        console.log(`\n📊 Crawling Statistics:`);
        console.log(`   Pages crawled: ${this.crawledCount}`);
        console.log(`   Unique URLs visited: ${this.visitedTracker.getVisitedCount()}`);
    }
    
    async crawl(url, depth) {
        // Check limits
        if (depth > this.maxDepth || this.crawledCount >= this.maxLinks) {
            return;
        }
        
        // Normalize URL
        const normalizedUrl = normalizeUrl(url, this.seedUrl);
        
        // Check if already visited
        if (this.visitedTracker.isVisited(normalizedUrl)) {
            return;
        }
        
        // Skip non-HTML URLs
        if (!isValidHtmlUrl(normalizedUrl)) {
            return;
        }
        
        try {
            console.log(`${'  '.repeat(depth)}📄 Crawling (depth ${depth}): ${normalizedUrl}`);
            
            // Mark as visited before processing
            this.visitedTracker.addVisited(normalizedUrl);
            this.crawledCount++;
            
            // Download the page
            const htmlContent = await this.downloader.download(normalizedUrl);
            
            // Extract keywords from the page
            const keyword = this.keywordExtractor.extractTopKeyword(htmlContent);
            if (keyword) {
                this.keywordIndex.addKeyword(keyword, normalizedUrl);
                console.log(`${'  '.repeat(depth)}🔤 Keyword found: "${keyword}"`);
            }
            
            // Extract links for further crawling
            const links = this.linkExtractor.extractLinks(htmlContent, normalizedUrl);
            
            // Recursively crawl found links
            for (const link of links) {
                if (this.crawledCount < this.maxLinks) {
                    await this.crawl(link, depth + 1);
                }
            }
            
        } catch (error) {
            console.log(`${'  '.repeat(depth)}⚠️  Failed to crawl ${normalizedUrl}: ${error.message}`);
            // Continue crawling other URLs even if one fails
        }
    }
}