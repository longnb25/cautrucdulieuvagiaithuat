// Bổ sung nhiều test cho các bài tập ở phần A, B, C.
// Kết quả mong đợi được tính bằng cài đặt JavaScript độc lập với lời giải C.
(function () {
  'use strict';
  var T = window.TESTGEN, mk = T.mk, ints = T.ints;
  var extra = {};
  function add(id, ref, inputs) { extra[id] = { ref: ref, inputs: inputs }; }
  function join(a) { return a.join(' '); }
  function sorted(a, desc) { return a.slice().sort(function (x, y) { return desc ? y - x : x - y; }); }
  function arrCase(g, n, lo, hi) { return n + '\n' + join(g.arr(n, lo, hi)); }

  // a3: chu vi / diện tích
  add('a3', function (s) {
    var r = parseFloat(s);
    return 'Chu vi: ' + (2 * 3.14159 * r).toFixed(2) + '\nDien tich: ' + (3.14159 * r * r).toFixed(2);
  }, ['0', '1.5', '3', '10', '7.25', '0.1', '12.5', '100', '2.75']);

  // a4: chẵn / lẻ
  add('a4', function (s) { return ints(s)[0] % 2 === 0 ? 'chan' : 'le'; },
    ['2', '1', '-1', '-2', '13', '100', '99', '-8', '1000', '2147483647', '-2147483647']);

  // a5: tổng các số lẻ từ 1 đến n
  add('a5', function (s) { var n = ints(s)[0], k = Math.ceil(n / 2); return String(k * k); },
    ['2', '3', '4', '6', '7', '20', '99', '50', '1000', '2']);

  // a6: giai thừa
  add('a6', function (s) { var n = ints(s)[0], r = 1, i; for (i = 2; i <= n; i++) r *= i; return String(r); },
    ['1', '2', '3', '4', '7', '8', '9', '11', '12']);

  // a7: max / min
  (function () {
    var g = mk(301), inputs = ['2\n5 5', '3\n1 2 3', '3\n3 2 1', '2\n-1 1'], t;
    for (t = 0; t < 7; t++) inputs.push(arrCase(g, g.int(1, 30), -100, 100));
    add('a7', function (s) { var v = ints(s), a = v.slice(1, 1 + v[0]); return 'Max: ' + Math.max.apply(null, a) + '\nMin: ' + Math.min.apply(null, a); }, inputs);
  })();

  // a8: đảo ngược chuỗi
  (function () {
    var g = mk(302), inputs = ['z', 'ab', 'level', 'programming', 'abcdefghijklmnopqrstuvwxyz'], t, i;
    for (t = 0; t < 6; t++) { var n = g.int(1, 25), w = ''; for (i = 0; i < n; i++) w += String.fromCharCode(97 + g.int(0, 25)); inputs.push(w); }
    add('a8', function (s) { return s.trim().split('').reverse().join(''); }, inputs);
  })();

  // a9: nhân đôi
  add('a9', function (s) { return String(ints(s)[0] * 2); },
    ['1', '2', '100', '-100', '999999', '-1', '7', '1000000000']);

  // a10: sinh viên điểm cao nhất (điểm đôi một khác nhau)
  (function () {
    var g = mk(303), inputs = [], t, i;
    for (t = 0; t < 9; t++) {
      var used = {}, lines = [];
      for (i = 0; i < 3; i++) {
        var sc; do { sc = g.int(0, 100); } while (used[sc]); used[sc] = 1;
        var nm = ''; var k = g.int(2, 6), j; for (j = 0; j < k; j++) nm += String.fromCharCode(97 + g.int(0, 25));
        lines.push(nm + ' ' + (sc / 10));
      }
      inputs.push(lines.join('\n'));
    }
    add('a10', function (s) {
      var w = s.trim().split(/\s+/), best = -1, name = '', i;
      for (i = 0; i < 3; i++) { var v = parseFloat(w[2 * i + 1]); if (v > best) { best = v; name = w[2 * i]; } }
      return name;
    }, inputs);
  })();

  // a11 và b2: in / đảo ngược danh sách
  (function () {
    var g = mk(304), inputs = ['2\n1 2', '3\n-5 0 5', '2\n8 8'], t;
    for (t = 0; t < 7; t++) inputs.push(arrCase(g, g.int(1, 20), -99, 99));
    function rev(s) { var v = ints(s); return v.slice(1, 1 + v[0]).reverse().join(' '); }
    add('a11', rev, inputs);
    add('b2', rev, inputs);
  })();

  // b1: số lần chia đôi
  add('b1', function (s) { var n = ints(s)[0], c = 0; while (n > 1) { n = Math.floor(n / 2); c++; } return String(c); },
    ['2', '3', '4', '5', '7', '9', '16', '17', '31', '32', '100', '1023', '1024', '65536', '999999999']);

  // b3: dãy ngoặc
  (function () {
    var g = mk(305), inputs = ['()', '(', ')', '[]{}()', '{[(])}', '((()))', '(()', '())(', '{[()()]}'], t;
    var pairs = [['(', ')'], ['[', ']'], ['{', '}']];
    function bal(len) {
      var s = '', st = [], i;
      for (i = 0; i < len; i++) {
        if (st.length && (g.f() < 0.5 || st.length >= len - i)) s += st.pop();
        else { var p = g.pick(pairs); s += p[0]; st.push(p[1]); }
      }
      while (st.length) s += st.pop();
      return s;
    }
    for (t = 0; t < 10; t++) {
      var s = bal(g.int(2, 14));
      if (t % 2 === 1) { var i = g.int(0, s.length - 1); s = g.f() < 0.5 ? s.slice(0, i) + s.slice(i + 1) : s.slice(0, i) + g.pick(['(', ')', '[', ']', '{', '}']) + s.slice(i + 1); }
      if (!s) s = '(';
      inputs.push(s);
    }
    add('b3', function (x) {
      var st = [], m = { ')': '(', ']': '[', '}': '{' }, i, c;
      x = x.trim();
      for (i = 0; i < x.length; i++) {
        c = x[i];
        if ('([{'.indexOf(c) >= 0) st.push(c);
        else { if (!st.length || st.pop() !== m[c]) return 'khong hop le'; }
      }
      return st.length ? 'khong hop le' : 'hop le';
    }, inputs);
  })();

  // b4: hàng đợi
  (function () {
    var g = mk(306), inputs = ['1\n2', '3\n1 5\n2\n2', '4\n1 1\n1 2\n2\n2'], t;
    for (t = 0; t < 8; t++) {
      var q = g.int(5, 30), lines = [], i;
      for (i = 0; i < q; i++) lines.push(g.f() < 0.55 ? '1 ' + g.int(-50, 50) : '2');
      inputs.push(q + '\n' + lines.join('\n'));
    }
    add('b4', function (s) {
      var w = s.trim().split(/\s+/).map(Number), q = w[0], p = 1, qu = [], out = [], i;
      for (i = 0; i < q; i++) {
        if (w[p] === 1) { qu.push(w[p + 1]); p += 2; } else { p += 1; out.push(qu.length ? String(qu.shift()) : 'rong'); }
      }
      return out.join('\n');
    }, inputs);
  })();

  // b5: chiều cao BST
  (function () {
    var g = mk(307), inputs = ['2\n5 5', '3\n3 2 1', '5\n3 1 2 5 4', '6\n4 2 6 1 3 5'], t;
    for (t = 0; t < 8; t++) inputs.push(arrCase(g, g.int(1, 30), 1, 100));
    add('b5', function (s) {
      var v = ints(s), root = null;
      function ins(n, k) { if (!n) return { k: k, l: null, r: null }; if (k < n.k) n.l = ins(n.l, k); else if (k > n.k) n.r = ins(n.r, k); return n; }
      function h(n) { return n ? 1 + Math.max(h(n.l), h(n.r)) : 0; }
      v.slice(1, 1 + v[0]).forEach(function (k) { root = ins(root, k); });
      return String(h(root));
    }, inputs);
  })();

  // b6: có phần tử trùng không (kể cả các số đồng dư modulo 101)
  (function () {
    var g = mk(308), inputs = ['2\n0 0', '2\n0 101', '3\n5 106 207', '4\n100 201 302 100'], t;
    for (t = 0; t < 8; t++) {
      var n = g.int(5, 100), a = [], used = {};
      while (a.length < n) { var x = g.f() < 0.5 ? g.int(0, 9999) : 101 * g.int(0, 90) + g.int(0, 3); if (!used[x]) { used[x] = 1; a.push(x); } }
      if (t % 2 === 0) a[g.int(0, n - 1)] = a[g.int(0, n - 1)];
      inputs.push(n + '\n' + join(a));
    }
    add('b6', function (s) {
      var v = ints(s), a = v.slice(1, 1 + v[0]), seen = {}, i;
      for (i = 0; i < a.length; i++) { if (seen[a[i]]) return 'co trung'; seen[a[i]] = 1; }
      return 'khong trung';
    }, inputs);
  })();

  // c1: tổng chữ số
  add('c1', function (s) { var n = ints(s)[0], r = 0; while (n > 0) { r += n % 10; n = Math.floor(n / 10); } return String(r); },
    ['1', '10', '99', '100', '101', '12345', '90909', '987654321', '2147483647', '1000000000']);

  // c2: tìm nhị phân (mảng gồm các số đôi một khác nhau)
  (function () {
    var g = mk(309), inputs = ['1\n5\n6', '2\n1 2\n2', '3\n1 3 5\n0'], t;
    for (t = 0; t < 9; t++) {
      var n = g.int(1, 40), used = {}, a = [];
      while (a.length < n) { var x = g.int(-100, 100); if (!used[x]) { used[x] = 1; a.push(x); } }
      a.sort(function (p, q) { return p - q; });
      var x2 = t % 2 === 0 ? g.pick(a) : g.int(-120, 120);
      inputs.push(n + '\n' + join(a) + '\n' + x2);
    }
    add('c2', function (s) { var v = ints(s), n = v[0]; return String(v.slice(1, 1 + n).indexOf(v[1 + n])); }, inputs);
  })();

  // c3, c4, c6: sắp xếp
  (function () {
    var g = mk(310), inputs = ['2\n2 1', '3\n1 2 3', '3\n3 2 1', '4\n5 5 5 5'], t;
    for (t = 0; t < 8; t++) inputs.push(arrCase(g, g.int(2, 40), -100, 100));
    add('c3', function (s) { var v = ints(s); return join(sorted(v.slice(1, 1 + v[0]))); }, inputs);
    add('c4', function (s) { var v = ints(s); return join(sorted(v.slice(1, 1 + v[0]), true)); }, inputs);
    add('c6', function (s) { var v = ints(s); return join(sorted(v.slice(1, 1 + v[0]))); }, inputs.concat(['30\n' + join(Array.apply(null, Array(30)).map(function (_, i) { return i; })), '30\n' + join(Array.apply(null, Array(30)).map(function (_, i) { return 30 - i; }))]));
  })();

  // c5: trộn hai mảng đã sắp xếp
  (function () {
    var g = mk(311), inputs = ['1\n1\n1\n1', '2\n1 5\n1\n3', '1\n9\n3\n1 2 3'], t;
    for (t = 0; t < 8; t++) {
      var n = g.int(1, 20), m = g.int(1, 20);
      inputs.push(n + '\n' + join(sorted(g.arr(n, -50, 50))) + '\n' + m + '\n' + join(sorted(g.arr(m, -50, 50))));
    }
    add('c5', function (s) {
      var v = ints(s), n = v[0], a = v.slice(1, 1 + n), m = v[1 + n], b = v.slice(2 + n, 2 + n + m);
      return join(sorted(a.concat(b)));
    }, inputs);
  })();

  // c7: số thành phần liên thông
  (function () {
    var g = mk(312), inputs = ['1 0', '2 1\n0 1', '5 4\n0 1\n1 2\n2 3\n3 4', '6 0'], t;
    for (t = 0; t < 8; t++) {
      var n = g.int(3, 20), m = g.int(0, n + 2), lines = [], i;
      for (i = 0; i < m; i++) { var u = g.int(0, n - 1), w = g.int(0, n - 1); if (u !== w) lines.push(u + ' ' + w); }
      inputs.push(n + ' ' + lines.length + (lines.length ? '\n' + lines.join('\n') : ''));
    }
    add('c7', function (s) {
      var v = ints(s), n = v[0], m = v[1], par = [], i;
      for (i = 0; i < n; i++) par.push(i);
      function find(x) { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; }
      for (i = 0; i < m; i++) par[find(v[2 + 2 * i])] = find(v[3 + 2 * i]);
      var cnt = 0;
      for (i = 0; i < n; i++) if (find(i) === i) cnt++;
      return String(cnt);
    }, inputs);
  })();

  // c8: leo cầu thang
  add('c8', function (s) { var n = ints(s)[0], a = 1, b = 1, i, t; for (i = 2; i <= n; i++) { t = a + b; a = b; b = t; } return String(b); },
    ['3', '4', '6', '7', '8', '9', '15', '20', '35', '40']);

  // ---- ghép vào danh sách test của từng bài ----
  window.LESSONS.forEach(function (L) {
    var e = extra[L.id];
    if (!e || !L.ex) return;
    var seen = {};
    L.ex.tests.forEach(function (t) { seen[t.input] = 1; });
    e.inputs.forEach(function (inp) {
      if (inp.charAt(inp.length - 1) !== '\n') inp += '\n';
      if (seen[inp]) return;
      seen[inp] = 1;
      L.ex.tests.push({ input: inp, expected: e.ref(inp) });
    });
  });
})();
