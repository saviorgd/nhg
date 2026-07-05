const Kana = (() => {
  const ROW_ORDER = ['a','ka','sa','ta','na','ha','ma','ya','ra','wa','n'];
  const VOWEL_MAP = { a:0, i:1, u:2, e:3, o:4 };

  let _data = null;
  let _cellMap = new Map(); // kid → { character, romaji, thai_reading, thai_trick, stroke_order_path }
  let _yoonMap = new Map();
  let _filters = { dakuten: false, handakuten: false, yoon: false, sokuon: false };
  let _initialized = false;

  function init(vocabData) {
    _data = vocabData;
    if (!_initialized) {
      _initialized = true;
      _bindControls();
    }
    _render();
  }

  function _bindControls() {
    ['dakuten', 'handakuten', 'yoon', 'sokuon'].forEach(mod => {
      const el = document.getElementById('cb-' + mod);
      if (el) el.addEventListener('change', e => { _filters[mod] = e.target.checked; _render(); });
    });
  }

  function _getVowelIdx(romaji) {
    return VOWEL_MAP[romaji[romaji.length - 1]] ?? 0;
  }

  function _render() {
    const container = document.getElementById('kana-table-container');
    if (!container) return;
    _cellMap.clear();
    _yoonMap.clear();
    if (_filters.yoon) { _renderYoon(container); return; }
    _renderGojuon(container);
  }

  function _renderGojuon(container) {
    const hira = _data.kana.filter(k => k.type === 'hiragana');
    const grouped = {};
    hira.forEach(k => {
      if (!grouped[k.row_group]) grouped[k.row_group] = {};
      grouped[k.row_group][_getVowelIdx(k.romaji)] = k;
    });

    if (_filters.sokuon) {
      const tsu = hira.find(k => k.romaji === 'tsu');
      if (tsu) {
        const smallTsu = { ...tsu, id: '_sokuon', character: 'っ', romaji: 'っ (sokuon)', thai_reading: 'เสียงกัก', thai_trick: 'ใช้ซ้ำพยัญชนะถัดไป เช่น คิ+っ+て = きって (แสตมป์)' };
        grouped['_sokuon'] = { 0: smallTsu };
      }
    }

    const rows = [...ROW_ORDER, ...(_filters.sokuon ? ['_sokuon'] : [])];
    let html = '';
    rows.forEach(row => {
      const cells = grouped[row];
      if (!cells) return;
      html += `<div class="flex gap-1 mb-1">`;
      if (row === 'n' || row === '_sokuon') {
        html += _cellHtml(Object.values(cells)[0]);
        html += `<div class="flex-1"></div>`;
      } else {
        for (let v = 0; v < 5; v++) {
          html += cells[v] ? _cellHtml(cells[v]) : `<div class="w-14 h-16 shrink-0"></div>`;
        }
      }
      html += `</div>`;
    });

    container.innerHTML = html;
    _attachListeners(container);
  }

  function _cellHtml(kanaObj) {
    const { dakuten, handakuten } = _filters;
    let ch = kanaObj.character, romaji = kanaObj.romaji, thai = kanaObj.thai_reading;
    let strokePath = kanaObj.stroke_order_path || '';
    let kid = kanaObj.id;
    const trick = kanaObj.thai_trick || '';
    let disabled = false;

    if (dakuten && !handakuten) {
      if (kanaObj.variants?.dakuten) {
        const v = kanaObj.variants.dakuten;
        ch = v.character; romaji = v.romaji; thai = v.thai_reading;
        strokePath = v.stroke_order_path || ''; kid = v.id;
      } else disabled = true;
    } else if (handakuten && !dakuten) {
      if (kanaObj.variants?.handakuten) {
        const v = kanaObj.variants.handakuten;
        ch = v.character; romaji = v.romaji; thai = v.thai_reading;
        strokePath = v.stroke_order_path || ''; kid = v.id;
      } else disabled = true;
    }

    _cellMap.set(kid, { character: ch, romaji, thai_reading: thai, thai_trick: trick, stroke_order_path: strokePath });

    const romajiOn = App.isRomajiVisible();
    const opClass = disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:border-red-500 hover:shadow-md';

    return `<div class="kana-cell w-14 h-16 shrink-0 flex flex-col items-center justify-center
      bg-white rounded-lg shadow-sm border border-gray-200 transition-all select-none ${opClass}"
      data-kid="${kid}" ${disabled ? 'data-disabled="1"' : ''}>
      <span class="text-2xl jp-char leading-none">${ch}</span>
      ${romajiOn ? `<span class="text-xs text-gray-400 mt-0.5 leading-none">${romaji}</span>` : ''}
    </div>`;
  }

  function _renderYoon(container) {
    const yoon = (_data.yoon || []).filter(y => y.type === 'hiragana');
    const voiceOrder = { plain:0, dakuten:1, handakuten:2 };
    const markerOrder = { ya:0, yu:1, yo:2 };
    yoon.sort((a, b) => {
      const vd = voiceOrder[a.voicing] - voiceOrder[b.voicing];
      return vd !== 0 ? vd : markerOrder[a.marker] - markerOrder[b.marker];
    });

    const byBase = {};
    yoon.forEach(y => {
      (byBase[y.base_id] = byBase[y.base_id] || []).push(y);
      _yoonMap.set(y.id, { character: y.character, romaji: y.romaji, thai_reading: y.thai_reading, thai_trick: '', stroke_order_path: '' });
    });

    const romajiOn = App.isRomajiVisible();
    let html = '<div class="space-y-1">';
    Object.values(byBase).forEach(group => {
      html += '<div class="flex gap-1">';
      group.forEach(y => {
        html += `<div class="kana-cell w-14 h-16 shrink-0 flex flex-col items-center justify-center
          bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:border-red-500 hover:shadow-md transition-all select-none"
          data-yid="${y.id}">
          <span class="text-xl jp-char leading-none">${y.character}</span>
          ${romajiOn ? `<span class="text-xs text-gray-400 mt-0.5 leading-none">${y.romaji}</span>` : ''}
        </div>`;
      });
      html += '</div>';
    });
    html += '</div>';
    container.innerHTML = html;
    _attachListeners(container);
  }

  function _attachListeners(container) {
    container.querySelectorAll('.kana-cell:not([data-disabled])').forEach(cell => {
      cell.addEventListener('click', () => {
        const kid = cell.dataset.kid;
        const yid = cell.dataset.yid;
        const d = kid ? _cellMap.get(kid) : _yoonMap.get(yid);
        if (!d) return;
        Audio.speak(d.character);
        App.showKanaModal({ ...d, romajiOn: App.isRomajiVisible() });
      });
    });
  }

  function refresh() { if (_data) _render(); }

  return { init, refresh };
})();
