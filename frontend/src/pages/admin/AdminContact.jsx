import React, { useState, useEffect } from 'react';
import { adminFetch, apiFetch } from '../../services/api';
import AdminTable from '../../components/admin/AdminTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { showToast } from '../../components/admin/Toast';
import { Mail, Phone, MapPin, Globe, Plus, Trash2, Edit, Save, Loader2, Sparkles } from 'lucide-react';

export const AdminContact = () => {
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    location: '',
    whatsapp: '',
    timezone_label: '',
    availability_text: '',
    map_embed_url: '',
    map_address_url: '',
  });
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingContact, setSavingContact] = useState(false);

  // Social link modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState(null);
  const [socialForm, setSocialForm] = useState({ platform: '', url: '', icon_name: '', label: '', sort_order: 0, is_active: 1 });

  // Delete confirm
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const cData = await adminFetch('/admin/contact');
      if (cData) setContactInfo(cData);
      const sData = await adminFetch('/admin/social-links');
      if (sData) setSocialLinks(sData);
    } catch (err) {
      showToast('Failed to load contact data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSavingContact(true);
    try {
      await adminFetch(`/admin/contact/${contactInfo.id || 1}`, {
        method: 'PUT',
        body: JSON.stringify(contactInfo),
      });
      showToast('Contact details saved successfully!');
    } catch (err) {
      showToast('Failed to save contact details', 'error');
    } finally {
      setSavingContact(false);
    }
  };

  const handleOpenSocialModal = (social = null) => {
    if (social) {
      setEditingSocial(social);
      setSocialForm(social);
    } else {
      setEditingSocial(null);
      setSocialForm({ platform: '', url: '', icon_name: '', label: '', sort_order: socialLinks.length + 1, is_active: 1 });
    }
    setIsModalOpen(true);
  };

  const handleSaveSocial = async (e) => {
    e.preventDefault();
    try {
      if (editingSocial) {
        await adminFetch(`/admin/social-links/${editingSocial.id}`, {
          method: 'PUT',
          body: JSON.stringify(socialForm),
        });
        showToast('Social link updated!');
      } else {
        await adminFetch('/admin/social-links', {
          method: 'POST',
          body: JSON.stringify(socialForm),
        });
        showToast('Social link added!');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      showToast('Failed to save social link', 'error');
    }
  };

  const handleDeleteSocial = async () => {
    if (!deleteId) return;
    try {
      await adminFetch(`/admin/social-links/${deleteId}`, { method: 'DELETE' });
      showToast('Social link removed');
      setDeleteId(null);
      fetchData();
    } catch (err) {
      showToast('Failed to delete social link', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-[#7C5CFF] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Contact & Social Settings</h1>
        <p className="text-sm text-[#CBD5E1] mt-1">Manage public contact information, map links, and social platform icons.</p>
      </div>

      {/* Main Info Form */}
      <form onSubmit={handleContactSubmit} className="p-6 rounded-3xl bg-[#121620] border border-white/10 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Mail className="w-5 h-5 text-[#7C5CFF]" /> Primary Contact Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-2">Direct Email</label>
            <input
              type="email"
              value={contactInfo.email || ''}
              onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-white/10 text-white text-sm outline-none focus:border-[#7C5CFF]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-2">Phone / Mobile</label>
            <input
              type="text"
              value={contactInfo.phone || ''}
              onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-white/10 text-white text-sm outline-none focus:border-[#7C5CFF]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-2">Primary Location</label>
            <input
              type="text"
              value={contactInfo.location || ''}
              onChange={(e) => setContactInfo({ ...contactInfo, location: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-white/10 text-white text-sm outline-none focus:border-[#7C5CFF]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-2">Timezone Label</label>
            <input
              type="text"
              value={contactInfo.timezone_label || ''}
              onChange={(e) => setContactInfo({ ...contactInfo, timezone_label: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-white/10 text-white text-sm outline-none focus:border-[#7C5CFF]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-2">Availability Status Text</label>
            <input
              type="text"
              value={contactInfo.availability_text || ''}
              onChange={(e) => setContactInfo({ ...contactInfo, availability_text: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-white/10 text-white text-sm outline-none focus:border-[#7C5CFF]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-2">WhatsApp Number (with country code)</label>
            <input
              type="text"
              value={contactInfo.whatsapp || ''}
              onChange={(e) => setContactInfo({ ...contactInfo, whatsapp: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-white/10 text-white text-sm outline-none focus:border-[#7C5CFF]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-2">Google Maps Embed URL</label>
          <input
            type="text"
            value={contactInfo.map_embed_url || ''}
            onChange={(e) => setContactInfo({ ...contactInfo, map_embed_url: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-[#1E293B] border border-white/10 text-white text-sm outline-none focus:border-[#7C5CFF]"
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={savingContact}
            className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-[#6C63FF] to-[#7C5CFF] text-white flex items-center gap-2 hover:opacity-90"
          >
            {savingContact ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Contact Details
          </button>
        </div>
      </form>

      {/* Social Links Table */}
      <div className="p-6 rounded-3xl bg-[#121620] border border-white/10 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#7C5CFF]" /> Social Links & Media Handles
          </h2>
          <button
            onClick={() => handleOpenSocialModal()}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#7C5CFF] text-white flex items-center gap-1.5 hover:bg-[#6C63FF]"
          >
            <Plus className="w-4 h-4" /> Add Social Link
          </button>
        </div>

        <AdminTable
          columns={[
            { key: 'platform', label: 'Platform' },
            { key: 'url', label: 'URL Target' },
            { key: 'icon_name', label: 'Icon Component' },
            { key: 'sort_order', label: 'Order' },
            {
              key: 'is_active',
              label: 'Status',
              render: (row) => (
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${row.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                  {row.is_active ? 'Active' : 'Hidden'}
                </span>
              ),
            },
          ]}
          data={socialLinks}
          actions={(row) => (
            <div className="flex items-center gap-2">
              <button onClick={() => handleOpenSocialModal(row)} className="p-1.5 text-slate-300 hover:text-white">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => setDeleteId(row.id)} className="p-1.5 text-rose-400 hover:text-rose-300">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        />
      </div>

      {/* Social Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleSaveSocial} className="w-full max-w-md p-6 rounded-3xl bg-[#121620] border border-white/10 space-y-4">
            <h3 className="text-lg font-bold text-white">{editingSocial ? 'Edit Social Link' : 'New Social Link'}</h3>
            <div>
              <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-1">Platform Name</label>
              <input
                type="text"
                required
                value={socialForm.platform}
                onChange={(e) => setSocialForm({ ...socialForm, platform: e.target.value })}
                placeholder="e.g. GitHub, LinkedIn, X"
                className="w-full px-4 py-2.5 rounded-xl bg-[#1E293B] border border-white/10 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-1">URL</label>
              <input
                type="url"
                required
                value={socialForm.url}
                onChange={(e) => setSocialForm({ ...socialForm, url: e.target.value })}
                placeholder="https://..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#1E293B] border border-white/10 text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-1">Lucide Icon Name</label>
              <input
                type="text"
                value={socialForm.icon_name}
                onChange={(e) => setSocialForm({ ...socialForm, icon_name: e.target.value })}
                placeholder="Github, Linkedin, Twitter, Mail..."
                className="w-full px-4 py-2.5 rounded-xl bg-[#1E293B] border border-white/10 text-white text-sm"
              />
            </div>
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 text-white hover:bg-white/20"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-xl text-xs font-bold bg-[#7C5CFF] text-white hover:bg-[#6C63FF]"
              >
                Save Link
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Social Link?"
        message="Are you sure you want to remove this social link?"
        onConfirm={handleDeleteSocial}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default AdminContact;
