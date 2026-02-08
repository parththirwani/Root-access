'use client';

import { useState } from 'react';
import { Post } from '@/src/types';
import { MarkdownEditor } from '../post/MarkDownEditor';

interface PostEditModalProps {
  post: Post;
  onClose: () => void;
  onSave: () => void;
}

export function PostEditModal({ post, onClose, onSave }: PostEditModalProps) {
  const [formData, setFormData] = useState({
    title: post.title,
    description: post.description,
    content: post.content,
    excerpt: post.excerpt || '',
    coverImage: post.coverImage || '',
    published: post.published,
    tags: post.tags.map(t => t.name).join(', '),
    projectLink: post.projectLink || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get display style as string to avoid Prisma enum issues in client component
  const displayStyle = post.subsection.displayStyle as string;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const tags = formData.tags.split(',').map((t) => t.trim()).filter(Boolean);

      // Use the correct endpoint: /api/admin/subsections/{subsectionSlug}/posts/{postSlug}
      const response = await fetch(`/api/admin/subsections/${post.subsection.slug}/posts/${post.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          tags,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update post');
      }

      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  const getDisplayStyleInfo = (style: string) => {
    const info: Record<string, { emoji: string; label: string; desc: string }> = {
      'BLOG': { emoji: '📝', label: 'Blog Post', desc: 'Full article with content' },
      'PROJECT': { emoji: '🚀', label: 'Project', desc: 'Card with external link' },
      'TITLE_ONLY': { emoji: '📌', label: 'Title Only', desc: 'Simple title list' },
    };
    return info[style] || info['BLOG'];
  };

  const styleInfo = getDisplayStyleInfo(displayStyle);
  
  // Type-safe display style checks using string comparison
  // This works in client components without importing Prisma enums
  const isBlog = displayStyle === 'BLOG';
  const isProject = displayStyle === 'PROJECT';
  const isTitleOnly = displayStyle === 'TITLE_ONLY';

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-[#0a0a0a] border-b border-[#1a1a1a] p-4 sm:p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-xl sm:text-2xl text-white font-normal">Edit Post</h2>
            <p className="text-sm text-neutral-500 mt-1">
              {post.subsection.name} • {styleInfo.emoji} {styleInfo.label}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-950/50 border border-red-900/50 rounded-lg text-[13px] text-red-400">
              {error}
            </div>
          )}

          {/* Display Style Info */}
          <div className="mb-4 p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
            <div className="flex items-center gap-2 text-[13px]">
              <span className="text-lg">{styleInfo.emoji}</span>
              <div>
                <div className="text-white font-medium">{styleInfo.label}</div>
                <div className="text-[#707070]">{styleInfo.desc}</div>
              </div>
            </div>
          </div>

          {/* Title and Cover Image */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className={!isTitleOnly ? '' : 'sm:col-span-2'}>
              <label className="block text-[13px] font-medium text-[#e5e5e5] mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white text-[14px] focus:outline-none focus:border-white transition"
              />
            </div>

            {!isTitleOnly && (
              <div>
                <label className="block text-[13px] font-medium text-[#e5e5e5] mb-2">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white text-[14px] focus:outline-none focus:border-white transition"
                />
              </div>
            )}
          </div>

          {/* Description - Only for blog and project */}
          {!isTitleOnly && (
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-[#e5e5e5] mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                placeholder="A brief description"
                rows={2}
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white text-[14px] focus:outline-none focus:border-white transition resize-none"
              />
            </div>
          )}

          {/* Project Link (only for project style) */}
          {isProject && (
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-[#e5e5e5] mb-2">
                Project Link *
              </label>
              <input
                type="url"
                value={formData.projectLink}
                onChange={(e) => setFormData({ ...formData, projectLink: e.target.value })}
                required
                placeholder="https://project-url.com"
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white text-[14px] focus:outline-none focus:border-white transition"
              />
            </div>
          )}

          {/* Content (only for blog style) */}
          {isBlog && (
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-[#e5e5e5] mb-2">
                Content (Markdown) *
              </label>
              <MarkdownEditor
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
              />
            </div>
          )}

          {/* Excerpt (optional for blog and project) */}
          {!isTitleOnly && (
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-[#e5e5e5] mb-2">
                Excerpt (optional)
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <span className="text-[13px] text-[#e5e5e5]">Published</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sticky bottom-0 bg-[#0a0a0a] pt-4 border-t border-[#1a1a1a]">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-white text-[#0a0a0a] rounded-lg hover:opacity-90 transition text-[13px] font-medium disabled:opacity-50 touch-manipulation"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#2a2a2a] transition text-[13px] font-medium touch-manipulation"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}