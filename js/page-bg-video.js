/* ============================================================
   整屏页面背景视频
   在 body 里插入一个固定定位的 <video>，铺满视口、静音循环。
   样式见 source/css/custom.css 的「页面背景」段。

   性能策略与首页 hero 视频一致：
   1. 先只挂 poster 静帧，视频本身 preload="none"，不占关键路径；
   2. 等 window.load 之后在空闲回调里才设 src 起播；
   3. 窄屏 / 系统「减少动效」时不加载。
   ============================================================ */
(function () {
  'use strict';

  var SRC = '/videos/page-bg.mp4';
  var POSTER = '/videos/page-bg.jpg';
  var MIN_WIDTH = 769;
  var FALLBACK_DELAY = 2600;

  function mount() {
    if (document.querySelector('video.page-bg-video')) return;
    if (window.innerWidth < MIN_WIDTH) return;

    var reduceMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var video = document.createElement('video');
    video.className = 'page-bg-video';
    video.poster = POSTER;
    video.preload = 'none';
    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('aria-hidden', 'true');
    video.setAttribute('tabindex', '-1');

    document.body.insertBefore(video, document.body.firstChild);

    if (reduceMotion) return;

    var started = false;

    function start() {
      if (started) return;
      started = true;
      video.src = SRC;
      video.preload = 'auto';
      video.load();
      var p = video.play();
      if (p && typeof p.catch === 'function') p.catch(function () {});
    }

    function schedule() {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(start, { timeout: 2500 });
      } else {
        setTimeout(start, 400);
      }
    }

    if (document.readyState === 'complete') {
      schedule();
    } else {
      window.addEventListener('load', schedule, { once: true });
      setTimeout(schedule, FALLBACK_DELAY);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

  window.addEventListener('pageshow', function (e) {
    if (e.persisted) mount();
  });
})();
