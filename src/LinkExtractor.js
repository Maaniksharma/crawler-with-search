import { normalizeUrl, isValidHtmlUrl } from './utils/urlUtils.js';

export class LinkExtractor {
    extractLinks(htmlContent, baseUrl) {
        const links = [];
        const linkRegex = /<a[^>]+href\s*=\s*['"](.*?)['"][^>]*>/gi;
        let match;
        
        while ((match = linkRegex.exec(htmlContent)) !== null) {
            const href = match[1];
            
            // Skip empty hrefs, JavaScript, and fragment links
            if (!href || href.startsWith('javascript:') || href.startsWith('#') || href.startsWith('mailto:')) {
                continue;
            }
            
            try {
                // Normalize the URL
                const normalizedUrl = normalizeUrl(href, baseUrl);
                
                // Only include HTML URLs
                if (isValidHtmlUrl(normalizedUrl)) {
                    links.push(normalizedUrl);
                }
            } catch (error) {
                // Skip malformed URLs
                continue;
            }
        }
        
        // Remove duplicates
        return [...new Set(links)];
    }
}