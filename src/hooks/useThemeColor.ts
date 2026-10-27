/**
 * ============================================================================
 * TÊN FILE: src/hooks/useThemeColor.ts
 * VAI TRÒ: THÀNH VIÊN 1 (TV1 - Frontend UI/UX, Navigation & Notification)
 * ============================================================================
 * 
 * 📌 MỤC ĐÍCH FILE:
 * Quản lý toàn bộ hệ thống Màu sắc và Chế độ Sáng / Tối (Theme Mode):
 * 1. Hỗ trợ 3 chế độ: 'system' (tự động theo hệ điều hành), 'light' (ép Sáng), 'dark' (ép Tối).
 * 2. Lưu trạng thái trong Zustand Store `useThemeStore` để phản hồi tức thì 60fps trên toàn app.
 * 3. `useThemeColor()`: Trả về bảng màu `ColorTheme` tương ứng (Colors.light hoặc Colors.dark).
 * 4. `useThemePreference()`: Cung cấp hàm chuyển đổi chế độ thủ công trực tiếp từ giao diện app.
 * 
 * ⚠️ QUY TẮC BẮT BUỘC (LUẬT ZERO-HEX):
 * Mọi component trong ứng dụng ĐỀU PHẢI gọi hook này để lấy màu sắc từ Design Tokens.
 * ============================================================================
 */

import { useColorScheme } from 'react-native';
import { create } from 'zustand';
import { Colors, ColorTheme } from '../constants/tokens';

export type ThemePreference = 'system' | 'light' | 'dark';

interface ThemeStoreState {
  themePreference: ThemePreference;
  setThemePreference: (pref: ThemePreference) => void;
}

/**
 * Zustand Store quản lý tùy chọn Theme của người dùng
 */
export const useThemeStore = create<ThemeStoreState>((set) => ({
  themePreference: 'system',
  setThemePreference: (pref) => set({ themePreference: pref }),
}));

/**
 * Custom Hook `useThemePreference`:
 * Cho phép các màn hình (Home, Settings, Profile) hiển thị nút chuyển đổi Sáng / Tối.
 */
export function useThemePreference() {
  const systemScheme = useColorScheme();

  let themePreference: ThemePreference = 'system';
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    themePreference = useThemeStore.getState().themePreference;
  } else {
    try {
      themePreference = useThemeStore((state) => state.themePreference);
    } catch {
      themePreference = useThemeStore.getState().themePreference;
    }
  }

  const setThemePreference = (pref: ThemePreference) => {
    useThemeStore.getState().setThemePreference(pref);
  };

  const activeTheme: 'light' | 'dark' =
    themePreference === 'system'
      ? systemScheme === 'dark'
        ? 'dark'
        : 'light'
      : themePreference;

  return {
    themePreference,
    activeTheme,
    setThemePreference,
  };
}

/**
 * Custom Hook `useThemeColor`:
 * Trả về toàn bộ bảng màu chuẩn của theme hiện hành từ Design Tokens.
 */
export function useThemeColor(): ColorTheme {
  const systemScheme = useColorScheme();

  let themePreference: ThemePreference = 'system';
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    themePreference = useThemeStore.getState().themePreference;
  } else {
    try {
      themePreference = useThemeStore((state) => state.themePreference);
    } catch {
      themePreference = useThemeStore.getState().themePreference;
    }
  }

  const activeTheme =
    themePreference === 'system'
      ? systemScheme === 'dark'
        ? 'dark'
        : 'light'
      : themePreference;

  return activeTheme === 'dark' ? Colors.dark : Colors.light;
}
