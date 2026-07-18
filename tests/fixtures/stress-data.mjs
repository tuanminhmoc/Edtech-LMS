const quizHeader = ['Câu hỏi', 'Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D', 'Đáp án đúng', 'Giải thích'];
const flashcardHeader = ['Mặt trước', 'Mặt sau', 'Giải thích'];

export function makeQuizRows(count, options = {}) {
    const long = Boolean(options.long);
    return [quizHeader, ...Array.from({ length: count }, (_, index) => {
        const number = index + 1;
        const question = long
            ? `Câu ${number}: Đây là câu hỏi kiểm thử rất dài nhằm kiểm tra khả năng xuống dòng, thay đổi cỡ chữ hệ thống 150%, công thức $E = mc^2$, ký tự tiếng Việt và bố cục trên màn hình hẹp. Nội dung được lặp lại để tạo áp lực layout mà không gây mất ý nghĩa.`
            : `Câu hỏi kiểm thử số ${number}?`;
        return [question, `Đáp án A ${number}`, `Đáp án B ${number}`, `Đáp án C ${number}`, `Đáp án D ${number}`, 'A', `Giải thích cho câu ${number}.`];
    })];
}

export function makeFlashcardRows(count, options = {}) {
    const long = Boolean(options.long);
    return [flashcardHeader, ...Array.from({ length: count }, (_, index) => {
        const number = index + 1;
        return [
            long ? `Mặt trước thẻ ${number}: đoạn văn rất dài để kiểm tra scale Flashcard, overflow, font 150%, từ tiếng Việt và công thức $\\sigma = \\sqrt{n}$.` : `Mặt trước ${number}`,
            long ? `Mặt sau thẻ ${number}: lời giải dài nhiều dòng, có ký hiệu đặc biệt <> & và nội dung cần tự động xuống dòng trên Android/iPhone.` : `Mặt sau ${number}`,
            `Ghi chú ${number}`
        ];
    })];
}

export const stressSets = {
    quiz1: makeQuizRows(1),
    quiz4: makeQuizRows(4),
    quiz50: makeQuizRows(50),
    quiz100: makeQuizRows(100),
    quiz500: makeQuizRows(500),
    quizLong: makeQuizRows(8, { long: true }),
    flashcardLong: makeFlashcardRows(20, { long: true }),
    specialName: {
        name: 'Ôn tập: Tiếng Việt / Toán <Đặc biệt> 2026 ✨',
        type: 'quiz',
        rows: makeQuizRows(4)
    }
};

export function historyFixture() {
    return [
        { id: 'history-quiz', timestamp: new Date().toISOString(), mode: 'quiz', file: 'Bộ trắc nghiệm kiểm thử', correct: 3, wrong: 1, total: 4, accuracy: 75, duration: 42, xp: 30, sourceRows: makeQuizRows(4), wrongRows: makeQuizRows(1), review: [] },
        { id: 'history-fc', timestamp: new Date(Date.now() - 60000).toISOString(), mode: 'flashcard', file: 'Bộ flashcard kiểm thử', good: 16, again: 4, total: 20, duration: 71, xp: 16, sourceRows: makeFlashcardRows(20), hardRows: makeFlashcardRows(4) }
    ];
}
