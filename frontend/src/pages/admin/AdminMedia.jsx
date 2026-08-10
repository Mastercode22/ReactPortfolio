import React, { useState, useEffect } from 'react';
import { adminFetch, API_BASE } from '../../services/api';
import ImageUploader from '../../components/admin/ImageUploader';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { showToast } from '../../components/admin/Toast';
import { Image, Copy, Trash2, Loader2, Check } from 'lucide-react';

export const AdminMedia = () => {
  const [mediaList, setMediaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const data = await adminFetch('/admin/media');
      if (data) setMediaList(data);
    } catch (err) {
      showToast('Failed to load media library', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/admin/media`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin_token')}`,
        },
        body: formData,
      });
      const json = await res.json();
      if (json.success) {
        showToast('Media uploaded successfully!');
        fetchMedia();
      } else {
        showToast(json.message || 'Upload failed', 'error');
      }
    } catch (err) {
      showToast('Error uploading file', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleCopyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('Public URL copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminFetch(`/admin/media/${deleteId}`, { method: 'DELETE' });
      showToast('Media deleted');
      setDeleteId(null);
      fetchMedia();
    } catch (err) {
      showToast('Failed to delete media', 'error');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Media Library & File Assets</h1>
        <p className="text-sm text-slate-600 dark:text-[#CBD5E1] mt-1">Upload images, logos, and banners to generate static public URLs for your portfolio.</p>
      </div>

      {/* Upload Box */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200 dark:border-white/10 space-y-4 shadow-xl">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Image className="w-5 h-5 text-[#7C5CFF]" /> Upload New Asset
        </h2>
        <ImageUploader onFileSelect={handleFileUpload} accept="image/*" maxSizeMB={5} />
        {uploading && (
          <div className="flex items-center gap-2 text-xs font-bold text-[#7C5CFF]">
            <Loader2 className="w-4 h-4 animate-spin" /> Uploading media asset...
          </div>
        )}
      </div>

      {/* Media Grid */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200 dark:border-white/10 space-y-6 shadow-xl">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Uploaded Files ({mediaList.length})</h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-[#7C5CFF] animate-spin" />
          </div>
        ) : mediaList.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            No media assets found. Upload images above to get started.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {mediaList.map((item) => (
              <div key={item.id} className="group relative rounded-2xl overflow-hidden bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-white/10 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
                <div className="h-32 w-full bg-slate-100 dark:bg-slate-950/40 flex items-center justify-center p-2 overflow-hidden">
                  <img
                    src={item.public_url || item.file_path}
                    alt={item.original_filename}
                    className="max-h-full max-w-full object-contain transition-transform group-hover:scale-105"
                  />
                </div>

                <div className="p-3 space-y-2">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate" title={item.original_filename}>
                    {item.original_filename}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    {(item.file_size / 1024).toFixed(1)} KB
                  </p>

                  <div className="flex items-center gap-2 pt-1 border-t border-slate-200 dark:border-white/10">
                    <button
                      onClick={() => handleCopyUrl(item.public_url || item.file_path, item.id)}
                      className="flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white hover:bg-[#7C5CFF] hover:text-white transition-colors flex items-center justify-center gap-1"
                    >
                      {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-500 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === item.id ? 'Copied!' : 'Copy URL'}</span>
                    </button>
                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="p-1.5 rounded-lg text-rose-500 dark:text-rose-400 hover:bg-rose-500/10 dark:hover:bg-rose-500/20"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Media File?"
        message="Are you sure you want to permanently delete this media asset?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default AdminMedia;
