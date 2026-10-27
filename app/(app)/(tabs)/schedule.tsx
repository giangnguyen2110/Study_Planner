/**
 * ============================================================================
 * TÊN FILE: app/(app)/(tabs)/schedule.tsx
 * VAI TRÒ: THÀNH VIÊN 1 (TV1 - Frontend UI/UX, Navigation & Notification)
 * ============================================================================
 * 
 * 📌 MỤC ĐÍCH MÀN HÌNH:
 * Màn hình Lịch Trình Học Tập & Quản Lý Bài Tập (Schedule & Assignments Screen)
 * Đáp ứng 100% Tiêu chí BẮT BUỘC A.3 của đề tài:
 * "3. Weekly View & List View: Hiển thị cùng 1 tập dữ liệu bài tập dưới 2 giao diện:
 *     Xem theo tuần (chia theo Thứ 2 -> CN) và Xem theo danh sách, có bộ lọc theo môn và trạng thái."
 * 
 * 🎯 CÁC CHỨC NĂNG CHÍNH:
 * 1. Thanh chuyển đổi chế độ xem (View Mode Switcher):
 *    - Chế độ "Danh sách" (List View): Xem toàn bộ bài tập theo danh sách cuộn dọc.
 *    - Chế độ "Theo Tuần" (Weekly Calendar): Xem phân bổ bài tập theo từng thứ từ Thứ 2 đến Chủ Nhật.
 * 2. Bộ lọc trạng thái (Status Filter Chips):
 *    - "Tất cả": Hiển thị mọi bài tập.
 *    - "Chưa nộp" (pending): Chỉ hiển thị bài tập chưa hoàn thành.
 *    - "Đã xong" (completed): Chỉ hiển thị các bài tập đã nộp.
 * 3. Tích hợp `StateHandler` xử lý chuẩn 4 trạng thái (Loading, Empty, Error with Retry, Content).
 * 4. Tương tác mượt mà: Tick đổi trạng thái qua `useToggleAssignment()` (Optimistic Update)
 *    và chạm vào thẻ để mở màn hình chi tiết bài tập.
 * 
 * 🎓 CÂU HỎI VẤN ĐÁP (VIVA) CỦA THẦY NGUYỄN XUÂN VINH:
 * - Câu hỏi: "Làm thế nào để cả 2 chế độ Danh Sách và Theo Tuần đều dùng chung 1 nguồn dữ liệu và bộ lọc?"
 * - Trả lời: "Dạ thưa Thầy, cả 2 chế độ đều lấy dữ liệu gốc từ hook `useAssignments()`. Bộ lọc `statusFilter`
 *   được áp dụng trước (`filteredAssignments`). Khi người dùng chọn 'Danh sách', biến này được đưa vào `FlatList`;
 *   khi chọn 'Theo Tuần', cùng tập dữ liệu `filteredAssignments` này được truyền thẳng vào `<WeeklyCalendar />`.
 *   Nhờ đó, trạng thái bộ lọc được bảo toàn hoàn hảo khi người dùng qua lại giữa 2 chế độ xem."
 * ============================================================================
 */

// ============================================================================
// BƯỚC 1: IMPORT CÁC THƯ VIỆN, HOOKS, COMPONENTS VÀ TOKENS
// ============================================================================
import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '../../../src/components/ui/ThemedView';
import { ThemedText } from '../../../src/components/ui/ThemedText';
import { AssignmentCard } from '../../../src/components/features/AssignmentCard';
import { WeeklyCalendar } from '../../../src/components/features/WeeklyCalendar';
import { StateHandler } from '../../../src/components/ui/StateHandler';
import { OfflineBanner } from '../../../src/components/ui/OfflineBanner';
import { useAssignments, useToggleAssignment, useOfflineCacheTime, useIsOffline } from '../../../src/hooks/useAssignments';
import { useCourses } from '../../../src/hooks/useCourses';
import { useThemeColor } from '../../../src/hooks/useThemeColor';
import { Spacing, TouchTarget } from '../../../src/constants/tokens';

