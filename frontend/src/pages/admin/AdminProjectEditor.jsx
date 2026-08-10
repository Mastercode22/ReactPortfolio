import React, { useState, useEffect } from 'react';
import { adminFetch, API_BASE } from '../../services/api';
import { useToast } from '../../components/admin/Toast';
import { useParams, useNavigate } from 'react-router-dom';
import ImageUploader from '../../components/admin/ImageUploader';

export const AdminProjectEditor = () => {
  const { id } = useParams();
  const isEditing = id !== 'new' && id !== undefined;
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: '', slug: '', subtitle: '', category: '', description: '',
    challenges: '', solutions: '', architecture: '',
    is_featured: false, is_published: true,
    github_url: '', live_demo: '',
    image: ''
  });

  const [technologies, setTechnologies] = useState([]);
  const [techInput, setTechInput] = useState('');

  const [features, setFeatures] = useState([]);
  const [featureInput, setFeatureInput] = useState('');

  const [coverFile, setCoverFile] = useState(null);

  useEffect(() => {
    if (isEditing) {
      const fetchProject = async () => {
        try {
          const data = await adminFetch(`/admin/projects/${id}`);
          if (data) {
            setFormData({
              ...data,
              is_featured: !!data.is_featured,
              is_published: !!data.is_published,
              live_demo: data.live_demo || data.live_demo_url || '',
              image: data.image || data.cover_image || ''
            });
            if (data.technologies) setTechnologies(Array.isArray(data.technologies) ? data.technologies : []);
            if (data.features) setFeatures(Array.isArray(data.features) ? data.features : []);
          }
        } catch (error) {
          showToast('Failed to load project', 'error');
        } finally {
          setIsLoading(false);
        }
      };
      fetchProject();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'title' && !isEditing ? { slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') } : {})
    }));
  };

  const addItem = (e, setter, input, setInput) => {
    e.preventDefault();
    if (input.trim()) {
      setter(prev => [...prev, input.trim()]);
      setInput('');
    }
  };

  const removeItem = (index, setter) => {
    setter(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let imageUrl = formData.image;
      if (coverFile) {
        const fd = new FormData();
        fd.append('file', coverFile);
        const token = localStorage.getItem('admin_token');
        const imgRes = await fetch(`${API_BASE}/admin/media`, { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: fd });
        if (imgRes.ok) {
          const json = await imgRes.json();
          imageUrl = json.data?.public_url || json.url || imageUrl;
        }
      }

      const payload = {
        ...formData,
        image: imageUrl,
        technologies,
        features
      };

      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `/admin/projects/${id}` : '/admin/projects';

      await adminFetch(url, {
        method,
        body: JSON.stringify(payload)
      });

      showToast('Project saved successfully', 'success');
      navigate('/admin/projects');
    } catch (error) {
      showToast(error.message || 'Save failed', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-2 border-[#7C5CFF] border-t-transparent rounded-full"></div></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{isEditing ? 'Edit Project' : 'Create Project'}</h1>
        <div className="flex gap-3">
          <button onClick={() => navigate('/admin/projects')} className="px-6 py-2 rounded-xl text-slate-600 dark:text-[#CBD5E1] hover:bg-slate-100 dark:hover:bg-white/5 transition-colors font-medium">Cancel</button>
          <button onClick={handleSubmit} disabled={isSaving} className="px-6 py-2 rounded-xl bg-[#7C5CFF] hover:bg-[#6C63FF] text-white font-medium transition-colors disabled:opacity-50 shadow-lg">
            {isSaving ? 'Saving...' : 'Save Project'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white dark:bg-[#121620] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-2">Basic Info</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-1">Title</label>
                <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-1">Slug</label>
                <input type="text" name="slug" required value={formData.slug} onChange={handleChange} className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-1">Category</label>
                <input type="text" name="category" required value={formData.category} onChange={handleChange} className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-1">Subtitle</label>
                <input type="text" name="subtitle" value={formData.subtitle || ''} onChange={handleChange} className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-1">Description</label>
              <textarea name="description" required value={formData.description || ''} onChange={handleChange} rows="4" className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]"></textarea>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white dark:bg-[#121620] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-2">In-Depth Details</h2>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-1">Challenges</label>
              <textarea name="challenges" value={formData.challenges || ''} onChange={handleChange} rows="3" className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]"></textarea>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-1">Solutions</label>
              <textarea name="solutions" value={formData.solutions || ''} onChange={handleChange} rows="3" className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]"></textarea>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Settings & Links */}
          <div className="bg-white dark:bg-[#121620] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-2">Settings & Links</h2>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="is_published" checked={formData.is_published} onChange={handleChange} className="w-5 h-5 rounded border-slate-300 dark:border-white/20 bg-slate-100 dark:bg-[#1E293B] text-[#7C5CFF]" />
                <span className="text-slate-900 dark:text-white text-sm">Published</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="is_featured" checked={formData.is_featured} onChange={handleChange} className="w-5 h-5 rounded border-slate-300 dark:border-white/20 bg-slate-100 dark:bg-[#1E293B] text-[#7C5CFF]" />
                <span className="text-slate-900 dark:text-white text-sm">Featured Project</span>
              </label>
            </div>
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-1">Live Demo URL</label>
              <input type="url" name="live_demo" value={formData.live_demo || ''} onChange={handleChange} className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-[#CBD5E1] uppercase mb-1">GitHub URL</label>
              <input type="url" name="github_url" value={formData.github_url || ''} onChange={handleChange} className="w-full bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-4 py-2 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]" />
            </div>
          </div>

          {/* Media */}
          <div className="bg-white dark:bg-[#121620] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-2">Cover Image</h2>
            <ImageUploader currentImage={formData.image} onFileSelect={setCoverFile} />
          </div>

          {/* Lists */}
          <div className="bg-white dark:bg-[#121620] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-2 mb-3">Technologies</h2>
              <div className="flex gap-2 mb-2">
                <input type="text" value={techInput} onChange={e => setTechInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && addItem(e, setTechnologies, techInput, setTechInput)} placeholder="Add technology" className="flex-1 bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-3 py-1.5 text-sm text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]" />
                <button type="button" onClick={(e) => addItem(e, setTechnologies, techInput, setTechInput)} className="px-3 py-1.5 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-800 dark:text-white rounded-xl text-sm transition-colors font-medium">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech, idx) => (
                  <span key={idx} className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-2 py-1 rounded-lg text-sm text-slate-800 dark:text-[#CBD5E1] flex items-center gap-1">
                    {tech} <button type="button" onClick={() => removeItem(idx, setTechnologies)} className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 ml-1">×</button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 pb-2 mb-3">Features</h2>
              <div className="flex gap-2 mb-2">
                <input type="text" value={featureInput} onChange={e => setFeatureInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && addItem(e, setFeatures, featureInput, setFeatureInput)} placeholder="Add feature" className="flex-1 bg-slate-50 dark:bg-[#1E293B] border border-slate-300 dark:border-white/10 rounded-xl px-3 py-1.5 text-sm text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]" />
                <button type="button" onClick={(e) => addItem(e, setFeatures, featureInput, setFeatureInput)} className="px-3 py-1.5 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-800 dark:text-white rounded-xl text-sm transition-colors font-medium">Add</button>
              </div>
              <ul className="space-y-1">
                {features.map((feat, idx) => (
                  <li key={idx} className="flex justify-between items-center text-sm text-slate-800 dark:text-[#CBD5E1] bg-slate-100 dark:bg-white/5 p-2 rounded-lg">
                    <span className="truncate mr-2">• {feat}</span>
                    <button type="button" onClick={() => removeItem(idx, setFeatures)} className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 shrink-0">✕</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProjectEditor;
