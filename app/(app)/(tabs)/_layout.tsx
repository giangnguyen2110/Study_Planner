/**
 * ============================================================================
 * TÊN FILE: app/(app)/(tabs)/_layout.tsx
 * VAI TRÒ: BOTTOM TABS LAYOUT (THANH ĐIỀU HƯỚNG DƯỚI ĐÁY ỨNG DỤNG)
 * ============================================================================
 * 
 * 📌 MỤC ĐÍCH FILE:
 * Định nghĩa thanh điều hướng 3 Tab chính của Study Planner:
 * 1. Tab 1: `index` — Trang Chủ / Home Dashboard (Do TV1 phụ trách).
 * 2. Tab 2: `schedule` — Lịch Trình Học Tập & Weekly Calendar (Do TV1 phụ trách).
 * 3. Tab 3: `courses` — Tiến Độ & Quản Lý Môn Học (Do TV2 phụ trách).
 * 
 * ⚠️ QUY TẮC BẮT BUỘC:
 * - Tuân thủ Luật Zero-Hex: Màu thanh tab lấy từ `useThemeColor()`.
 * - Vùng chạm tối thiểu mỗi tab đạt chuẩn Trợ năng 44x44 pt.
 * ============================================================================
 */

import React from 'react';
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useThemeColor } from '../../../src/hooks/useThemeColor';

export default function TabLayout() {
  const colors = useThemeColor();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
        },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontWeight: '700',
        },
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      {/* TAB 1: TRANG CHỦ (TV1) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trang chủ',
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20 }}>🏠</Text>
          ),
        }}
      />

      {/* TAB 2: LỊCH HỌC & BÀI TẬP (TV1) */}
      <Tabs.Screen
        name="schedule"
        options={{
          title: 'Lịch học',
          tabBarLabel: 'Lịch học',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20 }}>🗓️</Text>
          ),
        }}
      />

      {/* TAB 3: MÔN HỌC & TIẾN ĐỘ (TV2) */}
      <Tabs.Screen
        name="courses"
        options={{
          title: 'Tiến độ môn',
          tabBarLabel: 'Tiến độ môn',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20 }}>📊</Text>
          ),
        }}
      />
    </Tabs>
  );
}
