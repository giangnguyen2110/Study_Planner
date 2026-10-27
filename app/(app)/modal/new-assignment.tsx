/**
 * ============================================================================
 * TÊN FILE: app/(app)/modal/new-assignment.tsx
 * VAI TRÒ: FORM TẠO BÀI TẬP MỚI (MODAL ROUTE BẮT BUỘC)
 * ============================================================================
 * 
 * 📌 MỤC ĐÍCH MÀN HÌNH:
 * Hộp thoại Modal thêm bài tập mới:
 * - Nhập tên bài tập, chọn môn học, ghi chú thêm.
 * - Tích hợp `expo-image-picker` để chụp hoặc chọn ảnh từ thư viện (`photoUri`).
 * - Tự động lên lịch thông báo qua `scheduleAssignmentNotification()`.
 * - Lưu bài tập lên Remote API qua TanStack Query Mutation và quay lại màn hình trước.
 * ============================================================================
 */

import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Image, ScrollView, Text, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ThemedView } from '../../../src/components/ui/ThemedView';
import { ThemedText } from '../../../src/components/ui/ThemedText';
import { AccessibleButton } from '../../../src/components/ui/AccessibleButton';
import { useCourses } from '../../../src/hooks/useCourses';
import { useAssignments, useCreateAssignment } from '../../../src/hooks/useAssignments';
import { useThemeColor } from '../../../src/hooks/useThemeColor';
import { scheduleAssignmentNotification } from '../../../src/hooks/useNotifications';
import { isDueWithin48Hours } from '../../../src/utils/dateUtils';
import { Spacing, TouchTarget } from '../../../src/constants/tokens';

