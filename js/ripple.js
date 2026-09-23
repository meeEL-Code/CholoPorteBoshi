// ===== Ripple Effect on Buttons =====

document.addEventListener('click', (e) => {
    const btn = e.target.closest('button, .btn-primary, .btn-secondary, .action-btn, .fab-btn, .tab-btn');
    if (!btn || btn.disabled) return;

    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';

    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
});
