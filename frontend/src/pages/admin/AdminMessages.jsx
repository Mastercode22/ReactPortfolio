import React, { useState, useEffect, useRef } from 'react';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { showToast } from '../../components/admin/Toast';
import {
  MessageSquare, Mail, Trash2, Clock, Eye,
  Loader2, Search, Phone, Building2, Briefcase,
  Inbox, CheckCheck, Archive, Send, RefreshCw, Calendar,
  MailOpen, X, Reply, ChevronDown
} from 'lucide-react';
import {
  getMessages, getMessageDetails, markMessageRead,
  updateMessageStatus, deleteMessage, getMessageStats, sendReply,
  getReplies, logVisitorReply
} from '../../services/contactService';

/* ─── helpers ──────────────────────────────────────────────── */
const parseDate = (s) => {
  if (!s) return null;
  const d = new Date(String(s).replace(' ', 'T'));
  return isNaN(d.getTime()) ? null : d;
};
const fmtFull  = (s) => parseDate(s)?.toLocaleString(undefined, { year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' }) ?? 'N/A';
const fmtShort = (s) => parseDate(s)?.toLocaleDateString(undefined, { month:'short', day:'numeric' }) ?? 'N/A';

const STATUS_META = {
  unread:   { color: 'bg-sky-500/20 text-sky-500 border-sky-500/30',         dot: 'bg-sky-500'     },
  new:      { color: 'bg-sky-500/20 text-sky-500 border-sky-500/30',         dot: 'bg-sky-500'     },
  read:     { color: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30', dot: 'bg-emerald-500' },
  replied:  { color: 'bg-purple-500/20 text-purple-500 border-purple-500/30', dot: 'bg-purple-500'  },
  archived: { color: 'bg-slate-500/20 text-slate-400 border-slate-500/30',   dot: 'bg-slate-400'   },
};
const statusMeta = (s) => STATUS_META[s] ?? STATUS_META.read;

/* ─── StatusBadge ───────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const m = statusMeta(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${m.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {status || '—'}
    </span>
  );
};

/* ─── ReplyPanel ────────────────────────────────────────────── */
const ReplyPanel = ({ message, onReplied }) => {
  const [open, setOpen]       = useState(false);
  const [body, setBody]       = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  const handleSend = async () => {
    if (!body.trim()) { setError('Please write a reply before sending.'); return; }
    setError('');
    setSending(true);
    try {
      await sendReply(message.id, body.trim());
      setSent(true);
      showToast(`Reply sent to ${message.email} ✓`, 'success');
      onReplied?.();
      // Auto-close after 2 s
      setTimeout(() => { setOpen(false); setSent(false); setBody(''); }, 2000);
    } catch (err) {
      setError(err?.message || 'Failed to send reply. Check SMTP settings.');
    } finally {
      setSending(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => { setOpen(true); setSent(false); setError(''); }}
        className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-[#7C5CFF] hover:bg-[#6C63FF] text-white flex items-center justify-center gap-2 shadow-md transition-all"
      >
        <Reply className="w-4 h-4" /> Reply to {message.name?.split(' ')[0] || 'Sender'}
      </button>
    );
  }

  return (
    <div className="w-full space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-[#1E293B] border border-[#7C5CFF]/40">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold text-[#7C5CFF] uppercase tracking-wider flex items-center gap-2">
          <Reply className="w-3.5 h-3.5" /> Compose Reply
        </span>
        <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* To / Subject */}
      <div className="space-y-1.5 text-[11px] font-semibold text-slate-500">
        <div className="flex items-center gap-2 bg-white dark:bg-white/5 px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10">
          <span className="text-slate-400 w-12 shrink-0">To:</span>
          <span className="text-slate-800 dark:text-white">{message.name} &lt;{message.email}&gt;</span>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-white/5 px-3 py-2 rounded-lg border border-slate-200 dark:border-white/10">
          <span className="text-slate-400 w-12 shrink-0">Subject:</span>
          <span className="text-slate-800 dark:text-white">Re: {message.subject || 'Your Enquiry'}</span>
        </div>
      </div>

      {/* Textarea */}
      <textarea
        rows={6}
        value={body}
        onChange={(e) => { setBody(e.target.value); setError(''); }}
        disabled={sending || sent}
        placeholder={`Hi ${message.name?.split(' ')[0] || ''},\n\nThank you for reaching out...`}
        className="w-full px-3 py-2.5 rounded-xl text-xs font-medium bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF] resize-none leading-relaxed disabled:opacity-60"
      />

      {/* Error */}
      {error && (
        <p className="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
          <X className="w-3 h-3" /> {error}
        </p>
      )}

      {/* Success */}
      {sent && (
        <p className="text-[11px] text-emerald-500 font-bold flex items-center gap-1">
          <CheckCheck className="w-3.5 h-3.5" /> Reply sent! Status set to Replied.
        </p>
      )}

      {/* Note */}
      {!sent && (
        <p className="text-[10px] text-slate-400 leading-relaxed">
          Your reply will be sent directly to <strong>{message.email}</strong> via SMTP and the message will be marked as <strong>Replied</strong>.
        </p>
      )}

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleSend}
          disabled={sending || sent}
          className="flex-1 py-2.5 px-4 rounded-xl font-extrabold text-xs bg-[#7C5CFF] hover:bg-[#6C63FF] text-white flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-60"
        >
          {sending
            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending...</>
            : sent
              ? <><CheckCheck className="w-3.5 h-3.5" /> Sent!</>
              : <><Send className="w-3.5 h-3.5" /> Send Reply</>
          }
        </button>
        <button
          onClick={() => setOpen(false)}
          disabled={sending}
          className="py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white hover:bg-slate-300 dark:hover:bg-white/20 transition-all disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

/* ─── LogVisitorReplyPanel ──────────────────────────────────── */
const LogVisitorReplyPanel = ({ message, onReplied }) => {
  const [open, setOpen]       = useState(false);
  const [body, setBody]       = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError]     = useState('');

  const handleLog = async () => {
    if (!body.trim()) { setError('Please write visitor reply content.'); return; }
    setError('');
    setSending(true);
    try {
      await logVisitorReply(message.id, body.trim());
      showToast('Visitor reply logged ✓', 'success');
      onReplied?.();
      setOpen(false);
      setBody('');
    } catch (err) {
      setError(err?.message || 'Failed to log reply.');
    } finally {
      setSending(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => { setOpen(true); setError(''); }}
        className="flex-1 py-3 px-4 rounded-xl font-bold text-xs bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 dark:hover:bg-emerald-500/30 flex items-center justify-center gap-2 transition-all"
      >
        <MailOpen className="w-4 h-4" /> Log Visitor Reply
      </button>
    );
  }

  return (
    <div className="w-full space-y-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/40">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <MailOpen className="w-3.5 h-3.5" /> Log Visitor Reply
        </span>
        <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Note */}
      <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 leading-relaxed">
        If the visitor replied to your email inbox, paste their response here to save it to this conversation timeline.
      </p>

      {/* Textarea */}
      <textarea
        rows={4}
        value={body}
        onChange={(e) => { setBody(e.target.value); setError(''); }}
        disabled={sending}
        placeholder={`Paste message here...`}
        className="w-full px-3 py-2.5 rounded-xl text-xs font-medium bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:border-emerald-500 resize-none leading-relaxed disabled:opacity-60"
      />

      {error && (
        <p className="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
          <X className="w-3 h-3" /> {error}
        </p>
      )}

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleLog}
          disabled={sending}
          className="flex-1 py-2 px-3 rounded-xl font-extrabold text-xs bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 shadow transition-all disabled:opacity-60"
        >
          {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCheck className="w-3.5 h-3.5" />}
          Log Message
        </button>
        <button
          onClick={() => setOpen(false)}
          disabled={sending}
          className="py-2 px-3 rounded-xl font-bold text-xs bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-white hover:bg-slate-300 dark:hover:bg-white/20 transition-all disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

/* ─── Main Component ────────────────────────────────────────── */
export const AdminMessages = () => {
  const [messages, setMessages]           = useState([]);
  const [stats, setStats]                 = useState(null);
  const [loading, setLoading]             = useState(true);
  const [activeFilter, setActiveFilter]   = useState('all');
  const [searchQuery, setSearchQuery]     = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [detailsLoading, setDetailsLoading]   = useState(false);
  const [deleteId, setDeleteId]           = useState(null);
  const [updatingStatus, setUpdatingStatus]   = useState(false);
  const [replies, setReplies]             = useState([]);

  useEffect(() => { fetchData(); }, [activeFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [msgData, statsData] = await Promise.all([
        getMessages(activeFilter, searchQuery),
        getMessageStats(),
      ]);
      if (Array.isArray(msgData))  setMessages(msgData);
      if (statsData) setStats(statsData);
    } catch {
      showToast('Failed to load messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = async () => {
    try { const s = await getMessageStats(); if (s) setStats(s); } catch {}
  };

  const refreshReplies = async (msgId) => {
    try {
      const repliesData = await getReplies(msgId);
      if (Array.isArray(repliesData)) setReplies(repliesData);
    } catch {}
  };

  /* Open message → load details + auto-mark read */
  const handleOpenMessage = async (msg) => {
    setDetailsLoading(true);
    try {
      const details = await getMessageDetails(msg.id);
      const resolved = details || msg;
      setSelectedMessage(resolved);
      
      const repliesData = await getReplies(msg.id);
      if (Array.isArray(repliesData)) {
        setReplies(repliesData);
      } else {
        setReplies([]);
      }

      // Optimistically update local list
      setMessages(prev =>
        prev.map(m => m.id === msg.id
          ? { ...m, is_read: 1, status: m.status === 'unread' || m.status === 'new' ? 'read' : m.status }
          : m
        )
      );
      await refreshStats();
    } catch {
      setSelectedMessage(msg);
      setReplies([]);
    } finally {
      setDetailsLoading(false);
    }
  };

  /* Toggle read/unread */
  const handleToggleRead = async (msg, markAsRead) => {
    setUpdatingStatus(true);
    try {
      await markMessageRead(msg.id, markAsRead);
      const newStatus = markAsRead ? 'read' : 'unread';
      const newRead   = markAsRead ? 1 : 0;
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: newRead, status: newStatus } : m));
      if (selectedMessage?.id === msg.id) setSelectedMessage(prev => ({ ...prev, is_read: newRead, status: newStatus }));
      showToast(markAsRead ? 'Marked as read ✓' : 'Marked as unread');
      await refreshStats();
    } catch { showToast('Failed to update', 'error'); }
    finally  { setUpdatingStatus(false); }
  };

  /* Change status from dropdown */
  const handleStatusChange = async (msgId, newStatus) => {
    setUpdatingStatus(true);
    try {
      await updateMessageStatus(msgId, newStatus);
      const isReadVal = (newStatus === 'unread' || newStatus === 'new') ? 0 : 1;
      setMessages(prev => prev.map(m => m.id === msgId ? { ...m, status: newStatus, is_read: isReadVal } : m));
      if (selectedMessage?.id === msgId) setSelectedMessage(prev => ({ ...prev, status: newStatus, is_read: isReadVal }));
      showToast(`Status → ${newStatus}`);
      await refreshStats();
    } catch { showToast('Failed to update status', 'error'); }
    finally  { setUpdatingStatus(false); }
  };

  /* Delete */
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMessage(deleteId);
      showToast('Message deleted');
      if (selectedMessage?.id === deleteId) setSelectedMessage(null);
      setDeleteId(null);
      fetchData();
    } catch { showToast('Failed to delete', 'error'); }
  };

  /* Called after reply sent */
  const handleAfterReply = async () => {
    await handleStatusChange(selectedMessage.id, 'replied');
    await refreshReplies(selectedMessage.id);
  };

  const handleAfterVisitorReply = async () => {
    setMessages(prev => prev.map(m => m.id === selectedMessage.id ? { ...m, status: 'unread', is_read: 0 } : m));
    setSelectedMessage(prev => ({ ...prev, status: 'unread', is_read: 0 }));
    await refreshReplies(selectedMessage.id);
    await refreshStats();
  };

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-[#7C5CFF]" /> Inbound Contact Messages
          </h1>
          <p className="text-sm text-slate-600 dark:text-[#CBD5E1] mt-1">
            Manage contact form inquiries sent directly to your MySQL database.
          </p>
        </div>
        <button
          onClick={fetchData} disabled={loading}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl font-bold text-xs bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 text-slate-800 dark:text-white flex items-center gap-2 transition-all shadow"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh Inbox
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Total',     value: stats?.total_messages      ?? 0, icon: Inbox,    color: 'text-blue-500 bg-blue-500/10' },
          { label: 'Unread',    value: stats?.unread_messages     ?? 0, icon: Mail,     color: 'text-sky-500 bg-sky-500/10' },
          { label: 'Read',      value: stats?.read_messages       ?? 0, icon: CheckCheck,color:'text-emerald-500 bg-emerald-500/10' },
          { label: 'Replied',   value: stats?.replied_messages    ?? 0, icon: Send,     color: 'text-purple-500 bg-purple-500/10' },
          { label: 'Today',     value: stats?.messages_today      ?? 0, icon: Clock,    color: 'text-amber-500 bg-amber-500/10' },
          { label: 'This Month',value: stats?.messages_this_month ?? 0, icon: Calendar, color: 'text-indigo-500 bg-indigo-500/10' },
        ].map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-[#121620] border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-md flex items-center gap-3">
            <div className={`p-2.5 rounded-xl shrink-0 ${item.color}`}><item.icon className="w-5 h-5" /></div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 block truncate">{item.label}</span>
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">{item.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters & Search ── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white dark:bg-[#121620] p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-md">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all',      label: 'All Messages' },
            { id: 'unread',   label: `Unread (${stats?.unread_messages ?? 0})` },
            { id: 'read',     label: 'Read' },
            { id: 'replied',  label: 'Replied' },
            { id: 'archived', label: 'Archived' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveFilter(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeFilter === tab.id
                  ? 'bg-[#7C5CFF] text-white shadow-md'
                  : 'text-slate-600 dark:text-[#CBD5E1] hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >{tab.label}</button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); fetchData(); }} className="relative min-w-[240px]">
          <input
            type="text" placeholder="Search sender, email, subject..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs font-medium bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF]"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </form>
      </div>

      {/* ── Main Grid: Table + Details ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── Inbox Table ── */}
        <div className="lg:col-span-7 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200 dark:border-white/10 shadow-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Inbox className="w-5 h-5 text-[#7C5CFF]" /> Inbox
              <span className="ml-1 px-2 py-0.5 rounded-full bg-[#7C5CFF]/15 text-[#7C5CFF] text-xs font-black">{messages.length}</span>
            </h2>
            {updatingStatus && <Loader2 className="w-4 h-4 animate-spin text-[#7C5CFF]" />}
          </div>

          {loading ? (
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {[1,2,3,4].map(i => (
                <div key={i} className="flex gap-4 px-6 py-4 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-white/10 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-slate-200 dark:bg-white/10 rounded w-2/3" />
                    <div className="h-2.5 bg-slate-100 dark:bg-white/5 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="py-20 text-center text-slate-400 space-y-3">
              <Inbox className="w-12 h-12 mx-auto text-slate-200 dark:text-slate-700" />
              <p className="text-sm font-medium">No messages found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {messages.map(msg => {
                const isUnread   = Number(msg.is_read) === 0;
                const isSelected = selectedMessage?.id === msg.id;
                const initial    = (msg.name || '?').charAt(0).toUpperCase();
                return (
                  <div
                    key={msg.id}
                    onClick={() => handleOpenMessage(msg)}
                    className={`flex items-start gap-4 px-6 py-4 cursor-pointer transition-all group
                      ${isSelected ? 'bg-[#7C5CFF]/8 dark:bg-[#7C5CFF]/10 border-l-2 border-[#7C5CFF]' : 'hover:bg-slate-50 dark:hover:bg-white/[0.02] border-l-2 border-transparent'}
                    `}
                  >
                    {/* Avatar */}
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-extrabold shrink-0 transition-transform group-hover:scale-105
                      ${isUnread ? 'bg-[#7C5CFF] text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300'}`}>
                      {initial}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <span className={`text-sm truncate ${isUnread ? 'font-extrabold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                          {msg.name || 'Unknown Sender'}
                        </span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">{fmtShort(msg.created_at)}</span>
                      </div>
                      <p className={`text-xs truncate mb-1.5 ${isUnread ? 'font-bold text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                        {msg.subject || 'No Subject'}
                      </p>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={msg.status} />
                        {isUnread && <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />}
                      </div>
                    </div>

                    {/* Row actions */}
                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => handleToggleRead(msg, isUnread)}
                        title={isUnread ? 'Mark as Read' : 'Mark as Unread'}
                        className="p-1.5 rounded-lg hover:bg-[#7C5CFF]/10 text-slate-400 hover:text-[#7C5CFF] transition-colors"
                      >
                        {isUnread ? <MailOpen className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => setDeleteId(msg.id)}
                        title="Delete"
                        className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Details Pane ── */}
        <div className="lg:col-span-5 rounded-3xl bg-white dark:bg-[#121620] border border-slate-200 dark:border-white/10 shadow-xl flex flex-col">

          {/* Pane header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">Message Details</h2>
            {selectedMessage && (
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Status</label>
                <select
                  value={selectedMessage.status || 'read'}
                  onChange={(e) => handleStatusChange(selectedMessage.id, e.target.value)}
                  disabled={updatingStatus}
                  className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:border-[#7C5CFF] cursor-pointer"
                >
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            )}
          </div>

          {/* Pane body */}
          <div className="flex-1 overflow-y-auto p-6">
            {detailsLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin text-[#7C5CFF]" />
                <span className="text-xs font-medium">Loading details...</span>
              </div>
            ) : selectedMessage ? (
              <div className="space-y-5">

                {/* Subject chip */}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-[#7C5CFF]/15 text-[#7C5CFF]">
                  <MessageSquare className="w-3.5 h-3.5" />
                  {selectedMessage.subject || 'No Subject'}
                </span>

                {/* Sender name */}
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {selectedMessage.name}
                </h3>

                {/* Meta grid */}
                <div className="space-y-2 pb-2 border-b border-slate-100 dark:border-white/5">
                  <MetaRow icon={<Mail className="w-4 h-4 text-[#7C5CFF]" />}>
                    <a href={`mailto:${selectedMessage.email}`} className="text-[#7C5CFF] font-bold hover:underline">
                      {selectedMessage.email}
                    </a>
                  </MetaRow>
                  {selectedMessage.phone && (
                    <MetaRow icon={<Phone className="w-4 h-4 text-emerald-500" />}>
                      <a href={`tel:${selectedMessage.phone}`} className="hover:underline">{selectedMessage.phone}</a>
                    </MetaRow>
                  )}
                  {selectedMessage.company && (
                    <MetaRow icon={<Building2 className="w-4 h-4 text-purple-500" />}>
                      {selectedMessage.company}
                    </MetaRow>
                  )}
                  {selectedMessage.project_type && (
                    <MetaRow icon={<Briefcase className="w-4 h-4 text-amber-500" />}>
                      {selectedMessage.project_type}
                    </MetaRow>
                  )}
                  <MetaRow icon={<Clock className="w-3.5 h-3.5 text-slate-400" />} small>
                    Received: {fmtFull(selectedMessage.created_at)}
                  </MetaRow>
                </div>

                {/* Conversation History / Timeline */}
                <div className="space-y-4">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Conversation History</span>
                  
                  <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
                    {/* Original Message (From Visitor) */}
                    <div className="flex flex-col items-start gap-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                        <span className="text-[#7C5CFF]">{selectedMessage.name} (Visitor)</span>
                        <span>•</span>
                        <span>{fmtFull(selectedMessage.created_at)}</span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap w-full max-w-[90%]">
                        {selectedMessage.message}
                      </div>
                    </div>

                    {/* Replies Thread */}
                    {replies.map((rep) => {
                      const isAdmin = rep.direction === 'admin';
                      return (
                        <div key={rep.id} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'} gap-1`}>
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                            <span className={isAdmin ? 'text-[#7C5CFF]' : 'text-emerald-500'}>
                              {isAdmin ? 'You (Admin)' : `${selectedMessage.name} (Visitor)`}
                            </span>
                            <span>•</span>
                            <span>{fmtFull(rep.created_at)}</span>
                          </div>
                          <div className={`p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap w-full max-w-[90%] border
                            ${isAdmin 
                              ? 'bg-[#7C5CFF]/10 border-[#7C5CFF]/20 text-slate-800 dark:text-slate-200' 
                              : 'bg-emerald-500/10 border-emerald-500/20 text-slate-800 dark:text-slate-200'}`}
                          >
                            {rep.body}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action bar / Composers */}
                <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/5">
                  <div className="flex gap-2 items-start">
                    <ReplyPanel message={selectedMessage} onReplied={handleAfterReply} />
                    <LogVisitorReplyPanel message={selectedMessage} onReplied={handleAfterVisitorReply} />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleRead(selectedMessage, Number(selectedMessage.is_read) === 0)}
                      disabled={updatingStatus}
                      className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-800 dark:text-white flex items-center justify-center gap-1.5 transition-all disabled:opacity-60"
                    >
                      {Number(selectedMessage.is_read) === 1
                        ? <><Mail className="w-4 h-4 text-sky-500" /> Mark Unread</>
                        : <><MailOpen className="w-4 h-4 text-emerald-500" /> Mark Read</>
                      }
                    </button>

                    <button
                      onClick={() => setDeleteId(selectedMessage.id)}
                      className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 dark:hover:bg-rose-500/30 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-24 text-slate-400 space-y-3">
                <Inbox className="w-14 h-14 mx-auto text-slate-200 dark:text-slate-700" />
                <p className="text-sm font-medium">Select a message to read it</p>
                <p className="text-xs text-slate-400">Click any row on the left to view the full message and reply</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Contact Message?"
        message="Are you sure you want to permanently delete this message? This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

/* ─── MetaRow helper ────────────────────────────────────────── */
const MetaRow = ({ icon, children, small = false }) => (
  <div className={`flex items-center gap-2 ${small ? 'text-[11px] text-slate-400' : 'text-xs font-semibold text-slate-700 dark:text-slate-300'}`}>
    <span className="shrink-0">{icon}</span>
    {children}
  </div>
);

export default AdminMessages;
