/**
 * ============================================================================
 * TÊN FILE: app/(app)/_layout.tsx
 * VAI TRÒ: APP STACK LAYOUT (QUẢN LÝ ĐIỀU HƯỚNG TẦNG ỨNG DỤNG)
 * ============================================================================
 * 
 * 📌 MỤC ĐÍCH FILE:
 * Quản lý các route chính của ứng dụng:
 * 1. `(tabs)`: Hệ thống thanh điều hướng Bottom Tabs (Trang chủ, Lịch tuần, Môn học).
 * 2. `assignments/[id]`: Màn hình Dynamic Route xem chi tiết bài tập (Hỗ trợ Deep Linking).
 * 3. `modal/new-assignment`: Hộp thoại Modal thêm bài tập mới (presentation: 'modal').
 * ============================================================================
 */

import React from 'react';
import { Stack } from 'expo-router';
import { useThemeColor } from '../../src/hooks/useThemeColor';

export default function AppLayout() {
  const colors = useThemeColor();

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
