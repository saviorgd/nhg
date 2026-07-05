const VALID_HASHES = ['#dashboard','#kana','#flashcard','#vocab-flashcard','#vocab'];

const App = (() => {
  let _vocabData = null;

  // ── Public helpers ──────────────────────────────────────────────────────────
  function isRomajiVisible() {
    return localStorage.getItem('setting_romaji_visible') !== 'false';
  }

  function showAlert(msg, onOk, isError) {
    const overlay = document.getElementById('modal-overlay');
    const box = document.getElementById('modal-box');
    box.innerHTML = `
      <p class="text-gray-800 text-base leading-relaxed">${msg}</p>
      <button id="modal-ok"
        class="mt-5 px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors w-full">
        ตกลง
      </button>`;
    overlay.classList.remove('hidden');
    document.getElementById('modal-ok').addEventListener('click', () => {
      overlay.classList.add('hidden');
      if (onOk) onOk();
    });
  }

  function showKanaModal({ character, romaji, thai_reading, thai_trick, stroke_order_path, romajiOn }) {
    const overlay = document.getElementById('modal-overlay');
    const box = document.getElementById('modal-box');
    box.innerHTML = `
      <div class="text-center">
        <div class="text-7xl mb-2 leading-none">${character}</div>
        <div class="text-2xl font-semibold text-gray-800">${thai_reading}</div>
        ${romajiOn ? `<div class="text-gray-400 text-sm mt-1">${romaji}</div>` : ''}
        ${stroke_order_path ? `
        <div class="mt-4">
          <img id="kana-stroke-gif" src="${stroke_order_path}" alt="ลำดับขีด ${character}"
            class="mx-auto max-h-24 rounded-lg"
            onerror="this.parentElement.classList.add('hidden')">
        </div>` : ''}
        ${thai_trick ? `
        <div class="mt-4 text-sm text-gray-600 bg-amber-50 border border-amber-200 rounded-xl p-3 text-left leading-relaxed">
          ${thai_trick}
        </div>` : ''}
        <div class="mt-4 flex gap-3">
          <button id="kana-modal-audio"
            class="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
            🔊 ฟังเสียง
          </button>
          <button id="kana-modal-close"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700">
            ปิด
          </button>
        </div>
        <button hidden id="kana-modal-record">🎙️</button>
      </div>`;
    overlay.classList.remove('hidden');
    document.getElementById('kana-modal-audio').addEventListener('click', () => Audio.speak(character));
    document.getElementById('kana-modal-close').addEventListener('click', () => overlay.classList.add('hidden'));
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.add('hidden'); }, { once: true });
  }

  // ── Routing ─────────────────────────────────────────────────────────────────
  function _getStartHash() {
    const hash = window.location.hash;
    if (VALID_HASHES.includes(hash)) return hash;
    const saved = localStorage.getItem('setting_last_tab') || '#dashboard';
    return VALID_HASHES.includes(saved) ? saved : '#dashboard';
  }

  function _route(hash) {
    if (!VALID_HASHES.includes(hash)) hash = '#dashboard';
    document.querySelectorAll('.tab-section').forEach(s => s.classList.add('hidden'));
    document.getElementById('section-' + hash.slice(1))?.classList.remove('hidden');
    document.querySelectorAll('[data-hash]').forEach(el => {
      const active = el.dataset.hash === hash;
      el.classList.toggle('text-red-600', active);
      el.classList.toggle('border-b-2', active);
      el.classList.toggle('border-red-600', active);
      el.classList.toggle('font-semibold', active);
    });
    if (window.location.hash !== hash) history.replaceState(null, '', hash);
    localStorage.setItem('setting_last_tab', hash);
    _initSection(hash);
    // Close mobile menu if open
    document.getElementById('mobile-menu')?.classList.add('hidden');
  }

  function _initSection(hash) {
    switch (hash) {
      case '#dashboard':      Dashboard.init(_vocabData); break;
      case '#kana':           Kana.init(_vocabData); break;
      case '#flashcard':      KanaFlashcard.init(_vocabData); break;
      case '#vocab-flashcard':VocabFlashcard.init(); break;
      case '#vocab':          VocabTable.init(); break;
    }
  }

  // ── Romaji Toggle ────────────────────────────────────────────────────────────
  function _initRomajiToggle() {
    const btns = document.querySelectorAll('.btn-romaji-toggle');
    const update = () => {
      const on = isRomajiVisible();
      btns.forEach(b => {
        b.textContent = on ? 'RM: ON' : 'RM: OFF';
        b.classList.toggle('bg-red-600', on);
        b.classList.toggle('text-white', on);
        b.classList.toggle('bg-gray-200', !on);
        b.classList.toggle('text-gray-600', !on);
      });
    };
    btns.forEach(b => b.addEventListener('click', () => {
      localStorage.setItem('setting_romaji_visible', isRomajiVisible() ? 'false' : 'true');
      update();
      // Refresh current visible section
      const hash = window.location.hash || '#dashboard';
      switch (hash) {
        case '#kana': Kana.refresh(); break;
        case '#flashcard': KanaFlashcard.refresh(); break;
        case '#vocab-flashcard': VocabFlashcard.refresh(); break;
        case '#vocab': VocabTable.refresh(); break;
      }
    }));
    update();
  }

  // ── Mobile nav ───────────────────────────────────────────────────────────────
  function _initMobileNav() {
    document.getElementById('hamburger')?.addEventListener('click', () => {
      document.getElementById('mobile-menu').classList.toggle('hidden');
    });
  }

  // ── Nav click bindings ───────────────────────────────────────────────────────
  function _bindNavLinks() {
    document.querySelectorAll('[data-hash]').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        _route(el.dataset.hash);
      });
    });
  }

  // ── Init ──────────────────────────────────────────────────────────────────────
  async function init() {
    // Set romaji default if not set
    if (localStorage.getItem('setting_romaji_visible') === null) {
      localStorage.setItem('setting_romaji_visible', 'true');
    }

    // Eagerly load vocab.json
    try {
      const res = await fetch('./data/vocab.json');
      _vocabData = await res.json();
    } catch {
      showAlert('ไม่สามารถโหลดข้อมูลหลักได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
      return;
    }

    _initRomajiToggle();
    _initMobileNav();
    _bindNavLinks();

    window.addEventListener('hashchange', () => _route(window.location.hash));
    _route(_getStartHash());
  }

  return { init, isRomajiVisible, showAlert, showKanaModal };
})();

document.addEventListener('DOMContentLoaded', () => App.init());
