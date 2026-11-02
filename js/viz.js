// Minh họa trực quan thuật toán và cấu trúc dữ liệu.
(function () {
  'use strict';

  // ---------- helpers ----------
  function $(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    return e;
  }
  function esc(s) {
    return String(s).replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; });
  }
  function range(a, b) { var r = []; for (var i = a; i <= b; i++) r.push(i); return r; }
  function randInt(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }
  function randInts(n, lo, hi) { var r = []; for (var i = 0; i < n; i++) r.push(randInt(lo, hi)); return r; }

  function parseInts(str, o) {
    o = o || {};
    var min = o.min === undefined ? 1 : o.min, max = o.max || 14;
    var lo = o.lo === undefined ? 0 : o.lo, hi = o.hi === undefined ? 999 : o.hi;
    var nums = (String(str).match(/-?\d+/g) || []).map(Number);
    if (nums.length < min || nums.length > max) throw new Error('Cần nhập từ ' + min + ' đến ' + max + ' số nguyên, cách nhau bằng khoảng trắng.');
    if (nums.some(function (x) { return x < lo || x > hi; })) throw new Error('Mỗi số phải nằm trong khoảng [' + lo + ', ' + hi + '].');
    return nums;
  }

  // ---------- frame player ----------
  function createPlayer(host, cfg) {
    var root = $('div', 'viz');
    var bar = $('div', 'viz-bar');
    var fields = {};
    cfg.fields.forEach(function (f) {
      var lab = $('label', null, f.label);
      var inp;
      if (f.kind === 'select') {
        inp = $('select', 'sel');
        f.options.forEach(function (o) {
          var op = $('option', null, String(o[1]));
          op.value = String(o[0]);
          inp.append(op);
        });
        inp.value = String(f.value);
        inp.addEventListener('change', rebuild);
      } else {
        inp = $('input', 'txt');
        inp.type = 'text';
        inp.value = f.value;
        inp.size = f.size || 24;
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') rebuild(); });
      }
      inp.setAttribute('aria-label', f.label);
      fields[f.key] = inp;
      bar.append(lab, inp);
    });
    var applyBtn = $('button', 'btn sm', 'Áp dụng');
    applyBtn.type = 'button';
    applyBtn.addEventListener('click', rebuild);
    bar.append(applyBtn);
    if (cfg.random) {
      var rb = $('button', 'btn sm', 'Ngẫu nhiên');
      rb.type = 'button';
      rb.addEventListener('click', function () {
        var v = cfg.random();
        Object.keys(v).forEach(function (k) { fields[k].value = v[k]; });
        rebuild();
      });
      bar.append(rb);
    }
    var stage = $('div', 'stage');
    var caption = $('div', 'caption');
    caption.setAttribute('aria-live', 'polite');
    var stats = $('div', 'vstats');

    var ctl = $('div', 'vctl');
    function mk(label, aria, fn) {
      var b = $('button', 'btn sm', label);
      b.type = 'button';
      b.setAttribute('aria-label', aria);
      b.addEventListener('click', fn);
      return b;
    }
    var playBtn = mk('▶ Chạy', 'Chạy tự động', function () { if (timer) stop(); else play(); });
    var speed = $('input');
    speed.type = 'range'; speed.min = '1'; speed.max = '10'; speed.value = '6';
    speed.setAttribute('aria-label', 'Tốc độ');
    var stepLbl = $('span', 'step');
    ctl.append(
      mk('⏮', 'Về đầu', function () { stop(); go(0); }),
      mk('◀', 'Bước trước', function () { stop(); go(idx - 1); }),
      playBtn,
      mk('▶|', 'Bước sau', function () { stop(); go(idx + 1); }),
      mk('⏭', 'Đến cuối', function () { stop(); go(frames.length - 1); }),
      $('label', null, 'Tốc độ'), speed, stepLbl
    );

    var legend = $('div', 'legend');
    (cfg.legend || []).forEach(function (l) {
      var s = $('span');
      s.innerHTML = '<i style="background:' + l[0] + '"></i>' + esc(l[1]);
      legend.append(s);
    });

    root.append(bar, stage, caption, stats, ctl, legend);
    host.append(root);

    var frames = [], idx = 0, timer = null, values = {};

    function show() {
      var f = frames[idx];
      cfg.render(stage, f, values);
      caption.textContent = f.text || '';
      stats.innerHTML = '';
      if (f.stats) {
        Object.keys(f.stats).forEach(function (k) {
          var s = $('span');
          s.innerHTML = esc(k) + ': <b>' + esc(f.stats[k]) + '</b>';
          stats.append(s);
        });
      }
      stepLbl.textContent = 'Bước ' + (idx + 1) + '/' + frames.length;
    }
    function go(i) {
      if (!frames.length) return;
      idx = Math.max(0, Math.min(frames.length - 1, i));
      show();
    }
    function stop() {
      if (timer) { clearTimeout(timer); timer = null; }
      playBtn.textContent = '▶ Chạy';
    }
    function play() {
      if (!frames.length) return;
      if (idx >= frames.length - 1) idx = 0;
      playBtn.textContent = '⏸ Dừng';
      (function tick() {
        show();
        if (idx < frames.length - 1) {
          timer = setTimeout(function () { idx++; tick(); }, 1150 - Number(speed.value) * 100);
        } else {
          timer = null;
          playBtn.textContent = '▶ Chạy';
        }
      })();
    }
    function rebuild() {
      stop();
      try {
        values = {};
        Object.keys(fields).forEach(function (k) { values[k] = fields[k].value; });
        frames = cfg.build(values);
        idx = 0;
        show();
      } catch (e) {
        frames = [];
        stage.innerHTML = '';
        stats.innerHTML = '';
        stepLbl.textContent = '';
        caption.textContent = '⚠ ' + e.message;
      }
    }
    rebuild();
    return { destroy: stop };
  }

  // ---------- sorting ----------
  var SORT_LEGEND = [
    ['#ffc83d', 'đang so sánh'], ['#ff5c9d', 'vừa đổi chỗ'], ['#38e8ff', 'chốt / nhỏ nhất hiện tại'],
    ['#17b862', 'đã đúng vị trí'], ['#2bff8c', 'vừa ghi vào']
  ];

  function renderBars(stage, f) {
    stage.innerHTML = '';
    var max = Math.max.apply(null, f.a.concat([1]));
    var bars = $('div', 'bars');
    var idxRow = $('div', 'idx-row');
    f.a.forEach(function (v, i) {
      var cls = 'bar-col';
      if (f.range && (i < f.range[0] || i > f.range[1])) cls += ' dim';
      if (f.sorted && f.sorted.indexOf(i) >= 0) cls += ' sorted';
      if (f.cmp && f.cmp.indexOf(i) >= 0) cls += ' cmp';
      if (f.swap && f.swap.indexOf(i) >= 0) cls += ' swap';
      if (f.pivot === i) cls += ' pivot';
      if (f.write === i) cls += ' write';
      var col = $('div', cls);
      col.append($('span', 'v', v));
      var b = $('div', 'b');
      b.style.height = Math.max(6, Math.round(v / max * 150)) + 'px';
      col.append(b);
      bars.append(col);
      var ix = $('div');
      ix.innerHTML = i + (f.marks && f.marks[i] ? '<br><b>' + esc(f.marks[i]) + '</b>' : '');
      idxRow.append(ix);
    });
    stage.append(bars, idxRow);
  }

  function addMark(m, i, label) { m[i] = m[i] ? m[i] + ',' + label : label; }

  function sortFrames(kind, arr) {
    var a = arr.slice(), n = a.length, F = [], c = 0, s = 0, sorted = [];
    function push(o) {
      o.a = a.slice();
      o.sorted = sorted.slice();
      o.stats = { 'So sánh': c, 'Đổi chỗ / ghi': s };
      F.push(o);
    }
    function swap(i, j) { var t = a[i]; a[i] = a[j]; a[j] = t; s++; }
    push({ text: 'Mảng ban đầu: ' + a.join(', ') });
    var i, j;
    if (kind === 'bubble') {
      for (i = 0; i < n - 1; i++) {
        var swapped = false;
        for (j = 0; j < n - 1 - i; j++) {
          c++;
          push({ cmp: [j, j + 1], text: 'So sánh a[' + j + ']=' + a[j] + ' với a[' + (j + 1) + ']=' + a[j + 1] });
          if (a[j] > a[j + 1]) {
            swap(j, j + 1);
            swapped = true;
            push({ swap: [j, j + 1], text: a[j + 1] + ' > ' + a[j] + ' nên đổi chỗ, số lớn “nổi” sang phải' });
          }
        }
        sorted.push(n - 1 - i);
        push({ text: 'Hết lượt ' + (i + 1) + ': ' + a[n - 1 - i] + ' đã về đúng vị trí cuối' });
        if (!swapped) {
          sorted = range(0, n - 1);
          push({ text: 'Lượt này không phải đổi chỗ nào, mảng đã sắp xếp, dừng sớm' });
          return F;
        }
      }
    } else if (kind === 'selection') {
      for (i = 0; i < n - 1; i++) {
        var min = i;
        push({ pivot: min, marks: (function () { var m = {}; addMark(m, i, 'i'); return m; })(), text: 'Lượt ' + (i + 1) + ': tạm coi a[' + i + ']=' + a[i] + ' là nhỏ nhất' });
        for (j = i + 1; j < n; j++) {
          c++;
          var mk = {}; addMark(mk, i, 'i'); addMark(mk, j, 'j');
          push({ cmp: [j], pivot: min, marks: mk, text: 'So sánh a[' + j + ']=' + a[j] + ' với nhỏ nhất hiện tại a[' + min + ']=' + a[min] });
          if (a[j] < a[min]) {
            min = j;
            push({ pivot: min, cmp: [j], marks: mk, text: 'Tìm được số nhỏ hơn: nhỏ nhất mới là a[' + min + ']=' + a[min] });
          }
        }
        if (min !== i) {
          swap(i, min);
          sorted.push(i);
          push({ swap: [i, min], text: 'Đổi chỗ a[' + i + '] với số nhỏ nhất vừa tìm được' });
        } else {
          sorted.push(i);
          push({ text: 'a[' + i + '] đã là số nhỏ nhất, giữ nguyên' });
        }
      }
    } else if (kind === 'insertion') {
      for (i = 1; i < n; i++) {
        sorted = range(0, i - 1);
        push({ text: 'Lấy a[' + i + ']=' + a[i] + ' để chèn vào phần đã sắp xếp bên trái' });
        j = i;
        while (j > 0) {
          c++;
          push({ cmp: [j - 1, j], text: 'So sánh a[' + (j - 1) + ']=' + a[j - 1] + ' với ' + a[j] });
          if (a[j - 1] > a[j]) {
            swap(j - 1, j);
            push({ swap: [j - 1, j], text: a[j] + ' lớn hơn nên dịch sang phải, số đang chèn lùi một ô' });
            j--;
          } else {
            push({ text: a[j - 1] + ' ≤ ' + a[j] + ': đã tìm được chỗ đúng, dừng' });
            break;
          }
        }
      }
    }
    sorted = range(0, n - 1);
    push({ text: 'Hoàn thành: ' + a.join(', ') });
    return F;
  }

  function mergeFrames(arr) {
    var a = arr.slice(), n = a.length, F = [], c = 0, s = 0, done = false;
    function push(o) {
      o.a = a.slice();
      o.sorted = done ? range(0, n - 1) : [];
      o.stats = { 'So sánh': c, 'Ghi vào mảng': s };
      F.push(o);
    }
    push({ text: 'Mảng ban đầu: ' + a.join(', ') });
    function ms(l, r) {
      if (l >= r) return;
      var m = Math.floor((l + r) / 2);
      push({ range: [l, r], text: 'Chia đoạn [' + l + '..' + r + '] thành [' + l + '..' + m + '] và [' + (m + 1) + '..' + r + ']' });
      ms(l, m);
      ms(m + 1, r);
      var L = a.slice(l, m + 1), R = a.slice(m + 1, r + 1), i = 0, j = 0, k = l;
      push({ range: [l, r], text: 'Trộn hai nửa đã sắp xếp: [' + L.join(', ') + '] và [' + R.join(', ') + ']' });
      while (i < L.length && j < R.length) {
        c++;
        var takeLeft = L[i] <= R[j];
        var txt = L[i] + (takeLeft ? ' ≤ ' : ' > ') + R[j] + ': lấy ' + (takeLeft ? L[i] + ' từ nửa trái' : R[j] + ' từ nửa phải');
        a[k] = takeLeft ? L[i++] : R[j++];
        s++;
        push({ range: [l, r], write: k, text: txt });
        k++;
      }
      while (i < L.length) { a[k] = L[i++]; s++; push({ range: [l, r], write: k, text: 'Nửa phải hết, chép nốt ' + a[k] + ' từ nửa trái' }); k++; }
      while (j < R.length) { a[k] = R[j++]; s++; push({ range: [l, r], write: k, text: 'Nửa trái hết, chép nốt ' + a[k] + ' từ nửa phải' }); k++; }
      push({ range: [l, r], text: 'Đoạn [' + l + '..' + r + '] đã sắp xếp: ' + a.slice(l, r + 1).join(', ') });
    }
    ms(0, n - 1);
    done = true;
    push({ text: 'Hoàn thành: ' + a.join(', ') });
    return F;
  }

  function quickFrames(arr) {
    var a = arr.slice(), n = a.length, F = [], c = 0, s = 0, sorted = [];
    function push(o) {
      o.a = a.slice();
      o.sorted = sorted.slice();
      o.stats = { 'So sánh': c, 'Đổi chỗ': s };
      F.push(o);
    }
    function swap(i, j) { var t = a[i]; a[i] = a[j]; a[j] = t; s++; }
    push({ text: 'Mảng ban đầu: ' + a.join(', ') });
    function qs(lo, hi) {
      if (lo > hi) return;
      if (lo === hi) { sorted.push(lo); push({ text: 'Đoạn chỉ có 1 phần tử (a[' + lo + ']=' + a[lo] + '), đã đúng vị trí' }); return; }
      var pivot = a[hi], i = lo - 1, j, m;
      push({ range: [lo, hi], pivot: hi, text: 'Đoạn [' + lo + '..' + hi + ']: chọn chốt là phần tử cuối a[' + hi + ']=' + pivot });
      for (j = lo; j < hi; j++) {
        c++;
        m = {}; addMark(m, j, 'j'); if (i >= lo) addMark(m, i, 'i');
        push({ range: [lo, hi], pivot: hi, cmp: [j], marks: m, text: 'a[' + j + ']=' + a[j] + (a[j] <= pivot ? ' ≤ ' : ' > ') + 'chốt ' + pivot });
        if (a[j] <= pivot) {
          i++;
          if (i !== j) {
            swap(i, j);
            m = {}; addMark(m, j, 'j'); addMark(m, i, 'i');
            push({ range: [lo, hi], pivot: hi, swap: [i, j], marks: m, text: 'Đưa ' + a[i] + ' về nhóm “≤ chốt” bên trái: đổi a[' + i + '] với a[' + j + ']' });
          }
        }
      }
      var p = i + 1;
      if (p !== hi) swap(p, hi);
      sorted.push(p);
      push({ range: [lo, hi], pivot: p, swap: p !== hi ? [p, hi] : undefined, text: 'Đặt chốt ' + pivot + ' vào vị trí cuối cùng của nó: a[' + p + ']. Bên trái đều ≤, bên phải đều >' });
      qs(lo, p - 1);
      qs(p + 1, hi);
    }
    qs(0, n - 1);
    sorted = range(0, n - 1);
    push({ text: 'Hoàn thành: ' + a.join(', ') });
    return F;
  }

  function sortViz(kind, defaultArr) {
    return function (host) {
      return createPlayer(host, {
        fields: [{ key: 'arr', label: 'Mảng', value: defaultArr, size: 30 }],
        random: function () { return { arr: randInts(8, 5, 99).join(' ') }; },
        legend: SORT_LEGEND,
        build: function (v) {
          var arr = parseInts(v.arr, { min: 2, max: 14, lo: 1, hi: 999 });
          if (kind === 'merge') return mergeFrames(arr);
          if (kind === 'quick') return quickFrames(arr);
          return sortFrames(kind, arr);
        },
        render: renderBars
      });
    };
  }

  // ---------- search ----------
  function searchViz(host) {
    return createPlayer(host, {
      fields: [
        { key: 'arr', label: 'Mảng', value: '2 5 8 12 16 23 38 56 72 91', size: 28 },
        { key: 'x', label: 'Cần tìm', value: '23', size: 5 },
        { key: 'mode', label: 'Cách tìm', kind: 'select', value: 'binary', options: [['binary', 'Nhị phân (mảng đã sắp xếp)'], ['linear', 'Tuyến tính']] }
      ],
      random: function () {
        var arr = randInts(10, 1, 99).sort(function (p, q) { return p - q; });
        return { arr: arr.join(' '), x: String(arr[randInt(0, 9)]) };
      },
      legend: [['#ffc83d', 'phần tử giữa / đang xét'], ['#2bff8c', 'tìm thấy'], ['#1f5d3d', 'bị loại']],
      build: function (v) {
        var a = parseInts(v.arr, { min: 1, max: 16, lo: -999, hi: 999 });
        var x = parseInts(v.x, { min: 1, max: 1, lo: -999, hi: 999 })[0];
        var F = [], steps = 0, i;
        if (v.mode === 'binary') {
          a.sort(function (p, q) { return p - q; });
          var l = 0, r = a.length - 1;
          F.push({ a: a, l: 0, r: r, text: 'Mảng đã được sắp xếp tăng dần (bắt buộc với tìm nhị phân). Cần tìm ' + x, stats: { 'Số bước': 0 } });
          while (l <= r) {
            var m = Math.floor((l + r) / 2);
            steps++;
            if (a[m] === x) {
              F.push({ a: a, l: l, r: r, m: m, found: m, text: 'a[' + m + '] = ' + x + ': TÌM THẤY ở vị trí ' + m, stats: { 'Số bước': steps } });
              return F;
            }
            F.push({ a: a, l: l, r: r, m: m, text: 'Xét giữa m=(' + l + '+' + r + ')/2=' + m + ': a[' + m + ']=' + a[m] + (a[m] < x ? ' < ' : ' > ') + x + ' → bỏ nửa ' + (a[m] < x ? 'trái' : 'phải'), stats: { 'Số bước': steps } });
            if (a[m] < x) l = m + 1; else r = m - 1;
          }
          F.push({ a: a, l: 1, r: 0, text: 'Khoảng tìm kiếm rỗng: ' + x + ' KHÔNG có trong mảng (trả về -1)', stats: { 'Số bước': steps } });
        } else {
          for (i = 0; i < a.length; i++) {
            steps++;
            if (a[i] === x) {
              F.push({ a: a, cur: i, found: i, text: 'a[' + i + '] = ' + x + ': TÌM THẤY ở vị trí ' + i, stats: { 'Số bước': steps } });
              return F;
            }
            F.push({ a: a, cur: i, text: 'a[' + i + '] = ' + a[i] + ' ≠ ' + x + ', xét tiếp', stats: { 'Số bước': steps } });
          }
          F.push({ a: a, text: 'Đã duyệt hết: ' + x + ' KHÔNG có trong mảng', stats: { 'Số bước': steps } });
        }
        return F;
      },
      render: function (stage, f) {
        stage.innerHTML = '';
        var cells = $('div', 'cells');
        f.a.forEach(function (v, i) {
          var cls = 'cell';
          if (f.l !== undefined && (i < f.l || i > f.r)) cls += ' dim';
          if (f.m === i) cls += ' mid';
          if (f.cur === i) cls += ' mid';
          if (f.found === i) cls += ' found';
          var cell = $('div', cls);
          var p = [];
          if (f.l !== undefined && f.l <= f.r) { if (i === f.l) p.push('l'); if (i === f.r) p.push('r'); }
          if (f.m === i) p.push('m');
          cell.append($('div', 'p', p.join(',')), $('div', 'c', v), $('div', 'i', i));
          cells.append(cell);
        });
        stage.append(cells);
      }
    });
  }

  // ---------- hanoi ----------
  function hanoiViz(host) {
    return createPlayer(host, {
      fields: [{ key: 'n', label: 'Số đĩa', kind: 'select', value: 3, options: [1, 2, 3, 4, 5, 6].map(function (x) { return [x, x]; }) }],
      legend: [['#ff5c9d', 'đĩa vừa chuyển'], ['#17b862', 'đĩa']],
      build: function (v) {
        var n = Number(v.n), pegs = [range(1, n).reverse(), [], []], F = [], moves = 0;
        var names = ['A', 'B', 'C'];
        function snap(o) {
          o.p = pegs.map(function (x) { return x.slice(); });
          o.stats = { 'Số lần chuyển': moves, 'Tối thiểu cần': Math.pow(2, n) - 1 };
          F.push(o);
        }
        snap({ text: 'Chuyển ' + n + ' đĩa từ cọc A sang cọc C, mỗi lần một đĩa, không đặt đĩa to lên đĩa nhỏ.' });
        function h(k, from, aux, to) {
          if (k === 0) return;
          h(k - 1, from, to, aux);
          var d = pegs[from].pop();
          pegs[to].push(d);
          moves++;
          snap({ hot: d, text: 'Chuyển đĩa ' + d + ' từ ' + names[from] + ' sang ' + names[to] });
          h(k - 1, aux, from, to);
        }
        h(n, 0, 1, 2);
        F[F.length - 1].text = 'Xong sau ' + moves + ' lần chuyển (= 2^' + n + ' − 1).';
        return F;
      },
      render: function (stage, f, v) {
        stage.innerHTML = '';
        var n = Number(v.n);
        var box = $('div', 'hanoi');
        f.p.forEach(function (disks, pi) {
          var peg = $('div', 'peg');
          disks.slice().reverse().forEach(function (d) {
            var disk = $('div', 'disk' + (f.hot === d ? ' hot' : ''), d);
            disk.style.width = (24 + d * 120 / n) + 'px';
            peg.append(disk);
          });
          peg.append($('div', 'name', 'ABC'[pi]));
          box.append(peg);
        });
        stage.append(box);
        stage.style.paddingBottom = '36px';
      }
    });
  }

  // ---------- call stack (factorial) ----------
  function factorialViz(host) {
    return createPlayer(host, {
      fields: [{ key: 'n', label: 'n', kind: 'select', value: 4, options: range(1, 8).map(function (x) { return [x, x]; }) }],
      legend: [['#2bff8c', 'lời gọi đang chạy'], ['#15271e', 'đang chờ kết quả']],
      build: function (v) {
        var n = Number(v.n), st = [], F = [];
        function snap(o) { o.st = st.map(function (x) { return { n: x.n, r: x.r }; }); F.push(o); }
        snap({ text: 'Tính ' + n + '! bằng đệ quy. Mỗi lời gọi là một “khung” xếp chồng trong stack.' });
        function g(k) {
          st.push({ n: k, r: null });
          snap({ text: 'Gọi giaiThua(' + k + ')' + (k <= 1 ? ': trường hợp cơ sở, trả về 1 ngay' : ': chưa biết kết quả, phải gọi giaiThua(' + (k - 1) + ') trước') });
          var r;
          if (k <= 1) r = 1; else r = k * g(k - 1);
          st[st.length - 1].r = r;
          snap({ text: 'giaiThua(' + k + ') trả về ' + (k <= 1 ? '1' : k + ' × ' + (r / k) + ' = ' + r) });
          st.pop();
          return r;
        }
        var result = g(n);
        snap({ text: 'Stack rỗng. Kết quả: ' + n + '! = ' + result });
        return F;
      },
      render: function (stage, f) {
        stage.innerHTML = '';
        var box = $('div', 'cstack');
        f.st.forEach(function (fr, i) {
          var cls = 'cframe' + (i === f.st.length - 1 ? ' top' : '') + (fr.r !== null ? ' ret' : '');
          var d = $('div', cls);
          d.append($('span', null, 'giaiThua(' + fr.n + ')'), $('span', null, fr.r !== null ? '= ' + fr.r : '…'));
          box.append(d);
        });
        stage.append(box);
      }
    });
  }

  // ---------- graph ----------
  function graphViz(host) {
    return createPlayer(host, {
      fields: [
        { key: 'edges', label: 'Cạnh', value: '0-1 0-2 1-3 1-4 2-5 3-6 4-6 5-7 6-7', size: 34 },
        { key: 'start', label: 'Bắt đầu', kind: 'select', value: 0, options: range(0, 9).map(function (x) { return [x, x]; }) },
        { key: 'algo', label: 'Thuật toán', kind: 'select', value: 'bfs', options: [['bfs', 'BFS (chiều rộng, dùng queue)'], ['dfs', 'DFS (chiều sâu, đệ quy)']] }
      ],
      random: function () {
        var n = 8, ed = [], i;
        for (i = 1; i < n; i++) ed.push(randInt(0, i - 1) + '-' + i);
        for (i = 0; i < 3; i++) { var u = randInt(0, n - 1), w = randInt(0, n - 1); if (u !== w) ed.push(Math.min(u, w) + '-' + Math.max(u, w)); }
        return { edges: ed.join(' '), start: '0' };
      },
      legend: [['#38e8ff', 'đỉnh đang xét'], ['#ffc83d', 'đang chờ trong queue/stack'], ['#17b862', 'đã thăm']],
      build: function (v) {
        var pairs = (v.edges.match(/\d+\s*-\s*\d+/g) || []).map(function (s) { return s.split('-').map(Number); });
        if (!pairs.length) throw new Error('Nhập danh sách cạnh dạng 0-1 0-2 1-3 (đỉnh từ 0 đến 9).');
        var n = 0;
        pairs.forEach(function (p) { n = Math.max(n, p[0] + 1, p[1] + 1); });
        if (n > 10) throw new Error('Đỉnh chỉ được từ 0 đến 9.');
        var start = Number(v.start);
        if (start >= n) throw new Error('Đỉnh bắt đầu phải nhỏ hơn ' + n + '.');
        var adj = [], i;
        for (i = 0; i < n; i++) adj.push([]);
        pairs.forEach(function (p) {
          if (p[0] === p[1]) return;
          if (adj[p[0]].indexOf(p[1]) < 0) adj[p[0]].push(p[1]);
          if (adj[p[1]].indexOf(p[0]) < 0) adj[p[1]].push(p[0]);
        });
        adj.forEach(function (x) { x.sort(function (p, q) { return p - q; }); });
        var vis = {}, order = [], tree = [], F = [];
        function snap(o) {
          o.n = n; o.edges = pairs; o.vis = Object.keys(vis).map(Number); o.order = order.slice(); o.tree = tree.map(function (t) { return t.slice(); });
          F.push(o);
        }
        if (v.algo === 'bfs') {
          var q = [start];
          vis[start] = true;
          snap({ cur: -1, list: q.slice(), label: 'Hàng đợi', text: 'Bắt đầu từ ' + start + ': đánh dấu đã thăm và cho vào hàng đợi' });
          while (q.length) {
            var u = q.shift();
            order.push(u);
            snap({ cur: u, list: q.slice(), label: 'Hàng đợi', text: 'Lấy ' + u + ' ra khỏi hàng đợi để xét các đỉnh kề: ' + (adj[u].join(', ') || '(không có)') });
            adj[u].forEach(function (w) {
              if (!vis[w]) {
                vis[w] = true;
                tree.push([u, w]);
                q.push(w);
                snap({ cur: u, list: q.slice(), label: 'Hàng đợi', text: w + ' chưa thăm → đánh dấu, đưa vào hàng đợi (cạnh ' + u + '–' + w + ' thuộc cây duyệt)' });
              }
            });
          }
          snap({ cur: -1, list: [], label: 'Hàng đợi', text: 'Hàng đợi rỗng. Thứ tự thăm: ' + order.join(' → ') });
        } else {
          var path = [];
          (function dfs(u) {
            vis[u] = true;
            order.push(u);
            path.push(u);
            snap({ cur: u, list: path.slice(), label: 'Đường đi hiện tại', text: 'Thăm ' + u + ', đi sâu tiếp vào các đỉnh kề: ' + (adj[u].join(', ') || '(không có)') });
            adj[u].forEach(function (w) {
              if (!vis[w]) {
                tree.push([u, w]);
                dfs(w);
                snap({ cur: u, list: path.slice(), label: 'Đường đi hiện tại', text: 'Quay lui về ' + u + ' để thử đỉnh kề tiếp theo' });
              }
            });
            path.pop();
          })(start);
          snap({ cur: -1, list: [], label: 'Đường đi hiện tại', text: 'Hết đường quay lui. Thứ tự thăm: ' + order.join(' → ') });
        }
        return F;
      },
      render: function (stage, f) {
        stage.innerHTML = '';
        var W = 560, H = 300, cx = W / 2, cy = H / 2, R = 115, pos = [], i;
        for (i = 0; i < f.n; i++) {
          var ang = -Math.PI / 2 + i * 2 * Math.PI / f.n;
          pos.push([cx + R * 1.3 * Math.cos(ang), cy + R * Math.sin(ang)]);
        }
        var svg = '<svg class="gsvg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Đồ thị">';
        f.edges.forEach(function (e) {
          var isTree = f.tree.some(function (t) { return (t[0] === e[0] && t[1] === e[1]) || (t[0] === e[1] && t[1] === e[0]); });
          svg += '<line class="e' + (isTree ? ' tree' : '') + '" x1="' + pos[e[0]][0] + '" y1="' + pos[e[0]][1] + '" x2="' + pos[e[1]][0] + '" y2="' + pos[e[1]][1] + '"/>';
        });
        for (i = 0; i < f.n; i++) {
          var cls = 'n';
          if (f.vis.indexOf(i) >= 0) cls += ' vis';
          if (f.list.indexOf(i) >= 0 && f.cur !== i && f.label === 'Hàng đợi') cls += ' front';
          if (f.cur === i) cls += ' cur';
          svg += '<g class="' + cls + '"><circle cx="' + pos[i][0] + '" cy="' + pos[i][1] + '" r="19"/><text x="' + pos[i][0] + '" y="' + pos[i][1] + '">' + i + '</text></g>';
        }
        svg += '</svg>';
        stage.innerHTML = svg;
        var box = $('div', 'gbox');
        box.innerHTML = '<span>' + esc(f.label) + ': <b>[' + f.list.join(', ') + ']</b></span><span>Thứ tự thăm: <b>' + (f.order.join(' → ') || '—') + '</b></span>';
        stage.append(box);
      }
    });
  }

  // ---------- dynamic programming ----------
  function cellsRow(vals, cls) {
    var row = $('div', 'cells');
    vals.forEach(function (v, i) {
      var cell = $('div', 'cell' + (cls[i] ? ' ' + cls[i] : ''));
      cell.append($('div', 'p', ''), $('div', 'c', v === null ? '?' : v), $('div', 'i', i));
      row.append(cell);
    });
    return row;
  }

  function stairsViz(host) {
    return createPlayer(host, {
      fields: [{ key: 'n', label: 'Số bậc n', kind: 'select', value: 8, options: range(1, 16).map(function (x) { return [x, x]; }) }],
      legend: [['#38e8ff', 'ô đang tính'], ['#ffc83d', 'hai ô nguồn']],
      build: function (v) {
        var n = Number(v.n), dp = [], F = [], calls = [1, 1], i;
        for (i = 2; i <= n; i++) calls[i] = 1 + calls[i - 1] + calls[i - 2];
        for (i = 0; i <= n; i++) dp.push(null);
        function snap(o) {
          o.dp = dp.slice();
          o.stats = { 'DP: số phép cộng': Math.max(0, (o.k || 1) - 1), 'Đệ quy thuần: số lần gọi hàm': calls[n] };
          F.push(o);
        }
        snap({ k: 1, text: 'cach[i] = số cách leo tới bậc i. Mỗi lần bước 1 hoặc 2 bậc nên cach[i] = cach[i-1] + cach[i-2].' });
        dp[0] = 1;
        snap({ k: 1, cur: 0, text: 'cach[0] = 1 (đứng yên dưới chân cầu thang là 1 cách)' });
        if (n >= 1) { dp[1] = 1; snap({ k: 1, cur: 1, text: 'cach[1] = 1 (chỉ có cách bước 1 bậc)' }); }
        for (i = 2; i <= n; i++) {
          dp[i] = dp[i - 1] + dp[i - 2];
          snap({ k: i, cur: i, src: [i - 1, i - 2], text: 'cach[' + i + '] = cach[' + (i - 1) + '] + cach[' + (i - 2) + '] = ' + dp[i - 1] + ' + ' + dp[i - 2] + ' = ' + dp[i] });
        }
        F[F.length - 1].text += '. Đáp án: có ' + dp[n] + ' cách leo ' + n + ' bậc.';
        return F;
      },
      render: function (stage, f) {
        stage.innerHTML = '';
        var cls = f.dp.map(function (_, i) { return f.cur === i ? 'cur' : (f.src && f.src.indexOf(i) >= 0 ? 'src' : (f.dp[i] === null ? 'empty' : '')); });
        stage.append(cellsRow(f.dp, cls));
      }
    });
  }

  function coinViz(host) {
    return createPlayer(host, {
      fields: [
        { key: 'coins', label: 'Mệnh giá', value: '1 3 4', size: 14 },
        { key: 'amt', label: 'Số tiền', value: '6', size: 4 }
      ],
      random: function () { return { coins: '1 5 10 25', amt: String(randInt(12, 30)) }; },
      legend: [['#38e8ff', 'ô đang tính'], ['#ffc83d', 'ô nguồn dùng để đạt min']],
      build: function (v) {
        var coins = parseInts(v.coins, { min: 1, max: 5, lo: 1, hi: 50 });
        var amt = parseInts(v.amt, { min: 1, max: 1, lo: 1, hi: 30 })[0];
        var INF = 1e9, dp = [0], from = [-1], F = [], a, i;
        for (a = 1; a <= amt; a++) dp.push(null);
        function disp() { return dp.map(function (x) { return x === INF ? '∞' : x; }); }
        function snap(o) { o.dp = disp(); F.push(o); }
        snap({ text: 'dp[a] = số tờ ít nhất để đổi đúng a đồng. dp[0] = 0. Mệnh giá: ' + coins.join(', ') });
        for (a = 1; a <= amt; a++) {
          var best = INF, bc = -1, cand = [];
          for (i = 0; i < coins.length; i++) {
            if (coins[i] <= a && dp[a - coins[i]] !== INF) {
              cand.push(coins[i] + ': dp[' + (a - coins[i]) + ']+1=' + (dp[a - coins[i]] + 1));
              if (dp[a - coins[i]] + 1 < best) { best = dp[a - coins[i]] + 1; bc = coins[i]; }
            }
          }
          dp[a] = best;
          from[a] = bc;
          snap({ cur: a, src: bc > 0 ? [a - bc] : [], text: 'dp[' + a + ']: ' + (cand.length ? 'thử ' + cand.join('; ') + ' → chọn ' + best + ' (dùng tờ ' + bc + ')' : 'không mệnh giá nào đổi được → ∞') });
        }
        var tail;
        if (dp[amt] === INF) tail = 'Không thể đổi ' + amt + '.';
        else {
          var used = [], x = amt;
          while (x > 0) { used.push(from[x]); x -= from[x]; }
          tail = 'Đáp án: ' + dp[amt] + ' tờ (' + used.join(' + ') + ' = ' + amt + ').';
        }
        F[F.length - 1].text += '. ' + tail;
        return F;
      },
      render: function (stage, f) {
        stage.innerHTML = '';
        var cls = f.dp.map(function (x, i) { return f.cur === i ? 'cur' : (f.src && f.src.indexOf(i) >= 0 ? 'src' : (x === null ? 'empty' : '')); });
        stage.append(cellsRow(f.dp, cls));
      }
    });
  }

  // ---------- Big-O ----------
  function bigoViz(host) {
    var root = $('div', 'viz');
    var bar = $('div', 'viz-bar');
    var lab = $('label', null, 'n =');
    var rg = $('input');
    rg.type = 'range'; rg.min = '1'; rg.max = '60'; rg.value = '30';
    rg.setAttribute('aria-label', 'Kích thước dữ liệu n');
    var out = $('b', null, '');
    bar.append(lab, rg, out);
    var box = $('div', 'growth');
    var cap = $('div', 'caption', 'Kéo thanh trượt để tăng n. Thanh càng dài là số phép tính càng nhiều (thang logarit). Giả sử máy làm 10^8 phép/giây.');
    root.append(bar, box, cap);
    host.append(root);
    function fmt(x) {
      if (x < 1e6) return Math.round(x).toLocaleString('vi-VN');
      return x.toExponential(1).replace('e+', ' × 10^');
    }
    function time(x) {
      var s = x / 1e8;
      if (s < 1e-3) return '< 1 ms';
      if (s < 1) return Math.round(s * 1000) + ' ms';
      if (s < 60) return s.toFixed(1) + ' giây';
      if (s < 86400 * 365) return Math.round(s / 3600 * 10) / 10 + ' giờ';
      return 'hàng nghìn năm+';
    }
    function draw() {
      var t = Number(rg.value);
      var n = Math.round(Math.pow(10, t / 20));   // 1 .. 1000
      out.textContent = n.toLocaleString('vi-VN');
      var rows = [
        ['O(1)', 1], ['O(log n)', Math.log2(n) || 1], ['O(n)', n], ['O(n log n)', n * Math.log2(Math.max(2, n))],
        ['O(n²)', n * n], ['O(2ⁿ)', Math.pow(2, n)]
      ];
      box.innerHTML = '';
      rows.forEach(function (r, i) {
        var ops = r[1];
        var w = Math.min(100, Math.log10(ops + 1) / 12 * 100);
        var row = $('div', 'grow');
        var tr = $('div', 'tr');
        var bar2 = $('i', i >= 4 ? 'hot' : '');
        bar2.style.width = Math.max(2, w) + '%';
        tr.append(bar2);
        row.append($('span', null, r[0]), tr, $('span', null, fmt(ops) + ' · ' + time(ops)));
        box.append(row);
      });
    }
    rg.addEventListener('input', draw);
    draw();
    return { destroy: function () {} };
  }

  // ---------- interactive data-structure widgets ----------
  function seq(host, fns, delay, done) {
    // chạy lần lượt các hàm, mỗi hàm cách nhau delay ms; trả về hàm hủy
    var alive = true, i = 0, tm;
    (function next() {
      if (!alive) return;
      if (i >= fns.length) { if (done) done(); return; }
      fns[i++]();
      tm = setTimeout(next, delay);
    })();
    return function () { alive = false; clearTimeout(tm); };
  }

  function widgetShell(host, buttons, inputDefault) {
    var root = $('div', 'viz');
    var bar = $('div', 'viz-bar');
    var inp = $('input', 'txt');
    inp.type = 'text'; inp.size = 6; inp.value = inputDefault;
    inp.setAttribute('aria-label', 'Giá trị');
    bar.append($('label', null, 'Giá trị'), inp);
    buttons.forEach(function (b) {
      var btn = $('button', 'btn sm', b[0]);
      btn.type = 'button';
      btn.addEventListener('click', function () { b[1](inp.value.trim()); });
      bar.append(btn);
    });
    var stage = $('div', 'stage');
    var log = $('div', 'vlog');
    log.setAttribute('aria-live', 'polite');
    root.append(bar, stage, log);
    host.append(root);
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter' && buttons[0]) buttons[0][1](inp.value.trim()); });
    return { stage: stage, log: log, inp: inp };
  }

  function num(s, log) {
    if (!/^-?\d+$/.test(s)) { log.textContent = '⚠ Hãy nhập một số nguyên.'; return null; }
    return Number(s);
  }

  function stackViz(host) {
    var st = [], MAX = 8, cancel = null;
    var w = widgetShell(host, [
      ['push', function (s) {
        var x = num(s, w.log); if (x === null) return;
        if (st.length >= MAX) { w.log.textContent = 'Stack đầy (tối đa ' + MAX + ' phần tử): không push được. Đây là tràn stack (stack overflow).'; return; }
        st.push(x); draw(true); w.log.textContent = 'push(' + x + '): đặt lên đỉnh. Độ phức tạp O(1).';
      }],
      ['pop', function () {
        if (!st.length) { w.log.textContent = 'Stack rỗng: không pop được (stack underflow).'; return; }
        var x = st.pop(); draw(); w.log.textContent = 'pop() trả về ' + x + ': lấy từ đỉnh ra. Vào sau, ra trước.';
      }],
      ['peek', function () {
        if (!st.length) { w.log.textContent = 'Stack rỗng, không có đỉnh.'; return; }
        w.log.textContent = 'peek() = ' + st[st.length - 1] + ' (chỉ xem, không lấy ra).';
      }],
      ['Xóa hết', function () { st = []; draw(); w.log.textContent = 'Đã làm rỗng stack (top = -1).'; }]
    ], '7');
    function draw(isNew) {
      w.stage.innerHTML = '';
      var box = $('div', 'vstackbox');
      st.forEach(function (x, i) {
        var top = i === st.length - 1;
        box.append($('div', 'sbox' + (top ? ' top' : '') + (top && isNew ? ' new' : ''), x));
      });
      if (!st.length) box.append($('div', 'sbox', '(rỗng)'));
      w.stage.append(box);
      w.stage.append($('div', 'vlog', 'top = ' + (st.length - 1) + '   ·   số phần tử = ' + st.length + '/' + MAX));
    }
    ['3', '8', '5'].forEach(function (x) { st.push(Number(x)); });
    draw();
    w.log.textContent = 'Thử push / pop. Phần tử vào sau luôn ra trước (LIFO).';
    return { destroy: function () { if (cancel) cancel(); } };
  }

  function queueViz(host) {
    var MAX = 6, q = [], front = 0, count = 0;
    for (var z = 0; z < MAX; z++) q.push(null);
    var w = widgetShell(host, [
      ['enqueue', function (s) {
        var x = num(s, w.log); if (x === null) return;
        if (count === MAX) { w.log.textContent = 'Hàng đợi đầy (' + MAX + ' ô).'; return; }
        var pos = (front + count) % MAX;
        q[pos] = x; count++;
        draw();
        w.log.textContent = 'enqueue(' + x + '): ghi vào ô (front + count) % MAX = (' + front + ' + ' + (count - 1) + ') % ' + MAX + ' = ' + pos + '.';
      }],
      ['dequeue', function () {
        if (!count) { w.log.textContent = 'Hàng đợi rỗng.'; return; }
        var x = q[front];
        q[front] = null;
        var old = front;
        front = (front + 1) % MAX; count--;
        draw();
        w.log.textContent = 'dequeue() trả về ' + x + ' (ở ô ' + old + '). front = (' + old + ' + 1) % ' + MAX + ' = ' + front + '. Vào trước, ra trước.';
      }],
      ['Xóa hết', function () { for (var i = 0; i < MAX; i++) q[i] = null; front = 0; count = 0; draw(); w.log.textContent = 'Đã làm rỗng hàng đợi.'; }]
    ], '4');
    function draw() {
      w.stage.innerHTML = '';
      var ring = $('div', 'ring');
      for (var i = 0; i < MAX; i++) {
        var live = count > 0 && ((i - front + MAX) % MAX) < count;
        var isRear = count > 0 && i === (front + count - 1) % MAX;
        var cls = 'cell' + (live ? ' live' : ' empty') + (i === front && count > 0 ? ' front' : '') + (isRear ? ' rear' : '');
        var cell = $('div', cls);
        var tag = [];
        if (i === front && count > 0) tag.push('front');
        if (isRear) tag.push('rear');
        cell.append($('div', 'p', tag.join('/')), $('div', 'c', q[i] === null ? '' : q[i]), $('div', 'i', i));
        ring.append(cell);
      }
      w.stage.append(ring);
      w.stage.append($('div', 'vlog', 'front = ' + front + '   ·   count = ' + count + '/' + MAX + '   ·   ô ghi tiếp theo = ' + ((front + count) % MAX)));
    }
    q[0] = 2; q[1] = 9; count = 2;
    draw();
    w.log.textContent = 'Mảng được dùng như một vòng tròn: sau ô cuối là quay lại ô 0. Hãy enqueue vài lần rồi dequeue để thấy front chạy vòng.';
    return { destroy: function () {} };
  }

  function listViz(host) {
    var items = [4, 7, 12], cancel = null, hl = -1, found = -1;
    var w = widgetShell(host, [
      ['Thêm đầu', function (s) {
        var x = num(s, w.log); if (x === null) return;
        stopAnim(); items.unshift(x); draw(); w.log.textContent = 'themDau(' + x + '): tạo nút mới, cho next trỏ vào head cũ, head = nút mới. O(1).';
      }],
      ['Thêm cuối', function (s) {
        var x = num(s, w.log); if (x === null) return;
        stopAnim();
        var k = items.length, fns = [];
        w.log.textContent = 'themCuoi(' + x + '): phải đi từ head đến nút cuối rồi mới nối vào. O(n).';
        for (var i = 0; i < k; i++) (function (i) { fns.push(function () { hl = i; draw(); }); })(i);
        fns.push(function () { items.push(x); hl = -1; found = items.length - 1; draw(); });
        cancel = seq(host, fns, 380, function () { found = -1; draw(); });
      }],
      ['Xóa giá trị', function (s) {
        var x = num(s, w.log); if (x === null) return;
        stopAnim();
        var fns = [], at = items.indexOf(x), lim = at < 0 ? items.length : at + 1;
        for (var i = 0; i < lim; i++) (function (i) { fns.push(function () { hl = i; draw(); }); })(i);
        fns.push(function () {
          hl = -1;
          if (at < 0) w.log.textContent = 'Không có nút nào chứa ' + x + ': danh sách giữ nguyên.';
          else { items.splice(at, 1); w.log.textContent = 'Đã nối nút trước bỏ qua nút chứa ' + x + ' rồi free nút đó.'; }
          draw();
        });
        cancel = seq(host, fns, 380);
      }],
      ['Tìm', function (s) {
        var x = num(s, w.log); if (x === null) return;
        stopAnim();
        var fns = [], at = items.indexOf(x), lim = at < 0 ? items.length : at + 1;
        for (var i = 0; i < lim; i++) (function (i) { fns.push(function () { hl = i; draw(); }); })(i);
        fns.push(function () {
          hl = -1; found = at; draw();
          w.log.textContent = at < 0 ? 'Duyệt hết đến NULL mà không thấy ' + x + '.' : 'Tìm thấy ' + x + ' ở vị trí ' + at + ' sau ' + (at + 1) + ' bước. O(n).';
        });
        cancel = seq(host, fns, 380, function () { found = -1; draw(); });
      }],
      ['Đảo ngược', function () {
        stopAnim(); items.reverse(); draw(); w.log.textContent = 'daoNguoc(): đổi hướng mọi con trỏ next bằng ba biến prev, cur, next. O(n).';
      }]
    ], '9');
    function stopAnim() { if (cancel) cancel(); cancel = null; hl = -1; found = -1; }
    function draw() {
      w.stage.innerHTML = '';
      w.stage.append($('div', 'lhead', 'head ↓'));
      var box = $('div', 'llist');
      items.forEach(function (x, i) {
        var n = $('div', 'lnode' + (hl === i ? ' hl' : '') + (found === i ? ' found' : ''));
        var b = $('div', 'box');
        b.append($('span', null, x), $('span', null, '•'));
        n.append(b, $('span', 'arr', '→'));
        box.append(n);
      });
      box.append($('span', 'lnode', 'NULL'));
      w.stage.append(box);
    }
    draw();
    w.log.textContent = 'Mỗi nút gồm giá trị và con trỏ next (•). Thử thêm, xóa, tìm: các thao tác phải đi từ head nên mất thời gian O(n).';
    return { destroy: stopAnim };
  }

  function bstViz(host) {
    var root = null, cancel = null, hlSet = {}, foundKey = null, newKey = null, outText = '';
    var w = widgetShell(host, [
      ['Thêm', function (s) {
        var x = num(s, w.log); if (x === null) return;
        stop();
        var path = [], cur = root, dup = false;
        while (cur) { path.push(cur.k); if (x === cur.k) { dup = true; break; } cur = x < cur.k ? cur.l : cur.r; }
        var fns = path.map(function (k) { return function () { hlSet = {}; hlSet[k] = true; draw(); w.log.textContent = 'So sánh ' + x + ' với ' + k + ': ' + (x === k ? 'bằng nhau' : (x < k ? 'nhỏ hơn → đi sang trái' : 'lớn hơn → đi sang phải')); }; });
        fns.push(function () {
          hlSet = {};
          if (dup) { w.log.textContent = x + ' đã có trong cây, không thêm trùng.'; draw(); return; }
          root = insert(root, x); newKey = x; draw();
          w.log.textContent = 'Gặp chỗ trống: tạo nút ' + x + ' ở đây (sau ' + path.length + ' lần so sánh).';
        });
        cancel = seq(host, fns, 480, function () { newKey = null; draw(); });
      }],
      ['Tìm', function (s) {
        var x = num(s, w.log); if (x === null) return;
        stop();
        var path = [], cur = root, ok = false;
        while (cur) { path.push(cur.k); if (x === cur.k) { ok = true; break; } cur = x < cur.k ? cur.l : cur.r; }
        var fns = path.map(function (k) { return function () { hlSet = {}; hlSet[k] = true; draw(); w.log.textContent = 'So sánh ' + x + ' với ' + k + (x === k ? ': bằng nhau' : (x < k ? ': nhỏ hơn → sang trái' : ': lớn hơn → sang phải')); }; });
        fns.push(function () {
          hlSet = {}; foundKey = ok ? x : null; draw();
          w.log.textContent = ok ? 'Tìm thấy ' + x + ' sau ' + path.length + ' lần so sánh (chỉ đi một nhánh: O(chiều cao)).' : 'Đi tới nhánh rỗng: ' + x + ' không có trong cây.';
        });
        cancel = seq(host, fns, 480, function () { foundKey = null; draw(); });
      }],
      ['Duyệt giữa', function () {
        stop();
        var order = [];
        (function go(n) { if (!n) return; go(n.l); order.push(n.k); go(n.r); })(root);
        outText = '';
        var fns = order.map(function (k) { return function () { hlSet = {}; hlSet[k] = true; outText += k + ' '; draw(); w.log.textContent = 'Duyệt giữa (trái → nút → phải): ' + outText + (outText.split(' ').length - 1 === order.length ? '— kết quả luôn tăng dần!' : ''); }; });
        cancel = seq(host, fns, 450, function () { hlSet = {}; draw(); });
      }],
      ['Ngẫu nhiên', function () {
        stop(); root = null;
        randInts(7, 5, 95).forEach(function (x) { root = insert(root, x); });
        draw(); w.log.textContent = 'Đã tạo cây từ 7 số ngẫu nhiên.';
      }],
      ['Xóa hết', function () { stop(); root = null; draw(); w.log.textContent = 'Cây rỗng.'; }]
    ], '45');
    function stop() { if (cancel) cancel(); cancel = null; hlSet = {}; foundKey = null; newKey = null; }
    function insert(n, k) {
      if (!n) return { k: k, l: null, r: null };
      if (k < n.k) n.l = insert(n.l, k); else if (k > n.k) n.r = insert(n.r, k);
      return n;
    }
    function height(n) { return n ? 1 + Math.max(height(n.l), height(n.r)) : 0; }
    function draw() {
      w.stage.innerHTML = '';
      if (!root) { w.stage.append($('div', 'vlog', 'Cây rỗng (root = NULL). Hãy thêm vài số.')); return; }
      var pos = [], idx = 0;
      (function go(n, d) { if (!n) return; go(n.l, d + 1); n.x = idx++; n.d = d; pos.push(n); go(n.r, d + 1); })(root, 0);
      var H = height(root), W = Math.max(300, idx * 46 + 30), SH = H * 62 + 20;
      var svg = '<svg class="tsvg" viewBox="0 0 ' + W + ' ' + SH + '" style="max-width:' + Math.min(W * 1.4, 720) + 'px" role="img" aria-label="Cây nhị phân tìm kiếm">';
      function X(n) { return idx > 1 ? 25 + n.x * (W - 50) / (idx - 1) : W / 2; }
      function Y(n) { return 30 + n.d * 62; }
      pos.forEach(function (n) {
        [n.l, n.r].forEach(function (c) { if (c) svg += '<line class="e" x1="' + X(n) + '" y1="' + Y(n) + '" x2="' + X(c) + '" y2="' + Y(c) + '"/>'; });
      });
      pos.forEach(function (n) {
        var cls = 'n' + (hlSet[n.k] ? ' hl' : '') + (foundKey === n.k ? ' found' : '') + (newKey === n.k ? ' new' : '');
        svg += '<g class="' + cls + '"><circle cx="' + X(n) + '" cy="' + Y(n) + '" r="19"/><text x="' + X(n) + '" y="' + Y(n) + '">' + n.k + '</text></g>';
      });
      svg += '</svg>';
      w.stage.innerHTML = svg;
      w.stage.append($('div', 'vlog', 'Chiều cao cây: ' + H + '   ·   số nút: ' + idx + (outText ? '   ·   duyệt giữa: ' + outText : '')));
    }
    [50, 30, 70, 20, 40, 60, 80].forEach(function (x) { root = insert(root, x); });
    draw();
    w.log.textContent = 'Quy tắc: nhỏ hơn đi trái, lớn hơn đi phải. Thử thêm số mới hoặc tìm một số để xem đường đi.';
    return { destroy: stop };
  }

  function hashViz(host) {
    var SIZE = 11, table = [], cancel = null, hl = -1, okSlot = -1;
    for (var z = 0; z < SIZE; z++) table.push(null);
    var w = widgetShell(host, [
      ['Thêm', function (s) {
        var x = num(s, w.log); if (x === null || x < 0) { w.log.textContent = '⚠ Hãy nhập số nguyên không âm.'; return; }
        stop();
        if (table.indexOf(x) >= 0) { w.log.textContent = x + ' đã có trong bảng.'; return; }
        if (table.every(function (t) { return t !== null; })) { w.log.textContent = 'Bảng đã đầy.'; return; }
        var i = x % SIZE, fns = [], first = i;
        w.log.textContent = 'Băm: ' + x + ' % ' + SIZE + ' = ' + first + '.';
        while (table[i] !== null) { (function (i) { fns.push(function () { hl = i; draw(); w.log.textContent = 'Ô ' + i + ' đã bị chiếm (va chạm) → dò tuyến tính sang ô ' + ((i + 1) % SIZE); }); })(i); i = (i + 1) % SIZE; }
        (function (i) {
          fns.push(function () { hl = i; draw(); w.log.textContent = 'Ô ' + i + ' còn trống → đặt ' + x + ' vào đây' + (i === first ? ' (không va chạm)' : ' (sau ' + ((i - first + SIZE) % SIZE) + ' lần dò)') + '.'; });
          fns.push(function () { table[i] = x; hl = -1; okSlot = i; draw(); });
        })(i);
        cancel = seq(host, fns, 560, function () { okSlot = -1; draw(); });
      }],
      ['Tìm', function (s) {
        var x = num(s, w.log); if (x === null || x < 0) { w.log.textContent = '⚠ Hãy nhập số nguyên không âm.'; return; }
        stop();
        var i = x % SIZE, fns = [], steps = 0, hit = -1;
        w.log.textContent = 'Băm: ' + x + ' % ' + SIZE + ' = ' + i + '.';
        while (table[i] !== null && steps < SIZE) {
          (function (i) { fns.push(function () { hl = i; draw(); w.log.textContent = 'Xét ô ' + i + ': ' + (table[i] === x ? 'bằng ' + x + ' → tìm thấy' : 'chứa ' + table[i] + ' ≠ ' + x + ', dò tiếp'); }); })(i);
          if (table[i] === x) { hit = i; break; }
          i = (i + 1) % SIZE; steps++;
        }
        fns.push(function () { hl = -1; okSlot = hit; draw(); w.log.textContent = hit >= 0 ? 'Tìm thấy ' + x + ' ở ô ' + hit + '.' : 'Gặp ô trống (hoặc quay hết vòng): ' + x + ' không có trong bảng.'; });
        cancel = seq(host, fns, 560, function () { okSlot = -1; draw(); });
      }],
      ['Xóa hết', function () { stop(); for (var i = 0; i < SIZE; i++) table[i] = null; draw(); w.log.textContent = 'Đã làm rỗng bảng.'; }]
    ], '23');
    function stop() { if (cancel) cancel(); cancel = null; hl = -1; okSlot = -1; }
    function draw() {
      w.stage.innerHTML = '';
      var cells = $('div', 'cells');
      table.forEach(function (x, i) {
        var cls = 'cell' + (x === null ? ' empty' : '') + (hl === i ? ' mid' : '') + (okSlot === i ? ' found' : '');
        var cell = $('div', cls);
        cell.append($('div', 'p', ''), $('div', 'c', x === null ? '' : x), $('div', 'i', i));
        cells.append(cell);
      });
      w.stage.append(cells);
      var used = table.filter(function (t) { return t !== null; }).length;
      w.stage.append($('div', 'vlog', 'Hàm băm h(k) = k % ' + SIZE + '   ·   đã dùng ' + used + '/' + SIZE + ' ô (hệ số tải ' + (used / SIZE).toFixed(2) + ')'));
    }
    [12, 23, 34, 5].forEach(function (x) {
      var i = x % SIZE;
      while (table[i] !== null) i = (i + 1) % SIZE;
      table[i] = x;
    });
    draw();
    w.log.textContent = 'Thử thêm 1, 12, 23 (đều có k % 11 = 1) để thấy va chạm và dò tuyến tính.';
    return { destroy: stop };
  }

  // ---------- registry & mount ----------
  var REG = {
    bubble: ['Nổi bọt', sortViz('bubble', '5 1 4 2 8 3')],
    selection: ['Chọn', sortViz('selection', '64 25 12 22 11 90')],
    insertion: ['Chèn', sortViz('insertion', '9 4 7 1 8 2')],
    merge: ['Trộn', sortViz('merge', '38 27 43 3 9 82 10')],
    quick: ['Nhanh', sortViz('quick', '10 80 30 90 40 50 70 20')],
    search: ['Tìm kiếm', searchViz],
    hanoi: ['Tháp Hà Nội', hanoiViz],
    factorial: ['Ngăn xếp lời gọi', factorialViz],
    graph: ['BFS / DFS', graphViz],
    stairs: ['Leo cầu thang', stairsViz],
    coin: ['Đổi tiền', coinViz],
    bigo: ['Tốc độ tăng', bigoViz],
    stack: ['Stack', stackViz],
    queue: ['Queue vòng', queueViz],
    linkedlist: ['Danh sách liên kết', listViz],
    bst: ['Cây BST', bstViz],
    hash: ['Bảng băm', hashViz]
  };

  var MAP = {
    b1: ['bigo'], b2: ['linkedlist'], b3: ['stack'], b4: ['queue'], b5: ['bst'], b6: ['hash'],
    c1: ['hanoi', 'factorial'], c2: ['search'], c3: ['bubble', 'selection'], c4: ['insertion'],
    c5: ['merge'], c6: ['quick'], c7: ['graph'], c8: ['stairs', 'coin']
  };

  function mount(host, names) {
    var cur = null;
    var tabs = $('div', 'viz-tabs');
    var body = $('div');
    function show(name, btn) {
      if (cur && cur.destroy) cur.destroy();
      body.innerHTML = '';
      cur = REG[name][1](body);
      Array.prototype.forEach.call(tabs.children, function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
    }
    if (names.length > 1) {
      names.forEach(function (nm, i) {
        var b = $('button', null, REG[nm][0]);
        b.type = 'button';
        b.addEventListener('click', function () { show(nm, b); });
        tabs.append(b);
      });
      host.append(tabs);
    }
    host.append(body);
    show(names[0], tabs.children[0]);
    return { destroy: function () { if (cur && cur.destroy) cur.destroy(); } };
  }

  window.VIZ = { MAP: MAP, REG: REG, mount: mount, _frames: { sort: sortFrames, merge: mergeFrames, quick: quickFrames } };
})();
