import React, { useState, useEffect } from 'react';
import { adminFetch } from '../../services/api';
import { useToast } from '../../components/admin/Toast';

export const AdminSettings = () => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    site_name: '',
    site_title: '',
    primary_email: '',
    phone: '',
    location: '',
    short_description: '',
    copyright_text: '',
    meta_title: '',
    meta_description: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const data = await adminFetch('/admin/settings');
      if (data && typeof data === 'object') {
        setSettings((prev) => ({ ...prev, ...data }));
      }
    } catch (error) {
      showToast('Failed to load site settings', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await adminFetch('/admin/settings', {
        method: 'POST',
        body: JSON.stringify(settings),
      });
      showToast('Global settings updated successfully!', 'success');
    } catch (error) {
      showToast(error.message || 'Failed to save settings', 'error');
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Global Site Settings</h1>
          <p className="text-sm text-slate-600 dark:text-[#CBD5E1]">Manage global site title, branding strings, copyright notice, and SEO metadata.</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="bg-[#7C5CFF] hover:bg-[#6C63FF] text-white px-6 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 shadow-lg"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="bg-white dark:bg-[#121620] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-2">Site Brand Name</label>
              <input
                type="text"
                name="site_name"
                value={settings.site_name || ''}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-2">Browser Tab Header Title</label>
              <input
                type="text"
                name="site_title"
                value={settings.site_title || ''}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-2">Primary Email</label>
              <input
                type="email"
                name="primary_email"
                value={settings.primary_email || ''}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-2">Phone</label>
              <input
                type="text"
                name="phone"
                value={settings.phone || ''}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={settings.location || ''}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-2">Footer Short Description</label>
            <textarea
              name="short_description"
              value={settings.short_description || ''}
              onChange={handleChange}
              rows="3"
              className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-2">Copyright Notice</label>
            <input
              type="text"
              name="copyright_text"
              value={settings.copyright_text || ''}
              onChange={handleChange}
              className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-4">
            <h3 className="text-slate-900 dark:text-white font-bold text-sm uppercase tracking-wider">SEO Meta Tags</h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-2">Meta Title</label>
              <input
                type="text"
                name="meta_title"
                value={settings.meta_title || ''}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-2">Meta Description</label>
              <textarea
                name="meta_description"
                value={settings.meta_description || ''}
                onChange={handleChange}
                rows="3"
                className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]"
              ></textarea>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
