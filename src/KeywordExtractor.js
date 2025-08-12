import { getStopWords } from "./utils/stopWords.js";

export class KeywordExtractor {
  constructor() {
    this.stopWords = getStopWords();
  }

  extractTopKeyword(htmlContent) {
    // Strip HTML tags using state machine approach
    const textContent = this.stripHtmlTags(htmlContent);

    // Tokenize words
    const words = this.tokenizeWords(textContent);

    // Count word frequencies
    const wordFrequency = this.countWordFrequencies(words);

    // Find the most frequent non-stop word
    return this.findTopKeyword(wordFrequency);
  }

  stripHtmlTags(htmlContent) {
    let result = "";
    let i = 0;
    const lowerContent = htmlContent.toLowerCase();

    while (i < htmlContent.length) {
      // Detect <script> block
      if (lowerContent.startsWith("<script", i)) {
        const endIdx = lowerContent.indexOf("</script>", i);
        if (endIdx === -1) break; // malformed HTML
        i = endIdx + "</script>".length;
        result += " "; // Add space for separation
        continue;
      }

      // Detect <style> block
      if (lowerContent.startsWith("<style", i)) {
        const endIdx = lowerContent.indexOf("</style>", i);
        if (endIdx === -1) break;
        i = endIdx + "</style>".length;
        result += " "; // Add space for separation
        continue;
      }

      // Skip normal HTML tags
      if (htmlContent[i] === "<") {
        const endTag = htmlContent.indexOf(">", i);
        if (endTag === -1) break;
        i = endTag + 1;
        result += " "; // Add space for separation
        continue;
      }

      // Add visible text
      result += htmlContent[i];
      i++;
    }

    return result;
  }

  tokenizeWords(text) {
    // Convert to lowercase and extract words (alphanumeric characters only)
    const words = text.toLowerCase().match(/[a-z0-9]+/g);
    return words || [];
  }

  countWordFrequencies(words) {
    const frequency = new Map();

    for (const word of words) {
      // Skip short words and stop words
      if (word.length < 2 || this.stopWords.has(word) || !isNaN(Number(word))) {
        continue;
      }

      frequency.set(word, (frequency.get(word) || 0) + 1);
    }
    console.log(frequency);

    return frequency;
  }

  findTopKeyword(wordFrequency) {
    let topWord = null;
    let topCount = 0;

    for (const [word, count] of wordFrequency.entries()) {
      if (count > topCount) {
        topCount = count;
        topWord = word;
      }
    }

    return topWord;
  }
}
