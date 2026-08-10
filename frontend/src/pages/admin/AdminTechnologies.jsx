import React, { useState, useEffect } from 'react';
import { adminFetch } from '../../services/api';
import { useToast } from '../../components/admin/Toast';
import AdminTable from '../../components/admin/AdminTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminTechnologies = () => {
  const { showToast } = useToast();
  const [techList, setTechList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, item: null });

  const initialForm = { name: '', category: '', icon_key: '', color: '#6C63FF', description: '', level: 85, sort_order: 0, is_active: true };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchTech();
  }, []);

  const fetchTech = async () => {
    setIsLoading(true);
    try {
      const data = await adminFetch('/admin/technologies');
      if (Array.isArray(data)) setTechList(data);
    } catch (error) {
      showToast('Failed to load technologies', 'error');
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
      await adminFetch(`/admin/technologies/${deleteDialog.item.id}`, { method: 'DELETE' });
      showToast('Technology deleted', 'success');
      setDeleteDialog({ isOpen: false, item: null });
      fetchTech();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const method = formData.id ? 'PUT' : 'POST';
      const url = formData.id ? `/admin/technologies/${formData.id}` : '/admin/technologies';
      await adminFetch(url, { method, body: JSON.stringify(formData) });
      showToast(formData.id ? 'Technology updated' : 'Technology added', 'success');
      setIsModalOpen(false);
      fetchTech();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Name', render: (val, row) => <div className="font-bold text-white flex items-center gap-2"><span style={{ color: row.color }}>●</span> {val}</div> },
    { key: 'category', label: 'Category' },
    { key: 'icon_key', label: 'Icon Key' },
    { key: 'level', label: 'Level (%)', render: (val) => <span className="font-bold text-[#7C5CFF]">{val}%</span> },
    { key: 'sort_order', label: 'Order' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Engineering Tech Stack</h1>
          <p className="text-sm text-slate-600 dark:text-[#CBD5E1]">Manage technologies, skill proficiency bars, and icon mappings.</p>
        </div>
        <button onClick={() => { setFormData({ ...initialForm, sort_order: techList.length + 1 }); setIsModalOpen(true); }} className="bg-[#7C5CFF] hover:bg-[#6C63FF] text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg">
          <span>➕</span> Add Technology
        </button>
      </div>

      <AdminTable columns={columns} data={techList} onEdit={handleEdit} onDelete={handleDeleteClick} isLoading={isLoading} />

      <ConfirmDialog isOpen={deleteDialog.isOpen} title="Delete Technology" message={`Are you sure you want to delete "${deleteDialog.item?.name}"?`} onConfirm={confirmDelete} onCancel={() => setDeleteDialog({ isOpen: false, item: null })} />

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white dark:bg-[#121620] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl w-full max-w-xl p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{formData.id ? 'Edit Technology' : 'Add Technology'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-1">Tech Name</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-1">Category</label>
                    <input type="text" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-1">React Icon Key</label>
                    <input type="text" required value={formData.icon_key || formData.icon || ''} onChange={e => setFormData({...formData, icon_key: e.target.value})} placeholder="FaReact, SiJavascript..." className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-1">Brand Color</label>
                    <input type="color" value={formData.color || '#6C63FF'} onChange={e => setFormData({...formData, color: e.target.value})} className="w-full h-10 bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-2 cursor-pointer" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-1">Level (0-100%)</label>
                    <input type="number" min="0" max="100" required value={formData.level} onChange={e => setFormData({...formData, level: parseInt(e.target.value) || 80})} className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-1">Description / Tooltip</label>
                  <input type="text" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]" />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-600 dark:text-[#CBD5E1] hover:bg-slate-100 dark:hover:bg-white/5">Cancel</button>
                  <button type="submit" disabled={isSaving} className="px-6 py-2 rounded-xl bg-[#7C5CFF] hover:bg-[#6C63FF] text-white font-medium transition-colors disabled:opacity-50 shadow-md">{isSaving ? 'Saving...' : 'Save Tech'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminTechnologies;
