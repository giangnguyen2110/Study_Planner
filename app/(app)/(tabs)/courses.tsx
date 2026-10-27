/**
 * ============================================================================
 * TÊN FILE: app/(app)/(tabs)/courses.tsx
 * VAI TRÒ: DATA & LOGIC PRESENTATION (TV2)
 * ============================================================================
 * 
 * 📌 MỤC ĐÍCH MÀN HÌNH:
 * Màn hình Quản Lý Môn Học & Hồ Sơ Sinh Viên:
 * 1. Khối thông tin cá nhân (Profile Card) hiển thị tên sinh viên, MSSV và nút ĐĂNG XUẤT (Sign Out).
 * 2. Đăng xuất triệt để: Xóa token trong SecureStore và xóa sạch bộ nhớ cache của TanStack Query.
 * 3. Hiển thị danh sách môn học kèm thanh tiến độ phần trăm (%) hoàn thành.
 * 4. Áp dụng LUẬT COMPUTED DATA: Sử dụng hàm `computeCourseProgress()` để tính toán
 *    tỉ lệ hoàn thành %, số bài đã nộp và số bài còn tồn đọng một cách động (computed, never stored).
 * ============================================================================
 */

import React from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { ThemedView } from '../../../src/components/ui/ThemedView';
import { ThemedText } from '../../../src/components/ui/ThemedText';
import { AccessibleButton } from '../../../src/components/ui/AccessibleButton';
import { StateHandler } from '../../../src/components/ui/StateHandler';
import { useCourses } from '../../../src/hooks/useCourses';
import { useAssignments } from '../../../src/hooks/useAssignments';
import { useThemeColor } from '../../../src/hooks/useThemeColor';
import { computeCourseProgress } from '../../../src/utils/statsUtils';
import { Spacing } from '../../../src/constants/tokens';
import { useAuthStore, selectCurrentUser } from '../../../src/store/authStore';
import { useQueryClient } from '@tanstack/react-query';

export default function CoursesScreen() {
  const colors = useThemeColor();
  const queryClient = useQueryClient();

  // Tiêu chí chấm điểm của Thầy Vinh: Dùng Selector lấy thông tin user và hàm signOut
  const currentUser = useAuthStore(selectCurrentUser);
  const signOut = useAuthStore((state) => state.signOut);

  const { data: courses = [], isLoading: loadingCourses, isError: errorCourses, refetch: refetchCourses } = useCourses();
  const { data: assignments = [], isLoading: loadingAssignments, isError: errorAssignments, refetch: refetchAssignments } = useAssignments();

  const isLoading = loadingCourses || loadingAssignments;
  const isError = errorCourses || errorAssignments;

  const handleRetry = () => {
    refetchCourses();
    refetchAssignments();
  };

  /**
   * Xử lý Đăng xuất triệt để (Sign Out)
   * Theo yêu cầu Lab 08 & Đề tài: Xóa token trong SecureStore, reset Zustand store và xóa sạch TanStack Query Cache!
   */
  const handleSignOut = () => {
    Alert.alert('Xác nhận đăng xuất', 'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          // 1. Dọn sạch bộ nhớ cache của TanStack Query (chống rò rỉ dữ liệu giữa user A và user B)
          queryClient.clear();
          // 2. Xóa token và user khỏi SecureStore, reset Zustand state
          await signOut();
        },
      },
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      <StateHandler
        isLoading={isLoading}
        isError={isError}
        isEmpty={courses.length === 0}
        onRetry={handleRetry}
      >
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={[styles.profileCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.profileInfo}>
                <Text style={styles.avatarEmoji}>🎓</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.userName, { color: colors.textPrimary }]}>
                    {currentUser?.name ?? 'Sinh viên DNTU'}
                  </Text>
                  <ThemedText secondary style={styles.userEmail}>
                    {currentUser?.email ?? 'student@dntu.edu.vn'}
                  </ThemedText>
                  <ThemedText secondary style={styles.userMssv}>
                    MSSV: {currentUser?.studentId ?? '1923051154'}
                  </ThemedText>
                </View>
              </View>

              <View style={{ marginTop: Spacing.md }}>
                <AccessibleButton
                  title="🚪 Đăng Xuất (Sign Out)"
                  onPress={handleSignOut}
                  accessibilityLabel="Đăng xuất khỏi ứng dụng và dọn sạch session"
                  variant="danger"
                />
              </View>
            </View>
          }
          renderItem={({ item }) => {
            const stats = computeCourseProgress(item.id, assignments);

            return (
              <View
                style={[
                  styles.courseCard,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
              >
                {/* Vạch màu môn học */}
                <View style={[styles.colorBar, { backgroundColor: item.colour }]} />

                <View style={styles.content}>
                  {/* Tên và mã môn học */}
                  <View style={styles.titleRow}>
                    <Text style={[styles.courseName, { color: colors.textPrimary }]}>
                      {item.name}
                    </Text>
                    <Text style={[styles.courseCode, { color: item.colour }]}>
                      {item.code}
                    </Text>
                  </View>

                  {/* Thanh tiến độ phần trăm (Progress Bar) */}
                  <View style={[styles.progressBarBg, { backgroundColor: colors.border }]}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          backgroundColor: item.colour,
                          width: `${stats.percentage}%`,
                        },
                      ]}
                    />
                  </View>

                  {/* Thống kê chi tiết */}
                  <View style={styles.statsRow}>
                    <ThemedText secondary style={styles.statsText}>
                      Tiến độ: {stats.percentage}%
                    </ThemedText>
                    <ThemedText secondary style={styles.statsText}>
                      Đã xong: {stats.completed}/{stats.total} bài
                    </ThemedText>
                    <ThemedText secondary style={styles.statsText}>
                      Còn lại: {stats.outstanding} bài
                    </ThemedText>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </StateHandler>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
  },
  listContent: {
    paddingBottom: Spacing.xl,
  },
  profileCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  userName: {
    fontSize: 17,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: 13,
    marginTop: 2,
  },
  userMssv: {
    fontSize: 12,
    marginTop: 2,
  },
  courseCard: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    alignItems: 'center',
    elevation: 1,
  },
  colorBar: {
    width: 6,
    alignSelf: 'stretch',
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  courseName: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  courseCode: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: Spacing.sm,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: Spacing.xs,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  statsText: {
    fontSize: 12,
  },
});
