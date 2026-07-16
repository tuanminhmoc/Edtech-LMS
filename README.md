# Hướng dẫn chạy và tự deploy

## Chạy trên máy

Dùng Python:

```bash
python -m http.server 8080
```

Sau đó mở:

```text
http://localhost:8080
```

Hoặc dùng **Live Server** trong Visual Studio Code và mở file `index.html`.

## Tự deploy

Đây là website tĩnh. Chỉ cần tải toàn bộ thư mục dự án lên dịch vụ hosting có hỗ trợ HTML/CSS/JavaScript.

Đảm bảo giữ nguyên cấu trúc:

```text
index.html
css/
js/
assets/
manifest.webmanifest
sw.js
```

Website nên chạy bằng HTTPS để cài dạng web app và sử dụng offline.

## Kiểm tra trước khi deploy

```bash
npm install
npm run check
npm test
```

## Sao lưu dữ liệu

Dữ liệu nằm trên trình duyệt của từng thiết bị. Hãy dùng mục **Dữ liệu** trong ứng dụng để xuất bản sao lưu trước khi đổi máy hoặc xóa dữ liệu trình duyệt.
