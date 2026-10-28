/* ============================================================
   首页 hero 视频背景
   在首页的 #page-header.full_page 里插入一个静音循环视频。
   样式见 source/css/custom.css 的「首页 hero 视频背景」段。
   ============================================================ */
(function () {
  'use strict';

  var SRC = '/videos/hero-bg.mp4';
  var POSTER = '/videos/hero-bg.jpg';
  // 窄屏不加载视频，省流量（也避免手机上动效过多）
  var MIN_WIDTH = 769;

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
    video.src = SRC;
    video.poster = POSTER;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.autoplay = !reduceMotion;

    // 有些浏览器只认 attribute 形式，两个都写
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('aria-hidden', 'true');
    video.setAttribute('tabindex', '-1');

    header.classList.add('has-hero-video');
    header.insertBefore(video, header.firstChild);

    if (!reduceMotion) {
      var p = video.play();
      // 自动播放被浏览器策略拦截时，保留 poster 静帧，不报错
      if (p && typeof p.catch === 'function') {
        p.catch(function () {});
      }
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
