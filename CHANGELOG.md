# Changelog

## 1.2.0

- Tách QR donate khỏi HTML Base64 để giảm kích thước HTML và tăng tốc parse/cache.
- Xóa các ảnh concept cursor dung lượng lớn không dùng khi chạy.
- Chuyển cursor cú sang PNG native, bỏ hoàn toàn tracking chuột bằng JavaScript.
- Trì hoãn xử lý media của trình soạn đề đến thời gian rảnh để trang mở nhanh hơn.
- Thêm `content-visibility` và CSS containment cho danh sách dài.
- Giảm blur, bóng và animation nặng trên mobile/máy cấu hình thấp.
- Tải font không chặn render và bổ sung chế độ hiệu năng nhẹ tự động.
- Tối ưu lại PWA cache cho QR và cursor mới.

## 1.1.9

- Tối ưu giao diện mobile trên Android: chữ, nút bấm và khoảng cách lớn hơn, dễ chạm hơn.
- Thay cursor JavaScript bằng bộ cursor cú mèo native siêu nhẹ để giảm lag trên desktop.
- Thêm bộ asset cursor riêng cho dự án ở `assets/cursors/`.
- Giữ Dark Theme mặc định và tiếp tục tinh chỉnh trải nghiệm tổng thể.


## 1.1.8

- Sửa bộ cài Windows trỏ đúng GitHub Pages của repository `Edtech-LMS`.
- Tạo shortcut thật trên Desktop và Start Menu.
- Mở ứng dụng bằng cửa sổ app riêng trên Brave, Edge hoặc Chrome.
- Bộ cài tự đóng ngay sau khi tạo shortcut và khởi chạy ứng dụng.
- Cập nhật URL icon và URL public theo đường dẫn project Pages.

## 1.1.7

- Khôi phục luồng cài PWA native của Chrome, Edge và Brave.
- Chờ Service Worker sẵn sàng trước khi kết luận hộp cài không khả dụng.
- Thêm bộ cài Windows một file để tự tạo shortcut `.lnk` trên Desktop và Start Menu.
- Shortcut Windows mở EdTech trong cửa sổ app riêng bằng chế độ `--app` và dùng icon riêng.
- Bỏ hoàn toàn shortcut `.url` không ổn định.
- Giữ Dark Theme làm mặc định và giữ các tối ưu mobile từ bản trước.

## 1.1.5

- Đặt Dark Theme làm giao diện mặc định cho người dùng mới; lựa chọn Light/Dark vẫn được ghi nhớ.
- Khôi phục bắt sự kiện cài PWA từ đầu trang để Chrome, Edge và Brave tạo shortcut ứng dụng native.
- Thêm shortcut `.url` dự phòng trên Windows khi trình duyệt chưa cấp prompt cài.
- Ẩn thanh cuộn trên giao diện mobile nhưng vẫn giữ thao tác vuốt mượt và cuộn độc lập trong bottom sheet/modal.
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
