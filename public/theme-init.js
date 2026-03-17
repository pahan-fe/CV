(function(){
  try {
    var s = null;
    try { s = localStorage.getItem('theme'); } catch (_) {}
    var prefersDark = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var t = (s === 'light' || s === 'dark') ? s : (prefersDark ? 'dark' : 'light');
    document.documentElement.dataset.theme = t;
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) { m.setAttribute('content', t === 'dark' ? '#0a0a0a' : '#fafafa'); }
  } catch(_) {}
})();
