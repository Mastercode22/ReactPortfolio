import React, { useState, useEffect } from 'react';
import { adminFetch } from '../../services/api';
import { useToast } from '../../components/admin/Toast';

export const AdminHero = () => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    badge_text: '',
    headline_1: '',
    headline_2: '',
    headline_3: '',
    headline_4: '',
    bio: '',
    availability_text: '',
    is_available: true,
  });
  const [heroId, setHeroId] = useState(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const data = await adminFetch('/admin/hero');
        if (data) {
          setFormData({
            badge_text: data.badge_text || '',
            headline_1: data.headline_1 || '',
            headline_2: data.headline_2 || '',
            headline_3: data.headline_3 || '',
            headline_4: data.headline_4 || '',
            bio: data.bio || '',
            availability_text: data.availability_text || '',
            is_available: !!data.is_available,
          });
          setHeroId(data.id || null);
        }
      } catch (error) {
        showToast('Failed to load hero section', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHero();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (heroId) {
        await adminFetch(`/admin/hero/${heroId}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
      } else {
        await adminFetch('/admin/hero', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
      }
      showToast('Hero section updated successfully!', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to save changes', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin h-8 w-8 border-2 border-[#7C5CFF] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Hero Section</h1>
          <p className="text-sm text-[#CBD5E1]">Manage typing headlines, status pill, and introduction text.</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="bg-[#7C5CFF] hover:bg-[#6C63FF] text-white px-6 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-[#121620] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-2">Badge Text</label>
            <input
              type="text"
              name="badge_text"
              value={formData.badge_text}
              onChange={handleChange}
              className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#7C5CFF]"
              placeholder="e.g. Available for Selective Client Projects"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-2">Headline Line 1</label>
              <input type="text" name="headline_1" value={formData.headline_1} onChange={handleChange} className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#7C5CFF]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-2">Headline Line 2</label>
              <input type="text" name="headline_2" value={formData.headline_2} onChange={handleChange} className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#7C5CFF]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-2">Headline Line 3</label>
              <input type="text" name="headline_3" value={formData.headline_3} onChange={handleChange} className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#7C5CFF]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-2">Headline Line 4</label>
              <input type="text" name="headline_4" value={formData.headline_4} onChange={handleChange} className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#7C5CFF]" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-2">Bio Introduction Text</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#7C5CFF]"
            ></textarea>
          </div>

          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h3 className="text-white font-medium mb-4">Availability Status Pill</h3>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_available"
                  checked={formData.is_available}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-white/20 bg-[#1E293B] text-[#7C5CFF] focus:ring-[#7C5CFF]"
                />
                <span className="text-[#CBD5E1] text-sm">Available for work</span>
              </label>

              <div className="flex-1">
                <input
                  type="text"
                  name="availability_text"
                  value={formData.availability_text}
                  onChange={handleChange}
                  placeholder="Availability text"
                  className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#7C5CFF]"
                  disabled={!formData.is_available}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminHero;
