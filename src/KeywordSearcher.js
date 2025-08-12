import { KeywordIndex } from './KeywordIndex.js';

export class KeywordSearcher {
    constructor(targetDirectory) {
        this.keywordIndex = new KeywordIndex(targetDirectory);
    }
    
    async search(keyword) {
        return this.keywordIndex.searchKeyword(keyword);
    }
}