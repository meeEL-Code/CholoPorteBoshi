// ===== PDF Reader Logic =====

const urlParams = new URLSearchParams(window.location.search);
const pdfPath = urlParams.get('pdf') || '';
const title = urlParams.get('title') || 'পাঠ্য বিষয়';

const readerTitle = document.getElementById('readerTitle');
const pdfFrame = document.getElementById('pdfFrame');
const pdfContainer = document.getElementById('pdfContainer');
const loadingState = document.getElementById('loadingState');
const notFoundState = document.getElementById('notFoundState');
const readerToolbar = document.getElementById('readerToolbar');

let currentZoom = 100;

document.addEventListener('DOMContentLoaded', () => {
    readerTitle.textContent = title;

    if (!pdfPath) {
        showNotFound();
        return;
    }

    // Check if PDF exists via HEAD request
    fetch(pdfPath, { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                loadPdf();
            } else {
                showNotFound();
            }
        })
        .catch(() => {
            showNotFound();
        });

    // Toolbar events
    document.getElementById('zoomIn').addEventListener('click', () => changeZoom(10));
    document.getElementById('zoomOut').addEventListener('click', () => changeZoom(-10));
    document.getElementById('downloadBtn').addEventListener('click', downloadPdf);
    document.getElementById('fullscreenBtn').addEventListener('click', toggleFullscreen);

    document.getElementById('newTabBtn').href = pdfPath;
});

function loadPdf() {
    pdfFrame.src = pdfPath;

    pdfFrame.onload = () => {
        loadingState.classList.add('hidden');
        pdfContainer.classList.remove('hidden');
        readerToolbar.classList.remove('hidden');
    };

    // Fallback timeout
    setTimeout(() => {
        if (pdfContainer.classList.contains('hidden')) {
            loadingState.classList.add('hidden');
            pdfContainer.classList.remove('hidden');
            readerToolbar.classList.remove('hidden');
        }
    }, 3000);
}

function showNotFound() {
    loadingState.classList.add('hidden');
    pdfContainer.classList.add('hidden');
    notFoundState.classList.remove('hidden');
    readerToolbar.classList.add('hidden');
}

function changeZoom(delta) {
    currentZoom = Math.max(50, Math.min(200, currentZoom + delta));
    // Some browsers ignore zoom via iframe; we attempt via CSS transform
    pdfFrame.style.transform = 'scale(' + (currentZoom / 100) + ')';
    pdfFrame.style.transformOrigin = 'top center';
}

function downloadPdf() {
    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = title + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}
