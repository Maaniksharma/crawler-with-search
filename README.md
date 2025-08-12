# Web Crawler Application

A comprehensive web crawler built in Node.js that downloads web pages, extracts keywords, and provides search functionality.

## Features

- 🕷️ **DFS Web Crawling** - Recursive depth-first search crawling
- 📄 **HTML Download** - Uses wget/curl to download web pages
- 🔗 **Link Extraction** - Extracts and normalizes URLs from HTML content
- 🚫 **Duplicate Prevention** - Tracks visited URLs to prevent re-crawling
- 🔤 **Keyword Extraction** - Analyzes content to find the most frequent keywords
- 🔍 **Search Functionality** - Search pages by keywords
- 📁 **Organized Storage** - Saves downloaded pages and creates indexes

## Installation

Make sure you have Node.js installed and wget or curl available on your system.

```bash
# Make the crawler executable
chmod +x crawler.js
chmod +x search.js
```

## Usage

### Start Crawling

```bash
# Basic usage
./crawler [SEED_URL] [TARGET_DIRECTORY] [MAX_DEPTH]

# Examples
./crawler https://example.com ./pages 2
./crawler https://news.ycombinator.com ./crawl_data 1
node crawler.js https://example.com
```

### Search Keywords

```bash
# Search for pages containing specific keywords
node search.js login
node search.js technology
node search.js contact
```

## Command Line Arguments

- **SEED_URL** (required): The starting URL for crawling
- **TARGET_DIRECTORY** (optional): Directory to save results (default: ./pages)
- **MAX_DEPTH** (optional): Maximum crawling depth (default: 2, max: 10)

## Output Files

The crawler generates the following files in your target directory:

- **`visited.txt`** - List of all URLs that were visited
- **`keywordIndex.txt`** - Mapping of keywords to URLs containing them
- **`pages/`** - Directory containing downloaded HTML files

## How It Works

1. **URL Validation** - Validates the seed URL and parameters
2. **Directory Setup** - Creates necessary directories for storage
3. **DFS Crawling** - Recursively crawls pages using depth-first search
4. **Link Extraction** - Uses regex to extract `<a href="...">` links from HTML
5. **URL Normalization** - Handles relative URLs (`./, ../, /path`)
6. **Content Analysis** - Strips HTML tags and analyzes word frequency
7. **Keyword Extraction** - Finds most frequent non-stop words
8. **Indexing** - Creates searchable keyword index

## Features in Detail

### Smart URL Filtering
- Skips non-HTML files (PDFs, images, CSS, JS)
- Handles JavaScript links and fragments
- Normalizes relative and absolute URLs

### Keyword Extraction
- Strips HTML tags using state machine parsing
- Filters out stop words (common words like "the", "and", etc.)
- Counts word frequencies to find meaningful keywords
- Ignores script and style tag content

### Error Handling
- Continues crawling even if individual pages fail
- Handles broken HTML and unreachable links
- Provides clear error messages and logging

### Memory Optimization
- Uses HashSet for O(1) duplicate checking
- Limits total crawled pages to prevent infinite crawling
- Efficient string processing for large HTML files

## Example Demo

```bash
# Crawl example.com
./crawler https://example.com

# Search results will show:
# 📁 Output files:
#    - ./pages/visited.txt - All URLs visited
#    - ./pages/keywordIndex.txt - Keyword mappings
#    - ./pages/pages/ - Downloaded HTML files

# Search for keyword "login"
node search.js login
# 🔍 Search results for "login":
# 1. https://example.com/login
# 2. https://example.com/user/signin
```

## Technical Implementation

- **No External Dependencies** - Pure Node.js implementation
- **Manual HTML Parsing** - Custom HTML tag stripping without libraries
- **String-based Link Extraction** - Uses regex for `<a href="">` extraction
- **File-based Storage** - Persistent storage using filesystem
- **Cross-platform** - Works on Windows, macOS, and Linux

## Error Handling

The crawler handles various edge cases:
- Invalid URLs
- Network timeouts
- Broken HTML structure
- Missing permissions
- Disk space issues
- Malformed relative URLs

## Limitations

- Maximum crawling depth: 10 levels
- Maximum pages per crawl: 100 (configurable)
- Requires wget or curl for downloading
- Text-based analysis only (no image/video processing)

## Contributing

This is a demonstration project showing web crawling concepts including:
- DFS traversal algorithms
- HTML parsing techniques
- URL normalization
- Keyword extraction
- Search indexing