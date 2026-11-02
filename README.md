# Học C và Cấu trúc dữ liệu

Web học lại lập trình C, cấu trúc dữ liệu và giải thuật từ đầu. Viết và chạy code C ngay trên trình duyệt, mỗi bài có bài tập tự chấm.

- **25 bài** chia 3 phần: Nhập môn C, Cấu trúc dữ liệu (danh sách liên kết, stack, queue, BST, bảng băm), Giải thuật (đệ quy, tìm kiếm, sắp xếp, đồ thị, quy hoạch động).
- Trang tĩnh thuần HTML/CSS/JS, không cần build hay cài đặt.
- Tiến độ và mã đã viết được lưu trong `localStorage` của trình duyệt.

## Chạy trên máy

Mở bằng một máy chủ tĩnh bất kỳ (Web Worker không chạy được khi mở trực tiếp bằng `file://`):

```bash
python -m http.server 8000
```

Rồi vào http://localhost:8000.

## Cách chạy code C

Code C chạy bằng [PicoC](https://github.com/jpoirier/picoc) biên dịch sang WebAssembly (gói npm `picoc-js` 1.0.12, giấy phép MIT, bản sao trong `vendor/`). Mỗi lần chạy nằm trong một Web Worker riêng để dừng được khi bị treo (giới hạn 5 giây).

`vendor/picoc.umd.js` đã được sửa nhẹ so với bản gốc: hàm `runC` nhận thêm tham số `onDone` (báo khi chạy xong) và `moduleOpts` (truyền `stdin`/`stdout` cho Emscripten).

`js/worker.js` xử lý các khác biệt của PicoC so với C chuẩn:

- Dòng cuối không có `\n` bị mất → bọc `main` để luôn `fflush(stdout)`.
- Tham số mảng `int a[]` bị truyền theo giá trị → đổi thành `int *a` (tương đương trong C chuẩn).

Hạn chế còn lại: `scanf("%f")` với `float` sai, hãy dùng `double` và `%lf`.

## Cấu trúc

```
index.html          khung trang
css/style.css       giao diện (có chế độ tối)
js/app.js           giao diện, trình soạn thảo, chấm bài
js/runner.js        chạy mã C trong Web Worker
js/worker.js        worker + xử lý khác biệt PicoC
js/lessons-*.js     nội dung bài học (lý thuyết, ví dụ, bài tập, test)
vendor/             PicoC (WASM)
```

## Thêm bài học

Thêm một object vào mảng trong `js/lessons-*.js` với các trường `id`, `group`, `title`, `html`, `code`, `ex` (`text`, `starter`, `solution`, `hint`, `tests`). Mỗi test gồm `input` (nội dung stdin) và `expected` (kết quả mong đợi, so sánh sau khi bỏ khoảng trắng cuối dòng).
