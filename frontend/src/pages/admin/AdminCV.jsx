import React, { useState, useEffect, useRef } from 'react';
import { adminFetch, API_BASE } from '../../services/api';
import { useToast } from '../../components/admin/Toast';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

export const AdminCV = () => {
  const { showToast } = useToast();
  const [cvs, setCvs] = useState([]);
  const [downloads, setDownloads] = useState({ today: 0, week: 0, month: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [setAsActive, setSetAsActive] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null });
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [cvData, dlData] = await Promise.all([
        adminFetch('/admin/cv'),
        adminFetch('/admin/cv/downloads')
      ]);

      if (Array.isArray(cvData)) setCvs(cvData);
      if (dlData) {
        setDownloads({
          today: dlData.today || 0,
          week: dlData.this_week ?? dlData.week ?? 0,
          month: dlData.this_month ?? dlData.month ?? 0,
          total: dlData.total || 0,
        });
      }
    } catch (error) {
      showToast('Failed to load CV data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) validateAndSetFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) validateAndSetFile(e.target.files[0]);
  };

  const validateAndSetFile = (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    const validExts = ['pdf', 'doc', 'docx'];
    if (!validExts.includes(ext)) {
      showToast('Only PDF, DOC, and DOCX files are allowed', 'error');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast('File size exceeds 10MB limit', 'error');
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const token = localStorage.getItem('admin_token');
      const res = await fetch(`${API_BASE}/admin/cv/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      const resJson = await res.json();
      if (!res.ok || !resJson.success) throw new Error(resJson.message || 'Upload failed');

      showToast('CV uploaded successfully', 'success');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchData();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await adminFetch(`/admin/cv/${deleteDialog.id}`, { method: 'DELETE' });
      showToast('CV deleted', 'success');
      setDeleteDialog({ isOpen: false, id: null });
      fetchData();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handleActivate = async (id) => {
    try {
      await adminFetch(`/admin/cv/${id}/activate`, { method: 'PUT' });
      showToast('CV set to active', 'success');
      fetchData();
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-2 border-[#7C5CFF] border-t-transparent rounded-full"></div></div>;

  const activeCV = cvs.find(cv => cv.is_active || cv.is_active === 1);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">CV & Resume Manager</h1>
          <p className="text-sm text-[#CBD5E1]">Upload and manage active resume files and track download analytics.</p>
        </div>
      </div>

      {/* Active CV Card */}
      <div className="bg-[#121620] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 text-9xl pointer-events-none">📄</div>
        <h2 className="text-xl font-semibold text-white mb-4">Active CV File</h2>

        {activeCV ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl">
                📄
              </div>
              <div>
                <h3 className="text-white font-medium">{activeCV.original_filename || activeCV.filename}</h3>
                <p className="text-[#CBD5E1] text-sm">
                  {((activeCV.file_size || activeCV.size || 0) / (1024 * 1024)).toFixed(2)} MB • Uploaded on {new Date(activeCV.uploaded_at || activeCV.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <a href={`${API_BASE}/cv/download`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-[#7C5CFF] hover:bg-[#6C63FF] text-white rounded-lg transition-colors font-medium text-sm">
                Download Active CV
              </a>
              <button onClick={() => setDeleteDialog({ isOpen: true, id: activeCV.id })} className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors font-medium text-sm">
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-[#CBD5E1] bg-white/5 border border-white/10 rounded-xl border-dashed">
            No active CV found. Drag & drop a CV file below to upload.
          </div>
        )}
      </div>

      {/* Upload Section */}
      <div className="bg-[#121620] border border-white/10 rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-white mb-4">Upload New CV File</h2>

        <div
          className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer ${dragActive ? 'border-[#7C5CFF] bg-[#7C5CFF]/10' : 'border-white/20 bg-white/5 hover:border-white/40'}`}
          onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleChange} />
          <div className="text-4xl mb-4">📁</div>
          {selectedFile ? (
            <div>
              <p className="text-white font-medium text-lg">{selectedFile.name}</p>
              <p className="text-[#CBD5E1]">{(selectedFile.size / (1024*1024)).toFixed(2)} MB</p>
            </div>
          ) : (
            <div>
              <p className="text-white font-medium text-lg">Drag & Drop your CV here</p>
              <p className="text-[#CBD5E1]">or Click to Browse (PDF, DOC, DOCX up to 10MB)</p>
            </div>
          )}
        </div>

        {selectedFile && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={setAsActive} onChange={e => setSetAsActive(e.target.checked)} className="w-5 h-5 rounded border-white/20 bg-[#1E293B] text-[#7C5CFF]" />
              <span className="text-[#CBD5E1]">Set as Active CV</span>
            </label>
            <div className="flex gap-3 w-full sm:w-auto">
              <button onClick={() => {setSelectedFile(null); if(fileInputRef.current) fileInputRef.current.value = '';}} className="flex-1 sm:flex-none px-6 py-2 rounded-lg border border-white/20 text-[#CBD5E1] hover:bg-white/10 transition-colors">
                Cancel
              </button>
              <button onClick={handleUpload} disabled={isUploading} className="flex-1 sm:flex-none px-6 py-2 rounded-lg bg-[#7C5CFF] hover:bg-[#6C63FF] text-white font-medium transition-colors disabled:opacity-50">
                {isUploading ? 'Uploading...' : 'Upload CV'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Analytics */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Download Analytics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#121620] border border-white/10 p-4 rounded-xl text-center">
            <p className="text-[#CBD5E1] text-sm mb-1">Today</p>
            <p className="text-2xl font-bold text-white">{downloads.today}</p>
          </div>
          <div className="bg-[#121620] border border-white/10 p-4 rounded-xl text-center">
            <p className="text-[#CBD5E1] text-sm mb-1">This Week</p>
            <p className="text-2xl font-bold text-white">{downloads.week}</p>
          </div>
          <div className="bg-[#121620] border border-white/10 p-4 rounded-xl text-center">
            <p className="text-[#CBD5E1] text-sm mb-1">This Month</p>
            <p className="text-2xl font-bold text-white">{downloads.month}</p>
          </div>
          <div className="bg-[#121620] border border-white/10 p-4 rounded-xl text-center">
            <p className="text-[#CBD5E1] text-sm mb-1">All Time</p>
            <p className="text-2xl font-bold text-white">{downloads.total}</p>
          </div>
        </div>
      </div>

      {/* List of past CVs */}
      {cvs.length > 1 && (
         <div className="bg-[#121620] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
           <h2 className="text-xl font-semibold text-white">CV History</h2>
           <div className="space-y-3">
             {cvs.filter(cv => !cv.is_active && cv.is_active !== 1).map(cv => (
               <div key={cv.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                 <div className="flex items-center gap-3">
                    <span className="text-xl">📄</span>
                    <div>
                      <p className="text-white text-sm font-medium">{cv.original_filename || cv.filename}</p>
                      <p className="text-[#CBD5E1] text-xs">{((cv.file_size || cv.size || 0) / (1024*1024)).toFixed(2)} MB • {new Date(cv.uploaded_at || cv.created_at).toLocaleDateString()}</p>
                    </div>
                 </div>
                 <div className="flex gap-2">
                   <button onClick={() => handleActivate(cv.id)} className="px-3 py-1 text-xs font-bold bg-[#7C5CFF]/20 text-[#7C5CFF] rounded-lg hover:bg-[#7C5CFF]/30">Set Active</button>
                   <button onClick={() => setDeleteDialog({ isOpen: true, id: cv.id })} className="px-3 py-1 text-xs font-bold bg-rose-500/20 text-rose-400 rounded-lg hover:bg-rose-500/30">Delete</button>
                 </div>
               </div>
             ))}
           </div>
         </div>
      )}

      <ConfirmDialog 
        isOpen={deleteDialog.isOpen} 
        title="Delete CV File" 
        message="Are you sure you want to delete this CV file?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, id: null })}
      />
    </div>
  );
};

export default AdminCV;
