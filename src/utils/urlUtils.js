export function normalizeUrl(url, baseUrl) {
    try {
        // Handle absolute URLs
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        
        const base = new URL(baseUrl);
        
        // Handle root-relative URLs
        if (url.startsWith('/')) {
            return `${base.protocol}//${base.host}${url}`;
        }
        
        // Handle relative URLs
        if (url.startsWith('./')) {
            url = url.substring(2);
        }
        
        // Handle parent directory URLs
        if (url.startsWith('../')) {
            const pathParts = base.pathname.split('/').filter(part => part);
            while (url.startsWith('../')) {
                pathParts.pop();
                url = url.substring(3);
            }
            const newPath = pathParts.length > 0 ? '/' + pathParts.join('/') + '/' : '/';
            return `${base.protocol}//${base.host}${newPath}${url}`;
        }
        
        // Handle same-directory relative URLs
        const basePath = base.pathname.endsWith('/') ? base.pathname : base.pathname.substring(0, base.pathname.lastIndexOf('/') + 1);
        return `${base.protocol}//${base.host}${basePath}${url}`;
        
    } catch (error) {
        throw new Error(`Failed to normalize URL: ${url}`);
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