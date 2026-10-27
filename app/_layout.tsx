/**
 * ============================================================================
 * TÊN FILE: app/_layout.tsx
 * VAI TRÒ: ROOT LAYOUT (CẤU HÌNH GỐC CỦA TOÀN BỘ ỨNG DỤNG EXPO ROUTER)
 * ============================================================================
 * 
 * 📌 MỤC ĐÍCH FILE:
 * Cấu hình Layout gốc cho toàn bộ ứng dụng:
 * 1. Khởi tạo `QueryClient` và bọc toàn bộ ứng dụng bằng `QueryClientProvider` của TanStack Query v5.
 * 2. Kích hoạt hook `useNotificationListener()` của TV1 để sẵn sàng xử lý Deep Linking
 *    khi người dùng bấm vào thông báo deadline từ thanh Notification điện thoại.
 * 3. Tự động đồng bộ theme cho thanh Header và Status Bar theo hệ thống (Light/Dark).
 * 4. Khôi phục phiên đăng nhập từ SecureStore (Survive App Restart) qua `useAuthStore().restoreSession()`.
 * 
 * 🎓 CÂU HỎI VẤN ĐÁP (VIVA) CỦA THẦY NGUYỄN XUÂN VINH:
 * - Câu hỏi: "Tại sao `QueryClientProvider` và `useNotificationListener` lại được đặt trong Root Layout?"
 * - Trả lời: "Dạ thưa Thầy, Root Layout (`app/_layout.tsx`) là thành phần tồn tại xuyên suốt vòng đời của app
 *   và không bị unmount khi người dùng chuyển trang. Đặt `QueryClientProvider` ở đây giúp toàn bộ cây component
 *   ở mọi màn hình đều có thể truy cập bộ nhớ đệm cache của TanStack Query. Đồng thời, `useNotificationListener`
 *   được kích hoạt ở tầng cao nhất giúp app bắt được sự kiện tap thông báo và điều hướng Deep Link chuẩn xác
 *   từ bất kỳ màn hình nào."
 * ============================================================================
 */

import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useNotificationListener, requestNotificationPermissions } from '../src/hooks/useNotifications';
import { useThemeColor } from '../src/hooks/useThemeColor';
import { useAuthStore } from '../src/store/authStore';

// Khởi tạo một đối tượng QueryClient duy nhất cho toàn bộ app
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // Tự động thử lại 2 lần nếu mất kết nối mạng
      staleTime: 1000 * 60, // Cache dữ liệu trong 1 phút
    },
  },
});

export default function RootLayout() {
  const scheme = useColorScheme();
  const colors = useThemeColor();
  const restoreSession = useAuthStore((state) => state.restoreSession);

  // BƯỚC 1: Kích hoạt listener lắng nghe sự kiện bấm vào thông báo (Deep Linking)
  useNotificationListener();

  // BƯỚC 2: Yêu cầu cấp quyền thông báo và khôi phục phiên đăng nhập từ SecureStore (Survive App Restart)
  useEffect(() => {
    requestNotificationPermissions();
    restoreSession();
  }, [restoreSession]);

  /**
   * BƯỚC 3: RENDER TOÀN BỘ CÂY ĐIỀU HƯỚNG CỦA ỨNG DỤNG
   */
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
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
        {/* Nhóm màn hình xác thực (Sign In) */}
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        {/* Nhóm màn hình chính có Bottom Tabs (Protected Routes) */}
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        {/* Màn hình lỗi 404 khi không tìm thấy trang */}
        <Stack.Screen name="+not-found" options={{ title: 'Lỗi 404' }} />
      </Stack>
    </QueryClientProvider>
  );
}
