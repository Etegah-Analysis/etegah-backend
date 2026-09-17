import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, MessageCircle } from 'lucide-react';
import logoImg from '../assets/logo.jpg';

export default function Navbar() {
  const navigate = useNavigate();
  const [visitorName, setVisitorName] = useState('');
  const [hasUnreadMsg, setHasUnreadMsg] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem('visitorName');
    if (name) {
      setVisitorName(name);
    }

    const handleUnreadEvent = (e) => {
      setHasUnreadMsg(e.detail?.hasUnread || false);
    };

    window.addEventListener('etegah_unread_msg', handleUnreadEvent);
    return () => window.removeEventListener('etegah_unread_msg', handleUnreadEvent);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('visitorName');
    localStorage.removeItem('visitorPhone');
    window.location.href = '/';
  };

  const handleOpenChat = () => {
    window.dispatchEvent(new Event('open_whatsapp_widget'));
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar-container">
      <div className="container nav-wrapper">
        {/* Brand Logo & Name */}
        <Link to="/" className="brand-logo" onClick={() => setIsMobileMenuOpen(false)}>
          <img src={logoImg} alt="Etegah Logo" className="logo-img" />
          <span className="mobile-logo-text">اتجاه للتحليل الذكي</span>
        </Link>

        {/* Mobile top bar right section: User badge + Hamburger Menu */}
        <div className="mobile-controls">
          {visitorName && (
            <span 
              onClick={handleOpenChat}
              className="visitor-badge-mobile relative flex items-center gap-1 cursor-pointer"
            >
              <User size={13} /> {visitorName}
              {hasUnreadMsg && (
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                </span>
              )}
            </span>
          )}
          <button 
            className="mobile-toggle-btn" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="القائمة"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Navigation Links (Desktop Inline / Mobile Dropdown Drawer) */}
        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
            الرئيسية
          </Link>
          <Link to="/news" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
            أخبار السوق السعودي
          </Link>
          <Link to="/us-options" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
            رادار الأوبشن
          </Link>

          <div className="user-section-mobile">
            {visitorName ? (
              <div className="user-badge-box flex items-center gap-2">
                <button 
                  onClick={handleOpenChat}
                  className="user-name font-bold text-cyan-300 hover:text-cyan-200 flex items-center gap-1.5 cursor-pointer relative"
                  title="فتح الواتساب"
                >
                  <User size={16} /> 
                  <span>{visitorName}</span>
                  {hasUnreadMsg && (
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                    </span>
                  )}
                </button>
                <button onClick={handleLogout} className="logout-btn-nav">
                  <LogOut size={14} /> خروج
                </button>
              </div>
            ) : (
              <Link 
                to="/visitor-login" 
                className="login-btn-nav" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                تسجيل الدخول
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
