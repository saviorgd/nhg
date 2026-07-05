const Dashboard = (() => {
  let _initialized = false;

  function init(vocabData) {
    if (_initialized) return;
    _initialized = true;
    _renderInspiration(vocabData.inspirations || []);
    _bindExportImport();
  }

  function _renderInspiration(inspirations) {
    if (!inspirations.length) return;
    const item = inspirations[Math.floor(Math.random() * inspirations.length)];
    document.getElementById('inspiration-text').textContent = item.text;
    document.getElementById('inspiration-author').textContent = '— ' + item.author;
  }

  function _bindExportImport() {
    document.getElementById('btn-export').addEventListener('click', _exportProgress);
    document.getElementById('btn-import').addEventListener('click', () => {
      document.getElementById('import-file-input').click();
    });
    document.getElementById('import-file-input').addEventListener('change', e => {
      const file = e.target.files[0];
      e.target.value = '';
      if (file) _importProgress(file);
    });
  }

  function _exportProgress() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k.startsWith('memory_') || k.startsWith('setting_')) {
        data[k] = localStorage.getItem(k);
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nihongo-progress.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function _importProgress(file) {
    const reader = new FileReader();
    reader.onload = e => {
      let data;
      try { data = JSON.parse(e.target.result); } catch {
        App.showAlert('ไฟล์ไม่ถูกต้อง กรุณาใช้ไฟล์ที่ export จากแอปนี้เท่านั้น');
        return;
      }
      const hasValid = Object.keys(data).some(k => k.startsWith('memory_') || k.startsWith('setting_'));
      if (!hasValid) {
        App.showAlert('ไฟล์ไม่ถูกต้อง กรุณาใช้ไฟล์ที่ export จากแอปนี้เท่านั้น');
        return;
      }
      Object.entries(data).forEach(([k, v]) => localStorage.setItem(k, v));
      App.showAlert('กู้คืนข้อมูลสำเร็จ!', () => location.reload());
    };
    reader.readAsText(file);
  }

  return { init };
})();
