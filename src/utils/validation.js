export function validateArgs(args) {
    if (args.length < 1) {
        throw new Error('Usage: ./crawler [SEED URL] [TARGET DIRECTORY] [MAX CRAWLING DEPTH]');
    }
    
    const seedUrl = args[0];
    const targetDirectory = args[1] || './pages';
    const maxDepth = parseInt(args[2]) || 2;
    
    // Validate URL format
    if (!isValidUrl(seedUrl)) {
        throw new Error('Invalid URL provided. Please provide a valid HTTP/HTTPS URL.');
    }
    
    // Validate depth
    if (maxDepth < 0 || maxDepth > 10) {
        throw new Error('Max depth must be between 0 and 10');
    }
    
    return { seedUrl, targetDirectory, maxDepth };
}

export function isValidUrl(string) {
    try {
        const url = new URL(string);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

export function isValidHtmlUrl(url) {
    // Skip common non-HTML file types
    const skipExtensions = [
        '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
        '.zip', '.rar', '.tar', '.gz', '.exe', '.dmg',
        '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp',
        '.mp3', '.mp4', '.avi', '.mov', '.wmv', '.flv',
        '.css', '.js', '.xml', '.json', '.txt'
    ];
    
    const lowerUrl = url.toLowerCase();
    return !skipExtensions.some(ext => lowerUrl.endsWith(ext));
}