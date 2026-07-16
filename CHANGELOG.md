# Changelog

## 1.1.2

- Tối ưu toàn bộ giao diện mobile cho dashboard, cấu hình học, trắc nghiệm, kết quả, flashcard, soạn đề, lịch sử và modal.
- Cân lại topbar, safe-area iPhone, khoảng cách, nút bấm và các bottom sheet.
- Lịch sử chuyển thành dạng card trên điện thoại; kết quả và HUD trắc nghiệm gọn hơn.
- Trình soạn đề mobile dùng lưới số cân giữa, editor một cột và thao tác chạm thoải mái hơn.
- README rút gọn, chỉ giữ cách chạy và tự deploy cơ bản.

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
