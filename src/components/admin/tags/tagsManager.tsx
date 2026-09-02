'use client';

import { adminApi } from '@/src/lib/api';
import { Tag } from '@/src/types';
import { useEffect, useState } from 'react';
import { ContentLoader } from '../../ui/Spinner';

export function TagsManager() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [tagName, setTagName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const res = await adminApi.getTags() as { tags: Tag[] };
      setTags(res.tags);
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await adminApi.createTag({ name: tagName });
      setTagName('');
      setShowForm(false);
      fetchTags();
    } catch (err: any) {
      setError(err.message || 'Failed to create tag');
    }
  };

  const handleDelete = async (tagSlug: string) => {
    if (!confirm('Are you sure you want to delete this tag?')) return;

    try {
      await adminApi.deleteTag(tagSlug);
      fetchTags();
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  if (loading) {
    return <ContentLoader />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[28px] font-normal text-white">Tags</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-white text-[#0a0a0a] rounded-lg hover:opacity-90 transition text-[13px] font-medium"
        >
          {showForm ? 'Cancel' : '+ New Tag'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#101010] p-6 rounded-xl border border-[#1a1a1a] mb-6">
          {error && (
            <div className="mb-4 p-3 bg-red-950/50 border border-red-900/50 rounded-lg text-[13px] text-red-400">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-[13px] font-medium text-[#e5e5e5] mb-2">Tag Name</label>
            <input
              type="text"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              required
              placeholder="AI, Memory, etc."
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white text-[14px] focus:outline-none focus:border-white transition"
            />
            <p className="text-[11px] text-[#707070] mt-2">Tags will be automatically converted to UPPERCASE</p>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-white text-[#0a0a0a] rounded-lg hover:opacity-90 transition text-[13px] font-medium"
          >
            Create Tag
          </button>
        </form>
      )}

      {/* Tags Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="bg-[#101010] p-4 rounded-xl border border-[#1a1a1a] hover:border-[#2a2a2a] transition group"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-[14px] text-white font-medium truncate">{tag.name}</h3>
              <button
                onClick={() => handleDelete(tag.slug)}
                className="text-red-400 hover:text-red-300 transition opacity-0 group-hover:opacity-100 shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-[12px] text-[#707070]">
              {tag.posts?.length || 0} posts
            </div>
          </div>
        ))}
      </div>

      {tags.length === 0 && (
        <div className="bg-[#101010] p-8 rounded-xl border border-[#1a1a1a] text-center">
          <p className="text-[14px] text-[#707070] mb-4">No tags yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-[13px] text-white hover:opacity-70 transition"
          >
            Create your first tag
          </button>
        </div>
      )}
    </div>
  );
}