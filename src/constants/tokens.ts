/**
 * ============================================================================
 * TÊN FILE: src/constants/tokens.ts
 * VAI TRÒ: THÀNH VIÊN 1 (TV1 - Frontend UI/UX, Navigation & Notification)
 * ============================================================================
 * 
 * 📌 MỤC ĐÍCH FILE:
 * File này là "Single Source of Truth" (Nguồn chân lý duy nhất) cho toàn bộ hệ thống
 * màu sắc, khoảng cách (Spacing), và kích thước vùng chạm (Touch Target) của ứng dụng.
 * 
 * ⚠️ QUY TẮC BẮT BUỘC (LUẬT ZERO-HEX):
 * - Đây là file DUY NHẤT trong TOÀN BỘ DỰ ÁN được phép chứa mã màu Hex (#FFFFFF, #000...).
 * - Bất kỳ component nào khác muốn dùng màu ĐỀU PHẢI import từ file này thông qua hook `useThemeColor()`.
 * - Nghiêm cấm viết cứng mã màu Hex trong StyleSheet của các component khác.
 * 
 * 🎯 TIÊU CHUẨN TRỢ NĂNG (ACCESSIBILITY - WCAG 2.1):
 * - Độ tương phản chữ (Contrast Ratio) >= 4.5:1 đối với văn bản thông thường (chuẩn AA).
 * - Kích thước vùng chạm tối thiểu (Touch Target Size) >= 44x44 pt theo chuẩn Apple HIG & Android.
 * 
 * 🎓 CÂU HỎI VẤN ĐÁP (VIVA) CỦA THẦY NGUYỄN XUÂN VINH:
 * - Câu hỏi: "Tại sao trong toàn bộ dự án không có mã màu Hex nào ngoài file tokens.ts?"
 * - Trả lời: "Dạ thưa Thầy, để tuân thủ nguyên lý Design System tập trung. Khi cần thay đổi bảng màu
 *   hoặc hỗ trợ Dark Mode tự động, nhóm chỉ cần cập nhật tại file tokens.ts duy nhất. Điều này giúp
 *   tránh lỗi giao diện không đồng nhất, đảm bảo độ tương phản WCAG 2.1 AA cho người khiếm thị,
 *   và giúp việc bảo trì mã nguồn nhanh chóng, dễ dàng."
 * ============================================================================
 */

