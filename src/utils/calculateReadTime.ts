export function calculateReadTime(content: string) {
  const wordsPerMinute = 100;

  const textContent = content
    .replace(/```[\s\S]*?```/g, " [COMPLEX_CODE_SECTION] ")
    .replace(/`[^`\n]+`/g, " [CODE] ")
    .replace(/<[^>]*>/g, "")
    .trim();

  const wordCount = textContent
    .split(/\s+/)
    .filter((word) => word.length > 0).length;

  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}
