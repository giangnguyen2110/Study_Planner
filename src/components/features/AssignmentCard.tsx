/**
 * ============================================================================
 * TÊN FILE: src/components/features/AssignmentCard.tsx
 * VAI TRÒ: THÀNH VIÊN 1 (TV1 - Frontend UI/UX, Navigation & Notification)
 * ============================================================================
 * 
 * 📌 MỤC ĐÍCH COMPONENT:
 * Component Thẻ hiển thị thông tin bài tập (Assignment Card) chuẩn giao diện người dùng:
 * - Hiển thị vạch màu nhận diện môn học bên trái (`colorBar`).
 * - Tiêu đề bài tập (tự động gạch ngang `line-through` nếu đã hoàn thành).
 * - Tên môn học và hạn nộp (định dạng ngày giờ rõ ràng).
 * - Nút Checkbox đánh dấu hoàn thành nhanh với vùng chạm chuẩn Trợ năng (Accessibility) >= 44x44 pt.
 * - Cho phép chạm vào thẻ để mở màn hình chi tiết bài tập (`onPressCard`).
 * 
 * 🎯 TIÊU CHUẨN TRỢ NĂNG (ACCESSIBILITY):
 * - Toàn bộ thẻ có `accessibilityRole="button"`, mô tả tên bài tập và trạng thái hiện tại.
 * - Nút Checkbox có `accessibilityRole="checkbox"`, `accessibilityLabel` mô tả hành động đánh dấu.
 * - Kích thước vùng bấm Checkbox đảm bảo tối thiểu 44 x 44 pt (`TouchTarget`).
 * 
 * 🎓 CÂU HỎI VẤN ĐÁP (VIVA) CỦA THẦY NGUYỄN XUÂN VINH:
 * - Câu hỏi: "Tại sao trong component này lại lồng 2 TouchableOpacity và sự kiện chạm có bị xung đột không?"
 * - Trả lời: "Dạ thưa Thầy, cấu trúc gồm 1 TouchableOpacity cha bọc toàn bộ thẻ để bấm vào xem chi tiết
 *   (điều hướng sang /assignments/[id]), và 1 TouchableOpacity con nằm ở góc phải làm ô Checkbox đổi
 *   trạng thái (gọi hàm `onToggleStatus`). Trong React Native, sự kiện chạm trên component con sẽ được
 *   xử lý ưu tiên mà không kích hoạt sự kiện của component cha. Nhờ đó, sinh viên có thể tick hoàn thành
 *   bài tập ngay tại danh sách mà không bị vô tình mở trang chi tiết."
 * ============================================================================
 */

// ============================================================================
// BƯỚC 1: IMPORT CÁC THƯ VIỆN, HOOKS, TOKENS VÀ TYPES
// ============================================================================
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { Spacing, TouchTarget } from '../../constants/tokens';
import { AssignmentItem } from '../../utils/statsUtils';

// ============================================================================
// BƯỚC 2: KHAI BÁO INTERFACE PROPS CHO COMPONENT
// ============================================================================
interface Props {
  /** Dữ liệu bài tập cần hiển thị */
  assignment: AssignmentItem;
  /** Mã màu của môn học (để tô vạch màu bên trái) */
  courseColor?: string;
  /** Tên của môn học tương ứng với courseId */
  courseName?: string;
  /** Callback khi bấm vào ô checkbox (đổi trạng thái hoàn thành) */
  onToggleStatus: () => void;
  /** Callback khi bấm vào thân thẻ (mở màn hình chi tiết) */
  onPressCard: () => void;
}

// ============================================================================
// BƯỚC 3: KHAI BÁO COMPONENT AssignmentCard
// ============================================================================
export function AssignmentCard({
  assignment,
  courseColor,
  courseName,
  onToggleStatus,
  onPressCard,
}: Props) {
  // Lấy bảng màu hiện tại theo theme (Light / Dark)
  const colors = useThemeColor();

  // Kiểm tra xem bài tập đã hoàn thành hay chưa
  const isCompleted = assignment.status === 'completed';

  // Màu vạch môn học: Ưu tiên courseColor từ API, nếu không có thì dùng màu tint
  const indicatorColor = courseColor || colors.tint;

  // Định dạng ngày giờ hạn nộp dễ đọc
  const dueDateObj = new Date(assignment.dueAt);
  const formattedDueDate = `${dueDateObj.toLocaleDateString('vi-VN')} ${dueDateObj.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })}`;

  /**
   * BƯỚC 4: RENDER TOÀN BỘ GIAO DIỆN THẺ BÀI TẬP
   */
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`Bài tập ${assignment.title}, môn ${courseName || 'học phần'}, trạng thái ${
        isCompleted ? 'đã xong' : 'chưa nộp'
      }. Nhấn để xem chi tiết.`}
      onPress={onPressCard}
      activeOpacity={0.8}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: colors.textPrimary,
        },
      ]}
    >
      {/* 4.1. Vạch màu nhận diện môn học bên trái thẻ */}
      <View style={[styles.colorBar, { backgroundColor: indicatorColor }]} />

      {/* 4.2. Khối nội dung trung tâm: Tiêu đề, tên môn học và hạn nộp */}
      <View style={styles.content}>
        {/* Tiêu đề bài tập: gạch ngang nếu đã xong */}
        <Text
          style={[
            styles.title,
            {
              color: colors.textPrimary,
              textDecorationLine: isCompleted ? 'line-through' : 'none',
              opacity: isCompleted ? 0.6 : 1,
            },
          ]}
          numberOfLines={2}
        >
          {assignment.title}
        </Text>

        {/* Tên môn học */}
        {courseName ? (
          <Text
            style={[styles.course, { color: indicatorColor }]}
            numberOfLines={1}
          >
            {courseName}
          </Text>
        ) : null}

        {/* Hạn nộp bài */}
        <Text style={[styles.date, { color: colors.textSecondary }]}>
          ⏰ Hạn nộp: {formattedDueDate}
        </Text>
      </View>

      {/* 4.3. Ô Checkbox đánh dấu hoàn thành nhanh (kích thước tối thiểu 44x44 pt) */}
      <TouchableOpacity
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isCompleted }}
        accessibilityLabel={`Đánh dấu ${isCompleted ? 'chưa hoàn thành' : 'đã hoàn thành'} bài tập ${assignment.title}`}
        onPress={onToggleStatus}
        activeOpacity={0.7}
        style={[
          styles.checkbox,
          {
            borderColor: isCompleted ? colors.success : colors.border,
            backgroundColor: isCompleted ? colors.success : 'transparent',
          },
        ]}
      >
        {isCompleted ? (
          <Text style={{ color: colors.surface, fontWeight: 'bold', fontSize: 16 }}>✓</Text>
        ) : null}
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

// ============================================================================
// BƯỚC 5: STYLESHEET CHO THẺ BÀI TẬP
// ============================================================================
const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
    alignItems: 'center',
    // Đổ bóng nhẹ cho thẻ trên Android & iOS
    elevation: 1,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  // Vạch màu môn học chiếm trọn chiều cao thẻ
  colorBar: {
    width: 6,
    alignSelf: 'stretch',
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  course: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    marginTop: 4,
  },
  // Vùng bấm checkbox đảm bảo tối thiểu 44x44 pt cho Trợ năng
  checkbox: {
    minWidth: TouchTarget.minWidth,
    minHeight: TouchTarget.minHeight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
    borderRadius: 8,
    borderWidth: 1.5,
  },
});
