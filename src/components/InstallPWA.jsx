import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Sparkles, CheckCircle2 } from 'lucide-react';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('visitorPhone') || localStorage.getItem('visitorName');
    const isDismissed = sessionStorage.getItem('pwa_banner_dismissed');

    if (!isLoggedIn || isDismissed) return;

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isStandalone = window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;

    if (isIosDevice && !isStandalone) {
      setIsIOS(true);
      setShowInstallBanner(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallBanner(false);
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  };

  if (!showInstallBanner) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-[9990] bg-gradient-to-r from-slate-900/95 via-indigo-950/95 to-slate-900/95 backdrop-blur-2xl border-2 border-cyan-400 text-white p-4.5 rounded-3xl shadow-[0_20px_60px_rgba(6,182,212,0.4)] animate-bounce border-t-2 border-t-cyan-300 font-sans" dir="rtl">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center shrink-0 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <Smartphone size={24} />
          </div>
          <div>
            <h4 className="font-extrabold text-xs sm:text-sm text-white flex items-center gap-1.5">
              تثبيت تطبيق منصة اتجاه 📲
              <Sparkles size={14} className="text-amber-300 animate-spin" />
            </h4>
            <p className="text-[11px] text-gray-300 leading-relaxed mt-0.5">
              ثبّت التطبيق على جهازك أو موبايلك للوصول السريع والتنبيهات المباشرة!
            </p>
          </div>
        </div>
        <button 
          onClick={handleDismiss} 
          className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 shrink-0 cursor-pointer"
        >
          <X size={16} />
        </button>
      </div>

      {isIOS ? (
        <div className="mt-3 p-2.5 bg-cyan-950/60 border border-cyan-500/30 rounded-2xl text-[11px] text-cyan-200">
          💡 للتثبيت على الأيفون: اضغط زر المشاركة <span className="font-bold text-white">⎋</span> أسفل المتصفح، ثم اختر <span className="font-bold text-white">"إضافة إلى الشاشة الرئيسية Add to Home Screen"</span>.
        </div>
      ) : (
        <div className="mt-3.5 flex items-center gap-2">
          <button
            onClick={handleInstallClick}
            className="flex-1 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-extrabold py-2.5 px-4 rounded-xl shadow-lg border border-emerald-300/40 text-xs flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
          >
            <Download size={16} />
            <span>تثبيت التطبيق الآن</span>
          </button>
          <button
            onClick={handleDismiss}
            className="bg-white/10 hover:bg-white/20 text-gray-300 font-bold py-2.5 px-3 rounded-xl text-xs cursor-pointer transition"
          >
            لاحقاً
          </button>
        </div>
      )}
    </div>
  );
}
