/**
 * ============================================================================
 * TÊN FILE: app/+not-found.tsx
 * VAI TRÒ: THÀNH VIÊN 1 (TV1 - Frontend UI/UX, Navigation & Notification)
 * ============================================================================
 * 
 * 📌 MỤC ĐÍCH MÀN HÌNH:
 * Màn hình Lỗi 404 (Not Found Route) của ứng dụng theo chuẩn Expo Router:
 * - Tự động hiển thị khi người dùng truy cập một URL hoặc Deep Link không tồn tại
 *   trong cấu trúc thư mục route của ứng dụng.
 * - Cung cấp liên kết quay trở lại Màn hình chính (`/`).
 * - Tuân thủ tuyệt đối Luật Zero-Hex và tiêu chuẩn trợ năng Accessibility.
 * 
 * 🎓 CÂU HỎI VẤN ĐÁP (VIVA) CỦA THẦY NGUYỄN XUÂN VINH:
 * - Câu hỏi: "Tại sao tên file lại có dấu cộng `+not-found.tsx` và cơ chế hoạt động của nó trong Expo Router là gì?"
 * - Trả lời: "Dạ thưa Thầy, trong Expo Router, tiền tố dấu cộng `+` quy định các quy ước đặc biệt của hệ thống
 *   (Special convention files). File `+not-found.tsx` đóng vai trò là một 'Catch-all Unmatched Route'. Bất kỳ
 *   khi nào người dùng nhập sai URL hoặc Deep Link trỏ tới một path không tồn tại trong thư mục `app/`, Expo Router
 *   sẽ bắt lấy lỗi 404 và tự động hiển thị màn hình fallback này thay vì làm crash ứng dụng."
 * ============================================================================
 */

// ============================================================================
// BƯỚC 1: IMPORT CÁC THƯ VIỆN, ROUTER VÀ THEMED COMPONENTS
// ============================================================================
import React from 'react';
import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../src/components/ui/ThemedText';
import { useThemeColor } from '../src/hooks/useThemeColor';
import { Spacing, TouchTarget } from '../src/constants/tokens';

// ============================================================================
// BƯỚC 2: KHAI BÁO COMPONENT NotFoundScreen
// ============================================================================
export default function NotFoundScreen() {
  // Lấy bảng màu hiện tại theo Light/Dark theme (Zero-Hex)
  const colors = useThemeColor();

  /**
   * BƯỚC 3: RENDER GIAO DIỆN 404 NOT FOUND
   */
  return (
    <>
      {/* 3.1. Cấu hình tiêu đề thanh Header qua Stack.Screen */}
      <Stack.Screen options={{ title: 'Không tìm thấy trang' }} />

      {/* 3.2. Nội dung thông báo lỗi và nút quay về trang chủ */}
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ThemedText style={styles.icon}>🔍</ThemedText>
        <ThemedText style={styles.title}>Trang này không tồn tại!</ThemedText>
        <ThemedText secondary style={styles.subtitle}>
          Đường dẫn bạn đang cố gắng truy cập có thể đã bị di chuyển hoặc không đúng.
        </ThemedText>

        {/* Nút bấm liên kết quay lại Màn hình chính */}
        <Link
          href="/"
          style={[
            styles.link,
            {
              backgroundColor: colors.tint,
              color: colors.surface,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Quay lại màn hình chính của ứng dụng"
        >
          Quay lại màn hình chính!
        </Link>
      </View>
    </>
  );
}

// ============================================================================
// BƯỚC 4: STYLESHEET CHO MÀN HÌNH 404
// ============================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  icon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 20,
  },
  link: {
    minHeight: TouchTarget.minHeight,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 8,
    fontWeight: '700',
    fontSize: 15,
    overflow: 'hidden',
    textAlign: 'center',
  },
});
