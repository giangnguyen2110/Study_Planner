/**
 * ============================================================================
 * TÊN FILE: src/hooks/useThemeColor.ts
 * VAI TRÒ: THÀNH VIÊN 1 (TV1 - Frontend UI/UX, Navigation & Notification)
 * ============================================================================
 * 
 * 📌 MỤC ĐÍCH FILE:
 * Custom hook này có nhiệm vụ lắng nghe chế độ sáng/tối (Light Mode / Dark Mode)
 * của hệ điều hành trên thiết bị người dùng (iOS / Android) và tự động trả về
 * bảng mã màu tương ứng từ file `src/constants/tokens.ts`.
 * 
 * ⚠️ QUY TẮC BẮT BUỘC (LUẬT ZERO-HEX):
 * Mọi component hiển thị trong ứng dụng (ThemedView, ThemedText, AccessibleButton,
 * AssignmentCard, v.v.) ĐỀU PHẢI gọi hook này để lấy màu. Tuyệt đối không tự định
 * nghĩa màu sắc hay viết mã Hex trực tiếp.
 * 
 * 🎓 CÂU HỎI VẤN ĐÁP (VIVA) CỦA THẦY NGUYỄN XUÂN VINH:
 * - Câu hỏi: "Hook này hoạt động như thế nào khi người dùng chuyển sang Dark Mode trên điện thoại?"
 * - Trả lời: "Dạ thưa Thầy, hook này sử dụng `useColorScheme()` của React Native. Đây là một hook phản ứng
 *   (reactive hook) có khả năng lắng nghe trực tiếp sự kiện thay đổi Theme của hệ điều hành. Khi điện thoại
 *   bật Dark Mode, `scheme` sẽ đổi từ 'light' sang 'dark', trigger một lần re-render, từ đó hàm trả về
 *   `Colors.dark`. Tất cả component đang sử dụng `useThemeColor()` sẽ tự động cập nhật màu sắc ngay lập tức
 *   mà không cần khởi động lại ứng dụng."
 * ============================================================================
 */

// ============================================================================
// BƯỚC 1: IMPORT CÁC THƯ VIỆN VÀ TÀI NGUYÊN CẦN THIẾT
// ============================================================================
// `useColorScheme` từ 'react-native': Hook tích hợp sẵn của React Native để đọc
// giá trị giao diện hệ thống ('light', 'dark' hoặc null/undefined/unspecified).
import { useColorScheme } from 'react-native';

// Import bảng màu Colors và kiểu ColorTheme từ file tokens duy nhất của dự án
import { Colors, ColorTheme } from '../constants/tokens';

// ============================================================================
// BƯỚC 2: KHAI BÁO CUSTOM HOOK useThemeColor()
// ============================================================================
/**
 * Hook `useThemeColor`:
 * @returns {ColorTheme} Bảng màu tương ứng với theme hiện tại (Colors.light hoặc Colors.dark).
 * 
 * Logic hoạt động:
 * 1. Gọi `useColorScheme()` để lấy theme hệ thống.
 * 2. So sánh nghiêm ngặt: Nếu scheme === 'dark' thì dùng Colors.dark, ngược lại mặc định là Colors.light.
 * 3. Trả về đúng kiểu ColorTheme (đầy đủ các trường background, surface, textPrimary...).
 */
export function useThemeColor(): ColorTheme {
  // Lấy giá trị giao diện từ hệ điều hành ('light' | 'dark' | null | undefined)
  const scheme = useColorScheme();

  // Đảm bảo an toàn kiểu dữ liệu (Strict type-safety), không bị lỗi index signature
  return scheme === 'dark' ? Colors.dark : Colors.light;
}
