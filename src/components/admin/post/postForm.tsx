import { useState } from 'react';
import { DisplayStyle } from '@/src/types';
import { MarkdownEditor } from '../post/MarkDownEditor';

interface PostFormData {
  title: string;
  description: string;
  content: string;
  excerpt: string;
  coverImage: string;
  published: boolean;
  tags: string;
  displayStyle: DisplayStyle;
  projectLink: string;
}

interface PostFormProps {
  formData: PostFormData;
  onChange: (data: PostFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  subsections: Array<{ id: string; slug: string; name: string; icon: string }>;
  selectedSubsection: string;
  onSubsectionChange: (slug: string) => void;
  error?: string;
}

export function PostForm({
  formData,
  onChange,
  onSubmit,
  onCancel,
  subsections,
  selectedSubsection,
  onSubsectionChange,
  error
}: PostFormProps) {
  return (
    <form onSubmit={onSubmit} className="bg-[#101010] p-6 rounded-xl border border-[#1a1a1a] mb-6">
      {error && (
        <div className="mb-4 p-3 bg-red-950/50 border border-red-900/50 rounded-lg text-[13px] text-red-400">
          {error}
        </div>
      )}

      {/* Subsection Selector */}
      <div className="mb-4">
        <label className="block text-[13px] font-medium text-[#e5e5e5] mb-2">Subsection *</label>
        <select
          value={selectedSubsection}
          onChange={(e) => onSubsectionChange(e.target.value)}
          required
          className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white text-[14px] focus:outline-none focus:border-white transition"
        >
          <option value="">Select a subsection</option>
          {subsections.map((sub) => (
            <option key={sub.id} value={sub.slug}>
              {sub.icon} {sub.name}
            </option>
          ))}
        </select>
      </div>

      {/* Display Style Selector */}
      <div className="mb-4">
        <label className="block text-[13px] font-medium text-[#e5e5e5] mb-2">Display Style *</label>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => onChange({ ...formData, displayStyle: 'blog' })}
            className={`p-4 rounded-lg border-2 transition ${
              formData.displayStyle === 'blog'
                ? 'border-white bg-[#1a1a1a]'
                : 'border-[#2a2a2a] bg-[#0a0a0a] hover:border-[#3a3a3a]'
            }`}
          >
            <div className="text-left">
              <div className="text-[14px] font-medium text-white mb-1">📝 Blog</div>
              <div className="text-[11px] text-[#707070]">Full article with content</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onChange({ ...formData, displayStyle: 'project' })}
            className={`p-4 rounded-lg border-2 transition ${
              formData.displayStyle === 'project'
                ? 'border-white bg-[#1a1a1a]'
                : 'border-[#2a2a2a] bg-[#0a0a0a] hover:border-[#3a3a3a]'
            }`}
          >
            <div className="text-left">
              <div className="text-[14px] font-medium text-white mb-1">🚀 Project</div>
              <div className="text-[11px] text-[#707070]">Card with external link</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onChange({ ...formData, displayStyle: 'title_only' })}
            className={`p-4 rounded-lg border-2 transition ${
              formData.displayStyle === 'title_only'
                ? 'border-white bg-[#1a1a1a]'
                : 'border-[#2a2a2a] bg-[#0a0a0a] hover:border-[#3a3a3a]'
            }`}
          >
            <div className="text-left">
              <div className="text-[14px] font-medium text-white mb-1">📌 Title Only</div>
              <div className="text-[11px] text-[#707070]">Just title and tags</div>
            </div>
          </button>
        </div>
      </div>

      {/* Title and Cover Image */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-[13px] font-medium text-[#e5e5e5] mb-2">Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => onChange({ ...formData, title: e.target.value })}
            required
            placeholder="Your Post Title"
            className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white text-[14px] focus:outline-none focus:border-white transition"
          />
        </div>

        {formData.displayStyle === 'blog' && (
          <div>
            <label className="block text-[13px] font-medium text-[#e5e5e5] mb-2">Cover Image URL</label>
            <input
              type="url"
              value={formData.coverImage}
              onChange={(e) => onChange({ ...formData, coverImage: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white text-[14px] focus:outline-none focus:border-white transition"
            />
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-[13px] font-medium text-[#e5e5e5] mb-2">Description *</label>
        <textarea
          value={formData.description}
          onChange={(e) => onChange({ ...formData, description: e.target.value })}
          required
          placeholder="A brief description"
          rows={2}
          className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white text-[14px] focus:outline-none focus:border-white transition resize-none"
        />
      </div>

      {/* Project Link (only for project style) */}
      {formData.displayStyle === 'project' && (
        <div className="mb-4">
          <label className="block text-[13px] font-medium text-[#e5e5e5] mb-2">Project Link *</label>
          <input
            type="url"
            value={formData.projectLink}
            onChange={(e) => onChange({ ...formData, projectLink: e.target.value })}
            required
            placeholder="https://project-url.com"
            className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white text-[14px] focus:outline-none focus:border-white transition"
          />
        </div>
      )}

      {/* Content (only for blog styles) */}
      {formData.displayStyle === 'blog' && (
        <div className="mb-4">
          <label className="block text-[13px] font-medium text-[#e5e5e5] mb-2">
            Content (Markdown) *
          </label>
          <MarkdownEditor
            value={formData.content}
            onChange={(value) => onChange({ ...formData, content: value })}
          />
        </div>
      )}

      {/* Excerpt */}
      {formData.displayStyle !== 'title_only' && (
        <div className="mb-4">
          <label className="block text-[13px] font-medium text-[#e5e5e5] mb-2">Excerpt (optional)</label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => onChange({ ...formData, excerpt: e.target.value })}
            rows={2}
            placeholder="Auto-generated if left empty"
            className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white text-[14px] focus:outline-none focus:border-white transition resize-none"
          />
        </div>
      )}

      {/* Tags */}
      <div className="mb-4">
        <label className="block text-[13px] font-medium text-[#e5e5e5] mb-2">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => onChange({ ...formData, tags: e.target.value })}
          placeholder="AI, Memory, Claude"
          className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white text-[14px] focus:outline-none focus:border-white transition"
        />
      </div>

      {/* Publish Checkbox */}
      <div className="mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.published}
            onChange={(e) => onChange({ ...formData, published: e.target.checked })}
            className="w-4 h-4 rounded"
          />
          <span className="text-[13px] text-[#e5e5e5]">Publish immediately</span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="submit"
          className="px-4 py-2 bg-white text-[#0a0a0a] rounded-lg hover:opacity-90 transition text-[13px] font-medium"
        >
          Create Post
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#2a2a2a] transition text-[13px] font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}