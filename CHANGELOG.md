# Changelog

## 1.4.7
- iPhone/mobile polish: bỏ vùng cuộn nội bộ của đáp án trắc nghiệm, làm nổi tiến độ và tối ưu màn xem lại bài dark theme.
- Sửa audio unlock trên iOS để nhạc nền có thể bắt đầu sau thao tác người dùng/intro.
- Thu gọn card Lịch sử trên iPhone và thêm nút xóa toàn bộ lịch sử nhưng giữ XP/bộ đề.
- Cân lại Thư viện, tên bộ đề trong Soạn đề và Tóm tắt luyện tập trên màn hình iPhone.

## 1.4.6
- Chia nhạc nền thành 4 segment WebM nhỏ, mỗi file dưới 7 MB; phát nối tiếp và loop như một playlist duy nhất để tương thích giới hạn upload GitHub 25 MB/file.
- Giảm bitrate nhạc nền hợp lý để giảm kích thước repo mà vẫn giữ chất lượng piano nền.
- Làm lại cụm hành động card Thư viện: nút tải bộ đề thành thanh ngang riêng, màu phân cấp rõ và hỗ trợ chọn Excel / EdTech.
- Thu nhỏ cursor cú vector nhẹ để cân đối hơn trên desktop.
- Dọn asset showcase/duplicate không còn được tham chiếu để repo và ZIP gọn hơn.

- Sửa tận gốc intro bị chớp/nhảy vị trí: timeline chỉ khởi chạy sau khi JS đồng bộ frame đầu, giữ nguyên đủ khoảng 6.2 giây trước khi cho phép đóng.
- Sửa lỗi wordmark EdTech bị lệch sang phải do animation ghi đè translateX(-50%).
- Intro dùng SVG mascot nội tuyến và nền gradient/CSS, không dùng PNG mascot.
- Performance Lite không còn tắt animation mascot; Reduced Motion dùng timeline fade nhẹ 5.2 giây thay vì chớp bỏ qua.
- Loại bỏ thư mục mascot PNG legacy và chuyển toàn bộ tham chiếu mascot sang SVG vector.

## 1.4.4

- Làm lại intro cinematic 5–7 giây với chuyển động nhiều lớp, sweep ánh sáng và bố cục tối ưu cho mobile/desktop.
- Tạo bộ mascot cú vector mới và cursor cú SVG độ nét cao, không vỡ khi phóng lớn.
- Thêm nhạc nền piano có loop, điều chỉnh âm lượng, tắt riêng nhạc nền hoặc hiệu ứng; nhạc tạm dừng khi làm bài và tiếp tục đúng vị trí sau khi hoàn thành.
- Tăng lực nhấn nút bằng motion ngắn và âm thanh trầm hơn.
- Cân lại scale card Thư viện, ảnh mascot, metadata và vùng hành động.

## 1.4.3
- Rà lại toàn bộ UI/UX desktop, tablet và mobile sau nhánh kiến trúc v1.4.x.
- Tách nền mascot/cursor cú mèo và làm lại cách đặt mascot trong card thư viện để không còn ô ảnh trắng lệch tông.
- Khôi phục custom cursor trên desktop và giữ fallback chuẩn trên thiết bị cảm ứng.
- Đồng bộ logo theo light/dark theme bằng cùng một logo brand nhưng đổi palette theo theme.
- Làm gọn Flashcard: giảm chiều cao card, explanation/rating/controls gần nhau hơn và cố định bề mặt học trên mobile để hạn chế phải cuộn.
- Tăng tương phản chữ/HUD trong dark theme, đặc biệt vòng điểm, phím tắt và bốn nút Again/Hard/Good/Easy.
- Rút gọn tiêu đề dài bằng ellipsis ở topbar, kết quả, lịch sử và card thư viện.
- Bổ sung nút tải bộ đề trực tiếp với hộp chọn Excel `.xlsx` hoặc EdTech `.edtech`.
- Bổ sung xuất `.edtech` ngay trong trình Soạn đề, song song với Excel.
- Tinh chỉnh typography và độ nổi của nút theo hướng vui, rõ thao tác nhưng không sao chép bố cục Duolingo.
- Giữ nguyên toàn bộ intro, tăng safe-area, tránh crop trên màn thấp/mobile và làm fade/transition mượt hơn.

## 1.4.1
- Đồng bộ bộ nhận diện brand cú mèo vào dự án: icon ứng dụng, cursor, mascot, cover thư viện và empty state.
- Chuẩn hóa các action icon trong thư viện / deck picker để bỏ emoji lệch tông và dùng icon đồng bộ hơn.
- Cố định lại layout mobile cho màn làm trắc nghiệm và flashcard để card hiển thị ổn định, không còn khung to nhỏ thất thường.

