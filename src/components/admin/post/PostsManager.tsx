'use client';

import { adminApi } from '@/src/lib/api';
import { Post, TopCategory } from '@/src/types';
import { useEffect, useState } from 'react';


export function PostsManager() {
  const [sections, setSections] = useState<TopCategory[]>([]);
  const [selectedSubsection, setSelectedSubsection] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
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
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSections();
  }, []);

  useEffect(() => {
    if (selectedSubsection) {
      fetchPosts();
    }
  }, [selectedSubsection]);

  const fetchSections = async () => {
    try {
      const res = await adminApi.getSections() as { sections: TopCategory[] };
      setSections(res.sections);
    } catch (error) {
      console.error('Failed to fetch sections:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    if (!selectedSubsection) return;
    
    try {
      const res = await adminApi.getPosts(selectedSubsection) as { posts: Post[] };
      setPosts(res.posts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedSubsection) {
      setError('Please select a subsection');
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
      });
      setShowForm(false);
      fetchPosts();
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
      fetchPosts();
    } catch (err: any) {
      alert(err.message || 'Failed to update post');
    }
  };

  const handleDelete = async (post: Post) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await adminApi.deletePost(post.subsection.slug, post.slug);
      fetchPosts();
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  const allSubsections = sections.flatMap((s) => s.subsections || []);

  if (loading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
        >
          {showForm ? 'Cancel' : 'New Post'}
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by Subsection
        </label>
        <select
          value={selectedSubsection}
          onChange={(e) => setSelectedSubsection(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
        >
          <option value="">All Subsections</option>
          {allSubsections.map((sub) => (
            <option key={sub.id} value={sub.slug}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Subsection</label>
            <select
              value={selectedSubsection}
              onChange={(e) => setSelectedSubsection(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="">Select a subsection</option>
              {allSubsections.map((sub) => (
                <option key={sub.id} value={sub.slug}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image URL</label>
              <input
                type="url"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              rows={10}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 font-mono text-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
            <textarea
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="AI, Memory, Claude"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Publish immediately</span>
            </label>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            Create Post
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Title</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Subsection</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Views</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Status</th>
              <th className="text-right px-6 py-3 text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-gray-200 last:border-0">
                <td className="px-6 py-4 text-sm text-gray-900">{post.title}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{post.subsection.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{post.views}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      post.published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-right">
                  <button
                    onClick={() => handleTogglePublish(post)}
                    className="text-gray-600 hover:text-gray-900 mr-4"
                  >
                    {post.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => handleDelete(post)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}