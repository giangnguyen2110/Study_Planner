/**
 * ============================================================================
 * TÊN FILE: src/components/features/WeeklyCalendar.tsx
 * VAI TRÒ: THÀNH VIÊN 1 (TV1 - Frontend UI/UX, Navigation & Notification)
 * ============================================================================
 * 
 * 📌 MỤC ĐÍCH COMPONENT:
 * Component Lịch Học Theo Tuần (Weekly View Calendar) — Đáp ứng tiêu chí BẮT BUỘC (Must-Have A.3):
 * "Weekly View & List View: Hiển thị cùng 1 tập dữ liệu bài tập dưới 2 giao diện:
 *  Xem theo tuần (chia theo Thứ 2 -> CN) và Xem theo danh sách, có bộ lọc theo môn và trạng thái."
 * 
 * 🎯 ĐẶC TẢ TÍNH NĂNG:
 * 1. Hiển thị thanh 7 ngày trong tuần từ Thứ Hai (T2) đến Chủ Nhật (CN).
 * 2. Cho phép chuyển tuần trước (Tuần trước) và tuần sau (Tuần sau) hoặc quay về tuần hiện tại.
 * 3. Mỗi ngày hiển thị Thứ, ngày tháng trong tháng và chấm chỉ báo (badge dot) nếu ngày đó có bài tập cần nộp.
 * 4. Cho phép sinh viên chọn một ngày bất kỳ để lọc xem các bài tập đến hạn trong ngày đó.
 * 5. Từng bài tập được render bằng `AssignmentCard` với đầy đủ chức năng tick hoàn thành và mở chi tiết.
 * 6. Tuân thủ 100% Tiêu chuẩn Trợ năng (Accessibility) và Luật Zero-Hex.
 * 
 * 🎓 CÂU HỎI VẤN ĐÁP (VIVA) CỦA THẦY NGUYỄN XUÂN VINH:
 * - Câu hỏi: "Làm thế nào để tính toán chính xác 7 ngày trong tuần bắt đầu từ Thứ Hai và đồng bộ với ngày nộp bài tập?"
 * - Trả lời: "Dạ thưa Thầy, hàm `getDaysOfWeek()` lấy ngày cơ sở `currentDate`. Để tìm Thứ Hai đầu tuần:
 *   Trong JavaScript, Chủ Nhật là index 0, Thứ Hai là 1... Nếu hôm nay là CN (0), ta trừ 6 ngày; nếu là các
 *   thứ khác (1-6), ta trừ (day - 1) ngày. Từ mốc Thứ Hai, ta cộng liên tiếp từ 0 đến 6 ngày để sinh mảng 7 ngày.
 *   Khi so sánh với bài tập, ta chuẩn hóa cả 2 về đầu ngày qua `startOfDay()` để đảm bảo không bị sai lệch giờ."
 * ============================================================================
 */

// ============================================================================
// BƯỚC 1: IMPORT CÁC THƯ VIỆN, HOOKS, UTILS VÀ COMPONENTS
// ============================================================================
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { Spacing, TouchTarget } from '../../constants/tokens';
import { AssignmentItem } from '../../utils/statsUtils';
import { Course } from '../../types/study';
import { startOfDay } from '../../utils/dateUtils';
import { AssignmentCard } from './AssignmentCard';

// ============================================================================
// BƯỚC 2: KHAI BÁO INTERFACE PROPS CHO WeeklyCalendar
// ============================================================================
interface Props {
  /** Danh sách bài tập cần hiển thị (đã qua lọc trạng thái nếu có) */
  assignments: AssignmentItem[];
  /** Danh sách môn học để lấy màu và tên môn học */
  courses: Course[];
  /** Callback khi người dùng tick đổi trạng thái bài tập */
  onToggleStatus: (id: string, newStatus: 'pending' | 'completed') => void;
  /** Callback khi người dùng bấm vào thẻ bài tập để xem chi tiết */
  onPressCard: (id: string) => void;
}

// Mảng tên các thứ trong tuần bằng tiếng Việt
const DAY_LABELS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const FULL_DAY_LABELS = [
  'Thứ Hai',
  'Thứ Ba',
  'Thứ Tư',
  'Thứ Năm',
  'Thứ Sáu',
  'Thứ Bảy',
  'Chủ Nhật',
];

