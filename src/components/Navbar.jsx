import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import logoImg from '../assets/logo.jpg';

export default function Navbar() {
  const navigate = useNavigate();
  const [visitorName, setVisitorName] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem('visitorName');
    if (name) {
      setVisitorName(name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('visitorName');
    localStorage.removeItem('visitorPhone');
    window.location.href = '/';
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
            <span className="visitor-badge-mobile">
              <User size={13} /> {visitorName}
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
              <div className="user-badge-box">
                <span className="user-name font-bold text-cyan-300 flex items-center gap-1">
                  <User size={16} /> {visitorName}
                </span>
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
