// Phần A: Nhập môn lập trình C
window.LESSONS = window.LESSONS || [];
window.LESSONS.push(

{
  id: 'a1', group: 'A. Nhập môn C', title: 'Chương trình đầu tiên',
  html: `
    <p>Mọi chương trình C đều bắt đầu chạy từ hàm <code>main</code>. Một chương trình tối thiểu gồm:</p>
    <ul>
      <li><code>#include &lt;stdio.h&gt;</code> — nạp thư viện nhập/xuất (có <code>printf</code>, <code>scanf</code>).</li>
      <li><code>int main() { ... }</code> — hàm chính, mã bên trong dấu ngoặc nhọn sẽ được chạy.</li>
      <li><code>printf("...")</code> — in chuỗi ra màn hình. <code>\\n</code> là ký tự xuống dòng.</li>
      <li><code>return 0;</code> — báo cho hệ điều hành là chương trình kết thúc bình thường.</li>
      <li>Mỗi câu lệnh kết thúc bằng dấu chấm phẩy <code>;</code>. Ghi chú dùng <code>//</code> hoặc <code>/* ... */</code>.</li>
    </ul>
    <p>Bấm <b>Chạy</b> (hoặc <kbd>Ctrl</kbd>+<kbd>Enter</kbd>) để xem kết quả. Thử sửa chuỗi trong <code>printf</code> rồi chạy lại.</p>`,
  code: String.raw`#include <stdio.h>

int main() {
    // In ra hai dòng chữ
    printf("Xin chào, thế giới!\n");
    printf("Tôi đang học lại C.\n");
    return 0;
}
`,
  ex: {
    text: 'In ra đúng hai dòng: <code>Hello, C!</code> rồi <code>I love DSA</code>.',
    starter: String.raw`#include <stdio.h>

int main() {
    // Viết lệnh in ra hai dòng ở đây

    return 0;
}
`,
    solution: String.raw`#include <stdio.h>

int main() {
    printf("Hello, C!\n");
    printf("I love DSA\n");
    return 0;
}
`,
    hint: 'Dùng hai lệnh printf, mỗi lệnh kết thúc bằng \\n.',
    tests: [{ input: '', expected: 'Hello, C!\nI love DSA' }]
  }
},

{
  id: 'a2', group: 'A. Nhập môn C', title: 'Biến và kiểu dữ liệu',
  html: `
    <p>Biến là ô nhớ có tên, lưu một giá trị thuộc một kiểu cố định. Các kiểu cơ bản:</p>
    <table>
      <tr><th>Kiểu</th><th>Ý nghĩa</th><th>printf</th></tr>
      <tr><td><code>int</code></td><td>số nguyên</td><td><code>%d</code></td></tr>
      <tr><td><code>float</code> / <code>double</code></td><td>số thực</td><td><code>%f</code> (in), <code>%.2f</code> lấy 2 chữ số lẻ</td></tr>
      <tr><td><code>char</code></td><td>một ký tự (thực chất là số mã ASCII)</td><td><code>%c</code> hoặc <code>%d</code></td></tr>
    </table>
    <p>Phép toán số học: <code>+ - * / %</code>. Lưu ý <b>chia hai số nguyên cho kết quả nguyên</b> (<code>7 / 2 = 3</code>), còn <code>%</code> lấy phần dư (<code>7 % 2 = 1</code>).</p>
    <p class="note">Trình chạy trên web dùng PicoC, một bộ thông dịch C nhỏ. Với số thực nên dùng <code>double</code>, đọc bằng <code>%lf</code>.</p>`,
  code: String.raw`#include <stdio.h>

int main() {
    int tuoi = 20;
    double chieuCao = 1.72;
    double pi = 3.14159265;
    char kyTu = 'A';

    printf("tuổi = %d\n", tuoi);
    printf("chiều cao = %.2f m\n", chieuCao);
    printf("pi = %.5f\n", pi);
    printf("ký tự %c có mã ASCII %d\n", kyTu, kyTu);
    printf("int chiếm %d byte\n", (int)sizeof(int));

    printf("7 / 2 = %d, 7 %% 2 = %d, 7 / 2.0 = %.1f\n", 7 / 2, 7 % 2, 7 / 2.0);
    return 0;
}
`,
  ex: {
    text: 'Cho sẵn <code>a = 17</code>, <code>b = 5</code>. In ra 5 dòng: <code>Tong: ..</code>, <code>Hieu: ..</code>, <code>Tich: ..</code>, <code>Thuong: ..</code> (chia nguyên), <code>Du: ..</code>.',
    starter: String.raw`#include <stdio.h>

int main() {
    int a = 17, b = 5;
    // In 5 dòng: Tong, Hieu, Tich, Thuong, Du

    return 0;
}
`,
    solution: String.raw`#include <stdio.h>

int main() {
    int a = 17, b = 5;
    printf("Tong: %d\n", a + b);
    printf("Hieu: %d\n", a - b);
    printf("Tich: %d\n", a * b);
    printf("Thuong: %d\n", a / b);
    printf("Du: %d\n", a % b);
    return 0;
}
`,
    hint: 'Dùng %d trong printf cho từng giá trị, ví dụ printf("Tong: %d\\n", a + b);',
    tests: [{ input: '', expected: 'Tong: 22\nHieu: 12\nTich: 85\nThuong: 3\nDu: 2' }]
  }
},

{
  id: 'a3', group: 'A. Nhập môn C', title: 'Nhập dữ liệu với scanf',
  html: `
    <p><code>scanf</code> đọc dữ liệu người dùng gõ vào. Cú pháp: <code>scanf("định dạng", &amp;biến);</code></p>
    <ul>
      <li>Dùng đúng định dạng: <code>%d</code> cho <code>int</code>, <code>%lf</code> cho <code>double</code>, <code>%c</code> cho <code>char</code>, <code>%s</code> cho chuỗi.</li>
      <li>Dấu <code>&amp;</code> là “lấy địa chỉ của biến” để <code>scanf</code> ghi giá trị vào đó (riêng chuỗi thì không cần <code>&amp;</code>).</li>
      <li>Có thể đọc nhiều giá trị một lần: <code>scanf("%d %d", &amp;a, &amp;b);</code></li>
    </ul>
    <p>Trên trang này, mục <b>Dữ liệu nhập</b> bên dưới trình soạn thảo chính là bàn phím của chương trình. Hãy sửa hai số trong đó rồi chạy lại.</p>`,
  code: String.raw`#include <stdio.h>

int main() {
    int a, b;
    printf("Nhập hai số nguyên: ");
    scanf("%d %d", &a, &b);
    printf("Tổng = %d\n", a + b);
    printf("Trung bình = %.1f\n", (a + b) / 2.0);
    return 0;
}
`,
  input: '3 4\n',
  ex: {
    text: 'Nhập bán kính <code>r</code> (số thực). In chu vi và diện tích hình tròn (π = 3.14159), mỗi giá trị 2 chữ số thập phân, theo dạng <code>Chu vi: ..</code> và <code>Dien tich: ..</code>. <i>Không in lời nhắc nhập.</i>',
    starter: String.raw`#include <stdio.h>

int main() {
    double r;
    // Đọc r bằng scanf("%lf", &r) rồi in kết quả

    return 0;
}
`,
    solution: String.raw`#include <stdio.h>

int main() {
    double r;
    scanf("%lf", &r);
    printf("Chu vi: %.2f\n", 2 * 3.14159 * r);
    printf("Dien tich: %.2f\n", 3.14159 * r * r);
    return 0;
}
`,
    hint: 'Chu vi = 2πr, diện tích = πr². Dùng %.2f để in 2 chữ số thập phân.',
    tests: [
      { input: '1\n', expected: 'Chu vi: 6.28\nDien tich: 3.14' },
      { input: '2\n', expected: 'Chu vi: 12.57\nDien tich: 12.57' },
      { input: '0.5\n', expected: 'Chu vi: 3.14\nDien tich: 0.79' }
    ]
  }
},

{
  id: 'a4', group: 'A. Nhập môn C', title: 'Rẽ nhánh if / else / switch',
  html: `
    <p>Rẽ nhánh cho chương trình chọn đường đi theo điều kiện.</p>
    <ul>
      <li><code>if (điều_kiện) { ... } else if (...) { ... } else { ... }</code></li>
      <li>So sánh: <code>== != &lt; &gt; &lt;= &gt;=</code>. Chú ý: so sánh bằng là <b>hai</b> dấu <code>==</code>, một dấu <code>=</code> là phép gán.</li>
      <li>Kết hợp điều kiện: <code>&amp;&amp;</code> (và), <code>||</code> (hoặc), <code>!</code> (phủ định).</li>
      <li><code>switch</code> chọn theo giá trị nguyên/ký tự; nhớ <code>break;</code> sau mỗi <code>case</code>.</li>
    </ul>`,
  code: String.raw`#include <stdio.h>

int main() {
    int diem;
    scanf("%d", &diem);

    if (diem >= 8) {
        printf("Giỏi\n");
    } else if (diem >= 6) {
        printf("Khá\n");
    } else if (diem >= 5) {
        printf("Trung bình\n");
    } else {
        printf("Yếu\n");
    }

    switch (diem) {
        case 10: printf("Tuyệt đối!\n"); break;
        case 0:  printf("Học lại nhé\n"); break;
        default: printf("(điểm %d)\n", diem);
    }
    return 0;
}
`,
  input: '9\n',
  ex: {
    text: 'Nhập số nguyên <code>n</code>. In <code>chan</code> nếu n chẵn, ngược lại in <code>le</code> (kể cả số âm).',
    starter: String.raw`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    // In chan hoặc le

    return 0;
}
`,
    solution: String.raw`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    if (n % 2 == 0) printf("chan\n");
    else printf("le\n");
    return 0;
}
`,
    hint: 'Số chẵn có n % 2 == 0. Với số âm, n % 2 có thể là -1 nên đừng kiểm tra n % 2 == 1.',
    tests: [
      { input: '4\n', expected: 'chan' }, { input: '7\n', expected: 'le' },
      { input: '0\n', expected: 'chan' }, { input: '-3\n', expected: 'le' }
    ]
  }
},

{
  id: 'a5', group: 'A. Nhập môn C', title: 'Vòng lặp for / while',
  html: `
    <p>Vòng lặp lặp lại một khối lệnh.</p>
    <ul>
      <li><code>for (khởi_tạo; điều_kiện; bước) { ... }</code> — dùng khi biết trước số lần lặp.</li>
      <li><code>while (điều_kiện) { ... }</code> — lặp khi điều kiện còn đúng (có thể không chạy lần nào).</li>
      <li><code>do { ... } while (điều_kiện);</code> — chạy ít nhất một lần.</li>
      <li><code>break</code> thoát hẳn vòng lặp; <code>continue</code> bỏ qua phần còn lại của lượt này.</li>
    </ul>
    <p class="note">Nếu viết vòng lặp vô hạn, trình chạy sẽ tự dừng sau 5 giây và báo cho bạn.</p>`,
  code: String.raw`#include <stdio.h>

int main() {
    int n = 5, i;

    int tong = 0;
    for (i = 1; i <= n; i++) {
        tong += i;
    }
    printf("1 + 2 + ... + %d = %d\n", n, tong);

    // Bảng cửu chương 7
    for (i = 1; i <= 10; i++) {
        printf("7 x %2d = %2d\n", i, 7 * i);
    }

    // while: đếm số chữ số của 12345
    int x = 12345, dem = 0;
    while (x > 0) {
        x = x / 10;
        dem++;
    }
    printf("12345 có %d chữ số\n", dem);
    return 0;
}
`,
  ex: {
    text: 'Nhập <code>n</code>. In tổng các số lẻ từ 1 đến n (ví dụ n = 5 thì 1 + 3 + 5 = 9).',
    starter: String.raw`#include <stdio.h>

int main() {
    int n, i, tong = 0;
    scanf("%d", &n);
    // Cộng dồn các số lẻ từ 1 đến n

    printf("%d\n", tong);
    return 0;
}
`,
    solution: String.raw`#include <stdio.h>

int main() {
    int n, i, tong = 0;
    scanf("%d", &n);
    for (i = 1; i <= n; i += 2) {
        tong += i;
    }
    printf("%d\n", tong);
    return 0;
}
`,
    hint: 'Cho i chạy từ 1 và tăng 2 mỗi lượt: i += 2.',
    tests: [
      { input: '5\n', expected: '9' }, { input: '10\n', expected: '25' },
      { input: '1\n', expected: '1' }, { input: '100\n', expected: '2500' }
    ]
  }
},

{
  id: 'a6', group: 'A. Nhập môn C', title: 'Hàm',
  html: `
    <p>Hàm gói một đoạn mã có tên để dùng lại nhiều lần: <code>kiểu_trả_về tên(tham_số) { ... return giá_trị; }</code></p>
    <ul>
      <li>Hàm không trả về gì thì dùng kiểu <code>void</code>.</li>
      <li>Hàm phải được khai báo <b>trước</b> chỗ gọi (hoặc khai báo nguyên mẫu ở đầu file).</li>
      <li>C truyền tham số <b>theo giá trị</b>: hàm nhận bản sao, sửa bản sao không ảnh hưởng biến gốc. (Muốn sửa biến gốc phải dùng con trỏ, xem bài sau.)</li>
    </ul>`,
  code: String.raw`#include <stdio.h>

int binhPhuong(int x) {
    return x * x;
}

int max2(int a, int b) {
    if (a > b) return a;
    return b;
}

void chao(int lan) {
    int i;
    for (i = 0; i < lan; i++) printf("Xin chào lần %d\n", i + 1);
}

void thuSua(int x) {
    x = 100;               // chỉ sửa bản sao
}

int main() {
    printf("5^2 = %d\n", binhPhuong(5));
    printf("max(3, 9) = %d\n", max2(3, 9));
    chao(2);

    int a = 1;
    thuSua(a);
    printf("a vẫn bằng %d\n", a);
    return 0;
}
`,
  ex: {
    text: 'Viết hàm <code>int giaiThua(int n)</code> trả về n! (0! = 1). Chương trình nhập n và in giaiThua(n).',
    starter: String.raw`#include <stdio.h>

int giaiThua(int n) {
    // Viết thân hàm ở đây
    return 0;
}

int main() {
    int n;
    scanf("%d", &n);
    printf("%d\n", giaiThua(n));
    return 0;
}
`,
    solution: String.raw`#include <stdio.h>

int giaiThua(int n) {
    int kq = 1, i;
    for (i = 2; i <= n; i++) kq *= i;
    return kq;
}

int main() {
    int n;
    scanf("%d", &n);
    printf("%d\n", giaiThua(n));
    return 0;
}
`,
    hint: 'Bắt đầu kq = 1, nhân lần lượt với 2, 3, ..., n.',
    tests: [
      { input: '0\n', expected: '1' }, { input: '5\n', expected: '120' },
      { input: '6\n', expected: '720' }, { input: '10\n', expected: '3628800' }
    ]
  }
},

{
  id: 'a7', group: 'A. Nhập môn C', title: 'Mảng',
  html: `
    <p>Mảng là dãy các phần tử cùng kiểu nằm liền nhau trong bộ nhớ. Chỉ số bắt đầu từ <b>0</b>.</p>
    <ul>
      <li>Khai báo: <code>int a[5];</code> hoặc có giá trị đầu <code>int a[5] = {4, 8, 15, 16, 23};</code></li>
      <li>Truy cập: <code>a[0]</code> là phần tử đầu, <code>a[4]</code> là phần tử cuối. Truy cập <code>a[5]</code> là <b>lỗi tràn mảng</b> (C không báo, kết quả không đoán trước).</li>
      <li>Số phần tử: <code>sizeof(a) / sizeof(a[0])</code>.</li>
      <li>Khi truyền mảng vào hàm, hàm làm việc trên chính mảng đó (không phải bản sao), và nên truyền kèm số phần tử.</li>
    </ul>`,
  code: String.raw`#include <stdio.h>

int tong(int a[], int n) {
    int s = 0, i;
    for (i = 0; i < n; i++) s += a[i];
    return s;
}

int main() {
    int a[5] = {4, 8, 15, 16, 23};
    int n = sizeof(a) / sizeof(a[0]);
    int i;

    printf("Mảng có %d phần tử: ", n);
    for (i = 0; i < n; i++) printf("%d ", a[i]);
    printf("\n");

    printf("Tổng = %d\n", tong(a, n));

    a[2] = 100;                 // sửa phần tử thứ 3
    printf("Sau khi sửa: a[2] = %d\n", a[2]);
    return 0;
}
`,
  ex: {
    text: 'Nhập <code>n</code> rồi <code>n</code> số nguyên. In số lớn nhất và nhỏ nhất theo dạng <code>Max: ..</code> và <code>Min: ..</code>.',
    starter: String.raw`#include <stdio.h>

int main() {
    int a[100], n, i;
    scanf("%d", &n);
    for (i = 0; i < n; i++) scanf("%d", &a[i]);
    // Tìm max, min

    return 0;
}
`,
    solution: String.raw`#include <stdio.h>

int main() {
    int a[100], n, i;
    scanf("%d", &n);
    for (i = 0; i < n; i++) scanf("%d", &a[i]);
    int max = a[0], min = a[0];
    for (i = 1; i < n; i++) {
        if (a[i] > max) max = a[i];
        if (a[i] < min) min = a[i];
    }
    printf("Max: %d\n", max);
    printf("Min: %d\n", min);
    return 0;
}
`,
    hint: 'Khởi tạo max và min bằng a[0] (không phải 0), rồi duyệt các phần tử còn lại.',
    tests: [
      { input: '5\n3 9 1 7 5\n', expected: 'Max: 9\nMin: 1' },
      { input: '1\n42\n', expected: 'Max: 42\nMin: 42' },
      { input: '4\n-5 -2 -9 -1\n', expected: 'Max: -1\nMin: -9' }
    ]
  }
},

{
  id: 'a8', group: 'A. Nhập môn C', title: 'Chuỗi ký tự',
  html: `
    <p>Trong C, chuỗi là mảng <code>char</code> kết thúc bằng ký tự đặc biệt <code>'\\0'</code>. Ví dụ <code>"abc"</code> chiếm 4 ô: <code>'a' 'b' 'c' '\\0'</code>.</p>
    <ul>
      <li>Nhớ khai báo đủ chỗ: <code>char s[50];</code></li>
      <li>Đọc một từ: <code>scanf("%s", s);</code> (không dùng <code>&amp;</code>). Dừng ở khoảng trắng.</li>
      <li>Thư viện <code>&lt;string.h&gt;</code>: <code>strlen</code> (độ dài), <code>strcpy</code> (chép), <code>strcat</code> (nối), <code>strcmp</code> (so sánh, trả 0 nếu bằng nhau).</li>
      <li>Không dùng <code>==</code> để so sánh hai chuỗi, phải dùng <code>strcmp</code>.</li>
    </ul>`,
  code: String.raw`#include <stdio.h>
#include <string.h>

int main() {
    char s[50];
    scanf("%s", s);

    printf("Chuỗi: %s\n", s);
    printf("Độ dài: %d\n", (int)strlen(s));

    // Đếm nguyên âm bằng cách duyệt từng ký tự đến khi gặp '\0'
    int i, nguyenAm = 0;
    for (i = 0; s[i] != '\0'; i++) {
        char c = s[i];
        if (c=='a' || c=='e' || c=='i' || c=='o' || c=='u') nguyenAm++;
    }
    printf("Số nguyên âm: %d\n", nguyenAm);

    char t[100];
    strcpy(t, s);
    strcat(t, "_copy");
    printf("Sau khi nối: %s\n", t);
    printf("So sánh với \"hello\": %d\n", strcmp(s, "hello"));
    return 0;
}
`,
  input: 'education\n',
  ex: {
    text: 'Nhập một từ (không có khoảng trắng). In từ đó <b>đảo ngược</b>.',
    starter: String.raw`#include <stdio.h>
#include <string.h>

int main() {
    char s[100];
    scanf("%s", s);
    // In s theo thứ tự ngược

    return 0;
}
`,
    solution: String.raw`#include <stdio.h>
#include <string.h>

int main() {
    char s[100];
    scanf("%s", s);
    int i;
    for (i = strlen(s) - 1; i >= 0; i--) printf("%c", s[i]);
    printf("\n");
    return 0;
}
`,
    hint: 'Duyệt i từ strlen(s) - 1 xuống 0 và in từng ký tự bằng %c.',
    tests: [
      { input: 'hello\n', expected: 'olleh' }, { input: 'abc\n', expected: 'cba' },
      { input: 'a\n', expected: 'a' }, { input: 'racecar\n', expected: 'racecar' }
    ]
  }
},

{
  id: 'a9', group: 'A. Nhập môn C', title: 'Con trỏ',
  html: `
    <p>Con trỏ là biến lưu <b>địa chỉ</b> của một biến khác. Đây là phần khó nhất và quan trọng nhất của C.</p>
    <ul>
      <li><code>int *p;</code> — p là con trỏ tới int.</li>
      <li><code>p = &amp;x;</code> — p giữ địa chỉ của x (<code>&amp;</code> = “địa chỉ của”).</li>
      <li><code>*p</code> — giá trị tại địa chỉ p đang trỏ tới (<code>*</code> = “giải tham chiếu”). Sửa <code>*p</code> là sửa chính x.</li>
      <li>Truyền con trỏ vào hàm để hàm sửa được biến gốc (ví dụ hàm <code>swap</code>).</li>
      <li>Tên mảng chính là địa chỉ phần tử đầu: <code>a[i]</code> tương đương <code>*(a + i)</code>.</li>
    </ul>`,
  code: String.raw`#include <stdio.h>

void hoanDoi(int *a, int *b) {
    int tam = *a;
    *a = *b;
    *b = tam;
}

int main() {
    int x = 10;
    int *p = &x;

    printf("x = %d, *p = %d\n", x, *p);
    *p = 99;                           // sửa x thông qua con trỏ
    printf("Sau khi *p = 99 thì x = %d\n", x);

    int u = 1, v = 2;
    hoanDoi(&u, &v);
    printf("Sau hoán đổi: u = %d, v = %d\n", u, v);

    int a[3] = {5, 6, 7};
    int *q = a;                        // q trỏ vào phần tử đầu
    printf("*q = %d, *(q+1) = %d, *(q+2) = %d\n", *q, *(q + 1), *(q + 2));
    return 0;
}
`,
  ex: {
    text: 'Viết hàm <code>void nhanDoi(int *p)</code> nhân đôi giá trị mà <code>p</code> trỏ tới. Chương trình nhập <code>x</code>, gọi <code>nhanDoi(&amp;x)</code> rồi in x.',
    starter: String.raw`#include <stdio.h>

void nhanDoi(int *p) {
    // Viết ở đây
}

int main() {
    int x;
    scanf("%d", &x);
    nhanDoi(&x);
    printf("%d\n", x);
    return 0;
}
`,
    solution: String.raw`#include <stdio.h>

void nhanDoi(int *p) {
    *p = *p * 2;
}

int main() {
    int x;
    scanf("%d", &x);
    nhanDoi(&x);
    printf("%d\n", x);
    return 0;
}
`,
    hint: 'Gán *p = *p * 2;',
    tests: [
      { input: '5\n', expected: '10' }, { input: '-3\n', expected: '-6' }, { input: '0\n', expected: '0' }
    ]
  }
},

{
  id: 'a10', group: 'A. Nhập môn C', title: 'Cấu trúc struct',
  html: `
    <p><code>struct</code> gộp nhiều biến thuộc các kiểu khác nhau thành một kiểu mới (ví dụ “sinh viên” có tên, tuổi, điểm).</p>
    <ul>
      <li>Truy cập thành viên bằng dấu chấm: <code>sv.tuoi</code>.</li>
      <li>Qua con trỏ dùng mũi tên: <code>p-&gt;tuoi</code> (tương đương <code>(*p).tuoi</code>).</li>
      <li>Có thể tạo mảng struct và truyền struct vào hàm (bản sao) hoặc con trỏ struct.</li>
    </ul>
    <p>Struct là nền tảng để làm danh sách liên kết, cây, … ở các bài sau.</p>`,
  code: String.raw`#include <stdio.h>
#include <string.h>

struct SinhVien {
    char ten[30];
    int tuoi;
    double diem;
};

void in(struct SinhVien sv) {
    printf("%s, %d tuổi, điểm %.1f\n", sv.ten, sv.tuoi, sv.diem);
}

void tangDiem(struct SinhVien *p, double them) {
    p->diem += them;
}

int main() {
    struct SinhVien a;
    strcpy(a.ten, "An");
    a.tuoi = 19;
    a.diem = 7.5;
    in(a);

    tangDiem(&a, 1.0);
    in(a);

    struct SinhVien lop[2];
    strcpy(lop[0].ten, "Binh"); lop[0].tuoi = 20; lop[0].diem = 8.0;
    strcpy(lop[1].ten, "Chi");  lop[1].tuoi = 21; lop[1].diem = 6.5;
    int i;
    for (i = 0; i < 2; i++) in(lop[i]);
    return 0;
}
`,
  ex: {
    text: 'Nhập 3 sinh viên, mỗi dòng gồm <code>ten diem</code> (tên không có khoảng trắng, điểm là số thực). In ra tên của sinh viên có điểm cao nhất (không có hai người trùng điểm cao nhất).',
    starter: String.raw`#include <stdio.h>

struct SV {
    char ten[30];
    double diem;
};

int main() {
    struct SV ds[3];
    int i;
    for (i = 0; i < 3; i++) scanf("%s %lf", ds[i].ten, &ds[i].diem);
    // Tìm và in tên người có điểm cao nhất

    return 0;
}
`,
    solution: String.raw`#include <stdio.h>

struct SV {
    char ten[30];
    double diem;
};

int main() {
    struct SV ds[3];
    int i, best = 0;
    for (i = 0; i < 3; i++) scanf("%s %lf", ds[i].ten, &ds[i].diem);
    for (i = 1; i < 3; i++) if (ds[i].diem > ds[best].diem) best = i;
    printf("%s\n", ds[best].ten);
    return 0;
}
`,
    hint: 'Giữ chỉ số best của người điểm cao nhất, so sánh ds[i].diem với ds[best].diem.',
    tests: [
      { input: 'an 7.5\nbinh 9.0\nchi 6.0\n', expected: 'binh' },
      { input: 'x 10\ny 3\nz 4\n', expected: 'x' },
      { input: 'p 1\nq 2\nr 8.5\n', expected: 'r' }
    ]
  }
},

{
  id: 'a11', group: 'A. Nhập môn C', title: 'Cấp phát động malloc / free',
  html: `
    <p>Mảng thường có kích thước cố định lúc viết chương trình. Muốn xin bộ nhớ <b>khi chương trình đang chạy</b> (số lượng chưa biết trước), dùng <b>cấp phát động</b> với <code>&lt;stdlib.h&gt;</code>:</p>
    <ul>
      <li><code>malloc(số_byte)</code> — xin vùng nhớ trên heap, trả về con trỏ. Thường viết <code>(int*)malloc(n * sizeof(int))</code>.</li>
      <li><code>free(p)</code> — trả vùng nhớ khi dùng xong. Quên <code>free</code> gây <b>rò rỉ bộ nhớ</b>.</li>
      <li><code>NULL</code> là con trỏ “không trỏ đâu cả”. Kiểm tra <code>p == NULL</code> trước khi dùng.</li>
    </ul>
    <p>Danh sách liên kết và cây ở phần B đều dựa trên <code>malloc</code>.</p>`,
  code: String.raw`#include <stdio.h>
#include <stdlib.h>

int main() {
    int n, i;
    scanf("%d", &n);

    int *a = (int*)malloc(n * sizeof(int));
    if (a == NULL) {
        printf("Không đủ bộ nhớ\n");
        return 1;
    }

    for (i = 0; i < n; i++) a[i] = (i + 1) * (i + 1);   // 1, 4, 9, ...

    int tong = 0;
    for (i = 0; i < n; i++) tong += a[i];
    printf("Tổng %d số chính phương đầu tiên = %d\n", n, tong);

    free(a);
    return 0;
}
`,
  input: '5\n',
  ex: {
    text: 'Nhập <code>n</code> rồi <code>n</code> số nguyên. Dùng <code>malloc</code> để lưu rồi in các số theo thứ tự <b>ngược lại</b>, cách nhau một khoảng trắng.',
    starter: String.raw`#include <stdio.h>
#include <stdlib.h>

int main() {
    int n, i;
    scanf("%d", &n);
    int *a = (int*)malloc(n * sizeof(int));
    // Đọc n số vào a, in ngược, rồi free(a)

    return 0;
}
`,
    solution: String.raw`#include <stdio.h>
#include <stdlib.h>

int main() {
    int n, i;
    scanf("%d", &n);
    int *a = (int*)malloc(n * sizeof(int));
    for (i = 0; i < n; i++) scanf("%d", &a[i]);
    for (i = n - 1; i >= 0; i--) printf("%d ", a[i]);
    printf("\n");
    free(a);
    return 0;
}
`,
    hint: 'Đọc bằng vòng for với scanf("%d", &a[i]), in bằng vòng for chạy ngược từ n - 1 xuống 0.',
    tests: [
      { input: '3\n1 2 3\n', expected: '3 2 1' }, { input: '1\n9\n', expected: '9' },
      { input: '5\n10 20 30 40 50\n', expected: '50 40 30 20 10' }
    ]
  }
}

);
