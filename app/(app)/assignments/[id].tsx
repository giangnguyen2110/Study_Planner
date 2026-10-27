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
 * - Cho phép bấm nút "🔔 Bật Nhắc Nhở Deadline" để kích hoạt thông báo sau 2s phục vụ DEMO VIVA.
 * - Cho phép bấm nút đánh dấu Đã Hoàn Thành / Chưa Hoàn Thành trực tiếp.
 * ============================================================================
 */

import React from 'react';
import { View, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedView } from '../../../src/components/ui/ThemedView';
import { ThemedText } from '../../../src/components/ui/ThemedText';
import { AccessibleButton } from '../../../src/components/ui/AccessibleButton';
import { useAssignments, useToggleAssignment } from '../../../src/hooks/useAssignments';
import { useCourses } from '../../../src/hooks/useCourses';
import { useThemeColor } from '../../../src/hooks/useThemeColor';
import { triggerImmediateDemoNotification } from '../../../src/hooks/useNotifications';
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

  /**
   * Kích hoạt thông báo nhắc deadline ngay tức thì (sau 2 giây) để Demo Viva
   */
  const handleTriggerDemoNotification = async () => {
    try {
      await triggerImmediateDemoNotification(item.id, item.title);
      Alert.alert(
        'Đã đặt nhắc nhở! ⏰',
        'Sau đúng 2 giây, thông báo deadline sẽ xuất hiện trên thanh trạng thái điện thoại.\n\nBạn hãy vuốt xuống và chạm vào thông báo để xem tính năng Deep Linking tự động mở lại trang này nhé!'
      );
    } catch {
      Alert.alert('Thông báo', 'Không thể gửi thông báo cục bộ.');
    }
  };

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

        {/* ================================================================ */}
        {/* KHỐI MUST-HAVE #4: LOCAL NOTIFICATION & DEEP LINKING DEMO       */}
        {/* ĐẶT NGAY ĐÂY ĐỂ VỪA VÀO LÀ THẤY NGAY, KHÔNG CẦN CUỘN TRANG!     */}
        {/* ================================================================ */}
        <View
          style={[
            styles.notificationBox,
            {
              backgroundColor: colors.surface,
              borderColor: colors.tint,
            },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs }}>
            <ThemedText style={{ fontSize: 16, fontWeight: '800', color: colors.tint }}>
              🔔 Nhắc Nhở Deadline & Deep Linking
            </ThemedText>
          </View>
          <ThemedText secondary style={{ fontSize: 13, marginBottom: Spacing.sm, lineHeight: 18 }}>
            Bấm nút bên dưới để nhận thông báo sau 2 giây. Khi banner thả xuống, chạm vào thông báo để xem Deep Linking tự động mở lại bài tập này!
          </ThemedText>
          <AccessibleButton
            title="🔔 Bật Nhắc Nhở Deadline (Nổ Sau 2s)"
            onPress={handleTriggerDemoNotification}
            accessibilityLabel="Kích hoạt thông báo nhắc deadline sau 2 giây để demo Deep Linking"
            variant="primary"
          />
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

        {/* KHỐI CÁC NÚT THAO TÁC HOÀN THÀNH */}
        <View style={styles.actionButtonGroup}>
          {/* ĐỔI TRẠNG THÁI HOÀN THÀNH (OPTIMISTIC UPDATE) */}
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
  notificationBox: {
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1.5,
    marginVertical: Spacing.md,
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 10,
    borderWidth: 1,
  },
  actionButtonGroup: {
    marginTop: Spacing.xl,
  },
});
