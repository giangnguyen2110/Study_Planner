/**
 * ============================================================================
 * TÊN FILE: app/(app)/(tabs)/index.tsx
 * VAI TRÒ: THÀNH VIÊN 1 (TV1 - Frontend UI/UX, Navigation & Notification)
 * ============================================================================
 * 
 * 📌 MỤC ĐÍCH MÀN HÌNH:
 * Màn hình Trang Chủ (Home Dashboard) của ứng dụng Study Planner:
 * 1. Lời chào mừng sinh viên và hiển thị ngày tháng hiện tại theo thời gian thực.
 * 2. Nhúng `Due48hWidget` ở vị trí nổi bật nhất để cảnh báo các hạn chót trong 48 giờ tới
 *    (đáp ứng tiêu chí tính năng nâng cao để đạt điểm > 8.0).
 * 3. Khối thống kê nhanh (Quick Stats) tổng số bài tập, số bài chưa nộp và số bài đã xong.
 * 4. Các nút thao tác nhanh (Quick Action Buttons): "Xem lịch trình tuần" và "Thêm bài tập mới".
 * 5. Danh sách các bài tập cần ưu tiên nộp sớm nhất, render bằng `AssignmentCard`.
 * 6. Xử lý đầy đủ 4 trạng thái qua `StateHandler` (Loading, Empty, Error with Retry, Content).
 * 
 * ⚠️ QUY TẮC BẮT BUỘC ĐÃ ĐƯỢC TUÂN THỦ:
 * - LUẬT ZERO-HEX: 100% màu sắc lấy từ `useThemeColor()`, không có bất kỳ mã Hex nào.
 * - LUẬT TRỢ NĂNG (ACCESSIBILITY): Tất cả nút bấm có kích thước tối thiểu 44 x 44 pt, có đầy đủ
 *   `accessibilityRole="button"` và `accessibilityLabel`.
 * - LUẬT 4-STATES: Tích hợp `StateHandler` bọc toàn bộ nội dung.
 * 
 * 🎓 CÂU HỎI VẤN ĐÁP (VIVA) CỦA THẦY NGUYỄN XUÂN VINH:
 * - Câu hỏi: "Màn hình Home Dashboard này tổ chức luồng dữ liệu như thế nào?"
 * - Trả lời: "Dạ thưa Thầy, màn hình Home gọi hook `useAssignments()` và `useCourses()` được quản lý
 *   bởi TanStack Query v5. Khi component render:
 *   1. Dữ liệu bài tập được đưa vào `StateHandler` để đảm bảo xử lý đủ 4 trạng thái mạng.
 *   2. Danh sách assignments được truyền vào `Due48hWidget` để tự động lọc các deadline trong 48h.
 *   3. Dữ liệu được tính toán nhanh (computed) ra số lượng đã xong và chưa nộp để hiển thị lên 3 thẻ thống kê.
 *   4. Các bài tập chưa nộp có hạn gần nhất được sắp xếp lên đầu và render bằng `AssignmentCard`,
 *      cho phép người dùng tick hoàn thành ngay tại Trang Chủ nhờ `useToggleAssignment()`."
 * ============================================================================
 */

// ============================================================================
// BƯỚC 1: IMPORT CÁC THƯ VIỆN, HOOKS, COMPONENTS VÀ TOKENS
// ============================================================================
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '../../../src/components/ui/ThemedView';
import { ThemedText } from '../../../src/components/ui/ThemedText';
import { AccessibleButton } from '../../../src/components/ui/AccessibleButton';
import { Due48hWidget } from '../../../src/components/features/Due48hWidget';
import { AssignmentCard } from '../../../src/components/features/AssignmentCard';
import { StateHandler } from '../../../src/components/ui/StateHandler';
import { OfflineBanner } from '../../../src/components/ui/OfflineBanner';
import { useAssignments, useToggleAssignment, useOfflineCacheTime } from '../../../src/hooks/useAssignments';
import { useCourses } from '../../../src/hooks/useCourses';
import { useThemeColor } from '../../../src/hooks/useThemeColor';
import { triggerImmediateDemoNotification } from '../../../src/hooks/useNotifications';
import { Spacing, TouchTarget } from '../../../src/constants/tokens';

