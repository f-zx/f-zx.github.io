/* ============================================================
   首页 hero 视频背景
   在首页的 #page-header.full_page 里插入一个静音循环视频。
   样式见 source/css/custom.css 的「首页 hero 视频背景」段。

   性能策略（这三点缺一不可）：
   1. 先只挂 poster（72KB 静帧），视频本身 preload="none"，不占关键路径；
   2. 等 window.load 之后（或空闲回调里）才设置 src 并起播，
      避免 1.6MB 的视频拖住 load 事件、和首屏资源抢带宽；
   3. 窄屏、系统「减少动效」时直接不加载。
   ============================================================ */
(function () {
  'use strict';

  var SRC = '/videos/hero-bg.mp4';
  var POSTER = '/videos/hero-bg.jpg';
  var MIN_WIDTH = 769;      // 窄屏不加载视频
  var FALLBACK_DELAY = 2500; // load 事件迟迟不来时的兜底

  function mount() {
    var header = document.querySelector('#page-header');

    // 只在首页动手：首页 header 的 class 是 full_page，
    // 文章页是 post-bg、其他页是 not-home-page。
    if (!header || !header.classList.contains('full_page')) return;
    if (header.classList.contains('has-hero-video')) return;
    if (window.innerWidth < MIN_WIDTH) return;

    // 尊重系统的"减少动态效果"偏好
    var reduceMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var video = document.createElement('video');
    video.className = 'hero-video';
    video.poster = POSTER;      // 静帧先顶上，视觉上就等于已加载
    video.preload = 'none';     // 关键：先不要下载视频
    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    // 有些浏览器只认 attribute 形式，两个都写
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('aria-hidden', 'true');
    video.setAttribute('tabindex', '-1');

    header.classList.add('has-hero-video');
    header.insertBefore(video, header.firstChild);

    if (reduceMotion) return;   // 只保留静帧

    var started = false;

    function start() {
      if (started) return;
      started = true;

      video.src = SRC;
      video.preload = 'auto';
      video.load();

      var p = video.play();
      // 自动播放被浏览器策略拦截时静默失败，poster 继续当静态背景
      if (p && typeof p.catch === 'function') p.catch(function () {});
    }

    function schedule() {
      // 空闲时再起播，避免和交互/首屏渲染抢主线程
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(start, { timeout: 2000 });
      } else {
        setTimeout(start, 300);
      }
    }

    if (document.readyState === 'complete') {
      schedule();
    } else {
      window.addEventListener('load', schedule, { once: true });
      // 兜底：万一某个第三方资源卡住，load 迟迟不触发，也照常起播
      setTimeout(schedule, FALLBACK_DELAY);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

  // 从 bfcache 恢复时补挂一次（PJAX 已关闭，无需额外处理）
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) mount();
  });
})();
