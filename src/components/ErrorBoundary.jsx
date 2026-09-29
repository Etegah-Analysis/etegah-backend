import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Error Boundary caught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen bg-[#0B1120] text-white p-6 flex flex-col items-center justify-center text-center font-sans" dir="rtl">
          <div className="max-w-md bg-slate-900/90 border border-cyan-500/30 p-8 rounded-3xl shadow-2xl">
            <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              ⚠️
            </div>
            <h2 className="text-xl font-bold text-white mb-2">حدث خطأ أثناء تحميل الصفحة</h2>
            <p className="text-xs text-gray-400 mb-6">قد يرجع ذلك إلى وجود بيانات كاش قديمة بالمتصفح. انقر على الزر أدناه لإصلاح وتصفير البيانات ومتابعة تصفح منصة اتجاه.</p>
            <button
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = '/';
              }}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition text-xs cursor-pointer"
            >
              تصفير كاش المتصفح وإعادة التحميل 🔄
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
