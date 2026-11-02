(function () {
  'use strict';

  var LESSONS = window.LESSONS;
  var byId = {};
  LESSONS.forEach(function (l, i) { l.index = i; byId[l.id] = l; });
  var GROUPS = [];
  LESSONS.forEach(function (l) { if (GROUPS.indexOf(l.group) < 0) GROUPS.push(l.group); });

  var GROUP_INTRO = {
    'A. Nhập môn C': 'Cú pháp C từ con số 0: biến, rẽ nhánh, vòng lặp, hàm, mảng, chuỗi, con trỏ, struct, cấp phát động.',
    'B. Cấu trúc dữ liệu': 'Cách tổ chức dữ liệu: danh sách liên kết, ngăn xếp, hàng đợi, cây tìm kiếm, bảng băm.',
    'C. Giải thuật': 'Đệ quy, tìm kiếm, các thuật toán sắp xếp, duyệt đồ thị và quy hoạch động.'
  };

  // ---------- helpers ----------
  var store = {
    get: function (k, d) {
      try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; }
    },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* bỏ qua */ } },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) { /* bỏ qua */ } }
  };

  function h(tag, props, children) {
    var e = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (k) {
        var v = props[k];
        if (k === 'class') e.className = v;
        else if (k === 'html') e.innerHTML = v;
        else if (k === 'text') e.textContent = v;
        else if (k.indexOf('on') === 0) e.addEventListener(k.slice(2), v);
        else e.setAttribute(k, v);
      });
    }
    (children || []).forEach(function (c) { if (c) e.append(c); });
    return e;
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  var done = new Set();
  try { done = new Set(JSON.parse(store.get('done', '[]'))); } catch (e) { done = new Set(); }

  function markDone(id) {
    if (done.has(id)) return;
    done.add(id);
    store.set('done', JSON.stringify(Array.from(done)));
    renderNav();
  }

  // ---------- editor ----------
  var TAB = '    ';

  function insertText(ta, text) {
    ta.focus();
    if (!document.execCommand || !document.execCommand('insertText', false, text)) {
      ta.setRangeText(text, ta.selectionStart, ta.selectionEnd, 'end');
      ta.dispatchEvent(new Event('input'));
    }
  }

  function createEditor(opts) {
    var key = 'code:' + opts.key;
    var saved = store.get(key, null);
    var inputKey = 'stdin:' + opts.key;

    var ta = h('textarea', {
      class: 'code', spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off',
      autocorrect: 'off', wrap: 'off', 'aria-label': opts.label || 'Mã nguồn C'
    });
    ta.value = saved !== null ? saved : opts.code;
    var gutter = h('div', { class: 'gutter', 'aria-hidden': 'true' });
    var editor = h('div', { class: 'editor' }, [gutter, ta]);

    function refresh() {
      var lines = ta.value.split('\n').length;
      var nums = [];
      for (var i = 1; i <= lines; i++) nums.push(i);
      gutter.textContent = nums.join('\n');
      var visible = Math.min(Math.max(lines, 8), 30);
      var px = visible * 21 + 24;
      ta.style.height = px + 'px';
      gutter.style.height = px + 'px';
    }
    ta.addEventListener('input', function () { refresh(); store.set(key, ta.value); });
    ta.addEventListener('scroll', function () { gutter.scrollTop = ta.scrollTop; });
    ta.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        run();
        return;
      }
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        insertText(ta, TAB);
        return;
      }
      if (e.key === 'Enter' && !e.shiftKey && !e.altKey && ta.selectionStart === ta.selectionEnd) {
        // Giữ thụt lề của dòng trước, thụt thêm một cấp sau dấu {
        var pos = ta.selectionStart;
        var before = ta.value.slice(0, pos);
        var line = before.slice(before.lastIndexOf('\n') + 1);
        var indent = /^[ \t]*/.exec(line)[0];
        var trimmed = line.replace(/\s+$/, '');
        var extra = trimmed.charAt(trimmed.length - 1) === '{' ? TAB : '';
        var after = ta.value.charAt(pos);
        e.preventDefault();
        if (extra && after === '}') insertText(ta, '\n' + indent + extra + '\n' + indent);
        else insertText(ta, '\n' + indent + extra);
        if (extra && after === '}') {
          var back = ta.selectionStart - (indent.length + 1);
          ta.selectionStart = ta.selectionEnd = back;
        }
      }
    });

    var stdin = h('textarea', { class: 'stdin', spellcheck: 'false', rows: '3', 'aria-label': 'Dữ liệu nhập cho chương trình' });
    var savedIn = store.get(inputKey, null);
    stdin.value = savedIn !== null ? savedIn : (opts.input || '');
    stdin.addEventListener('input', function () { store.set(inputKey, stdin.value); });

    var out = h('pre', { class: 'out empty', 'aria-live': 'polite' });
    out.textContent = 'Kết quả chương trình sẽ hiện ở đây.';

    var runBtn = h('button', { class: 'btn primary', type: 'button', onclick: function () { run(); } });
    runBtn.textContent = '▶ Chạy';
    var resetBtn = h('button', {
      class: 'btn', type: 'button',
      onclick: function () {
        if (!confirm('Đặt lại mã về bản ban đầu? Phần bạn đã sửa sẽ mất.')) return;
        ta.value = opts.code;
        stdin.value = opts.input || '';
        store.del(key);
        store.del(inputKey);
        refresh();
      }
    });
    resetBtn.textContent = 'Đặt lại';
    var toolbar = h('div', { class: 'toolbar' }, [
      runBtn, resetBtn, h('span', { class: 'hint', text: 'Ctrl + Enter để chạy' })
    ]);

    function show(text, cls) {
      out.className = 'out' + (cls ? ' ' + cls : '');
      out.innerHTML = '';
      out.append(text);
    }

    var running = false;
    function run() {
      if (running) return Promise.resolve(null);
      running = true;
      runBtn.disabled = true;
      runBtn.textContent = 'Đang chạy…';
      show('Đang chạy…', 'empty');
      return window.CRunner.run(ta.value, stdin.value, { timeoutMs: 5000 }).then(function (r) {
        running = false;
        runBtn.disabled = false;
        runBtn.textContent = '▶ Chạy';
        renderResult(r);
        return r;
      });
    }

    function renderResult(r) {
      var text = window.CRunner.prettify(r.output);
      out.className = 'out';
      out.innerHTML = '';
      if (text) {
        var isErr = /file\.c:\d+:\d+|is not defined/.test(text);
        if (isErr) {
          var span = h('span', { class: 'err' });
          span.textContent = text;
          out.append(span);
        } else {
          out.append(text);
        }
      } else if (!r.timedOut && !r.limited && !r.failed) {
        out.className = 'out empty';
        out.append('(chương trình không in gì)');
      }
      if (r.timedOut) {
        out.append(h('div', { class: 'sys', text: (text ? '\n' : '') + '⏱ Chạy quá 5 giây nên đã bị dừng. Có thể vòng lặp không kết thúc, hoặc chương trình đang chờ thêm dữ liệu nhập.' }));
      }
      if (r.limited) {
        out.append(h('div', { class: 'sys', text: (text ? '\n' : '') + '⚠ Kết quả in ra quá dài nên chương trình đã bị dừng.' }));
      }
    }

    refresh();
    var el = h('div', { class: 'runner' }, [
      toolbar, editor,
      h('label', { class: 'field-label', text: 'Dữ liệu nhập (bàn phím của chương trình, dùng cho scanf)' }),
      stdin, out
    ]);
    return {
      el: el, ta: ta, stdin: stdin, run: run,
      getCode: function () { return ta.value; },
      setStdin: function (s) { stdin.value = s; store.set(inputKey, s); }
    };
  }

  // ---------- grading ----------
  function createExercise(lesson) {
    var ex = lesson.ex;
    var ed = createEditor({
      key: lesson.id + ':ex', code: ex.starter, input: ex.tests[0].input,
      label: 'Mã bài tập'
    });
    var results = h('div', { class: 'results' });
    var summary = h('div');
    var gradeBtn = h('button', { class: 'btn', type: 'button' });
    gradeBtn.textContent = '✔ Chấm bài';
    var busy = false;

    gradeBtn.addEventListener('click', function () {
      if (busy) return;
      busy = true;
      gradeBtn.disabled = true;
      gradeBtn.textContent = 'Đang chấm…';
      results.innerHTML = '';
      summary.innerHTML = '';
      var code = ed.getCode();
      var passed = 0;
      var chain = Promise.resolve();
      ex.tests.forEach(function (t, i) {
        chain = chain.then(function () {
          var row = h('div', { class: 'res' }, [h('b', { text: 'Test ' + (i + 1) + ': đang chạy…' })]);
          results.append(row);
          return window.CRunner.run(code, t.input, { timeoutMs: 4000 }).then(function (r) {
            var got = window.CRunner.prettify(r.output);
            var ok = !r.timedOut && !r.limited &&
              window.CRunner.normalize(got) === window.CRunner.normalize(t.expected);
            if (ok) passed++;
            row.className = 'res ' + (ok ? 'pass' : 'fail');
            row.innerHTML = '';
            row.append(h('b', { text: 'Test ' + (i + 1) + (ok ? ': đạt ✓' : ': chưa đúng ✗') }));
            if (!ok) {
              row.append(h('div', { class: 'cap', text: 'Dữ liệu vào' }));
              row.append(h('pre', { text: t.input.replace(/\n$/, '') || '(trống)' }));
              row.append(h('div', { class: 'cap', text: 'Kết quả mong đợi' }));
              row.append(h('pre', { text: t.expected }));
              row.append(h('div', { class: 'cap', text: 'Chương trình của bạn in ra' }));
              var msg = got || '(không in gì)';
              if (r.timedOut) msg += '\n⏱ chạy quá lâu, đã dừng';
              row.append(h('pre', { text: msg }));
            }
          });
        });
      });
      chain.then(function () {
        busy = false;
        gradeBtn.disabled = false;
        gradeBtn.textContent = '✔ Chấm bài';
        var all = passed === ex.tests.length;
        summary.className = 'summary ' + (all ? 'ok' : 'no');
        summary.textContent = all
          ? '🎉 Đạt cả ' + ex.tests.length + '/' + ex.tests.length + ' test. Bài này hoàn thành!'
          : 'Đạt ' + passed + '/' + ex.tests.length + ' test. Đọc phần so sánh bên trên rồi sửa lại nhé.';
        if (all) {
          markDone(lesson.id);
          var badge = document.getElementById('exBadge');
          if (badge) { badge.className = 'badge ok'; badge.textContent = 'Đã hoàn thành'; }
        }
      });
    });
    ed.el.querySelector('.toolbar').insertBefore(gradeBtn, ed.el.querySelector('.hint'));

    var hint = h('details', { class: 'reveal' }, [
      h('summary', { text: '💡 Gợi ý' }),
      h('p', { text: ex.hint })
    ]);
    var sol = h('details', { class: 'reveal' }, [
      h('summary', { text: '🔓 Xem lời giải (hãy tự thử trước)' }),
      h('pre', { text: ex.solution })
    ]);
    return h('div', null, [
      h('p', { class: 'ex-text', html: ex.text + ' <i>Không in thêm lời nhắc nhập, chỉ in đúng kết quả.</i>' }),
      ed.el, summary, results, hint, sol
    ]);
  }

  // ---------- views ----------
  function pageLesson(id) {
    var l = byId[id];
    var prev = LESSONS[l.index - 1];
    var next = LESSONS[l.index + 1];
    var page = h('article', { class: 'page' });
    page.append(h('div', { class: 'crumb', text: l.group }));
    page.append(h('h1', { text: l.title }));
    page.append(h('div', { class: 'prose', html: l.html }));

    var tryCard = h('section', { class: 'card' }, [
      h('h2', { text: 'Chạy thử' }),
      createEditor({ key: l.id, code: l.code, input: l.input || '', label: 'Mã ví dụ' }).el
    ]);
    page.append(tryCard);

    if (l.ex) {
      var badge = h('span', { id: 'exBadge', class: done.has(l.id) ? 'badge ok' : 'badge', text: done.has(l.id) ? 'Đã hoàn thành' : 'Bài tập' });
      page.append(h('section', { class: 'card' }, [
        h('h2', null, ['Tự làm ', badge]),
        createExercise(l)
      ]));
    }

    var pager = h('nav', { class: 'pager', 'aria-label': 'Chuyển bài' });
    if (prev) pager.append(h('a', { class: 'prev', href: '#/lesson/' + prev.id }, [h('small', { text: '← Bài trước' }), prev.title]));
    if (next) pager.append(h('a', { class: 'next', href: '#/lesson/' + next.id }, [h('small', { text: 'Bài tiếp →' }), next.title]));
    page.append(pager);
    document.title = l.title + ' · Học C và CTDL';
    return page;
  }

  function pagePlay() {
    var page = h('article', { class: 'page' });
    page.append(h('div', { class: 'crumb', text: 'Sân chơi' }));
    page.append(h('h1', { text: 'Thử nghiệm tự do' }));
    page.append(h('p', { text: 'Viết bất kỳ chương trình C nào và chạy ngay. Mã được lưu tự động trong trình duyệt này.' }));
    var starter = String.raw`#include <stdio.h>

int main() {
    printf("Xin chào!\n");
    return 0;
}
`;
    page.append(h('section', { class: 'card' }, [
      createEditor({ key: 'play', code: starter, input: '', label: 'Mã tự do' }).el
    ]));
    document.title = 'Sân chơi · Học C và CTDL';
    return page;
  }

  function nextUnfinished() {
    for (var i = 0; i < LESSONS.length; i++) if (!done.has(LESSONS[i].id)) return LESSONS[i];
    return null;
  }

  function pageHome() {
    var page = h('article', { class: 'page' });
    var nxt = nextUnfinished();
    var started = done.size > 0;
    var cta;
    if (nxt) {
      cta = h('a', { class: 'btn primary', href: '#/lesson/' + nxt.id }, [
        document.createTextNode(started ? 'Tiếp tục: ' + nxt.title : 'Bắt đầu bài 1')
      ]);
    } else {
      cta = h('span', { class: 'badge ok', text: 'Bạn đã hoàn thành tất cả bài tập 🎉' });
    }
    page.append(h('section', { class: 'hero' }, [
      h('h1', { text: 'Học lại C, cấu trúc dữ liệu và giải thuật từ đầu' }),
      h('p', { text: 'Mỗi bài có lý thuyết ngắn, ví dụ chạy được ngay trên trang, và một bài tập tự chấm điểm. Không cần cài gì, mọi thứ chạy trong trình duyệt của bạn.' }),
      h('div', null, [cta, h('a', { class: 'btn', href: '#/play' }, [document.createTextNode('Sân chơi tự do')])])
    ]));

    var grid = h('div', { class: 'group-grid' });
    GROUPS.forEach(function (g) {
      var items = LESSONS.filter(function (l) { return l.group === g; });
      var ol = h('ol');
      items.forEach(function (l) {
        ol.append(h('li', { class: done.has(l.id) ? 'done' : '' }, [h('a', { href: '#/lesson/' + l.id, text: l.title })]));
      });
      var count = items.filter(function (l) { return done.has(l.id); }).length;
      grid.append(h('div', { class: 'group-card' }, [
        h('h3', { text: g }),
        h('p', { text: (GROUP_INTRO[g] || '') + ' (' + count + '/' + items.length + ' bài)' }),
        ol
      ]));
    });
    page.append(grid);

    page.append(h('details', { class: 'card about' }, [
      h('summary', { text: 'Về trình chạy C trên trang này' }),
      h('ul', { html:
        '<li>Code được chạy bằng <b>PicoC</b>, một bộ thông dịch C nhỏ biên dịch sang WebAssembly. Mã của bạn chạy ngay trong trình duyệt và không được gửi đi đâu.</li>' +
        '<li>PicoC không phải trình biên dịch đầy đủ như gcc: hỗ trợ phần lớn C cơ bản (con trỏ, struct, malloc, đệ quy…) nhưng có vài khác biệt. Ví dụ với số thực nên dùng <code>double</code> và đọc bằng <code>%lf</code>.</li>' +
        '<li>Mỗi lần chạy giới hạn 5 giây để tránh treo vì vòng lặp vô hạn.</li>' +
        '<li>Dữ liệu cho <code>scanf</code> gõ vào ô “Dữ liệu nhập” bên dưới trình soạn thảo.</li>' +
        '<li>Tiến độ và mã bạn viết được lưu trong trình duyệt này (localStorage).</li>'
      })
    ]));
    document.title = 'Học C và Cấu trúc dữ liệu';
    return page;
  }

  // ---------- navigation ----------
  var sidebar = document.getElementById('sidebar');
  var main = document.getElementById('main');
  var current = '';

  function renderNav() {
    sidebar.innerHTML = '';
    var top = h('div', { class: 'nav-top' }, [
      h('a', { href: '#/', 'data-route': '/', text: 'Trang chủ' }),
      h('a', { href: '#/play', 'data-route': '/play', text: 'Sân chơi tự do' })
    ]);
    sidebar.append(top);
    var pct = Math.round(done.size * 100 / LESSONS.length);
    var bar = h('div', { class: 'bar' }, [h('i', { style: 'width:' + pct + '%' })]);
    sidebar.append(h('div', { class: 'nav-progress' }, [
      h('div', { class: 'nav-group', style: 'margin-left:0', text: 'Tiến độ' }),
      bar,
      h('small', { text: 'Hoàn thành ' + done.size + '/' + LESSONS.length + ' bài tập' })
    ]));
    GROUPS.forEach(function (g) {
      sidebar.append(h('div', { class: 'nav-group', text: g }));
      LESSONS.filter(function (l) { return l.group === g; }).forEach(function (l) {
        var a = h('a', {
          class: 'nav-lesson' + (done.has(l.id) ? ' done' : ''),
          href: '#/lesson/' + l.id, 'data-route': '/lesson/' + l.id
        }, [h('span', { class: 'nav-mark', text: '✓' }), h('span', { text: l.title })]);
        sidebar.append(a);
      });
    });
    markCurrent();
    document.getElementById('topProgress').textContent = done.size + '/' + LESSONS.length + ' bài tập';
  }

  function markCurrent() {
    Array.prototype.forEach.call(sidebar.querySelectorAll('[data-route]'), function (a) {
      if (a.getAttribute('data-route') === current) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
  }

  function route() {
    var hash = location.hash.replace(/^#/, '') || '/';
    var m = /^\/lesson\/([\w-]+)$/.exec(hash);
    var view;
    if (m && byId[m[1]]) { current = '/lesson/' + m[1]; view = pageLesson(m[1]); }
    else if (hash === '/play') { current = '/play'; view = pagePlay(); }
    else { current = '/'; view = pageHome(); }
    main.innerHTML = '';
    main.append(view);
    markCurrent();
    closeNav();
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  }

  function openNav() {
    document.body.classList.add('nav-open');
    document.getElementById('menuBtn').setAttribute('aria-expanded', 'true');
  }
  function closeNav() {
    document.body.classList.remove('nav-open');
    document.getElementById('menuBtn').setAttribute('aria-expanded', 'false');
  }
  document.getElementById('menuBtn').addEventListener('click', function () {
    if (document.body.classList.contains('nav-open')) closeNav(); else openNav();
  });
  document.getElementById('scrim').addEventListener('click', closeNav);
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeNav(); });
  window.addEventListener('hashchange', route);

  renderNav();
  route();
})();
