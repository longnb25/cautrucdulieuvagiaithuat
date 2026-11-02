# Học C và Cấu trúc dữ liệu

Web học lại lập trình C, cấu trúc dữ liệu và giải thuật từ đầu, giao diện xanh lá + đen kiểu terminal. Viết và chạy code C ngay trên trình duyệt, có demo trực quan từng bước và bài tập tự chấm nhiều test.

- **44 bài** chia 4 phần: A. Nhập môn C (11), B. Cấu trúc dữ liệu (6), C. Giải thuật (8), D. Bài toán vận dụng (19).
- **Demo trực quan** cho phần B và C: Big-O, danh sách liên kết, stack, queue vòng, BST, bảng băm (tương tác); tìm kiếm tuyến tính/nhị phân, sắp xếp nổi bọt/chọn/chèn/trộn/nhanh, tháp Hà Nội, ngăn xếp lời gọi, BFS/DFS, quy hoạch động (chạy từng bước, đổi dữ liệu tùy ý).
- **Bài toán vận dụng** (Hai món vừa ví, Mê cung thoát hiểm, Đổi tiền, Cái túi 0/1, Dijkstra, LCA trên BST, …) mỗi bài 11–16 test gồm test mẫu, test biên và test ngẫu nhiên.
- Trang tĩnh thuần HTML/CSS/JS, không cần build hay cài đặt. Tiến độ và mã đã viết được lưu trong `localStorage` của trình duyệt.

## Chạy trên máy

Mở bằng một máy chủ tĩnh bất kỳ (Web Worker không chạy được khi mở trực tiếp bằng `file://`):

```bash
python -m http.server 8000
```

Rồi vào http://localhost:8000.

## Cách chạy code C

Code C chạy bằng [PicoC](https://github.com/jpoirier/picoc) biên dịch sang WebAssembly (gói npm `picoc-js` 1.0.12, giấy phép MIT, bản sao trong `vendor/`). Mỗi lần chạy nằm trong một Web Worker riêng để dừng được khi bị treo (5 giây khi chạy tay, 4 giây mỗi test khi chấm). Khi chấm, tối đa 4 test chạy song song.

`vendor/picoc.umd.js` đã được sửa nhẹ so với bản gốc: hàm `runC` nhận thêm tham số `onDone` (báo khi chạy xong) và `moduleOpts` (truyền `stdin`/`stdout` cho Emscripten).

`js/worker.js` xử lý các khác biệt của PicoC so với C chuẩn:

- Dòng cuối không có `\n` bị mất → bọc `main` để luôn `fflush(stdout)`.
- Tham số mảng `int a[]` bị truyền theo giá trị → đổi thành `int *a` (tương đương trong C chuẩn).

Hạn chế còn lại của PicoC (cần tránh khi viết đề và lời giải):

- `scanf("%f")` với `float` sai: dùng `double` và `%lf`.
- Phép chia cho 0 ở vế phải của `&&`/`||` vẫn bị tính dù đã đoản mạch, và chương trình dừng im lặng.
- Không khởi tạo lồng nhau cho mảng struct (`{ {"a", 1}, {"b", 2} }`).

## Cấu trúc

```
index.html            khung trang
css/style.css         giao diện
js/app.js             giao diện, trình soạn thảo, chấm bài song song
js/runner.js          chạy mã C trong Web Worker
js/worker.js          worker + xử lý khác biệt PicoC
js/viz.js             demo trực quan và widget tương tác
js/lessons-c.js       phần A: nhập môn C
js/lessons-ds.js      phần B: cấu trúc dữ liệu
js/lessons-algo.js    phần C: giải thuật
js/lessons-apply.js   phần D: bài toán vận dụng (đề, lời giải, bộ sinh test)
js/tests-extra.js     bổ sung test cho phần A, B, C
vendor/               PicoC (WASM)
```

## Thêm bài học và test

Thêm một object vào mảng trong `js/lessons-*.js` với các trường `id`, `group`, `title`, `html`, `code`, `ex` (`text`, `starter`, `solution`, `hint`, `tests`). Mỗi test gồm `input` (nội dung stdin) và `expected` (so sánh sau khi bỏ khoảng trắng cuối dòng).

Với phần D, test được sinh bằng hạt giống cố định (kết quả lặp lại được) và kết quả mong đợi tính bằng một cài đặt JavaScript viết độc lập với lời giải C, nên lời giải C và bản JS kiểm chứng chéo lẫn nhau. Để thêm bài, dùng hàm `problem({ ... })` trong `js/lessons-apply.js` với `inputs` và `ref`.

Demo mới: thêm vào `REG` và `MAP` trong `js/viz.js`.