// ============================================================================
// BƯỚC 1: ĐỊNH NGHĨA BẢNG MÀU HỖ TRỢ LIGHT MODE VÀ DARK MODE
// ============================================================================
// Bảng màu gồm 2 chế độ: light (giao diện sáng) và dark (giao diện tối).
// Từng màu sắc đều có mục đích cụ thể và đảm bảo độ tương phản cao với nền.
export const Colors = {
  // Giao diện Sáng (Light Theme)
  light: {
    // Màu nền chính của ứng dụng: Xanh xám nhạt hiện đại, dịu mắt
    background: '#F8FAFC',
    // Màu bề mặt (card, modal, thanh navbar): Trắng tinh khôi
    surface: '#FFFFFF',
    // Màu chữ chính: Đen than đậm, độ tương phản cực cao trên nền sáng (>= 7:1)
    textPrimary: '#0F172A',
    // Màu chữ phụ (ngày giờ, ghi chú, phụ đề): Xám vừa phải, dễ đọc
    textSecondary: '#475569',
    // Màu đường viền (border): Xám nhạt phân tách các khối
    border: '#CBD5E1',
    // Màu chủ đạo (Brand Tint): Xanh dương đại học (Cobalt Blue)
    tint: '#2563EB',
    // Màu báo lỗi / cảnh báo deadline gấp / nút xoá: Đỏ chuẩn cảnh báo
    error: '#DC2626',
    // Màu thông báo thành công / đã hoàn thành bài tập: Xanh lá cây
    success: '#16A34A',
    // Màu cảnh báo deadline 48 giờ: Vàng hổ phách (Amber)
    warning: '#D97706',
    // Màu nền của thẻ (Card): Trắng
    card: '#FFFFFF',
    // Màu nền banner trạng thái ngoại tuyến (Offline Banner): Vàng ấm
    offlineBanner: '#FEF3C7',
    // Màu chữ trong banner ngoại tuyến: Nâu sẫm tương phản cao
    offlineText: '#92400E',
    // Màu nền trạng thái bài tập đang chờ (Pending): Tím indigo nhạt
    statusPending: '#E0E7FF',
    // Màu nền trạng thái bài tập đã xong (Completed): Xanh bạc hà nhạt
    statusCompleted: '#DCFCE7',
  },

  // Giao diện Tối (Dark Theme)
  dark: {
    // Màu nền chính: Xanh đen than vũ trụ (Slate dark)
    background: '#0F172A',
    // Màu bề mặt (card, modal): Xám than đậm
    surface: '#1E293B',
    // Màu chữ chính: Trắng sáng, sắc nét trên nền tối (>= 7:1)
    textPrimary: '#F8FAFC',
    // Màu chữ phụ: Xám bạc, dễ đọc ban đêm không chói mắt
    textSecondary: '#94A3B8',
    // Màu đường viền: Xám tối viền mỏng
    border: '#334155',
    // Màu chủ đạo (Brand Tint): Xanh dương sáng (Sky Blue)
    tint: '#60A5FA',
    // Màu báo lỗi: Đỏ tươi nổi trên nền tối
    error: '#EF4444',
    // Màu thành công: Xanh lá tươi
    success: '#22C55E',
    // Màu cảnh báo: Vàng sáng
    warning: '#FBBF24',
    // Màu nền thẻ: Xám than đậm
    card: '#1E293B',
    // Màu nền banner ngoại tuyến: Nâu hổ phách tối
    offlineBanner: '#78350F',
    // Màu chữ banner ngoại tuyến: Vàng kem nhạt
    offlineText: '#FEF3C7',
    // Màu nền trạng thái đang chờ: Tím indigo tối
    statusPending: '#1E1B4B',
    // Màu nền trạng thái đã xong: Xanh ngọc tối
    statusCompleted: '#064E3B',
  },
};

// ============================================================================
// BƯỚC 2: ĐỊNH NGHĨA HỆ THỐNG KHOẢNG CÁCH (SPACING SYSTEM)
// ============================================================================
// Quy tắc 8-point grid chuẩn trong UI/UX Mobile (4, 8, 16, 24, 32 pt)
// Giúp layout luôn thẳng hàng, cân xứng, chuẩn thẩm mỹ thị giác.
export const Spacing = {
  xs: 4,   // Khoảng cách cực nhỏ (padding icon, margin viền)
  sm: 8,   // Khoảng cách nhỏ (khoảng cách giữa các badge, khoảng cách các hàng)
  md: 16,  // Khoảng cách tiêu chuẩn (padding viền màn hình, padding thẻ)
  lg: 24,  // Khoảng cách lớn (khoảng cách giữa các khối chức năng)
  xl: 32,  // Khoảng cách rất lớn (khoảng cách header, nút bấm hành động chính)
};

// ============================================================================
// BƯỚC 3: ĐỊNH NGHĨA KÍCH THƯỚC VÙNG CHẠM TIÊU CHUẨN (TOUCH TARGET SIZE)
// ============================================================================
// Tiêu chuẩn WCAG 2.1 (Success Criterion 2.5.5) & Apple Human Interface Guidelines:
// Mọi phần tử có thể bấm (button, checkbox, icon touchable) BẮT BUỘC phải có
// chiều cao và chiều rộng tối thiểu là 44 x 44 pt để ngón tay chạm chuẩn, không bấm trượt.
export const TouchTarget = {
  minHeight: 44,
  minWidth: 44,
};

// Export kiểu TypeScript ColorScheme để các component sử dụng an toàn kiểu
export type ColorTheme = typeof Colors.light;
