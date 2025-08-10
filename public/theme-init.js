/*! Early theme init to avoid flash on static hosting */
(function(){
  try {
    var w = window;
    var d = document;
    var e = d.documentElement;
    var s = null;
    try { s = localStorage.getItem('theme'); } catch (_) {}
  var prefersDark = (w.matchMedia && w.matchMedia('(prefers-color-scheme: dark)').matches);
  var t = (s === 'light' || s === 'dark') ? s : (prefersDark ? 'dark' : 'light');
    e.dataset.theme = t;
    var m = d.querySelector('meta[name="theme-color"]');
    if (m) { m.setAttribute('content', t === 'dark' ? '#0e0e0e' : '#ffffff'); }
  } catch(_) {}
})();
