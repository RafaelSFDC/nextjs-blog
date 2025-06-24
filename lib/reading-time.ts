/**
 * Calculate reading time for text content
 * Based on average reading speed of 200-250 words per minute
 */

interface ReadingTimeResult {
  text: string
  minutes: number
  time: number
  words: number
}

export function calculateReadingTime(
  content: string,
  wordsPerMinute: number = 225
): ReadingTimeResult {
  // Remove HTML tags and get plain text
  const plainText = content.replace(/<[^>]*>/g, '')
  
  // Count words (split by whitespace and filter empty strings)
  const words = plainText.trim().split(/\s+/).filter(word => word.length > 0)
  const wordCount = words.length
  
  // Calculate reading time in minutes
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  
  // Generate human-readable text
  const text = minutes === 1 ? '1 min de leitura' : `${minutes} min de leitura`
  
  return {
    text,
    minutes,
    time: minutes * 60 * 1000, // in milliseconds
    words: wordCount
  }
}

/**
 * Format reading time for display
 */
export function formatReadingTime(minutes: number): string {
  if (minutes < 1) {
    return 'Menos de 1 min'
  } else if (minutes === 1) {
    return '1 min de leitura'
  } else {
    return `${minutes} min de leitura`
  }
}

/**
 * Get reading time from post content
 */
export function getPostReadingTime(content: string): ReadingTimeResult {
  return calculateReadingTime(content)
}

/**
 * Estimate reading time based on content length
 * Useful for when you don't have the full content
 */
export function estimateReadingTime(contentLength: number): number {
  // Assume average word length of 5 characters + 1 space
  const estimatedWords = Math.ceil(contentLength / 6)
  return Math.ceil(estimatedWords / 225)
}
