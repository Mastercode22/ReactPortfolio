import React, { useState, useEffect } from 'react';
import { adminFetch } from '../../services/api';
import { useToast } from '../../components/admin/Toast';
import AdminTable from '../../components/admin/AdminTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminServices = () => {
  const { showToast } = useToast();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, item: null });

  const initialForm = { title: '', category: '', icon_name: '', description: '', grid_size: 'col-span-12 md:col-span-6', sort_order: 0, is_published: true, features: [] };
  const [formData, setFormData] = useState(initialForm);
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const data = await adminFetch('/admin/services');
      if (Array.isArray(data)) {
        setServices(data);
      }
    } catch (error) {
      showToast('Failed to load services', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      ...item,
      features: Array.isArray(item.features) ? item.features : []
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item) => setDeleteDialog({ isOpen: true, item });

  const confirmDelete = async () => {
    try {
      await adminFetch(`/admin/services/${deleteDialog.item.id}`, { method: 'DELETE' });
      showToast('Service deleted', 'success');
      setDeleteDialog({ isOpen: false, item: null });
      fetchServices();
    } catch (error) {
      showToast(error.message || 'Delete failed', 'error');
    }
  };

  const togglePublish = async (item) => {
    try {
      await adminFetch(`/admin/services/${item.id}/toggle`, { method: 'PUT' });
      showToast('Status toggled', 'success');
      fetchServices();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const method = formData.id ? 'PUT' : 'POST';
      const url = formData.id ? `/admin/services/${formData.id}` : '/admin/services';

      await adminFetch(url, {
        method,
        body: JSON.stringify(formData)
      });

      showToast(formData.id ? 'Service updated' : 'Service added', 'success');
      setIsModalOpen(false);
      fetchServices();
    } catch (error) {
      showToast(error.message || 'Save failed', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({ ...prev, features: [...(prev.features || []), newFeature.trim()] }));
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({ ...prev, features: (prev.features || []).filter((_, i) => i !== index) }));
  };

  const columns = [
    { key: 'icon_name', label: 'Icon' },
    { key: 'title', label: 'Title', render: (val) => <div className="font-medium text-slate-900 dark:text-white">{val}</div> },
    { key: 'category', label: 'Category' },
    { key: 'is_published', label: 'Status', render: (val, row) => (
      <button onClick={() => togglePublish(row)} className={`px-3 py-1 rounded-full text-xs font-medium ${val ? 'bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-gray-500/20 text-gray-600 dark:text-gray-400'}`}>
        {val ? 'Published' : 'Draft'}
      </button>
    )}
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Services</h1>
          <p className="text-sm text-slate-600 dark:text-[#CBD5E1]">Manage bento services grid and feature bullet points.</p>
        </div>
        <button onClick={() => { setFormData({ ...initialForm, sort_order: services.length + 1 }); setIsModalOpen(true); }} className="bg-[#7C5CFF] hover:bg-[#6C63FF] text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg">
          <span>➕</span> Add Service
        </button>
      </div>

      <AdminTable columns={columns} data={services} onEdit={handleEdit} onDelete={handleDeleteClick} isLoading={isLoading} />

      <ConfirmDialog isOpen={deleteDialog.isOpen} title="Delete Service" message={`Are you sure you want to delete "${deleteDialog.item?.title}"?`} onConfirm={confirmDelete} onCancel={() => setDeleteDialog({ isOpen: false, item: null })} />

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white dark:bg-[#121620] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">{formData.id ? 'Edit Service' : 'Add Service'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-1">Title</label>
                    <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-1">Category</label>
                    <input type="text" required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-1">Icon Name</label>
                    <input type="text" required value={formData.icon_name} onChange={e => setFormData({...formData, icon_name: e.target.value})} placeholder="e.g. Layout, Code, Globe" className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-1">Grid Size</label>
                    <select value={formData.grid_size} onChange={e => setFormData({...formData, grid_size: e.target.value})} className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]">
                      <option value="col-span-12 lg:col-span-7">7 Columns (Large)</option>
                      <option value="col-span-12 lg:col-span-5">5 Columns (Medium)</option>
                      <option value="col-span-12 lg:col-span-6">6 Columns (Half)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-1">Sort Order</label>
                    <input type="number" required value={formData.sort_order} onChange={e => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})} className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-1">Description</label>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3" className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]"></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-1">Features (Bullet points)</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={newFeature} onChange={e => setNewFeature(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addFeature())} placeholder="Add a feature bullet" className="flex-1 bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]" />
                    <button type="button" onClick={addFeature} className="px-4 py-2 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-800 dark:text-white rounded-xl transition-colors font-medium">Add</button>
                  </div>
                  <ul className="space-y-2">
                    {(formData.features || []).map((feat, idx) => (
                      <li key={idx} className="flex justify-between items-center bg-slate-100 dark:bg-[#1E293B] px-3 py-2 rounded-lg text-slate-800 dark:text-[#F8FAFC] text-sm">
                        <span>• {feat}</span>
                        <button type="button" onClick={() => removeFeature(idx)} className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300">✕</button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-3 py-2">
                  <input type="checkbox" checked={formData.is_published} onChange={e => setFormData({...formData, is_published: e.target.checked})} className="w-5 h-5 rounded border-slate-300 dark:border-white/20 bg-slate-100 dark:bg-[#1E293B] text-[#7C5CFF] focus:ring-[#7C5CFF]" />
                  <span className="text-slate-700 dark:text-[#CBD5E1]">Published</span>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-slate-600 dark:text-[#CBD5E1] hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">Cancel</button>
                  <button type="submit" disabled={isSaving} className="px-6 py-2 rounded-xl bg-[#7C5CFF] hover:bg-[#6C63FF] text-white font-medium transition-colors disabled:opacity-50 shadow-md">{isSaving ? 'Saving...' : 'Save Service'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminServices;
