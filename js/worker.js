// Chạy một chương trình C trong Web Worker để có thể ngắt khi bị treo (vòng lặp vô hạn).
importScripts('../vendor/picoc.umd.js');

// Đổi tên main -> __user_main rồi thêm main bọc ngoài để luôn fflush(stdout),
// nếu không dòng cuối không có '\n' sẽ bị mất.
function wrap(src) {
  // PicoC truyền tham số mảng "int a[]" theo giá trị (sao chép), khác với C chuẩn.
  // Trong C chuẩn "int a[]" ở danh sách tham số đúng bằng "int *a", nên đổi lại để hàm sửa được mảng gốc.
  src = src.replace(
    /\b((?:unsigned\s+)?(?:int|char|short|long|float|double)|struct\s+\w+)\s+(\w+)\s*\[\s*\](?=\s*[,)])/g,
    '$1 *$2'
  );
  const re = /\b(int|void)(\s+)main(\s*\()([^)]*)\)/;
  const m = re.exec(src);
  if (!m) return src;
  const isVoid = m[1] === 'void';
  const hasParams = m[4].trim() !== '' && m[4].trim() !== 'void';
  const renamed = src.replace(re, '$1$2__user_main$3$4)');
  const call = hasParams ? '__user_main(1, 0)' : '__user_main()';
  const body = isVoid
    ? call + '; fflush(stdout); return 0;'
    : 'int r = ' + call + '; fflush(stdout); return r;';
  return renamed + '\nint main(){ ' + body + ' }\n';
}

self.onmessage = (e) => {
  const { src, input } = e.data;
  const dec = new TextDecoder();
  const bytes = [];
  let pos = 0;
  let total = 0;
  const flush = () => {
    if (!bytes.length) return;
    const text = dec.decode(new Uint8Array(bytes.splice(0)), { stream: true });
    total += text.length;
    self.postMessage({ type: 'out', text });
    if (total > 200000) self.postMessage({ type: 'limit' });
  };
  const put = (c) => {
    if (c === null || c === undefined) return;
    bytes.push(c & 255);
    if ((c & 255) === 10 || bytes.length > 512) flush();
  };
  picocjs.runC(wrap(src), () => {}, () => {
    flush();
    self.postMessage({ type: 'done' });
  }, {
    stdin: () => (pos < input.length ? input.charCodeAt(pos++) & 255 : null),
    stdout: put,
    stderr: put,
  });
};
