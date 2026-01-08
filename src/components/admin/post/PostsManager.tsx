'use client';

import { adminApi } from '@/src/lib/api';
import { Post, TopCategory, DisplayStyle } from '@/src/types';
import { useEffect, useState } from 'react';
import { MarkdownEditor } from './MarkDownEditor';

export function PostsManager() {
  const [sections, setSections] = useState<TopCategory[]>([]);
  const [selectedSubsection, setSelectedSubsection] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    excerpt: '',
    coverImage: '',
    published: false,
    tags: '',
    displayStyle: 'blog' as DisplayStyle,
    projectLink: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSections();
  }, []);

  useEffect(() => {
    if (selectedSubsection) {
      const filtered = allPosts.filter(p => p.subsection.slug === selectedSubsection);
      setPosts(filtered);
    } else {
      setPosts(allPosts);
    }
  }, [selectedSubsection, allPosts]);

  const fetchSections = async () => {
    try {
      const res = await adminApi.getSections() as { sections: TopCategory[] };
      setSections(res.sections);
      
      const allSubsections = res.sections.flatMap((s) => s.subsections || []);
      const postsPromises = allSubsections.map(sub => 
        adminApi.getPosts(sub.slug).catch(() => ({ posts: [] }))
      );
      
      const postsResults = await Promise.all(postsPromises);
      const allPostsArray = postsResults.flatMap((r: any) => r.posts || []);
      setAllPosts(allPostsArray);
      setPosts(allPostsArray);
    } catch (error) {
      console.error('Failed to fetch sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedSubsection) {
      setError('Please select a subsection');
      return;
    }

    // Validate project link if display style is project
    if (formData.displayStyle === 'project' && !formData.projectLink) {
      setError('Project link is required for project display style');
      return;
    }

    try {
      const tags = formData.tags.split(',').map((t) => t.trim()).filter(Boolean);
      await adminApi.createPost(selectedSubsection, { ...formData, tags });
      
      setFormData({
        title: '',
        description: '',
        content: '',
        excerpt: '',
        coverImage: '',
        published: false,
        tags: '',
        displayStyle: 'blog',
        projectLink: '',
      });
      setShowForm(false);
      fetchSections();
    } catch (err: any) {
      setError(err.message || 'Failed to create post');
    }
  };

  const handleTogglePublish = async (post: Post) => {
    try {
      await adminApi.togglePublish(
        post.subsection.slug,
        post.slug,
        !post.published
      );
      fetchSections();
    } catch (err: any) {
      alert(err.message || 'Failed to update post');
    }
  };

  const handleDelete = async (post: Post) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await adminApi.deletePost(post.subsection.slug, post.slug);
      fetchSections();
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  const getDisplayStyleBadge = (style: DisplayStyle) => {
    const styles = {
      blog: { bg: 'bg-blue-950/50', text: 'text-blue-400', label: 'Blog' },
      project: { bg: 'bg-purple-950/50', text: 'text-purple-400', label: 'Project' },
      'title-only': { bg: 'bg-gray-950/50', text: 'text-gray-400', label: 'Title Only' },
    };
    const s = styles[style];
    return (
      <span className={`px-2 py-0.5 rounded text-[11px] ${s.bg} ${s.text}`}>
        {s.label}
      </span>
    );
  };

  const allSubsections = sections.flatMap((s) => s.subsections || []);

  if (loading) {
    return <div className="text-[#707070] text-[14px]">Loading posts...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[28px] font-normal text-white">Posts</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-white text-[#0a0a0a] rounded-lg hover:opacity-90 transition text-[13px] font-medium"
        >
          {showForm ? 'Cancel' : '+ New Post'}
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-[13px] font-medium text-[#e5e5e5] mb-2">
          Filter by Subsection
        </label>
        <select
          value={selectedSubsection}
          onChange={(e) => setSelectedSubsection(e.target.value)}
          className="w-full max-w-md px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white text-[14px] focus:outline-none focus:border-white transition"
        >
          <option value="">All Subsections ({allPosts.length})</option>
          {allSubsections.map((sub) => {
            const count = allPosts.filter(p => p.subsection.slug === sub.slug).length;
            return (
              <option key={sub.id} value={sub.slug}>
                {sub.name} ({count})
              </option>
            );
          })}
        </select>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#101010] p-6 rounded-xl border border-[#1a1a1a] mb-6">
          {error && (
            <div className="mb-4 p-3 bg-red-950/50 border border-red-900/50 rounded-lg text-[13px] text-red-400">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-[13px] font-medium text-[#e5e5e5] mb-2">Subsection *</label>
            <select
              value={selectedSubsection}
              onChange={(e) => setSelectedSubsection(e.target.value)}
              required
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white text-[14px] focus:outline-none focus:border-white transition"
            >
              <option value="">Select a subsection</option>
              {allSubsections.map((sub) => (
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
                onClick={() => setFormData({ ...formData, displayStyle: 'blog' })}
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
                onClick={() => setFormData({ ...formData, displayStyle: 'project' })}
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
                onClick={() => setFormData({ ...formData, displayStyle: 'title-only' })}
                className={`p-4 rounded-lg border-2 transition ${
                  formData.displayStyle === 'title-only'
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

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[13px] font-medium text-[#e5e5e5] mb-2">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Your Post Title"
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white text-[14px] focus:outline-none focus:border-white transition"
              />
            </div>

            {formData.displayStyle !== 'title-only' && (
              <div>
                <label className="block text-[13px] font-medium text-[#e5e5e5] mb-2">Cover Image URL</label>
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

          <div className="mb-4">
            <label className="block text-[13px] font-medium text-[#e5e5e5] mb-2">Description *</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              placeholder="A brief description"
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white text-[14px] focus:outline-none focus:border-white transition"
            />
          </div>

          {/* Project Link (only for project style) */}
          {formData.displayStyle === 'project' && (
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-[#e5e5e5] mb-2">Project Link *</label>
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

          {/* Content (not needed for title-only) */}
          {formData.displayStyle !== 'title-only' && (
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

          {formData.displayStyle !== 'title-only' && (
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-[#e5e5e5] mb-2">Excerpt (optional)</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                rows={2}
                placeholder="Auto-generated if left empty"
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white text-[14px] focus:outline-none focus:border-white transition resize-none"
              />
            </div>
          )}

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

          <div className="mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <span className="text-[13px] text-[#e5e5e5]">Publish immediately</span>
            </label>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-white text-[#0a0a0a] rounded-lg hover:opacity-90 transition text-[13px] font-medium"
          >
            Create Post
          </button>
        </form>
      )}

      {/* Posts List */}
      <div className="space-y-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-[#101010] p-5 rounded-xl border border-[#1a1a1a] hover:border-[#2a2a2a] transition"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <h3 className="text-[15px] text-white font-medium truncate">{post.title}</h3>
                  {getDisplayStyleBadge(post.displayStyle)}
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] shrink-0 ${
                      post.published
                        ? 'bg-green-950/50 text-green-400'
                        : 'bg-[#1a1a1a] text-[#707070]'
                    }`}
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="text-[13px] text-[#707070] mb-1">
                  {post.subsection.name} • {post.views} views
                  {post.displayStyle === 'project' && post.projectLink && (
                    <span className="ml-2">• <a href={post.projectLink} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">View Project →</a></span>
                  )}
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag.id}
                        className="px-2 py-0.5 bg-[#1a1a1a] text-[#707070] rounded text-[11px]"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => handleTogglePublish(post)}
                  className="text-[13px] text-[#707070] hover:text-white transition"
                >
                  {post.published ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  onClick={() => handleDelete(post)}
                  className="text-[13px] text-red-400 hover:text-red-300 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="bg-[#101010] p-8 rounded-xl border border-[#1a1a1a] text-center">
            <p className="text-[14px] text-[#707070] mb-4">
              {selectedSubsection ? 'No posts in this subsection yet' : 'No posts yet'}
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="text-[13px] text-white hover:opacity-70 transition"
            >
              Create your first post
            </button>
          </div>
        )}
      </div>
    </div>
  );
}