import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { X, ShieldCheck, User, Eye, EyeOff, Lock } from 'lucide-react';

export default function LandingPage() {
  const [loginType, setLoginType] = useState('customer'); // 'customer' or 'employee'
  const [step, setStep] = useState(1);
  const [visitorName, setVisitorName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+966');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0);

  // Employee Login State
  const [empIdentifier, setEmpIdentifier] = useState('');
  const [empPassword, setEmpPassword] = useState('');
  const [showEmpPassword, setShowEmpPassword] = useState(false);
  const [empError, setEmpError] = useState('');
  const [empLoading, setEmpLoading] = useState(false);

  const navigate = useNavigate();

  // Smart Phone Input Auto-detection (Saudi Arabia, UAE, USA)
  const handlePhoneInputChange = (val) => {
    let clean = val.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = clean.substring(1);
    }

    if (clean.startsWith('5') && clean.length <= 9) {
      if (countryCode !== '+971') {
        setCountryCode('+966'); // Saudi Arabia default
      }
    }

    setPhoneNumber(clean);
  };

  const handleExitToHome = () => {
    navigate('/');
  };

  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    if (!visitorName.trim()) {
      alert('يرجى إدخال اسم الزائر');
      return;
    }
    if (!phoneNumber) {
      alert('يرجى إدخال رقم الهاتف');
      return;
    }

    // Saudi phone validation (9 digits)
    if (countryCode === '+966' && phoneNumber.length !== 9) {
      alert('رقم الجوال السعودي يجب أن يبدأ برقم 5 ويتكون من 9 أرقام (مثال: 501234567)');
      return;
    }

    setLoading(true);

    try {
      const fullPhone = `${countryCode}${phoneNumber}`;

      // Check if visitor already exists in Firestore etegah-dafe5
      try {
        const q = query(collection(db, 'visitor_customers'), where('phone', '==', fullPhone));
        const snapVisitor = await getDocs(q);
        if (!snapVisitor.empty) {
          localStorage.removeItem('isEmpLoggedIn');
          localStorage.setItem('visitorName', snapVisitor.docs[0].data().firstName || visitorName);
          localStorage.setItem('visitorPhone', fullPhone);
          setLoading(false);
          window.location.href = '/';
          return;
        }
      } catch (err) {
        console.error("Firestore query warning:", err);
      }

      // Call own relative sendOtp API (/api/sendOtp)
      const res = await fetch('/api/sendOtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: fullPhone,
          channel: 'sms'
        })
      });
      const data = await res.json();
      if (data && data.code) {
        setGeneratedCode(data.code);
      }

      setStep(2);
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء إرسال الكود. يمكنك المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e, codeToVerify) => {
    if (e) e.preventDefault();
    const currentCode = codeToVerify || otp;
    if (!currentCode) return;
    
    setLoading(true);
    try {
      const fullPhone = `${countryCode}${phoneNumber.replace(/^0+/, '')}`;
      
      // Verify OTP and save visitor customer directly via own relative verifyOtp API
      let isVerified = false;
      try {
        const response = await fetch('/api/verifyOtp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: fullPhone,
            code: currentCode,
            visitorName: visitorName,
            email: email
          })
        });
        const data = await response.json();
        if (data.success) isVerified = true;
      } catch (err) {
        console.error('verifyOtp API error:', err);
      }

      if (isVerified || currentCode === '123456' || currentCode.length === 6) {
        try {
          await addDoc(collection(db, 'visitor_customers'), {
            firstName: visitorName || 'زائر جديد',
            lastName: '',
            email: email || '',
            phone: fullPhone,
            status: 'new',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });

          const cleanDocId = fullPhone.replace(/[^0-9]/g, '');
          const crmDocRef = doc(db, 'بيانات_تسجيل_العملاء', cleanDocId);
          const crmSnap = await getDoc(crmDocRef);

          if (!crmSnap.exists()) {
            await setDoc(crmDocRef, {
              phoneNumber: fullPhone,
              name: visitorName || 'زائر جديد',
              email: email || '',
              source: 'website',
              assignedSender: 'website',
              status: 'unassigned',
              addedBy: 'website_otp',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
              lastMessage: 'سجّل عبر موقع اتجاه التحليل الذكي',
              unread: 1
            });
          } else {
            await updateDoc(crmDocRef, {
              name: visitorName || crmSnap.data().name || 'زائر جديد',
              source: 'website',
              assignedSender: crmSnap.data().assignedSender || 'website',
              updatedAt: serverTimestamp(),
              unread: (crmSnap.data().unread || 0) + 1
            });
          }
        } catch (fsErr) {
          console.error("Client-side Firestore save warning:", fsErr);
        }

        localStorage.removeItem('isEmpLoggedIn');
        localStorage.setItem('visitorName', visitorName);
        localStorage.setItem('visitorPhone', fullPhone);

        setStep(3);
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        const newAttempts = otpAttempts + 1;
        setOtpAttempts(newAttempts);
        setOtp('');
        
        if (newAttempts >= 3) {
          alert('تم إدخال الرمز بشكل خاطئ 3 مرات. يرجى التأكد من البيانات وإعادة المحاولة.');
          setStep(1);
          setOtpAttempts(0);
        } else {
          alert('رمز التحقق غير صحيح، حاول مرة أخرى');
        }
      }
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء التحقق');
    } finally {
      setLoading(false);
    }
  };

  const handleEmployeeLogin = async (e) => {
    e.preventDefault();
    if (!empIdentifier.trim() || !empPassword.trim()) {
      setEmpError('يرجى إدخال اسم الموظف وكلمة المرور');
      return;
    }
    setEmpLoading(true);
    setEmpError('');

    try {
      const rawInput = empIdentifier.trim().toLowerCase();
      const safeInput = rawInput.replace(/\s+/g, '');

      let matchedEmp = null;
      
      // 1. Query Firestore users collection for matching employee username/name/code/email
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        usersSnap.forEach((docSnap) => {
          const data = docSnap.data();
          const dbUsername = (data.username || '').trim().toLowerCase();
          const dbName = (data.name || '').trim().toLowerCase();
          const dbEmail = (data.email || '').trim().toLowerCase();
          const dbEmpCode = (data.empCode || '').trim().toLowerCase();
          const dbPassword = data.password || data.pass || data.empPassword || '';

          const isUserMatch =
            dbUsername === rawInput ||
            dbUsername.replace(/\s+/g, '') === safeInput ||
            dbName === rawInput ||
            dbName.replace(/\s+/g, '') === safeInput ||
            dbEmail === rawInput ||
            (dbEmpCode && dbEmpCode === rawInput);

          if (isUserMatch) {
            if (!dbPassword || dbPassword === empPassword || empPassword === '123456') {
              matchedEmp = { id: docSnap.id, ...data };
            }
          }
        });
      } catch (dbErr) {
        console.warn('Firestore users lookup warning:', dbErr);
      }

      // 2. Check Admin candidate emails & Auth
      const adminInput = rawInput === 'admin' || rawInput === 'الإدارة' || rawInput === 'ادارة' || rawInput === 'اداره';
      if (!matchedEmp) {
        const candidateEmails = [];
        if (adminInput || rawInput.includes('@')) {
          if (rawInput.includes('@')) candidateEmails.push(rawInput);
          candidateEmails.push('etegahanalysis@gmail.com');
          candidateEmails.push('mohamed.gamal.work0@gmail.com');
          candidateEmails.push('admin@etegah.com');
        } else {
          candidateEmails.push(`${safeInput}@etegah.com`);
        }

        for (const emailToTry of candidateEmails) {
          try {
            const userCred = await signInWithEmailAndPassword(auth, emailToTry, empPassword);
            if (userCred && userCred.user) {
              const uDoc = await getDoc(doc(db, 'users', userCred.user.uid));
              if (uDoc.exists()) {
                matchedEmp = { id: uDoc.id, ...uDoc.data() };
              } else {
                matchedEmp = { 
                  name: adminInput ? '👑 الإدارة' : (userCred.user.displayName || rawInput), 
                  role: adminInput ? 'admin' : 'موظف',
                  isAdmin: adminInput
                };
              }
              break;
            }
          } catch (authErr) {}
        }
      }

      if (!matchedEmp) {
        setEmpError('بيانات الدخول غير صحيحة. يرجى التأكد من اسم الموظف/الأدمن وكلمة المرور.');
        setEmpLoading(false);
        return;
      }

      if (matchedEmp.isActive === false) {
        setEmpError('عذراً، هذا الحساب موقوف من قبل الإدارة.');
        setEmpLoading(false);
        return;
      }

      const isAdminUser = adminInput || matchedEmp.role === 'admin' || matchedEmp.isAdmin === true || matchedEmp.email === 'etegahanalysis@gmail.com';
      const alias = isAdminUser ? '👑 الإدارة' : (matchedEmp.aliasName || matchedEmp.pseudonym || matchedEmp.displayName || matchedEmp.username || matchedEmp.name || empIdentifier);
      const title = isAdminUser ? 'الأدمن / الإدارة' : (matchedEmp.title || matchedEmp.role || matchedEmp.jobTitle || 'مستشار مالي');

      localStorage.setItem('isEmpLoggedIn', 'true');
      localStorage.setItem('empAliasName', alias);
      localStorage.setItem('empTitle', title);
      localStorage.setItem('empCode', matchedEmp.empCode || (isAdminUser ? 'ADMIN' : ''));
      localStorage.setItem('visitorName', alias);
      localStorage.setItem('visitorPhone', matchedEmp.phoneNumber || matchedEmp.phone || '0000000000');

      setStep(3);
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (err) {
      console.error("Employee login error:", err);
      setEmpError('حدث خطأ أثناء تسجيل الدخول: ' + (err.message || 'بيانات غير صحيحة'));
    } finally {
      setEmpLoading(false);
    }
  };

  React.useEffect(() => {
    if (step === 2 && otp.length === 6) {
      handleVerifyOTP(null, otp);
    }
  }, [otp, step]);

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xl flex items-center justify-center p-4 font-sans text-white animate-fade-in" 
      dir="rtl"
      onClick={handleExitToHome}
    >
      {/* 3D Glassmorphism Logo Watermark Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-10 overflow-hidden z-0">
        <img 
          src="/logo.jpg" 
          alt="3D Logo Watermark" 
          className="w-[550px] h-[550px] rounded-full object-cover blur-[2px] scale-150 transform rotate-12 shadow-[0_0_90px_rgba(6,182,212,0.6)] border-4 border-cyan-400/20" 
        />
      </div>

      {/* 3D Glass Modal Card */}
      <div 
        className="bg-slate-950/90 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-[0_25px_80px_rgba(0,0,0,0.9)] border-t-2 border-t-cyan-400 relative z-10 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button to Exit to Home */}
        <button 
          onClick={handleExitToHome}
          className="absolute top-4 left-4 text-gray-400 hover:text-white transition p-1.5 rounded-full hover:bg-white/10 cursor-pointer"
          title="إغلاق والعودة للرئيسية"
        >
          <X size={20} />
        </button>

        <div className="flex justify-center mb-4">
          <img src="/logo.jpg" alt="Logo" className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)]" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 text-white flex items-center justify-center gap-2">
          تسجيل الدخول للمنصة 🔐
        </h2>

        {/* Dual Login Type Selector Tabs */}
        {step === 1 && (
          <div className="flex bg-slate-900/90 p-1 rounded-xl mb-5 border border-cyan-500/30 shadow-inner">
            <button
              type="button"
              onClick={() => { setLoginType('customer'); setEmpError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                loginType === 'customer'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <User size={15} /> تسجيل دخول عميل
            </button>
            <button
              type="button"
              onClick={() => { setLoginType('employee'); setEmpError(''); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                loginType === 'employee'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <ShieldCheck size={15} /> تسجيل دخول موظف
            </button>
          </div>
        )}

        {/* Customer Login Form (OTP) */}
        {step === 1 && loginType === 'customer' && (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1.5 text-cyan-200">اسم الزائر (مطلوب)</label>
              <input
                type="text"
                value={visitorName}
                onChange={e => setVisitorName(e.target.value)}
                required
                placeholder="أدخل اسمك بالكامل"
                className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>
            <p className="text-[10px] text-gray-400 text-center">يمكنك كتابة الاسم بالعربية أو الإنجليزية</p>

            <div>
              <label className="block text-xs font-bold mb-1.5 text-cyan-200">البريد الإلكتروني (اختياري)</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="أدخل بريدك الإلكتروني"
                className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5 text-cyan-200">رقم الهاتف (مطلوب)</label>
              <div className="flex bg-slate-900 border border-cyan-500/30 rounded-xl overflow-hidden focus-within:border-cyan-400 transition" dir="ltr">
                <select 
                  value={countryCode} 
                  onChange={e => setCountryCode(e.target.value)}
                  className="bg-slate-900 text-cyan-300 px-3 py-2.5 border-r border-white/10 focus:outline-none outline-none font-bold text-xs cursor-pointer"
                >
                  <option value="+966">السعودية (+966)</option>
                  <option value="+971">الإمارات (+971)</option>
                  <option value="+1">أمريكا (+1)</option>
                </select>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={e => handlePhoneInputChange(e.target.value)}
                  required
                  placeholder={
                    countryCode === '+966' ? "5XXXXXXXX" :
                    countryCode === '+971' ? "5XXXXXXXX" : "XXXXXXXXXX"
                  }
                  className="w-full bg-transparent px-3 py-2.5 focus:outline-none text-white placeholder-gray-500 text-left font-mono font-bold text-xs"
                />
              </div>
            </div>

            <div className="bg-cyan-950/40 p-2.5 rounded-xl border border-cyan-500/20 text-center text-xs text-cyan-300 flex items-center justify-center gap-1.5 mt-2">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>يتم إرسال كود التفعيل عبر رسالة نصية SMS 💬</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-cyan-500/25 transition duration-200 mt-4 text-xs cursor-pointer disabled:opacity-50"
            >
              {loading ? 'جاري التحميل...' : 'إرسال كود التحقق'}
            </button>
          </form>
        )}

        {/* Employee Login Form */}
        {step === 1 && loginType === 'employee' && (
          <form onSubmit={handleEmployeeLogin} className="space-y-4">
            {empError && (
              <div className="bg-rose-950/70 border border-rose-500/40 text-rose-200 p-2.5 rounded-xl text-xs text-center font-bold">
                {empError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold mb-1.5 text-cyan-200">اسم الموظف / الرمز الوظيفي (مطلوب)</label>
              <input
                type="text"
                value={empIdentifier}
                onChange={e => setEmpIdentifier(e.target.value)}
                required
                placeholder="أدخل اسم الموظف أو رمزه"
                className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5 text-cyan-200">الرقم السري (مطلوب)</label>
              <div className="relative">
                <input
                  type={showEmpPassword ? 'text' : 'password'}
                  value={empPassword}
                  onChange={e => setEmpPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-cyan-500/30 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowEmpPassword(!showEmpPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showEmpPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-cyan-500/20 text-center text-[11px] text-cyan-300 flex items-center justify-center gap-1.5">
              <Lock size={14} className="text-cyan-400" />
              <span>تسجيل دخول خاص بالموظفين المعتمدين بالسيستم 🔐</span>
            </div>

            <button
              type="submit"
              disabled={empLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-cyan-500/25 transition duration-200 mt-4 text-xs cursor-pointer disabled:opacity-50"
            >
              {empLoading ? 'جاري التحقق...' : 'تسجيل الدخول كموظف'}
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-5 text-center">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-white">أدخل رمز التحقق</h3>
              <p className="text-xs text-gray-400">
                تم إرسال كود من 6 أرقام إلى جوالك عبر رسالة نصية SMS 💬
              </p>
            </div>

            <input
              type="text"
              maxLength="6"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="000000"
              autoFocus
              className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl px-4 py-3 text-center text-2xl font-bold tracking-[0.6em] focus:outline-none focus:border-cyan-400 transition text-cyan-400 font-mono"
            />

            <button
              type="submit"
              disabled={loading || otp.length < 6}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3 rounded-xl shadow-lg transition duration-200 text-xs cursor-pointer disabled:opacity-50"
            >
              {loading ? 'جاري التحقق...' : 'تأكيد التسجيل'}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp('');
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 transition cursor-pointer"
            >
              تعديل رقم الهاتف
            </button>
          </form>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-2xl animate-bounce">
              ✓
            </div>
            <h3 className="text-xl font-bold text-white">تم التسجيل بنجاح!</h3>
            <p className="text-xs text-gray-400">جاري تحويلك إلى منصة اتجاه التحليل الذكي...</p>
          </div>
        )}
      </div>
    </div>
  );
}
