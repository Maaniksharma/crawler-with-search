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
    let insideTag = false;
    let insideScript = false;
    let insideStyle = false;

    for (let i = 0; i < htmlContent.length; i++) {
      const char = htmlContent[i];
      const nextChars = htmlContent.substring(i, i + 8).toLowerCase();

      // Check for script/style tags
      if (nextChars.startsWith("<script")) {
        insideScript = true;
        insideTag = true;
      } else if (nextChars.startsWith("</script")) {
        insideScript = false;
        insideTag = true;
      } else if (nextChars.startsWith("<style")) {
        insideStyle = true;
        insideTag = true;
      } else if (nextChars.startsWith("</style")) {
        insideStyle = false;
        insideTag = true;
      } else if (char === "<") {
        insideTag = true;
      } else if (char === ">") {
        insideTag = false;
        continue;
      }

      // Only add content if not inside tags, scripts, or styles
      if (!insideTag && !insideScript && !insideStyle) {
        result += char;
      }
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
      if (word.length < 2 || this.stopWords.has(word)) {
        continue;
      }

      frequency.set(word, (frequency.get(word) || 0) + 1);
    }

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
