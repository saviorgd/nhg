// ── Kana Flashcard ──────────────────────────────────────────────────────────
const KanaFlashcard = (() => {
  let _data = null, _deck = [], _cur = 0, _initialized = false;

  function init(vocabData) {
    _data = vocabData;
    if (!_initialized) {
      _initialized = true;
      _bindStatic();
    }
    _buildDeck();
    _renderCard();
  }

  function _bindStatic() {
    document.getElementById('kana-fc-reset').addEventListener('click', () => { _buildDeck(); _renderCard(); });
    document.getElementById('kana-fc-card-wrap').addEventListener('click', _advance);
    document.getElementById('kana-fc-btn-answer').addEventListener('click', _showAnswer);
    document.getElementById('kana-fc-btn-audio').addEventListener('click', () => {
      if (_deck[_cur]) Audio.speak(_deck[_cur].character);
    });
  }

  function _buildDeck() {
    const pool = (_data.kana || []).filter(k => k.type === 'hiragana');
    _deck = _shuffle(pool);
    _cur = 0;
  }

  function _shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function _renderCard() {
    const wrap = document.getElementById('kana-fc-card-wrap');
    const answerBox = document.getElementById('kana-fc-answer');
    answerBox.classList.add('hidden');
    answerBox.innerHTML = '';

    if (_cur >= _deck.length) { _renderEndOfDeck(); return; }

    const card = _deck[_cur];
    document.getElementById('kana-fc-char').textContent = card.character;
    document.getElementById('kana-fc-progress').textContent = `${_cur + 1} / ${_deck.length}`;
    wrap.classList.remove('hidden');
    document.getElementById('kana-fc-eod').classList.add('hidden');
    document.getElementById('kana-fc-controls').classList.remove('hidden');
    document.getElementById('kana-fc-btn-answer').textContent = 'ดูเฉลย';
  }

  function _advance() {
    _cur++;
    _renderCard();
  }

  function _showAnswer() {
    if (_cur >= _deck.length) return;
    const card = _deck[_cur];
    const romajiOn = App.isRomajiVisible();
    const answerBox = document.getElementById('kana-fc-answer');
    answerBox.innerHTML = `
      <div class="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 text-left space-y-2">
        <p class="text-xl font-semibold text-gray-800">${card.thai_reading}</p>
        ${romajiOn ? `<p class="text-sm text-gray-400">${card.romaji}</p>` : ''}
        ${card.thai_trick ? `<div class="mt-2 text-sm text-gray-600 bg-amber-50 border border-amber-200 rounded-lg p-3 leading-relaxed">${card.thai_trick}</div>` : ''}
      </div>`;
    answerBox.classList.remove('hidden');
  }

  function _renderEndOfDeck() {
    document.getElementById('kana-fc-card-wrap').classList.add('hidden');
    document.getElementById('kana-fc-controls').classList.add('hidden');
    document.getElementById('kana-fc-progress').textContent = '';
    const eod = document.getElementById('kana-fc-eod');
    eod.classList.remove('hidden');
    eod.innerHTML = `
      <div class="text-center py-10">
        <div class="text-5xl mb-4">🎉</div>
        <p class="text-xl font-semibold text-gray-800">ครบรอบแล้ว! ${_deck.length} ใบ</p>
        <button id="kana-fc-btn-replay"
          class="mt-6 px-8 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors">
          เล่นอีกรอบ
        </button>
      </div>`;
    document.getElementById('kana-fc-btn-replay').addEventListener('click', () => { _buildDeck(); _renderCard(); });
  }

  function refresh() { if (_data && _cur < _deck.length) _showAnswer(); }

  return { init, refresh };
})();


