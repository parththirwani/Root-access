/**
 * Convert Markdown to HTML with Notion-style formatting
 * Supports: Headers, Bold, Italic, Links, Lists, Code blocks, Inline code, Blockquotes, Images
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown) return '';

  let html = markdown;

  // Escape HTML tags first to prevent XSS
  html = html.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Convert code blocks (must be before inline code)
  html = html.replace(/```([a-z]*)\n([\s\S]*?)```/gim, (match, lang, code) => {
    const language = lang || 'plaintext';
    return `<pre class="bg-[#1a1a1a] p-4 rounded-lg overflow-x-auto my-4"><code class="language-${language}">${code.trim()}</code></pre>`;
  });

  // Convert inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-[#1a1a1a] px-2 py-0.5 rounded text-sm">$1</code>');

  // Convert images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-lg my-4 max-w-full" />');

  // Convert links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-white underline hover:opacity-70 transition">$1</a>');

  // Convert headers (must check from h6 to h1 to avoid conflicts)
  html = html.replace(/^###### (.*$)/gim, '<h6 class="text-lg font-medium text-white mt-6 mb-3">$1</h6>');
  html = html.replace(/^##### (.*$)/gim, '<h5 class="text-xl font-medium text-white mt-6 mb-3">$1</h5>');
  html = html.replace(/^#### (.*$)/gim, '<h4 class="text-2xl font-medium text-white mt-8 mb-4">$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-3xl font-medium text-white mt-8 mb-4">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-4xl font-medium text-white mt-10 mb-4">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-5xl font-bold text-white mt-10 mb-6">$1</h1>');

  // Convert blockquotes
  html = html.replace(/^&gt; (.*$)/gim, '<blockquote class="border-l-4 border-[#2a2a2a] pl-4 my-4 text-[#e5e5e5] italic">$1</blockquote>');

  // Convert bold (must be before italic to avoid conflicts)
  html = html.replace(/\*\*\*([^\*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*([^\*]+)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');
  html = html.replace(/__([^_]+)__/g, '<strong class="font-semibold text-white">$1</strong>');

  // Convert italic
  html = html.replace(/\*([^\*]+)\*/g, '<em>$1</em>');
  html = html.replace(/_([^_]+)_/g, '<em>$1</em>');

  // Convert strikethrough
  html = html.replace(/~~([^~]+)~~/g, '<del class="line-through opacity-70">$1</del>');

  // Convert horizontal rules
  html = html.replace(/^---$/gim, '<hr class="my-8 border-t border-[#2a2a2a]" />');
  html = html.replace(/^\*\*\*$/gim, '<hr class="my-8 border-t border-[#2a2a2a]" />');

  // Convert unordered lists
  html = html.replace(/^\* (.*$)/gim, '<li class="ml-6 mb-2">$1</li>');
  html = html.replace(/^- (.*$)/gim, '<li class="ml-6 mb-2">$1</li>');
  html = html.replace(/^\+ (.*$)/gim, '<li class="ml-6 mb-2">$1</li>');

  // Convert ordered lists
  html = html.replace(/^\d+\. (.*$)/gim, '<li class="ml-6 mb-2 list-decimal">$1</li>');

  // Wrap consecutive list items in ul/ol tags
  html = html.replace(/(<li class="ml-6 mb-2 list-decimal">.*<\/li>\n?)+/g, '<ol class="my-4 list-decimal">$&</ol>');
  html = html.replace(/(<li class="ml-6 mb-2">.*<\/li>\n?)+/g, '<ul class="my-4 list-disc">$&</ul>');

  // Convert paragraphs (double line breaks)
  html = html.split('\n\n').map(para => {
    // Don't wrap if already in a block element
    if (para.match(/^<(h[1-6]|ul|ol|pre|blockquote|hr|img)/)) {
      return para;
    }
    // Don't wrap empty paragraphs
    if (para.trim() === '') {
      return '';
    }
    return `<p class="mb-4 leading-relaxed text-[#e5e5e5]">${para.trim()}</p>`;
  }).join('\n');

  // Convert single line breaks to <br>
  html = html.replace(/\n/g, '<br />');

  return html;
}

/**
 * Strip HTML tags and get plain text
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Generate excerpt from markdown content
 */
export function generateMarkdownExcerpt(markdown: string, maxLength: number = 160): string {
  const plainText = stripHtml(markdownToHtml(markdown))
    .replace(/\s+/g, ' ')
    .trim();
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  return plainText.substring(0, maxLength).trim() + '...';
}