## 1.4.0

- Tách CSS thành 11 module: tokens, base, components, dashboard, practice, flashcard, creator, library, history, mobile và themes.
- Chuẩn hóa namespace cho Flashcard học tập, lịch sử, preview trình soạn và bộ đề cục bộ; loại bỏ class chung `.flashcard`, `.panel` và `.quiz`.
- Tập trung màu, spacing, radius, shadow, control height và motion vào design token duy nhất.
- Thêm visual regression harness cho 5 viewport và 10 màn hình, kèm GitHub Actions so sánh nhánh hiện tại với nhánh gốc.
- Thêm bộ stress fixture 1/4/50/100/500 câu, Flashcard dài, LaTeX, tên tiếng Việt đặc biệt và ảnh lớn.
- Nâng IndexedDB engine lên v5 với data schema v4, snapshot trước migration, normalization và khả năng khôi phục snapshot.
- Thêm Recovery Mode, Safe Mode, backup khẩn cấp, sửa cache và nhật ký lỗi cục bộ.
- Quản lý cập nhật PWA chủ động, lưu phiên học trước cập nhật và tự khôi phục sau reload.
- Phân trang Thư viện, DocumentFragment, lazy MathJax/media và content-visibility cho danh sách lớn.
- Bổ sung focus ring, skip link, aria-current, auto-label và hỗ trợ reduced motion.
- Thêm chọn nhiều bộ đề, ghim/yêu thích/lưu trữ hàng loạt, nhân bản, gộp, xuất nhiều bộ đề và xóa có hoàn tác 10 giây.
- Kiểm tra file nhập, cảnh báo dòng lỗi/câu trùng và hỗ trợ bundle `.edtech`.
- Thêm bảng chẩn đoán cục bộ và nút copy báo cáo không chứa nội dung học tập.
- Xác nhận không còn chặn F12, chuột phải, copy hoặc DevTools.

## 1.2.5

- Sửa xung đột class Flashcard làm kéo giãn thống kê và card trong Thư viện đề.
- Thu bốn thẻ thống kê thành dải ngang thấp, gọn và cân đối trên desktop.
- Tối ưu thống kê 2×2 trên mobile và một cột trên màn hình rất nhỏ.
- Khóa chiều cao thống kê, tránh bị kéo theo chiều cao viewport.


## 1.2.4

- Xây lại hoàn toàn giao diện Thư viện đề cho desktop và mobile.
- Sửa lỗi các thẻ thống kê bị kéo cao bất thường.
- Thêm hero, thống kê gọn, bộ lọc dạng tab, tìm kiếm và sắp xếp rõ ràng.
- Làm mới card bộ đề với cover riêng, số nội dung, metadata và hành động nhanh.
- Hoàn thiện empty state, loading state và error state.
- Tối ưu Dark Theme, màn hình nhỏ và thao tác một tay.


## 1.2.3

- Đồng bộ hoàn toàn nút Câu trước và Câu tiếp trên mobile.
- Làm lại bố cục kết quả trắc nghiệm mobile, không còn vòng điểm che nội dung.
- Giữ bottom navigation ổn định, không ẩn/hiện hoặc chớp khi cuộn nhanh.
- Hiển thị đầy đủ chữ DONATE trên mobile.
- Thêm màn Thư viện đề với tìm kiếm, bộ lọc, thống kê, đổi tên, tải Excel và học lại.
- Bổ sung trường đặt tên bộ đề/tên file trong công cụ Soạn đề.


## 1.2.2

- Sửa triệt để ô số câu bằng component riêng, không còn chịu ảnh hưởng CSS danh sách cũ.
- Polish sâu giao diện mobile cho dashboard, cấu hình học, trắc nghiệm, kết quả, flashcard, soạn đề và lịch sử.
- Thêm xử lý bàn phím bằng Visual Viewport, bottom nav tự ẩn khi cuộn, phản hồi rung nhẹ và swipe có kiểm soát.
- Tối ưu safe-area, vùng chạm, cỡ chữ và layout cho Android/iPhone nhỏ.


## 1.2.1

- Thêm quick settings để gom các nút phụ vào một menu gọn hơn.
- Bổ sung bottom navigation riêng cho mobile và tăng khả năng thao tác một tay.
- Cho phép copy/chọn văn bản trở lại trên desktop và mobile.
- Tối ưu mobile để hạn chế hiện giao diện desktop trên Android.
- Chặn zoom ngoài ý muốn trên mobile và cân lại kích thước, khoảng cách.
- Sửa ô số câu trong trình soạn đề trên cả mobile và desktop.


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