export default function NewAssignmentModal() {
  const colors = useThemeColor();
  const router = useRouter();
  const { data: courses = [] } = useCourses();
  const createAssignmentMutation = useCreateAssignment();

  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState(courses[0]?.id || '1');
  const [notes, setNotes] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  // Khởi tạo hạn nộp mặc định là 23:59 ngày mai
  const [dueDate, setDueDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(23, 59, 0, 0);
    return d;
  });

  // Các hàm chọn nhanh thời hạn nộp bài
  const handleSelectPreset = (daysFromNow: number, hours = 23, minutes = 59) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    d.setHours(hours, minutes, 0, 0);
    setDueDate(d);
  };

  const handleSelectHoursFromNow = (hoursToAdd: number) => {
    const d = new Date(Date.now() + hoursToAdd * 3600 * 1000);
    setDueDate(d);
  };

  const handleAdjustDays = (days: number) => {
    const d = new Date(dueDate);
    d.setDate(d.getDate() + days);
    setDueDate(d);
  };

  const handleAdjustHours = (hours: number) => {
    const d = new Date(dueDate);
    d.setHours(d.getHours() + hours);
    setDueDate(d);
  };

  // Chọn ảnh từ thư viện ảnh thiết bị
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Vui lòng nhập tên bài tập!');
      return;
    }

    createAssignmentMutation.mutate(
      {
        title,
        courseId,
        notes: notes || undefined,
        photoUri: photoUri || undefined,
        status: 'pending',
        dueAt: dueDate.toISOString(),
      },
      {
        onSuccess: async (data) => {
          try {
            // Lên lịch thông báo trước hạn nộp 1 tiếng
            const triggerDate = new Date(dueDate.getTime() - 60 * 60 * 1000);
            if (triggerDate.getTime() > Date.now()) {
              await scheduleAssignmentNotification(data.id, title, triggerDate);
            }
          } catch {
            // Web / mock environment
          }
          router.back();
        },
      }
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Tên bài tập */}
        <ThemedText style={styles.label}>Tên bài tập (*)</ThemedText>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.surface }]}
          placeholder="Nhập tên bài tập cần làm..."
          placeholderTextColor={colors.textSecondary}
          value={title}
          onChangeText={setTitle}
        />

        {/* Chọn môn học */}
        <ThemedText style={styles.label}>Chọn môn học</ThemedText>
        <View style={styles.coursesGrid}>
          {courses.map((c) => {
            const isSelected = courseId === c.id;
            return (
              <AccessibleButton
                key={c.id}
                title={`${c.code} - ${c.name}`}
                onPress={() => setCourseId(c.id)}
                accessibilityLabel={`Chọn môn ${c.name}`}
                variant={isSelected ? 'primary' : 'secondary'}
                style={styles.courseSelectBtn}
              />
            );
          })}
        </View>

        {/* ================================================================ */}
        {/* PHẦN CHỌN HẠN NỘP BÀI TẬP (DEADLINE PICKER)                     */}
        {/* ================================================================ */}
        <ThemedText style={styles.label}>Hạn nộp bài tập (*)</ThemedText>

        {/* Khung hiển thị ngày giờ đã chọn */}
        <View style={[styles.datePreviewBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <ThemedText style={{ fontSize: 15, fontWeight: '800', color: colors.tint }}>
                📅 {dueDate.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
              </ThemedText>
              <ThemedText secondary style={{ fontSize: 13, marginTop: 2, fontWeight: '600' }}>
                ⏰ Lúc: {dueDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </ThemedText>
            </View>

            {/* Badge cảnh báo Widget 48h */}
            {isDueWithin48Hours(dueDate.toISOString()) && (
              <View style={[styles.badge48h, { backgroundColor: colors.warning + '25', borderColor: colors.warning }]}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: colors.warning }}>
                  ⏳ Trong 48h tới
                </Text>
              </View>
            )}
          </View>

          {/* Các nút tinh chỉnh (+/- ngày, +/- giờ) */}
          <View style={styles.adjustRow}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Lùi hạn nộp 1 ngày"
              onPress={() => handleAdjustDays(-1)}
              style={[styles.adjustBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
            >
              <Text style={{ color: colors.textPrimary, fontSize: 12, fontWeight: '600' }}>- 1 Ngày</Text>
            </TouchableOpacity>

            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Tăng hạn nộp 1 ngày"
              onPress={() => handleAdjustDays(1)}
              style={[styles.adjustBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
            >
              <Text style={{ color: colors.textPrimary, fontSize: 12, fontWeight: '600' }}>+ 1 Ngày</Text>
            </TouchableOpacity>

            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Lùi hạn nộp 1 giờ"
              onPress={() => handleAdjustHours(-1)}
              style={[styles.adjustBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
            >
              <Text style={{ color: colors.textPrimary, fontSize: 12, fontWeight: '600' }}>- 1 Giờ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Tăng hạn nộp 1 giờ"
              onPress={() => handleAdjustHours(1)}
              style={[styles.adjustBtn, { borderColor: colors.border, backgroundColor: colors.background }]}
            >
              <Text style={{ color: colors.textPrimary, fontSize: 12, fontWeight: '600' }}>+ 1 Giờ</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Các phím chọn nhanh hạn nộp */}
        <ThemedText secondary style={{ fontSize: 12, marginTop: Spacing.xs, marginBottom: Spacing.xs }}>
          ⚡ Phím chọn nhanh thời hạn:
        </ThemedText>
        <View style={styles.presetsRow}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Chọn hạn nộp hôm nay 23:59"
            onPress={() => handleSelectPreset(0)}
            style={[styles.presetChip, { borderColor: colors.border, backgroundColor: colors.surface }]}
          >
            <Text style={{ fontSize: 12, color: colors.textPrimary, fontWeight: '600' }}>Hôm nay (23:59)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Chọn hạn nộp ngày mai"
            onPress={() => handleSelectPreset(1)}
            style={[styles.presetChip, { borderColor: colors.tint, backgroundColor: colors.tint + '15' }]}
          >
            <Text style={{ fontSize: 12, color: colors.tint, fontWeight: '700' }}>⚡ Ngày mai</Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Chọn hạn nộp trong 48h tới"
            onPress={() => handleSelectHoursFromNow(36)}
            style={[styles.presetChip, { borderColor: colors.warning, backgroundColor: colors.warning + '15' }]}
          >
            <Text style={{ fontSize: 12, color: colors.warning, fontWeight: '700' }}>⏳ Trong 48h (+36h)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Chọn hạn nộp 3 ngày nữa"
            onPress={() => handleSelectPreset(3)}
            style={[styles.presetChip, { borderColor: colors.border, backgroundColor: colors.surface }]}
          >
            <Text style={{ fontSize: 12, color: colors.textPrimary, fontWeight: '600' }}>3 ngày nữa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Chọn hạn nộp 1 tuần nữa"
            onPress={() => handleSelectPreset(7)}
            style={[styles.presetChip, { borderColor: colors.border, backgroundColor: colors.surface }]}
          >
            <Text style={{ fontSize: 12, color: colors.textPrimary, fontWeight: '600' }}>1 tuần nữa</Text>
          </TouchableOpacity>
        </View>

        {/* Ghi chú */}
        <ThemedText style={styles.label}>Ghi chú thêm</ThemedText>
        <TextInput
          style={[styles.input, styles.textArea, { borderColor: colors.border, color: colors.textPrimary, backgroundColor: colors.surface }]}
          placeholder="Nhập ghi chú hoặc yêu cầu đề bài..."
          placeholderTextColor={colors.textSecondary}
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        {/* Chọn ảnh đính kèm */}
        <ThemedText style={styles.label}>Ảnh chụp bảng / Đề bài</ThemedText>
        <AccessibleButton
          title="📷 Chọn ảnh đính kèm từ thư viện"
          onPress={pickImage}
          accessibilityLabel="Mở thư viện ảnh để đính kèm vào bài tập"
          variant="secondary"
        />

        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.previewImage} resizeMode="cover" />
        ) : null}

        {/* Nút Lưu bài tập */}
        <View style={{ marginTop: Spacing.xl }}>
          <AccessibleButton
            title={createAssignmentMutation.isPending ? 'Đang lưu...' : '💾 Lưu bài tập mới'}
            onPress={handleSave}
            accessibilityLabel="Lưu bài tập mới vào hệ thống"
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
  label: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  input: {
    minHeight: TouchTarget.minHeight,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: Spacing.sm,
  },
  coursesGrid: {
    gap: Spacing.xs,
  },
  courseSelectBtn: {
    marginBottom: Spacing.xs,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginTop: Spacing.sm,
  },
  datePreviewBox: {
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: Spacing.xs,
  },
  badge48h: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  adjustRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  adjustBtn: {
    flex: 1,
    minHeight: TouchTarget.minHeight,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  presetChip: {
    paddingHorizontal: Spacing.sm,
    minHeight: TouchTarget.minHeight,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
