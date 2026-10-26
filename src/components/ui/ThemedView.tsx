/**
 * ============================================================================
 * TÊN FILE: src/components/ui/ThemedView.tsx
 * VAI TRÒ: THÀNH VIÊN 1 (TV1 - Frontend UI/UX, Navigation & Notification)
 * ============================================================================
 * 
 * 📌 MỤC ĐÍCH COMPONENT:
 * Component container cơ bản thay thế cho `<View>` mặc định của React Native.
 * Tự động đồng bộ màu nền (`backgroundColor`) theo theme hiện tại (Light/Dark).
 * 
 * ⚠️ QUY TẮC BẮT BUỘC:
 * - Tuân thủ Luật Zero-Hex: Màu nền được lấy trực tiếp từ `useThemeColor().background`.
 * - Cho phép ghi đè (override) style từ props bên ngoài truyền vào thông qua mảng style.
 * 
 * 🎓 CÂU HỎI VẤN ĐÁP (VIVA) CỦA THẦY NGUYỄN XUÂN VINH:
 * - Câu hỏi: "Tại sao nhóm lại tạo component `ThemedView` thay vì dùng trực tiếp `<View>` của React Native?"
 * - Trả lời: "Dạ thưa Thầy, việc bọc lại thành `ThemedView` mang lại 2 lợi ích lớn:
 *   1. Tránh lặp mã (DRY): Thay vì ở mỗi màn hình đều phải lấy `colors.background` rồi gán vào style của View,
 *      `ThemedView` làm việc này tự động.
 *   2. Tuân thủ tuyệt đối Luật Zero-Hex và đảm bảo 100% màn hình trong ứng dụng đều tự động chuyển đổi
 *      màu nền khi người dùng đổi chế độ Dark Mode của điện thoại."
 * ============================================================================
 */

// ============================================================================
// BƯỚC 1: IMPORT CÁC THƯ VIỆN VÀ HOOKS
// ============================================================================
import React from 'react';
import { View, ViewProps } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';

// ============================================================================
// BƯỚC 2: KHAI BÁO COMPONENT ThemedView
// ============================================================================
/**
 * Component ThemedView:
 * Nhận toàn bộ thuộc tính (`props`) chuẩn của `ViewProps` trong React Native
 * (bao gồm children, style, onLayout, testID, v.v.).
 */
export function ThemedView({ style, ...props }: ViewProps) {
  // Lấy bảng màu hiện tại (Light hoặc Dark) từ hook useThemeColor
  const colors = useThemeColor();

  /**
   * BƯỚC 3: RENDER THẺ VIEW VỚI MÀU NỀN TỰ ĐỘNG
   * Mảng style `[{ backgroundColor: colors.background }, style]`:
   * - Phần tử đầu tiên đặt màu nền mặc định theo theme.
   * - Phần tử thứ hai là `style` do component cha truyền vào, cho phép ghi đè (override)
   *   nếu màn hình con có nhu cầu đặc thù (ví dụ: nền trong suốt, bo góc, padding...).
   */
  return (
    <View
      style={[{ backgroundColor: colors.background }, style]}
      {...props}
    />
  );
}
