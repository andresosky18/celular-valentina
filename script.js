let currentAudio = null;
let currentRecoverItem = null;

// Seguimiento de las 7 evidencias del Expediente V-021
const foundEvidences = {
    1: false, // Galería
    2: false, // Videos
    3: false, // Audios
    4: false, // Chat Número desconocido
    5: false, // Papelera recuperada
    6: false, // Registro de llamadas
    7: false  // Evidencia_final.txt / cronologia.pdf
};

function markEvidence(num) {
    if (!foundEvidences[num]) {
        foundEvidences[num] = true;
        updateEvidenceUI();
    }
}

function updateEvidenceUI() {
    const count = Object.values(foundEvidences).filter(Boolean).length;
    const counterEl = document.getElementById('evidence-counter');
    if (counterEl) {
        counterEl.innerText = `Evidencias: ${count}/7`;
    }
    for (let i = 1; i <= 7; i++) {
        const li = document.getElementById('chk-' + i);
        if (li && foundEvidences[i]) {
            li.classList.add('done-check');
            li.innerHTML = li.innerHTML.replace('□', '☑');
        }
    }
}

function unlockPhone() {
    document.getElementById('lock-screen').classList.replace('active', 'hidden');
    document.getElementById('home-screen').classList.replace('hidden', 'active');
}

function goHome() {
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active');
        s.classList.add('hidden');
    });
    document.getElementById('home-screen').classList.replace('hidden', 'active');
    stopAllAudios();
    stopModalVideo();
}

function openApp(appId) {
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active');
        s.classList.add('hidden');
    });
    document.getElementById('app-' + appId).classList.replace('hidden', 'active');
    if (appId === 'llamadas') {
        markEvidence(6);
    }
}

function goBack(screenId) {
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active');
        s.classList.add('hidden');
    });
    document.getElementById(screenId).classList.replace('hidden', 'active');
    stopAllAudios();
}

function openChat(chatId) {
    if (chatId === 'desconocido') {
        if (foundEvidences[4]) {
            // Si ya lo desbloqueó antes, entra directo
            document.querySelectorAll('.screen').forEach(s => {
                s.classList.remove('active');
                s.classList.add('hidden');
            });
            document.getElementById('chat-acosador').classList.replace('hidden', 'active');
            return;
        }
        document.getElementById('password-modal').classList.remove('hidden');
        document.getElementById('error-msg').classList.add('hidden');
        document.getElementById('novel-password').value = '';
    } else {
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.remove('active');
            s.classList.add('hidden');
        });
        document.getElementById('chat-' + chatId).classList.replace('hidden', 'active');
    }
}

function openModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    if (modalId === 'media-modal') {
        stopModalVideo();
    }
}

function stopModalVideo() {
    const vid = document.querySelector('#media-body video');
    if (vid) {
        vid.pause();
    }
}

function checkPassword() {
    const pwd = document.getElementById('novel-password').value.toLowerCase().trim();
    const errorMsg = document.getElementById('error-msg');
    
    if (pwd === "secreto" || pwd === "silencio" || pwd === "verdad" || pwd === "huellas" || pwd === "1234") {
        markEvidence(4);
        closeModal('password-modal');
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.remove('active');
            s.classList.add('hidden');
        });
        document.getElementById('chat-acosador').classList.replace('hidden', 'active');
    } else {
        errorMsg.classList.remove('hidden');
        const modalContent = document.querySelector('#password-modal .modal-content');
        modalContent.style.transform = 'translate(-5px, 0)';
        setTimeout(() => modalContent.style.transform = 'translate(5px, 0)', 50);
        setTimeout(() => modalContent.style.transform = 'translate(0, 0)', 100);
    }
}

// ========================
// LOGICA DE AUDIOS
// ========================
function toggleAudio(audioId) {
    markEvidence(3);
    const audioEl = document.getElementById(audioId);
    const btnId = 'btn-' + audioId;
    const btnEl = document.getElementById(btnId);

    if (currentAudio && currentAudio !== audioEl) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        document.querySelectorAll('.play-btn').forEach(b => b.innerText = "▶");
    }

    if (audioEl.paused) {
        audioEl.play();
        btnEl.innerText = "❚❚";
        currentAudio = audioEl;
    } else {
        audioEl.pause();
        btnEl.innerText = "▶";
        currentAudio = null;
    }

    audioEl.onended = function() {
        btnEl.innerText = "▶";
        currentAudio = null;
    };
}

function stopAllAudios() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
    }
    document.querySelectorAll('.play-btn').forEach(b => b.innerText = "▶");
}

// ========================
// LOGICA DE PAPELERA
// ========================
function confirmRecover(element, text) {
    currentRecoverItem = element;
    document.getElementById('recover-text').innerText = text;
    document.getElementById('recover-modal').classList.remove('hidden');
}

function doRecover() {
    closeModal('recover-modal');
    markEvidence(5);
    if (currentRecoverItem) {
        currentRecoverItem.style.transition = "all 0.25s";
        currentRecoverItem.style.opacity = "0";
        currentRecoverItem.style.transform = "scale(0.92)";
        
        setTimeout(() => {
            currentRecoverItem.style.display = "none";
        }, 250);
    }
}

