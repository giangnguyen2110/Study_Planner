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

  // Quản lý tháng / năm trên cuốn lịch chọn ngày
  const [calMonth, setCalMonth] = useState<number>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.getMonth();
  });
  const [calYear, setCalYear] = useState<number>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.getFullYear();
  });

  // Chuyển tháng trên lịch
  const handlePrevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else {
      setCalMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else {
      setCalMonth((m) => m + 1);
    }
  };

  // Chọn 1 ngày cụ thể trên lịch
  const handleSelectDay = (day: number) => {
    const d = new Date(dueDate);
    d.setFullYear(calYear, calMonth, day);
    setDueDate(d);
  };

  // Chọn giờ nộp bài tập
  const handleSelectTime = (hours: number, minutes = 0) => {
    const d = new Date(dueDate);
    d.setHours(hours, minutes, 0, 0);
    setDueDate(d);
  };

  // Các hàm chọn nhanh thời hạn nộp bài
  const handleSelectPreset = (daysFromNow: number, hours = 23, minutes = 59) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    d.setHours(hours, minutes, 0, 0);
    setDueDate(d);
    setCalMonth(d.getMonth());
    setCalYear(d.getFullYear());
  };

  const handleSelectHoursFromNow = (hoursToAdd: number) => {
    const d = new Date(Date.now() + hoursToAdd * 3600 * 1000);
    setDueDate(d);
    setCalMonth(d.getMonth());
    setCalYear(d.getFullYear());
  };

  const handleAdjustDays = (days: number) => {
    const d = new Date(dueDate);
    d.setDate(d.getDate() + days);
    setDueDate(d);
    setCalMonth(d.getMonth());
    setCalYear(d.getFullYear());
  };

  const handleAdjustHours = (hours: number) => {
    const d = new Date(dueDate);
    let h = d.getHours() + hours;
    if (h < 0) h = 23;
    else if (h > 23) h = 0;
    d.setHours(h);
    setDueDate(d);
  };

  const handleAdjustMinutes = (minutes: number) => {
    const d = new Date(dueDate);
    let m = d.getMinutes() + minutes;
    if (m < 0) m = 55;
    else if (m > 59) m = 0;
    d.setMinutes(m);
    setDueDate(d);
  };

  const handleSetMinute = (minute: number) => {
    const d = new Date(dueDate);
    d.setMinutes(minute);
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
        {/* PHẦN CHỌN HẠN NỘP BÀI TẬP (DEADLINE PICKER & INTERACTIVE CALENDAR) */}
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
        </View>

        {/* Các phím chọn nhanh hạn nộp */}
        <ThemedText secondary style={{ fontSize: 12, marginTop: Spacing.xs, marginBottom: Spacing.xs }}>
          ⚡ Phím chọn nhanh:
        </ThemedText>
        <View style={styles.presetsRow}>
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

        {/* CUỐN LỊCH CHỌN NGÀY TRỰC QUAN (INTERACTIVE CALENDAR) */}
        <View style={[styles.calendarBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {/* Thanh chuyển tháng */}
          <View style={styles.calHeader}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Xem tháng trước"
              onPress={handlePrevMonth}
              style={[styles.calNavBtn, { borderColor: colors.border }]}
            >
              <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: 'bold' }}>◀</Text>
            </TouchableOpacity>

            <ThemedText style={{ fontSize: 15, fontWeight: '800', color: colors.tint }}>
              {[
                'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
                'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
              ][calMonth]}, {calYear}
            </ThemedText>

            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Xem tháng sau"
              onPress={handleNextMonth}
              style={[styles.calNavBtn, { borderColor: colors.border }]}
            >
              <Text style={{ color: colors.textPrimary, fontSize: 16, fontWeight: 'bold' }}>▶</Text>
            </TouchableOpacity>
          </View>

          {/* Hàng tên thứ (T2 -> CN) */}
          <View style={styles.weekdaysRow}>
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((w, idx) => (
              <Text
                key={idx}
                style={[
                  styles.weekdayText,
                  { color: idx >= 5 ? colors.warning : colors.textSecondary },
                ]}
              >
                {w}
              </Text>
            ))}
          </View>

          {/* Lưới các ngày trong tháng */}
          <View style={styles.daysGrid}>
            {/* Các ô trống trước ngày mùng 1 */}
            {Array.from({ length: (new Date(calYear, calMonth, 1).getDay() + 6) % 7 }).map((_, i) => (
              <View key={`empty-${i}`} style={styles.dayCell} />
            ))}

            {/* Các ngày trong tháng */}
            {Array.from({ length: new Date(calYear, calMonth + 1, 0).getDate() }, (_, i) => i + 1).map((day) => {
              const isSelected =
                dueDate.getDate() === day &&
                dueDate.getMonth() === calMonth &&
                dueDate.getFullYear() === calYear;

              const today = new Date();
              const isToday =
                today.getDate() === day &&
                today.getMonth() === calMonth &&
                today.getFullYear() === calYear;

              return (
                <View key={`day-${day}`} style={styles.dayCell}>
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={`Chọn ngày ${day} tháng ${calMonth + 1} năm ${calYear}`}
                    onPress={() => handleSelectDay(day)}
                    style={[
                      styles.dayButton,
                      isSelected && { backgroundColor: colors.tint },
                      isToday && !isSelected && { borderWidth: 1.5, borderColor: colors.tint },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: isSelected || isToday ? '700' : '500',
                        color: isSelected ? colors.surface : colors.textPrimary,
                      }}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          {/* CHỌN GIỜ & PHÚT NỘP BÀI CHI TIẾT (CUSTOM TIME PICKER) */}
          <View style={[styles.timeRow, { borderTopColor: colors.border }]}>
            <View style={styles.timeHeaderRow}>
              <ThemedText style={{ fontSize: 13, fontWeight: '700' }}>
                ⏰ Giờ nộp bài:
              </ThemedText>
              <View style={[styles.timeDisplayBadge, { backgroundColor: colors.tint + '18', borderColor: colors.tint }]}>
                <Text style={{ fontSize: 14, fontWeight: '800', color: colors.tint }}>
                  {String(dueDate.getHours()).padStart(2, '0')}:{String(dueDate.getMinutes()).padStart(2, '0')}
                </Text>
              </View>
            </View>

            {/* Stepper điều chỉnh Giờ và Phút */}
            <View style={styles.stepperContainer}>
              {/* Cụm Giờ */}
              <View style={styles.stepperGroup}>
                <ThemedText secondary style={styles.stepperLabel}>GIỜ (0 - 23)</ThemedText>
                <View style={styles.stepperControls}>
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel="Giảm 1 giờ"
                    onPress={() => handleAdjustHours(-1)}
                    style={[styles.stepperBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}
                  >
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.textPrimary }}>−</Text>
                  </TouchableOpacity>
                  <View style={[styles.stepperValueBox, { borderColor: colors.border, backgroundColor: colors.background }]}>
                    <Text style={{ fontSize: 15, fontWeight: '800', color: colors.textPrimary }}>
                      {String(dueDate.getHours()).padStart(2, '0')}
                    </Text>
                  </View>
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel="Tăng 1 giờ"
                    onPress={() => handleAdjustHours(1)}
                    style={[styles.stepperBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}
                  >
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.textPrimary }}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.textSecondary, alignSelf: 'center', marginTop: 16 }}>:</Text>

              {/* Cụm Phút */}
              <View style={styles.stepperGroup}>
                <ThemedText secondary style={styles.stepperLabel}>PHÚT (0 - 59)</ThemedText>
                <View style={styles.stepperControls}>
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel="Giảm 5 phút"
                    onPress={() => handleAdjustMinutes(-5)}
                    style={[styles.stepperBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}
                  >
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.textPrimary }}>−</Text>
                  </TouchableOpacity>
                  <View style={[styles.stepperValueBox, { borderColor: colors.border, backgroundColor: colors.background }]}>
                    <Text style={{ fontSize: 15, fontWeight: '800', color: colors.textPrimary }}>
                      {String(dueDate.getMinutes()).padStart(2, '0')}
                    </Text>
                  </View>
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel="Tăng 5 phút"
                    onPress={() => handleAdjustMinutes(5)}
                    style={[styles.stepperBtn, { borderColor: colors.border, backgroundColor: colors.surface }]}
                  >
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.textPrimary }}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Mốc giờ thông dụng */}
            <View style={styles.timeChipsSection}>
              <ThemedText secondary style={{ fontSize: 11, fontWeight: '600', marginBottom: 4 }}>
                ⚡ Mốc giờ thông dụng:
              </ThemedText>
              <View style={styles.timeChips}>
                {[
                  { label: '23:59 (Đêm)', h: 23, m: 59 },
                  { label: '17:00 (Chiều)', h: 17, m: 0 },
                  { label: '12:00 (Trưa)', h: 12, m: 0 },
                  { label: '08:00 (Sáng)', h: 8, m: 0 },
                ].map((t) => {
                  const isTimeSelected =
                    dueDate.getHours() === t.h && dueDate.getMinutes() === t.m;
                  return (
                    <TouchableOpacity
                      key={t.label}
                      accessibilityRole="button"
                      accessibilityLabel={`Chọn mốc ${t.label}`}
                      onPress={() => handleSelectTime(t.h, t.m)}
                      style={[
                        styles.timeChip,
                        {
                          backgroundColor: isTimeSelected ? colors.tint : colors.background,
                          borderColor: isTimeSelected ? colors.tint : colors.border,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: '600',
                          color: isTimeSelected ? colors.surface : colors.textPrimary,
                        }}
                      >
                        {t.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
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
    marginBottom: Spacing.sm,
  },
  presetChip: {
    paddingHorizontal: Spacing.sm,
    minHeight: TouchTarget.minHeight,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarBox: {
    padding: Spacing.sm,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  calHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  calNavBtn: {
    minHeight: TouchTarget.minHeight,
    minWidth: TouchTarget.minHeight,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
  },
  weekdaysRow: {
    flexDirection: 'row',
    marginBottom: Spacing.xs,
  },
  weekdayText: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    minHeight: TouchTarget.minHeight,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  dayButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeRow: {
    borderTopWidth: 1,
    paddingTop: Spacing.sm,
    marginTop: Spacing.xs,
  },
  timeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  timeDisplayBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    marginVertical: Spacing.xs,
  },
  stepperGroup: {
    alignItems: 'center',
  },
  stepperLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepperBtn: {
    width: TouchTarget.minHeight,
    height: TouchTarget.minHeight,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperValueBox: {
    minWidth: 44,
    height: TouchTarget.minHeight,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  timeChipsSection: {
    marginTop: Spacing.sm,
  },
  timeChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  timeChip: {
    paddingHorizontal: Spacing.sm,
    minHeight: TouchTarget.minHeight,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
