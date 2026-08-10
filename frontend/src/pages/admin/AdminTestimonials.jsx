import React, { useState, useEffect } from 'react';
import { adminFetch } from '../../services/api';
import { useToast } from '../../components/admin/Toast';
import AdminTable from '../../components/admin/AdminTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminTestimonials = () => {
  const { showToast } = useToast();
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, item: null });

  const initialForm = { name: '', role: '', company: '', avatar: '', quote: '', stars: 5, sort_order: 0, is_published: true };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const data = await adminFetch('/admin/testimonials');
      if (Array.isArray(data)) setList(data);
    } catch (error) {
      showToast('Failed to load testimonials', 'error');
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
      await adminFetch(`/admin/testimonials/${deleteDialog.item.id}`, { method: 'DELETE' });
      showToast('Testimonial deleted', 'success');
      setDeleteDialog({ isOpen: false, item: null });
      fetchTestimonials();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const method = formData.id ? 'PUT' : 'POST';
      const url = formData.id ? `/admin/testimonials/${formData.id}` : '/admin/testimonials';
      await adminFetch(url, { method, body: JSON.stringify(formData) });
      showToast(formData.id ? 'Testimonial updated' : 'Testimonial added', 'success');
      setIsModalOpen(false);
      fetchTestimonials();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Client Name', render: (val, row) => <div className="font-bold text-white">{val} <span className="text-xs font-normal text-slate-400">({row.role})</span></div> },
    { key: 'company', label: 'Company' },
    { key: 'stars', label: 'Rating', render: (val) => <span className="text-amber-400 font-bold">{'★'.repeat(val || 5)}</span> },
    { key: 'is_published', label: 'Status', render: (val) => <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${val ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>{val ? 'Published' : 'Hidden'}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Client Testimonials</h1>
          <p className="text-sm text-[#CBD5E1]">Manage client reviews, star ratings, avatars, and quote cards.</p>
        </div>
        <button onClick={() => { setFormData({ ...initialForm, sort_order: list.length + 1 }); setIsModalOpen(true); }} className="bg-[#7C5CFF] hover:bg-[#6C63FF] text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2">
          <span>➕</span> Add Testimonial
        </button>
      </div>

      <AdminTable columns={columns} data={list} onEdit={handleEdit} onDelete={handleDeleteClick} isLoading={isLoading} />

      <ConfirmDialog isOpen={deleteDialog.isOpen} title="Delete Testimonial" message={`Are you sure you want to delete quote from "${deleteDialog.item?.name}"?`} onConfirm={confirmDelete} onCancel={() => setDeleteDialog({ isOpen: false, item: null })} />

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-[#121620] border border-white/10 rounded-2xl shadow-2xl w-full max-w-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">{formData.id ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-1">Client Name</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#7C5CFF]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-1">Role / Job Title</label>
                    <input type="text" required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#7C5CFF]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-1">Company</label>
                    <input type="text" required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#7C5CFF]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-1">Rating Stars (1-5)</label>
                    <select value={formData.stars} onChange={e => setFormData({...formData, stars: parseInt(e.target.value) || 5})} className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#7C5CFF]">
                      <option value="5">5 Stars (★★★★★)</option>
                      <option value="4">4 Stars (★★★★☆)</option>
                      <option value="3">3 Stars (★★★☆☆)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-1">Avatar Image URL</label>
                  <input type="url" value={formData.avatar || ''} onChange={e => setFormData({...formData, avatar: e.target.value})} placeholder="https://..." className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#7C5CFF]" />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-1">Quote Text</label>
                  <textarea required value={formData.quote} onChange={e => setFormData({...formData, quote: e.target.value})} rows="4" className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#7C5CFF]"></textarea>
                </div>

                <div className="flex items-center gap-3 py-2">
                  <input type="checkbox" checked={formData.is_published} onChange={e => setFormData({...formData, is_published: e.target.checked})} className="w-5 h-5 rounded border-white/20 bg-[#1E293B] text-[#7C5CFF]" />
                  <span className="text-[#CBD5E1]">Published</span>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-[#CBD5E1] hover:bg-white/5">Cancel</button>
                  <button type="submit" disabled={isSaving} className="px-6 py-2 rounded-xl bg-[#7C5CFF] hover:bg-[#6C63FF] text-white font-medium transition-colors disabled:opacity-50">{isSaving ? 'Saving...' : 'Save Testimonial'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminTestimonials;
