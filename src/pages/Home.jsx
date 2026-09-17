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
    <div className="home-page animate-fade-in relative overflow-hidden">
      
      {/* 3D Glassmorphism Logo Watermark Background for Page */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-5 overflow-hidden z-0">
        <img 
          src="/logo.jpg" 
          alt="3D Logo Watermark" 
          className="w-[600px] h-[600px] rounded-full object-cover blur-[2px] scale-150 transform rotate-12 border-4 border-cyan-400/20" 
        />
      </div>

      {/* Hero Section */}
      <section className="hero relative z-10" style={{ 
        minHeight: '85vh', 
        display: 'flex', 
        alignItems: 'center', 
        position: 'relative', 
        overflow: 'hidden',
        background: 'var(--dark-navy)'
      }}>
        <div className="container flex flex-col md:flex-row items-center gap-12" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-content w-full md:w-1/2 text-center md:text-right" style={{ flex: 1 }}>
            <div className="badge-modern mx-auto md:mx-0">
              مستقبل التداول الذكي في السوق السعودي
            </div>
            <h1 className="hero-title">
              نحو قرارات أدق... <br/>
              <span style={{ color: 'var(--primary-blue)' }}>برؤية أعمق</span>
            </h1>
            <p className="hero-subtitle">
              منصة "اتجاه" تدمج خبرة أسواق المال مع قوة الذكاء الاصطناعي لتوفر لك تحليلاً احترافياً لحظياً يساعدك على اقتناص الفرص وتجنب المخاطر.
            </p>
            <div className="flex justify-center md:justify-end gap-4 mt-6">
              <button 
                onClick={handleOpenWhatsApp}
                className="flex items-center gap-2 font-bold cursor-pointer bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white px-5 py-3 rounded-xl shadow-[0_8px_25px_rgba(16,185,129,0.35)] border border-emerald-300/40 transition-all transform hover:scale-105 active:scale-95 text-xs sm:text-sm"
              >
                <MessageCircle size={18} className="animate-bounce" />
                <span>تواصل معنا عبر الواتساب</span>
              </button>
            </div>
          </div>
          
          <div className="hero-visual w-full md:w-1/2 mt-8 md:mt-0 relative flex justify-center items-center">
            {/* 3D Glassmorphism Logo Container */}
            <div className="relative p-6 sm:p-8 bg-slate-900/60 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] border-t-2 border-t-cyan-400 transform hover:scale-[1.02] transition-all duration-500 z-10">
              <img src={logoImg} alt="Etegah Logo" className="w-full max-w-sm sm:max-w-md rounded-2xl object-cover shadow-2xl border border-white/10" />
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="hero-glow"></div>
      </section>

      {/* About Section - "What is Etegah?" */}
      <section className="relative z-10" style={{ padding: '6rem 0', background: 'rgba(255,255,255,0.02)' }}>
        <div className="container">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <div style={{ flex: 1, order: 2 }}>
              <div className="about-grid">
                <div className="card glass about-card backdrop-blur-xl border border-white/10 shadow-2xl">
                  <ShieldCheck size={36} color="var(--primary-blue)" />
                  <h4>أمان تام</h4>
                </div>
                <div className="card glass about-card offset backdrop-blur-xl border border-white/10 shadow-2xl">
                  <Cpu size={36} color="var(--primary-blue)" />
                  <h4>ذكاء اصطناعي</h4>
                </div>
                <div className="card glass about-card backdrop-blur-xl border border-white/10 shadow-2xl">
                  <Zap size={36} color="var(--primary-blue)" />
                  <h4>سرعة لحظية</h4>
                </div>
                <div className="card glass about-card offset backdrop-blur-xl border border-white/10 shadow-2xl">
                  <Globe size={36} color="var(--primary-blue)" />
                  <h4>تغطية شاملة</h4>
                </div>
              </div>
            </div>
            
            <div style={{ flex: 1.2 }}>
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.2rem' }}>ما هي منصة اتجاه؟</h2>
              <p className="about-text">
                منصة "اتجاه" هي شريكك الرقمي في عالم التداول، نجمع بين عراقة التحليل المالي وأحدث ابتكارات الذكاء الاصطناعي (AI) لتمكين المتداول في السوق السعودي من قراءة السوق برؤية أعمق، بعيداً عن العشوائية.
              </p>
              <p className="about-text">
                نحن نقدم أدوات تحليل لحظية، رصد للسيولة، وتحديد دقيق لمناطق العرض والطلب لتجعل قرارك الاستثماري مبنياً على البيانات لا العاطفة. مهمتنا هي تحويل البيانات المعقدة إلى فرص استثمارية واضحة.
              </p>
              <ul className="about-list">
                <li><ArrowRight size={18} color="var(--primary-blue)" /> دعم فني متواصل</li>
                <li><ArrowRight size={18} color="var(--primary-blue)" /> تقارير يومية ذكية</li>
                <li><ArrowRight size={18} color="var(--primary-blue)" /> تحليل 200+ شركة</li>
                <li><ArrowRight size={18} color="var(--primary-blue)" /> تحديثات لحظية</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="container relative z-10" style={{ padding: '5rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>لماذا يختار المتداولون "اتجاه"؟</h2>
          <p style={{ color: 'var(--text-light)', maxWidth: '700px', margin: '0 auto' }}>قوة التكنولوجيا بين يديك لتحقيق أهدافك المالية.</p>
        </div>
        
        <div className="value-grid">
          <div className="card glass value-card backdrop-blur-xl border border-white/10 shadow-2xl">
            <div className="value-icon-box">
              <BarChart3 size={24} color="var(--primary-blue)" />
            </div>
            <h3 style={{ fontSize: '1.1rem' }}>تحليل اتجاه فوري</h3>
            <p style={{ fontSize: '0.85rem' }}>رصد دقيق لاتجاهات السوق وتغيراتها قبل الجميع باستخدام خوارزميات تعلم الآلة.</p>
          </div>
          
          <div className="card glass value-card backdrop-blur-xl border border-white/10 shadow-2xl">
            <div className="value-icon-box">
              <Target size={24} color="var(--primary-blue)" />
            </div>
            <h3 style={{ fontSize: '1.1rem' }}>نقاط دخول وخروج</h3>
            <p style={{ fontSize: '0.85rem' }}>تحديد مستويات الدعم والمقاومة الحرجة ونقاط الانعكاس المحتملة بدقة متناهية.</p>
          </div>
          
          <div className="card glass value-card backdrop-blur-xl border border-white/10 shadow-2xl">
            <div className="value-icon-box">
              <ShieldCheck size={24} color="var(--primary-blue)" />
            </div>
            <h3 style={{ fontSize: '1.1rem' }}>إدارة المخاطر</h3>
            <p style={{ fontSize: '0.85rem' }}>أدوات متطورة لتقييم مخاطر المحفظة وتقديم توصيات ذكية للحفاظ على رأس المال.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mt-6 mb-12 relative z-10">
        <div className="cta-box card glass backdrop-blur-2xl border border-cyan-500/20 shadow-2xl p-6 sm:p-8 text-center max-w-2xl mx-auto">
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>ابدأ استثمارك بذكاء اليوم</h2>
          <p className="cta-text text-gray-300 text-xs sm:text-sm mb-5 leading-relaxed max-w-md mx-auto">
            انضم إلى مئات المتداولين الذين يستخدمون منصة اتجاه يومياً لتحسين أدائهم في السوق السعودي.
          </p>
          <button 
            onClick={handleOpenWhatsApp}
            className="flex items-center gap-2 font-bold mx-auto cursor-pointer bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white px-5 py-2.5 rounded-xl shadow-[0_8px_25px_rgba(16,185,129,0.35)] border border-emerald-300/40 transition-all transform hover:scale-105 active:scale-95 text-xs sm:text-sm"
          >
            <MessageCircle size={18} />
            <span>تواصل معنا عبر الواتساب الآن</span>
          </button>
        </div>
      </section>

    </div>
  );
}
