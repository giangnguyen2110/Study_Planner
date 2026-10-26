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
import { View, TextInput, StyleSheet, Image, ScrollView, Text } from 'react-native';
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

    const defaultDue = new Date(Date.now() + 24 * 60 * 60 * 1000);

    createAssignmentMutation.mutate(
      {
        title,
        courseId,
        notes: notes || undefined,
        photoUri: photoUri || undefined,
        status: 'pending',
        dueAt: defaultDue.toISOString(),
      },
      {
        onSuccess: async (data) => {
          try {
            const triggerDate = new Date(Date.now() + 23 * 60 * 60 * 1000);
            await scheduleAssignmentNotification(data.id, title, triggerDate);
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
});
