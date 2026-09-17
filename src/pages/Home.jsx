import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Target, 
  Globe, 
  BarChart3,
  ArrowRight,
  MessageCircle
} from 'lucide-react';
import logoImg from '../assets/logo.jpg';

export default function Home({ onOpenRegister }) {

  const handleOpenWhatsApp = () => {
    const phone = localStorage.getItem('visitorPhone') || '';
    if (!phone) {
      window.location.href = '/visitor-login';
      return;
    }
    window.dispatchEvent(new Event('open_whatsapp_widget'));
  };

  return (
    <div className="home-page animate-fade-in relative z-10 py-6">
      
      {/* Hero Section */}
      <section className="hero relative z-10 py-12 md:py-20 flex items-center">
        <div className="container flex flex-col md:flex-row items-center gap-12 relative z-10">
          <div className="hero-content w-full md:w-1/2 text-center md:text-right flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold mb-6 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <SparklesIcon /> مستقبل التداول الذكي في السوق السعودي والخليجي
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-white mb-6">
              نحو قرارات أدق... <br/>
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">برؤية أعمق وذكاء أصيل</span>
            </h1>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto md:mx-0">
              منصة "اتجاه" تدمج خبرة أسواق المال مع قوة الذكاء الاصطناعي لتوفر لك تحليلاً احترافياً لحظياً يساعدك على اقتناص الفرص وتجنب المخاطر.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <button 
                onClick={handleOpenWhatsApp}
                className="flex items-center gap-2.5 font-bold cursor-pointer bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white px-6 py-3.5 rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.4)] border border-emerald-300/40 transition-all transform hover:scale-105 active:scale-95 text-xs sm:text-sm"
              >
                <MessageCircle size={20} className="animate-bounce shrink-0" />
                <span>تواصل معنا عبر الواتساب الآن</span>
              </button>
            </div>
          </div>
          
          <div className="hero-visual w-full md:w-1/2 mt-6 md:mt-0 relative flex justify-center items-center">
            {/* 3D Glassmorphism Logo Card Container */}
            <div className="relative p-6 sm:p-8 bg-slate-900/60 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] border-t-2 border-t-cyan-400 transform hover:scale-[1.02] transition-all duration-500 z-10 group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <img src={logoImg} alt="Etegah Logo" className="relative w-full max-w-sm sm:max-w-md rounded-2xl object-cover shadow-2xl border border-white/20" />
            </div>
          </div>
        </div>
      </section>

      {/* About Section - "What is Etegah?" */}
      <section className="relative z-10 py-16 my-8">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/2 order-2 md:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/30 p-6 rounded-2xl shadow-xl hover:border-cyan-400/60 transition duration-300">
                  <ShieldCheck size={36} className="text-cyan-400 mb-3" />
                  <h4 className="font-bold text-white text-base">أمان تام</h4>
                  <p className="text-xs text-gray-400 mt-1">حماية تامة للبيانات والتحليلات</p>
                </div>
                <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/30 p-6 rounded-2xl shadow-xl hover:border-cyan-400/60 transition duration-300">
                  <Cpu size={36} className="text-cyan-400 mb-3" />
                  <h4 className="font-bold text-white text-base">ذكاء اصطناعي</h4>
                  <p className="text-xs text-gray-400 mt-1">خوارزميات رصد الاتجاهات</p>
                </div>
                <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/30 p-6 rounded-2xl shadow-xl hover:border-cyan-400/60 transition duration-300">
                  <Zap size={36} className="text-cyan-400 mb-3" />
                  <h4 className="font-bold text-white text-base">سرعة لحظية</h4>
                  <p className="text-xs text-gray-400 mt-1">تحديثات أسعار مباشرة</p>
                </div>
                <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/30 p-6 rounded-2xl shadow-xl hover:border-cyan-400/60 transition duration-300">
                  <Globe size={36} className="text-cyan-400 mb-3" />
                  <h4 className="font-bold text-white text-base">تغطية شاملة</h4>
                  <p className="text-xs text-gray-400 mt-1">السوق السعودي والأمريكي</p>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 order-1 md:order-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">ما هي منصة اتجاه؟</h2>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                منصة "اتجاه" هي شريكك الرقمي في عالم التداول، نجمع بين عراقة التحليل المالي وأحدث ابتكارات الذكاء الاصطناعي (AI) لتمكين المتداول من قراءة السوق برؤية أعمق، بعيداً عن العشوائية.
              </p>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                نحن نقدم أدوات تحليل لحظية، رصد للسيولة، وتحديد دقيق لمناطق العرض والطلب لتجعل قرارك الاستثماري مبنياً على البيانات لا العاطفة.
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-cyan-200">
                <div className="flex items-center gap-2 bg-slate-900/40 p-2.5 rounded-xl border border-cyan-500/20">
                  <ArrowRight size={16} className="text-cyan-400 shrink-0" />
                  <span>دعم فني متواصل 24/7</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/40 p-2.5 rounded-xl border border-cyan-500/20">
                  <ArrowRight size={16} className="text-cyan-400 shrink-0" />
                  <span>تقارير يومية ذكية</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/40 p-2.5 rounded-xl border border-cyan-500/20">
                  <ArrowRight size={16} className="text-cyan-400 shrink-0" />
                  <span>تحليل 200+ شركة</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/40 p-2.5 rounded-xl border border-cyan-500/20">
                  <ArrowRight size={16} className="text-cyan-400 shrink-0" />
                  <span>تحديثات لحظية دقيقة</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="container relative z-10 py-12">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">لماذا يختار المتداولون "اتجاه"؟</h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">قوة التكنولوجيا والذكاء الاصطناعي بين يديك لتحقيق أهدافك المالية.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/30 p-6 rounded-3xl shadow-xl hover:border-cyan-400/60 transition duration-300 flex flex-col">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center mb-4 text-cyan-300">
              <BarChart3 size={24} />
            </div>
            <h3 className="font-bold text-white text-lg mb-2">تحليل اتجاه فوري</h3>
            <p className="text-xs text-gray-300 leading-relaxed">رصد دقيق لاتجاهات السوق وتغيراتها قبل الجميع باستخدام خوارزميات تعلم الآلة والذكاء الاصطناعي.</p>
          </div>
          
          <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/30 p-6 rounded-3xl shadow-xl hover:border-cyan-400/60 transition duration-300 flex flex-col">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center mb-4 text-cyan-300">
              <Target size={24} />
            </div>
            <h3 className="font-bold text-white text-lg mb-2">نقاط دخول وخروج</h3>
            <p className="text-xs text-gray-300 leading-relaxed">تحديد مستويات الدعم والمقاومة الحرجة ونقاط الانعكاس المحتملة بدقة متناهية.</p>
          </div>
          
          <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/30 p-6 rounded-3xl shadow-xl hover:border-cyan-400/60 transition duration-300 flex flex-col">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center mb-4 text-cyan-300">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-bold text-white text-lg mb-2">إدارة المخاطر</h3>
            <p className="text-xs text-gray-300 leading-relaxed">أدوات متطورة لتقييم مخاطر المحفظة وتقديم توصيات ذكية للحفاظ على رأس المال واستدامته.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container my-12 relative z-10">
        <div className="bg-gradient-to-r from-slate-900/90 via-indigo-950/90 to-slate-900/90 backdrop-blur-2xl border border-cyan-500/40 shadow-[0_20px_60px_rgba(6,182,212,0.2)] p-8 sm:p-10 rounded-3xl text-center max-w-2xl mx-auto border-t-2 border-t-cyan-400">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">ابدأ استثمارك بذكاء اليوم</h2>
          <p className="text-gray-300 text-xs sm:text-sm mb-6 leading-relaxed max-w-md mx-auto">
            انضم إلى مئات المتداولين الذين يستخدمون منصة اتجاه يومياً لتحسين أدائهم وتداولاتهم.
          </p>
          <button 
            onClick={handleOpenWhatsApp}
            className="flex items-center gap-2.5 font-bold mx-auto cursor-pointer bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white px-6 py-3 rounded-2xl shadow-[0_8px_25px_rgba(16,185,129,0.35)] border border-emerald-300/40 transition-all transform hover:scale-105 active:scale-95 text-xs sm:text-sm"
          >
            <MessageCircle size={18} />
            <span>تواصل معنا عبر الواتساب الآن</span>
          </button>
        </div>
      </section>

    </div>
  );
}

function SparklesIcon() {
  return (
    <svg className="w-4 h-4 text-cyan-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

