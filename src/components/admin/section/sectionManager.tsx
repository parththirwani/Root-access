'use client';

import { adminApi } from '@/src/lib/api';
import { TopCategory } from '@/src/types';
import { useEffect, useState } from 'react';
import { ContentLoader } from '../../ui/Spinner';

export function SectionsManager() {
  const [sections, setSections] = useState<TopCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', isVisible: true });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSections();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await adminApi.updateSection(editingId, formData);
      } else {
        await adminApi.createSection(formData);
      }
      setFormData({ name: '', isVisible: true });
      setEditingId(null);
      setShowForm(false);
      fetchSections();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    }
  };

  const handleEdit = (section: TopCategory) => {
    setFormData({ name: section.name, isVisible: section.isVisible });
    setEditingId(section.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return;

    try {
      await adminApi.deleteSection(id);
      fetchSections();
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
        <h1 className="text-[28px] font-normal text-white">Sections</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ name: '', isVisible: true });
          }}
          className="px-4 py-2 bg-white text-[#0a0a0a] rounded-lg hover:opacity-90 transition text-[13px] font-medium"
        >
          {showForm ? 'Cancel' : '+ New Section'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#101010] p-6 rounded-xl border border-[#1a1a1a] mb-6">
          {error && (
            <div className="mb-4 p-3 bg-red-950/50 border border-red-900/50 rounded-lg text-[13px] text-red-400">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-[13px] font-medium text-[#e5e5e5] mb-2">
              Section Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="e.g., Craft, Lists"
              className="w-full px-4 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg text-white text-[14px] focus:outline-none focus:border-white transition"
            />
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

          <button
            type="submit"
            className="px-4 py-2 bg-white text-[#0a0a0a] rounded-lg hover:opacity-90 transition text-[13px] font-medium"
          >
            {editingId ? 'Update Section' : 'Create Section'}
          </button>
        </form>
      )}

      {/* Sections List */}
      <div className="space-y-3">
        {sections.map((section) => (
          <div
            key={section.id}
            className="bg-[#101010] p-5 rounded-xl border border-[#1a1a1a] hover:border-[#2a2a2a] transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-[15px] text-white font-medium">{section.name}</h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] ${
                      section.isVisible
                        ? 'bg-green-950/50 text-green-400'
                        : 'bg-[#1a1a1a] text-[#707070]'
                    }`}
                  >
                    {section.isVisible ? 'Visible' : 'Hidden'}
                  </span>
                </div>
                <div className="text-[13px] text-[#707070]">
                  {section.subsections?.length || 0} subsections
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleEdit(section)}
                  className="text-[13px] text-[#707070] hover:text-white transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(section.id)}
                  className="text-[13px] text-red-400 hover:text-red-300 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {sections.length === 0 && (
          <div className="bg-[#101010] p-8 rounded-xl border border-[#1a1a1a] text-center">
            <p className="text-[14px] text-[#707070] mb-4">No sections yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-[13px] text-white hover:opacity-70 transition"
            >
              Create your first section
            </button>
          </div>
        )}
      </div>
    </div>
  );
}