// ============================================================================
// BƯỚC 3: HÀM TIỆN ÍCH TÍNH TOÁN 7 NGÀY TRONG TUẦN (THỨ 2 -> CHỦ NHẬT)
// ============================================================================
/**
 * Trả về mảng 7 đối tượng Date đại diện cho tuần lễ chứa `baseDate`.
 * Luôn bắt đầu từ Thứ Hai (Monday) và kết thúc ở Chủ Nhật (Sunday).
 */
function getWeekDays(baseDate: Date): Date[] {
  const current = new Date(baseDate);
  const dayOfWeek = current.getDay(); // 0 là Chủ Nhật, 1 là Thứ Hai, 6 là Thứ Bảy
  
  // Tính khoảng cách lùi về Thứ Hai
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  
  const monday = new Date(current);
  monday.setDate(current.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  // Sinh 7 ngày liên tiếp từ Thứ Hai đến Chủ Nhật
  const week: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const nextDay = new Date(monday);
    nextDay.setDate(monday.getDate() + i);
    week.push(nextDay);
  }
  return week;
}

// ============================================================================
// BƯỚC 4: KHAI BÁO COMPONENT WeeklyCalendar
// ============================================================================
export function WeeklyCalendar({
  assignments,
  courses,
  onToggleStatus,
  onPressCard,
}: Props) {
  const colors = useThemeColor();

  // State lưu ngày hiện tại của tuần đang xem
  const [currentWeekDate, setCurrentWeekDate] = useState<Date>(new Date());

  // State lưu ngày đang được sinh viên bấm chọn (mặc định là hôm nay)
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));

  // Danh sách 7 ngày của tuần đang hiển thị
  const weekDays = getWeekDays(currentWeekDate);

  /**
   * BƯỚC 5: HÀM CHUYỂN TUẦN TRƯỚC / TUẦN SAU / HÔM NAY
   */
  const handlePreviousWeek = () => {
    const prev = new Date(currentWeekDate);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeekDate(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentWeekDate);
    next.setDate(next.getDate() + 7);
    setCurrentWeekDate(next);
  };

  const handleResetToToday = () => {
    const today = new Date();
    setCurrentWeekDate(today);
    setSelectedDate(startOfDay(today));
  };

  /**
   * BƯỚC 6: LỌC BÀI TẬP ĐẾN HẠN THEO NGÀY ĐANG ĐƯỢC CHỌN
   * Đưa cả `assignment.dueAt` và `selectedDate` về cùng `startOfDay` để so sánh chính xác theo ngày.
   */
  const selectedDayAssignments = assignments.filter((item) => {
    const itemDate = startOfDay(new Date(item.dueAt));
    return itemDate.getTime() === selectedDate.getTime();
  });

  // Tìm index của ngày đang chọn trong tuần (0-6)
  const selectedDayIndex = weekDays.findIndex(
    (d) => startOfDay(d).getTime() === selectedDate.getTime()
  );
  const selectedDayLabel =
    selectedDayIndex !== -1
      ? FULL_DAY_LABELS[selectedDayIndex]
      : 'Ngày đã chọn';

  /**
   * BƯỚC 7: RENDER GIAO DIỆN WEEKLY CALENDAR
   */
  return (
    <View style={styles.container}>
      {/* 7.1. Header điều hướng tuần (Tuần trước, Tiêu đề tuần, Tuần sau) */}
      <View style={styles.navigationHeader}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Chuyển sang tuần trước"
          onPress={handlePreviousWeek}
          style={[styles.navButton, { borderColor: colors.border }]}
        >
          <Text style={[styles.navButtonText, { color: colors.textPrimary }]}>◀ Tuần trước</Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Quay lại tuần hiện tại"
          onPress={handleResetToToday}
          style={[styles.todayButton, { backgroundColor: colors.surface, borderColor: colors.tint }]}
        >
          <Text style={[styles.todayButtonText, { color: colors.tint }]}>Hôm nay</Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Chuyển sang tuần sau"
          onPress={handleNextWeek}
          style={[styles.navButton, { borderColor: colors.border }]}
        >
          <Text style={[styles.navButtonText, { color: colors.textPrimary }]}>Tuần sau ▶</Text>
        </TouchableOpacity>
      </View>

      {/* 7.2. Thanh 7 ngày trong tuần (T2 -> CN) */}
      <View
        style={[
          styles.weekRow,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        {weekDays.map((dayDate, index) => {
          const isSelected =
            startOfDay(dayDate).getTime() === selectedDate.getTime();

          const isToday =
            startOfDay(dayDate).getTime() === startOfDay(new Date()).getTime();

          // Kiểm tra xem ngày này có bao nhiêu bài tập
          const dayTasksCount = assignments.filter((a) => {
            const aDate = startOfDay(new Date(a.dueAt));
            return aDate.getTime() === startOfDay(dayDate).getTime();
          }).length;

          // Có bài tập chưa nộp không?
          const hasPendingTask = assignments.some((a) => {
            const aDate = startOfDay(new Date(a.dueAt));
            return (
              aDate.getTime() === startOfDay(dayDate).getTime() &&
              a.status === 'pending'
            );
          });

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityLabel={`${FULL_DAY_LABELS[index]}, ngày ${dayDate.getDate()} tháng ${dayDate.getMonth() + 1}, có ${dayTasksCount} bài tập.`}
              onPress={() => setSelectedDate(startOfDay(dayDate))}
              style={[
                styles.dayColumn,
                isSelected && {
                  backgroundColor: colors.tint,
                  borderRadius: 10,
                },
              ]}
            >
              {/* Thứ trong tuần (T2, T3...) */}
              <Text
                style={[
                  styles.dayLabel,
                  {
                    color: isSelected
                      ? colors.surface
                      : isToday
                      ? colors.tint
                      : colors.textSecondary,
                    fontWeight: isSelected || isToday ? '700' : '500',
                  },
                ]}
              >
                {DAY_LABELS[index]}
              </Text>

              {/* Ngày trong tháng (26, 27...) */}
              <Text
                style={[
                  styles.dayNumber,
                  {
                    color: isSelected ? colors.surface : colors.textPrimary,
                    fontWeight: isSelected ? '700' : '600',
                  },
                ]}
              >
                {dayDate.getDate()}
              </Text>

              {/* Chấm chỉ báo bài tập (Dot indicator) */}
              <View style={styles.dotContainer}>
                {hasPendingTask ? (
                  <View
                    style={[
                      styles.taskDot,
                      {
                        backgroundColor: isSelected
                          ? colors.surface
                          : colors.error,
                      },
                    ]}
                  />
                ) : dayTasksCount > 0 ? (
                  <View
                    style={[
                      styles.taskDot,
                      {
                        backgroundColor: isSelected
                          ? colors.surface
                          : colors.success,
                      },
                    ]}
                  />
                ) : (
                  <View style={styles.dotPlaceholder} />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 7.3. Tiêu đề hiển thị ngày đang được chọn */}
      <View style={styles.selectedDayHeader}>
        <Text style={[styles.selectedDayTitle, { color: colors.textPrimary }]}>
          📅 {selectedDayLabel} ({selectedDate.toLocaleDateString('vi-VN')})
        </Text>
        <Text style={[styles.taskCountText, { color: colors.textSecondary }]}>
          {selectedDayAssignments.length} bài tập đến hạn
        </Text>
      </View>

      {/* 7.4. Danh sách các bài tập của ngày đang chọn */}
      {selectedDayAssignments.length === 0 ? (
        <View style={[styles.emptyDayBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={{ color: colors.textSecondary, textAlign: 'center', fontSize: 14 }}>
            ☕ Không có bài tập nào cần nộp vào ngày này. Hãy tận hưởng thời gian học tập nhé!
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.taskList} showsVerticalScrollIndicator={false}>
          {selectedDayAssignments.map((task) => {
            const course = courses.find((c) => c.id === task.courseId);
            return (
              <AssignmentCard
                key={task.id}
                assignment={task}
                courseColor={course?.colour}
                courseName={course?.name}
                onPressCard={() => onPressCard(task.id)}
                onToggleStatus={() => {
                  const newStatus =
                    task.status === 'completed' ? 'pending' : 'completed';
                  onToggleStatus(task.id, newStatus);
                }}
              />
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

// ============================================================================
// BƯỚC 8: STYLESHEET CHO WEEKLY CALENDAR
// ============================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  navButton: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: Spacing.xs + 2,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: TouchTarget.minHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  todayButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: TouchTarget.minHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  dayColumn: {
    flex: 1,
    minHeight: TouchTarget.minHeight + 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  dayLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  dayNumber: {
    fontSize: 16,
  },
  dotContainer: {
    height: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  taskDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotPlaceholder: {
    width: 6,
    height: 6,
  },
  selectedDayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingHorizontal: 2,
  },
  selectedDayTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
  taskCountText: {
    fontSize: 13,
  },
  emptyDayBox: {
    padding: Spacing.xl,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
  },
  taskList: {
    flex: 1,
  },
});
