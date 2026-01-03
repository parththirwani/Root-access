'use client';

import { adminApi } from '@/src/lib/api';
import { TopCategory } from '@/src/types';
import { useEffect, useState } from 'react';


export function SubsectionsManager() {
  const [sections, setSections] = useState<TopCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    topCategoryName: '',
    isVisible: true,
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
      setFormData({ name: '', icon: '', topCategoryName: '', isVisible: true });
      setEditingSlug(null);
      setShowForm(false);
      fetchData();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    }
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

  const allSubsections = sections.flatMap((s) => 
    (s.subsections || []).map((sub) => ({ ...sub, categoryName: s.name }))
  );

  if (loading) {
    return <div className="text-gray-500">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Subsections</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
        >
          {showForm ? 'Cancel' : 'New Subsection'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Icon (emoji)</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                required
                placeholder="📝"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
            <select
              value={formData.topCategoryName}
              onChange={(e) => setFormData({ ...formData, topCategoryName: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            >
              <option value="">Select a section</option>
              {sections.map((section) => (
                <option key={section.id} value={section.name}>
                  {section.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isVisible}
                onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm text-gray-700">Visible</span>
            </label>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
          >
            {editingSlug ? 'Update' : 'Create'} Subsection
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Name</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Section</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Posts</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-700">Visible</th>
              <th className="text-right px-6 py-3 text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allSubsections.map((subsection) => (
              <tr key={subsection.id} className="border-b border-gray-200 last:border-0">
                <td className="px-6 py-4 text-sm text-gray-900">
                  <span className="mr-2">{subsection.icon}</span>
                  {subsection.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{subsection.categoryName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{subsection.postCount}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {subsection.isVisible ? 'Yes' : 'No'}
                </td>
                <td className="px-6 py-4 text-sm text-right">
                  <button
                    onClick={() => handleDelete(subsection.slug)}
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