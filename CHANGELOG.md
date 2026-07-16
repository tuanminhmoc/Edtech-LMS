# Changelog


## 1.1.4

- Bỏ hướng dẫn DONATE trong intro; nút DONATE dùng hào quang nhẹ thường trực.
- Bỏ nhãn trạng thái “Đã lưu” khỏi giao diện soạn đề.
- Sửa căn giữa và kích thước ô số câu trên desktop, Android và iPhone.
- Nút Cài app gọi trực tiếp hộp cài PWA của Chrome/Edge khi khả dụng.
- Đổi biểu tượng cài app sang biểu tượng tải/cài để không nhầm với nút Trang chủ.
- Cập nhật cache PWA.

## 1.1.3

- Sửa các vùng Dark Theme còn nền sáng, chữ chìm hoặc tương phản gắt.
- Cân lại hướng dẫn DONATE trên desktop và mobile.
- Cải thiện preview trắc nghiệm, flashcard và thẻ tài khoản MB trong Dark Theme.
- Căn giữa số câu trong sidebar soạn đề và thu gọn tiêu đề mobile.
- Đổi nhãn chế độ soạn trắc nghiệm thành **TN**.
- Trắc nghiệm được cố định đúng 4 đáp án A–D; bỏ thêm/xóa đáp án.
- Chuẩn hóa import, export Excel và JSON theo cấu trúc 4 đáp án.
- Sửa luồng cài PWA trên desktop: bắt sự kiện cài sớm, đăng ký Service Worker sớm và thêm hướng dẫn theo trình duyệt khi prompt không khả dụng.
- Cập nhật manifest, cache và icon cài ứng dụng.

## 1.0.1

- Làm dịu toàn bộ bảng màu Dark Theme: nền xanh than trung tính, chữ trắng ngà, màu nhấn giảm độ chói và bóng đổ nhẹ hơn.
- Đồng bộ nút Câu trước / Câu tiếp về cùng kích thước, màu sắc, trạng thái hover và disabled trên desktop/mobile.
- Tăng tính nhất quán của card, lựa chọn, modal và trạng thái đúng/sai trong Dark Theme.

## 1.0.0

- Chuyển dữ liệu chính sang IndexedDB và tự động di chuyển dữ liệu LocalStorage cũ.
- Thêm backup/restore, storage persistence và thư viện bộ đề trên thiết bị.
- PWA offline, service worker, manifest và thông báo cập nhật.
- Lazy-load XLSX/MathJax; Web Worker xử lý Excel, JSON và backup.
- Virtualize bài trắc nghiệm; phục hồi bài đang làm sau reload.
- Nâng flashcard lên spaced repetition và phục hồi phiên.
- Trình soạn đề hỗ trợ 2–6 đáp án, metadata, undo/redo và multi-select.
- Thêm Light/Dark theme có animation, Light mặc định.
- Hash routing, mobile HUD, accessibility và GitHub Actions tests/deploy.
