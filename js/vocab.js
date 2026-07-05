const VocabTable = (() => {
  const PAGE_SIZE = 50;
  let _allItems = [], _filtered = [], _page = 1, _query = '', _initialized = false;

  function init() {
    if (!_initialized) {
      _initialized = true;
      _bindSearch();
      _bindPagination();
    }
    _loadAll();
  }

  async function _loadAll() {
    _setLoading(true);
    try {
      const cache = VocabFlashcard.getCache();
      const levels = ['n5','n4','n3','n2'];
      // Load each level that hasn't been cached yet
      await Promise.all(levels.map(async lvl => {
        const key = lvl.toUpperCase();
        if (!cache[key]) {
          try {
            const res = await fetch(`./data/vocab_${lvl}.json`);
            if (res.ok) cache[key] = await res.json();
          } catch {}
        }
      }));
      _allItems = levels.flatMap(lvl => cache[lvl.toUpperCase()] || []);
      _applyFilter();
    } catch {
      _showError();
    } finally {
      _setLoading(false);
    }
  }

  function _bindSearch() {
    const input = document.getElementById('vocab-search');
    input.addEventListener('input', e => {
      _query = e.target.value.trim().toLowerCase();
      _page = 1;
      _applyFilter();
    });
  }

  function _bindPagination() {
    document.getElementById('vocab-prev').addEventListener('click', () => {
      if (_page > 1) { _page--; _renderTable(); }
    });
    document.getElementById('vocab-next').addEventListener('click', () => {
      const maxPage = Math.ceil(_filtered.length / PAGE_SIZE);
      if (_page < maxPage) { _page++; _renderTable(); }
    });
  }

  function _applyFilter() {
    if (!_query) {
      _filtered = _allItems;
    } else {
      _filtered = _allItems.filter(item =>
        (item.kana || '').includes(_query) ||
        (item.kanji || '').includes(_query) ||
        (item.romaji || '').toLowerCase().includes(_query) ||
        (item.thai_meaning || '').includes(_query) ||
        (item.thai_reading || '').includes(_query)
      );
    }
    _renderTable();
  }

  function _renderTable() {
    const tbody = document.getElementById('vocab-tbody');
    const maxPage = Math.max(1, Math.ceil(_filtered.length / PAGE_SIZE));
    if (_page > maxPage) _page = maxPage;

    if (_filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" class="text-center py-12 text-gray-400">
        <div class="text-4xl mb-2">🔍</div>
        <p>ไม่พบคำศัพท์ที่ค้นหา</p>
      </td></tr>`;
      _updatePagination(0, 0);
      return;
    }

    const start = (_page - 1) * PAGE_SIZE;
    const slice = _filtered.slice(start, start + PAGE_SIZE);
    const romajiOn = App.isRomajiVisible();

    tbody.innerHTML = slice.map(item => {
      const kanji = item.kanji || '-';
      const sentence = item.example_sentence;
      return `<tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <td class="py-3 px-3 text-left">
          <div class="text-xl font-medium">${item.kana}</div>
          <div class="text-sm text-gray-500">${kanji}</div>
        </td>
        <td class="py-3 px-3 text-left">
          <div class="text-sm">${item.thai_reading}</div>
          ${romajiOn ? `<div class="text-xs text-gray-400">${item.romaji}</div>` : ''}
        </td>
        <td class="py-3 px-3 text-left">
          <div class="font-medium">${item.thai_meaning}</div>
          ${sentence ? `
          <div class="mt-1 text-sm text-gray-700 font-bold">${sentence.japanese}</div>
          ${romajiOn ? `<div class="text-xs text-gray-400 italic">${sentence.romaji}</div>` : ''}
          <div class="text-xs text-gray-500">${sentence.thai}</div>` : ''}
        </td>
        <td class="py-3 px-3 text-left">
          <span class="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">${item.category}</span>
          <span class="ml-1 inline-block text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded">${item.jlpt_level}</span>
        </td>
      </tr>`;
    }).join('');

    _updatePagination(_page, maxPage);
  }

  function _updatePagination(current, max) {
    const el = document.getElementById('vocab-page-info');
    el.textContent = max > 0 ? `หน้า ${current} / ${max}` : '';
    document.getElementById('vocab-prev').disabled = current <= 1;
    document.getElementById('vocab-next').disabled = current >= max;
  }

  function _setLoading(on) {
    document.getElementById('vocab-loading').classList.toggle('hidden', !on);
    document.getElementById('vocab-table-wrap').classList.toggle('hidden', on);
  }

  function _showError() {
    document.getElementById('vocab-loading').classList.add('hidden');
    App.showAlert('ไม่สามารถโหลดข้อมูลได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
  }

  function refresh() { _renderTable(); }

  return { init, refresh };
})();
