# Chạy và tự deploy

## Chạy trên máy

```bash
python -m http.server 8080
```

Mở `http://localhost:8080`.

## Tự deploy

Tải nguyên thư mục dự án lên dịch vụ hosting tĩnh có HTTPS. Giữ nguyên:

```text
index.html
css/
js/
assets/
manifest.webmanifest
sw.js
```

## Kiểm tra trước khi deploy

```bash
npm install
npm run check
npm run fixtures
```

Visual regression:

```bash
npx playwright install chromium
npm run visual:update   # tạo baseline lần đầu
npm run visual          # so sánh với baseline
```

## Dữ liệu

Dữ liệu nằm trong IndexedDB của trình duyệt. Dùng mục **Dữ liệu** để xuất backup trước khi đổi máy hoặc xóa dữ liệu trình duyệt.
