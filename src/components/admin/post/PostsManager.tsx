'use client';

import { adminApi } from '@/src/lib/api';
import { Post, TopCategory, DisplayStyle } from '@/src/types';
import { useEffect, useState } from 'react';
import { SubsectionFilter } from '../subsections/SubSectionFilter';
import { PostForm } from './postForm';
import { PostListItem } from './postListItem';

const INITIAL_FORM_DATA = {
  title: '',
  description: '',
  content: '',
  excerpt: '',
  coverImage: '',
  published: false,
  tags: '',
  displayStyle: 'blog' as DisplayStyle,
  projectLink: '',
};

export function PostsManager() {
  const [sections, setSections] = useState<TopCategory[]>([]);
  const [selectedSubsection, setSelectedSubsection] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
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

    if (formData.displayStyle === 'project' && !formData.projectLink) {
      setError('Project link is required for project display style');
      return;
    }

    if (formData.displayStyle === 'blog' && !formData.content) {
      setError('Content is required for blog display style');
      return;
    }

    try {
      const tags = formData.tags.split(',').map((t) => t.trim()).filter(Boolean);
      await adminApi.createPost(selectedSubsection, { ...formData, tags });
      
      setFormData(INITIAL_FORM_DATA);
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

  const handleCancelForm = () => {
    setShowForm(false);
    setFormData(INITIAL_FORM_DATA);
    setError('');
  };

  const allSubsections = sections.flatMap((s) => s.subsections || []);

  // Calculate post counts per subsection
  const postCounts: Record<string, number> = {};
  allPosts.forEach(post => {
    postCounts[post.subsection.slug] = (postCounts[post.subsection.slug] || 0) + 1;
  });

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

      {/* Subsection Filter */}
      <SubsectionFilter
        subsections={allSubsections}
        selectedSubsection={selectedSubsection}
        onChange={setSelectedSubsection}
        postCounts={postCounts}
        totalPosts={allPosts.length}
      />

      {/* Post Form */}
      {showForm && (
        <PostForm
          formData={formData}
          onChange={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCancelForm}
          subsections={allSubsections}
          selectedSubsection={selectedSubsection}
          onSubsectionChange={setSelectedSubsection}
          error={error}
        />
      )}

      {/* Posts List */}
      <div className="space-y-3">
        {posts.map((post) => (
          <PostListItem
            key={post.id}
            post={post}
            onTogglePublish={handleTogglePublish}
            onDelete={handleDelete}
          />
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