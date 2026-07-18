# Kiến trúc giao diện

- `tokens.css`: màu, spacing, radius, shadow, kích thước control và motion.
- `base.css`: reset, focus, reduced motion, Safe Mode.
- `components.css`: component dùng chung và lớp tương thích đã được namespace.
- `dashboard.css`, `practice.css`, `flashcard.css`, `creator.css`, `library.css`, `history.css`: style theo màn hình.
- `mobile.css`: breakpoint và safe-area.
- `themes.css`: token Dark Theme.

Quy tắc:

- Không dùng class `.flashcard`, `.panel`, `.quiz` độc lập.
- Component mới phải dùng namespace theo màn hình.
- Badge Trắc nghiệm/Flashcard dùng chung layout, chỉ đổi biến màu.
- Mọi khoảng cách, radius và chiều cao control mới phải dùng token.
