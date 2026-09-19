import React, { useEffect } from 'react';
import { Play, Award, Sparkles, Video, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PlatformVideos() {
  useEffect(() => {
    document.title = 'فيديوهات المنصة والنتائج السابقة - اتجاه للتحليل الذكي';
  }, []);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 font-sans relative z-10 text-white" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-slate-900/90 via-cyan-950/70 to-slate-900/90 backdrop-blur-2xl border border-cyan-500/30 rounded-3xl p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] border-t-2 border-t-cyan-400 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold mb-4 shadow-sm">
            <Sparkles size={14} className="text-cyan-400" />
            <span>عرض حي وتوثيق مباشر 🎬</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white mb-3 tracking-wide drop-shadow-md">
            فيديوهات المنصة والنتائج السابقة 🎥✨
          </h1>

          <p className="text-xs sm:text-sm text-cyan-200 max-w-2xl mx-auto leading-relaxed">
            استعرض هنا جميع الشروحات التوضيحية، استراتيجيات التحليل الذكي، وتوثيق النتائج السابقة لمنصة اتجاه.
          </p>

          <div className="mt-6 flex justify-center">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 font-bold text-xs transition"
            >
              <ArrowLeft size={16} /> العودة للرئيسية
            </Link>
          </div>
        </div>

        {/* Placeholder Video Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div 
              key={item}
              className="bg-slate-950/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-5 shadow-xl hover:border-cyan-400/60 transition group flex flex-col justify-between"
            >
              <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center mb-4 group-hover:border-cyan-500/40 transition">
                <div className="w-14 h-14 rounded-full bg-cyan-500/20 border-2 border-cyan-400 text-cyan-300 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)] group-hover:scale-110 transition">
                  <Play size={24} className="mr-0.5 text-cyan-300 fill-cyan-300/30" />
                </div>
                <span className="absolute bottom-2 left-2 text-[10px] font-mono font-bold bg-slate-950/80 px-2 py-0.5 rounded-md border border-white/10 text-cyan-300">
                  عرض فيديو #{item}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-white mb-1.5 flex items-center gap-1.5">
                  <Video size={16} className="text-cyan-400 shrink-0" />
                  <span>نتائج التحليل والاستراتيجيات #{item}</span>
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                  معاينة وتوثيق حي لأداء المنصة والتحليلات الذكية السابقة.
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
