export function markdownToHtml(markdown: string): string {
  if (!markdown) return '';

  let html = markdown;

  // ── 1. Code blocks FIRST (protect their content from further processing) ──
  const codeBlocks: string[] = [];
  html = html.replace(/```([a-z]*)\n([\s\S]*?)```/gim, (match, lang, code) => {
    const language = lang || 'plaintext';
    const idx = codeBlocks.length;
    codeBlocks.push(
      `<pre class="bg-[#1a1a1a] p-4 rounded-lg overflow-x-auto my-6 text-sm"><code class="language-${language} text-neutral-300">${code.trim()}</code></pre>`
    );
    return `%%CODEBLOCK_${idx}%%`;
  });

  // ── 2. Inline code ──
  const inlineCodes: string[] = [];
  html = html.replace(/`([^`]+)`/g, (match, code) => {
    const idx = inlineCodes.length;
    inlineCodes.push(
      `<code class="bg-[#1a1a1a] px-2 py-0.5 rounded text-sm text-neutral-300">${code}</code>`
    );
    return `%%INLINECODE_${idx}%%`;
  });

  // ── 3. Images (BEFORE links so ![...](...) doesn't get confused) ──
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" class="rounded-lg my-6 max-w-full w-full h-auto" loading="lazy" />'
  );

  // ── 4. Links ──
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-white underline hover:opacity-70 transition">$1</a>'
  );

  // ── 5. Headers ──
  html = html.replace(/^###### (.*$)/gim, '<h6 class="text-base font-semibold text-white mt-6 mb-2">$1</h6>');
  html = html.replace(/^##### (.*$)/gim,  '<h5 class="text-lg font-semibold text-white mt-6 mb-2">$1</h5>');
  html = html.replace(/^#### (.*$)/gim,   '<h4 class="text-xl font-semibold text-white mt-8 mb-3">$1</h4>');
  html = html.replace(/^### (.*$)/gim,    '<h3 class="text-2xl font-semibold text-white mt-8 mb-3">$1</h3>');
  html = html.replace(/^## (.*$)/gim,     '<h2 class="text-3xl font-semibold text-white mt-10 mb-4">$1</h2>');
  html = html.replace(/^# (.*$)/gim,      '<h1 class="text-4xl font-bold text-white mt-10 mb-6">$1</h1>');

  // ── 6. Blockquotes ──
  html = html.replace(
    /^> (.*$)/gim,
    '<blockquote class="border-l-4 border-neutral-600 pl-4 my-4 text-neutral-400 italic">$1</blockquote>'
  );

  // ── 7. Bold / Italic / Strikethrough ──
  html = html.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*([^*]+)\*\*/g,     '<strong class="font-semibold text-white">$1</strong>');
  html = html.replace(/__([^_]+)__/g,          '<strong class="font-semibold text-white">$1</strong>');
  html = html.replace(/\*([^*\n]+)\*/g,        '<em class="italic">$1</em>');
  html = html.replace(/_([^_\n]+)_/g,          '<em class="italic">$1</em>');
  html = html.replace(/~~([^~]+)~~/g,          '<del class="line-through opacity-60">$1</del>');

  // ── 8. Horizontal rules ──
  html = html.replace(/^---$/gim, '<hr class="my-8 border-t border-[#2a2a2a]" />');
  html = html.replace(/^\*\*\*$/gim, '<hr class="my-8 border-t border-[#2a2a2a]" />');

  // ── 9. Lists ──
  // Ordered
  html = html.replace(/^(\d+)\. (.*$)/gim, '<li class="ml-6 mb-1 list-decimal">$2</li>');
  html = html.replace(/(<li class="ml-6 mb-1 list-decimal">[\s\S]*?<\/li>(\n|$))+/g,
    '<ol class="my-4 list-decimal space-y-1 text-neutral-300">$&</ol>');

  // Unordered
  html = html.replace(/^[*\-+] (.*$)/gim, '<li class="ml-6 mb-1 list-disc">$1</li>');
  html = html.replace(/(<li class="ml-6 mb-1 list-disc">[\s\S]*?<\/li>(\n|$))+/g,
    '<ul class="my-4 list-disc space-y-1 text-neutral-300">$&</ul>');

  // ── 10. Tables (NEW) ──
  html = html.replace(/^\|(.+)\|$/gim, (match) => {
    const cells = match.split('|').filter(c => c.trim() !== '');
    return '<tr>' + cells.map(c => `<td class="border border-[#2a2a2a] px-4 py-2 text-neutral-300">${c.trim()}</td>`).join('') + '</tr>';
  });
  // Mark header row (first tr becomes thead)
  html = html.replace(
    /(<tr>.*?<\/tr>)\n<tr>(<td[^>]*>-+<\/td>)+<\/tr>\n(<tr>[\s\S]*?<\/tr>)/g,
    '<thead class="bg-[#1a1a1a]">$1</thead><tbody>$3</tbody>'
  );
  html = html.replace(
    /(<thead[\s\S]*?<\/thead>[\s\S]*?(?:<tbody>[\s\S]*?<\/tbody>))/g,
    '<div class="overflow-x-auto my-6"><table class="w-full border-collapse border border-[#2a2a2a] text-sm">$1</table></div>'
  );

  // ── 11. Paragraphs ──
  const blocks = html.split(/\n{2,}/);
  html = blocks.map(block => {
    block = block.trim();
    if (!block) return '';
    // Don't wrap block-level elements
    if (/^<(h[1-6]|ul|ol|pre|blockquote|hr|img|div|table|thead|tbody|tr)/.test(block)) {
      return block;
    }
    if (block.startsWith('%%CODEBLOCK') || block.startsWith('%%INLINECODE')) {
      return block;
    }
    return `<p class="mb-4 leading-relaxed text-neutral-300">${block.replace(/\n/g, '<br />')}</p>`;
  }).join('\n');

  // ── 12. Restore protected blocks ──
  inlineCodes.forEach((code, i) => {
    html = html.replace(`%%INLINECODE_${i}%%`, code);
  });
  codeBlocks.forEach((block, i) => {
    html = html.replace(`%%CODEBLOCK_${i}%%`, block);
  });

  return html;
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export function generateMarkdownExcerpt(markdown: string, maxLength: number = 160): string {
  // Remove images, code blocks, headers first
  const clean = markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/^#{1,6} /gm, '')
    .replace(/\*\*|__|~~|\*/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim();

  const plainText = clean.replace(/\s+/g, ' ').trim();
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength).trim() + '...';
}