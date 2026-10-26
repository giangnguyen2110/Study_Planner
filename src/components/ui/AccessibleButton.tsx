/**
 * ============================================================================
 * TÊN FILE: src/components/ui/AccessibleButton.tsx
 * VAI TRÒ: THÀNH VIÊN 1 (TV1 - Frontend UI/UX, Navigation & Notification)
 * ============================================================================
 * 
 * 📌 MỤC ĐÍCH COMPONENT:
 * Component Nút bấm (Button) tuân thủ 100% tiêu chí Trợ năng (Accessibility) của Đồ án.
 * 
 * 🎯 CÁC TIÊU CHUẨN BẮT BUỘC ĐÃ ĐƯỢC ĐÁP ỨNG:
 * 1. Tiêu chuẩn kích thước vùng bấm (Touch Target Size): Chiều cao và chiều rộng tối thiểu 44 x 44 pt
 *    (`minHeight: 44, minWidth: 44`), đáp ứng chuẩn Apple HIG và WCAG 2.1 (Success Criterion 2.5.5).
 * 2. Tiêu chuẩn Screen Reader (Trình đọc màn hình cho người khiếm thị):
 *    - Bắt buộc có `accessibilityRole="button"` để TalkBack (Android) và VoiceOver (iOS) nhận diện là nút bấm.
 *    - Bắt buộc có `accessibilityLabel` mô tả hành động khi bấm nút (ví dụ: "Lưu bài tập mới", "Thử lại tải dữ liệu").
 * 3. Hỗ trợ 3 biến thể (variants):
 *    - 'primary': Nút hành động chính (nền màu Tint, chữ trắng).
 *    - 'secondary': Nút hành động phụ (nền trắng surface, viền border, chữ textPrimary).
 *    - 'danger': Nút hành động nguy hiểm / xoá (nền màu Error, chữ trắng).
 * 
 * 🎓 CÂU HỎI VẤN ĐÁP (VIVA) CỦA THẦY NGUYỄN XUÂN VINH:
 * - Câu hỏi: "Tại sao đề tài yêu cầu nút bấm phải có kích thước tối thiểu 44x44 pt và thuộc tính accessibilityLabel?"
 * - Trả lời: "Dạ thưa Thầy, theo nghiên cứu công thái học di động của Apple và Google, 44x44 pt là kích thước
 *   vùng tiếp xúc nhỏ nhất để ngón tay người dùng bình thường và người có khiếm khuyết vận động có thể bấm
 *   chính xác mà không chạm nhầm vào các thành phần xung quanh. `accessibilityLabel` và `accessibilityRole`
 *   giúp các công cụ trợ năng TalkBack/VoiceOver đọc to rõ hành động của nút cho sinh viên khiếm thị."
 * ============================================================================
 */

// ============================================================================
// BƯỚC 1: IMPORT CÁC THƯ VIỆN, TOKENS VÀ HOOKS
// ============================================================================
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  TouchableOpacityProps,
} from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { TouchTarget, Spacing } from '../../constants/tokens';

// ============================================================================
// BƯỚC 2: KHAI BÁO INTERFACE PROPS VỚI RÀNG BUỘC TRỢ NĂNG
// ============================================================================
interface Props extends TouchableOpacityProps {
  /** Tiêu đề chữ hiển thị bên trong nút */
  title: string;
  /** Hàm callback thực thi khi người dùng bấm nút */
  onPress: () => void;
  /** Nhãn trợ năng bắt buộc cho Screen Reader (TalkBack/VoiceOver) */
  accessibilityLabel: string;
  /** Biến thể giao diện của nút: 'primary' (mặc định), 'secondary', hoặc 'danger' */
  variant?: 'primary' | 'secondary' | 'danger';
}

// ============================================================================
// BƯỚC 3: KHAI BÁO COMPONENT AccessibleButton
// ============================================================================
export function AccessibleButton({
  title,
  onPress,
  accessibilityLabel,
  variant = 'primary',
  style,
  ...props
}: Props) {
  // Lấy bảng màu hiện tại theo Light/Dark Mode
  const colors = useThemeColor();

  /**
   * BƯỚC 4: HÀM TÍNH TOÁN MÀU NỀN THEO BIẾN THỂ (VARIANT)
   * - danger: Dùng màu error (đỏ cảnh báo)
   * - secondary: Dùng màu surface (trắng/xám đậm) kèm viền border
   * - primary: Dùng màu tint (xanh thương hiệu)
   */
  const getBackgroundColor = () => {
    switch (variant) {
      case 'danger':
        return colors.error;
      case 'secondary':
        return colors.surface;
      default:
        return colors.tint;
    }
  };

  /**
   * BƯỚC 5: HÀM TÍNH TOÁN MÀU CHỮ THEO BIẾN THỂ
   * - secondary: Dùng màu textPrimary (đậm) để nổi bật trên nền surface
   * - primary & danger: Dùng màu surface (trắng sáng) để tương phản cao trên nền màu
   */
  const getTextColor = () => {
    return variant === 'secondary' ? colors.textPrimary : colors.surface;
  };

  /**
   * BƯỚC 6: RENDER NÚT BẤM VỚI ĐẦY ĐỦ THUỘC TÍNH TRỢ NĂNG
   * - `accessibilityRole="button"`: Khai báo với OS đây là nút bấm
   * - `accessibilityLabel`: Văn bản mô tả để máy đọc
   * - `styles.button`: Chứa minHeight: 44, minWidth: 44 pt
   */
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: colors.border,
          borderWidth: variant === 'secondary' ? 1 : 0,
        },
        style,
      ]}
      {...props}
    >
      <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
    </TouchableOpacity>
  );
}

// ============================================================================
// BƯỚC 7: STYLESHEET CHUẨN HÓA KÍCH THƯỚC TRỢ NĂNG (MIN 44x44)
// ============================================================================
const styles = StyleSheet.create({
  button: {
    // Kích thước tối thiểu 44 x 44 pt theo chuẩn WCAG 2.1 & Apple HIG
    minHeight: TouchTarget.minHeight,
    minWidth: TouchTarget.minWidth,
    // Khoảng cách bên trong chuẩn 8-point grid
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    // Căn giữa chữ cả chiều dọc và ngang
    justifyContent: 'center',
    alignItems: 'center',
    // Bo góc hiện đại
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
