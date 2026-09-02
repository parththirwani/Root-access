'use client';

import { adminApi } from '@/src/lib/api';
import { Post, TopCategory } from '@/src/types';
import { useEffect, useState } from 'react';
import { SubsectionFilter } from '../subsections/SubSectionFilter';
import { PostForm } from './postForm';
import { PostListItem } from './postListItem';
import { PostEditModal } from './PostEditModal';
import { ContentLoader } from '../../ui/Spinner';

const INITIAL_FORM_DATA = {
  title: '',
  description: '',
  content: '',
  excerpt: '',
  coverImage: '',
  published: false,
  tags: '',
  projectLink: '',
};

type DisplayStyleInput = 'blog' | 'project' | 'title_only';

export function PostsManager() {
  const [sections, setSections] = useState<TopCategory[]>([]);
  const [selectedSubsection, setSelectedSubsection] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [error, setError] = useState('');
  const [editingPost, setEditingPost] = useState<Post | null>(null);

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

  const getSubsectionDisplayStyle = (subsectionSlug: string): DisplayStyleInput => {
    const subsection = sections
      .flatMap(s => s.subsections || [])
      .find(sub => sub.slug === subsectionSlug);
    
    // Map Prisma enum to form input
    const displayStyleMap: Record<string, DisplayStyleInput> = {
      'BLOG': 'blog',
      'PROJECT': 'project',
      'TITLE_ONLY': 'title_only'
    };
    
    return displayStyleMap[subsection?.displayStyle || 'BLOG'] || 'blog';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedSubsection) {
      setError('Please select a subsection');
      return;
    }

    const displayStyle = getSubsectionDisplayStyle(selectedSubsection);

    // Validate based on subsection's display style
    if (displayStyle === 'project' && !formData.projectLink) {
      setError('Project link is required for project-style subsections');
      return;
    }

    if (displayStyle === 'blog' && !formData.content) {
      setError('Content is required for blog-style subsections');
      return;
    }

    // For title_only, description is optional
    if (displayStyle !== 'title_only' && !formData.description) {
      setError('Description is required for this subsection type');
      return;
    }

    try {
      const tags = formData.tags.split(',').map((t) => t.trim()).filter(Boolean);
      
      // For title_only posts, send empty description
      const postData = {
        ...formData,
        description: displayStyle === 'title_only' ? '' : formData.description,
        tags,
      };
      
      await adminApi.createPost(selectedSubsection, postData);
      
      setFormData(INITIAL_FORM_DATA);
      setShowForm(false);
      fetchSections();
    } catch (err: any) {
      setError(err.message || 'Failed to create post');
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
  };

  const handleCloseEdit = () => {
    setEditingPost(null);
  };

  const handleSaveEdit = () => {
    fetchSections();
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

  const currentDisplayStyle = selectedSubsection ? getSubsectionDisplayStyle(selectedSubsection) : 'blog';

  if (loading) {
    return <ContentLoader />;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <h1 className="text-2xl sm:text-[28px] font-normal text-white">Posts</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto px-4 py-2 bg-white text-[#0a0a0a] rounded-lg hover:opacity-90 transition text-[13px] font-medium touch-manipulation"
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
          displayStyle={currentDisplayStyle}
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
            onEdit={handleEdit}
          />
        ))}

        {posts.length === 0 && (
          <div className="bg-[#101010] p-6 sm:p-8 rounded-xl border border-[#1a1a1a] text-center">
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

      {/* Edit Modal */}
      {editingPost && (
        <PostEditModal
          post={editingPost}
          onClose={handleCloseEdit}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}