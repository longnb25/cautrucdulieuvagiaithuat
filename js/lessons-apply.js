// Phần D: Bài toán vận dụng. Mỗi bài có đề dạng thi lập trình, nhiều test sinh tự động
// (kết quả mong đợi tính bằng một cài đặt độc lập viết bằng JavaScript).
window.LESSONS = window.LESSONS || [];
(function () {
  'use strict';

  var GROUP = 'D. Bài toán vận dụng';

  // ---------- sinh số ngẫu nhiên có hạt giống (kết quả lặp lại được) ----------
  function mk(seed) {
    var a = seed >>> 0;
    function f() {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
    return {
      f: f,
      int: function (lo, hi) { return lo + Math.floor(f() * (hi - lo + 1)); },
      pick: function (arr) { return arr[Math.floor(f() * arr.length)]; },
      arr: function (n, lo, hi) { var r = [], i; for (i = 0; i < n; i++) r.push(lo + Math.floor(f() * (hi - lo + 1))); return r; }
    };
  }
  function ints(s) { return (s.match(/-?\d+/g) || []).map(Number); }
  function words(s) { return s.trim().split(/\s+/); }

  function problem(d) {
    var tests = d.inputs.map(function (inp) {
      if (inp.charAt(inp.length - 1) !== '\n') inp += '\n';
      return { input: inp, expected: d.ref(inp) };
    });
    return {
      id: d.id, group: GROUP, level: d.level, tags: d.tags, title: d.title,
      html: d.story, io: d.io, noExample: true,
      ex: { text: '', starter: d.starter, solution: d.solution, hint: d.hint, tests: tests }
    };
  }

  var P = [];

  // ============ D1: Hai món vừa ví ============
  (function () {
    function ref(s) {
      var v = ints(s), n = v[0], S = v[1], a = v.slice(2, 2 + n), i, j;
      for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) if (a[i] + a[j] === S) return (i + 1) + ' ' + (j + 1);
      return 'KHONG';
    }
    var g = mk(11), inputs = ['5 9\n2 7 11 15 3', '4 10\n1 2 3 4', '4 8\n4 4 2 6', '2 5\n2 3', '2 5\n1 1', '3 6\n3 3 3'], t;
    for (t = 0; t < 6; t++) {
      var n = g.int(20, 200), a = g.arr(n, 1, 500), S;
      if (t % 2 === 0) { var i = g.int(0, n - 2), j = g.int(i + 1, n - 1); S = a[i] + a[j]; } else S = g.pick([1, 1500, 2000]);
      inputs.push(n + ' ' + S + '\n' + a.join(' '));
    }
    P.push(problem({
      id: 'd1', level: 'easy', tags: ['mảng', 'vòng lặp lồng', 'bảng băm'], title: 'Hai món vừa ví',
      story: '<p>Minh vào cửa hàng đồ cũ với đúng <b>S</b> đồng trong ví và muốn mua <b>hai món khác nhau</b> sao cho tổng giá <b>vừa đúng S đồng</b>, không thừa không thiếu. Cửa hàng có <b>n</b> món, món thứ <i>i</i> giá <i>a<sub>i</sub></i>.</p><p>Hãy cho Minh biết nên lấy hai món nào. Nếu có nhiều cặp, chọn cặp có chỉ số <i>i</i> nhỏ nhất, trong đó chọn <i>j</i> nhỏ nhất. Nếu không có cặp nào, in <code>KHONG</code>.</p>',
      io: { inp: 'Dòng 1: <code>n S</code> (2 ≤ n ≤ 200, 1 ≤ S ≤ 2000).\nDòng 2: n số nguyên <code>a<sub>1</sub> … a<sub>n</sub></code> (1 ≤ a<sub>i</sub> ≤ 1000).', out: 'Hai chỉ số <code>i j</code> (đánh số từ 1, i &lt; j) hoặc <code>KHONG</code>.' },
      starter: String.raw`#include <stdio.h>

int main() {
    int n, S, a[200], i, j;
    scanf("%d %d", &n, &S);
    for (i = 0; i < n; i++) scanf("%d", &a[i]);
    // Tìm cặp (i, j) với i < j và a[i] + a[j] == S

    printf("KHONG\n");
    return 0;
}
`,
      solution: String.raw`#include <stdio.h>

int main() {
    int n, S, a[200], i, j;
    scanf("%d %d", &n, &S);
    for (i = 0; i < n; i++) scanf("%d", &a[i]);
    for (i = 0; i < n; i++) {
        for (j = i + 1; j < n; j++) {
            if (a[i] + a[j] == S) {
                printf("%d %d\n", i + 1, j + 1);
                return 0;
            }
        }
    }
    printf("KHONG\n");
    return 0;
}
`,
      hint: 'Hai vòng for lồng nhau là đủ với n ≤ 200 (O(n²)). Muốn nhanh hơn: duyệt j và tra xem S − a[j] đã xuất hiện trước đó chưa bằng bảng đánh dấu (a[i] ≤ 1000).',
      inputs: inputs, ref: ref
    }));
  })();

  // ============ D2: Chuỗi ngày vàng ============
  (function () {
    function ref(s) {
      var v = ints(s), n = v[0], a = v.slice(1, 1 + n), best = -Infinity, bl = 0, br = 0, l, r, sum;
      for (l = 0; l < n; l++) { sum = 0; for (r = l; r < n; r++) { sum += a[r]; if (sum > best) { best = sum; bl = l; br = r; } } }
      return best + '\n' + (bl + 1) + ' ' + (br + 1);
    }
    var g = mk(22), inputs = ['9\n-2 1 -3 4 -1 2 1 -5 4', '3\n-3 -1 -2', '1\n5', '1\n-7', '5\n1 2 3 4 5', '5\n-1 -2 -3 -4 -5', '4\n0 0 0 0'], t;
    for (t = 0; t < 5; t++) { var n = g.int(10, 100); inputs.push(n + '\n' + g.arr(n, -50, 50).join(' ')); }
    P.push(problem({
      id: 'd2', level: 'easy', tags: ['mảng', 'tổng đoạn', 'Kadane'], title: 'Chuỗi ngày vàng',
      story: '<p>Cửa hàng trà sữa của An ghi lại <b>lãi/lỗ</b> của <b>n</b> ngày liên tiếp (số âm là ngày lỗ). An muốn tìm một <b>chuỗi ngày liên tiếp</b> (ít nhất một ngày) có <b>tổng lãi lớn nhất</b> để mở chiến dịch quảng cáo đúng vào khoảng thời gian đó.</p><p>In tổng lãi lớn nhất, rồi ngày bắt đầu và ngày kết thúc của chuỗi. Nếu nhiều chuỗi cùng tổng lớn nhất, chọn chuỗi có ngày bắt đầu sớm nhất, và với ngày bắt đầu đó chọn ngày kết thúc sớm nhất.</p>',
      io: { inp: 'Dòng 1: <code>n</code> (1 ≤ n ≤ 100).\nDòng 2: n số nguyên trong khoảng [−50, 50].', out: 'Dòng 1: tổng lớn nhất.\nDòng 2: hai số <code>l r</code> (đánh số từ 1).' },
      starter: String.raw`#include <stdio.h>

int main() {
    int n, a[100], i, l, r;
    scanf("%d", &n);
    for (i = 0; i < n; i++) scanf("%d", &a[i]);
    // Tìm đoạn [l, r] có tổng lớn nhất

    return 0;
}
`,
      solution: String.raw`#include <stdio.h>

int main() {
    int n, a[100], i, l, r;
    int best = -1000000, bl = 0, br = 0, sum;
    scanf("%d", &n);
    for (i = 0; i < n; i++) scanf("%d", &a[i]);
    for (l = 0; l < n; l++) {
        sum = 0;
        for (r = l; r < n; r++) {
            sum += a[r];
            if (sum > best) {
                best = sum;
                bl = l;
                br = r;
            }
        }
    }
    printf("%d\n%d %d\n", best, bl + 1, br + 1);
    return 0;
}
`,
      hint: 'Cách chậm: thử mọi cặp (l, r) và cộng dồn, O(n²). Cách nhanh (Kadane, O(n)): giữ tổng đoạn kết thúc tại vị trí hiện tại; nếu tổng này âm thì bỏ nó đi và bắt đầu lại từ phần tử kế. Chú ý khởi tạo “best” rất nhỏ, vì tất cả số có thể âm.',
      inputs: inputs, ref: ref
    }));
  })();

  // ============ D3: Vòng tròn sinh tử ============
  (function () {
    function ref(s) {
      var v = ints(s), n = v[0], k = v[1], arr = [], i, idx = 0, out = [];
      for (i = 1; i <= n; i++) arr.push(i);
      while (arr.length) { idx = (idx + k - 1) % arr.length; out.push(arr.splice(idx, 1)[0]); }
      return out.join(' ');
    }
    var g = mk(33), inputs = ['7 3', '1 1', '5 1', '5 2', '10 10', '6 100'], t;
    for (t = 0; t < 6; t++) inputs.push(g.int(2, 100) + ' ' + g.int(1, 100));
    P.push(problem({
      id: 'd3', level: 'mid', tags: ['hàng đợi', 'mô phỏng'], title: 'Vòng tròn sinh tử',
      story: '<p>Trò chơi dân gian: <b>n</b> bạn nhỏ đứng thành vòng tròn, đánh số 1 đến n theo chiều kim đồng hồ. Bắt đầu đếm từ bạn số 1: đếm <b>1, 2, …, k</b>, bạn nào bị đếm đúng số <b>k</b> sẽ ra khỏi vòng. Rồi tiếp tục đếm lại từ 1 bắt đầu từ bạn ngồi ngay sau bạn vừa ra, cho tới khi không còn ai.</p><p>Hãy in thứ tự các bạn ra khỏi vòng. Bạn cuối cùng là người thắng cuộc.</p><p>Ví dụ n = 7, k = 3: lần lượt ra 3, 6, 2, 7, 5, 1, bạn số 4 thắng.</p>',
      io: { inp: 'Một dòng: <code>n k</code> (1 ≤ n ≤ 100, 1 ≤ k ≤ 100).', out: 'n số, cách nhau một khoảng trắng: thứ tự ra khỏi vòng.' },
      starter: String.raw`#include <stdio.h>

int main() {
    int n, k, i;
    scanf("%d %d", &n, &k);
    // Mô phỏng trò chơi bằng hàng đợi hoặc mảng

    printf("\n");
    return 0;
}
`,
      solution: String.raw`#include <stdio.h>

int main() {
    int n, k, i, idx = 0, cnt;
    int a[100];
    scanf("%d %d", &n, &k);
    for (i = 0; i < n; i++) a[i] = i + 1;
    cnt = n;
    while (cnt > 0) {
        idx = (idx + k - 1) % cnt;
        printf("%d ", a[idx]);
        for (i = idx; i < cnt - 1; i++) a[i] = a[i + 1];
        cnt--;
    }
    printf("\n");
    return 0;
}
`,
      hint: 'Cách hàng đợi: lặp, lấy k − 1 bạn từ đầu hàng đưa ra cuối hàng, bạn thứ k thì in ra và bỏ đi. Cách mảng: giữ vị trí hiện tại idx, bạn bị loại là idx = (idx + k − 1) % số_người_còn_lại; sau đó xóa phần tử đó bằng cách dồn mảng.',
      inputs: inputs, ref: ref
    }));
  })();

  // ============ D4: Chờ ngày nóng hơn ============
  (function () {
    function ref(s) {
      var v = ints(s), n = v[0], a = v.slice(1, 1 + n), out = [], i, j;
      for (i = 0; i < n; i++) { var d = 0; for (j = i + 1; j < n; j++) if (a[j] > a[i]) { d = j - i; break; } out.push(d); }
      return out.join(' ');
    }
    var g = mk(44), inputs = ['8\n73 74 75 71 69 72 76 73', '1\n30', '5\n30 40 50 60 70', '5\n70 60 50 40 30', '4\n50 50 50 50'], t;
    for (t = 0; t < 6; t++) { var n = g.int(20, 200); inputs.push(n + '\n' + g.arr(n, 20, 45).join(' ')); }
    P.push(problem({
      id: 'd4', level: 'mid', tags: ['ngăn xếp', 'mảng'], title: 'Chờ ngày nóng hơn',
      story: '<p>Dự báo thời tiết cho biết nhiệt độ của <b>n</b> ngày liên tiếp. Bạn đang lên kế hoạch đi biển và với mỗi ngày muốn biết: <b>phải chờ bao nhiêu ngày nữa</b> thì mới gặp một ngày <b>nóng hơn hẳn</b> ngày đó? Nếu sau đó không bao giờ nóng hơn thì in 0.</p><p>Ví dụ nhiệt độ <code>73 74 75 71 69 72 76 73</code> cho đáp án <code>1 1 4 2 1 1 0 0</code>.</p>',
      io: { inp: 'Dòng 1: <code>n</code> (1 ≤ n ≤ 200).\nDòng 2: n nhiệt độ nguyên trong khoảng [20, 45].', out: 'n số cách nhau một khoảng trắng.' },
      starter: String.raw`#include <stdio.h>

int main() {
    int n, t[200], res[200], i;
    scanf("%d", &n);
    for (i = 0; i < n; i++) scanf("%d", &t[i]);
    // Với mỗi i, tìm số ngày phải chờ tới ngày nóng hơn

    for (i = 0; i < n; i++) printf("%d ", res[i]);
    printf("\n");
    return 0;
}
`,
      solution: String.raw`#include <stdio.h>

int main() {
    int n, t[200], res[200], st[200], top = -1, i;
    scanf("%d", &n);
    for (i = 0; i < n; i++) scanf("%d", &t[i]);
    for (i = 0; i < n; i++) res[i] = 0;
    for (i = 0; i < n; i++) {
        while (top >= 0 && t[st[top]] < t[i]) {
            res[st[top]] = i - st[top];
            top--;
        }
        top++;
        st[top] = i;
    }
    for (i = 0; i < n; i++) printf("%d ", res[i]);
    printf("\n");
    return 0;
}
`,
      hint: 'Cách chậm O(n²): với mỗi ngày i quét tiếp về sau. Cách nhanh O(n) dùng ngăn xếp các chỉ số: duyệt ngày i, khi nhiệt độ ngày i lớn hơn nhiệt độ ở đỉnh stack thì ngày ở đỉnh đã tìm được “ngày nóng hơn” là i, pop nó và ghi kết quả i − chỉ_số. Cuối cùng push i.',
      inputs: inputs, ref: ref
    }));
  })();

  // ============ D5: Đếm hòn đảo ============
  (function () {
    function ref(s) {
      var w = words(s), R = Number(w[0]), C = Number(w[1]), g = w.slice(2, 2 + R), seen = {}, cnt = 0, i, j;
      function dfs(r, c) {
        if (r < 0 || c < 0 || r >= R || c >= C || g[r][c] !== '#' || seen[r + ',' + c]) return;
        seen[r + ',' + c] = true;
        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);
      }
      for (i = 0; i < R; i++) for (j = 0; j < C; j++) if (g[i][j] === '#' && !seen[i + ',' + j]) { cnt++; dfs(i, j); }
      return String(cnt);
    }
    var g = mk(55), inputs = ['4 5\n##..#\n#...#\n..#..\n...##', '2 3\n...\n...', '3 3\n###\n###\n###', '3 3\n#.#\n.#.\n#.#', '1 1\n#'], t;
    for (t = 0; t < 7; t++) {
      var R = g.int(5, 12), C = g.int(5, 12), rows = [], i, j, p = g.pick([0.3, 0.45, 0.6]);
      for (i = 0; i < R; i++) { var row = ''; for (j = 0; j < C; j++) row += g.f() < p ? '#' : '.'; rows.push(row); }
      inputs.push(R + ' ' + C + '\n' + rows.join('\n'));
    }
    P.push(problem({
      id: 'd5', level: 'mid', tags: ['DFS', 'lưới', 'đệ quy'], title: 'Đếm hòn đảo',
      story: '<p>Vệ tinh chụp một vùng biển và gửi về bản đồ dạng lưới R × C. Ô <code>#</code> là đất, ô <code>.</code> là nước. Một <b>hòn đảo</b> là tập các ô đất nối với nhau qua cạnh chung (trên, dưới, trái, phải; <b>không</b> tính đường chéo).</p><p>Hãy đếm xem có bao nhiêu hòn đảo.</p>',
      io: { inp: 'Dòng 1: <code>R C</code> (1 ≤ R, C ≤ 12).\nR dòng tiếp theo, mỗi dòng là một xâu C ký tự <code>#</code> hoặc <code>.</code>.', out: 'Số hòn đảo.' },
      starter: String.raw`#include <stdio.h>

char g[20][20];
int visited[20][20];
int R, C;

void dfs(int r, int c) {
    // Dừng nếu ra ngoài lưới, không phải đất hoặc đã thăm
    // Ngược lại đánh dấu rồi loang ra 4 hướng
}

int main() {
    int i, j, dem = 0;
    scanf("%d %d", &R, &C);
    for (i = 0; i < R; i++) scanf("%s", g[i]);
    // Mỗi lần gặp ô đất chưa thăm là một hòn đảo mới

    printf("%d\n", dem);
    return 0;
}
`,
      solution: String.raw`#include <stdio.h>

char g[20][20];
int visited[20][20];
int R, C;

void dfs(int r, int c) {
    if (r < 0 || r >= R || c < 0 || c >= C) return;
    if (g[r][c] != '#' || visited[r][c]) return;
    visited[r][c] = 1;
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
}

int main() {
    int i, j, dem = 0;
    scanf("%d %d", &R, &C);
    for (i = 0; i < R; i++) scanf("%s", g[i]);
    for (i = 0; i < R; i++) {
        for (j = 0; j < C; j++) {
            if (g[i][j] == '#' && !visited[i][j]) {
                dem++;
                dfs(i, j);
            }
        }
    }
    printf("%d\n", dem);
    return 0;
}
`,
      hint: 'Đếm thành phần liên thông trên lưới: quét từng ô, gặp ô đất chưa thăm thì tăng đếm rồi DFS để “nhấn chìm” cả hòn đảo (đánh dấu visited). Nhớ kiểm tra biên trước khi truy cập g[r][c].',
      inputs: inputs, ref: ref
    }));
  })();

  // ============ D6: Mê cung thoát hiểm ============
  (function () {
    function ref(s) {
      var w = words(s), R = Number(w[0]), C = Number(w[1]), g = w.slice(2, 2 + R), i, j, sr, sc, er, ec;
      for (i = 0; i < R; i++) for (j = 0; j < C; j++) { if (g[i][j] === 'S') { sr = i; sc = j; } if (g[i][j] === 'E') { er = i; ec = j; } }
      var dist = {}, q = [[sr, sc]]; dist[sr + ',' + sc] = 0;
      while (q.length) {
        var cur = q.shift(), d = dist[cur[0] + ',' + cur[1]];
        if (cur[0] === er && cur[1] === ec) return String(d);
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (m) {
          var r = cur[0] + m[0], c = cur[1] + m[1];
          if (r >= 0 && c >= 0 && r < R && c < C && g[r][c] !== '#' && dist[r + ',' + c] === undefined) { dist[r + ',' + c] = d + 1; q.push([r, c]); }
        });
      }
      return '-1';
    }
    var g = mk(66), inputs = ['3 4\nS..#\n.#..\n...E', '1 3\nS#E', '1 2\nSE', '3 3\nS#.\n###\n..E'], t;
    for (t = 0; t < 9; t++) {
      var R = g.int(5, 12), C = g.int(5, 12), grid = [], i, j, p = g.pick([0.2, 0.3, 0.38]);
      for (i = 0; i < R; i++) { var row = []; for (j = 0; j < C; j++) row.push(g.f() < p ? '#' : '.'); grid.push(row); }
      var s1 = g.int(0, R * C - 1), e1;
      do { e1 = g.int(0, R * C - 1); } while (e1 === s1);
      grid[Math.floor(s1 / C)][s1 % C] = 'S';
      grid[Math.floor(e1 / C)][e1 % C] = 'E';
      inputs.push(R + ' ' + C + '\n' + grid.map(function (r) { return r.join(''); }).join('\n'));
    }
    P.push(problem({
      id: 'd6', level: 'hard', tags: ['BFS', 'đường đi ngắn nhất', 'lưới'], title: 'Mê cung thoát hiểm',
      story: '<p>Bạn bị lạc trong một mê cung dạng lưới R × C. <code>S</code> là chỗ bạn đang đứng, <code>E</code> là lối ra, <code>#</code> là tường, <code>.</code> là ô trống đi được. Mỗi bước bạn đi sang một ô kề cạnh (lên, xuống, trái, phải) không phải tường.</p><p>Tìm <b>số bước ít nhất</b> để từ S tới E, hoặc in <code>-1</code> nếu không có đường ra.</p>',
      io: { inp: 'Dòng 1: <code>R C</code> (1 ≤ R, C ≤ 12).\nR dòng tiếp theo, mỗi dòng C ký tự trong <code>S E # .</code>. Có đúng một S và một E.', out: 'Số bước ít nhất hoặc <code>-1</code>.' },
      starter: String.raw`#include <stdio.h>

char g[20][20];
int dist[20][20];
int qr[400], qc[400];
int R, C;

int main() {
    int i, j, sr = 0, sc = 0, er = 0, ec = 0;
    scanf("%d %d", &R, &C);
    for (i = 0; i < R; i++) scanf("%s", g[i]);
    for (i = 0; i < R; i++) {
        for (j = 0; j < C; j++) {
            dist[i][j] = -1;
            if (g[i][j] == 'S') { sr = i; sc = j; }
            if (g[i][j] == 'E') { er = i; ec = j; }
        }
    }
    // BFS từ (sr, sc), dist[r][c] = số bước ngắn nhất tới ô đó

    printf("%d\n", dist[er][ec]);
    return 0;
}
`,
      solution: String.raw`#include <stdio.h>

char g[20][20];
int dist[20][20];
int qr[400], qc[400];
int R, C;

int main() {
    int i, j, sr = 0, sc = 0, er = 0, ec = 0, d;
    int dr[4] = {1, -1, 0, 0};
    int dc[4] = {0, 0, 1, -1};
    int head = 0, tail = 0;
    scanf("%d %d", &R, &C);
    for (i = 0; i < R; i++) scanf("%s", g[i]);
    for (i = 0; i < R; i++) {
        for (j = 0; j < C; j++) {
            dist[i][j] = -1;
            if (g[i][j] == 'S') { sr = i; sc = j; }
            if (g[i][j] == 'E') { er = i; ec = j; }
        }
    }
    dist[sr][sc] = 0;
    qr[tail] = sr; qc[tail] = sc; tail++;
    while (head < tail) {
        int r = qr[head], c = qc[head];
        head++;
        for (d = 0; d < 4; d++) {
            int nr = r + dr[d], nc = c + dc[d];
            if (nr < 0 || nr >= R || nc < 0 || nc >= C) continue;
            if (g[nr][nc] == '#' || dist[nr][nc] != -1) continue;
            dist[nr][nc] = dist[r][c] + 1;
            qr[tail] = nr; qc[tail] = nc; tail++;
        }
    }
    printf("%d\n", dist[er][ec]);
    return 0;
}
`,
      hint: 'BFS theo từng lớp cho đường đi ngắn nhất khi mọi bước đều tốn 1. Khởi tạo dist = −1 (chưa thăm). Dùng hai mảng dr = {1,−1,0,0}, dc = {0,0,1,−1} để duyệt 4 hướng. Nếu E không bao giờ được thăm thì dist[er][ec] vẫn là −1, đúng đề.',
      inputs: inputs, ref: ref
    }));
  })();

  // ============ D7: Đổi tiền ít tờ nhất ============
  (function () {
    function ref(s) {
      var v = ints(s), n = v[0], A = v[1], c = v.slice(2, 2 + n), INF = 1e9, dp = [0], a, i;
      for (a = 1; a <= A; a++) { dp[a] = INF; for (i = 0; i < n; i++) if (c[i] <= a && dp[a - c[i]] + 1 < dp[a]) dp[a] = dp[a - c[i]] + 1; }
      return dp[A] >= INF ? '-1' : String(dp[A]);
    }
    var g = mk(77), inputs = ['3 6\n1 3 4', '2 7\n2 4', '1 1\n1', '3 11\n1 2 5', '1 10\n3', '2 100\n1 100', '3 63\n1 21 37'], t;
    for (t = 0; t < 6; t++) { var n = g.int(2, 5), A = g.int(50, 500); inputs.push(n + ' ' + A + '\n' + g.arr(n, 2, 40).join(' ')); }
    P.push(problem({
      id: 'd7', level: 'mid', tags: ['quy hoạch động', 'đổi tiền'], title: 'Đổi tiền ít tờ nhất',
      story: '<p>Ở đất nước Dpland, tiền chỉ có <b>n</b> loại mệnh giá, mỗi loại có <b>vô hạn</b> tờ. Bạn cần trả đúng <b>A</b> đồng và muốn dùng <b>ít tờ nhất</b> để người bán đỡ cầm nặng.</p><p>Cẩn thận: tham lam “luôn lấy tờ lớn nhất” có thể sai! Ví dụ mệnh giá 1, 3, 4 và số tiền 6: tham lam cho 4 + 1 + 1 (3 tờ), nhưng 3 + 3 chỉ cần 2 tờ.</p>',
      io: { inp: 'Dòng 1: <code>n A</code> (1 ≤ n ≤ 5, 1 ≤ A ≤ 500).\nDòng 2: n mệnh giá (1 ≤ mệnh giá ≤ 50).', out: 'Số tờ ít nhất, hoặc <code>-1</code> nếu không trả đúng được.' },
      starter: String.raw`#include <stdio.h>

int main() {
    int n, A, c[5], dp[501], i, a;
    scanf("%d %d", &n, &A);
    for (i = 0; i < n; i++) scanf("%d", &c[i]);
    // dp[a] = số tờ ít nhất để trả đúng a đồng

    return 0;
}
`,
      solution: String.raw`#include <stdio.h>

int main() {
    int n, A, c[5], dp[501], i, a;
    scanf("%d %d", &n, &A);
    for (i = 0; i < n; i++) scanf("%d", &c[i]);
    dp[0] = 0;
    for (a = 1; a <= A; a++) {
        dp[a] = 1000000;
        for (i = 0; i < n; i++) {
            if (c[i] <= a && dp[a - c[i]] + 1 < dp[a]) dp[a] = dp[a - c[i]] + 1;
        }
    }
    if (dp[A] >= 1000000) printf("-1\n");
    else printf("%d\n", dp[A]);
    return 0;
}
`,
      hint: 'Đặt dp[0] = 0 và dp[a] = min trên mọi mệnh giá c ≤ a của dp[a − c] + 1. Khởi tạo dp[a] bằng một số rất lớn (vô cực) để biết ô nào không thể đạt được.',
      inputs: inputs, ref: ref
    }));
  })();

  // ============ D8: Dãy con tăng dài nhất ============
  (function () {
    function ref(s) {
      var v = ints(s), n = v[0], a = v.slice(1, 1 + n), dp = [], best = 0, i, j;
      for (i = 0; i < n; i++) { dp[i] = 1; for (j = 0; j < i; j++) if (a[j] < a[i] && dp[j] + 1 > dp[i]) dp[i] = dp[j] + 1; if (dp[i] > best) best = dp[i]; }
      return String(best);
    }
    var g = mk(88), inputs = ['8\n10 9 2 5 3 7 101 18', '1\n5', '5\n5 4 3 2 1', '5\n1 2 3 4 5', '6\n2 2 2 2 2 2'], t;
    for (t = 0; t < 7; t++) { var n = g.int(30, 100); inputs.push(n + '\n' + g.arr(n, 1, 200).join(' ')); }
    P.push(problem({
      id: 'd8', level: 'mid', tags: ['quy hoạch động', 'dãy con'], title: 'Dãy con tăng dài nhất',
      story: '<p>Một nhà đầu tư ghi lại giá cổ phiếu mỗi ngày trong <b>n</b> ngày. Ông ta muốn chọn ra nhiều ngày nhất (giữ nguyên thứ tự thời gian, không cần liền nhau) sao cho giá <b>tăng chặt</b> qua từng ngày được chọn.</p><p>Ví dụ giá <code>10 9 2 5 3 7 101 18</code>: có thể chọn <code>2 5 7 101</code> (4 ngày). Hãy in số ngày nhiều nhất.</p>',
      io: { inp: 'Dòng 1: <code>n</code> (1 ≤ n ≤ 100).\nDòng 2: n số nguyên dương ≤ 200.', out: 'Độ dài dãy con tăng chặt dài nhất.' },
      starter: String.raw`#include <stdio.h>

int main() {
    int n, a[100], dp[100], i, j, best = 0;
    scanf("%d", &n);
    for (i = 0; i < n; i++) scanf("%d", &a[i]);
    // dp[i] = độ dài dãy con tăng dài nhất kết thúc tại a[i]

    printf("%d\n", best);
    return 0;
}
`,
      solution: String.raw`#include <stdio.h>

int main() {
    int n, a[100], dp[100], i, j, best = 0;
    scanf("%d", &n);
    for (i = 0; i < n; i++) scanf("%d", &a[i]);
    for (i = 0; i < n; i++) {
        dp[i] = 1;
        for (j = 0; j < i; j++) {
            if (a[j] < a[i] && dp[j] + 1 > dp[i]) dp[i] = dp[j] + 1;
        }
        if (dp[i] > best) best = dp[i];
    }
    printf("%d\n", best);
    return 0;
}
`,
      hint: 'dp[i] = 1 + max của dp[j] với mọi j < i mà a[j] < a[i] (hoặc 1 nếu không có j nào). Đáp án là max của toàn bộ dp[i], không phải dp[n − 1]. “Tăng chặt” nghĩa là các giá trị bằng nhau không được chọn cùng nhau.',
      inputs: inputs, ref: ref
    }));
  })();

  // ============ D9: Xâu con chung dài nhất ============
  (function () {
    function ref(s) {
      var w = words(s), a = w[0], b = w[1], dp = [], i, j;
      for (i = 0; i <= a.length; i++) { dp.push([]); for (j = 0; j <= b.length; j++) dp[i].push(0); }
      for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++) dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
      return String(dp[a.length][b.length]);
    }
    var g = mk(99), inputs = ['abcbdab\nbdcaba', 'abc\ndef', 'a\na', 'abcdef\nabcdef', 'abcdef\nfedcba'], t;
    function str(n, al) { var r = '', i; for (i = 0; i < n; i++) r += al[g.int(0, al.length - 1)]; return r; }
    for (t = 0; t < 7; t++) inputs.push(str(g.int(15, 40), 'abcd') + '\n' + str(g.int(15, 40), 'abcd'));
    P.push(problem({
      id: 'd9', level: 'hard', tags: ['quy hoạch động', 'xâu'], title: 'Xâu con chung dài nhất',
      story: '<p>Hai nhà sinh vật học có hai đoạn gen biểu diễn bằng hai xâu ký tự. Họ muốn đo mức độ giống nhau bằng <b>độ dài của xâu con chung dài nhất</b>. Xâu con là xâu thu được khi xóa một số (có thể không) ký tự và giữ nguyên thứ tự các ký tự còn lại, <b>không cần liền nhau</b>.</p><p>Ví dụ <code>abcbdab</code> và <code>bdcaba</code> có xâu con chung dài nhất là <code>bcba</code> (độ dài 4).</p>',
      io: { inp: 'Hai dòng, mỗi dòng một xâu chữ thường dài từ 1 đến 40 ký tự (không có khoảng trắng).', out: 'Độ dài xâu con chung dài nhất.' },
      starter: String.raw`#include <stdio.h>
#include <string.h>

int dp[45][45];

int main() {
    char a[50], b[50];
    int i, j, n, m;
    scanf("%s", a);
    scanf("%s", b);
    n = strlen(a);
    m = strlen(b);
    // dp[i][j] = LCS của i ký tự đầu của a và j ký tự đầu của b

    printf("%d\n", dp[n][m]);
    return 0;
}
`,
      solution: String.raw`#include <stdio.h>
#include <string.h>

int dp[45][45];

int main() {
    char a[50], b[50];
    int i, j, n, m;
    scanf("%s", a);
    scanf("%s", b);
    n = strlen(a);
    m = strlen(b);
    for (i = 1; i <= n; i++) {
        for (j = 1; j <= m; j++) {
            if (a[i - 1] == b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
            else if (dp[i - 1][j] > dp[i][j - 1]) dp[i][j] = dp[i - 1][j];
            else dp[i][j] = dp[i][j - 1];
        }
    }
    printf("%d\n", dp[n][m]);
    return 0;
}
`,
      hint: 'dp[i][j]: nếu a[i−1] == b[j−1] thì = dp[i−1][j−1] + 1, ngược lại = max(dp[i−1][j], dp[i][j−1]). Hàng 0 và cột 0 đều bằng 0 (mảng toàn cục đã được khởi tạo 0).',
      inputs: inputs, ref: ref
    }));
  })();

  // ============ D10: Chiếc túi 0/1 ============
  (function () {
    function ref(s) {
      var v = ints(s), n = v[0], W = v[1], dp = [], i, w;
      for (w = 0; w <= W; w++) dp.push(0);
      for (i = 0; i < n; i++) { var wi = v[2 + 2 * i], vi = v[3 + 2 * i]; for (w = W; w >= wi; w--) dp[w] = Math.max(dp[w], dp[w - wi] + vi); }
      return String(dp[W]);
    }
    var g = mk(111), inputs = ['4 7\n1 1\n3 4\n4 5\n5 7', '1 5\n6 100', '1 5\n5 10', '3 50\n10 60\n20 100\n30 120'], t;
    for (t = 0; t < 8; t++) {
      var n = g.int(5, 20), W = g.int(20, 100), lines = [], i;
      for (i = 0; i < n; i++) lines.push(g.int(1, 30) + ' ' + g.int(1, 50));
      inputs.push(n + ' ' + W + '\n' + lines.join('\n'));
    }
    P.push(problem({
      id: 'd10', level: 'hard', tags: ['quy hoạch động', 'cái túi'], title: 'Chiếc túi du lịch',
      story: '<p>Trước chuyến đi, Lan có <b>n</b> món đồ, món thứ <i>i</i> nặng <i>w<sub>i</sub></i> và “giá trị tinh thần” <i>v<sub>i</sub></i>. Chiếc ba lô chỉ chịu được tối đa <b>W</b> ký. Mỗi món chỉ mang được <b>một lần</b> (mang hoặc để lại).</p><p>Hãy chọn các món để <b>tổng giá trị lớn nhất</b> mà tổng khối lượng không vượt quá W.</p>',
      io: { inp: 'Dòng 1: <code>n W</code> (1 ≤ n ≤ 20, 1 ≤ W ≤ 100).\nn dòng tiếp theo, mỗi dòng <code>w v</code> (1 ≤ w ≤ 30, 1 ≤ v ≤ 50).', out: 'Tổng giá trị lớn nhất.' },
      starter: String.raw`#include <stdio.h>

int main() {
    int n, W, wt[20], val[20], dp[101], i, w;
    scanf("%d %d", &n, &W);
    for (i = 0; i < n; i++) scanf("%d %d", &wt[i], &val[i]);
    // dp[w] = giá trị lớn nhất khi sức chứa là w

    printf("%d\n", dp[W]);
    return 0;
}
`,
      solution: String.raw`#include <stdio.h>

int main() {
    int n, W, wt[20], val[20], dp[101], i, w;
    scanf("%d %d", &n, &W);
    for (i = 0; i < n; i++) scanf("%d %d", &wt[i], &val[i]);
    for (w = 0; w <= W; w++) dp[w] = 0;
    for (i = 0; i < n; i++) {
        for (w = W; w >= wt[i]; w--) {
            if (dp[w - wt[i]] + val[i] > dp[w]) dp[w] = dp[w - wt[i]] + val[i];
        }
    }
    printf("%d\n", dp[W]);
    return 0;
}
`,
      hint: 'Với mỗi món i, cập nhật dp[w] = max(dp[w], dp[w − wt[i]] + val[i]). Mẹo quan trọng khi dùng mảng một chiều: duyệt w từ W GIẢM xuống wt[i] để mỗi món chỉ được dùng một lần (duyệt tăng sẽ biến thành “vô hạn món”).',
      inputs: inputs, ref: ref
    }));
  })();

  // ============ D11: Đếm cặp nghịch thế ============
  (function () {
    function ref(s) {
      var v = ints(s), n = v[0], a = v.slice(1, 1 + n), c = 0, i, j;
      for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) if (a[i] > a[j]) c++;
      return String(c);
    }
    var g = mk(122), inputs = ['5\n2 4 1 3 5', '1\n7', '4\n4 3 2 1', '5\n1 2 3 4 5', '5\n2 2 2 2 2'], t;
    for (t = 0; t < 7; t++) { var n = g.int(50, 200); inputs.push(n + '\n' + g.arr(n, 1, 1000).join(' ')); }
    P.push(problem({
      id: 'd11', level: 'hard', tags: ['sắp xếp trộn', 'chia để trị', 'đếm'], title: 'Đếm cặp nghịch thế',
      story: '<p>Một bảng xếp hạng đang “lộn xộn”. Độ lộn xộn của dãy được đo bằng số <b>cặp nghịch thế</b>: cặp vị trí <i>i &lt; j</i> mà <i>a<sub>i</sub> &gt; a<sub>j</sub></i> (số đứng trước lại lớn hơn số đứng sau). Dãy đã sắp tăng có 0 nghịch thế; dãy giảm dần có nhiều nhất.</p><p>Ví dụ <code>2 4 1 3 5</code> có 3 nghịch thế: (2,1), (4,1), (4,3).</p><p><b>Thử thách:</b> với n lớn, cách hai vòng for O(n²) sẽ chậm. Bạn có thể đếm khi <b>trộn</b> trong sắp xếp trộn để được O(n log n).</p>',
      io: { inp: 'Dòng 1: <code>n</code> (1 ≤ n ≤ 200).\nDòng 2: n số nguyên trong [1, 1000].', out: 'Số cặp nghịch thế.' },
      starter: String.raw`#include <stdio.h>

int main() {
    int n, a[200], i, j, dem = 0;
    scanf("%d", &n);
    for (i = 0; i < n; i++) scanf("%d", &a[i]);
    // Đếm số cặp i < j mà a[i] > a[j]

    printf("%d\n", dem);
    return 0;
}
`,
      solution: String.raw`#include <stdio.h>

int a[200], tmp[200];

int dem = 0;

void sortDem(int l, int r) {
    if (l >= r) return;
    int m = (l + r) / 2, i = l, j = m + 1, k = l;
    sortDem(l, m);
    sortDem(m + 1, r);
    while (i <= m && j <= r) {
        if (a[i] <= a[j]) {
            tmp[k] = a[i]; i++;
        } else {
            tmp[k] = a[j]; j++;
            dem += m - i + 1;
        }
        k++;
    }
    while (i <= m) { tmp[k] = a[i]; i++; k++; }
    while (j <= r) { tmp[k] = a[j]; j++; k++; }
    for (k = l; k <= r; k++) a[k] = tmp[k];
}

int main() {
    int n, i;
    scanf("%d", &n);
    for (i = 0; i < n; i++) scanf("%d", &a[i]);
    sortDem(0, n - 1);
    printf("%d\n", dem);
    return 0;
}
`,
      hint: 'Cách đơn giản là hai vòng for. Cách nhanh: trong bước trộn hai nửa đã sắp xếp, khi lấy phần tử a[j] của nửa phải trước một phần tử a[i] của nửa trái thì tất cả các phần tử còn lại của nửa trái (từ i đến m, tức m − i + 1 phần tử) đều lớn hơn a[j] và đứng trước nó: cộng m − i + 1 vào đáp án.',
      inputs: inputs, ref: ref
    }));
  })();

  // ============ D12: Phần tử lớn thứ k ============
  (function () {
    function ref(s) {
      var v = ints(s), n = v[0], k = v[1], a = v.slice(2, 2 + n);
      a.sort(function (x, y) { return y - x; });
      return String(a[k - 1]);
    }
    var g = mk(133), inputs = ['6 2\n3 2 1 5 6 4', '1 1\n5', '5 5\n3 1 4 1 5', '5 2\n7 7 7 7 7', '4 1\n-3 -1 -2 -9'], t;
    for (t = 0; t < 7; t++) { var n = g.int(10, 200); inputs.push(n + ' ' + g.int(1, n) + '\n' + g.arr(n, -500, 500).join(' ')); }
    P.push(problem({
      id: 'd12', level: 'easy', tags: ['sắp xếp', 'quickselect'], title: 'Điểm cao thứ k',
      story: '<p>Kỳ thi có <b>n</b> thí sinh với điểm số cho trước (có thể trùng nhau, có thể âm do trừ điểm vi phạm). Ban tổ chức muốn biết <b>điểm của người đứng thứ k</b> nếu xếp từ cao xuống thấp (các điểm trùng nhau vẫn chiếm các hạng liên tiếp).</p><p>Ví dụ <code>3 2 1 5 6 4</code>, k = 2: xếp giảm dần được 6 5 4 3 2 1, người thứ 2 có điểm 5.</p>',
      io: { inp: 'Dòng 1: <code>n k</code> (1 ≤ k ≤ n ≤ 200).\nDòng 2: n số nguyên trong [−500, 500].', out: 'Một số: điểm của người đứng thứ k.' },
      starter: String.raw`#include <stdio.h>

int main() {
    int n, k, a[200], i, j;
    scanf("%d %d", &n, &k);
    for (i = 0; i < n; i++) scanf("%d", &a[i]);
    // Sắp xếp giảm dần rồi lấy phần tử thứ k

    return 0;
}
`,
      solution: String.raw`#include <stdio.h>

int main() {
    int n, k, a[200], i, j, t;
    scanf("%d %d", &n, &k);
    for (i = 0; i < n; i++) scanf("%d", &a[i]);
    for (i = 1; i < n; i++) {
        t = a[i];
        j = i - 1;
        while (j >= 0 && a[j] < t) {
            a[j + 1] = a[j];
            j--;
        }
        a[j + 1] = t;
    }
    printf("%d\n", a[k - 1]);
    return 0;
}
`,
      hint: 'Sắp xếp giảm dần (chèn, chọn hay nổi bọt đều được với n ≤ 200) rồi in a[k − 1]. Nhớ chỉ số mảng bắt đầu từ 0. Nâng cao: dùng bước phân hoạch của quick sort chỉ đệ quy vào nửa chứa vị trí k − 1 (quickselect, trung bình O(n)).',
      inputs: inputs, ref: ref
    }));
  })();

  // ============ D13: Căn bậc hai nguyên ============
  (function () {
    function ref(s) { var n = ints(s)[0]; return String(Math.floor(Math.sqrt(n))); }
    var g = mk(144), inputs = ['16', '8', '0', '1', '2', '3', '4', '65535', '65536', '999999999', '1000000000', '123456789'], t;
    for (t = 0; t < 4; t++) inputs.push(String(g.int(100000, 1000000000)));
    P.push(problem({
      id: 'd13', level: 'mid', tags: ['tìm kiếm nhị phân', 'tràn số'], title: 'Căn bậc hai không dùng căn',
      story: '<p>Máy tính của bạn bị hỏng phím <code>√</code>. Cho số nguyên không âm <b>n</b>, hãy tính <b>phần nguyên của căn bậc hai</b>, tức số nguyên lớn nhất <i>x</i> thỏa <i>x × x ≤ n</i>, và <b>không được dùng</b> <code>sqrt</code>.</p><p>Với n tới 10<sup>9</sup>, hãy dùng <b>tìm kiếm nhị phân</b> trên đáp án. Cảnh báo cái bẫy: <code>int</code> chỉ chứa tới khoảng 2,1 tỷ, nên <code>mid * mid</code> có thể <b>tràn số</b> khi mid lớn và cho kết quả sai. Hãy so sánh theo kiểu <code>mid &lt;= n / mid</code> để tránh nhân.</p>',
      io: { inp: 'Một số nguyên <code>n</code> (0 ≤ n ≤ 1 000 000 000).', out: 'Phần nguyên căn bậc hai của n.' },
      starter: String.raw`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    // Với n < 2 đáp án chính là n. Ngược lại tìm nhị phân đáp án trong đoạn [1, n]

    return 0;
}
`,
      solution: String.raw`#include <stdio.h>

int main() {
    int n, lo = 1, hi, mid, ans = 0;
    scanf("%d", &n);
    if (n < 2) {
        printf("%d\n", n);
        return 0;
    }
    hi = n;
    while (lo <= hi) {
        mid = lo + (hi - lo) / 2;
        if (mid <= n / mid) {
            ans = mid;
            lo = mid + 1;
        } else {
            hi = mid - 1;
        }
    }
    printf("%d\n", ans);
    return 0;
}
`,
      hint: 'Giữ ans là giá trị mid lớn nhất vẫn thỏa mid × mid ≤ n. Nếu mid thỏa thì thử lớn hơn (lo = mid + 1), nếu không thì thử nhỏ hơn (hi = mid − 1). Điều kiện “mid × mid ≤ n” viết an toàn thành mid ≤ n / mid (phép chia nguyên). Cẩn thận chia cho 0: xử lý riêng n < 2 rồi cho mid chạy từ 1 trở đi.',
      inputs: inputs, ref: ref
    }));
  })();

  // ============ D14: Số xuất hiện nhiều nhất ============
  (function () {
    function ref(s) {
      var v = ints(s), n = v[0], a = v.slice(1, 1 + n), cnt = {}, best = -1, bv = 0;
      a.forEach(function (x) { cnt[x] = (cnt[x] || 0) + 1; });
      Object.keys(cnt).map(Number).sort(function (x, y) { return x - y; }).forEach(function (x) { if (cnt[x] > best) { best = cnt[x]; bv = x; } });
      return bv + ' ' + best;
    }
    var g = mk(155), inputs = ['7\n3 1 3 2 1 3 2', '1\n5', '4\n1 2 3 4', '6\n9 9 8 8 7 7'], t;
    for (t = 0; t < 4; t++) { var n = g.int(20, 200); inputs.push(n + '\n' + g.arr(n, 0, 30).join(' ')); }
    for (t = 0; t < 4; t++) { var n2 = g.int(50, 200); inputs.push(n2 + '\n' + g.arr(n2, 0, 1000).join(' ')); }
    P.push(problem({
      id: 'd14', level: 'easy', tags: ['bảng tần suất', 'mảng đếm'], title: 'Món được chọn nhiều nhất',
      story: '<p>Quán cơm trưa ghi lại mã số của <b>n</b> suất ăn đã bán (mỗi mã là một số từ 0 đến 1000). Chủ quán muốn biết <b>món nào bán chạy nhất</b>: mã món có số lần xuất hiện nhiều nhất và số lần đó. Nếu có nhiều món bằng nhau, chọn mã <b>nhỏ nhất</b>.</p><p>Mẹo: vì mã chỉ nằm trong [0, 1000], bạn có thể dùng một mảng đếm <code>dem[1001]</code> thay vì so sánh từng cặp.</p>',
      io: { inp: 'Dòng 1: <code>n</code> (1 ≤ n ≤ 200).\nDòng 2: n số nguyên trong [0, 1000].', out: 'Hai số <code>x c</code>: mã bán chạy nhất và số lần xuất hiện.' },
      starter: String.raw`#include <stdio.h>

int dem[1001];

int main() {
    int n, x, i;
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        scanf("%d", &x);
        // dem[x]++
    }
    // Tìm mã có dem lớn nhất (nhỏ nhất nếu hòa)

    return 0;
}
`,
      solution: String.raw`#include <stdio.h>

int dem[1001];

int main() {
    int n, x, i, best = 0;
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        scanf("%d", &x);
        dem[x]++;
    }
    for (i = 0; i <= 1000; i++) {
        if (dem[i] > dem[best]) best = i;
    }
    printf("%d %d\n", best, dem[best]);
    return 0;
}
`,
      hint: 'Duyệt i từ 0 lên 1000 và chỉ cập nhật khi dem[i] LỚN HƠN HẲN dem[best] (dấu >, không phải >=). Nhờ vậy khi hòa, mã nhỏ hơn được giữ lại.',
      inputs: inputs, ref: ref
    }));
  })();

  // ============ D15: Đường xuống tam giác ============
  (function () {
    function ref(s) {
      var v = ints(s), n = v[0], p = 1, tri = [], i, j;
      for (i = 0; i < n; i++) { tri.push(v.slice(p, p + i + 1)); p += i + 1; }
      var dp = tri[n - 1].slice();
      for (i = n - 2; i >= 0; i--) for (j = 0; j <= i; j++) dp[j] = tri[i][j] + Math.min(dp[j], dp[j + 1]);
      return String(dp[0]);
    }
    var g = mk(166), inputs = ['4\n2\n3 4\n6 5 7\n4 1 8 3', '1\n7', '2\n1\n2 3'], t;
    for (t = 0; t < 8; t++) {
      var n = g.int(3, 20), rows = [], i;
      for (i = 0; i < n; i++) rows.push(g.arr(i + 1, 1, 99).join(' '));
      inputs.push(n + '\n' + rows.join('\n'));
    }
    P.push(problem({
      id: 'd15', level: 'mid', tags: ['quy hoạch động', 'tam giác'], title: 'Xuống núi tiết kiệm sức',
      story: '<p>Một ngọn núi được vẽ dưới dạng <b>tam giác số</b> gồm n hàng, hàng thứ <i>i</i> có <i>i</i> số (độ khó của từng điểm dừng chân). Bạn xuất phát từ đỉnh (hàng 1). Mỗi bước, từ ô <i>j</i> của hàng <i>i</i> bạn chỉ được xuống <b>ô <i>j</i></b> hoặc <b>ô <i>j+1</i></b> của hàng kế tiếp.</p><p>Tìm đường từ đỉnh xuống hàng đáy sao cho <b>tổng độ khó nhỏ nhất</b>. Ví dụ tam giác <code>2 / 3 4 / 6 5 7 / 4 1 8 3</code> cho đáp án 11 (2 + 3 + 5 + 1).</p>',
      io: { inp: 'Dòng 1: <code>n</code> (1 ≤ n ≤ 20).\nHàng thứ i (i = 1..n) gồm i số nguyên trong [1, 99].', out: 'Tổng nhỏ nhất của một đường đi từ đỉnh xuống đáy.' },
      starter: String.raw`#include <stdio.h>

int main() {
    int n, t[20][20], i, j;
    scanf("%d", &n);
    for (i = 0; i < n; i++)
        for (j = 0; j <= i; j++) scanf("%d", &t[i][j]);
    // Gợi ý: đi từ hàng cuối lên, t[i][j] += min(t[i+1][j], t[i+1][j+1])

    printf("%d\n", t[0][0]);
    return 0;
}
`,
      solution: String.raw`#include <stdio.h>

int main() {
    int n, t[20][20], i, j;
    scanf("%d", &n);
    for (i = 0; i < n; i++)
        for (j = 0; j <= i; j++) scanf("%d", &t[i][j]);
    for (i = n - 2; i >= 0; i--) {
        for (j = 0; j <= i; j++) {
            if (t[i + 1][j] < t[i + 1][j + 1]) t[i][j] += t[i + 1][j];
            else t[i][j] += t[i + 1][j + 1];
        }
    }
    printf("%d\n", t[0][0]);
    return 0;
}
`,
      hint: 'Làm “từ dưới lên”: chi phí tốt nhất bắt đầu tại ô (i, j) là t[i][j] + min(chi phí tốt nhất tại (i+1, j), (i+1, j+1)). Cập nhật trực tiếp vào chính mảng t từ hàng n − 2 lên hàng 0; đáp án nằm ở t[0][0].',
      inputs: inputs, ref: ref
    }));
  })();

  // ============ D16: Chuyến bay rẻ nhất ============
  (function () {
    function ref(s) {
      var v = ints(s), n = v[0], m = v[1], src = v[2], dst = v[3], INF = 1e9, w = [], i, j;
      for (i = 0; i < n; i++) { w.push([]); for (j = 0; j < n; j++) w[i].push(INF); }
      for (i = 0; i < m; i++) { var a = v[4 + 3 * i], b = v[5 + 3 * i], c = v[6 + 3 * i]; if (c < w[a][b]) w[a][b] = c; }
      var d = [], done = [];
      for (i = 0; i < n; i++) { d.push(INF); done.push(false); }
      d[src] = 0;
      for (i = 0; i < n; i++) {
        var u = -1;
        for (j = 0; j < n; j++) if (!done[j] && (u < 0 || d[j] < d[u])) u = j;
        if (u < 0 || d[u] >= INF) break;
        done[u] = true;
        for (j = 0; j < n; j++) if (w[u][j] < INF && d[u] + w[u][j] < d[j]) d[j] = d[u] + w[u][j];
      }
      return d[dst] >= INF ? '-1' : String(d[dst]);
    }
    var g = mk(177), inputs = ['5 6 0 4\n0 1 4\n0 2 1\n2 1 2\n1 3 1\n2 3 5\n3 4 3', '3 1 0 2\n0 1 5', '2 1 0 0\n0 1 1', '4 4 0 3\n0 1 1\n1 2 1\n2 3 1\n0 3 5'], t;
    for (t = 0; t < 9; t++) {
      var n = g.int(5, 15), m = g.int(n, 40), lines = [], i;
      for (i = 0; i < m; i++) lines.push(g.int(0, n - 1) + ' ' + g.int(0, n - 1) + ' ' + g.int(1, 20));
      inputs.push(n + ' ' + m + ' ' + g.int(0, n - 1) + ' ' + g.int(0, n - 1) + '\n' + lines.join('\n'));
    }
    P.push(problem({
      id: 'd16', level: 'hard', tags: ['Dijkstra', 'đồ thị có trọng số'], title: 'Chuyến bay rẻ nhất',
      story: '<p>Hãng hàng không có <b>n</b> thành phố (đánh số từ 0) và <b>m</b> chuyến bay một chiều, mỗi chuyến đi từ <i>u</i> đến <i>v</i> với giá vé <i>c</i>. Bạn muốn bay từ thành phố <b>s</b> đến thành phố <b>t</b> với <b>tổng tiền vé rẻ nhất</b> (được phép chuyển tiếp nhiều chặng).</p><p>Đây là bài toán <b>đường đi ngắn nhất</b> trên đồ thị có trọng số dương, kinh điển cho thuật toán <b>Dijkstra</b>. Có thể có nhiều chuyến bay cùng cặp (u, v) hoặc chuyến bay từ một thành phố về chính nó.</p>',
      io: { inp: 'Dòng 1: <code>n m s t</code> (2 ≤ n ≤ 15, 1 ≤ m ≤ 40).\nm dòng tiếp theo: <code>u v c</code> (0 ≤ u, v &lt; n, 1 ≤ c ≤ 20).', out: 'Tổng tiền vé nhỏ nhất từ s đến t, hoặc <code>-1</code> nếu không đến được.' },
      starter: String.raw`#include <stdio.h>

#define INF 1000000000

int w[15][15];
int dist[15];
int done[15];

int main() {
    int n, m, s, t, i, j, u, v, c;
    scanf("%d %d %d %d", &n, &m, &s, &t);
    for (i = 0; i < n; i++)
        for (j = 0; j < n; j++) w[i][j] = INF;
    for (i = 0; i < m; i++) {
        scanf("%d %d %d", &u, &v, &c);
        if (c < w[u][v]) w[u][v] = c;
    }
    // Dijkstra: mỗi lượt chốt đỉnh chưa chốt có dist nhỏ nhất rồi nới lỏng các cạnh ra khỏi nó

    return 0;
}
`,
      solution: String.raw`#include <stdio.h>

#define INF 1000000000

int w[15][15];
int dist[15];
int done[15];

int main() {
    int n, m, s, t, i, j, u, v, c;
    scanf("%d %d %d %d", &n, &m, &s, &t);
    for (i = 0; i < n; i++)
        for (j = 0; j < n; j++) w[i][j] = INF;
    for (i = 0; i < m; i++) {
        scanf("%d %d %d", &u, &v, &c);
        if (c < w[u][v]) w[u][v] = c;
    }
    for (i = 0; i < n; i++) { dist[i] = INF; done[i] = 0; }
    dist[s] = 0;
    for (i = 0; i < n; i++) {
        u = -1;
        for (j = 0; j < n; j++) {
            if (!done[j] && (u < 0 || dist[j] < dist[u])) u = j;
        }
        if (u < 0 || dist[u] >= INF) break;
        done[u] = 1;
        for (j = 0; j < n; j++) {
            if (w[u][j] < INF && dist[u] + w[u][j] < dist[j]) dist[j] = dist[u] + w[u][j];
        }
    }
    if (dist[t] >= INF) printf("-1\n");
    else printf("%d\n", dist[t]);
    return 0;
}
`,
      hint: 'Dùng ma trận trọng số w (INF nghĩa là không có chuyến), mảng dist (khởi tạo INF, dist[s] = 0) và mảng done. Lặp n lần: chọn đỉnh u chưa done có dist nhỏ nhất; nếu dist[u] vẫn là INF thì dừng; đánh dấu done rồi cập nhật dist[v] = min(dist[v], dist[u] + w[u][v]). Độ phức tạp O(n²).',
      inputs: inputs, ref: ref
    }));
  })();

  // ============ D17: Bảng xếp hạng ============
  (function () {
    function ref(s) {
      var w = words(s), n = Number(w[0]), a = [], i;
      for (i = 0; i < n; i++) a.push({ name: w[1 + 2 * i], score: Number(w[2 + 2 * i]) });
      a.sort(function (x, y) { return y.score - x.score || (x.name < y.name ? -1 : x.name > y.name ? 1 : 0); });
      return a.map(function (x) { return x.name + ' ' + x.score; }).join('\n');
    }
    var g = mk(188), inputs = ['4\nan 8\nbinh 9\nchi 8\ndung 10', '1\nzed 50', '3\nc 5\nb 5\na 5'], t;
    function name() { var L = 'abcdefghijklmnopqrstuvwxyz', r = '', k = g.int(2, 8), i; for (i = 0; i < k; i++) r += L[g.int(0, 25)]; return r; }
    for (t = 0; t < 8; t++) {
      var n = g.int(5, 30), seen = {}, lines = [];
      while (lines.length < n) { var nm = name(); if (!seen[nm]) { seen[nm] = 1; lines.push(nm + ' ' + g.int(0, 12) * 5); } }
      inputs.push(n + '\n' + lines.join('\n'));
    }
    P.push(problem({
      id: 'd17', level: 'mid', tags: ['struct', 'sắp xếp', 'chuỗi'], title: 'Bảng xếp hạng',
      story: '<p>Cuộc thi lập trình có <b>n</b> đội, mỗi đội có tên (chữ thường, không trùng nhau) và điểm. Hãy in bảng xếp hạng: đội <b>điểm cao hơn xếp trước</b>; nếu <b>bằng điểm</b> thì đội có <b>tên theo thứ tự từ điển nhỏ hơn</b> xếp trước.</p><p>Bài này luyện <code>struct</code>, hàm <code>strcmp</code> và một thuật toán sắp xếp theo <b>hai tiêu chí</b>.</p>',
      io: { inp: 'Dòng 1: <code>n</code> (1 ≤ n ≤ 30).\nn dòng tiếp theo: <code>tên điểm</code> (tên dài tối đa 10 ký tự, điểm là số nguyên 0..100).', out: 'n dòng <code>tên điểm</code> theo thứ tự xếp hạng.' },
      starter: String.raw`#include <stdio.h>
#include <string.h>

struct Doi {
    char ten[12];
    int diem;
};

int main() {
    struct Doi a[30], tam;
    int n, i, j;
    scanf("%d", &n);
    for (i = 0; i < n; i++) scanf("%s %d", a[i].ten, &a[i].diem);
    // Sắp xếp: điểm giảm dần, hòa điểm thì tên tăng dần (strcmp)

    for (i = 0; i < n; i++) printf("%s %d\n", a[i].ten, a[i].diem);
    return 0;
}
`,
      solution: String.raw`#include <stdio.h>
#include <string.h>

struct Doi {
    char ten[12];
    int diem;
};

int truoc(struct Doi x, struct Doi y) {
    if (x.diem != y.diem) return x.diem > y.diem;
    return strcmp(x.ten, y.ten) < 0;
}

int main() {
    struct Doi a[30], tam;
    int n, i, j;
    scanf("%d", &n);
    for (i = 0; i < n; i++) scanf("%s %d", a[i].ten, &a[i].diem);
    for (i = 1; i < n; i++) {
        tam = a[i];
        j = i - 1;
        while (j >= 0 && truoc(tam, a[j])) {
            a[j + 1] = a[j];
            j--;
        }
        a[j + 1] = tam;
    }
    for (i = 0; i < n; i++) printf("%s %d\n", a[i].ten, a[i].diem);
    return 0;
}
`,
      hint: 'Viết hàm so sánh truoc(x, y) trả về 1 nếu x phải đứng trước y: điểm lớn hơn, hoặc cùng điểm và strcmp(x.ten, y.ten) < 0. Sau đó dùng sắp xếp chèn (hoặc bất kỳ cách nào) với hàm so sánh đó. C cho phép gán nguyên một struct: tam = a[i];',
      inputs: inputs, ref: ref
    }));
  })();

  // ============ D18: Máy tính hậu tố ============
  (function () {
    function ref(s) {
      var w = words(s), k = Number(w[0]), st = [], i;
      for (i = 1; i <= k; i++) {
        var tk = w[i];
        if ('+-*/'.indexOf(tk) >= 0 && tk.length === 1) {
          var b = st.pop(), a = st.pop();
          st.push(tk === '+' ? a + b : tk === '-' ? a - b : tk === '*' ? a * b : Math.trunc(a / b));
        } else st.push(Number(tk));
      }
      return String(st[0]);
    }
    var g = mk(199), inputs = ['5\n3 4 + 2 *', '9\n5 1 2 + 4 * + 3 -', '1\n42', '3\n7 2 /', '3\n2 7 -', '3\n9 9 *'], t;
    function gen(leaves) {
      if (leaves === 1) { var v = g.int(1, 20); return { t: [String(v)], v: v }; }
      var l = g.int(1, leaves - 1), A = gen(l), B = gen(leaves - l), op;
      do { op = g.pick(['+', '-', '*', '/']); } while (op === '/' && B.v === 0);
      var val = op === '+' ? A.v + B.v : op === '-' ? A.v - B.v : op === '*' ? A.v * B.v : Math.trunc(A.v / B.v);
      return { t: A.t.concat(B.t, [op]), v: val };
    }
    for (t = 0; t < 8; t++) { var e = gen(g.int(3, 7)); inputs.push(e.t.length + '\n' + e.t.join(' ')); }
    P.push(problem({
      id: 'd18', level: 'mid', tags: ['ngăn xếp', 'biểu thức'], title: 'Máy tính hậu tố',
      story: '<p>Trong <b>kí pháp hậu tố</b> (Ba Lan ngược), toán tử đứng <b>sau</b> hai toán hạng của nó, nên không cần dấu ngoặc: <code>3 4 + 2 *</code> nghĩa là <code>(3 + 4) × 2 = 14</code>. Máy tính cầm tay đời đầu dùng cách này vì tính bằng <b>ngăn xếp</b> rất gọn: gặp số thì push; gặp toán tử thì pop hai số, tính, push kết quả lại.</p><p>Hãy tính giá trị biểu thức hậu tố. Phép chia là chia nguyên (cắt về phía 0) và đảm bảo không chia cho 0.</p>',
      io: { inp: 'Dòng 1: <code>k</code> số phần tử (1 ≤ k ≤ 20).\nDòng 2: k phần tử cách nhau khoảng trắng, là số nguyên không âm (≤ 20) hoặc một trong các toán tử <code>+ - * /</code>.', out: 'Giá trị của biểu thức (vừa trong kiểu <code>int</code>).' },
      starter: String.raw`#include <stdio.h>
#include <stdlib.h>

int main() {
    int k, i, st[30], top = -1;
    char tok[20];
    scanf("%d", &k);
    for (i = 0; i < k; i++) {
        scanf("%s", tok);
        // Nếu tok là toán tử: pop hai số, tính rồi push. Ngược lại push atoi(tok)
    }
    printf("%d\n", st[0]);
    return 0;
}
`,
      solution: String.raw`#include <stdio.h>
#include <stdlib.h>

int main() {
    int k, i, st[30], top = -1, a, b;
    char tok[20];
    scanf("%d", &k);
    for (i = 0; i < k; i++) {
        scanf("%s", tok);
        if (tok[1] == '\0' && (tok[0] == '+' || tok[0] == '-' || tok[0] == '*' || tok[0] == '/')) {
            b = st[top]; top--;
            a = st[top]; top--;
            if (tok[0] == '+') a = a + b;
            else if (tok[0] == '-') a = a - b;
            else if (tok[0] == '*') a = a * b;
            else a = a / b;
            top++;
            st[top] = a;
        } else {
            top++;
            st[top] = atoi(tok);
        }
    }
    printf("%d\n", st[top]);
    return 0;
}
`,
      hint: 'Chú ý thứ tự toán hạng: khi pop, số lấy ra ĐẦU TIÊN là toán hạng bên phải (b), số lấy ra tiếp theo là toán hạng bên trái (a), và kết quả là a op b. Điều này quan trọng với phép trừ và chia. Nhận biết toán tử: token dài đúng 1 ký tự và là một trong + − * /.',
      inputs: inputs, ref: ref
    }));
  })();

  // ============ D19: Tổ tiên chung gần nhất ============
  (function () {
    function ref(s) {
      var v = ints(s), n = v[0], keys = v.slice(1, 1 + n), a = v[1 + n], b = v[2 + n], root = null;
      function ins(nd, k) { if (!nd) return { k: k, l: null, r: null }; if (k < nd.k) nd.l = ins(nd.l, k); else nd.r = ins(nd.r, k); return nd; }
      keys.forEach(function (k) { root = ins(root, k); });
      var cur = root;
      while (cur) { if (a < cur.k && b < cur.k) cur = cur.l; else if (a > cur.k && b > cur.k) cur = cur.r; else return String(cur.k); }
      return '-1';
    }
    var g = mk(210), inputs = ['7\n50 30 70 20 40 60 80\n20 40', '7\n50 30 70 20 40 60 80\n20 80', '7\n50 30 70 20 40 60 80\n20 30', '1\n5\n5 5'], t;
    for (t = 0; t < 8; t++) {
      var n = g.int(5, 30), keys = [], used = {};
      while (keys.length < n) { var k = g.int(1, 100); if (!used[k]) { used[k] = 1; keys.push(k); } }
      inputs.push(n + '\n' + keys.join(' ') + '\n' + g.pick(keys) + ' ' + g.pick(keys));
    }
    P.push(problem({
      id: 'd19', level: 'hard', tags: ['cây nhị phân tìm kiếm', 'tổ tiên chung'], title: 'Tổ tiên chung gần nhất',
      story: '<p>Gia phả của một dòng họ được lưu bằng <b>cây nhị phân tìm kiếm</b>: các số được chèn lần lượt vào cây (nhỏ hơn đi trái, lớn hơn đi phải). Cho hai người <b>a</b> và <b>b</b> đều có trong cây, hãy tìm <b>tổ tiên chung gần nhất</b> (LCA): nút sâu nhất mà cả a và b đều nằm trong cây con của nó. Một nút được coi là tổ tiên của chính nó.</p><p>Nhờ tính chất BST, bạn <b>không cần tìm đường đi</b> tới a và b: đi từ gốc, nếu cả a, b đều nhỏ hơn nút hiện tại thì sang trái, đều lớn hơn thì sang phải, còn lại thì nút hiện tại chính là đáp án.</p>',
      io: { inp: 'Dòng 1: <code>n</code> (1 ≤ n ≤ 30).\nDòng 2: n khóa đôi một khác nhau trong [1, 100], chèn theo đúng thứ tự này.\nDòng 3: hai khóa <code>a b</code> đều thuộc cây (có thể bằng nhau).', out: 'Khóa của nút là LCA của a và b.' },
      starter: String.raw`#include <stdio.h>

int key[40], lc[40], rc[40];
int cnt = 0;

// Chèn khóa k vào BST dùng mảng: nút i có khóa key[i], con trái lc[i], con phải rc[i] (-1 nếu không có)
void them(int k) {
    int cur = 0;
    key[cnt] = k; lc[cnt] = -1; rc[cnt] = -1;
    cnt++;
    if (cnt == 1) return;
    while (1) {
        if (k < key[cur]) {
            if (lc[cur] == -1) { lc[cur] = cnt - 1; return; }
            cur = lc[cur];
        } else {
            if (rc[cur] == -1) { rc[cur] = cnt - 1; return; }
            cur = rc[cur];
        }
    }
}

int main() {
    int n, i, k, a, b, cur;
    scanf("%d", &n);
    for (i = 0; i < n; i++) { scanf("%d", &k); them(k); }
    scanf("%d %d", &a, &b);
    // Đi từ gốc (nút 0) tìm LCA

    return 0;
}
`,
      solution: String.raw`#include <stdio.h>

int key[40], lc[40], rc[40];
int cnt = 0;

void them(int k) {
    int cur = 0;
    key[cnt] = k; lc[cnt] = -1; rc[cnt] = -1;
    cnt++;
    if (cnt == 1) return;
    while (1) {
        if (k < key[cur]) {
            if (lc[cur] == -1) { lc[cur] = cnt - 1; return; }
            cur = lc[cur];
        } else {
            if (rc[cur] == -1) { rc[cur] = cnt - 1; return; }
            cur = rc[cur];
        }
    }
}

int main() {
    int n, i, k, a, b, cur = 0;
    scanf("%d", &n);
    for (i = 0; i < n; i++) { scanf("%d", &k); them(k); }
    scanf("%d %d", &a, &b);
    while (cur != -1) {
        if (a < key[cur] && b < key[cur]) cur = lc[cur];
        else if (a > key[cur] && b > key[cur]) cur = rc[cur];
        else break;
    }
    printf("%d\n", key[cur]);
    return 0;
}
`,
      hint: 'Bắt đầu cur = 0 (gốc). Lặp: nếu a và b đều nhỏ hơn key[cur] thì cur = lc[cur]; nếu đều lớn hơn thì cur = rc[cur]; ngược lại (a và b nằm hai phía, hoặc một trong hai bằng key[cur]) thì key[cur] chính là LCA.',
      inputs: inputs, ref: ref
    }));
  })();

  window.LESSONS.push.apply(window.LESSONS, P);
  window.TESTGEN = { mk: mk, ints: ints, words: words };
})();
