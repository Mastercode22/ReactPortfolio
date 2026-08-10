import React, { useState, useEffect } from 'react';
import { API_BASE } from '../../services/api';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useToast } from '../../components/admin/Toast';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token, logout } = useAdminAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const currentToken = token || localStorage.getItem('admin_token');
      if (!currentToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE}/admin/dashboard`, {
          headers: {
            'Authorization': `Bearer ${currentToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 401) {
          showToast('Session expired. Please log in again.', 'error');
          logout();
          return;
        }

        if (!response.ok) throw new Error('Failed to fetch dashboard data');

        const resJson = await response.json();
        const d = resJson.data || resJson;

        setStats({
          totalProjects: d.total_projects ?? d.totalProjects ?? 0,
          publishedProjects: d.published_projects ?? d.publishedProjects ?? 0,
          services: d.total_services ?? d.services ?? 0,
          technologies: d.total_technologies ?? d.technologies ?? 0,
          testimonials: d.total_testimonials ?? d.testimonials ?? 0,
          cvDownloads: d.cv_downloads ?? d.cvDownloads ?? 0,
          mediaFiles: d.media_files ?? d.mediaFiles ?? 0,
          unreadMessages: d.unread_messages ?? d.unreadMessages ?? 0,
        });

        setMessages(d.recent_messages || d.recentMessages || []);
      } catch (error) {
        showToast(error.message, 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, showToast, logout]);

  const statCards = stats ? [
    { label: 'Total Projects', value: stats.totalProjects, icon: '📁', bg: 'bg-blue-400/10', link: '/admin/projects' },
    { label: 'Published Projects', value: stats.publishedProjects, icon: '🚀', bg: 'bg-green-400/10', link: '/admin/projects' },
    { label: 'Services', value: stats.services, icon: '🛠️', bg: 'bg-purple-400/10', link: '/admin/services' },
    { label: 'Technologies', value: stats.technologies, icon: '💻', bg: 'bg-yellow-400/10', link: '/admin/technologies' },
    { label: 'Testimonials', value: stats.testimonials, icon: '💬', bg: 'bg-pink-400/10', link: '/admin/testimonials' },
    { label: 'CV Downloads', value: stats.cvDownloads, icon: '📄', bg: 'bg-emerald-400/10', link: '/admin/cv' },
    { label: 'Media Files', value: stats.mediaFiles, icon: '🖼️', bg: 'bg-orange-400/10', link: '/admin/media' },
    { label: 'Unread Messages', value: stats.unreadMessages, icon: '✉️', bg: 'bg-red-400/10', link: '/admin/messages' },
  ] : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#7C5CFF] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid - 4 Columns x 2 Rows */}
      <div className="grid grid-cols-4 gap-2 sm:gap-6">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="block bg-white dark:bg-[#121620] border border-slate-200 dark:border-white/10 rounded-xl sm:rounded-2xl p-2 sm:p-6 shadow-xl hover:border-[#7C5CFF] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-slate-600 dark:text-[#CBD5E1] text-[10px] sm:text-sm font-medium leading-tight truncate group-hover:text-[#7C5CFF] transition-colors" title={stat.label}>{stat.label}</p>
                <h3 className="text-base sm:text-3xl font-bold text-slate-900 dark:text-white mt-0.5 sm:mt-1">{stat.value}</h3>
              </div>
              <div className={`w-7 h-7 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-xs sm:text-2xl shrink-0 self-start sm:self-center ${stat.bg} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="bg-white dark:bg-[#121620] border border-slate-200 dark:border-white/10 rounded-2xl p-4 shadow-xl space-y-3">
            <Link to="/admin/projects/new" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-800 dark:text-[#F8FAFC]">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center text-xl">➕</div>
              <span className="font-medium">Add New Project</span>
            </Link>
            <Link to="/admin/services" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-800 dark:text-[#F8FAFC]">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-500 flex items-center justify-center text-xl">➕</div>
              <span className="font-medium">Add Service</span>
            </Link>
            <Link to="/admin/cv" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-800 dark:text-[#F8FAFC]">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-xl">📄</div>
              <span className="font-medium">Manage CV</span>
            </Link>
            <Link to="/admin/media" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-800 dark:text-[#F8FAFC]">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 text-orange-500 flex items-center justify-center text-xl">🖼️</div>
              <span className="font-medium">Upload Media</span>
            </Link>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Recent Messages</h2>
            <Link to="/admin/messages" className="text-sm text-[#7C5CFF] hover:text-[#6C63FF] font-medium">View All</Link>
          </div>
          <div className="bg-white dark:bg-[#121620] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden">
            {messages.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-white/5">
                {messages.map((msg, i) => (
                  <div key={i} className="p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-white/10 text-slate-800 dark:text-white flex items-center justify-center shrink-0 font-bold">
                      {msg.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-slate-900 dark:text-white truncate">{msg.name}</h4>
                        <span className="text-xs text-slate-500 dark:text-[#CBD5E1] whitespace-nowrap">{msg.created_at || msg.date}</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-[#CBD5E1] truncate">{msg.subject}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 dark:text-[#CBD5E1]">
                No recent messages
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
