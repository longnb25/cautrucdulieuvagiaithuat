// Phần C: Giải thuật
window.LESSONS = window.LESSONS || [];
window.LESSONS.push(

{
  id: 'c1', group: 'C. Giải thuật', title: 'Đệ quy',
  html: `
    <p><b>Đệ quy</b> là hàm tự gọi lại chính nó để giải bài toán nhỏ hơn. Một hàm đệ quy đúng luôn có hai phần:</p>
    <ul>
      <li><b>Trường hợp cơ sở</b> (điểm dừng): đủ nhỏ để trả lời ngay, ví dụ <code>n == 0</code>.</li>
      <li><b>Bước đệ quy</b>: đưa bài toán về phiên bản nhỏ hơn rồi tin rằng lời gọi đó đúng.</li>
    </ul>
    <p>Quên điểm dừng sẽ làm chương trình gọi mãi cho đến khi tràn stack. Mỗi lời gọi chiếm một khung trong stack lời gọi hàm (xem lại bài Stack).</p>
    <p>Ví dụ dưới: giai thừa, Fibonacci, và tháp Hà Nội — bài toán mà đệ quy ngắn gọn hơn hẳn vòng lặp.</p>`,
  code: String.raw`#include <stdio.h>

int giaiThua(int n) {
    if (n <= 1) return 1;                 // điểm dừng
    return n * giaiThua(n - 1);           // bước đệ quy
}

int fib(int n) {
    if (n < 2) return n;
    return fib(n - 1) + fib(n - 2);
}

// Chuyển n đĩa từ cọc a sang cọc c, dùng cọc b làm trung gian
void hanoi(int n, char a, char b, char c) {
    if (n == 0) return;
    hanoi(n - 1, a, c, b);
    printf("Chuyển đĩa %d từ %c sang %c\n", n, a, c);
    hanoi(n - 1, b, a, c);
}

int main() {
    printf("5! = %d\n", giaiThua(5));
    printf("fib(10) = %d\n", fib(10));
    printf("Tháp Hà Nội với 3 đĩa:\n");
    hanoi(3, 'A', 'B', 'C');
    return 0;
}
`,
  ex: {
    text: 'Viết hàm đệ quy <code>int tongChuSo(int n)</code> tính tổng các chữ số của số nguyên không âm n (ví dụ 123 → 6).',
    starter: String.raw`#include <stdio.h>

int tongChuSo(int n) {
    // Điểm dừng? Bước đệ quy? (gợi ý: n % 10 và n / 10)
    return 0;
}

int main() {
    int n;
    scanf("%d", &n);
    printf("%d\n", tongChuSo(n));
    return 0;
}
`,
    solution: String.raw`#include <stdio.h>

int tongChuSo(int n) {
    if (n == 0) return 0;
    return n % 10 + tongChuSo(n / 10);
}

int main() {
    int n;
    scanf("%d", &n);
    printf("%d\n", tongChuSo(n));
    return 0;
}
`,
    hint: 'Chữ số cuối là n % 10, phần còn lại là n / 10. Điểm dừng: n == 0 trả về 0.',
    tests: [
      { input: '123\n', expected: '6' }, { input: '9\n', expected: '9' },
      { input: '0\n', expected: '0' }, { input: '9999\n', expected: '36' }
    ]
  }
},

{
  id: 'c2', group: 'C. Giải thuật', title: 'Tìm kiếm tuyến tính & nhị phân',
  html: `
    <ul>
      <li><b>Tìm tuyến tính</b>: xét lần lượt từng phần tử. Dùng được với mọi mảng, độ phức tạp O(n).</li>
      <li><b>Tìm nhị phân</b>: yêu cầu mảng đã <b>sắp xếp</b>. Mỗi bước so với phần tử giữa rồi loại bỏ một nửa. Độ phức tạp O(log n): mảng 1 triệu phần tử chỉ cần khoảng 20 bước.</li>
    </ul>
    <p>Ví dụ in ra từng bước của tìm nhị phân để bạn thấy khoảng tìm kiếm thu hẹp dần.</p>`,
  code: String.raw`#include <stdio.h>

int timTuyenTinh(int a[], int n, int x) {
    int i;
    for (i = 0; i < n; i++)
        if (a[i] == x) return i;
    return -1;
}

int timNhiPhan(int a[], int n, int x) {
    int l = 0, r = n - 1;
    while (l <= r) {
        int m = (l + r) / 2;
        printf("  xét a[%d] = %d\n", m, a[m]);
        if (a[m] == x) return m;
        if (a[m] < x) l = m + 1;
        else r = m - 1;
    }
    return -1;
}

int main() {
    int a[10] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    printf("Tìm 23 (tuyến tính): vị trí %d\n", timTuyenTinh(a, 10, 23));
    printf("Tìm 23 (nhị phân):\n");
    printf("-> vị trí %d\n", timNhiPhan(a, 10, 23));
    printf("Tìm 7 (nhị phân):\n");
    printf("-> vị trí %d\n", timNhiPhan(a, 10, 7));
    return 0;
}
`,
  ex: {
    text: 'Nhập <code>n</code>, rồi <code>n</code> số đã sắp xếp tăng dần, rồi số cần tìm <code>x</code>. Dùng tìm kiếm nhị phân và in vị trí (tính từ 0) của x, hoặc <code>-1</code> nếu không có.',
    starter: String.raw`#include <stdio.h>

int main() {
    int a[100], n, x, i;
    scanf("%d", &n);
    for (i = 0; i < n; i++) scanf("%d", &a[i]);
    scanf("%d", &x);
    // Tìm nhị phân với hai biên l, r

    printf("%d\n", -1);
    return 0;
}
`,
    solution: String.raw`#include <stdio.h>

int main() {
    int a[100], n, x, i;
    scanf("%d", &n);
    for (i = 0; i < n; i++) scanf("%d", &a[i]);
    scanf("%d", &x);
    int l = 0, r = n - 1, vt = -1;
    while (l <= r) {
        int m = (l + r) / 2;
        if (a[m] == x) { vt = m; break; }
        if (a[m] < x) l = m + 1;
        else r = m - 1;
    }
    printf("%d\n", vt);
    return 0;
}
`,
    hint: 'Lặp while (l <= r), m = (l + r) / 2. Nếu a[m] < x thì l = m + 1, nếu lớn hơn thì r = m - 1.',
    tests: [
      { input: '5\n1 3 5 7 9\n7\n', expected: '3' },
      { input: '5\n1 3 5 7 9\n4\n', expected: '-1' },
      { input: '1\n2\n2\n', expected: '0' },
      { input: '6\n1 2 3 4 5 6\n1\n', expected: '0' },
      { input: '6\n1 2 3 4 5 6\n6\n', expected: '5' }
    ]
  }
},

{
  id: 'c3', group: 'C. Giải thuật', title: 'Sắp xếp chọn & nổi bọt',
  html: `
    <p>Hai thuật toán sắp xếp cơ bản, đều O(n²), dễ hiểu nên là điểm khởi đầu tốt.</p>
    <ul>
      <li><b>Sắp xếp chọn</b> (selection sort): mỗi lượt tìm phần tử nhỏ nhất trong phần chưa sắp xếp rồi đổi chỗ về đầu phần đó. Số lần đổi chỗ chỉ khoảng n.</li>
      <li><b>Sắp xếp nổi bọt</b> (bubble sort): lần lượt so sánh hai phần tử kề nhau, đổi chỗ nếu sai thứ tự; phần tử lớn nhất “nổi” dần về cuối.</li>
    </ul>
    <p>Chạy ví dụ và theo dõi mảng thay đổi sau từng lượt.</p>`,
  code: String.raw`#include <stdio.h>

void in(int a[], int n) {
    int i;
    for (i = 0; i < n; i++) printf("%d ", a[i]);
    printf("\n");
}

void sapXepChon(int a[], int n) {
    int i, j;
    for (i = 0; i < n - 1; i++) {
        int min = i;
        for (j = i + 1; j < n; j++)
            if (a[j] < a[min]) min = j;
        int t = a[i]; a[i] = a[min]; a[min] = t;
        printf("lượt %d: ", i + 1);
        in(a, n);
    }
}

void noiBot(int a[], int n) {
    int i, j;
    for (i = 0; i < n - 1; i++) {
        int doi = 0;
        for (j = 0; j < n - 1 - i; j++) {
            if (a[j] > a[j + 1]) {
                int t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
                doi = 1;
            }
        }
        if (!doi) break;               // đã sắp xếp xong, dừng sớm
    }
}

int main() {
    int a[6] = {64, 25, 12, 22, 11, 90};
    printf("Ban đầu: ");
    in(a, 6);
    sapXepChon(a, 6);

    int b[6] = {5, 1, 4, 2, 8, 3};
    noiBot(b, 6);
    printf("Nổi bọt:  ");
    in(b, 6);
    return 0;
}
`,
  ex: {
    text: 'Nhập <code>n</code> và <code>n</code> số. Sắp xếp <b>tăng dần</b> bằng sắp xếp chọn và in các số cách nhau một khoảng trắng.',
    starter: String.raw`#include <stdio.h>

int main() {
    int a[100], n, i, j;
    scanf("%d", &n);
    for (i = 0; i < n; i++) scanf("%d", &a[i]);
    // Sắp xếp chọn

    for (i = 0; i < n; i++) printf("%d ", a[i]);
    printf("\n");
    return 0;
}
`,
    solution: String.raw`#include <stdio.h>

int main() {
    int a[100], n, i, j;
    scanf("%d", &n);
    for (i = 0; i < n; i++) scanf("%d", &a[i]);
    for (i = 0; i < n - 1; i++) {
        int min = i;
        for (j = i + 1; j < n; j++)
            if (a[j] < a[min]) min = j;
        int t = a[i]; a[i] = a[min]; a[min] = t;
    }
    for (i = 0; i < n; i++) printf("%d ", a[i]);
    printf("\n");
    return 0;
}
`,
    hint: 'Với mỗi i, tìm vị trí min của phần tử nhỏ nhất trong a[i..n-1] rồi đổi chỗ a[i] và a[min].',
    tests: [
      { input: '5\n5 2 9 1 3\n', expected: '1 2 3 5 9' },
      { input: '1\n4\n', expected: '4' },
      { input: '4\n-1 -5 3 0\n', expected: '-5 -1 0 3' },
      { input: '5\n2 2 1 1 2\n', expected: '1 1 2 2 2' }
    ]
  }
},

{
  id: 'c4', group: 'C. Giải thuật', title: 'Sắp xếp chèn',
  html: `
    <p><b>Sắp xếp chèn</b> (insertion sort) hoạt động như xếp bài trên tay: giữ phần đầu mảng đã sắp xếp, lần lượt lấy phần tử tiếp theo rồi <b>chèn</b> vào đúng chỗ bằng cách dịch các phần tử lớn hơn sang phải.</p>
    <ul>
      <li>Xấu nhất / trung bình O(n²), nhưng với mảng gần như đã sắp xếp thì chỉ O(n).</li>
      <li>Ổn định (giữ nguyên thứ tự hai phần tử bằng nhau) và chạy tại chỗ.</li>
      <li>Thực tế hay dùng cho mảng nhỏ.</li>
    </ul>`,
  code: String.raw`#include <stdio.h>

int main() {
    int a[6] = {9, 4, 7, 1, 8, 2};
    int n = 6, i, j;

    for (i = 1; i < n; i++) {
        int x = a[i];            // phần tử cần chèn
        j = i - 1;
        while (j >= 0 && a[j] > x) {
            a[j + 1] = a[j];     // dịch sang phải
            j--;
        }
        a[j + 1] = x;

        printf("sau khi chèn a[%d]: ", i);
        int k;
        for (k = 0; k < n; k++) printf("%d ", a[k]);
        printf("\n");
    }
    return 0;
}
`,
  ex: {
    text: 'Nhập <code>n</code> và <code>n</code> số. Sắp xếp <b>giảm dần</b> bằng sắp xếp chèn và in kết quả cách nhau một khoảng trắng.',
    starter: String.raw`#include <stdio.h>

int main() {
    int a[100], n, i, j;
    scanf("%d", &n);
    for (i = 0; i < n; i++) scanf("%d", &a[i]);
    // Sắp xếp chèn, thứ tự giảm dần

    for (i = 0; i < n; i++) printf("%d ", a[i]);
    printf("\n");
    return 0;
}
`,
    solution: String.raw`#include <stdio.h>

int main() {
    int a[100], n, i, j;
    scanf("%d", &n);
    for (i = 0; i < n; i++) scanf("%d", &a[i]);
    for (i = 1; i < n; i++) {
        int x = a[i];
        j = i - 1;
        while (j >= 0 && a[j] < x) {
            a[j + 1] = a[j];
            j--;
        }
        a[j + 1] = x;
    }
    for (i = 0; i < n; i++) printf("%d ", a[i]);
    printf("\n");
    return 0;
}
`,
    hint: 'Giống mẫu nhưng đổi điều kiện dịch chuyển từ a[j] > x thành a[j] < x.',
    tests: [
      { input: '5\n5 2 9 1 3\n', expected: '9 5 3 2 1' },
      { input: '1\n4\n', expected: '4' },
      { input: '4\n-1 -5 3 0\n', expected: '3 0 -1 -5' }
    ]
  }
},

{
  id: 'c5', group: 'C. Giải thuật', title: 'Sắp xếp trộn (Merge sort)',
  html: `
    <p>Chiến lược <b>chia để trị</b>: chia mảng làm đôi, sắp xếp từng nửa bằng đệ quy, rồi <b>trộn</b> hai nửa đã sắp xếp thành một mảng.</p>
    <ul>
      <li>Phép trộn hai dãy đã sắp xếp chỉ mất O(n): luôn so hai phần tử đầu của hai dãy và lấy cái nhỏ hơn.</li>
      <li>Độ sâu đệ quy là log₂ n, mỗi tầng tốn O(n), tổng <b>O(n log n)</b> trong mọi trường hợp.</li>
      <li>Đổi lại cần thêm O(n) bộ nhớ phụ.</li>
    </ul>`,
  code: String.raw`#include <stdio.h>

int tam[100];

// Trộn a[l..m] và a[m+1..r] (hai nửa đã sắp xếp)
void tron(int a[], int l, int m, int r) {
    int i = l, j = m + 1, k = l;
    while (i <= m && j <= r) {
        if (a[i] <= a[j]) tam[k++] = a[i++];
        else tam[k++] = a[j++];
    }
    while (i <= m) tam[k++] = a[i++];
    while (j <= r) tam[k++] = a[j++];
    for (k = l; k <= r; k++) a[k] = tam[k];
}

void mergeSort(int a[], int l, int r) {
    if (l >= r) return;                    // 0 hoặc 1 phần tử: đã xong
    int m = (l + r) / 2;
    mergeSort(a, l, m);
    mergeSort(a, m + 1, r);
    tron(a, l, m, r);
}

int main() {
    int a[8] = {38, 27, 43, 3, 9, 82, 10, 3};
    int i;
    mergeSort(a, 0, 7);
    for (i = 0; i < 8; i++) printf("%d ", a[i]);
    printf("\n");
    return 0;
}
`,
  ex: {
    text: 'Nhập mảng A (<code>n</code> rồi n số) và mảng B (<code>m</code> rồi m số), cả hai đã sắp xếp tăng. Trộn chúng thành một dãy tăng và in, cách nhau một khoảng trắng.',
    starter: String.raw`#include <stdio.h>

int main() {
    int a[100], b[100], c[200];
    int n, m, i, j, k;
    scanf("%d", &n);
    for (i = 0; i < n; i++) scanf("%d", &a[i]);
    scanf("%d", &m);
    for (j = 0; j < m; j++) scanf("%d", &b[j]);
    // Trộn a và b vào c

    for (k = 0; k < n + m; k++) printf("%d ", c[k]);
    printf("\n");
    return 0;
}
`,
    solution: String.raw`#include <stdio.h>

int main() {
    int a[100], b[100], c[200];
    int n, m, i, j, k;
    scanf("%d", &n);
    for (i = 0; i < n; i++) scanf("%d", &a[i]);
    scanf("%d", &m);
    for (j = 0; j < m; j++) scanf("%d", &b[j]);
    i = 0; j = 0; k = 0;
    while (i < n && j < m) {
        if (a[i] <= b[j]) { c[k] = a[i]; i++; }
        else { c[k] = b[j]; j++; }
        k++;
    }
    while (i < n) { c[k] = a[i]; i++; k++; }
    while (j < m) { c[k] = b[j]; j++; k++; }
    for (k = 0; k < n + m; k++) printf("%d ", c[k]);
    printf("\n");
    return 0;
}
`,
    hint: 'Hai chỉ số i, j; luôn lấy phần tử nhỏ hơn giữa a[i] và b[j]. Khi một mảng hết, chép nốt phần còn lại của mảng kia.',
    tests: [
      { input: '3\n1 4 7\n3\n2 3 8\n', expected: '1 2 3 4 7 8' },
      { input: '1\n5\n2\n1 9\n', expected: '1 5 9' },
      { input: '2\n1 2\n2\n3 4\n', expected: '1 2 3 4' }
    ]
  }
},

{
  id: 'c6', group: 'C. Giải thuật', title: 'Sắp xếp nhanh (Quick sort)',
  html: `
    <p><b>Quick sort</b> cũng chia để trị, nhưng việc khó nằm ở bước <b>phân hoạch</b> (partition) thay vì bước trộn:</p>
    <ol>
      <li>Chọn một phần tử làm <b>chốt</b> (pivot), ở đây là phần tử cuối.</li>
      <li>Sắp xếp lại sao cho mọi phần tử ≤ chốt nằm bên trái, còn lại nằm bên phải; chốt vào đúng vị trí cuối cùng của nó.</li>
      <li>Đệ quy sắp xếp phần bên trái và bên phải chốt.</li>
    </ol>
    <p>Trung bình O(n log n) và rất nhanh trong thực tế, không cần bộ nhớ phụ đáng kể. Trường hợp xấu nhất O(n²) xảy ra khi chốt luôn là phần tử nhỏ nhất hoặc lớn nhất (ví dụ mảng đã sắp xếp mà chọn chốt cuối).</p>`,
  code: String.raw`#include <stdio.h>

void hoanDoi(int *x, int *y) {
    int t = *x; *x = *y; *y = t;
}

// Phân hoạch kiểu Lomuto, chốt là a[hi]; trả về vị trí cuối cùng của chốt
int phanHoach(int a[], int lo, int hi) {
    int chot = a[hi];
    int i = lo - 1, j;
    for (j = lo; j < hi; j++) {
        if (a[j] <= chot) {
            i++;
            hoanDoi(&a[i], &a[j]);
        }
    }
    hoanDoi(&a[i + 1], &a[hi]);
    return i + 1;
}

void quickSort(int a[], int lo, int hi) {
    if (lo >= hi) return;
    int p = phanHoach(a, lo, hi);
    quickSort(a, lo, p - 1);
    quickSort(a, p + 1, hi);
}

int main() {
    int a[8] = {10, 80, 30, 90, 40, 50, 70, 20};
    int i;
    quickSort(a, 0, 7);
    for (i = 0; i < 8; i++) printf("%d ", a[i]);
    printf("\n");
    return 0;
}
`,
  ex: {
    text: 'Chương trình sắp xếp nhanh đã viết sẵn, chỉ thiếu hàm <code>phanHoach</code> (kiểu Lomuto, chốt là <code>a[hi]</code>). Hãy hoàn thiện nó. Nhập <code>n</code> và <code>n</code> số, kết quả in tăng dần.',
    starter: String.raw`#include <stdio.h>

int phanHoach(int a[], int lo, int hi) {
    // Chọn chốt a[hi], đưa các phần tử <= chốt về bên trái,
    // đặt chốt vào vị trí đúng và trả về vị trí đó
    return lo;
}

void quickSort(int a[], int lo, int hi) {
    if (lo >= hi) return;
    int p = phanHoach(a, lo, hi);
    quickSort(a, lo, p - 1);
    quickSort(a, p + 1, hi);
}

int main() {
    int a[100], n, i;
    scanf("%d", &n);
    for (i = 0; i < n; i++) scanf("%d", &a[i]);
    quickSort(a, 0, n - 1);
    for (i = 0; i < n; i++) printf("%d ", a[i]);
    printf("\n");
    return 0;
}
`,
    solution: String.raw`#include <stdio.h>

int phanHoach(int a[], int lo, int hi) {
    int chot = a[hi];
    int i = lo - 1, j, t;
    for (j = lo; j < hi; j++) {
        if (a[j] <= chot) {
            i++;
            t = a[i]; a[i] = a[j]; a[j] = t;
        }
    }
    t = a[i + 1]; a[i + 1] = a[hi]; a[hi] = t;
    return i + 1;
}

void quickSort(int a[], int lo, int hi) {
    if (lo >= hi) return;
    int p = phanHoach(a, lo, hi);
    quickSort(a, lo, p - 1);
    quickSort(a, p + 1, hi);
}

int main() {
    int a[100], n, i;
    scanf("%d", &n);
    for (i = 0; i < n; i++) scanf("%d", &a[i]);
    quickSort(a, 0, n - 1);
    for (i = 0; i < n; i++) printf("%d ", a[i]);
    printf("\n");
    return 0;
}
`,
    hint: 'i = lo - 1; với j từ lo đến hi - 1: nếu a[j] <= chot thì i++ và đổi chỗ a[i], a[j]. Cuối cùng đổi chỗ a[i + 1] với a[hi] và trả về i + 1.',
    tests: [
      { input: '5\n5 2 9 1 3\n', expected: '1 2 3 5 9' },
      { input: '1\n4\n', expected: '4' },
      { input: '6\n3 3 3 1 1 2\n', expected: '1 1 2 3 3 3' },
      { input: '8\n10 80 30 90 40 50 70 20\n', expected: '10 20 30 40 50 70 80 90' }
    ]
  }
},

{
  id: 'c7', group: 'C. Giải thuật', title: 'Đồ thị: BFS và DFS',
  html: `
    <p><b>Đồ thị</b> gồm các <b>đỉnh</b> và <b>cạnh</b> nối chúng (mạng xã hội, bản đồ đường, mạng máy tính…). Cách biểu diễn đơn giản nhất là <b>ma trận kề</b>: <code>g[u][v] = 1</code> nếu có cạnh nối u và v.</p>
    <ul>
      <li><b>DFS</b> (duyệt theo chiều sâu): đi sâu hết mức có thể rồi mới quay lui. Cài bằng đệ quy (hoặc stack).</li>
      <li><b>BFS</b> (duyệt theo chiều rộng): thăm các đỉnh gần nhất trước, theo từng lớp. Cài bằng <b>queue</b>. BFS tìm được đường đi ít cạnh nhất.</li>
    </ul>
    <p>Cả hai đều O(V²) với ma trận kề (V là số đỉnh). Cần mảng <code>visited</code> để không thăm lại một đỉnh.</p>`,
  code: String.raw`#include <stdio.h>
#define N 6

int g[N][N];
int visited[N];

void themCanh(int u, int v) {
    g[u][v] = 1;
    g[v][u] = 1;
}

void dfs(int u) {
    int v;
    visited[u] = 1;
    printf("%d ", u);
    for (v = 0; v < N; v++)
        if (g[u][v] && !visited[v]) dfs(v);
}

void bfs(int s) {
    int q[N], dau = 0, cuoi = 0, u, v;
    visited[s] = 1;
    q[cuoi++] = s;
    while (dau < cuoi) {
        u = q[dau++];
        printf("%d ", u);
        for (v = 0; v < N; v++) {
            if (g[u][v] && !visited[v]) {
                visited[v] = 1;
                q[cuoi++] = v;
            }
        }
    }
}

int main() {
    int i, j;
    for (i = 0; i < N; i++) {
        visited[i] = 0;
        for (j = 0; j < N; j++) g[i][j] = 0;
    }
    //   0 - 1 - 3
    //   |   |
    //   2   4 - 5
    themCanh(0, 1); themCanh(0, 2); themCanh(1, 3);
    themCanh(1, 4); themCanh(4, 5);

    printf("DFS từ 0: ");
    dfs(0);
    printf("\n");

    for (i = 0; i < N; i++) visited[i] = 0;
    printf("BFS từ 0: ");
    bfs(0);
    printf("\n");
    return 0;
}
`,
  ex: {
    text: 'Nhập <code>n</code> (số đỉnh, đánh số từ 0) và <code>m</code> (số cạnh), rồi <code>m</code> cạnh vô hướng <code>u v</code>. In số <b>thành phần liên thông</b> của đồ thị.',
    starter: String.raw`#include <stdio.h>

int g[20][20];
int visited[20];
int n;

void dfs(int u) {
    // Đánh dấu u và đi tiếp các đỉnh kề chưa thăm
}

int main() {
    int m, i, j, u, v, dem = 0;
    scanf("%d %d", &n, &m);
    for (i = 0; i < n; i++) {
        visited[i] = 0;
        for (j = 0; j < n; j++) g[i][j] = 0;
    }
    for (i = 0; i < m; i++) {
        scanf("%d %d", &u, &v);
        g[u][v] = 1;
        g[v][u] = 1;
    }
    // Với mỗi đỉnh chưa thăm: dem++ rồi dfs

    printf("%d\n", dem);
    return 0;
}
`,
    solution: String.raw`#include <stdio.h>

int g[20][20];
int visited[20];
int n;

void dfs(int u) {
    int v;
    visited[u] = 1;
    for (v = 0; v < n; v++)
        if (g[u][v] && !visited[v]) dfs(v);
}

int main() {
    int m, i, j, u, v, dem = 0;
    scanf("%d %d", &n, &m);
    for (i = 0; i < n; i++) {
        visited[i] = 0;
        for (j = 0; j < n; j++) g[i][j] = 0;
    }
    for (i = 0; i < m; i++) {
        scanf("%d %d", &u, &v);
        g[u][v] = 1;
        g[v][u] = 1;
    }
    for (i = 0; i < n; i++) {
        if (!visited[i]) {
            dem++;
            dfs(i);
        }
    }
    printf("%d\n", dem);
    return 0;
}
`,
    hint: 'Mỗi lần gặp một đỉnh chưa thăm là bắt đầu một thành phần mới: tăng dem rồi gọi dfs để đánh dấu cả thành phần đó.',
    tests: [
      { input: '5 3\n0 1\n1 2\n3 4\n', expected: '2' },
      { input: '4 0\n', expected: '4' },
      { input: '3 3\n0 1\n1 2\n2 0\n', expected: '1' },
      { input: '6 2\n0 5\n2 3\n', expected: '4' }
    ]
  }
},

{
  id: 'c8', group: 'C. Giải thuật', title: 'Quy hoạch động cơ bản',
  html: `
    <p><b>Quy hoạch động</b> (Dynamic Programming) dùng khi bài toán có <b>bài toán con gối nhau</b>: cùng một bài toán con bị giải lại nhiều lần. Thay vì tính lại, ta <b>lưu kết quả</b> vào bảng.</p>
    <p>Ví dụ kinh điển: Fibonacci. Cách đệ quy ngây thơ gọi lại <code>fib(2)</code>, <code>fib(3)</code>… hàng nghìn lần, độ phức tạp mũ. Lưu kết quả vào mảng, mỗi giá trị chỉ tính một lần, còn <b>O(n)</b>.</p>
    <p>Hai cách viết: <b>từ trên xuống</b> (đệ quy có nhớ) và <b>từ dưới lên</b> (điền bảng theo thứ tự). Chạy ví dụ để so số lần gọi hàm.</p>`,
  code: String.raw`#include <stdio.h>

int soLanGoi = 0;

int fibNgayTho(int n) {
    soLanGoi++;
    if (n < 2) return n;
    return fibNgayTho(n - 1) + fibNgayTho(n - 2);
}

int fibDP(int n) {
    int f[50], i;
    f[0] = 0;
    f[1] = 1;
    for (i = 2; i <= n; i++) f[i] = f[i - 1] + f[i - 2];
    return f[n];
}

int main() {
    printf("fib(20) ngây thơ = %d, tốn %d lần gọi hàm\n", fibNgayTho(20), soLanGoi);
    printf("fib(20) quy hoạch động = %d, chỉ cần 20 bước\n", fibDP(20));
    printf("fib(40) quy hoạch động = %d\n", fibDP(40));
    return 0;
}
`,
  ex: {
    text: 'Bạn leo cầu thang <code>n</code> bậc, mỗi lần bước 1 hoặc 2 bậc. Có bao nhiêu cách leo lên đến bậc n? In ra kết quả (n ≤ 40). Gợi ý: <code>cach[i] = cach[i-1] + cach[i-2]</code>.',
    starter: String.raw`#include <stdio.h>

int main() {
    int n, i;
    int cach[50];
    scanf("%d", &n);
    // Điền bảng cach[1..n]

    printf("%d\n", cach[n]);
    return 0;
}
`,
    solution: String.raw`#include <stdio.h>

int main() {
    int n, i;
    int cach[50];
    scanf("%d", &n);
    cach[0] = 1;
    cach[1] = 1;
    for (i = 2; i <= n; i++) cach[i] = cach[i - 1] + cach[i - 2];
    printf("%d\n", cach[n]);
    return 0;
}
`,
    hint: 'Để đến bậc i, bước cuối cùng là từ bậc i-1 (1 bước) hoặc từ bậc i-2 (2 bước). Đặt cach[0] = cach[1] = 1.',
    tests: [
      { input: '1\n', expected: '1' }, { input: '2\n', expected: '2' },
      { input: '5\n', expected: '8' }, { input: '10\n', expected: '89' },
      { input: '30\n', expected: '1346269' }
    ]
  }
}

);
