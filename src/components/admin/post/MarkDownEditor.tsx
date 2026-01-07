// src/components/admin/post/MarkdownEditor.tsx
'use client';

import { useState } from 'react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  // Convert markdown to HTML for preview
  const renderMarkdown = (md: string) => {
    // Basic markdown parsing - you can enhance this
    let html = md
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-blue-400 underline">$1</a>')
      // Lists
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      // Code blocks
      .replace(/```([\s\S]*?)```/gim, '<pre class="bg-[#1a1a1a] p-4 rounded-lg overflow-x-auto"><code>$1</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/gim, '<code class="bg-[#1a1a1a] px-2 py-1 rounded text-sm">$1</code>')
      // Line breaks
      .replace(/\n$/gim, '<br />');

    return html;
  };

  return (
    <div className="border border-[#2a2a2a] rounded-lg overflow-hidden bg-[#0a0a0a]">
      {/* Tabs */}
      <div className="flex border-b border-[#2a2a2a] bg-[#0a0a0a]">
        <button
          type="button"
          onClick={() => setActiveTab('write')}
          className={`px-4 py-2 text-sm font-medium transition ${
            activeTab === 'write'
              ? 'text-white border-b-2 border-white'
              : 'text-[#707070] hover:text-white'
          }`}
        >
          Write
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2 text-sm font-medium transition ${
            activeTab === 'preview'
              ? 'text-white border-b-2 border-white'
              : 'text-[#707070] hover:text-white'
          }`}
        >
          Preview
        </button>
      </div>

      {/* Content */}
      <div className="min-h-100">
        {activeTab === 'write' ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || 'Write your content in Markdown...'}
            className="w-full h-full min-h-100 px-4 py-3 bg-[#0a0a0a] text-white text-[14px] font-mono leading-relaxed focus:outline-none resize-none"
          />
        ) : (
          <div
            className="px-4 py-3 min-h-100 prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
          />
        )}
      </div>

      {/* Markdown Guide */}
      {activeTab === 'write' && (
        <div className="border-t border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2">
          <details className="text-xs text-[#707070]">
            <summary className="cursor-pointer hover:text-white transition">
              Markdown Guide
            </summary>
            <div className="mt-2 space-y-1 font-mono">
              <div># Heading 1</div>
              <div>## Heading 2</div>
              <div>### Heading 3</div>
              <div>**bold** or *italic*</div>
              <div>[link text](url)</div>
              <div>`inline code`</div>
              <div>```code block```</div>
              <div>- list item</div>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}