// Phần B: Cấu trúc dữ liệu
window.LESSONS = window.LESSONS || [];
window.LESSONS.push(

{
  id: 'b1', group: 'B. Cấu trúc dữ liệu', title: 'Độ phức tạp thuật toán (Big-O)',
  html: `
    <p>Cùng một bài toán có nhiều cách giải. Để so sánh, ta đếm số bước thuật toán cần khi dữ liệu có kích thước <b>n</b> và quan tâm tốc độ tăng, bỏ qua hằng số. Ký hiệu <b>O(...)</b> nói “tăng cỡ này khi n lớn”.</p>
    <table>
      <tr><th>Độ phức tạp</th><th>Tên</th><th>Ví dụ</th><th>n = 1000 xấp xỉ</th></tr>
      <tr><td>O(1)</td><td>hằng số</td><td>truy cập <code>a[i]</code></td><td>1</td></tr>
      <tr><td>O(log n)</td><td>logarit</td><td>tìm kiếm nhị phân</td><td>10</td></tr>
      <tr><td>O(n)</td><td>tuyến tính</td><td>duyệt mảng, tìm max</td><td>1 000</td></tr>
      <tr><td>O(n log n)</td><td></td><td>sắp xếp trộn, nhanh</td><td>10 000</td></tr>
      <tr><td>O(n²)</td><td>bình phương</td><td>hai vòng for lồng nhau, sắp xếp nổi bọt</td><td>1 000 000</td></tr>
      <tr><td>O(2ⁿ)</td><td>mũ</td><td>Fibonacci đệ quy ngây thơ</td><td>không tưởng</td></tr>
    </table>
    <p>Chạy thử để thấy tận mắt: số phép lặp của ba đoạn mã khi n tăng 10 lần.</p>`,
  code: String.raw`#include <stdio.h>

int main() {
    int sizes[3] = {10, 100, 1000};
    int s, i, j;
    printf("n\tO(n)\tO(n^2)\tO(log n)\n");
    for (s = 0; s < 3; s++) {
        int n = sizes[s];
        int tuyenTinh = 0, binhPhuong = 0, logn = 0;

        for (i = 0; i < n; i++) tuyenTinh++;

        for (i = 0; i < n; i++)
            for (j = 0; j < n; j++) binhPhuong++;

        int k = n;
        while (k > 1) { k = k / 2; logn++; }

        printf("%d\t%d\t%d\t%d\n", n, tuyenTinh, binhPhuong, logn);
    }
    return 0;
}
`,
  ex: {
    text: 'Nhập <code>n</code>. Đếm xem phải chia nguyên n cho 2 bao nhiêu lần để được 1 (<code>n = n / 2</code>), rồi in số lần đó. Đây chính là O(log n).',
    starter: String.raw`#include <stdio.h>

int main() {
    int n, dem = 0;
    scanf("%d", &n);
    // Đếm số lần chia đôi

    printf("%d\n", dem);
    return 0;
}
`,
    solution: String.raw`#include <stdio.h>

int main() {
    int n, dem = 0;
    scanf("%d", &n);
    while (n > 1) {
        n = n / 2;
        dem++;
    }
    printf("%d\n", dem);
    return 0;
}
`,
    hint: 'while (n > 1) { n = n / 2; dem++; }',
    tests: [
      { input: '8\n', expected: '3' }, { input: '10\n', expected: '3' },
      { input: '1\n', expected: '0' }, { input: '1000\n', expected: '9' }
    ]
  }
},

{
  id: 'b2', group: 'B. Cấu trúc dữ liệu', title: 'Danh sách liên kết đơn',
  html: `
    <p>Mảng cần vùng nhớ liền nhau và chèn/xoá ở giữa phải dịch cả dãy. <b>Danh sách liên kết</b> chia dữ liệu thành các <b>nút</b> (node), mỗi nút chứa giá trị và con trỏ <code>next</code> tới nút kế tiếp. Nút cuối có <code>next = NULL</code>. Ta chỉ cần giữ con trỏ <code>head</code> tới nút đầu.</p>
    <table>
      <tr><th>Thao tác</th><th>Mảng</th><th>Danh sách liên kết</th></tr>
      <tr><td>Truy cập phần tử thứ i</td><td>O(1)</td><td>O(n)</td></tr>
      <tr><td>Thêm vào đầu</td><td>O(n)</td><td>O(1)</td></tr>
      <tr><td>Thêm vào cuối (chỉ có head)</td><td>O(1)*</td><td>O(n)</td></tr>
      <tr><td>Xoá khi đã biết nút</td><td>O(n)</td><td>O(1)</td></tr>
    </table>
    <p>Các hàm dưới đây nhận <code>head</code> và <b>trả về head mới</b>, vì head có thể thay đổi (ví dụ khi thêm vào đầu). Nhớ <code>free</code> nút khi xoá.</p>`,
  code: String.raw`#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node *next;
};

struct Node* taoNode(int x) {
    struct Node *p = (struct Node*)malloc(sizeof(struct Node));
    p->data = x;
    p->next = NULL;
    return p;
}

struct Node* themDau(struct Node *head, int x) {
    struct Node *p = taoNode(x);
    p->next = head;
    return p;
}

struct Node* themCuoi(struct Node *head, int x) {
    struct Node *p = taoNode(x);
    if (head == NULL) return p;
    struct Node *cur = head;
    while (cur->next != NULL) cur = cur->next;
    cur->next = p;
    return head;
}

struct Node* xoaGiaTri(struct Node *head, int x) {
    if (head == NULL) return NULL;
    if (head->data == x) {
        struct Node *t = head->next;
        free(head);
        return t;
    }
    struct Node *cur = head;
    while (cur->next != NULL && cur->next->data != x) cur = cur->next;
    if (cur->next != NULL) {
        struct Node *t = cur->next;
        cur->next = t->next;
        free(t);
    }
    return head;
}

void in(struct Node *head) {
    struct Node *cur = head;
    while (cur != NULL) {
        printf("%d -> ", cur->data);
        cur = cur->next;
    }
    printf("NULL\n");
}

int main() {
    struct Node *head = NULL;
    head = themCuoi(head, 10);
    head = themCuoi(head, 20);
    head = themCuoi(head, 30);
    head = themDau(head, 5);
    in(head);                      // 5 -> 10 -> 20 -> 30 -> NULL

    head = xoaGiaTri(head, 20);
    in(head);                      // 5 -> 10 -> 30 -> NULL

    head = xoaGiaTri(head, 5);
    in(head);                      // 10 -> 30 -> NULL
    return 0;
}
`,
  ex: {
    text: 'Nhập <code>n</code> rồi <code>n</code> số, đưa vào danh sách liên kết. Hoàn thiện hàm <code>daoNguoc</code> để <b>đảo ngược danh sách</b> bằng cách đổi hướng con trỏ <code>next</code>, rồi in các giá trị cách nhau một khoảng trắng.',
    starter: String.raw`#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node *next;
};

struct Node* themCuoi(struct Node *head, int x) {
    struct Node *p = (struct Node*)malloc(sizeof(struct Node));
    p->data = x;
    p->next = NULL;
    if (head == NULL) return p;
    struct Node *cur = head;
    while (cur->next != NULL) cur = cur->next;
    cur->next = p;
    return head;
}

struct Node* daoNguoc(struct Node *head) {
    // Gợi ý: dùng ba con trỏ prev, cur, next
    return head;
}

int main() {
    int n, i, x;
    struct Node *head = NULL;
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        scanf("%d", &x);
        head = themCuoi(head, x);
    }
    head = daoNguoc(head);
    struct Node *cur = head;
    while (cur != NULL) {
        printf("%d ", cur->data);
        cur = cur->next;
    }
    printf("\n");
    return 0;
}
`,
    solution: String.raw`#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node *next;
};

struct Node* themCuoi(struct Node *head, int x) {
    struct Node *p = (struct Node*)malloc(sizeof(struct Node));
    p->data = x;
    p->next = NULL;
    if (head == NULL) return p;
    struct Node *cur = head;
    while (cur->next != NULL) cur = cur->next;
    cur->next = p;
    return head;
}

struct Node* daoNguoc(struct Node *head) {
    struct Node *prev = NULL;
    struct Node *cur = head;
    struct Node *next;
    while (cur != NULL) {
        next = cur->next;
        cur->next = prev;
        prev = cur;
        cur = next;
    }
    return prev;
}

int main() {
    int n, i, x;
    struct Node *head = NULL;
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        scanf("%d", &x);
        head = themCuoi(head, x);
    }
    head = daoNguoc(head);
    struct Node *cur = head;
    while (cur != NULL) {
        printf("%d ", cur->data);
        cur = cur->next;
    }
    printf("\n");
    return 0;
}
`,
    hint: 'Mỗi bước: lưu next = cur->next; đổi cur->next = prev; rồi dịch prev = cur, cur = next. Kết thúc trả về prev.',
    tests: [
      { input: '4\n1 2 3 4\n', expected: '4 3 2 1' },
      { input: '1\n5\n', expected: '5' },
      { input: '3\n7 7 9\n', expected: '9 7 7' }
    ]
  }
},

{
  id: 'b3', group: 'B. Cấu trúc dữ liệu', title: 'Ngăn xếp (Stack)',
  html: `
    <p><b>Stack</b> là cấu trúc <b>vào sau – ra trước</b> (LIFO), như chồng đĩa: chỉ lấy hoặc đặt ở trên cùng.</p>
    <ul>
      <li><code>push(x)</code> — đẩy x lên đỉnh.</li>
      <li><code>pop()</code> — lấy phần tử ở đỉnh ra.</li>
      <li><code>peek()</code> — xem đỉnh, không lấy ra.</li>
      <li><code>rong()</code> — kiểm tra stack rỗng.</li>
    </ul>
    <p>Cài đặt bằng mảng với biến <code>top</code> là chỉ số đỉnh (<code>-1</code> nghĩa là rỗng). Cả bốn thao tác đều O(1). Stack dùng trong: kiểm tra ngoặc, đánh giá biểu thức, hoàn tác (undo), và chính lời gọi hàm đệ quy.</p>`,
  code: String.raw`#include <stdio.h>
#define MAX 100

int st[MAX];
int top = -1;

int rong() { return top == -1; }
int day()  { return top == MAX - 1; }

void push(int x) {
    if (day()) { printf("Stack đầy\n"); return; }
    top++;
    st[top] = x;
}

int pop() {
    if (rong()) { printf("Stack rỗng\n"); return -1; }
    int x = st[top];
    top--;
    return x;
}

int peek() { return st[top]; }

int main() {
    push(10);
    push(20);
    push(30);
    printf("Đỉnh: %d\n", peek());          // 30

    printf("Lấy ra lần lượt: ");
    while (!rong()) printf("%d ", pop());   // 30 20 10
    printf("\n");

    pop();                                  // thử lấy từ stack rỗng
    return 0;
}
`,
  ex: {
    text: 'Nhập một chuỗi chỉ gồm các ký tự <code>( ) [ ] { }</code> (không có khoảng trắng). In <code>hop le</code> nếu các ngoặc đóng/mở khớp nhau đúng thứ tự, ngược lại in <code>khong hop le</code>.',
    starter: String.raw`#include <stdio.h>

int main() {
    char s[200], st[200];
    int top = -1, i, ok = 1;
    scanf("%s", s);
    // Duyệt từng ký tự: ngoặc mở thì push, ngoặc đóng thì so với đỉnh stack

    if (ok) printf("hop le\n");
    else printf("khong hop le\n");
    return 0;
}
`,
    solution: String.raw`#include <stdio.h>

int main() {
    char s[200], st[200];
    int top = -1, i, ok = 1;
    scanf("%s", s);
    for (i = 0; s[i] != '\0'; i++) {
        char c = s[i];
        if (c == '(' || c == '[' || c == '{') {
            top++;
            st[top] = c;
        } else {
            if (top == -1) { ok = 0; break; }
            char o = st[top];
            top--;
            if ((c == ')' && o != '(') || (c == ']' && o != '[') || (c == '}' && o != '{')) {
                ok = 0;
                break;
            }
        }
    }
    if (top != -1) ok = 0;
    if (ok) printf("hop le\n");
    else printf("khong hop le\n");
    return 0;
}
`,
    hint: 'Gặp ngoặc đóng mà stack rỗng, hoặc ngoặc mở ở đỉnh không cùng loại → không hợp lệ. Cuối cùng stack phải rỗng.',
    tests: [
      { input: '([)]\n', expected: 'khong hop le' }, { input: '(((\n', expected: 'khong hop le' },
      { input: '()[]{}\n', expected: 'hop le' }, { input: '{[()]}\n', expected: 'hop le' },
      { input: '())\n', expected: 'khong hop le' }
    ]
  }
},

{
  id: 'b4', group: 'B. Cấu trúc dữ liệu', title: 'Hàng đợi (Queue)',
  html: `
    <p><b>Queue</b> là cấu trúc <b>vào trước – ra trước</b> (FIFO), như xếp hàng mua vé: thêm ở cuối (<code>enqueue</code>), lấy ở đầu (<code>dequeue</code>).</p>
    <p>Nếu cài bằng mảng ngây thơ, phần tử bị lấy ra để lại ô trống phía đầu không dùng lại được. Cách khắc phục là <b>hàng đợi vòng</b>: coi mảng như vòng tròn, chỉ số cuối được tính bằng phép <code>%</code>:</p>
    <ul>
      <li><code>front</code>: chỉ số phần tử đầu; <code>count</code>: số phần tử đang có.</li>
      <li>vị trí thêm mới: <code>(front + count) % MAX</code>.</li>
      <li>lấy ra: đọc <code>q[front]</code>, rồi <code>front = (front + 1) % MAX</code>.</li>
    </ul>
    <p>Queue dùng trong: lập lịch tiến trình, bộ đệm, và thuật toán duyệt đồ thị theo chiều rộng (BFS).</p>`,
  code: String.raw`#include <stdio.h>
#define MAX 5

int q[MAX];
int front = 0, count = 0;

void enqueue(int x) {
    if (count == MAX) { printf("Hàng đợi đầy\n"); return; }
    q[(front + count) % MAX] = x;
    count++;
}

int dequeue() {
    if (count == 0) { printf("Hàng đợi rỗng\n"); return -1; }
    int x = q[front];
    front = (front + 1) % MAX;
    count--;
    return x;
}

void in() {
    int i;
    printf("[");
    for (i = 0; i < count; i++) printf(" %d", q[(front + i) % MAX]);
    printf(" ]\n");
}

int main() {
    int i;
    for (i = 1; i <= 5; i++) enqueue(i);
    in();                                   // [ 1 2 3 4 5 ]
    enqueue(6);                             // đầy

    printf("Lấy ra %d và %d\n", dequeue(), dequeue());
    enqueue(6);
    enqueue(7);                             // quay vòng về đầu mảng
    in();                                   // [ 3 4 5 6 7 ]
    return 0;
}
`,
  ex: {
    text: 'Nhập <code>q</code> rồi <code>q</code> lệnh. Lệnh <code>1 x</code> thêm x vào hàng đợi; lệnh <code>2</code> lấy một phần tử ra và in nó, nếu hàng đợi rỗng thì in <code>rong</code>.',
    starter: String.raw`#include <stdio.h>
#define MAX 100

int q[MAX];
int front = 0, count = 0;

int main() {
    int n, i, cmd, x;
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        scanf("%d", &cmd);
        if (cmd == 1) {
            scanf("%d", &x);
            // enqueue x
        } else {
            // dequeue và in, hoặc in rong
        }
    }
    return 0;
}
`,
    solution: String.raw`#include <stdio.h>
#define MAX 100

int q[MAX];
int front = 0, count = 0;

int main() {
    int n, i, cmd, x;
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        scanf("%d", &cmd);
        if (cmd == 1) {
            scanf("%d", &x);
            q[(front + count) % MAX] = x;
            count++;
        } else {
            if (count == 0) {
                printf("rong\n");
            } else {
                printf("%d\n", q[front]);
                front = (front + 1) % MAX;
                count--;
            }
        }
    }
    return 0;
}
`,
    hint: 'Thêm: q[(front + count) % MAX] = x; count++. Lấy: in q[front], front = (front + 1) % MAX, count--.',
    tests: [
      { input: '5\n1 10\n1 20\n2\n1 30\n2\n', expected: '10\n20' },
      { input: '2\n2\n1 5\n', expected: 'rong' },
      { input: '4\n1 1\n2\n2\n1 2\n', expected: '1\nrong' }
    ]
  }
},

{
  id: 'b5', group: 'B. Cấu trúc dữ liệu', title: 'Cây nhị phân tìm kiếm (BST)',
  html: `
    <p><b>Cây nhị phân</b>: mỗi nút có tối đa hai con (trái, phải). <b>Cây nhị phân tìm kiếm</b> thêm quy tắc: với mọi nút, mọi giá trị ở cây con trái <b>nhỏ hơn</b> nút, ở cây con phải <b>lớn hơn</b>.</p>
    <ul>
      <li>Tìm kiếm / thêm: so sánh với nút hiện tại rồi đi trái hoặc phải. Trung bình O(log n), xấu nhất O(n) khi cây lệch thành một đường thẳng.</li>
      <li>Duyệt <b>giữa</b> (inorder: trái – nút – phải) in ra dãy đã <b>sắp xếp tăng</b>.</li>
      <li>Hầu hết thao tác trên cây dùng <b>đệ quy</b>: giải bài toán cho nút này bằng cách giải cho hai cây con.</li>
    </ul>`,
  code: String.raw`#include <stdio.h>
#include <stdlib.h>

struct Node {
    int key;
    struct Node *left;
    struct Node *right;
};

struct Node* them(struct Node *root, int k) {
    if (root == NULL) {
        struct Node *p = (struct Node*)malloc(sizeof(struct Node));
        p->key = k;
        p->left = NULL;
        p->right = NULL;
        return p;
    }
    if (k < root->key) root->left = them(root->left, k);
    else if (k > root->key) root->right = them(root->right, k);
    return root;                      // k đã tồn tại thì bỏ qua
}

int tim(struct Node *root, int k) {
    if (root == NULL) return 0;
    if (k == root->key) return 1;
    if (k < root->key) return tim(root->left, k);
    return tim(root->right, k);
}

void duyetGiua(struct Node *root) {
    if (root == NULL) return;
    duyetGiua(root->left);
    printf("%d ", root->key);
    duyetGiua(root->right);
}

int main() {
    int a[7] = {50, 30, 70, 20, 40, 60, 80};
    struct Node *root = NULL;
    int i;
    for (i = 0; i < 7; i++) root = them(root, a[i]);

    printf("Duyệt giữa (đã sắp xếp): ");
    duyetGiua(root);
    printf("\n");
    printf("Tìm 60: %d, tìm 65: %d\n", tim(root, 60), tim(root, 65));
    return 0;
}
`,
  ex: {
    text: 'Nhập <code>n</code> rồi <code>n</code> số, thêm vào BST. Viết hàm <code>chieuCao</code> trả về chiều cao cây (số mức; cây rỗng có chiều cao 0, cây một nút có chiều cao 1) và in nó.',
    starter: String.raw`#include <stdio.h>
#include <stdlib.h>

struct Node {
    int key;
    struct Node *left;
    struct Node *right;
};

struct Node* them(struct Node *root, int k) {
    if (root == NULL) {
        struct Node *p = (struct Node*)malloc(sizeof(struct Node));
        p->key = k;
        p->left = NULL;
        p->right = NULL;
        return p;
    }
    if (k < root->key) root->left = them(root->left, k);
    else if (k > root->key) root->right = them(root->right, k);
    return root;
}

int chieuCao(struct Node *root) {
    // Viết bằng đệ quy
    return 0;
}

int main() {
    int n, i, x;
    struct Node *root = NULL;
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        scanf("%d", &x);
        root = them(root, x);
    }
    printf("%d\n", chieuCao(root));
    return 0;
}
`,
    solution: String.raw`#include <stdio.h>
#include <stdlib.h>

struct Node {
    int key;
    struct Node *left;
    struct Node *right;
};

struct Node* them(struct Node *root, int k) {
    if (root == NULL) {
        struct Node *p = (struct Node*)malloc(sizeof(struct Node));
        p->key = k;
        p->left = NULL;
        p->right = NULL;
        return p;
    }
    if (k < root->key) root->left = them(root->left, k);
    else if (k > root->key) root->right = them(root->right, k);
    return root;
}

int chieuCao(struct Node *root) {
    if (root == NULL) return 0;
    int l = chieuCao(root->left);
    int r = chieuCao(root->right);
    if (l > r) return l + 1;
    return r + 1;
}

int main() {
    int n, i, x;
    struct Node *root = NULL;
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        scanf("%d", &x);
        root = them(root, x);
    }
    printf("%d\n", chieuCao(root));
    return 0;
}
`,
    hint: 'Chiều cao = 1 + max(chiều cao cây con trái, chiều cao cây con phải); cây rỗng trả 0.',
    tests: [
      { input: '3\n2 1 3\n', expected: '2' }, { input: '4\n1 2 3 4\n', expected: '4' },
      { input: '1\n5\n', expected: '1' }, { input: '7\n50 30 70 20 40 60 80\n', expected: '3' }
    ]
  }
},

{
  id: 'b6', group: 'B. Cấu trúc dữ liệu', title: 'Bảng băm (Hash table)',
  html: `
    <p><b>Bảng băm</b> cho phép thêm và tìm một giá trị với thời gian trung bình gần <b>O(1)</b>. Ý tưởng: dùng <b>hàm băm</b> biến khoá thành chỉ số mảng, ví dụ <code>k % SIZE</code>, rồi cất giá trị tại đó.</p>
    <ul>
      <li>Hai khoá khác nhau có thể cho cùng chỉ số — gọi là <b>va chạm</b> (collision).</li>
      <li>Cách xử lý đơn giản: <b>dò tuyến tính</b> (linear probing) — nếu ô bị chiếm thì thử ô kế tiếp (quay vòng).</li>
      <li>Bảng càng đầy thì va chạm càng nhiều và càng chậm, nên thường giữ bảng thưa (đầy dưới khoảng 70%).</li>
    </ul>
    <p>Trong ví dụ, các khoá 12, 23, 34 đều rơi vào ô 1 khi SIZE = 11; xem chúng được xếp liên tiếp ra sao.</p>`,
  code: String.raw`#include <stdio.h>
#define SIZE 11

int table[SIZE];
int used[SIZE];

int bam(int k) { return k % SIZE; }

void them(int k) {
    int i = bam(k);
    while (used[i]) i = (i + 1) % SIZE;      // dò tuyến tính
    used[i] = 1;
    table[i] = k;
}

int tim(int k) {
    int i = bam(k), dem = 0;
    while (used[i] && dem < SIZE) {
        if (table[i] == k) return i;
        i = (i + 1) % SIZE;
        dem++;
    }
    return -1;
}

int main() {
    int i;
    for (i = 0; i < SIZE; i++) used[i] = 0;

    int keys[5] = {12, 23, 34, 5, 16};
    for (i = 0; i < 5; i++) them(keys[i]);

    for (i = 0; i < SIZE; i++) {
        if (used[i]) printf("ô %2d: %d\n", i, table[i]);
    }
    printf("Tìm 34 -> ô %d; tìm 99 -> %d\n", tim(34), tim(99));
    return 0;
}
`,
  ex: {
    text: 'Nhập <code>n</code> rồi <code>n</code> số nguyên không âm (n ≤ 100). Dùng bảng băm kích thước 101 với dò tuyến tính để kiểm tra có số nào xuất hiện hai lần trở lên hay không. In <code>co trung</code> hoặc <code>khong trung</code>.',
    starter: String.raw`#include <stdio.h>
#define SIZE 101

int table[SIZE];
int used[SIZE];

// Trả về 1 nếu k đã có trong bảng; ngược lại thêm k vào bảng và trả về 0
int themNeuChua(int k) {
    // Viết ở đây
    return 0;
}

int main() {
    int n, i, x, trung = 0;
    for (i = 0; i < SIZE; i++) used[i] = 0;
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        scanf("%d", &x);
        if (themNeuChua(x)) trung = 1;
    }
    if (trung) printf("co trung\n");
    else printf("khong trung\n");
    return 0;
}
`,
    solution: String.raw`#include <stdio.h>
#define SIZE 101

int table[SIZE];
int used[SIZE];

int themNeuChua(int k) {
    int i = k % SIZE;
    while (used[i]) {
        if (table[i] == k) return 1;
        i = (i + 1) % SIZE;
    }
    used[i] = 1;
    table[i] = k;
    return 0;
}

int main() {
    int n, i, x, trung = 0;
    for (i = 0; i < SIZE; i++) used[i] = 0;
    scanf("%d", &n);
    for (i = 0; i < n; i++) {
        scanf("%d", &x);
        if (themNeuChua(x)) trung = 1;
    }
    if (trung) printf("co trung\n");
    else printf("khong trung\n");
    return 0;
}
`,
    hint: 'Bắt đầu tại i = k % SIZE. Trong khi ô i đang bị chiếm: nếu table[i] == k thì đã có → trả 1; ngược lại sang ô kế. Gặp ô trống thì ghi k vào.',
    tests: [
      { input: '5\n1 2 3 4 1\n', expected: 'co trung' },
      { input: '3\n7 8 9\n', expected: 'khong trung' },
      { input: '4\n101 202 303 404\n', expected: 'khong trung' },
      { input: '6\n101 202 5 106 5 7\n', expected: 'co trung' }
    ]
  }
}

);
