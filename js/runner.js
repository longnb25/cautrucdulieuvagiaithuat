// Chạy mã C, trả về { output, timedOut, limited }.
(function () {
  const WORKER_URL = 'js/worker.js';

  function run(src, input, opts) {
    opts = opts || {};
    const timeoutMs = opts.timeoutMs || 5000;
    const onOut = opts.onOut || function () {};
    return new Promise((resolve) => {
      let output = '';
      let finished = false;
      let worker;
      const finish = (extra) => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        if (worker) worker.terminate();
        resolve(Object.assign({ output: output, timedOut: false, limited: false, failed: false }, extra));
      };
      const timer = setTimeout(() => finish({ timedOut: true }), timeoutMs);
      try {
        worker = new Worker(WORKER_URL);
      } catch (err) {
        output = 'Không khởi tạo được trình chạy C: ' + err.message;
        return finish({ failed: true });
      }
      worker.onmessage = (e) => {
        const d = e.data;
        if (d.type === 'out') {
          output += d.text;
          onOut(output);
        } else if (d.type === 'limit') {
          finish({ limited: true });
        } else if (d.type === 'done') {
          finish({});
        }
      };
      worker.onerror = (err) => {
        output += (output ? '\n' : '') + 'Lỗi trình chạy: ' + (err.message || 'không rõ');
        finish({ failed: true });
      };
      worker.postMessage({ src: src, input: input || '' });
    });
  }

  // Làm gọn thông báo lỗi của PicoC cho dễ đọc.
  function prettify(text) {
    return text.replace(/__user_main/g, 'main');
  }

  function normalize(s) {
    return s.replace(/\r/g, '').split('\n').map((l) => l.replace(/\s+$/, '')).join('\n').trim();
  }

  window.CRunner = { run: run, prettify: prettify, normalize: normalize };
})();
