# EdTech LMS Pro v1.0.1

## Chức năng chính

- Trắc nghiệm lớn với mục lục phân trang, tự lưu và khôi phục sau reload.
- Flashcard spaced repetition với Again, Hard, Good và Easy.
- Soạn trắc nghiệm 2–6 đáp án và flashcard, autosave, undo/redo, chọn nhiều, ảnh và LaTeX.
- Copy prompt và nhập JSON do công cụ AI bên ngoài tạo.
- IndexedDB, sao lưu/khôi phục, PWA offline và thư viện bộ đề cục bộ.
- Light/Dark theme có chuyển cảnh; Light là mặc định.
- Giao diện responsive, HUD mobile, hỗ trợ bàn phím và reduced motion.

## Chạy local

Có thể mở bằng một static server bất kỳ:

```bash
python -m http.server 8080
```

Sau đó mở `http://localhost:8080`.

## Deploy GitHub Pages

Workflow `.github/workflows/pages.yml` tự kiểm tra và deploy khi push lên `main` hoặc `master`. Trong Repository Settings → Pages, chọn **GitHub Actions** làm nguồn triển khai.

## Dữ liệu

Dữ liệu được lưu trong IndexedDB của đúng trình duyệt và thiết bị hiện tại. Dùng nút **Dữ liệu** trên header để xuất backup trước khi đổi máy hoặc xóa dữ liệu trình duyệt.
