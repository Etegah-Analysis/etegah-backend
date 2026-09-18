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
      
      {/* Hero Section with Separated 3D Glowing Glass Windows */}
      <section className="hero relative z-10 py-6 md:py-10">
        <div className="container flex flex-col md:flex-row items-stretch gap-6 sm:gap-8 relative z-10">
          
          {/* Logo Card Window - Standalone 3D Glowing Glass */}
          <div className="w-full md:w-5/12 flex justify-center items-center">
            <div className="w-full h-full min-h-[300px] bg-gradient-to-br from-slate-900/90 via-indigo-950/90 to-slate-900/90 backdrop-blur-2xl border border-cyan-400/50 shadow-[0_20px_60px_rgba(6,182,212,0.35)] border-t-2 border-t-cyan-300 p-6 rounded-3xl flex justify-center items-center relative overflow-hidden group transform hover:scale-[1.02] transition-all duration-500">
              {/* Glowing Ambient Backdrop */}
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/15 via-transparent to-blue-500/15 pointer-events-none"></div>
              <img 
                src={logoImg} 
                alt="Etegah Logo" 
                className="w-full max-w-xs sm:max-w-sm rounded-2xl object-cover shadow-[0_15px_40px_rgba(0,0,0,0.8)] border border-cyan-400/30 transform group-hover:scale-105 transition-all duration-500" 
              />
            </div>
          </div>

          {/* Text Content Card Window - Standalone 3D Glass */}
          <div className="hero-content w-full md:w-7/12 bg-gradient-to-bl from-slate-900/90 via-indigo-950/90 to-slate-900/90 backdrop-blur-2xl border border-cyan-500/40 shadow-[0_20px_60px_rgba(6,182,212,0.3)] border-t-2 border-t-cyan-400 p-6 sm:p-10 rounded-3xl flex flex-col justify-center text-center md:text-right relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold mb-6 shadow-[0_0_20px_rgba(6,182,212,0.2)] self-center md:self-start">
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

        </div>
      </section>

      {/* About Section - "What is Etegah?" */}
      <section className="relative z-10 py-16 my-8">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="w-full md:w-1/2 order-2 md:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-slate-900/80 via-indigo-950/80 to-slate-900/80 backdrop-blur-2xl border border-cyan-500/40 shadow-[0_15px_45px_rgba(6,182,212,0.25)] border-t-2 border-t-cyan-400 p-6 rounded-3xl hover:scale-105 transition-all duration-300 flex flex-col justify-between group">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/50 flex items-center justify-center mb-3 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                    <ShieldCheck size={26} />
                  </div>
                  <h4 className="font-extrabold text-white text-base mb-1">أمان تام</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">حماية تامة للبيانات والتحليلات</p>
                </div>

                <div className="bg-gradient-to-r from-slate-900/80 via-indigo-950/80 to-slate-900/80 backdrop-blur-2xl border border-cyan-500/40 shadow-[0_15px_45px_rgba(6,182,212,0.25)] border-t-2 border-t-cyan-400 p-6 rounded-3xl hover:scale-105 transition-all duration-300 flex flex-col justify-between group">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/50 flex items-center justify-center mb-3 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                    <Cpu size={26} />
                  </div>
                  <h4 className="font-extrabold text-white text-base mb-1">ذكاء اصطناعي</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">خوارزميات رصد الاتجاهات</p>
                </div>

                <div className="bg-gradient-to-r from-slate-900/80 via-indigo-950/80 to-slate-900/80 backdrop-blur-2xl border border-cyan-500/40 shadow-[0_15px_45px_rgba(6,182,212,0.25)] border-t-2 border-t-cyan-400 p-6 rounded-3xl hover:scale-105 transition-all duration-300 flex flex-col justify-between group">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/50 flex items-center justify-center mb-3 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                    <Zap size={26} />
                  </div>
                  <h4 className="font-extrabold text-white text-base mb-1">سرعة لحظية</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">تحديثات أسعار مباشرة</p>
                </div>

                <div className="bg-gradient-to-r from-slate-900/80 via-indigo-950/80 to-slate-900/80 backdrop-blur-2xl border border-cyan-500/40 shadow-[0_15px_45px_rgba(6,182,212,0.25)] border-t-2 border-t-cyan-400 p-6 rounded-3xl hover:scale-105 transition-all duration-300 flex flex-col justify-between group">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/50 flex items-center justify-center mb-3 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                    <Globe size={26} />
                  </div>
                  <h4 className="font-extrabold text-white text-base mb-1">تغطية شاملة</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">السوق السعودي والأمريكي</p>
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 order-1 md:order-2">
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">ما هي منصة اتجاه؟</h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-4">
                منصة "اتجاه" هي شريكك الرقمي في عالم التداول، نجمع بين عراقة التحليل المالي وأحدث ابتكارات الذكاء الاصطناعي (AI) لتمكين المتداول من قراءة السوق برؤية أعمق، بعيداً عن العشوائية.
              </p>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
                نحن نقدم أدوات تحليل لحظية، رصد للسيولة، وتحديد دقيق لمناطق العرض والطلب لتجعل قرارك الاستثماري مبنياً على البيانات لا العاطفة.
              </p>
              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm font-bold text-cyan-200">
                <div className="flex items-center gap-2.5 bg-gradient-to-r from-slate-900/80 via-indigo-950/80 to-slate-900/80 backdrop-blur-2xl p-3.5 rounded-2xl border border-cyan-500/40 border-t-2 border-t-cyan-400/80 shadow-lg hover:scale-[1.02] transition">
                  <ArrowRight size={16} className="text-cyan-400 shrink-0" />
                  <span>دعم فني متواصل 24/7</span>
                </div>
                <div className="flex items-center gap-2.5 bg-gradient-to-r from-slate-900/80 via-indigo-950/80 to-slate-900/80 backdrop-blur-2xl p-3.5 rounded-2xl border border-cyan-500/40 border-t-2 border-t-cyan-400/80 shadow-lg hover:scale-[1.02] transition">
                  <ArrowRight size={16} className="text-cyan-400 shrink-0" />
                  <span>تقارير يومية ذكية</span>
                </div>
                <div className="flex items-center gap-2.5 bg-gradient-to-r from-slate-900/80 via-indigo-950/80 to-slate-900/80 backdrop-blur-2xl p-3.5 rounded-2xl border border-cyan-500/40 border-t-2 border-t-cyan-400/80 shadow-lg hover:scale-[1.02] transition">
                  <ArrowRight size={16} className="text-cyan-400 shrink-0" />
                  <span>تحليل 200+ شركة</span>
                </div>
                <div className="flex items-center gap-2.5 bg-gradient-to-r from-slate-900/80 via-indigo-950/80 to-slate-900/80 backdrop-blur-2xl p-3.5 rounded-2xl border border-cyan-500/40 border-t-2 border-t-cyan-400/80 shadow-lg hover:scale-[1.02] transition">
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
          <div className="bg-gradient-to-r from-slate-900/90 via-indigo-950/90 to-slate-900/90 backdrop-blur-2xl border border-cyan-500/40 shadow-[0_20px_60px_rgba(6,182,212,0.2)] border-t-2 border-t-cyan-400 p-6 sm:p-8 rounded-3xl hover:scale-[1.03] transition-all duration-500 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/50 flex items-center justify-center mb-5 text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.4)]">
                <BarChart3 size={26} />
              </div>
              <h3 className="font-extrabold text-white text-xl mb-3">تحليل اتجاه فوري</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">رصد دقيق لاتجاهات السوق وتغيراتها قبل الجميع باستخدام خوارزميات تعلم الآلة والذكاء الاصطناعي.</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-slate-900/90 via-indigo-950/90 to-slate-900/90 backdrop-blur-2xl border border-cyan-500/40 shadow-[0_20px_60px_rgba(6,182,212,0.2)] border-t-2 border-t-cyan-400 p-6 sm:p-8 rounded-3xl hover:scale-[1.03] transition-all duration-500 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/50 flex items-center justify-center mb-5 text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.4)]">
                <Target size={26} />
              </div>
              <h3 className="font-extrabold text-white text-xl mb-3">نقاط دخول وخروج</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">تحديد مستويات الدعم والمقاومة الحرجة ونقاط الانعكاس المحتملة بدقة متناهية.</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-slate-900/90 via-indigo-950/90 to-slate-900/90 backdrop-blur-2xl border border-cyan-500/40 shadow-[0_20px_60px_rgba(6,182,212,0.2)] border-t-2 border-t-cyan-400 p-6 sm:p-8 rounded-3xl hover:scale-[1.03] transition-all duration-500 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/50 flex items-center justify-center mb-5 text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.4)]">
                <ShieldCheck size={26} />
              </div>
              <h3 className="font-extrabold text-white text-xl mb-3">إدارة المخاطر</h3>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">أدوات متطورة لتقييم مخاطر المحفظة وتقديم توصيات ذكية للحفاظ على رأس المال واستدامته.</p>
            </div>
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

