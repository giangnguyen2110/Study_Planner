/**
 * ============================================================================
 * TÊN FILE: app/(app)/(tabs)/courses.tsx
 * VAI TRÒ: DATA & LOGIC PRESENTATION (TV2)
 * ============================================================================
 * 
 * 📌 MỤC ĐÍCH MÀN HÌNH:
 * Màn hình Thống kê Tiến độ Môn học (Course Progress):
 * - Hiển thị danh sách các môn học kèm màu sắc nhận diện.
 * - Áp dụng LUẬT COMPUTED DATA: Sử dụng hàm `computeCourseProgress()` để tính toán
 *   tỉ lệ hoàn thành %, số bài đã nộp và số bài còn tồn đọng một cách động (computed).
 * ============================================================================
 */

import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { ThemedView } from '../../../src/components/ui/ThemedView';
import { ThemedText } from '../../../src/components/ui/ThemedText';
import { StateHandler } from '../../../src/components/ui/StateHandler';
import { useCourses } from '../../../src/hooks/useCourses';
import { useAssignments } from '../../../src/hooks/useAssignments';
import { useThemeColor } from '../../../src/hooks/useThemeColor';
import { computeCourseProgress } from '../../../src/utils/statsUtils';
import { Spacing } from '../../../src/constants/tokens';

export default function CoursesScreen() {
  const colors = useThemeColor();
  const { data: courses = [], isLoading: loadingCourses, isError: errorCourses, refetch: refetchCourses } = useCourses();
  const { data: assignments = [], isLoading: loadingAssignments, isError: errorAssignments, refetch: refetchAssignments } = useAssignments();

  const isLoading = loadingCourses || loadingAssignments;
  const isError = errorCourses || errorAssignments;

  const handleRetry = () => {
    refetchCourses();
    refetchAssignments();
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
