/**
 * ============================================================================
 * TÊN FILE: app/(auth)/_layout.tsx
 * VAI TRÒ: THÀNH VIÊN 2 (TV2 - Data Architecture, State, Auth & Logic)
 * ============================================================================
 * 
 * 📌 MỤC ĐÍCH FILE:
 * Stack layout cho nhóm màn hình xác thực (Sign In / Sign Up).
 * ============================================================================
 */

import React from 'react';
import { Stack } from 'expo-router';
import { useThemeColor } from '../../src/hooks/useThemeColor';

export default function AuthLayout() {
  const colors = useThemeColor();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="sign-in" options={{ title: 'Đăng nhập' }} />
    </Stack>
  );
}