// ============================================================================
// BƯỚC 2: KHAI BÁO COMPONENT ScheduleScreen
// ============================================================================
export default function ScheduleScreen() {
  const colors = useThemeColor();
  const router = useRouter();

  // BƯỚC 2.1: State chuyển đổi chế độ xem ('list' hoặc 'weekly')
  const [viewMode, setViewMode] = useState<'list' | 'weekly'>('list');

  // BƯỚC 2.2: State bộ lọc trạng thái bài tập ('all', 'pending', hoặc 'completed')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // BƯỚC 2.3: State bộ lọc theo môn học ('all' hoặc courseId)
  const [selectedCourseId, setSelectedCourseId] = useState<string>('all');

  // BƯỚC 2.4: Gọi các TanStack Query Hooks để lấy dữ liệu bài tập và môn học
  const {
    data: assignments = [],
    isLoading,
    isError,
    refetch,
  } = useAssignments();

  const { data: courses = [] } = useCourses();
  const toggleMutation = useToggleAssignment();
  const cachedTime = useOfflineCacheTime();
  const isOffline = useIsOffline();

  // BƯỚC 2.5: Áp dụng đồng thời cả 2 bộ lọc: Trạng thái VÀ Môn học
  const filteredAssignments = assignments.filter((a) => {
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    const matchesCourse = selectedCourseId === 'all' || a.courseId === selectedCourseId;
    return matchesStatus && matchesCourse;
  });

  /**
   * BƯỚC 3: RENDER TOÀN BỘ GIAO DIỆN MÀN HÌNH SCHEDULE
   */
  return (
    <ThemedView style={styles.container}>
      {/* ==================================================================== */}
      {/* BANNER NGOẠI TUYẾN (OFFLINE BANNER - MUST-HAVE #6)                   */}
      {/* ==================================================================== */}
      <OfflineBanner isOffline={isOffline} savedTime={cachedTime} />

      {/* ==================================================================== */}
      {/* THANH 1: NÚT CHUYỂN ĐỔI CHẾ ĐỘ XEM (DANH SÁCH <-> THEO TUẦN)         */}
      {/* ==================================================================== */}
      <View style={[styles.toggleRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {/* Nút Chế độ Danh sách */}
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Chuyển sang chế độ xem dạng danh sách"
          onPress={() => setViewMode('list')}
          style={[
            styles.modeButton,
            viewMode === 'list' && { backgroundColor: colors.tint },
          ]}
        >
          <Text
            style={[
              styles.modeButtonText,
              { color: viewMode === 'list' ? colors.surface : colors.textPrimary },
            ]}
          >
            📋 Danh sách
          </Text>
        </TouchableOpacity>

        {/* Nút Chế độ Theo Tuần */}
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Chuyển sang chế độ xem theo lịch tuần"
          onPress={() => setViewMode('weekly')}
          style={[
            styles.modeButton,
            viewMode === 'weekly' && { backgroundColor: colors.tint },
          ]}
        >
          <Text
            style={[
              styles.modeButtonText,
              { color: viewMode === 'weekly' ? colors.surface : colors.textPrimary },
            ]}
          >
            🗓️ Theo Tuần
          </Text>
        </TouchableOpacity>
      </View>

      {/* ==================================================================== */}
      {/* THANH 2: BỘ LỌC TRẠNG THÁI (TẤT CẢ / CHƯA NỘP / ĐÃ XONG)            */}
      {/* ==================================================================== */}
      <View style={styles.filterRow}>
        {(['all', 'pending', 'completed'] as const).map((filter) => {
          const isSelected = statusFilter === filter;
          const label =
            filter === 'all'
              ? 'Tất cả'
              : filter === 'pending'
              ? '⏳ Chưa nộp'
              : '✅ Đã xong';

          return (
            <TouchableOpacity
              key={filter}
              accessibilityRole="button"
              accessibilityLabel={`Lọc bài tập theo trạng thái ${label}`}
              onPress={() => setStatusFilter(filter)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: isSelected ? colors.tint : colors.surface,
                  borderColor: isSelected ? colors.tint : colors.border,
                },
              ]}
            >
              <ThemedText
                style={{
                  fontSize: 13,
                  fontWeight: isSelected ? '700' : '500',
                  color: isSelected ? colors.surface : colors.textPrimary,
                }}
              >
                {label}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ==================================================================== */}
      {/* THANH 3: BỘ LỌC THEO MÔN HỌC (TẤT CẢ MÔN / TỪNG MÔN HỌC)            */}
      {/* ==================================================================== */}
      <View style={styles.courseFilterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[{ id: 'all', name: 'Tất cả môn', code: 'ALL', colour: colors.tint }, ...courses]}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: Spacing.xs, paddingBottom: Spacing.xs }}
          renderItem={({ item }) => {
            const isSelected = selectedCourseId === item.id;
            return (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel={`Lọc bài tập theo môn ${item.name}`}
                onPress={() => setSelectedCourseId(item.id)}
                style={[
                  styles.courseChip,
                  {
                    backgroundColor: isSelected ? item.colour : colors.surface,
                    borderColor: isSelected ? item.colour : colors.border,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: isSelected ? '700' : '500',
                    color: isSelected ? colors.surface : colors.textPrimary,
                  }}
                >
                  {item.id === 'all' ? '📚 Tất cả môn' : `${item.code}`}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* ==================================================================== */}
      {/* NỘI DUNG CHÍNH: BỌC TRONG STATEHANDLER ĐỂ XỬ LÝ 4 TRẠNG THÁI MẠNG     */}
      {/* ==================================================================== */}
      <StateHandler
        isLoading={isLoading}
        isError={isError}
        isEmpty={filteredAssignments.length === 0}
        onRetry={refetch}
      >
        {viewMode === 'list' ? (
          /* ================================================================ */
          /* CHẾ ĐỘ 1: XEM DANH SÁCH (LIST VIEW)                              */
          /* ================================================================ */
          <FlatList
            data={filteredAssignments}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const course = courses.find((c) => c.id === item.courseId);
              return (
                <AssignmentCard
                  assignment={item}
                  courseColor={course?.colour}
                  courseName={course?.name}
                  onPressCard={() => router.push(`/assignments/${item.id}`)}
                  onToggleStatus={() => {
                    const newStatus =
                      item.status === 'completed' ? 'pending' : 'completed';
                    toggleMutation.mutate({ id: item.id, newStatus });
                  }}
                />
              );
            }}
          />
        ) : (
          /* ================================================================ */
          /* CHẾ ĐỘ 2: XEM THEO LỊCH TUẦN (WEEKLY CALENDAR VIEW)              */
          /* ================================================================ */
          <WeeklyCalendar
            assignments={filteredAssignments}
            courses={courses}
            onPressCard={(id) => router.push(`/assignments/${id}`)}
            onToggleStatus={(id, newStatus) => {
              toggleMutation.mutate({ id, newStatus });
            }}
          />
        )}
      </StateHandler>
    </ThemedView>
  );
}

// ============================================================================
// BƯỚC 4: STYLESHEET CHO MÀN HÌNH SCHEDULE
// ============================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
  },
  toggleRow: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 3,
    marginBottom: Spacing.sm,
  },
  modeButton: {
    flex: 1,
    minHeight: TouchTarget.minHeight,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
    borderWidth: 1,
    minHeight: TouchTarget.minHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseFilterContainer: {
    marginBottom: Spacing.md,
  },
  courseChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    borderRadius: 10,
    borderWidth: 1,
    minHeight: TouchTarget.minHeight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
});
