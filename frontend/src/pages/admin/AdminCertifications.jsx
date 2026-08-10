import React, { useState, useEffect } from 'react';
import { adminFetch } from '../../services/api';
import { useToast } from '../../components/admin/Toast';
import AdminTable from '../../components/admin/AdminTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminCertifications = () => {
  const { showToast } = useToast();
  const [certs, setCerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, item: null });

  const initialForm = { title: '', issuer: '', issue_date: '', credential_id: '', icon_name: 'Award', verification_url: '', description: '', sort_order: 0, is_active: true };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    setIsLoading(true);
    try {
      const data = await adminFetch('/admin/certifications');
      if (Array.isArray(data)) setCerts(data);
    } catch (error) {
      showToast('Failed to load certifications', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item) => setDeleteDialog({ isOpen: true, item });

  const confirmDelete = async () => {
    try {
      await adminFetch(`/admin/certifications/${deleteDialog.item.id}`, { method: 'DELETE' });
      showToast('Certification deleted', 'success');
      setDeleteDialog({ isOpen: false, item: null });
      fetchCerts();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const method = formData.id ? 'PUT' : 'POST';
      const url = formData.id ? `/admin/certifications/${formData.id}` : '/admin/certifications';
      await adminFetch(url, { method, body: JSON.stringify(formData) });
      showToast(formData.id ? 'Certification updated' : 'Certification added', 'success');
      setIsModalOpen(false);
      fetchCerts();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const columns = [
    { key: 'title', label: 'Certification Title', render: (val) => <div className="font-bold text-white">{val}</div> },
    { key: 'issuer', label: 'Issuer' },
    { key: 'issue_date', label: 'Date', render: (val, row) => val || row.date || '-' },
    { key: 'credential_id', label: 'Credential ID', render: (val, row) => val || row.credentialId || 'N/A' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Certifications & Diplomas</h1>
          <p className="text-sm text-[#CBD5E1]">Manage engineering diplomas, software certifications, and credentials.</p>
        </div>
        <button onClick={() => { setFormData({ ...initialForm, sort_order: certs.length + 1 }); setIsModalOpen(true); }} className="bg-[#7C5CFF] hover:bg-[#6C63FF] text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2">
          <span>➕</span> Add Certification
        </button>
      </div>

      <AdminTable columns={columns} data={certs} onEdit={handleEdit} onDelete={handleDeleteClick} isLoading={isLoading} />

      <ConfirmDialog isOpen={deleteDialog.isOpen} title="Delete Certification" message={`Are you sure you want to delete "${deleteDialog.item?.title}"?`} onConfirm={confirmDelete} onCancel={() => setDeleteDialog({ isOpen: false, item: null })} />

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-[#121620] border border-white/10 rounded-2xl shadow-2xl w-full max-w-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">{formData.id ? 'Edit Certification' : 'Add Certification'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-1">Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#7C5CFF]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-1">Issuer</label>
                    <input type="text" required value={formData.issuer} onChange={e => setFormData({...formData, issuer: e.target.value})} className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#7C5CFF]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-1">Date</label>
                    <input type="text" required value={formData.issue_date || formData.date || ''} onChange={e => setFormData({...formData, issue_date: e.target.value, date: e.target.value})} placeholder="Jan 2024 — Jan 2025" className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#7C5CFF]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-1">Credential ID</label>
                    <input type="text" value={formData.credential_id || formData.credentialId || ''} onChange={e => setFormData({...formData, credential_id: e.target.value})} placeholder="0078785" className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#7C5CFF]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-1">Icon Name</label>
                    <input type="text" value={formData.icon_name || formData.iconName || 'Award'} onChange={e => setFormData({...formData, icon_name: e.target.value})} placeholder="Award, Code, GraduationCap" className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#7C5CFF]" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-1">Verification URL</label>
                  <input type="url" value={formData.verification_url || formData.verificationUrl || ''} onChange={e => setFormData({...formData, verification_url: e.target.value})} placeholder="https://..." className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#7C5CFF]" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-1">Description</label>
                  <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} rows="3" className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#7C5CFF]"></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-[#CBD5E1] hover:bg-white/5">Cancel</button>
                  <button type="submit" disabled={isSaving} className="px-6 py-2 rounded-xl bg-[#7C5CFF] hover:bg-[#6C63FF] text-white font-medium transition-colors disabled:opacity-50">{isSaving ? 'Saving...' : 'Save Certification'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCertifications;
