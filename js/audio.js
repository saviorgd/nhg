const Audio = (() => {
  let _voicesLoaded = false;

  if (window.speechSynthesis) {
    speechSynthesis.addEventListener('voiceschanged', () => { _voicesLoaded = true; });
  }

  function _getJaVoice() {
    const voices = speechSynthesis.getVoices();
    return voices.find(v => v.lang === 'ja-JP') || voices.find(v => v.lang.startsWith('ja'));
  }

  function speak(text) {
    if (!window.speechSynthesis) {
      App.showAlert('เบราว์เซอร์นี้ไม่รองรับการออกเสียงอัตโนมัติ กรุณาใช้ Chrome หรือ Safari');
      return;
    }
    speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'ja-JP';
    const voice = _getJaVoice();
    if (voice) utt.voice = voice;
    speechSynthesis.speak(utt);
  }

  return { speak };
})();
