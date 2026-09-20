import React, { useEffect, useState } from 'react';
import { Play, Award, Sparkles, Video, ArrowLeft, FileText, Download, Calendar, Clock, ExternalLink, ShieldCheck, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { db, collection, onSnapshot, deleteDoc, doc } from '../firebase';
import { toast } from 'react-hot-toast';

export default function PlatformVideos() {
  const [reports, setReports] = useState({ saudi: null, us: null });
  const [videoList, setVideoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPdfReport, setSelectedPdfReport] = useState(null);
  const isEmp = localStorage.getItem('isEmpLoggedIn') === 'true' || localStorage.getItem('visitorName')?.includes('Admin') || localStorage.getItem('visitorName')?.includes('إدارة');

  useEffect(() => {
    document.title = 'فيديوهات المنصة والنتائج السابقة - اتجاه للتحليل الذكي';

    const unsubReports = onSnapshot(collection(db, 'weekly_reports'), (snapshot) => {
      const reportsMap = { saudi: null, us: null };
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data.market === 'saudi' || docSnap.id === 'saudi_latest' || docSnap.id === 'saudi') {
          if (data.pdfUrl || !reportsMap.saudi) reportsMap.saudi = data;
        }
        if (data.market === 'us' || docSnap.id === 'us_latest' || docSnap.id === 'us') {
          if (data.pdfUrl || !reportsMap.us) reportsMap.us = data;
        }
      });
      setReports(reportsMap);
      setLoading(false);
    }, (err) => {
      console.warn('Error reading weekly_reports:', err);
      setLoading(false);
    });

    const unsubVideos = onSnapshot(collection(db, 'platform_videos'), (snapshot) => {
      const list = [];
      snapshot.forEach(docSnap => {
        list.push({ id: docSnap.id, ...docSnap.data() });
      });
      setVideoList(list);
    }, (err) => {
      console.warn('Error reading platform_videos:', err);
    });

    return () => {
      unsubReports();
      unsubVideos();
    };
  }, []);

  const handleDeleteVideo = async (videoId, videoTitle) => {
    if (!window.confirm(`هل أنت تأكد من رغبتك في حذف فيديو "${videoTitle || 'هذا الفيديو'}" من موقع المنصة فوراً؟`)) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'platform_videos', videoId));
      toast.success('تم حذف الفيديو من موقع المنصة بنجاح 🗑️✨');
    } catch (err) {
      console.error('Error deleting video:', err);
      toast.error('حدث خطأ أثناء حذف الفيديو');
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 font-sans relative z-10 text-white" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-10">
        
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
            استعرض التقرير الأسبوعي الشامل للسوق السعودي والأمريكي (PDF) والتحليلات الشاملة لنتائج منصة اتجاه.
          </p>

          <div className="mt-6 flex justify-center">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 font-bold text-xs transition shadow-md"
            >
              <ArrowLeft size={16} /> العودة للرئيسية
            </Link>
          </div>
        </div>

        {/* Section 1: Weekly PDF Reports (التقرير الأسبوعي 📄) */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b border-cyan-500/20 pb-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-300 shadow-md">
              <FileText size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-amber-300 flex items-center gap-2">
                <span>التقرير الأسبوعي 📄</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300">
                  متزامن بالتاريخ والوقت
                </span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                تقارير أسبوعية معتمدة ومحدثة دورياً للسوق السعودي والسوق الأمريكي بفرص ومؤشرات المنصة.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1: Saudi Market Weekly Report */}
            <div className="bg-gradient-to-br from-slate-950/90 via-emerald-950/30 to-slate-950/90 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between hover:border-emerald-400/60 transition group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🇸🇦</span>
                    <h3 className="text-lg font-extrabold text-emerald-300">التقرير الأسبوعي للسوق السعودي</h3>
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center gap-1">
                    <ShieldCheck size={13} />
                    <span>تقرير معتمد</span>
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  تقرير تحليلي رصين يشمل أهم حركة المؤشر العام (تاسي)، وأقوى صفقات ودعوم الأسهم السعودية.
                </p>

                {/* Upload Timestamp Display */}
                <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-emerald-500/20 mb-5 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-emerald-200">
                    <Clock size={14} className="text-emerald-400 shrink-0" />
                    <span className="font-semibold">تاريخ ووقت الرفع على الموقع:</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-emerald-300 pr-5 dir-rtl">
                    {reports.saudi?.uploadedAtFormatted || (loading ? 'جاري التحميل...' : 'لم يتم رفع تقرير جديد بعد')}
                  </div>
                  {reports.saudi?.uploadedBy && (
                    <div className="text-[10px] text-slate-400 pr-5">
                      تم الرفع بواسطة: <span className="text-emerald-200 font-semibold">{reports.saudi.uploadedBy}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div>
                {reports.saudi?.pdfUrl ? (
                  <button
                    type="button"
                    onClick={() => setSelectedPdfReport({
                      title: 'التقرير الأسبوعي للسوق السعودي 🇸🇦',
                      pdfUrl: reports.saudi.pdfUrl,
                      uploadedAtFormatted: reports.saudi.uploadedAtFormatted,
                      uploadedBy: reports.saudi.uploadedBy
                    })}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg transition transform group-hover:scale-[1.02] cursor-pointer"
                  >
                    <Download size={16} />
                    <span>📄 عرض / تحميل التقرير (PDF)</span>
                    <ExternalLink size={14} className="opacity-80" />
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-500 font-bold text-xs cursor-not-allowed"
                  >
                    <span>📄 التقرير غير متاح حالياً</span>
                  </button>
                )}
              </div>
            </div>

            {/* Card 2: US Market Weekly Report */}
            <div className="bg-gradient-to-br from-slate-950/90 via-blue-950/30 to-slate-950/90 backdrop-blur-xl border border-blue-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between hover:border-blue-400/60 transition group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🇺🇸</span>
                    <h3 className="text-lg font-extrabold text-blue-300">التقرير الأسبوعي للسوق الأمريكي</h3>
                  </div>
                  <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 flex items-center gap-1">
                    <ShieldCheck size={13} />
                    <span>تقرير معتمد</span>
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  تحليل مفصل لأداء المؤشرات الأمريكية (S&P 500, Nasdaq) وأقوى صفقات الأسهم والعقود الأمريكية.
                </p>

                {/* Upload Timestamp Display */}
                <div className="bg-slate-900/80 rounded-2xl p-3.5 border border-blue-500/20 mb-5 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-blue-200">
                    <Clock size={14} className="text-blue-400 shrink-0" />
                    <span className="font-semibold">تاريخ ووقت الرفع على الموقع:</span>
                  </div>
                  <div className="text-xs font-mono font-bold text-blue-300 pr-5 dir-rtl">
                    {reports.us?.uploadedAtFormatted || (loading ? 'جاري التحميل...' : 'لم يتم رفع تقرير جديد بعد')}
                  </div>
                  {reports.us?.uploadedBy && (
                    <div className="text-[10px] text-slate-400 pr-5">
                      تم الرفع بواسطة: <span className="text-blue-200 font-semibold">{reports.us.uploadedBy}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div>
                {reports.us?.pdfUrl ? (
                  <button
                    type="button"
                    onClick={() => setSelectedPdfReport({
                      title: 'التقرير الأسبوعي للسوق الأمريكي 🇺🇸',
                      pdfUrl: reports.us.pdfUrl,
                      uploadedAtFormatted: reports.us.uploadedAtFormatted,
                      uploadedBy: reports.us.uploadedBy
                    })}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold text-xs shadow-lg transition transform group-hover:scale-[1.02] cursor-pointer"
                  >
                    <Download size={16} />
                    <span>📄 عرض / تحميل التقرير (PDF)</span>
                    <ExternalLink size={14} className="opacity-80" />
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-slate-500 font-bold text-xs cursor-not-allowed"
                  >
                    <span>📄 التقرير غير متاح حالياً</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Section 2: Videos Grid */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-3 border-b border-cyan-500/20 pb-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 shadow-md">
              <Video size={22} />
            </div>
            <div>
              <h2 className="text-xl font-black text-cyan-300">شروحات المنصة وتوثيق النتائج 🎥</h2>
              <p className="text-xs text-slate-300 mt-0.5">فيديوهات توضيحية لآلية العمل وتوثيق صفقات اتجاه الناجحة.</p>
            </div>
          </div>

          {videoList.length === 0 ? (
            <div className="bg-slate-950/80 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-10 text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
                <Video size={32} />
              </div>
              <h3 className="text-base font-bold text-cyan-200">لا توجد فيديوهات مرفوعة حتى الآن 🎥</h3>
              <p className="text-xs text-slate-400">سيتم إضافة فيديوهات جديدة وشروحات من قِبل إدارة المنصة قريباً.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoList.map((video) => (
                <div 
                  key={video.id}
                  className="bg-slate-950/80 backdrop-blur-xl border border-cyan-500/30 rounded-3xl p-5 shadow-xl hover:border-cyan-400/60 transition group flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-white/10 mb-4 shadow-md group-hover:border-cyan-500/40 transition">
                      <video 
                        controls 
                        src={video.videoUrl} 
                        className="w-full h-full object-cover"
                        preload="metadata"
                      />
                      <span className="absolute top-2 right-2 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-950/90 border border-cyan-400/40 text-cyan-300 shadow-md">
                        {video.market === 'saudi' ? '🇸🇦 السوق السعودي' : '🇺🇸 السوق الأمريكي'}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-white mb-1.5 flex items-center gap-1.5">
                        <Video size={16} className="text-cyan-400 shrink-0" />
                        <span>{video.title}</span>
                      </h3>
                      {video.description && (
                        <p className="text-xs text-slate-300 leading-relaxed mb-3">
                          {video.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-cyan-500/20 text-[10px] text-slate-400 flex justify-between items-center">
                    <span>تاريخ النشر: {video.uploadedAtFormatted || 'مؤخراً'}</span>
                    <div className="flex items-center gap-2">
                      {video.uploadedBy && <span className="text-cyan-300 font-semibold">{video.uploadedBy}</span>}
                      <button
                        type="button"
                        onClick={() => handleDeleteVideo(video.id, video.title)}
                        className="p-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-500/30 text-rose-300 transition cursor-pointer"
                        title="حذف الفيديو فوراً من الموقع"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* PDF Viewer & Preview Modal */}
      {selectedPdfReport && (
        <div 
          onClick={() => setSelectedPdfReport(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border-2 border-cyan-500/50 rounded-3xl w-full max-w-5xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.9)] flex flex-col max-h-[92vh]"
            dir="rtl"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-950 via-cyan-950 to-slate-950 p-4 border-b border-cyan-500/30 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 text-xl shadow-md">
                  📄
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <span>{selectedPdfReport.title}</span>
                  </h3>
                  {selectedPdfReport.uploadedAtFormatted && (
                    <p className="text-xs text-cyan-300 font-mono mt-0.5">
                      📅 {selectedPdfReport.uploadedAtFormatted} {selectedPdfReport.uploadedBy ? `• بواسطة ${selectedPdfReport.uploadedBy}` : ''}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Tools */}
              <div className="flex items-center gap-2">
                <a
                  href={selectedPdfReport.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-cyan-900/80 hover:bg-cyan-800 text-cyan-200 border border-cyan-400/40 text-xs px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <ExternalLink size={14} />
                  <span>فتح بتبويب جديد ↗️</span>
                </a>
                <a
                  href={selectedPdfReport.pdfUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 shadow"
                >
                  <Download size={14} />
                  <span>تحميل PDF 📥</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedPdfReport(null)}
                  className="bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/40 text-xs px-3 py-1.5 rounded-xl font-bold transition cursor-pointer"
                >
                  إغلاق ✕
                </button>
              </div>
            </div>

            {/* Modal Body: Multi-Fallback PDF Viewer */}
            <div className="flex-1 bg-slate-950 p-2 sm:p-4 overflow-hidden relative flex flex-col items-center justify-center">
              {(() => {
                const url = selectedPdfReport.pdfUrl || '';
                const isBase64 = url.startsWith('data:');
                const isDataHtml = url.startsWith('data:text/html') || url.includes('.html') || url.includes('text/html');
                const isDirectHtml = url.includes('.html') || isDataHtml || !url.toLowerCase().includes('.pdf');

                if (isDirectHtml || isBase64) {
                  return (
                    <iframe
                      src={url}
                      className="w-full h-full min-h-[60vh] sm:min-h-[70vh] rounded-2xl border border-cyan-500/20 shadow-inner bg-white"
                      title="معاينة التقرير"
                    />
                  );
                }

                const googleViewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
                return (
                  <iframe
                    src={googleViewerUrl}
                    className="w-full h-full min-h-[60vh] sm:min-h-[70vh] rounded-2xl border border-cyan-500/20 shadow-inner bg-slate-900"
                    title="معاينة التقرير"
                  />
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
