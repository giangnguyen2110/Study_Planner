/**
 * ============================================================================
 * TÊN FILE: app/(app)/assignments/[id].tsx
 * VAI TRÒ: DYNAMIC ROUTE CHI TIẾT BÀI TẬP (HỖ TRỢ DEEP LINKING TỪ NOTIFICATION)
 * ============================================================================
 * 
 * 📌 MỤC ĐÍCH MÀN HÌNH:
 * Màn hình xem chi tiết bài tập theo tham số `[id]`:
 * - Là đích đến của cơ chế Deep Linking khi người dùng chạm vào Notification deadline.
 * - Hiển thị đầy đủ thông tin: Tiêu đề, môn học, hạn nộp, ghi chú.
 * - Hiển thị ảnh chụp đề bài / bảng ghi chép (`photoUri`) nếu có.
 * - Cho phép bấm nút đánh dấu Đã Hoàn Thành / Chưa Hoàn Thành trực tiếp.
 * ============================================================================
 */

import React from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedView } from '../../../src/components/ui/ThemedView';
import { ThemedText } from '../../../src/components/ui/ThemedText';
import { AccessibleButton } from '../../../src/components/ui/AccessibleButton';
import { useAssignments, useToggleAssignment } from '../../../src/hooks/useAssignments';
import { useCourses } from '../../../src/hooks/useCourses';
import { useThemeColor } from '../../../src/hooks/useThemeColor';
import { Spacing } from '../../../src/constants/tokens';

export default function AssignmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useThemeColor();
  const { data: assignments = [] } = useAssignments();
  const { data: courses = [] } = useCourses();
  const toggleMutation = useToggleAssignment();

  // Tìm bài tập theo id từ params
  const item = assignments.find((a) => a.id === id);
  const course = courses.find((c) => c.id === item?.courseId);

  if (!item) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText style={{ fontSize: 16 }}>⚠️ Không tìm thấy thông tin bài tập này.</ThemedText>
      </ThemedView>
    );
  }

  const isCompleted = item.status === 'completed';
  const dueDateObj = new Date(item.dueAt);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Tiêu đề bài tập */}
        <ThemedText style={styles.title}>{item.title}</ThemedText>

        {/* Môn học */}
        {course && (
          <View style={[styles.badge, { backgroundColor: course.colour + '20', borderColor: course.colour }]}>
            <ThemedText style={{ color: course.colour, fontWeight: '700' }}>
              📚 {course.name} ({course.code})
            </ThemedText>
          </View>
        )}

        {/* Trạng thái bài tập */}
        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
          <ThemedText secondary style={styles.infoLabel}>Trạng thái:</ThemedText>
          <ThemedText style={{ color: isCompleted ? colors.success : colors.warning, fontWeight: '700' }}>
            {isCompleted ? '✅ Đã hoàn thành' : '⏳ Chưa nộp'}
          </ThemedText>
        </View>

        {/* Hạn nộp */}
        <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
          <ThemedText secondary style={styles.infoLabel}>Hạn chót:</ThemedText>
          <ThemedText style={styles.infoValue}>
            {dueDateObj.toLocaleDateString('vi-VN')} lúc {dueDateObj.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </ThemedText>
        </View>

        {/* Ghi chú thêm */}
        {item.notes ? (
          <View style={[styles.notesBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <ThemedText style={{ fontWeight: '700', marginBottom: 4 }}>📝 Ghi chú:</ThemedText>
            <ThemedText style={{ lineHeight: 22 }}>{item.notes}</ThemedText>
          </View>
        ) : null}

        {/* Ảnh đính kèm (Photo Attachment) */}
        {item.photoUri ? (
          <View style={styles.photoContainer}>
            <ThemedText style={{ fontWeight: '700', marginBottom: Spacing.sm }}>
              📷 Ảnh chụp bảng / Đề bài đính kèm:
            </ThemedText>
            <Image
              source={{ uri: item.photoUri }}
              style={[styles.image, { borderColor: colors.border }]}
              resizeMode="cover"
            />
          </View>
        ) : null}

        {/* Nút đổi trạng thái hoàn thành */}
        <View style={{ marginTop: Spacing.xl }}>
          <AccessibleButton
            title={isCompleted ? 'Đánh dấu CHƯA HOÀN THÀNH' : 'Đánh dấu ĐÃ HOÀN THÀNH ✓'}
            onPress={() => {
              toggleMutation.mutate({
                id: item.id,
                newStatus: isCompleted ? 'pending' : 'completed',
              });
            }}
            accessibilityLabel="Đổi trạng thái hoàn thành của bài tập"
            variant={isCompleted ? 'secondary' : 'primary'}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl * 2,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: Spacing.sm,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs + 2,
    borderBottomWidth: 0.5,
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  notesBox: {
    padding: Spacing.md,
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: Spacing.md,
  },
  photoContainer: {
    marginTop: Spacing.sm,
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 10,
    borderWidth: 1,
  },
});
