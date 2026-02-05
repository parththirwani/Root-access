'use client';

import { adminApi } from '@/src/lib/api';
import { Subsection, TopCategory, DisplayStyle } from '@/src/types';
import { useEffect, useState } from 'react';

export function SubsectionsManager() {
  const [sections, setSections] = useState<TopCategory[]>([]);
  const [subsections, setSubsections] = useState<Subsection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    isVisible: true,
    icon: '📄',
    topCategoryName: '',
    displayStyle: 'blog' as DisplayStyle,
  });
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await adminApi.getSections() as { sections: TopCategory[] };
      setSections(res.sections);
      
      // Flatten all subsections from all sections
      const allSubsections = res.sections.flatMap((section) => 
        section.subsections?.map(sub => ({
          ...sub,
          topCategory: { name: section.name }
        })) || []
      );
      setSubsections(allSubsections);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingSlug) {
        await adminApi.updateSubsection(editingSlug, formData);
      } else {
        await adminApi.createSubsection(formData);
      }
      setFormData({ name: '', isVisible: true, icon: '📄', topCategoryName: '', displayStyle: 'blog' });
      setEditingSlug(null);
      setShowForm(false);
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    }
  };

  const handleEdit = (subsection: Subsection) => {
    setFormData({
      name: subsection.name,
      isVisible: subsection.isVisible,
      icon: subsection.icon,
      topCategoryName: subsection.topCategory?.name || '',
      displayStyle: subsection.displayStyle,
    });
    setEditingSlug(subsection.slug);
    setShowForm(true);
  };

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this subsection?')) return;

    try {
      await adminApi.deleteSubsection(slug);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Delete failed');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSlug(null);
    setFormData({ name: '', isVisible: true, icon: '📄', topCategoryName: '', displayStyle: 'blog' });
    setError('');
  };

  const getDisplayStyleLabel = (style: DisplayStyle) => {
    const labels = {
      blog: { emoji: '📝', label: 'Blog Posts' },
      project: { emoji: '🚀', label: 'Project Cards' },
      title_only: { emoji: '📌', label: 'Title List' },
    };
    return labels[style];
  };

  if (loading) {
    return <div className="text-[#707070] text-[14px]">Loading subsections...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[28px] font-normal text-white">Subsections</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) handleCancel();
          }}
          className="px-4 py-2 bg-white text-[#0a0a0a] rounded-lg hover:opacity-90 transition text-[13px] font-medium"
        >
          {showForm ? 'Cancel' : '+ New Subsection'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#101010] p-6 rounded-xl border border-[#1a1a1a] mb-6">
          {error && (
            <div className="mb-4 p-3 bg-red-950/50 border border-red-900/50 rounded-lg text-[13px] text-red-400">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[13px] font-medium text-[#e5e5e5] mb-2">
                Subsection Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g., Writing, Projects"
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white text-[14px] focus:outline-none focus:border-white transition"
              />
            </div>

            <div>
              <label className="block text-[13px] font-medium text-[#e5e5e5] mb-2">
                Icon (Emoji)
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="📝"
                className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white text-[14px] focus:outline-none focus:border-white transition"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-[13px] font-medium text-[#e5e5e5] mb-2">
              Parent Section *
            </label>
            <select
              value={formData.topCategoryName}
              onChange={(e) => setFormData({ ...formData, topCategoryName: e.target.value })}
              required
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white text-[14px] focus:outline-none focus:border-white transition"
            >
              <option value="">Select a section</option>
              {sections.map((section) => (
                <option key={section.id} value={section.name}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>

          {/* Display Style Selector */}
          <div className="mb-4">
            <label className="block text-[13px] font-medium text-[#e5e5e5] mb-2">
              Display Style *
            </label>
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
                  <div className="text-[11px] text-[#707070]">Timeline with full articles</div>
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
                  <div className="text-[11px] text-[#707070]">Grid cards with links</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, displayStyle: 'title_only' })}
                className={`p-4 rounded-lg border-2 transition ${
                  formData.displayStyle === 'title_only'
                    ? 'border-white bg-[#1a1a1a]'
                    : 'border-[#2a2a2a] bg-[#0a0a0a] hover:border-[#3a3a3a]'
                }`}
              >
                <div className="text-left">
                  <div className="text-[14px] font-medium text-white mb-1">📌 Title Only</div>
                  <div className="text-[11px] text-[#707070]">Simple title list</div>
                </div>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isVisible}
                onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                className="w-4 h-4 rounded"
              />
              <span className="text-[13px] text-[#e5e5e5]">Visible on public site</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-4 py-2 bg-white text-[#0a0a0a] rounded-lg hover:opacity-90 transition text-[13px] font-medium"
            >
              {editingSlug ? 'Update Subsection' : 'Create Subsection'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#2a2a2a] transition text-[13px] font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Subsections List */}
      <div className="space-y-3">
        {subsections.map((subsection) => {
          const styleInfo = getDisplayStyleLabel(subsection.displayStyle);
          return (
            <div
              key={subsection.id}
              className="bg-[#101010] p-5 rounded-xl border border-[#1a1a1a] hover:border-[#2a2a2a] transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-lg">{subsection.icon}</span>
                    <h3 className="text-[15px] text-white font-medium">{subsection.name}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] ${
                        subsection.isVisible
                          ? 'bg-green-950/50 text-green-400'
                          : 'bg-[#1a1a1a] text-[#707070]'
                      }`}
                    >
                      {subsection.isVisible ? 'Visible' : 'Hidden'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] bg-blue-950/50 text-blue-400">
                      {styleInfo.emoji} {styleInfo.label}
                    </span>
                  </div>
                  <div className="text-[13px] text-[#707070]">
                    {subsection.topCategory?.name} • {subsection.postCount} posts • /{subsection.slug}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleEdit(subsection)}
                    className="text-[13px] text-[#707070] hover:text-white transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(subsection.slug)}
                    className="text-[13px] text-red-400 hover:text-red-300 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {subsections.length === 0 && (
          <div className="bg-[#101010] p-8 rounded-xl border border-[#1a1a1a] text-center">
            <p className="text-[14px] text-[#707070] mb-4">No subsections yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-[13px] text-white hover:opacity-70 transition"
            >
              Create your first subsection
            </button>
          </div>
        )}
      </div>
    </div>
  );
}