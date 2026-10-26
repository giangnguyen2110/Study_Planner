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
 * 4. `requestNotificationPermissions`: Yêu cầu cấp quyền thông báo từ người dùng.
 * 
 * 🎓 CÂU HỎI VẤN ĐÁP (VIVA) CỦA THẦY NGUYỄN XUÂN VINH:
 * - Câu hỏi: "Cơ chế Deep Linking từ Notification hoạt động như thế nào trong Expo Router?"
 * - Trả lời: "Dạ thưa Thầy, khi lên lịch thông báo qua hàm `scheduleAssignmentNotification`, nhóm đính kèm
 *   metadata `{ assignmentId }` vào trường `data` của notification content.
 *   Trong hook `useNotificationListener`, ta đăng ký listener `addNotificationResponseReceivedListener`.
 *   Khi người dùng chạm vào banner thông báo (kể cả khi app đang chạy ngầm hoặc đã tắt), listener này
 *   được hệ điều hành đánh thức và kích hoạt callback, lấy ra `assignmentId` từ payload và thực hiện lệnh
 *   `router.push('/assignments/' + assignmentId)` của Expo Router để mở thẳng màn hình chi tiết bài tập đó."
 * ============================================================================
 */

// ============================================================================
// BƯỚC 1: IMPORT CÁC THƯ VIỆN CẦN THIẾT
// ============================================================================
// `expo-notifications`: Thư viện xử lý thông báo cục bộ và push notification trong hệ sinh thái Expo
import * as Notifications from 'expo-notifications';
// `useRouter`: Hook điều hướng router của Expo Router (chuẩn File-based routing)
import { useRouter } from 'expo-router';
// React useEffect để quản lý vòng đời listener
import { useEffect } from 'react';
import { Platform } from 'react-native';

// ============================================================================
// BƯỚC 2: CẤU HÌNH NOTIFICATION HANDLER TOÀN CỤC (EXPO SDK 57 CHUẨN)
// ============================================================================
// Mặc định trên iOS/Android, khi ứng dụng đang mở (foreground), thông báo có thể bị ẩn.
// Cấu hình đầy đủ các trường của NotificationBehavior trong Expo SDK 57:
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,   // Hiển thị alert
    shouldPlaySound: true,   // Phát âm thanh chuông báo
    shouldSetBadge: false,   // Không cập nhật số đếm badge trên icon app
    shouldShowBanner: true,  // Hiển thị banner thả xuống trên đỉnh màn hình
    shouldShowList: true,    // Giữ thông báo trong Trung tâm thông báo (Notification Center)
  }),
});

// ============================================================================
// BƯỚC 3: HÀM YÊU CẦU CẤP QUYỀN THÔNG BÁO (NOTIFICATION PERMISSIONS)
// ============================================================================
/**
 * Yêu cầu người dùng cấp quyền hiển thị thông báo.
 * Đặc biệt bắt buộc đối với Android 13+ (POST_NOTIFICATIONS) và iOS.
 * @returns boolean true nếu người dùng đồng ý cấp quyền
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  // Bỏ qua nếu chạy trên nền tảng Web
  if (Platform.OS === 'web') return false;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Nếu chưa được cấp quyền thì hiển thị hộp thoại xin quyền
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

// ============================================================================
// BƯỚC 4: CUSTOM HOOK LẮNG NGHE SỰ KIỆN TAP NOTIFICATION & DEEP LINKING
// ============================================================================
/**
 * Hook `useNotificationListener`:
 * Đặt tại cấp layout gốc (Root Layout) hoặc màn hình chính để luôn sẵn sàng
 * bắt sự kiện bấm vào thông báo từ thanh Notification Drawer của điện thoại.
 */
export function useNotificationListener() {
  const router = useRouter();

  useEffect(() => {
    // Đăng ký listener lắng nghe khi người dùng bấm vào thông báo
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        // Trích xuất dữ liệu data được gửi kèm theo thông báo
        const data = response.notification.request.content.data;
        const assignmentId = data?.assignmentId;

        // Nếu có assignmentId, thực hiện Deep Link nhảy vào màn hình chi tiết
        if (assignmentId) {
          router.push(`/assignments/${assignmentId}`);
        }
      }
    );

    // Dọn dẹp listener khi component unmount để tránh rò rỉ bộ nhớ (Memory leak)
    return () => {
      subscription.remove();
    };
  }, [router]);
}

// ============================================================================
// BƯỚC 5: HÀM LẬP LỊCH THÔNG BÁO CHO BÀI TẬP (SCHEDULE NOTIFICATION)
// ============================================================================
/**
 * Hàm `scheduleAssignmentNotification`:
 * Đặt lịch thông báo nhắc nhở hạn chót bài tập.
 * @param assignmentId ID bài tập (dùng để Deep Link)
 * @param title Tiêu đề bài tập
 * @param triggerDate Thời điểm sẽ kích hoạt thông báo (Date)
 */
export async function scheduleAssignmentNotification(
  assignmentId: string,
  title: string,
  triggerDate: Date
) {
  // Kiểm tra thời gian kích hoạt phải lớn hơn hiện tại
  if (triggerDate.getTime() <= Date.now()) {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '⏰ Nhắc nhở hạn chót bài tập!',
      body: `Bài tập "${title}" sắp đến hạn nộp. Chạm vào đây để kiểm tra ngay!`,
      data: { assignmentId }, // Payload phục vụ Deep Linking
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    },
  });
}
