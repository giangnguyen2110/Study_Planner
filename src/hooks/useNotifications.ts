/**
 * ============================================================================
 * TÊN FILE: src/hooks/useNotifications.ts
 * VAI TRÒ: THÀNH VIÊN 1 (TV1 - Frontend UI/UX, Navigation & Notification)
 * ============================================================================
 * 
 * 📌 MỤC ĐÍCH FILE:
 * Quản lý toàn bộ hệ thống Thông Báo Cục Bộ (Local Notifications) và Điều Hướng Sâu (Deep Linking).
 * Đáp ứng 100% tiêu chí BẮT BUỘC A.4 trong đồ án của Giảng viên Nguyễn Xuân Vinh:
 * "4. Nhắc nhở Deadline & Deep Linking: Local Notifications nhắc nhở hạn chót;
 *     khi nhấn vào thông báo (tap notification) app mở thẳng vào màn hình chi tiết bài tập đó."
 * 
 * 🎯 CÁC TÍNH NĂNG CHÍNH:
 * 1. Cấu hình Handler hiển thị thông báo ngay cả khi người dùng đang mở app (Foreground notification).
 * 2. `useNotificationListener`: Hook lắng nghe sự kiện người dùng bấm vào thông báo (tap notification),
 *    bóc tách trường `assignmentId` từ object `data`, và dùng Expo Router (`router.push`) để nhảy
 *    thẳng vào màn hình chi tiết bài tập `/assignments/[id]` (Deep Linking).
 * 3. `scheduleAssignmentNotification`: Lập lịch hẹn giờ thông báo trước hạn nộp bài tập.
 * 4. `triggerImmediateDemoNotification`: Kích hoạt thông báo sau 2 giây phục vụ buổi DEMO VIVA trước Thầy!
 * 5. `requestNotificationPermissions`: Yêu cầu cấp quyền thông báo từ người dùng.
 * ============================================================================
 */

import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

// Cấu hình Notification Behavior toàn cục trong Expo SDK 57
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,   // Hiển thị alert
    shouldPlaySound: true,   // Phát âm thanh chuông báo
    shouldSetBadge: false,   // Không cập nhật badge icon
    shouldShowBanner: true,  // Hiển thị banner thả xuống trên đỉnh màn hình
    shouldShowList: true,    // Giữ thông báo trong Trung tâm thông báo (Notification Center)
  }),
});

/**
 * Yêu cầu người dùng cấp quyền hiển thị thông báo.
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

/**
 * Custom Hook `useNotificationListener`:
 * Đặt tại cấp Root Layout để luôn sẵn sàng bắt sự kiện bấm vào thông báo
 * từ thanh trạng thái điện thoại và thực hiện DEEP LINKING!
 */
export function useNotificationListener() {
  const router = useRouter();

  useEffect(() => {
    // Đăng ký listener lắng nghe khi người dùng bấm vào thông báo
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        const assignmentId = data?.assignmentId;

        // Nếu có assignmentId, thực hiện Deep Link nhảy vào màn hình chi tiết kèm flag fromNotification
        if (assignmentId) {
          router.push(`/assignments/${assignmentId}?fromNotification=true`);
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [router]);
}

/**
 * Hàm kích hoạt thông báo DEMO VIVA (sau 2 giây):
 * Dùng để demo trực tiếp trước Thầy Vinh hoặc quay video demo 3-5 phút nộp Canvas!
 */
export async function triggerImmediateDemoNotification(
  assignmentId: string,
  title: string
) {
  // 1. Nếu chạy trên Trình duyệt Web
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('⏰ Nhắc nhở hạn chót bài tập!', {
          body: `Bài tập "${title}" sắp đến hạn nộp. Bấm vào để xem chi tiết!`,
        });
      } else {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          new Notification('⏰ Nhắc nhở hạn chót bài tập!', {
            body: `Bài tập "${title}" sắp đến hạn nộp. Bấm vào để xem chi tiết!`,
          });
        }
      }
    }
    return;
  }

  // 2. Nếu chạy trên Điện thoại Native (iOS / Android)
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '⏰ Hạn chót bài tập! (Study Planner)',
      body: `Bài tập "${title}" sắp đến hạn nộp. Chạm vào đây để kiểm tra ngay!`,
      data: { assignmentId }, // Payload phục vụ DEEP LINKING
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2, // Nổ banner thông báo sau đúng 2 giây
    },
  });
}

/**
 * Hàm lập lịch hẹn giờ thông báo theo ngày giờ thực tế
 */
export async function scheduleAssignmentNotification(
  assignmentId: string,
  title: string,
  triggerDate: Date
) {
  if (triggerDate.getTime() <= Date.now()) {
    return;
  }

  if (Platform.OS === 'web') return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '⏰ Nhắc nhở hạn chót bài tập!',
      body: `Bài tập "${title}" sắp đến hạn nộp. Chạm vào đây để kiểm tra ngay!`,
      data: { assignmentId },
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    },
  });
}
