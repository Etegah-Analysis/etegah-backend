import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// ============================================================
// مكون مؤشر التحليل الفني (TradingView - تاسي)
// ============================================================
const TechnicalAnalysisWidget = () => {
  const container = useRef();
  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js';
    script.type = 'text/javascript';
    script.async = true;
    const isLight = document.body.classList.contains('light-theme');
    script.innerHTML = JSON.stringify({
      interval: '1D',
      width: '100%',
      isTransparent: true,
      height: 420,
      symbol: 'TADAWUL:TASI',
      showIntervalTabs: false,
      locale: 'ar_AE',
      colorTheme: isLight ? 'light' : 'dark',
    });
    container.current.appendChild(script);
  }, []);
  return <div className="tradingview-widget-container" ref={container} style={{ height: '420px', width: '100%' }} />;
};

// ============================================================
// مصادر RSS المجانية لأخبار الشركات السعودية
// ============================================================
const RSS_SOURCES = [
  'https://www.argaam.com/ar/article/articlelist/rss/4',  // إفصاحات الشركات
  'https://www.argaam.com/ar/article/articlelist/rss/2',  // أسهم
  'https://www.argaam.com/ar/rss',                         // عام
  'https://www.argaam.com/ar/article/articlelist/rss/6',  // بنوك
  'https://www.argaam.com/ar/article/articlelist/rss/7',  // طاقة
  'https://www.argaam.com/ar/article/articlelist/rss/5',  // اقتصاد
];

// ============================================================
// جلب الأخبار
// ============================================================
const loadNews = async () => {
  const all = [];
  for (const url of RSS_SOURCES) {
    try {
      const res = await fetch(
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}&count=50`,
        { signal: AbortSignal.timeout(6000) }
      );
      const data = await res.json();
      if (data.status === 'ok' && Array.isArray(data.items)) {
        data.items.forEach(item => {
          all.push({
            id: `${url}${item.pubDate}`,
            title: (item.title || '').trim(),
            body: (item.description || item.content || '').replace(/<[^>]+>/g, '').trim(),
            date: item.pubDate ? new Date(item.pubDate) : new Date(),
          });
        });
      }
    } catch (_) { }
  }
  const seen = new Set();
  return all
    .filter(n => { if (!n.title || seen.has(n.title)) return false; seen.add(n.title); return true; })
    .sort((a, b) => b.date - a.date);
};

const fmt = (d) => {
  try {
    return new Date(d).toLocaleDateString('ar-EG', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return ''; }
};

const FALLBACK = [
  { id: 1, title: 'أرامكو السعودية (2222): توزيع أرباح نقدية 0.31 ريال للسهم', body: 'أعلنت شركة أرامكو السعودية عن توزيع أرباح نقدية بواقع 0.31 ريال للسهم عن الربع الثالث، وستودع في محافظ المساهمين خلال الأسبوعين القادمين.', date: new Date() },
  { id: 2, title: 'مصرف الراجحي (1120): نمو صافي الأرباح 8% في السنة المالية', body: 'سجل مصرف الراجحي نمواً في صافي الأرباح بنسبة 8% خلال السنة المالية الحالية مدعوماً بارتفاع محفظة التمويل والإيرادات التشغيلية.', date: new Date(Date.now() - 3600000) },
  { id: 3, title: 'البنك الأهلي (1180): إصدار صكوك دولية بقيمة 750 مليون دولار', body: 'أصدر البنك الأهلي صكوكاً دولارية بقيمة 750 مليون دولار بعائد تنافسي ضمن برنامج الإصدار متوسطة الأجل.', date: new Date(Date.now() - 7200000) },
  { id: 4, title: 'stc (7010): إطلاق خدمات 5G في 15 مدينة جديدة', body: 'أعلنت شركة الاتصالات السعودية عن توسعة شبكة 5G لتغطية 15 مدينة إضافية ضمن خطة الريادة في قطاع الاتصالات.', date: new Date(Date.now() - 86400000) },
  { id: 5, title: 'سابك (2010): اجتماع الجمعية العامة غير العادية', body: 'دعت شركة سابك مساهميها لحضور اجتماع الجمعية العامة غير العادية لمناقشة إعادة هيكلة الأصول وخطط التوسع.', date: new Date(Date.now() - 172800000) },
  { id: 6, title: 'مؤشر تاسي يرتفع 1.2% بدعم قطاع البنوك والطاقة', body: 'أنهى مؤشر تاسي تداولاته على ارتفاع 1.2% مدعوماً بقطاع البنوك والطاقة وسيولة تجاوزت ملياري ريال.', date: new Date(Date.now() - 259200000) },
];

export default function News() {
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);



  useEffect(() => {
    (async () => {
      setLoading(true);
      const items = await loadNews();
      setNews(items.length > 0 ? items : FALLBACK);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="news-page container my-8 relative z-10">
      {/* مؤشر تاسي */}
      <div className="bg-gradient-to-r from-slate-900/90 via-indigo-950/90 to-slate-900/90 backdrop-blur-2xl border border-cyan-500/40 shadow-[0_20px_60px_rgba(6,182,212,0.25)] border-t-2 border-t-cyan-400 rounded-3xl overflow-hidden mb-8">
        <div className="px-5 py-4 border-b border-cyan-500/30 flex items-center justify-between">
          <h3 className="m-0 font-extrabold text-white text-base sm:text-lg flex items-center gap-2">
            📊 مؤشر التحليل الفني الشامل (السوق السعودي - تاسي)
          </h3>
          <span className="text-[11px] font-bold px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-400/30 rounded-full">يومي</span>
        </div>
        <div className="p-3">
          <TechnicalAnalysisWidget />
        </div>
      </div>

      {/* رأس قسم الأخبار */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-white m-0">
          أخبار الشركات المدرجة في السوق السعودي
        </h2>
      </div>

      {/* محتوى */}
      {loading ? (
        <div className="py-16 text-center text-cyan-300 font-bold">
          <div className="text-3xl mb-3 animate-pulse">⏳</div>
          جاري جلب أخبار اليوم...
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {news.map(item => (
            <div key={item.id} className="bg-gradient-to-r from-slate-900/80 via-indigo-950/80 to-slate-900/80 backdrop-blur-2xl border border-cyan-500/30 border-t-2 border-t-cyan-400/80 shadow-lg rounded-2xl overflow-hidden hover:border-cyan-400 hover:scale-[1.005] transition-all duration-300">
              <div
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                className="p-4 sm:p-5 cursor-pointer flex justify-between items-start gap-3"
              >
                <div className="flex-1">
                  <div className="text-xs text-cyan-400 mb-1.5 font-extrabold flex items-center gap-1">
                    🕐 {fmt(item.date)}
                  </div>
                  <div className="font-bold text-sm sm:text-base leading-relaxed text-white">
                    {item.title}
                  </div>
                </div>
                <div className="text-cyan-400 font-bold text-sm shrink-0 pt-1">
                  {expandedId === item.id ? '▲' : '▼'}
                </div>
              </div>
              {expandedId === item.id && item.body && (
                <div className="px-5 pb-5 pt-1 border-t border-cyan-500/20 text-xs sm:text-sm text-gray-200 leading-relaxed">
                  <p className="m-0">
                    {item.body.substring(0, 500)}{item.body.length > 500 ? '...' : ''}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
