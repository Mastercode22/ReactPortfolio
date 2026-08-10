import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminLayout = ({ children }) => {
  const { logout, adminUser } = useAdminAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Hero Section', path: '/admin/hero', icon: '🌟' },
    { name: 'About', path: '/admin/about', icon: '👨‍💻' },
    { name: 'Services', path: '/admin/services', icon: '🛠️' },
    { name: 'Technologies', path: '/admin/technologies', icon: '💻' },
    { name: 'Projects', path: '/admin/projects', icon: '🚀' },
    { name: 'Experience', path: '/admin/experience', icon: '💼' },
    { name: 'Certifications', path: '/admin/certifications', icon: '📜' },
    { name: 'Testimonials', path: '/admin/testimonials', icon: '💬' },
    { name: 'Contact Info', path: '/admin/contact', icon: '📞' },
    { name: 'CV Manager', path: '/admin/cv', icon: '📄' },
    { name: 'Media Library', path: '/admin/media', icon: '🖼️' },
    { name: 'Messages', path: '/admin/messages', icon: '✉️' },
    { name: 'Settings', path: '/admin/settings', icon: '⚙️' },
  ];

  // Close mobile sidebar on navigation
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const breadcrumbName = navItems.find(item => location.pathname.includes(item.path))?.name || 'Dashboard';

  return (
    <div className="min-h-screen bg-[#090B13] text-[#F8FAFC] flex font-sans">
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#121620] border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static flex flex-col ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#7C5CFF] to-blue-400">
            Admin Portal
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-[#7C5CFF]/10 text-[#7C5CFF] font-medium'
                      : 'text-[#CBD5E1] hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <span className="text-lg">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-8 border-b border-white/5 bg-white/5 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg text-[#CBD5E1] hover:bg-white/5"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-white">{breadcrumbName}</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#CBD5E1] hidden sm:block">
              Welcome, {adminUser?.name || 'Admin'}
            </span>
            <div className="w-8 h-8 rounded-full bg-[#7C5CFF]/20 border border-[#7C5CFF]/30 flex items-center justify-center text-[#7C5CFF] font-bold">
              {adminUser?.name?.[0] || 'A'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            {children || <Outlet />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
