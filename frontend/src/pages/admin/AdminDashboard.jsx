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
    { label: 'Total Projects', value: stats.totalProjects, icon: '📁', bg: 'bg-blue-400/10' },
    { label: 'Published Projects', value: stats.publishedProjects, icon: '🚀', bg: 'bg-green-400/10' },
    { label: 'Services', value: stats.services, icon: '🛠️', bg: 'bg-purple-400/10' },
    { label: 'Technologies', value: stats.technologies, icon: '💻', bg: 'bg-yellow-400/10' },
    { label: 'Testimonials', value: stats.testimonials, icon: '💬', bg: 'bg-pink-400/10' },
    { label: 'CV Downloads', value: stats.cvDownloads, icon: '📄', bg: 'bg-emerald-400/10' },
    { label: 'Media Files', value: stats.mediaFiles, icon: '🖼️', bg: 'bg-orange-400/10' },
    { label: 'Unread Messages', value: stats.unreadMessages, icon: '✉️', bg: 'bg-red-400/10' },
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
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-[#121620] border border-white/10 rounded-2xl p-6 shadow-xl hover:border-[#7C5CFF]/40 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#CBD5E1] text-sm font-medium mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${stat.bg}`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="bg-[#121620] border border-white/10 rounded-2xl p-4 shadow-xl space-y-3">
            <Link to="/admin/projects/new" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-[#F8FAFC]">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl">➕</div>
              <span className="font-medium">Add New Project</span>
            </Link>
            <Link to="/admin/services" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-[#F8FAFC]">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center text-xl">➕</div>
              <span className="font-medium">Add Service</span>
            </Link>
            <Link to="/admin/cv" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-[#F8FAFC]">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl">📄</div>
              <span className="font-medium">Manage CV</span>
            </Link>
            <Link to="/admin/media" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors text-[#F8FAFC]">
              <div className="w-10 h-10 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center text-xl">🖼️</div>
              <span className="font-medium">Upload Media</span>
            </Link>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Recent Messages</h2>
            <Link to="/admin/messages" className="text-sm text-[#7C5CFF] hover:text-[#6C63FF]">View All</Link>
          </div>
          <div className="bg-[#121620] border border-white/10 rounded-2xl shadow-xl overflow-hidden">
            {messages.length > 0 ? (
              <div className="divide-y divide-white/5">
                {messages.map((msg, i) => (
                  <div key={i} className="p-4 hover:bg-white/5 transition-colors flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                      {msg.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-white truncate">{msg.name}</h4>
                        <span className="text-xs text-[#CBD5E1] whitespace-nowrap">{msg.created_at || msg.date}</span>
                      </div>
                      <p className="text-sm text-[#CBD5E1] truncate">{msg.subject}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-[#CBD5E1]">
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
