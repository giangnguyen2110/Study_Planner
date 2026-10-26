/**
 * ============================================================================
 * TÊN FILE: src/components/features/Due48hWidget.tsx
 * VAI TRÒ: THÀNH VIÊN 1 (TV1 - Frontend UI/UX, Navigation & Notification)
 * ============================================================================
 * 
 * 📌 MỤC ĐÍCH COMPONENT:
 * Widget tóm tắt ở Home Screen hiển thị danh sách các bài tập / deadline đến hạn
 * trong vòng 48 GIỜ TỚI (Đây là tính năng thuộc nhóm nâng cao - tiêu chí điểm > 8.0).
 * 
 * 🎯 ĐẶC TẢ NGHIỆP VỤ:
 * - Chỉ lọc các bài tập có trạng thái `status === 'pending'` (chưa hoàn thành).
 * - Sử dụng hàm kiểm tra thời gian `isDueWithin48Hours(item.dueAt)`.
 * - Hiển thị số lượng bài tập đến hạn trong tiêu đề.
 * - Hiển thị chi tiết giờ và ngày nộp với màu sắc cảnh báo nổi bật.
 * - Nếu không có bài tập nào trong 48h, hiển thị thông báo tích cực cho sinh viên.
 * 
 * 🎓 CÂU HỎI VẤN ĐÁP (VIVA) CỦA THẦY NGUYỄN XUÂN VINH:
 * - Câu hỏi: "Widget này hoạt động ra sao và xử lý trường hợp bài tập đã quá hạn (overdue) như thế nào?"
 * - Trả lời: "Dạ thưa Thầy, widget nhận vào danh sách assignments và lọc qua 2 điều kiện:
 *   1. `item.status === 'pending'` (bài tập chưa nộp).
 *   2. `isDueWithin48Hours(item.dueAt)`: Hàm này tính khoảng cách giờ `diffHours = (dueDate - now) / 3600000`.
 *      Điều kiện bắt buộc là `diffHours >= 0 && diffHours <= 48`. Nhờ điều kiện `diffHours >= 0`, các bài
 *      tập đã quá hạn trong quá khứ sẽ không bị tính nhầm vào danh sách 'sắp đến hạn trong 48h tới'."
 * ============================================================================
 */

// ============================================================================
// BƯỚC 1: IMPORT CÁC THƯ VIỆN, HOOKS, UTILS VÀ TOKENS
// ============================================================================
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { AssignmentItem } from '../../utils/statsUtils';
import { isDueWithin48Hours } from '../../utils/dateUtils';
import { Spacing } from '../../constants/tokens';

// ============================================================================
// BƯỚC 2: KHAI BÁO INTERFACE PROPS CHO WIDGET
// ============================================================================
interface Props {
  /** Danh sách bài tập từ TanStack Query */
  assignments: AssignmentItem[];
  /** Callback tuỳ chọn khi bấm vào từng mục bài tập trong widget để xem chi tiết */
  onPressItem?: (id: string) => void;
}

// ============================================================================
// BƯỚC 3: KHAI BÁO COMPONENT Due48hWidget
// ============================================================================
export function Due48hWidget({ assignments, onPressItem }: Props) {
  // Lấy bảng màu hiện tại theo hệ điều hành (Light/Dark)
  const colors = useThemeColor();

  /**
   * BƯỚC 4: LỌC CÁC BÀI TẬP SẮP ĐẾN HẠN TRONG 48 GIỜ TỚI
   * Điều kiện 1: Chưa nộp (status === 'pending')
   * Điều kiện 2: Hạn nộp còn lại từ 0 đến 48 tiếng (isDueWithin48Hours)
   */
  const dueSoonTasks = assignments
    .filter((item) => item.status === 'pending' && isDueWithin48Hours(item.dueAt))
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()); // Sắp xếp bài nào gần nhất lên đầu

  /**
   * BƯỚC 5: RENDER GIAO DIỆN WIDGET
   */
  return (
    <View
      style={[
        styles.widget,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.textPrimary,
        },
      ]}
      accessibilityRole="summary"
      accessibilityLabel={`Widget hạn nộp trong 48 giờ tới, có ${dueSoonTasks.length} bài tập cần hoàn thành.`}
    >
      {/* 5.1. Tiêu đề Header với icon đồng hồ cát và số lượng bài tập */}
      <View style={styles.headerRow}>
        <Text style={[styles.heading, { color: colors.warning }]}>
          ⏳ Hạn nộp trong 48 giờ tới ({dueSoonTasks.length})
        </Text>
      </View>

      {/* 5.2. Trường hợp KHÔNG CÓ bài tập nào sắp đến hạn */}
      {dueSoonTasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            🎉 Tuyệt vời! Bạn không có bài tập nào cần nộp gấp trong 48 giờ tới.
          </Text>
        </View>
      ) : (
        /* 5.3. Trường hợp CÓ bài tập đến hạn -> Hiển thị từng dòng */
        dueSoonTasks.map((task) => {
          const taskDate = new Date(task.dueAt);
          const timeString = taskDate.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          });
          const dateString = taskDate.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
          });

          return (
            <TouchableOpacity
              key={task.id}
              style={[styles.itemRow, { borderBottomColor: colors.border }]}
              onPress={() => onPressItem?.(task.id)}
              disabled={!onPressItem}
              accessibilityRole="button"
              accessibilityLabel={`Bài tập ${task.title}, hạn nộp lúc ${timeString} ngày ${dateString}`}
            >
              {/* Tên bài tập */}
              <Text
                style={[styles.itemText, { color: colors.textPrimary }]}
                numberOfLines={1}
              >
                • {task.title}
              </Text>

              {/* Giờ và ngày hạn chót cảnh báo bằng màu đỏ/cam */}
              <Text style={[styles.itemDate, { color: colors.error }]}>
                {timeString} ({dateString})
              </Text>
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
}

// ============================================================================
// BƯỚC 6: STYLESHEET CHO WIDGET
// ============================================================================
const styles = StyleSheet.create({
  widget: {
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: Spacing.md,
    // Đổ bóng nhẹ tạo chiều sâu cho widget
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  heading: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyContainer: {
    paddingVertical: Spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs + 2,
    borderBottomWidth: 0.5,
  },
  itemText: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    marginRight: Spacing.sm,
  },
  itemDate: {
    fontSize: 13,
    fontWeight: '600',
  },
});