// ── Vocab Flashcard ──────────────────────────────────────────────────────────
const VocabFlashcard = (() => {
  const LEVEL_KEYS = ['N5','N4','N3','N2'];
  let _cache = {};
  let _deck = [], _cur = 0, _initialized = false;
  let _selectedLevels = [];

  function init() {
    _selectedLevels = _loadLevels();
    if (!_initialized) {
      _initialized = true;
      _buildLevelSelector();
      _bindStatic();
    }
    _updateLevelUI();
    _loadAndBuild();
  }

  function _loadLevels() {
    try {
      const v = JSON.parse(localStorage.getItem('setting_vocab_levels') || '["N5"]');
      return Array.isArray(v) ? v : ['N5'];
    } catch { return ['N5']; }
  }

  function _saveLevels() {
    localStorage.setItem('setting_vocab_levels', JSON.stringify(_selectedLevels));
  }

  function _buildLevelSelector() {
    const container = document.getElementById('vocab-fc-level-selector');
    container.innerHTML = LEVEL_KEYS.map(lvl => `
      <label class="flex items-center gap-2 cursor-pointer select-none">
        <input type="checkbox" class="vocab-level-cb w-4 h-4 accent-red-600" value="${lvl}">
        <span class="font-medium">${lvl}</span>
      </label>`).join('');

    container.querySelectorAll('.vocab-level-cb').forEach(cb => {
      cb.addEventListener('change', () => {
        _selectedLevels = [...container.querySelectorAll('.vocab-level-cb:checked')].map(c => c.value);
        if (_selectedLevels.length === 0) {
          _selectedLevels = ['N5'];
          container.querySelector('[value="N5"]').checked = true;
        }
        _saveLevels();
        _loadAndBuild();
      });
    });
  }

  function _updateLevelUI() {
    document.querySelectorAll('.vocab-level-cb').forEach(cb => {
      cb.checked = _selectedLevels.includes(cb.value);
    });
  }

  function _bindStatic() {
    document.getElementById('vocab-fc-reset').addEventListener('click', () => { _buildDeck(); _renderCard(); });
    document.getElementById('vocab-fc-card-wrap').addEventListener('click', _advance);
    document.getElementById('vocab-fc-btn-answer').addEventListener('click', _showAnswer);
    document.getElementById('vocab-fc-btn-audio').addEventListener('click', () => {
      if (_deck[_cur]) Audio.speak(_deck[_cur].kana);
    });
    document.getElementById('vocab-fc-level-toggle').addEventListener('click', () => {
      const panel = document.getElementById('vocab-fc-level-panel');
      panel.classList.toggle('hidden');
      document.getElementById('vocab-fc-level-toggle').textContent =
        panel.classList.contains('hidden') ? '▾ เลือกระดับ' : '▴ ซ่อน';
    });
  }

  async function _loadAndBuild() {
    _setLoading(true);
    try {
      await Promise.all(_selectedLevels.map(_fetchLevel));
      _buildDeck();
      _renderCard();
    } catch (err) {
      _showError();
    } finally {
      _setLoading(false);
    }
  }

  async function _fetchLevel(lvl) {
    if (_cache[lvl]) return;
    const res = await fetch(`./data/vocab_${lvl.toLowerCase()}.json`);
    if (!res.ok) throw new Error('fetch failed');
    _cache[lvl] = await res.json();
  }

  function _buildDeck() {
    const pool = _selectedLevels.flatMap(lvl => _cache[lvl] || []);
    _deck = _shuffle(pool);
    _cur = 0;
    _updateSummary();
  }

  function _shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function _updateSummary() {
    const total = _selectedLevels.reduce((s, lvl) => s + (_cache[lvl]?.length || 0), 0);
    document.getElementById('vocab-fc-summary').textContent =
      `กำลังสุ่มจาก: ${_selectedLevels.join(', ')} (${total} คำ)`;
  }

  function _renderCard() {
    const answerBox = document.getElementById('vocab-fc-answer');
    answerBox.classList.add('hidden');
    answerBox.innerHTML = '';

    if (_deck.length === 0) { _showEmpty(); return; }
    if (_cur >= _deck.length) { _renderEndOfDeck(); return; }

    const card = _deck[_cur];
    document.getElementById('vocab-fc-kana').textContent = card.kana;
    document.getElementById('vocab-fc-kanji').textContent = card.kanji || '';
    document.getElementById('vocab-fc-progress').textContent = `${_cur + 1} / ${_deck.length}`;
    document.getElementById('vocab-fc-card-wrap').classList.remove('hidden');
    document.getElementById('vocab-fc-eod').classList.add('hidden');
    document.getElementById('vocab-fc-controls').classList.remove('hidden');
  }

  function _advance() {
    _cur++;
    _renderCard();
  }

  function _showAnswer() {
    if (_cur >= _deck.length) return;
    const card = _deck[_cur];
    const romajiOn = App.isRomajiVisible();
    const answerBox = document.getElementById('vocab-fc-answer');
    answerBox.innerHTML = `
      <div class="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 text-left space-y-2">
        <p class="text-xl font-semibold text-gray-800">${card.thai_meaning}</p>
        <p class="text-sm text-gray-600">${card.thai_reading}</p>
        ${romajiOn ? `<p class="text-sm text-gray-400">${card.romaji}</p>` : ''}
        <div class="mt-3 pt-3 border-t border-gray-200 space-y-1">
          <p class="font-bold text-lg">${card.example_sentence.japanese}</p>
          ${romajiOn ? `<p class="text-sm text-gray-400 italic">${card.example_sentence.romaji}</p>` : ''}
          <p class="text-sm text-gray-600">${card.example_sentence.thai}</p>
        </div>
      </div>`;
    answerBox.classList.remove('hidden');
  }

  function _renderEndOfDeck() {
    document.getElementById('vocab-fc-card-wrap').classList.add('hidden');
    document.getElementById('vocab-fc-controls').classList.add('hidden');
    document.getElementById('vocab-fc-progress').textContent = '';
    const eod = document.getElementById('vocab-fc-eod');
    eod.classList.remove('hidden');
    eod.innerHTML = `
      <div class="text-center py-10">
        <div class="text-5xl mb-4">🎉</div>
        <p class="text-xl font-semibold text-gray-800">ครบรอบแล้ว! ${_deck.length} ใบ</p>
        <button id="vocab-fc-btn-replay"
          class="mt-6 px-8 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors">
          เล่นอีกรอบ
        </button>
      </div>`;
    document.getElementById('vocab-fc-btn-replay').addEventListener('click', () => { _buildDeck(); _renderCard(); });
  }

  function _setLoading(on) {
    document.getElementById('vocab-fc-loading').classList.toggle('hidden', !on);
    document.getElementById('vocab-fc-card-wrap').classList.toggle('hidden', on);
  }

  function _showError() {
    App.showAlert('ไม่สามารถโหลดข้อมูลได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต', null, true);
  }

  function _showEmpty() {
    document.getElementById('vocab-fc-eod').classList.remove('hidden');
    document.getElementById('vocab-fc-eod').innerHTML = `<p class="text-gray-500 text-center py-10">ไม่มีคำศัพท์ในระดับที่เลือก</p>`;
  }

  function refresh() { if (_deck[_cur]) _showAnswer(); }

  return { init, refresh, getCache: () => _cache };
})();
