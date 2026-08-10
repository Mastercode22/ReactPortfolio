import React, { useState, useEffect } from 'react';
import { adminFetch } from '../../services/api';
import { useToast } from '../../components/admin/Toast';
import AdminTable from '../../components/admin/AdminTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { Link, useNavigate } from 'react-router-dom';

export const AdminProjects = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, item: null });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const data = await adminFetch('/admin/projects');
      if (Array.isArray(data)) setProjects(data);
    } catch (error) {
      showToast('Failed to load projects', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item) => {
    navigate(`/admin/projects/${item.id}/edit`);
  };

  const handleDeleteClick = (item) => setDeleteDialog({ isOpen: true, item });

  const confirmDelete = async () => {
    try {
      await adminFetch(`/admin/projects/${deleteDialog.item.id}`, { method: 'DELETE' });
      showToast('Project deleted', 'success');
      setDeleteDialog({ isOpen: false, item: null });
      fetchProjects();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const togglePublish = async (item) => {
    try {
      await adminFetch(`/admin/projects/${item.id}/toggle`, { method: 'PUT' });
      showToast('Publication status toggled', 'success');
      fetchProjects();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const columns = [
    { key: 'title', label: 'Project Title', render: (val, row) => <div className="font-bold text-slate-900 dark:text-white">{val} <span className="text-xs font-normal text-slate-500 dark:text-slate-400">({row.slug})</span></div> },
    { key: 'category', label: 'Category' },
    {
      key: 'is_featured',
      label: 'Featured',
      render: (val) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${val ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-500'}`}>
          {val ? '⭐ Featured' : 'Standard'}
        </span>
      ),
    },
    {
      key: 'is_published',
      label: 'Status',
      render: (val, row) => (
        <button onClick={() => togglePublish(row)} className={`px-3 py-1 rounded-full text-xs font-bold ${val ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
          {val ? 'Published' : 'Draft'}
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Portfolio Projects</h1>
          <p className="text-sm text-slate-600 dark:text-[#CBD5E1]">Manage web applications, case studies, technologies, and live demo links.</p>
        </div>
        <Link to="/admin/projects/new" className="bg-[#7C5CFF] hover:bg-[#6C63FF] text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center gap-2 shadow-lg">
          <span>➕</span> Add Project
        </Link>
      </div>

      <AdminTable columns={columns} data={projects} onEdit={handleEdit} onDelete={handleDeleteClick} isLoading={isLoading} />

      <ConfirmDialog isOpen={deleteDialog.isOpen} title="Delete Project" message={`Are you sure you want to delete "${deleteDialog.item?.title}"?`} onConfirm={confirmDelete} onCancel={() => setDeleteDialog({ isOpen: false, item: null })} />
    </div>
  );
};

export default AdminProjects;
