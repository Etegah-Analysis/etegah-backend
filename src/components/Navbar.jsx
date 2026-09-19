import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, MessageCircle, Bell, ShieldCheck } from 'lucide-react';
import { db, collection, query, where, onSnapshot, doc, getDocs } from '../firebase';
import logoImg from '../assets/logo.jpg';

export default function Navbar() {
  const navigate = useNavigate();
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [isEmp, setIsEmp] = useState(false);
  const [empTitle, setEmpTitle] = useState('');
  const [empAliasName, setEmpAliasName] = useState('');

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const notifRef = useRef(null);
  const notifMobileRef = useRef(null);

  // Check login state (Customer vs Employee)
  useEffect(() => {
    const name = localStorage.getItem('visitorName');
    const phone = localStorage.getItem('visitorPhone');
    const isEmpLogged = localStorage.getItem('isEmpLoggedIn') === 'true';
    const alias = localStorage.getItem('empAliasName') || '';
    const title = localStorage.getItem('empTitle') || '';

    setIsEmp(isEmpLogged);
    if (alias) setEmpAliasName(alias);
    if (title) setEmpTitle(title);
    if (name) setVisitorName(name);

    if (!phone) return;
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (!cleanPhone) return;
    setVisitorPhone(cleanPhone);

    // 1. Listen for real-time assigned employee alias in website_chats
    const chatDocRef = doc(db, 'website_chats', `chat_${cleanPhone}`);
    const unsubChat = onSnapshot(chatDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const emp = data.assignedEmp;
        if (emp && emp.empCode && emp.empCode !== 'CS' && emp.empCode !== 'cs') {
          const qEmp = query(collection(db, 'users'), where('empCode', '==', emp.empCode));
          getDocs(qEmp).then((snap) => {
            if (!snap.empty) {
              const uData = snap.docs[0].data();
              const resolvedAlias = uData.aliasName || uData.pseudonym || uData.displayName || uData.username || uData.name || emp.name;
              setEmpAliasName(resolvedAlias);
            } else if (emp.name) {
              setEmpAliasName(emp.name);
            }
          }).catch(() => {
            if (emp.name) setEmpAliasName(emp.name);
          });
        } else if (emp && emp.name) {
          setEmpAliasName(emp.name);
        }
      }
    });

    // 2. Real-time incoming notifications listener for customer
    const qMsgs = query(
      collection(db, 'رسائل_الموظفين_للعملاء'),
      where('conversationId', '==', cleanPhone)
    );

    const unsubMsgs = onSnapshot(qMsgs, (snap) => {
      const incomingMsgs = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(m => m.sender !== 'client' && m.sender !== 'customer' && m.sender !== cleanPhone);

      incomingMsgs.sort((a, b) => {
        const tA = a.timestamp?.toMillis ? a.timestamp.toMillis() : (a.timestamp ? new Date(a.timestamp).getTime() : 0);
        const tB = b.timestamp?.toMillis ? b.timestamp.toMillis() : (b.timestamp ? new Date(b.timestamp).getTime() : 0);
        return tB - tA;
      });

      setNotifications(incomingMsgs);

      // Filter unread notifications count based on lastReadTimestamp
      const savedLastRead = localStorage.getItem(`etegah_notif_last_read_${cleanPhone}`);
      const lastReadTime = savedLastRead ? parseInt(savedLastRead, 10) : 0;

      const unreadList = incomingMsgs.filter(m => {
        const msgTime = m.timestamp?.toMillis ? m.timestamp.toMillis() : (m.timestamp ? new Date(m.timestamp).getTime() : 0);
        return msgTime > lastReadTime;
      });

      setUnreadCount(unreadList.length);
    }, (err) => console.error("Navbar notifications error:", err));

    return () => {
      unsubChat();
      unsubMsgs();
    };
  }, []);

  // Listen to custom window events for clearing notifications
  useEffect(() => {
    const handleUnreadEvent = (e) => {
      if (e.detail && e.detail.hasUnread === false) {
        if (visitorPhone) {
          const cleanPhone = visitorPhone.replace(/[^0-9]/g, '');
          localStorage.setItem(`etegah_notif_last_read_${cleanPhone}`, Date.now().toString());
        }
        setUnreadCount(0);
      }
    };
    window.addEventListener('etegah_unread_msg', handleUnreadEvent);
    return () => window.removeEventListener('etegah_unread_msg', handleUnreadEvent);
  }, [visitorPhone]);

  // Click Outside listener to close notifications dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isNotifOpen &&
        notifRef.current &&
        !notifRef.current.contains(event.target) &&
        (!notifMobileRef.current || !notifMobileRef.current.contains(event.target))
      ) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isNotifOpen]);

  const toggleNotifications = () => {
    const nextState = !isNotifOpen;
    setIsNotifOpen(nextState);
    if (nextState && visitorPhone) {
      const cleanPhone = visitorPhone.replace(/[^0-9]/g, '');
      localStorage.setItem(`etegah_notif_last_read_${cleanPhone}`, Date.now().toString());
      setUnreadCount(0);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('visitorName');
    localStorage.removeItem('visitorPhone');
    localStorage.removeItem('isEmpLoggedIn');
    localStorage.removeItem('empAliasName');
    localStorage.removeItem('empTitle');
    localStorage.removeItem('empCode');
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

        {/* Mobile top bar right section: User/Emp badge + Bell + Hamburger Menu */}
        <div className="mobile-controls flex items-center gap-2">
          {visitorName && (
            <div className="flex items-center gap-1.5">
              {/* Notification Bell (Mobile) */}
              {!isEmp && (
                <div className="relative" ref={notifMobileRef}>
                  <button
                    onClick={toggleNotifications}
                    className="p-1.5 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-cyan-300 hover:text-white transition relative cursor-pointer flex items-center justify-center shadow-md"
                    title="الإشعارات المباشرة"
                  >
                    <Bell size={16} className={unreadCount > 0 ? "text-cyan-300 animate-pulse" : "text-gray-400"} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white shadow-md animate-bounce">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                </div>
              )}

              <span 
                onClick={handleOpenChat}
                className="visitor-badge-mobile relative flex items-center gap-1 cursor-pointer"
              >
                {isEmp ? <ShieldCheck size={13} className="text-cyan-400" /> : <User size={13} />} 
                {isEmp ? (empAliasName || visitorName) : visitorName}
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

        {/* Navigation Links */}
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
                {!isEmp && (
                  <div className="relative" ref={notifRef}>
                    <button
                      onClick={toggleNotifications}
                      className="p-2 rounded-xl bg-slate-900/80 backdrop-blur-xl border border-cyan-500/40 text-cyan-300 hover:text-white font-extrabold flex items-center justify-center shadow-[0_4px_15px_rgba(6,182,212,0.25)] hover:border-cyan-400 transition cursor-pointer relative text-xs sm:text-sm"
                      title="الإشعارات المباشرة"
                    >
                      <Bell size={16} className={unreadCount > 0 ? "text-cyan-300 animate-pulse" : "text-gray-400"} />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white shadow-md animate-bounce">
                          {unreadCount > 9 ? '9+' : unreadCount}
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
                          <span className="text-[10px] text-gray-400 font-mono">({notifications.length})</span>
                        </div>

                        <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                          {notifications.map((msg) => (
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
                                  {msg.senderName || (msg.sender === 'admin' ? '👑 الإدارة' : (empAliasName || 'خدمة العملاء'))}
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

                          {notifications.length === 0 && (
                            <div className="py-6 text-center text-gray-400 text-[11px]">
                              لا توجد رسائل واردة جديدة حالياً ✨
                            </div>
                          )}
                        </div>

                        {notifications.length > 0 && (
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
                )}

                {/* User / Employee Badge Button */}
                {isEmp ? (
                  <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-xl border border-cyan-400/50 text-cyan-300 font-bold flex items-center gap-1.5 shadow-[0_4px_15px_rgba(6,182,212,0.25)] text-xs sm:text-sm">
                    <ShieldCheck size={16} className="text-cyan-400 shrink-0" />
                    <span>👨‍💼 {empAliasName || visitorName}</span>
                    <span className="text-[10px] text-cyan-200/80 bg-cyan-950/80 px-1.5 py-0.5 rounded-md border border-cyan-500/30">
                      {empTitle || 'مستشار مالي'}
                    </span>
                  </div>
                ) : (
                  <button 
                    onClick={handleOpenChat}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-xl border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 font-extrabold flex items-center gap-1.5 shadow-[0_4px_15px_rgba(6,182,212,0.25)] hover:border-cyan-400 transition cursor-pointer relative text-xs sm:text-sm"
                    title="فتح الواتساب"
                  >
                    <User size={15} className="text-cyan-400 shrink-0" /> 
                    <span>{visitorName}</span>
                  </button>
                )}

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
