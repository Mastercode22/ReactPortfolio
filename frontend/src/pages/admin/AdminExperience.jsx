import React, { useState, useEffect } from 'react';
import { adminFetch } from '../../services/api';
import { useToast } from '../../components/admin/Toast';
import AdminTable from '../../components/admin/AdminTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminExperience = () => {
  const { showToast } = useToast();
  const [expList, setExpList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, item: null });

  const initialForm = { role: '', company: '', location: '', type: 'Contract', period: '', description: '', sort_order: 0, is_active: true, achievements: [], skills: [] };
  const [formData, setFormData] = useState(initialForm);
  const [newAchieve, setNewAchieve] = useState('');
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    fetchExp();
  }, []);

  const fetchExp = async () => {
    setIsLoading(true);
    try {
      const data = await adminFetch('/admin/experience');
      if (Array.isArray(data)) setExpList(data);
    } catch (error) {
      showToast('Failed to load experience entries', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      ...item,
      achievements: Array.isArray(item.achievements) ? item.achievements : [],
      skills: Array.isArray(item.skills) ? item.skills : []
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item) => setDeleteDialog({ isOpen: true, item });

  const confirmDelete = async () => {
    try {
      await adminFetch(`/admin/experience/${deleteDialog.item.id}`, { method: 'DELETE' });
      showToast('Experience entry deleted', 'success');
      setDeleteDialog({ isOpen: false, item: null });
      fetchExp();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const method = formData.id ? 'PUT' : 'POST';
      const url = formData.id ? `/admin/experience/${formData.id}` : '/admin/experience';
      await adminFetch(url, { method, body: JSON.stringify(formData) });
      showToast(formData.id ? 'Experience updated' : 'Experience added', 'success');
      setIsModalOpen(false);
      fetchExp();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const addAchieve = () => {
    if (newAchieve.trim()) {
      setFormData(prev => ({ ...prev, achievements: [...(prev.achievements || []), newAchieve.trim()] }));
      setNewAchieve('');
    }
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData(prev => ({ ...prev, skills: [...(prev.skills || []), newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const columns = [
    { key: 'role', label: 'Role Title', render: (val) => <div className="font-bold text-white">{val}</div> },
    { key: 'company', label: 'Company / Agency' },
    { key: 'period', label: 'Period' },
    { key: 'sort_order', label: 'Order' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Career Experience</h1>
          <p className="text-sm text-[#CBD5E1]">Manage work history, agency contracts, achievements, and skill badges.</p>
        </div>
        <button onClick={() => { setFormData({ ...initialForm, sort_order: expList.length + 1 }); setIsModalOpen(true); }} className="bg-[#7C5CFF] hover:bg-[#6C63FF] text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2">
          <span>➕</span> Add Experience
        </button>
      </div>

      <AdminTable columns={columns} data={expList} onEdit={handleEdit} onDelete={handleDeleteClick} isLoading={isLoading} />

      <ConfirmDialog isOpen={deleteDialog.isOpen} title="Delete Experience" message={`Are you sure you want to delete "${deleteDialog.item?.role}"?`} onConfirm={confirmDelete} onCancel={() => setDeleteDialog({ isOpen: false, item: null })} />

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-[#121620] border border-white/10 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar p-6">
              <h2 className="text-xl font-bold text-white mb-6">{formData.id ? 'Edit Experience' : 'Add Experience'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-1">Role Title</label>
                    <input type="text" required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#7C5CFF]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-1">Company / Organization</label>
                    <input type="text" required value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#7C5CFF]" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-1">Period</label>
                    <input type="text" required value={formData.period} onChange={e => setFormData({...formData, period: e.target.value})} placeholder="2025 — Present" className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#7C5CFF]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-1">Location</label>
                    <input type="text" value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Remote / Ghana" className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#7C5CFF]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-1">Sort Order</label>
                    <input type="number" value={formData.sort_order} onChange={e => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})} className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#7C5CFF]" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-1">Description Overview</label>
                  <textarea value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} rows="3" className="w-full bg-[#1E293B] border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#7C5CFF]"></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#CBD5E1] uppercase mb-1">Key Achievements</label>
                  <div className="flex gap-2 mb-2">
                    <input type="text" value={newAchieve} onChange={e => setNewAchieve(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addAchieve())} placeholder="Add achievement bullet" className="flex-1 bg-[#1E293B] border border-white/10 rounded-xl px-4 py-2 text-white outline-none focus:border-[#7C5CFF]" />
                    <button type="button" onClick={addAchieve} className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl">Add</button>
                  </div>
                  <ul className="space-y-1">
                    {(formData.achievements || []).map((ach, idx) => (
                      <li key={idx} className="flex justify-between items-center bg-[#1E293B] px-3 py-1.5 rounded-lg text-[#F8FAFC] text-xs">
                        <span>✓ {ach}</span>
                        <button type="button" onClick={() => setFormData(p => ({ ...p, achievements: p.achievements.filter((_, i) => i !== idx) }))} className="text-red-400">✕</button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10 mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-[#CBD5E1] hover:bg-white/5">Cancel</button>
                  <button type="submit" disabled={isSaving} className="px-6 py-2 rounded-xl bg-[#7C5CFF] hover:bg-[#6C63FF] text-white font-medium transition-colors disabled:opacity-50">{isSaving ? 'Saving...' : 'Save Experience'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminExperience;
