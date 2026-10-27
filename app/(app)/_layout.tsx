/**
 * ============================================================================
 * TÊN FILE: app/(app)/_layout.tsx
 * VAI TRÒ: APP STACK LAYOUT & ROUTE PROTECTION (TV2)
 * ============================================================================
 * 
 * 📌 MỤC ĐÍCH FILE:
 * Quản lý các route chính của ứng dụng và BẢO VỆ TUYỆT ĐỐI (Protected Routes):
 * 1. Kiểm tra session đăng nhập thông qua Zustand `selectIsAuthenticated`.
 * 2. Nếu đang kiểm tra phiên (`isLoading`), hiển thị ActivityIndicator.
 * 3. Nếu chưa có session (chưa đăng nhập hoặc đã sign-out), tự động chuyển hướng
 *    về màn hình `/(auth)/sign-in` (đúng chuẩn Lab 08 & yêu cầu đề tài của Thầy Vinh).
 * 4. `(tabs)`: Hệ thống thanh điều hướng Bottom Tabs (Trang chủ, Lịch tuần, Môn học).
 * 5. `assignments/[id]`: Màn hình Dynamic Route xem chi tiết bài tập (Hỗ trợ Deep Linking).
 * 6. `modal/new-assignment`: Hộp thoại Modal thêm bài tập mới (presentation: 'modal').
 * ============================================================================
 */

import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Stack, Redirect } from 'expo-router';
import { useThemeColor } from '../../src/hooks/useThemeColor';
import { useAuthStore, selectIsAuthenticated, selectAuthLoading } from '../../src/store/authStore';

export default function AppLayout() {
  const colors = useThemeColor();

  // Tiêu chí chấm điểm của Thầy Vinh: Dùng Selectors để lắng nghe trạng thái đăng nhập
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isLoading = useAuthStore(selectAuthLoading);

  // 1. Nếu đang kiểm tra token từ SecureStore, hiển thị màn hình chờ (Splash state)
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  // 2. Nếu chưa đăng nhập, tự động chuyển hướng về màn hình đăng nhập (Protected Route)
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  // 3. Nếu đã đăng nhập thành công, render toàn bộ Stack của ứng dụng
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '700',
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      {/* 1. Màn hình Tabs chính */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      {/* 2. Màn hình chi tiết bài tập (Dynamic Route [id]) */}
      <Stack.Screen
        name="assignments/[id]"
        options={{
          title: 'Chi tiết bài tập',
          headerBackTitle: 'Quay lại',
        }}
      />

      {/* 3. Màn hình Modal tạo bài tập mới */}
      <Stack.Screen
        name="modal/new-assignment"
        options={{
          presentation: 'modal',
          title: 'Thêm bài tập mới',
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