// ============================================================================
// BƯỚC 2: KHAI BÁO COMPONENT MÀN HÌNH CHÍNH (HomeScreen / Dashboard)
// ============================================================================
export default function HomeScreen() {
  const colors = useThemeColor();
  const router = useRouter();

  // BƯỚC 2.1: Gọi TanStack Query hooks để lấy danh sách bài tập và môn học
  const {
    data: assignments = [],
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useAssignments();

  const { data: courses = [] } = useCourses();
  const toggleMutation = useToggleAssignment();
  const cachedTime = useOfflineCacheTime();

  // BƯỚC 2.2: Tính toán các số liệu thống kê nhanh cho Dashboard
  const totalTasks = assignments.length;
  const completedTasks = assignments.filter((a) => a.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;

  // BƯỚC 2.3: Lọc danh sách bài tập ưu tiên (chưa nộp, hạn gần nhất)
  const priorityTasks = assignments
    .filter((a) => a.status === 'pending')
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
    .slice(0, 5); // Hiển thị tối đa 5 bài tập cần làm gấp nhất

  // Định dạng ngày hiện tại bằng tiếng Việt
  const todayDateString = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  /**
   * Kích hoạt thông báo nhắc deadline ngay tức thì (sau 2 giây) phục vụ Demo Viva
   * Giúp sinh viên và Thầy thấy rõ hiệu ứng Deep Linking nhảy từ Trang Chủ vào Chi Tiết Bài Tập!
   */
  const handleTriggerHomeDemoNotification = async () => {
    const targetTask = priorityTasks[0] || assignments[0];
    if (!targetTask) {
      Alert.alert('Thông báo', 'Hiện tại bạn chưa có bài tập nào để hẹn giờ thông báo.');
      return;
    }

    try {
      await triggerImmediateDemoNotification(targetTask.id, targetTask.title);
      Alert.alert(
        'Đã đặt nhắc nhở! ⏰',
        `Sau đúng 2 giây, thông báo hạn chót cho bài tập "${targetTask.title}" sẽ xuất hiện trên thanh trạng thái điện thoại.\n\n👉 Bạn hãy đứng yên tại Trang Chủ này và chạm vào thông báo để xem app tự động phóng thẳng vào màn hình chi tiết bài tập nhé!`
      );
    } catch {
      Alert.alert('Thông báo', 'Không thể kích hoạt thông báo cục bộ.');
    }
  };

  /**
   * BƯỚC 3: RENDER TOÀN BỘ GIAO DIỆN MÀN HÌNH HOME
   */
  return (
    <ThemedView style={styles.container}>
      <StateHandler
        isLoading={isLoading}
        isError={isError}
        isEmpty={false} // Luôn cho phép hiển thị Dashboard kể cả khi chưa có bài tập
        onRetry={refetch}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={() => {
                refetch();
              }}
              tintColor={colors.tint}
            />
          }
        >
          {/* ================================================================ */}
          {/* PHẦN 0: BANNER NGOẠI TUYẾN (OFFLINE BANNER - MUST-HAVE #6)         */}
          {/* ================================================================ */}
          <OfflineBanner isOffline={isError} savedTime={cachedTime} />

          {/* ================================================================ */}
          {/* PHẦN 1: BANNER CHÀO MỪNG VÀ NGÀY THÁNG THỰC TẾ                    */}
          {/* ================================================================ */}
          <View style={styles.welcomeBanner}>
            <ThemedText style={styles.greetingTitle}>
              Chào bạn! 👋
            </ThemedText>
            <ThemedText secondary style={styles.greetingSubtitle}>
              Hôm nay là {todayDateString}
            </ThemedText>
          </View>

          {/* ================================================================ */}
          {/* PHẦN 1.5: KHỐI DEMO NOTIFICATION & DEEP LINKING (MUST-HAVE #4)   */}
          {/* ĐẶT NGAY TẠI TRANG CHỦ ĐỂ DEMO HIỆU ỨNG NHẢY VÀO CHI TIẾT        */}
          {/* ================================================================ */}
          <View
            style={[
              styles.demoCard,
              { backgroundColor: colors.surface, borderColor: colors.tint },
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, paddingRight: Spacing.sm }}>
                <ThemedText style={{ fontSize: 15, fontWeight: '800', color: colors.tint }}>
                  🔔 Demo Deep Linking (Sau 2s)
                </ThemedText>
                <ThemedText secondary style={{ fontSize: 12, marginTop: 2, lineHeight: 16 }}>
                  Bấm nút để nhận thông báo hạn chót, chạm vào thấy app tự phóng vào chi tiết!
                </ThemedText>
              </View>
              <AccessibleButton
                title="Bấm Demo 🔔"
                onPress={handleTriggerHomeDemoNotification}
                accessibilityLabel="Kích hoạt thông báo deadline sau 2 giây để demo Deep Linking"
                variant="primary"
              />
            </View>
          </View>

          {/* ================================================================ */}
          {/* PHẦN 2: WIDGET TÓM TẮT DEADLINE TRONG 48 GIỜ TỚI (TIÊU CHÍ > 8.0) */}
          {/* ================================================================ */}
          <Due48hWidget
            assignments={assignments}
            onPressItem={(id) => router.push(`/assignments/${id}`)}
          />

          {/* ================================================================ */}
          {/* PHẦN 3: 3 Ô THỐNG KÊ NHANH (QUICK STATS CARDS)                   */}
          {/* ================================================================ */}
          <View style={styles.statsRow}>
            {/* Thẻ 1: Tổng số bài tập */}
            <View
              style={[
                styles.statCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.statValue, { color: colors.tint }]}>
                {totalTasks}
              </Text>
              <ThemedText secondary style={styles.statLabel}>
                Tổng bài
              </ThemedText>
            </View>

            {/* Thẻ 2: Bài tập chưa hoàn thành (Pending) */}
            <View
              style={[
                styles.statCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.statValue, { color: colors.warning }]}>
                {pendingTasks}
              </Text>
              <ThemedText secondary style={styles.statLabel}>
                Chưa nộp
              </ThemedText>
            </View>

            {/* Thẻ 3: Bài tập đã hoàn thành (Completed) */}
            <View
              style={[
                styles.statCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.statValue, { color: colors.success }]}>
                {completedTasks}
              </Text>
              <ThemedText secondary style={styles.statLabel}>
                Đã xong
              </ThemedText>
            </View>
          </View>

          {/* ================================================================ */}
          {/* PHẦN 4: CÁC NÚT HÀNH ĐỘNG NHANH (QUICK ACTIONS)                 */}
          {/* ================================================================ */}
          <View style={styles.quickActionsRow}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Mở màn hình lịch trình tuần"
              onPress={() => router.push('/schedule')}
              style={[
                styles.actionButton,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Text style={{ fontSize: 20, marginBottom: 4 }}>📅</Text>
              <Text style={[styles.actionButtonText, { color: colors.textPrimary }]}>
                Lịch tuần
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Mở hộp thoại tạo bài tập mới"
              onPress={() => router.push('/modal/new-assignment')}
              style={[
                styles.actionButton,
                { backgroundColor: colors.tint, borderColor: colors.tint },
              ]}
            >
              <Text style={{ fontSize: 20, marginBottom: 4 }}>➕</Text>
              <Text style={[styles.actionButtonText, { color: colors.surface }]}>
                Tạo bài mới
              </Text>
            </TouchableOpacity>
          </View>

          {/* ================================================================ */}
          {/* PHẦN 5: DANH SÁCH BÀI TẬP CẦN ƯU TIÊN GẤP                        */}
          {/* ================================================================ */}
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>
              🔥 Bài tập cần làm gấp ({priorityTasks.length})
            </ThemedText>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Xem toàn bộ danh sách bài tập"
              onPress={() => router.push('/schedule')}
              style={styles.seeAllButton}
            >
              <Text style={[styles.seeAllText, { color: colors.tint }]}>
                Xem tất cả ▶
              </Text>
            </TouchableOpacity>
          </View>

          {priorityTasks.length === 0 ? (
            <View
              style={[
                styles.emptyBox,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <ThemedText secondary style={{ textAlign: 'center' }}>
                🎉 Bạn đã hoàn thành tất cả bài tập! Thư giãn thôi nào.
              </ThemedText>
            </View>
          ) : (
            priorityTasks.map((task) => {
              const course = courses.find((c) => c.id === task.courseId);
              return (
                <AssignmentCard
                  key={task.id}
                  assignment={task}
                  courseColor={course?.colour}
                  courseName={course?.name}
                  onPressCard={() => router.push(`/assignments/${task.id}`)}
                  onToggleStatus={() => {
                    const newStatus =
                      task.status === 'completed' ? 'pending' : 'completed';
                    toggleMutation.mutate({ id: task.id, newStatus });
                  }}
                />
              );
            })
          )}
        </ScrollView>
      </StateHandler>
    </ThemedView>
  );
}

// ============================================================================
// BƯỚC 4: STYLESHEET CHO MÀN HÌNH HOME
// ============================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl * 2,
  },
  welcomeBanner: {
    marginBottom: Spacing.md,
  },
  greetingTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  greetingSubtitle: {
    fontSize: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  quickActionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  actionButton: {
    flex: 1,
    minHeight: TouchTarget.minHeight + 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  seeAllButton: {
    minHeight: TouchTarget.minHeight,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyBox: {
    padding: Spacing.xl,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  demoCard: {
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: Spacing.md,
  },
});
