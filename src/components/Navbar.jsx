import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, MessageCircle, Bell } from 'lucide-react';
import { db, collection, query, where, onSnapshot } from '../firebase';
import logoImg from '../assets/logo.jpg';

export default function Navbar() {
  const navigate = useNavigate();
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [hasUnreadMsg, setHasUnreadMsg] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const name = localStorage.getItem('visitorName');
    const phone = localStorage.getItem('visitorPhone');
    if (name) setVisitorName(name);
    if (!phone) return;

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone) return;
    setVisitorPhone(cleanPhone);

    const q = query(
      collection(db, 'رسائل_الموظفين_للعملاء'),
      where('conversationId', '==', cleanPhone)
    );

    const unsub = onSnapshot(q, (snap) => {
      const incomingMsgs = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(m => m.sender !== 'client' && m.sender !== 'customer' && m.sender !== cleanPhone);

      incomingMsgs.sort((a, b) => {
        const tA = a.timestamp?.toMillis ? a.timestamp.toMillis() : (a.timestamp ? new Date(a.timestamp).getTime() : 0);
        const tB = b.timestamp?.toMillis ? b.timestamp.toMillis() : (b.timestamp ? new Date(b.timestamp).getTime() : 0);
        return tB - tA;
      });

      setUnreadNotifications(incomingMsgs);
      setHasUnreadMsg(incomingMsgs.length > 0);
    }, (err) => console.error("Navbar notifications error:", err));

    return () => unsub();
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

        {/* Mobile top bar right section: User badge + Bell + Hamburger Menu */}
        <div className="mobile-controls flex items-center gap-2">
          {visitorName && (
            <div className="flex items-center gap-1.5">
              {/* Notification Bell (Mobile) */}
              <div className="relative">
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="p-1.5 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-cyan-300 hover:text-white transition relative cursor-pointer flex items-center justify-center shadow-md"
                  title="الإشعارات المباشرة"
                >
                  <Bell size={16} className={unreadNotifications.length > 0 ? "text-cyan-300 animate-pulse" : "text-gray-400"} />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white shadow-md animate-bounce">
                      {unreadNotifications.length > 9 ? '9+' : unreadNotifications.length}
                    </span>
                  )}
                </button>
              </div>

              <span 
                onClick={handleOpenChat}
                className="visitor-badge-mobile relative flex items-center gap-1 cursor-pointer"
              >
                <User size={13} /> {visitorName}
              </span>
            </div>
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
            أخبار السوق الأمريكي
          </Link>

          <div className="user-section-mobile">
            {visitorName ? (
              <div className="user-badge-box flex items-center gap-2 relative">
                {/* Notification Bell (Desktop) */}
                <div className="relative">
                  <button
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className="p-2 rounded-xl bg-slate-900/80 backdrop-blur-xl border border-cyan-500/40 text-cyan-300 hover:text-white font-extrabold flex items-center justify-center shadow-[0_4px_15px_rgba(6,182,212,0.25)] hover:border-cyan-400 transition cursor-pointer relative text-xs sm:text-sm"
                    title="الإشعارات المباشرة"
                  >
                    <Bell size={16} className={unreadNotifications.length > 0 ? "text-cyan-300 animate-pulse" : "text-gray-400"} />
                    {unreadNotifications.length > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-md animate-bounce">
                        {unreadNotifications.length > 9 ? '9+' : unreadNotifications.length}
                      </span>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {isNotifOpen && (
                    <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/40 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.9)] z-50 p-3 text-right text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                        <span className="font-extrabold text-cyan-300 flex items-center gap-1">
                          <Bell size={14} /> إشعارات الرسائل الواردة
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">({unreadNotifications.length})</span>
                      </div>

                      <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                        {unreadNotifications.map((msg) => (
                          <div
                            key={msg.id}
                            onClick={() => {
                              handleOpenChat();
                              setIsNotifOpen(false);
                            }}
                            className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-cyan-950/40 border border-white/5 hover:border-cyan-500/30 transition cursor-pointer"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-white text-[11px]">
                                {msg.senderName || (msg.sender === 'admin' ? '👑 الإدارة' : 'خدمة العملاء / المستشار')}
                              </span>
                              <span className="text-[9px] text-cyan-400 font-mono">
                                {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : ''}
                              </span>
                            </div>
                            <p className="text-gray-300 text-[11px] line-clamp-2 dir-auto">
                              {msg.text || (msg.mediaUrl ? '📎 مرفق ملف' : 'رسالة جديدة')}
                            </p>
                          </div>
                        ))}

                        {unreadNotifications.length === 0 && (
                          <div className="py-6 text-center text-gray-400 text-[11px]">
                            لا توجد رسائل واردة جديدة حالياً ✨
                          </div>
                        )}
                      </div>

                      {unreadNotifications.length > 0 && (
                        <button
                          onClick={() => {
                            handleOpenChat();
                            setIsNotifOpen(false);
                          }}
                          className="w-full mt-2 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-center text-[11px] hover:from-cyan-400 hover:to-blue-500 transition cursor-pointer"
                        >
                          فتح المحادثة الكاملة 💬
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleOpenChat}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-xl border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 font-extrabold flex items-center gap-1.5 shadow-[0_4px_15px_rgba(6,182,212,0.25)] hover:border-cyan-400 transition cursor-pointer relative text-xs sm:text-sm"
                  title="فتح الواتساب"
                >
                  <User size={15} className="text-cyan-400 shrink-0" /> 
                  <span>{visitorName}</span>
                </button>
                <button onClick={handleLogout} className="px-3 py-1.5 rounded-xl bg-rose-950/60 backdrop-blur-xl border border-rose-500/40 text-rose-300 hover:text-white hover:bg-rose-900/80 font-bold transition text-xs flex items-center gap-1 cursor-pointer shadow-sm">
                  <LogOut size={14} /> خروج
                </button>
              </div>
            ) : (
              <Link 
                to="/visitor-login" 
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-[0_4px_15px_rgba(6,182,212,0.3)] border border-cyan-300/40 transition" 
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
