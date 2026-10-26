/**
 * ============================================================================
 * TÊN FILE: src/components/ui/StateHandler.tsx
 * VAI TRÒ: COMPONENT ĐIỀU PHỐI TRẠNG THÁI (TV2 - PHỤC VỤ CHUNG CHO CẢ TV1 & TV2)
 * ============================================================================
 * 
 * 📌 MỤC ĐÍCH COMPONENT:
 * Đáp ứng 100% LUẬT 4 TRẠNG THÁI (4-STATES LAW) của đề tài:
 * "Every screen handles all four states: loading, empty, error with a working retry, and content".
 * 
 * 🎯 4 TRẠNG THÁI ĐƯỢC XỬ LÝ:
 * 1. Loading State: Hiển thị ActivityIndicator xoay tròn + thông báo đang tải.
 * 2. Error State: Hiển thị thông báo lỗi + nút bấm "Thử lại" (AccessibleButton) gọi fetch lại thật.
 * 3. Empty State: Hiển thị thông báo danh sách trống.
 * 4. Content State: Hiển thị nội dung chính của màn hình (`children`).
 * 
 * 🎓 CÂU HỎI VẤN ĐÁP (VIVA) CỦA THẦY NGUYỄN XUÂN VINH:
 * - Câu hỏi: "Tại sao nhóm lại tạo component StateHandler bọc các màn hình?"
 * - Trả lời: "Dạ thưa Thầy, theo tiêu chuẩn kỹ thuật của Đồ án, mọi màn hình tải dữ liệu từ Remote API
 *   đều bắt buộc phải xử lý đủ 4 trạng thái: Loading, Empty, Error với nút Thử lại hoạt động thật, và
 *   Content khi có dữ liệu. Việc gom vào `StateHandler` giúp loại bỏ code trùng lặp ở tất cả các màn hình,
 *   đảm bảo trải nghiệm người dùng nhất quán và nút 'Thử lại' luôn kích hoạt hàm refetch() của TanStack Query."
 * ============================================================================
 */

import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { AccessibleButton } from './AccessibleButton';
import { Spacing } from '../../constants/tokens';

interface Props {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  onRetry: () => void;
  children: React.ReactNode;
}

export function StateHandler({
  isLoading,
  isError,
  isEmpty,
  onRetry,
  children,
}: Props) {
  const colors = useThemeColor();

  // 1. TRẠNG THÁI ĐANG TẢI (LOADING)
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={[styles.message, { color: colors.textSecondary }]}>
          Đang tải dữ liệu học tập...
        </Text>
      </View>
    );
  }

  // 2. TRẠNG THÁI LỖI (ERROR) - KÈM NÚT THỬ LẠI GỌI HÀM ONRETRY THẬT
  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={[styles.message, { color: colors.error, fontWeight: '600' }]}>
          ⚠️ Đã có lỗi xảy ra khi kết nối máy chủ!
        </Text>
        <AccessibleButton
          title="Thử lại tải dữ liệu"
          onPress={onRetry}
          accessibilityLabel="Thử lại tải dữ liệu từ máy chủ"
        />
      </View>
    );
  }

  // 3. TRẠNG THÁI DANH SÁCH TRỐNG (EMPTY)
  if (isEmpty) {
    return (
      <View style={styles.center}>
        <Text style={[styles.message, { color: colors.textSecondary }]}>
          📭 Danh sách hiện đang trống.
        </Text>
      </View>
    );
  }

  // 4. TRẠNG THÁI CÓ DỮ LIỆU (CONTENT)
  return <>{children}</>;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  message: {
    fontSize: 15,
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
});
