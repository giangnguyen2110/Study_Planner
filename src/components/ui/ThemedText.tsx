/**
 * ============================================================================
 * TÊN FILE: src/components/ui/ThemedText.tsx
 * VAI TRÒ: THÀNH VIÊN 1 (TV1 - Frontend UI/UX, Navigation & Notification)
 * ============================================================================
 * 
 * 📌 MỤC ĐÍCH COMPONENT:
 * Component Typography hiển thị văn bản thay thế cho `<Text>` mặc định của React Native.
 * Tự động đồng bộ màu chữ (`color`) theo theme (Light/Dark) và hỗ trợ phân cấp thị giác
 * (Visual Hierarchy) thông qua cờ `secondary`.
 * 
 * ⚠️ QUY TẮC BẮT BUỘC:
 * - Tuân thủ Luật Zero-Hex: Màu chữ lấy từ `colors.textPrimary` hoặc `colors.textSecondary`.
 * - Đảm bảo tỷ lệ tương phản WCAG 2.1 AA (>= 4.5:1) trên mọi loại màn hình.
 * 
 * 🎓 CÂU HỎI VẤN ĐÁP (VIVA) CỦA THẦY NGUYỄN XUÂN VINH:
 * - Câu hỏi: "Thuộc tính `secondary` trong `ThemedText` được dùng để làm gì?"
 * - Trả lời: "Dạ thưa Thầy, thuộc tính `secondary` dùng để hiển thị các văn bản phụ trợ như ngày tháng,
 *   phụ đề, ghi chú hoặc nhãn phụ. Khi `secondary = true`, chữ sẽ có màu `colors.textSecondary` (xám dịu hơn)
 *   giúp mắt người dùng phân biệt rõ đâu là tiêu đề chính (Primary) và đâu là thông tin thứ cấp (Secondary)."
 * ============================================================================
 */

// ============================================================================
// BƯỚC 1: IMPORT CÁC THƯ VIỆN VÀ HOOKS CẦN THIẾT
// ============================================================================
import React from 'react';
import { Text, TextProps } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';

// ============================================================================
// BƯỚC 2: KHAI BÁO INTERFACE ĐẶC TẢ PROPS
// ============================================================================
/**
 * Interface Props:
 * Mở rộng từ `TextProps` chuẩn của React Native để kế thừa toàn bộ thuộc tính
 * như numberOfLines, ellipsizeMode, onPress, style...
 * Thêm thuộc tính tuỳ chọn `secondary?: boolean`.
 */
interface Props extends TextProps {
  /**
   * secondary: Nếu là true -> sử dụng màu textSecondary (xám phụ đề);
   *            Nếu là false hoặc không truyền -> sử dụng màu textPrimary (màu chữ chính).
   */
  secondary?: boolean;
}

// ============================================================================
// BƯỚC 3: KHAI BÁO COMPONENT ThemedText
// ============================================================================
export function ThemedText({ secondary, style, ...props }: Props) {
  // Lấy bảng màu hiện tại từ custom hook useThemeColor
  const colors = useThemeColor();

  // Xác định màu sắc dựa vào cờ secondary
  const color = secondary ? colors.textSecondary : colors.textPrimary;

  /**
   * BƯỚC 4: RENDER THẺ TEXT VỚI MÀU SẮC ĐÃ TÍNH TOÁN
   * Gán `[{ color }, style]` để màu theme được áp dụng tự động,
   * đồng thời cho phép style bên ngoài truyền vào (như fontSize, fontWeight...)
   */
  return (
    <Text
      style={[{ color }, style]}
      {...props}
    />
  );
}