// ========================
// LOGICA DE NOTIFICACIONES
// ========================
function openEvidencia() {
    document.getElementById('evidencia-modal').classList.remove('hidden');
}

// ========================
// VISOR DE GALERÍA, VIDEOS REALES Y ARCHIVOS
// ========================
const mediaItems = {
    img1: {
        type: 'img',
        title: "IMG_001 — Valentina y compañera",
        html: `<img src="IMG_001.png" class="viewer-full-img" alt="IMG_001"><p class="viewer-caption">Foto normal de Valentina con su compañera en el salón.</p>`
    },
    img2: {
        type: 'img',
        title: "IMG_002 — 1ª publicación ofensiva",
        html: `<img src="IMG_002.png" class="viewer-full-img" alt="IMG_002"><p class="viewer-caption">Captura de la primera publicación ofensiva contra la compañera.</p>`
    },
    img3: {
        type: 'img',
        title: "IMG_003 / evidencia_01.jpg",
        html: `<img src="IMG_003.png" class="viewer-full-img" alt="IMG_003"><p class="viewer-caption">Captura del perfil de @cuenta_falsa.</p>`
    },
    img4: {
        type: 'img',
        title: "IMG_004 / evidencia_02.jpg",
        html: `<img src="IMG_004.png" class="viewer-full-img" alt="IMG_004"><p class="viewer-caption">Imagen manipulada de Valentina ("Así se hace la víctima").</p>`
    },
    img5: {
        type: 'img',
        title: "IMG_005 / evidencia_03.jpg",
        html: `<img src="IMG_005.png" class="viewer-full-img" alt="IMG_005"><p class="viewer-caption">Captura de los comentarios en la publicación.</p>`
    },
    img6: {
        type: 'img',
        title: "IMG_006 / evidencia_04.jpg",
        html: `<img src="IMG_006.png" class="viewer-full-img" alt="IMG_006"><p class="viewer-caption">Captura de la información privada de su familia (Barrio San Marcos).</p>`
    },
    img7: {
        type: 'img',
        title: "IMG_007 — Cuaderno de Valentina",
        html: `<img src="IMG_007.png" class="viewer-full-img" alt="IMG_007"><p class="viewer-caption">"¿A quién puedo pedirle ayuda?"</p>`
    },
    img8: {
        type: 'img',
        title: "IMG_008 — Evidencias organizadas",
        html: `<img src="IMG_008.png" class="viewer-full-img" alt="IMG_008"><p class="viewer-caption">Pantalla con las evidencias organizadas del Caso Valentina.</p>`
    },
    vid1: {
        type: 'vid',
        title: "VIDEO 01 — Publicación falsa",
        html: `<video src="video1.mp4" class="viewer-video" controls autoplay playsinline></video><p class="viewer-caption">27 personas compartieron esta publicación.</p>`
    },
    vid2: {
        type: 'vid',
        title: "VIDEO 02 — Historia cuenta falsa",
        html: `<video src="video2.mp4" class="viewer-video" controls autoplay playsinline></video><p class="viewer-caption">Historia publicada por @cuenta_falsa: "¿Ya conocen a Valentina?"</p>`
    },
    vid3: {
        type: 'vid',
        title: "VIDEO 03 — Cierre: Las Huellas",
        html: `<video src="video3.mp4" class="viewer-video" controls autoplay playsinline></video><p class="viewer-caption">Publicación → Comentario → Mensaje → Evidencia → Verdad. LAS HUELLAS PERMANECEN.</p>`
    },
    cronologia: {
        type: 'doc',
        title: "cronologia.pdf",
        html: `<ul class="timeline-list">
            <li><strong>Día 1:</strong> Denuncia.</li>
            <li><strong>Día 2:</strong> Primera amenaza.</li>
            <li><strong>Día 3:</strong> Cuenta falsa.</li>
            <li><strong>Día 4:</strong> Difusión de fotografías.</li>
            <li><strong>Día 5:</strong> Información familiar difundida.</li>
            <li class="last-trace"><strong>Día 5 — 11:47 p. m.:</strong> Última actividad.</li>
        </ul>`
    },
    evidencia_final: {
        type: 'doc',
        title: "Evidencia_final.txt",
        html: `<div class="mock-notebook">"Si estás leyendo esto, encontraste mis pruebas.<br><br><strong>Busca dónde estuve antes de desaparecer.</strong>"</div>`
    }
};

function openMediaViewer(id) {
    const item = mediaItems[id];
    if (!item) return;
    stopAllAudios();
    if (item.type === 'img') markEvidence(1);
    if (item.type === 'vid') markEvidence(2);
    if (item.type === 'doc') markEvidence(7);

    document.getElementById('media-title').innerText = item.title;
    document.getElementById('media-body').innerHTML = item.html;
    document.getElementById('media-modal').classList.remove('hidden');
}
