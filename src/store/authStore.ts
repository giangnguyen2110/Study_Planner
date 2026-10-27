/**
 * ============================================================================
 * TÊN FILE: src/store/authStore.ts
 * VAI TRÒ: THÀNH VIÊN 2 (TV2 - Data Architecture, State, Auth & Logic)
 * ============================================================================
 * 
 * 📌 MỤC ĐÍCH FILE:
 * Quản lý phiên xác thực người dùng (Auth Session) bằng Zustand v5:
 * 1. Lưu trữ trạng thái đăng nhập: token, thông tin sinh viên (UserProfile).
 * 2. Bảo mật di động: Token và thông tin nhạy cảm BẮT BUỘC lưu trong `SecureStore` (mã hóa phần cứng),
 *    tuyệt đối không lưu vào `AsyncStorage` (vi phạm luật môn học).
 * 3. Hỗ trợ đa nền tảng (Cross-platform Web & Mobile):
 *    - Trên Điện thoại thật (iOS/Android): Dùng 100% `SecureStore` (Keychain / Keystore).
 *    - Trên Trình duyệt Web (Chrome/Edge): Tự động fallback sang `localStorage` để tránh lỗi
 *      `ExpoSecureStore.setValueWithKeyAsync is not a function` khi chạy trên web!
 * 4. Phiên đăng nhập sống sót qua các lần tắt/mở lại app (Survive App Restart) nhờ `restoreSession()`.
 * 5. Đăng xuất triệt để: Xóa sạch token trong SecureStore và reset Zustand state về null.
 * 6. Cung cấp các Selectors độc lập để chống re-render thừa (tiêu chí chấm điểm của Thầy Vinh).
 * ============================================================================
 */

import { create } from 'zustand';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// Key định danh lưu trữ bảo mật trong SecureStore
const TOKEN_KEY = 'study_planner_auth_token';
const USER_KEY = 'study_planner_user_info';

// Định nghĩa cấu trúc thông tin sinh viên
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  studentId?: string;
  avatarUrl?: string;
}

// Định nghĩa giao diện Auth State và các hàm thao tác (Actions)
export interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isLoading: boolean; // Trạng thái đang kiểm tra token lúc vừa mở app
  signIn: (token: string, user: UserProfile) => Promise<void>;
  signOut: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

/**
 * BỘ LƯU TRỮ BẢO MẬT ĐA NỀN TẢNG (Cross-platform Safe Storage)
 * - Mobile: Dùng Expo SecureStore (Mã hóa phần cứng Keychain / Keystore).
 * - Web: Dùng localStorage dự phòng (tránh crash lỗi trên trình duyệt).
 */
const safeStorage = {
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, value);
        }
      } catch {
        // Fallback im lặng nếu trình duyệt chặn storage
      }
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },

  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem(key);
        }
        return null;
      } catch {
        return null;
      }
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },

  deleteItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(key);
        }
      } catch {
        // Fallback im lặng
      }
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

/**
 * KHỞI TẠO ZUSTAND AUTH STORE
 */
export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoading: true, // Mặc định mở app lên là đang kiểm tra session

  /**
   * HÀM ĐĂNG NHẬP (Sign In)
   * Lưu token và user vào SecureStore (hoặc web storage), đồng thời cập nhật state
   */
  signIn: async (token: string, user: UserProfile) => {
    try {
      await safeStorage.setItem(TOKEN_KEY, token);
      await safeStorage.setItem(USER_KEY, JSON.stringify(user));
      set({ token, user, isLoading: false });
    } catch (error) {
      console.error('[AuthStore] Lỗi khi lưu phiên vào SecureStore:', error);
      // Vẫn cập nhật memory state để người dùng không bị kẹt ở màn hình đăng nhập
      set({ token, user, isLoading: false });
    }
  },

  /**
   * HÀM ĐĂNG XUẤT (Sign Out)
   * Xóa sạch token và user trong SecureStore, reset state về null
   */
  signOut: async () => {
    try {
      await safeStorage.deleteItem(TOKEN_KEY);
      await safeStorage.deleteItem(USER_KEY);
      set({ token: null, user: null, isLoading: false });
    } catch (error) {
      console.error('[AuthStore] Lỗi khi xóa phiên khỏi SecureStore:', error);
      set({ token: null, user: null, isLoading: false });
    }
  },

  /**
   * HÀM KHÔI PHỤC PHIÊN ĐĂNG NHẬP (Survive App Restart)
   * Được gọi ở Root Layout ngay khi app khởi động để kiểm tra phiên cũ
   */
  restoreSession: async () => {
    try {
      const savedToken = await safeStorage.getItem(TOKEN_KEY);
      const savedUserStr = await safeStorage.getItem(USER_KEY);

      if (savedToken && savedUserStr) {
        const parsedUser: UserProfile = JSON.parse(savedUserStr);
        set({
          token: savedToken,
          user: parsedUser,
          isLoading: false,
        });
      } else {
        set({ token: null, user: null, isLoading: false });
      }
    } catch (error) {
      console.warn('[AuthStore] Không thể khôi phục phiên:', error);
      set({ token: null, user: null, isLoading: false });
    }
  },
}));

// ============================================================================
// CÁC SELECTORS CHUẨN MỰC (TIÊU CHÍ CHẤM ĐIỂM BẮT BUỘC CỦA THẦY NGUYỄN XUÂN VINH)
// ============================================================================

/**
 * Selector kiểm tra trạng thái đã xác thực hay chưa (boolean)
 */
export const selectIsAuthenticated = (state: AuthState): boolean => !!state.token;

/**
 * Selector lấy thông tin chi tiết của sinh viên
 */
export const selectCurrentUser = (state: AuthState): UserProfile | null => state.user;

/**
 * Selector lấy trạng thái kiểm tra session ban đầu (Splash/Loading state)
 */
export const selectAuthLoading = (state: AuthState): boolean => state.isLoading;
