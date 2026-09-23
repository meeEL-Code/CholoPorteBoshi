// ===== Splash Screen (only on app launch) =====

(function() {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
                       || window.navigator.standalone === true;

    const splashShown = sessionStorage.getItem('cpb_splash_shown');

    if (!isStandalone && splashShown) return;

    const splash = document.createElement('div');
    splash.id = 'splashScreen';
    splash.innerHTML =
        '<img src="icons/navbar-icon.svg" alt="" class="splash-logo">' +
        '<div class="splash-title">পড়তে বসি</div>' +
        '<div class="splash-tagline">সহজ পড়াশোনা, সবার জন্য</div>' +
        '<div class="splash-loader"></div>';

    document.body.appendChild(splash);
    sessionStorage.setItem('cpb_splash_shown', '1');

    setTimeout(() => {
        splash.classList.add('hidden');
        setTimeout(() => splash.remove(), 600);
    }, 2000);
})();
