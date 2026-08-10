import React, { useState, useEffect } from 'react';
import { adminFetch, API_BASE } from '../../services/api';
import { useToast } from '../../components/admin/Toast';
import ImageUploader from '../../components/admin/ImageUploader';
import AdminTable from '../../components/admin/AdminTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { Plus, Trash2, Edit } from 'lucide-react';

export const AdminAbout = () => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    badge: '',
    heading: '',
    subheading: '',
    name: '',
    job_title: '',
    location: '',
    bio_paragraph_1: '',
    bio_paragraph_2: '',
    engineering_badge_1: '',
    engineering_badge_2: '',
    profile_image: '',
  });
  const [profileFile, setProfileFile] = useState(null);
  const [aboutId, setAboutId] = useState(null);

  // Stats table state
  const [statsList, setStatsList] = useState([]);
  const [isStatModalOpen, setIsStatModalOpen] = useState(false);
  const [editingStat, setEditingStat] = useState(null);
  const [statForm, setStatForm] = useState({ label: '', value: '', icon_name: '', color_class: '', sort_order: 0, is_active: 1 });
  const [deleteStatId, setDeleteStatId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await adminFetch('/admin/about');
      if (data && data.about) {
        setFormData(data.about);
        setAboutId(data.about.id);
      } else if (data && data.id) {
        setFormData(data);
        setAboutId(data.id);
      }
      const sData = await adminFetch('/admin/about/stats');
      if (sData) setStatsList(sData);
    } catch (error) {
      showToast('Failed to load about data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let finalImageUrl = formData.profile_image;
      if (profileFile) {
        const fd = new FormData();
        fd.append('file', profileFile);
        const token = localStorage.getItem('admin_token');
        const imgRes = await fetch(`${API_BASE}/admin/media`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        });
        if (imgRes.ok) {
          const json = await imgRes.json();
          finalImageUrl = json.data?.public_url || json.url || finalImageUrl;
        }
      }

      const payload = { ...formData, profile_image: finalImageUrl };

      if (aboutId) {
        await adminFetch(`/admin/about/${aboutId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      }
      setFormData(payload);
      setProfileFile(null);
      showToast('About section updated successfully', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenStatModal = (stat = null) => {
    if (stat) {
      setEditingStat(stat);
      setStatForm(stat);
    } else {
      setEditingStat(null);
      setStatForm({ label: '', value: '', icon_name: '', color_class: '', sort_order: statsList.length + 1, is_active: 1 });
    }
    setIsStatModalOpen(true);
  };

  const handleSaveStat = async (e) => {
    e.preventDefault();
    try {
      if (editingStat) {
        await adminFetch(`/admin/about/stats/${editingStat.id}`, {
          method: 'PUT',
          body: JSON.stringify(statForm),
        });
        showToast('Stat card updated!');
      } else {
        await adminFetch('/admin/about/stats', {
          method: 'POST',
          body: JSON.stringify(statForm),
        });
        showToast('Stat card added!');
      }
      setIsStatModalOpen(false);
      fetchData();
    } catch (err) {
      showToast('Failed to save stat card', 'error');
    }
  };

  const handleDeleteStat = async () => {
    if (!deleteStatId) return;
    try {
      await adminFetch(`/admin/about/stats/${deleteStatId}`, { method: 'DELETE' });
      showToast('Stat card removed');
      setDeleteStatId(null);
      fetchData();
    } catch (err) {
      showToast('Failed to delete stat', 'error');
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-2 border-[#7C5CFF] border-t-transparent rounded-full"></div></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">About Section</h1>
          <p className="text-sm text-slate-600 dark:text-[#CBD5E1]">Manage bio, title, badges, and stat counters.</p>
        </div>
        <button onClick={handleSubmit} disabled={isSaving} className="bg-[#7C5CFF] hover:bg-[#6C63FF] text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-lg">
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#121620] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-2">Badge Text</label>
                <input type="text" name="badge" value={formData.badge || ''} onChange={handleChange} className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-2">Main Heading</label>
                <input type="text" name="heading" value={formData.heading || ''} onChange={handleChange} className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-2">Full Name</label>
                <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-2">Job Title</label>
                <input type="text" name="job_title" value={formData.job_title || ''} onChange={handleChange} className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-2">Location</label>
                <input type="text" name="location" value={formData.location || ''} onChange={handleChange} className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-2">Bio Paragraph 1</label>
              <textarea name="bio_paragraph_1" value={formData.bio_paragraph_1 || ''} onChange={handleChange} rows="4" className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]"></textarea>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-2">Bio Paragraph 2</label>
              <textarea name="bio_paragraph_2" value={formData.bio_paragraph_2 || ''} onChange={handleChange} rows="4" className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]"></textarea>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#121620] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Profile Image</h3>
            <ImageUploader 
              currentImage={formData.profile_image} 
              onFileSelect={(file) => {
                setProfileFile(file);
              }} 
            />
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-2">Or Image URL</label>
              <input
                type="text"
                name="profile_image"
                value={formData.profile_image || ''}
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-slate-900 dark:text-white text-xs outline-none focus:border-[#7C5CFF]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Counter Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200 dark:border-white/10 space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">About Section Stats Cards</h2>
          <button
            onClick={() => handleOpenStatModal()}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#7C5CFF] text-white flex items-center gap-1.5 hover:bg-[#6C63FF] shadow-md"
          >
            <Plus className="w-4 h-4" /> Add Stat Card
          </button>
        </div>

        <AdminTable
          columns={[
            { key: 'label', label: 'Label' },
            { key: 'value', label: 'Display Value' },
            { key: 'icon_name', label: 'Icon Name' },
            { key: 'sort_order', label: 'Order' },
          ]}
          data={statsList}
          actions={(row) => (
            <div className="flex items-center gap-2">
              <button onClick={() => handleOpenStatModal(row)} className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => setDeleteStatId(row.id)} className="p-1.5 text-rose-500 dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        />
      </div>

      {/* Stat Modal */}
      {isStatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleSaveStat} className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200 dark:border-white/10 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{editingStat ? 'Edit Stat Card' : 'New Stat Card'}</h3>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-1">Label</label>
              <input type="text" required value={statForm.label} onChange={(e) => setStatForm({ ...statForm, label: e.target.value })} placeholder="e.g. Projects Completed" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-1">Value</label>
              <input type="text" required value={statForm.value} onChange={(e) => setStatForm({ ...statForm, value: e.target.value })} placeholder="e.g. 45+" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-1">Lucide Icon Name</label>
              <input type="text" value={statForm.icon_name || ''} onChange={(e) => setStatForm({ ...statForm, icon_name: e.target.value })} placeholder="Briefcase, Award, Code, Sparkles..." className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-sm" />
            </div>
            <div className="flex items-center justify-between pt-4">
              <button type="button" onClick={() => setIsStatModalOpen(false)} className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/20">Cancel</button>
              <button type="submit" className="px-6 py-2 rounded-xl text-xs font-bold bg-[#7C5CFF] text-white hover:bg-[#6C63FF]">Save Stat</button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteStatId}
        title="Delete Stat Card?"
        message="Are you sure you want to delete this stat counter?"
        onConfirm={handleDeleteStat}
        onCancel={() => setDeleteStatId(null)}
      />
    </div>
  );
};

export default AdminAbout;
