import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Headphones, ShieldCheck, Sparkles } from 'lucide-react';
import { db, collection, query, where, getDocs, doc, setDoc, onSnapshot, serverTimestamp, arrayUnion, addDoc } from '../firebase';

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [userPhone, setUserPhone] = useState('');
  const [userName, setUserName] = useState('');
  
  // Step in widget: 'code_input' | 'chat_room'
  const [widgetStep, setWidgetStep] = useState('code_input');
  const [empCodeInput, setEmpCodeInput] = useState('');
  const [assignedEmp, setAssignedEmp] = useState(null);
  const [codeError, setCodeError] = useState('');
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  // Chat State
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [hasUnread, setHasUnread] = useState(false);

  const widgetRef = useRef(null);
  const messagesEndRef = useRef(null);
  const prevMsgCountRef = useRef(0);

  // Synthesize pleasant notification chime sound using Web Audio API
  const playChimeSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      // Ignore audio autoplay restrictions gracefully
    }
  };

  // Check login authentication state from localStorage / Firebase
  useEffect(() => {
    const phone = localStorage.getItem('visitorPhone') || '';
    const name = localStorage.getItem('visitorName') || 'عميل اتجاه';
    setUserPhone(phone);
    setUserName(name);
  }, [isOpen]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Listen to Firestore realtime chat messages when userPhone is available
  useEffect(() => {
    if (!userPhone) return;

    const cleanPhone = userPhone.replace(/[^0-9]/g, '');
    const chatId = `chat_${cleanPhone}`;
    const chatDocRef = doc(db, 'website_chats', chatId);

    const unsub = onSnapshot(chatDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const msgList = data.messages || [];
        setMessages(msgList);

        // Check if new message came from staff
        if (msgList.length > prevMsgCountRef.current) {
          const lastMsg = msgList[msgList.length - 1];
          if (lastMsg && (lastMsg.sender === 'staff' || lastMsg.sender === 'employee' || lastMsg.sender === 'admin')) {
            playChimeSound();
            if (!isOpen) setHasUnread(true);
          }
        }
        prevMsgCountRef.current = msgList.length;

        if (data.assignedEmp) {
          setAssignedEmp(data.assignedEmp);
        }
      }
    }, (err) => console.error("Firestore website_chat error:", err));

    return () => unsub();
  }, [userPhone, isOpen]);

  // Also listen to رسائل_الموظفين_للعملاء for replies from Dashboard Inbox
  useEffect(() => {
    if (!userPhone) return;
    const cleanPhone = userPhone.replace(/[^0-9]/g, '');

    const qMsgs = query(collection(db, 'رسائل_الموظفين_للعملاء'), where('conversationId', '==', cleanPhone));
    const unsub = onSnapshot(qMsgs, (snap) => {
      snap.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const msgData = change.doc.data();
          if (msgData.sender !== 'client' && msgData.text) {
            const chatId = `chat_${cleanPhone}`;
            const chatDocRef = doc(db, 'website_chats', chatId);
            const staffMsg = {
              id: change.doc.id,
              sender: 'staff',
              text: msgData.text,
              timestamp: new Date().toISOString()
            };
            setDoc(chatDocRef, {
              messages: arrayUnion(staffMsg)
            }, { merge: true }).catch(console.error);
          }
        }
      });
    });

    return () => unsub();
  }, [userPhone]);

  // Auto scroll to latest message
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      setHasUnread(false);
    }
  }, [messages, isOpen]);

  // Handle open trigger click
  const handleTriggerClick = () => {
    if (!userPhone) {
      // Redirect unauthenticated visitor to login page for OTP verification
      alert('يرجى تسجيل الدخول أولاً بالـ OTP لتأكيد حسابك وبدء التواصل المباشر 🔐');
      window.location.href = '/login';
      return;
    }
    setIsOpen(!isOpen);
    setHasUnread(false);
  };

  // Verify Employee Code
  const handleVerifyEmpCode = async (e) => {
    if (e) e.preventDefault();
    const rawCode = empCodeInput.trim().replace(/^#/, '');
    if (!rawCode) {
      setCodeError('يرجى إدخال كود الموظف صحيحاً');
      return;
    }

    setIsVerifyingCode(true);
    setCodeError('');

    try {
      // Query users collection by empCode or username
      const q = query(collection(db, 'users'), where('empCode', '==', rawCode));
      const snap = await getDocs(q);

      if (!snap.empty) {
        const empData = snap.docs[0].data();
        const empObj = {
          uid: snap.docs[0].id,
          name: empData.username || empData.name || `موظف #${rawCode}`,
          empCode: rawCode,
          jobTitle: empData.jobTitle || 'مستشار اتجاه'
        };
        setAssignedEmp(empObj);
        setWidgetStep('chat_room');
        initChatSession(empObj);
      } else {
        const q2 = query(collection(db, 'users'), where('username', '==', rawCode));
        const snap2 = await getDocs(q2);
        if (!snap2.empty) {
          const empData = snap2.docs[0].data();
          const empObj = {
            uid: snap2.docs[0].id,
            name: empData.username || empData.name || `موظف #${rawCode}`,
            empCode: empData.empCode || rawCode,
            jobTitle: empData.jobTitle || 'مستشار اتجاه'
          };
          setAssignedEmp(empObj);
          setWidgetStep('chat_room');
          initChatSession(empObj);
        } else {
          setCodeError(`الكود #${rawCode} غير مسجل بالنظام، يرجى المحاولة أو التواصل مع خدمة العملاء`);
        }
      }
    } catch (err) {
      console.error("Code lookup error:", err);
      setCodeError('حدث خطأ أثناء التحقق من الكود');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  // Skip Code -> Connect to Customer Service
  const handleConnectCustomerService = () => {
    const csObj = {
      uid: null,
      name: 'خدمة العملاء والدعم الفني',
      empCode: 'CS',
      jobTitle: 'الدعم الفني المباشر'
    };
    setAssignedEmp(csObj);
    setWidgetStep('chat_room');
    initChatSession(csObj);
  };

  // Initialize or update chat document in Firestore website_chats, بيانات_تسجيل_العملاء & customers
  const initChatSession = async (targetEmp) => {
    if (!userPhone) return;
    const cleanPhone = userPhone.replace(/[^0-9]/g, '');
    const chatId = `chat_${cleanPhone}`;

    const chatDocRef = doc(db, 'website_chats', chatId);
    const regCustomerDocRef = doc(db, 'بيانات_تسجيل_العملاء', cleanPhone);
    const customerDocRef = doc(db, 'customers', cleanPhone);

    const chatData = {
      id: chatId,
      phoneNumber: userPhone,
      cleanPhone: cleanPhone,
      name: userName || 'عميل اتجاه',
      source: 'website_whatsapp',
      crmStatus: 'unassigned',
      assignedToUid: targetEmp?.uid || null,
      assignedTo: targetEmp?.name || 'خدمة العملاء',
      assignedEmp: targetEmp,
      updatedAt: serverTimestamp(),
      lastMsgText: 'بدأت محادثة من موقع اتجاه',
      lastMsgTime: new Date().toISOString()
    };

    try {
      await setDoc(chatDocRef, chatData, { merge: true });

      // Sync to بيانات_تسجيل_العملاء for Dashboard Inbox & Waitlist
      await setDoc(regCustomerDocRef, {
        phoneNumber: userPhone,
        name: userName || 'عميل اتجاه',
        source: 'website_whatsapp',
        addedBy: 'WhatsApp Webhook',
        crmStatus: 'unassigned',
        assignedToUid: targetEmp?.uid || null,
        assignedTo: targetEmp?.name || 'خدمة العملاء',
        unread: 1,
        timestamp: serverTimestamp()
      }, { merge: true });

      // Sync to customers collection for Dashboard website_whatsapp card
      await setDoc(customerDocRef, {
        phoneNumber: userPhone,
        name: userName || 'عميل اتجاه',
        source: 'website_whatsapp',
        addedBy: 'WhatsApp Webhook',
        crmStatus: 'unassigned',
        assignedToUid: targetEmp?.uid || null,
        assignedTo: targetEmp?.name || 'خدمة العملاء',
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.error("Error creating chat doc:", err);
    }
  };

  // Send message
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text || !userPhone) return;

    const cleanPhone = userPhone.replace(/[^0-9]/g, '');
    const chatId = `chat_${cleanPhone}`;
    const chatDocRef = doc(db, 'website_chats', chatId);

    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: 'client',
      text: text,
      timestamp: new Date().toISOString()
    };

    setInputText('');

    try {
      await setDoc(chatDocRef, {
        messages: arrayUnion(newMsg),
        lastMsgText: text,
        lastMsgTime: new Date().toISOString(),
        updatedAt: serverTimestamp(),
        unreadCountStaff: (messages.length || 0) + 1
      }, { merge: true });

      // Add to رسائل_الموظفين_للعملاء for Dashboard Inbox
      await addDoc(collection(db, 'رسائل_الموظفين_للعملاء'), {
        conversationId: cleanPhone,
        phoneNumber: userPhone,
        sender: 'client',
        text: text,
        timestamp: serverTimestamp()
      });

      // Update بيانات_تسجيل_العملاء & customers
      const regCustomerDocRef = doc(db, 'بيانات_تسجيل_العملاء', cleanPhone);
      const customerDocRef = doc(db, 'customers', cleanPhone);

      await setDoc(regCustomerDocRef, {
        phoneNumber: userPhone,
        name: userName || 'عميل اتجاه',
        source: 'website_whatsapp',
        addedBy: 'WhatsApp Webhook',
        unread: 1,
        lastMessage: text,
        timestamp: serverTimestamp()
      }, { merge: true });

      await setDoc(customerDocRef, {
        phoneNumber: userPhone,
        name: userName || 'عميل اتجاه',
        source: 'website_whatsapp',
        addedBy: 'WhatsApp Webhook',
        lastComment: text,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div ref={widgetRef} className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 font-sans" dir="rtl">
      {/* Popover options / Chat window */}
      {isOpen && (
        <div className="mb-3 bg-slate-950/95 backdrop-blur-2xl border border-cyan-500/30 text-white rounded-3xl shadow-[0_12px_50px_rgba(0,0,0,0.7)] w-[calc(100vw-32px)] max-w-88 sm:max-w-96 overflow-hidden flex flex-col relative animate-fade-in border-t-2 border-t-cyan-400">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img src="/logo.jpg" alt="Logo" className="w-9 h-9 rounded-full object-cover border-2 border-cyan-400 shadow-md" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-slate-900"></span>
              </div>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-white flex items-center gap-1">
                  منصة اتجاه التحليل الذكي
                </h4>
                <p className="text-[10px] text-cyan-300 font-semibold flex items-center gap-1">
                  {assignedEmp ? `💬 ${assignedEmp.name}` : 'تواصل مباشر ومعاينة لحظية ⚡'}
                </p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-gray-400 hover:text-white transition p-1.5 rounded-full hover:bg-white/10"
            >
              <X size={18} />
            </button>
          </div>

          {/* User Status Bar */}
          <div className="bg-cyan-950/40 px-4 py-2 border-b border-cyan-500/20 flex items-center justify-between text-[11px]">
            <span className="text-gray-300 flex items-center gap-1">
              <ShieldCheck size={13} className="text-emerald-400" /> حساب موثق بـ OTP
            </span>
            <span className="font-bold text-cyan-300 font-mono" dir="ltr">{userPhone}</span>
          </div>

          {/* Step 1: Code Input / Selection */}
          {widgetStep === 'code_input' && (
            <div className="p-4 sm:p-5 space-y-4">
              <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-xs text-gray-300 leading-relaxed">
                أهلاً بك <strong className="text-white">{userName}</strong>! يرجى إدخال كود الموظف المباشر للتواصل معه، أو الاختيار المباشر لخدمة العملاء:
              </div>

              <form onSubmit={handleVerifyEmpCode} className="space-y-2.5">
                <label className="block text-[11px] font-bold text-cyan-200">
                  كود الموظف (مثال: #206 أو 206):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={empCodeInput}
                    onChange={(e) => setEmpCodeInput(e.target.value)}
                    placeholder="أدخل كود الموظف..."
                    className="flex-1 bg-slate-900 border border-cyan-500/40 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                  <button
                    type="submit"
                    disabled={isVerifyingCode}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isVerifyingCode ? 'جاري الفحص...' : 'دخول'}
                  </button>
                </div>
                {codeError && <p className="text-[10px] text-rose-400 font-semibold">{codeError}</p>}
              </form>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                <div className="relative flex justify-center text-[10px]"><span className="bg-slate-950 px-2 text-gray-400">أو</span></div>
              </div>

              <button
                onClick={handleConnectCustomerService}
                className="w-full flex items-center justify-between bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-2.5 px-4 rounded-xl shadow-lg transition-all text-xs border border-purple-400/40 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Headphones size={16} /> 🎧 لا أملك كود للموظف (خدمة العملاء)
                </span>
                <Sparkles size={14} className="text-amber-300" />
              </button>
            </div>
          )}

          {/* Step 2: Live Chat Room */}
          {widgetStep === 'chat_room' && (
            <div className="flex flex-col h-80 sm:h-96">
              {/* Message List */}
              <div className="flex-1 p-3.5 space-y-3 overflow-y-auto custom-scrollbar bg-slate-900/60">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-400 text-xs">
                    <p className="mb-2">👋 مرحباً بك! أرسل استفسارك وسيجيبك الموظف فوراً.</p>
                    <span className="inline-block bg-white/5 border border-white/10 px-3 py-1 rounded-full text-[10px] text-cyan-300">
                      متصل مع: {assignedEmp?.name}
                    </span>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isClient = msg.sender === 'client';
                    return (
                      <div key={msg.id || idx} className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed ${
                          isClient 
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none shadow-md' 
                            : 'bg-slate-800 text-gray-100 border border-white/10 rounded-bl-none shadow-md'
                        }`}>
                          {msg.text}
                        </div>
                        <span className="text-[9px] text-gray-400 mt-1 px-1">
                          {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Form */}
              <form onSubmit={handleSendMessage} className="p-2.5 bg-slate-950 border-t border-white/10 flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="اكتب رسالتك هنا..."
                  className="flex-1 bg-slate-900 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white p-2.5 rounded-xl transition shadow-md cursor-pointer disabled:opacity-40"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          )}

        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={handleTriggerClick}
        className="relative flex items-center gap-2 bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 hover:from-green-400 hover:to-teal-500 text-white font-black px-4 py-3 rounded-full shadow-[0_8px_30px_rgba(16,185,129,0.5)] border-2 border-emerald-300 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
      >
        <MessageCircle size={22} className="animate-bounce shrink-0" />
        <span className="text-xs tracking-wide whitespace-nowrap">تواصل معنا</span>
        
        {/* Red Notification Badge */}
        {hasUnread && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-white text-[9px] font-bold items-center justify-center">!</span>
          </span>
        )}
      </button>
    </div>
  );
}
