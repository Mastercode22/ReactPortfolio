import React, { useState, useEffect } from 'react';
import { adminFetch } from '../../services/api';
import AdminTable from '../../components/admin/AdminTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { showToast } from '../../components/admin/Toast';
import { MessageSquare, Mail, Trash2, CheckCircle, Clock, Eye, Loader2 } from 'lucide-react';

export const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await adminFetch('/admin/messages');
      if (data) setMessages(data);
    } catch (err) {
      showToast('Failed to load messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMessage = async (msg) => {
    setSelectedMessage(msg);
    if (msg.status === 'unread') {
      try {
        await adminFetch(`/admin/messages/${msg.id}/read`, { method: 'PUT' });
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, status: 'read' } : m))
        );
      } catch (err) {
        // silent update failure
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await adminFetch(`/admin/messages/${deleteId}`, { method: 'DELETE' });
      showToast('Message deleted');
      if (selectedMessage?.id === deleteId) setSelectedMessage(null);
      setDeleteId(null);
      fetchMessages();
    } catch (err) {
      showToast('Failed to delete message', 'error');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white">Inbound Contact Messages</h1>
        <p className="text-sm text-[#CBD5E1] mt-1">View and manage messages sent through your website contact form.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Messages List Table */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#121620] border border-white/10 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#7C5CFF]" /> Message Inbox ({messages.length})
          </h2>

          <AdminTable
            columns={[
              { key: 'name', label: 'Sender' },
              { key: 'subject', label: 'Subject' },
              {
                key: 'status',
                label: 'Status',
                render: (row) => (
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      row.status === 'unread'
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30 animate-pulse'
                        : 'bg-slate-700/50 text-slate-400'
                    }`}
                  >
                    {row.status}
                  </span>
                ),
              },
              {
                key: 'created_at',
                label: 'Received',
                render: (row) => (
                  <span className="text-xs text-slate-400">
                    {new Date(row.created_at).toLocaleDateString()}
                  </span>
                ),
              },
            ]}
            data={messages}
            actions={(row) => (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenMessage(row)}
                  className="p-1.5 text-slate-300 hover:text-white"
                  title="View Message"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteId(row.id)}
                  className="p-1.5 text-rose-400 hover:text-rose-300"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          />
        </div>

        {/* Message Reader Pane */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#121620] border border-white/10 space-y-6">
          <h2 className="text-lg font-bold text-white">Message Details</h2>

          {selectedMessage ? (
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-4 space-y-2">
                <span className="text-xs font-extrabold uppercase text-[#7C5CFF]">
                  {selectedMessage.subject || 'No Subject'}
                </span>
                <h3 className="text-xl font-bold text-white">{selectedMessage.name}</h3>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-[#7C5CFF]" />
                  <a href={`mailto:${selectedMessage.email}`} className="hover:underline text-[#7C5CFF]">
                    {selectedMessage.email}
                  </a>
                </div>
                <p className="text-[11px] text-slate-500 pt-1">
                  Sent: {new Date(selectedMessage.created_at).toLocaleString()}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#1E293B] border border-white/10 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap min-h-[160px]">
                {selectedMessage.message}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject || '')}`}
                  className="flex-1 py-2.5 rounded-xl font-bold text-xs bg-[#7C5CFF] text-white flex items-center justify-center gap-2 hover:bg-[#6C63FF]"
                >
                  <Mail className="w-4 h-4" /> Reply via Email
                </a>
                <button
                  onClick={() => setDeleteId(selectedMessage.id)}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500 text-sm">
              Select a message from the list to view its full details and reply.
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Contact Message?"
        message="Are you sure you want to delete this message?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default AdminMessages;
