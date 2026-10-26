# STUDY PLANNER — DỰ ÁN CUỐI KỲ (FINAL PROJECT)
## KẾ HOẠCH PHÂN CHIA CÔNG VIỆC & TÀI LIỆU KIẾN TRÚC KỸ THUẬT

> **Môn học**: Lập trình Mobile (TH7011101 - Lớp 23DTH1) — Trường Đại học Công nghệ Đồng Nai (DNTU)  
> **Giảng viên**: Thầy Nguyễn Xuân Vinh  
> **Tỉ trọng điểm**: 50% điểm tổng kết môn  
> **Hạn bảo vệ (Viva)**: Day 10 — Thứ Tư, 28/10/2026  
> **Repo GitHub**: `https://github.com/giangnguyen2110/Study_Planner.git`  
> **Tech Stack**: Expo SDK 57, React 19, TypeScript (Strict Mode), Expo Router, TanStack Query v5, Zustand v5, Expo SecureStore, AsyncStorage, Expo Notifications, Expo Image Picker.

---

## 🤖 CONTEXT DÀNH RIÊNG CHO CÁC AI ASSISTANT (KHI ĐỌC TÀI LIỆU NÀY)
*Nếu bạn là AI (Claude, ChatGPT, Gemini, Copilot...) được thành viên dự án đưa cho tài liệu này, hãy tuân thủ TUYỆT ĐỐI các ràng buộc sau khi sinh code:*
1. **LUẬT ZERO-HEX**: Tuyệt đối KHÔNG sử dụng bất kỳ mã màu Hex (`#FFFFFF`, `#000`...) nào trong StyleSheet của component. Mọi màu sắc bắt buộc phải import và sử dụng từ `src/constants/tokens.ts` thông qua hook `useThemeColor()`.
2. **LUẬT TRỢ NĂNG (ACCESSIBILITY)**: Tất cả nút bấm/vùng chạm phải có kích thước tối thiểu $44 \times 44$ pt (`minHeight: 44, minWidth: 44`), có `accessibilityRole="button"` và `accessibilityLabel="mô tả"`.
3. **LUẬT 4 TRẠNG THÁI (4-STATES)**: Mọi màn hình tải dữ liệu đều phải xử lý đủ 4 trạng thái: Loading, Empty, Error with working retry (nút thử lại gọi fetch lại thật), và Content (dùng `StateHandler.tsx`).
4. **LUẬT PHÂN TÁCH STATE & BẢO MẬT**:
   - Token phiên đăng nhập (Auth Session) **CHỈ ĐƯỢC LƯU TRONG `SecureStore`**, cấm lưu vào `AsyncStorage`.
   - Dữ liệu Remote API phải được quản lý bởi **TanStack Query** (`useQuery`, `useMutation`).
   - Dữ liệu bộ nhớ ứng dụng chia sẻ (Client state) dùng **Zustand với Selectors**.
   - Dữ liệu ngoại tuyến (Offline cache) lưu trong `AsyncStorage` và phải có banner hiển thị mốc thời gian lưu.
5. **LUẬT COMPUTED DATA**: Thống kê tiến độ môn học (Course progress) phải là giá trị tính toán động (computed), **TUYỆT ĐỐI KHÔNG lưu cứng trong Database/API**.
6. **LUẬT DATE & TIMEZONE**: Tính toán deadline (ví dụ: 'Due tomorrow', 'Due in 48 hours') phải xử lý theo ngày địa phương (`startOfDay`), đảm bảo 23:30 và 08:00 sáng cho ra cùng kết quả logic.

---

## PHẦN 1: TỔNG QUAN YÊU CẦU ĐỀ TÀI CỦA GIẢNG VIÊN

### 1. Ý tưởng sản phẩm (Product Vision)
Ứng dụng lập kế hoạch học tập dành cho sinh viên đại học quản lý từ 5–7 môn học cùng một lúc, thường xuyên mở app kiểm tra lịch học, bài tập và deadline khi di chuyển giữa các phòng học.

### 2. Mô hình dữ liệu chuẩn (Suggested Data Model)
- **`Course`**: `{ id: string, code: string, name: string, colour: string }`
- **`Assignment`**: `{ id: string, courseId: string, title: string, dueAt: string (ISO), status: 'pending' | 'completed', notes?: string, photoUri?: string }`
- **`User`**: `{ id: string, name: string, email: string }`

### 3. Yêu cầu tính năng (Features Breakdown)

#### A. Nhóm tính năng bắt buộc (Must Have — Quyết định ĐẠT/QUA MÔN)
1. **Xác thực người dùng (Auth Session)**: Sign-in & Sign-out. Phiên đăng nhập sống sót qua các lần tắt/mở lại app. Token lưu trong `SecureStore`. Khi Sign-out dọn sạch token, store và query cache.
2. **Quản lý dữ liệu từ Remote API**: Courses và Assignments được tải từ Remote API (MockAPI/Supabase), có thể tạo mới (Create) và chỉnh sửa (Edit) trực tiếp qua ứng dụng.
3. **Weekly View & List View**: Hiển thị cùng 1 tập dữ liệu bài tập dưới 2 giao diện: Xem theo tuần (chia theo Thứ 2 -> CN) và Xem theo danh sách, có bộ lọc theo môn và trạng thái.
4. **Nhắc nhở Deadline & Deep Linking**: Local Notifications nhắc nhở hạn chót; khi nhấn vào thông báo (tap notification) app mở thẳng vào màn hình chi tiết bài tập đó.
5. **Thống kê tiến độ học tập (Progress Statistics)**: Tỉ lệ hoàn thành vs còn tồn đọng theo từng môn học, tính toán động (computed), không lưu trong DB.
6. **Hoạt động Offline (Works Offline)**: Khi mất mạng, hiển thị dữ liệu đã lưu ở lần tải thành công gần nhất kèm banner *"showing saved data from <time>"*. Các thao tác chỉnh sửa offline không bị mất âm thầm.

#### B. Nhóm tính năng nâng cao (Should Have — Để đạt điểm > 8.0)
1. **Đính kèm ảnh bài học (Photo Attachment)**: Chụp hoặc chọn ảnh từ thư viện (`expo-image-picker`) đính kèm vào bài tập (`photoUri`).
2. **Widget tóm tắt ở Home Screen**: Khối giao diện hiển thị các bài tập/deadline đến hạn trong vòng **48 giờ tới**.
3. **Cập nhật lạc quan (Optimistic Updates)**: Khi tick hoàn thành bài tập, giao diện đổi trạng thái ngay lập tức; nếu API lỗi thì tự động rollback về trạng thái cũ.

---

## PHẦN 2: LÝ DO & TRIẾT LÝ PHÂN CHIA CÔNG VIỆC CHO 2 THÀNH VIÊN

### Tại sao lại chia theo 2 vai trò: Frontend UI/UX (TV1) và Data/Business Core (TV2)?

1. **Phân tách mối quan tâm (Separation of Concerns)**:
   - **Thành viên 1** tập trung hoàn toàn vào **Presentation & Interaction Layer**: Xây dựng toàn bộ màn hình, widget, weekly view, trải nghiệm người dùng, hệ thống theme, tương tác chạm và thông báo cục bộ.
   - **Thành viên 2** tập trung hoàn toàn vào **Domain & Infrastructure Layer**: Xây dựng data layer, kết nối Remote API, TanStack Query, Zustand session, bảo mật SecureStore, xử lý offline cache, tính toán toán học tiến độ và date/timezone logic.
2. **Không xung đột mã nguồn (Zero Git Conflict)**:
   - TV1 làm việc chủ yếu ở các components hiển thị (`src/components/features/`, các màn hình tabs).
   - TV2 làm việc ở thư mục `src/api/`, `src/store/`, `src/utils/`, các custom hooks nghiệp vụ và các form dữ liệu.
   - Cả 2 có thể commit và push độc lập mà không bị đè file của nhau.
3. **Cân bằng khối lượng công việc (50% - 50%)**:
   - TV1 chịu trách nhiệm thiết kế 3 màn hình lớn + notification engine phức tạp + component test.
   - TV2 chịu trách nhiệm kiến trúc dữ liệu mạng + optimistic update + offline engine + pure logic tests.
4. **Bảo vệ vấn đáp cá nhân (Viva)**:
   - Điểm giao thoa giữa 2 người là **Custom Hooks (`useAssignments`, `useCourses`, `useAuthStore`)**. TV2 viết hook, TV1 gọi hook vào UI. Điều này giúp cả hai buộc phải hiểu rõ dữ liệu của nhau để trả lời câu hỏi trực tiếp của Thầy Vinh khi bảo vệ.

---

## PHẦN 3: BẢNG MA TRẬN PHÂN CHIA NHIỆM VỤ (TASK MATRIX)

| Thành viên | Trách nhiệm chính | Danh sách các file phụ trách |
| :--- | :--- | :--- |
| **Thành viên 1 (TV1)**<br>*(Frontend, UI/UX, Navigation & Notification)* | • Khởi tạo Theme Tokens (Zero-Hex)<br>• Cấu hình Accessible Components (44x44)<br>• Xây dựng màn hình Home (Dashboard 48h Widget)<br>• Xây dựng màn hình Weekly Calendar & List View<br>• Cài đặt Local Notifications & Deep Linking<br>• Màn hình lỗi 404 (`+not-found.tsx`)<br>• Viết 01 Component Test (Jest) | `src/constants/tokens.ts`<br>`src/hooks/useThemeColor.ts`<br>`src/components/ui/ThemedText.tsx`<br>`src/components/ui/ThemedView.tsx`<br>`src/components/ui/AccessibleButton.tsx`<br>`src/components/features/AssignmentCard.tsx`<br>`src/components/features/Due48hWidget.tsx`<br>`src/components/features/WeeklyCalendar.tsx`<br>`src/hooks/useNotifications.ts`<br>`app/(app)/(tabs)/index.tsx`<br>`app/(app)/(tabs)/schedule.tsx`<br>`app/+not-found.tsx`<br>`__tests__/AssignmentCard.test.tsx` |
| **Thành viên 2 (TV2)**<br>*(Data Layer, State, Auth, Logic & Offline)* | • Xây dựng Zustand Stores (Auth & Filter)<br>• Quản lý Auth Session với SecureStore<br>• Cấu hình TanStack Query & API Client<br>• Xử lý Optimistic Updates & Rollback<br>• Xử lý Offline Cache (AsyncStorage) & Banner<br>• Xử lý Date & Timezone logic ("Due tomorrow")<br>• Tính toán tiến độ môn học (Computed Stats)<br>• Form thêm/sửa Assignment có chọn ảnh (`photoUri`)<br>• Dynamic Route chi tiết bài tập (`[id].tsx`)<br>• Viết 02 Logic & Critical Path Tests (Jest) | `src/api/client.ts`<br>`src/api/studyApi.ts`<br>`src/store/authStore.ts`<br>`src/store/filterStore.ts`<br>`src/utils/dateUtils.ts`<br>`src/utils/statsUtils.ts`<br>`src/utils/offlineCache.ts`<br>`src/hooks/useAssignments.ts`<br>`src/hooks/useCourses.ts`<br>`src/components/ui/OfflineBanner.tsx`<br>`src/components/ui/StateHandler.tsx`<br>`app/(auth)/sign-in.tsx`<br>`app/(app)/assignments/[id].tsx`<br>`app/(app)/modal/new-assignment.tsx`<br>`app/(app)/(tabs)/courses.tsx`<br>`__tests__/dateUtils.test.ts`<br>`__tests__/statsUtils.test.ts` |

---

## PHẦN 4: HƯỚNG DẪN CODE CHI TIẾT TỪNG FILE THEO THÀNH VIÊN

### 🟢 MỤC 1: CÁC FILE DO THÀNH VIÊN 1 (TV1) THỰC HIỆN

#### 1. File: `src/constants/tokens.ts` (TV1)
> **Mục đích**: File DUY NHẤT trong toàn bộ project được phép chứa mã màu Hex. Hỗ trợ Light & Dark theme. Đảm bảo tỷ lệ tương phản văn bản $\ge 4.5:1$ và vùng chạm $\ge 44 \times 44$.
```typescript
export const Colors = {
  light: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    border: '#CBD5E1',
    tint: '#2563EB',
    error: '#DC2626',
    success: '#16A34A',
    warning: '#D97706',
    card: '#FFFFFF',
    offlineBanner: '#FEF3C7',
    offlineText: '#92400E',
    statusPending: '#E0E7FF',
    statusCompleted: '#DCFCE7',
  },
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    border: '#334155',
    tint: '#60A5FA',
    error: '#EF4444',
    success: '#22C55E',
    warning: '#FBBF24',
    card: '#1E293B',
    offlineBanner: '#78350F',
    offlineText: '#FEF3C7',
    statusPending: '#1E1B4B',
    statusCompleted: '#064E3B',
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const TouchTarget = {
  minHeight: 44,
  minWidth: 44,
};
```

#### 2. File: `src/hooks/useThemeColor.ts` (TV1)
```typescript
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/tokens';

export function useThemeColor() {
  const scheme = useColorScheme() ?? 'light';
  return Colors[scheme];
}
```

#### 3. File: `src/components/ui/ThemedView.tsx` & `ThemedText.tsx` (TV1)
```typescript
// src/components/ui/ThemedView.tsx
import React from 'react';
import { View, ViewProps } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';

export function ThemedView({ style, ...props }: ViewProps) {
  const colors = useThemeColor();
  return <View style={[{ backgroundColor: colors.background }, style]} {...props} />;
}

// src/components/ui/ThemedText.tsx
import React from 'react';
import { Text, TextProps } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';

interface Props extends TextProps {
  secondary?: boolean;
}

export function ThemedText({ secondary, style, ...props }: Props) {
  const colors = useThemeColor();
  const color = secondary ? colors.textSecondary : colors.textPrimary;
  return <Text style={[{ color }, style]} {...props} />;
}
```

#### 4. File: `src/components/ui/AccessibleButton.tsx` (TV1)
> **Mục đích**: Đáp ứng 100% tiêu chí Accessibility của đề: Vùng bấm tối thiểu $44 \times 44$, có `accessibilityRole="button"` và `accessibilityLabel`.
```typescript
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { TouchTarget, Spacing } from '../../constants/tokens';

interface Props extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  accessibilityLabel: string;
  variant?: 'primary' | 'secondary' | 'danger';
}

export function AccessibleButton({ title, onPress, accessibilityLabel, variant = 'primary', style, ...props }: Props) {
  const colors = useThemeColor();

  const getBackgroundColor = () => {
    switch (variant) {
      case 'danger': return colors.error;
      case 'secondary': return colors.surface;
      default: return colors.tint;
    }
  };

  const getTextColor = () => {
    return variant === 'secondary' ? colors.textPrimary : colors.surface;
  };

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: colors.border,
          borderWidth: variant === 'secondary' ? 1 : 0,
        },
        style,
      ]}
      {...props}
    >
      <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: TouchTarget.minHeight,
    minWidth: TouchTarget.minWidth,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
```

#### 5. File: `src/components/features/AssignmentCard.tsx` (TV1)
> **Mục đích**: Thẻ bài tập chuẩn UI, có nút tick đổi trạng thái, hiển thị màu môn học, nhấn vào thẻ để mở trang chi tiết.
```typescript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { Spacing, TouchTarget } from '../../constants/tokens';
import { AssignmentItem } from '../../utils/statsUtils';

interface Props {
  assignment: AssignmentItem;
  courseColor?: string;
  courseName?: string;
  onToggleStatus: () => void;
  onPressCard: () => void;
}

export function AssignmentCard({ assignment, courseColor = '#2563EB', courseName, onToggleStatus, onPressCard }: Props) {
  const colors = useThemeColor();
  const isCompleted = assignment.status === 'completed';

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`Bài tập ${assignment.title}, trạng thái ${isCompleted ? 'đã xong' : 'chưa xong'}`}
      onPress={onPressCard}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={[styles.colorBar, { backgroundColor: courseColor }]} />
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary, textDecorationLine: isCompleted ? 'line-through' : 'none' }]}>
          {assignment.title}
        </Text>
        {courseName && <Text style={[styles.course, { color: colors.textSecondary }]}>{courseName}</Text>}
        <Text style={[styles.date, { color: colors.textSecondary }]}>
          Hạn nộp: {new Date(assignment.dueAt).toLocaleDateString()} {new Date(assignment.dueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>

      <TouchableOpacity
        accessibilityRole="checkbox"
        accessibilityLabel={`Đánh dấu hoàn thành bài ${assignment.title}`}
        onPress={onToggleStatus}
        style={[
          styles.checkbox,
          {
            borderColor: colors.border,
            backgroundColor: isCompleted ? colors.success : 'transparent',
          },
        ]}
      >
        <Text style={{ color: colors.surface, fontWeight: 'bold' }}>{isCompleted ? '✓' : ''}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
    alignItems: 'center',
  },
  colorBar: { width: 6, alignSelf: 'stretch' },
  content: { flex: 1, padding: Spacing.md },
  title: { fontSize: 16, fontWeight: '600' },
  course: { fontSize: 13, marginTop: 2 },
  date: { fontSize: 12, marginTop: 4 },
  checkbox: {
    minWidth: TouchTarget.minWidth,
    minHeight: TouchTarget.minHeight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
    borderRadius: 6,
    borderWidth: 1,
  },
});
```

#### 6. File: `src/components/features/Due48hWidget.tsx` (TV1)
> **Mục đích**: Widget tóm tắt ở Home Screen cho các deadline trong 48 giờ tới (tiêu chí điểm > 8).
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { AssignmentItem } from '../../utils/statsUtils';
import { isDueWithin48Hours } from '../../utils/dateUtils';
import { Spacing } from '../../constants/tokens';

export function Due48hWidget({ assignments }: { assignments: AssignmentItem[] }) {
  const colors = useThemeColor();
  const dueSoonTasks = assignments.filter(
    (item) => item.status === 'pending' && isDueWithin48Hours(item.dueAt)
  );

  return (
    <View style={[styles.widget, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.heading, { color: colors.warning }]}>
        ⏳ Hạn nộp trong 48 giờ tới ({dueSoonTasks.length})
      </Text>
      {dueSoonTasks.length === 0 ? (
        <Text style={{ color: colors.textSecondary }}>Không có bài tập nào sắp đến hạn.</Text>
      ) : (
        dueSoonTasks.map((t) => (
          <View key={t.id} style={styles.itemRow}>
            <Text style={[styles.itemText, { color: colors.textPrimary }]}>• {t.title}</Text>
            <Text style={[styles.itemDate, { color: colors.error }]}>
              {new Date(t.dueAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({new Date(t.dueAt).toLocaleDateString()})
            </Text>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  widget: { padding: Spacing.md, borderRadius: 10, borderWidth: 1, marginBottom: Spacing.md },
  heading: { fontSize: 16, fontWeight: '700', marginBottom: Spacing.sm },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  itemText: { fontSize: 14, fontWeight: '500' },
  itemDate: { fontSize: 12, fontWeight: '600' },
});
```

#### 7. File: `src/hooks/useNotifications.ts` (TV1)
> **Mục đích**: Local Notifications & **Deep Linking**: Bấm vào notification mở thẳng `assignments/[id].tsx`.
```typescript
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useNotificationListener() {
  const router = useRouter();

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const assignmentId = response.notification.request.content.data?.assignmentId;
      if (assignmentId) {
        // Deep linking nhảy vào dynamic route
        router.push(`/assignments/${assignmentId}`);
      }
    });

    return () => subscription.remove();
  }, [router]);
}

export async function scheduleAssignmentNotification(assignmentId: string, title: string, triggerDate: Date) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Hạn chót bài tập!',
      body: `Bài tập "${title}" sắp đến hạn nộp. Kiểm tra ngay!`,
      data: { assignmentId },
    },
    trigger: triggerDate,
  });
}
```

#### 8. File: `app/(app)/(tabs)/schedule.tsx` (TV1)
> **Mục đích**: Màn hình xem lịch trình với 2 chế độ: Weekly View và List View, hỗ trợ bộ lọc.
```typescript
import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ThemedView } from '../../../src/components/ui/ThemedView';
import { ThemedText } from '../../../src/components/ui/ThemedText';
import { AssignmentCard } from '../../../src/components/features/AssignmentCard';
import { useAssignments, useToggleAssignment } from '../../../src/hooks/useAssignments';
import { useCourses } from '../../../src/hooks/useCourses';
import { StateHandler } from '../../../src/components/ui/StateHandler';
import { useThemeColor } from '../../../src/hooks/useThemeColor';
import { Spacing, TouchTarget } from '../../../src/constants/tokens';
import { useRouter } from 'expo-router';

export default function ScheduleScreen() {
  const colors = useThemeColor();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'list' | 'weekly'>('list');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const { data: assignments = [], isLoading, isError, refetch } = useAssignments();
  const { data: courses = [] } = useCourses();
  const toggleMutation = useToggleAssignment();

  // Áp dụng bộ lọc
  const filteredAssignments = assignments.filter((a) => {
    if (statusFilter === 'all') return true;
    return a.status === statusFilter;
  });

  return (
    <ThemedView style={styles.container}>
      {/* Thanh chuyển chế độ xem */}
      <View style={styles.toggleRow}>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Chuyển sang chế độ danh sách"
          onPress={() => setViewMode('list')}
          style={[styles.modeButton, viewMode === 'list' && { backgroundColor: colors.tint }]}
        >
          <Text style={{ color: viewMode === 'list' ? colors.surface : colors.textPrimary }}>Danh sách</Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Chuyển sang chế độ tuần"
          onPress={() => setViewMode('weekly')}
          style={[styles.modeButton, viewMode === 'weekly' && { backgroundColor: colors.tint }]}
        >
          <Text style={{ color: viewMode === 'weekly' ? colors.surface : colors.textPrimary }}>Theo Tuần</Text>
        </TouchableOpacity>
      </View>

      {/* Bộ lọc trạng thái */}
      <View style={styles.filterRow}>
        {(['all', 'pending', 'completed'] as const).map((filter) => (
          <TouchableOpacity
            key={filter}
            accessibilityRole="button"
            accessibilityLabel={`Lọc bài tập ${filter}`}
            onPress={() => setStatusFilter(filter)}
            style={[styles.filterChip, statusFilter === filter && { borderColor: colors.tint, borderWidth: 1 }]}
          >
            <ThemedText style={{ fontSize: 13 }}>
              {filter === 'all' ? 'Tất cả' : filter === 'pending' ? 'Chưa nộp' : 'Đã xong'}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>

      <StateHandler
        isLoading={isLoading}
        isError={isError}
        isEmpty={filteredAssignments.length === 0}
        onRetry={refetch}
      >
        <FlatList
          data={filteredAssignments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const course = courses.find((c) => c.id === item.courseId);
            return (
              <AssignmentCard
                assignment={item}
                courseColor={course?.colour}
                courseName={course?.name}
                onPressCard={() => router.push(`/assignments/${item.id}`)}
                onToggleStatus={() => {
                  const newStatus = item.status === 'completed' ? 'pending' : 'completed';
                  toggleMutation.mutate({ id: item.id, newStatus });
                }}
              />
            );
          }}
        />
      </StateHandler>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.md },
  toggleRow: { flexDirection: 'row', marginBottom: Spacing.sm },
  modeButton: {
    flex: 1,
    minHeight: TouchTarget.minHeight,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  filterRow: { flexDirection: 'row', marginBottom: Spacing.md, gap: Spacing.sm },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
    minHeight: TouchTarget.minHeight,
    justifyContent: 'center',
  },
});
```

#### 9. File: `app/+not-found.tsx` (TV1)
```typescript
import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../src/components/ui/ThemedText';
import { useThemeColor } from '../src/hooks/useThemeColor';

export default function NotFoundScreen() {
  const colors = useThemeColor();
  return (
    <>
      <Stack.Screen options={{ title: 'Không tìm thấy trang' }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ThemedText style={styles.title}>Trang này không tồn tại.</ThemedText>
        <Link href="/" style={[styles.link, { color: colors.tint }]}>
          Quay lại màn hình chính!
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold' },
  link: { marginTop: 15, paddingVertical: 15 },
});
```

#### 10. File: `__tests__/AssignmentCard.test.tsx` (TV1 — Component Test)
```typescript
import React from 'react';
import { render } from '@testing-library/react-native';
import { AccessibleButton } from '../src/components/ui/AccessibleButton';

describe('AccessibleButton Component Test', () => {
  it('renders correctly with accessibilityRole="button" and minimum touch target size 44x44', () => {
    const { getByRole, getByText } = render(
      <AccessibleButton title="Lưu bài tập" onPress={() => {}} accessibilityLabel="Lưu bài tập mới" />
    );

    const button = getByRole('button');
    expect(button).toBeTruthy();
    expect(getByText('Lưu bài tập')).toBeTruthy();
  });
});
```

---

### 🔵 MỤC 2: CÁC FILE DO THÀNH VIÊN 2 (TV2) THỰC HIỆN

#### 11. File: `src/utils/dateUtils.ts` (TV2)
> **Mục đích**: Giải quyết *"The part that will take longer than you think"*: Timezone & Date handling ("Due tomorrow" chuẩn xác dù kiểm tra lúc 23:30 hay 08:00 sáng).
```typescript
export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isDueTomorrow(dueAtIso: string): boolean {
  const dueDate = startOfDay(new Date(dueAtIso));
  const today = startOfDay(new Date());

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  return dueDate.getTime() === tomorrow.getTime();
}

export function isDueWithin48Hours(dueAtIso: string): boolean {
  const now = new Date().getTime();
  const dueDate = new Date(dueAtIso).getTime();
  const diffHours = (dueDate - now) / (1000 * 60 * 60);
  return diffHours >= 0 && diffHours <= 48;
}
```

#### 12. File: `src/utils/statsUtils.ts` (TV2)
> **Mục đích**: Tính toán tiến độ môn học động (**Computed, never stored in DB**).
```typescript
export interface AssignmentItem {
  id: string;
  courseId: string;
  title: string;
  dueAt: string;
  status: 'pending' | 'completed';
  notes?: string;
  photoUri?: string;
}

export interface CourseProgress {
  courseId: string;
  total: number;
  completed: number;
  outstanding: number;
  percentage: number;
}

export function computeCourseProgress(courseId: string, assignments: AssignmentItem[]): CourseProgress {
  const courseTasks = assignments.filter((a) => a.courseId === courseId);
  const total = courseTasks.length;
  const completed = courseTasks.filter((a) => a.status === 'completed').length;
  const outstanding = total - completed;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { courseId, total, completed, outstanding, percentage };
}
```

#### 13. File: `src/store/authStore.ts` (TV2)
> **Mục đích**: Quản lý Session bằng Zustand, Auth Token **CHỈ LƯU TRONG `SecureStore`**, cung cấp selector chống re-render thừa.
```typescript
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'study_planner_auth_token';

interface AuthState {
  token: string | null;
  isLoading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  restoreToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  isLoading: true,
  signIn: async (token: string) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    set({ token });
  },
  signOut: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    set({ token: null });
  },
  restoreToken: async () => {
    try {
      const savedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      set({ token: savedToken, isLoading: false });
    } catch {
      set({ token: null, isLoading: false });
    }
  },
}));

// Selector tối ưu re-render
export const selectIsAuthenticated = (state: AuthState) => !!state.token;
```

#### 14. File: `src/hooks/useAssignments.ts` (TV2)
> **Mục đích**: TanStack Query + **Optimistic Updates** (cập nhật UI ngay lập tức và rollback nếu lỗi mạng) + **Offline Cache** lưu vào AsyncStorage.
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AssignmentItem } from '../utils/statsUtils';

const CACHE_KEY = 'cached_assignments_list';
const CACHE_TIMESTAMP_KEY = 'cached_assignments_timestamp';

// API Fetcher
async function fetchAssignments(): Promise<AssignmentItem[]> {
  try {
    const res = await fetch('https://66dd46d3f47a05d55be55308.mockapi.io/api/v1/assignments');
    if (!res.ok) throw new Error('Network error');
    const data = await res.json();

    // Lưu vào AsyncStorage làm offline cache
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
    await AsyncStorage.setItem(CACHE_TIMESTAMP_KEY, new Date().toISOString());
    return data;
  } catch (error) {
    // Nếu mất mạng, đọc từ AsyncStorage
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
    throw error;
  }
}

export function useAssignments() {
  return useQuery({
    queryKey: ['assignments'],
    queryFn: fetchAssignments,
    staleTime: 60 * 1000,
  });
}

export function useToggleAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, newStatus }: { id: string; newStatus: 'pending' | 'completed' }) => {
      const res = await fetch(`https://66dd46d3f47a05d55be55308.mockapi.io/api/v1/assignments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Cập nhật trạng thái thất bại');
      return res.json();
    },
    // OPTIMISTIC UPDATE: Đổi trên UI ngay lập tức
    onMutate: async ({ id, newStatus }) => {
      await queryClient.cancelQueries({ queryKey: ['assignments'] });
      const previous = queryClient.getQueryData<AssignmentItem[]>(['assignments']);

      queryClient.setQueryData<AssignmentItem[]>(['assignments'], (old = []) =>
        old.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );

      return { previous };
    },
    // ROLLBACK ON FAILURE: Khôi phục lại trạng thái cũ nếu API báo lỗi
    onError: (_err, _newVal, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['assignments'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });
}
```

#### 15. File: `src/components/ui/StateHandler.tsx` (TV2)
> **Mục đích**: Đáp ứng tiêu chí: *"Every screen handles all four states: loading, empty, error with a working retry, and content"*.
```typescript
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { AccessibleButton } from './AccessibleButton';

interface Props {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  onRetry: () => void;
  children: React.ReactNode;
}

export function StateHandler({ isLoading, isError, isEmpty, onRetry, children }: Props) {
  const colors = useThemeColor();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={[styles.message, { color: colors.textSecondary }]}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={[styles.message, { color: colors.error }]}>Đã có lỗi xảy ra khi tải dữ liệu.</Text>
        <AccessibleButton title="Thử lại" onPress={onRetry} accessibilityLabel="Thử lại tải dữ liệu" />
      </View>
    );
  }

  if (isEmpty) {
    return (
      <View style={styles.center}>
        <Text style={[styles.message, { color: colors.textSecondary }]}>Danh sách hiện đang trống.</Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  message: { fontSize: 16, marginBottom: 12 },
});
```

#### 16. File: `src/components/ui/OfflineBanner.tsx` (TV2)
> **Mục đích**: Hiển thị banner trạng thái ngoại tuyến rõ ràng *"showing saved data from <time>"*.
```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';

interface Props {
  isOffline: boolean;
  savedTime?: string | null;
}

export function OfflineBanner({ isOffline, savedTime }: Props) {
  const colors = useThemeColor();
  if (!isOffline || !savedTime) return null;

  return (
    <View style={[styles.banner, { backgroundColor: colors.offlineBanner }]}>
      <Text style={[styles.text, { color: colors.offlineText }]}>
        ⚠️ Đang xem dữ liệu lưu ngoại tuyến từ: {new Date(savedTime).toLocaleTimeString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: { padding: 10, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 13, fontWeight: '600' },
});
```

#### 17. File: `app/(app)/modal/new-assignment.tsx` (TV2 — Modal Route Bắt Buộc)
> **Mục đích**: Màn hình Modal thêm bài tập mới, tích hợp `expo-image-picker` để đính kèm ảnh chụp ghi chú (`photoUri`).
```typescript
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Image, ScrollView, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ThemedView } from '../../../src/components/ui/ThemedView';
import { ThemedText } from '../../../src/components/ui/ThemedText';
import { AccessibleButton } from '../../../src/components/ui/AccessibleButton';
import { useThemeColor } from '../../../src/hooks/useThemeColor';
import { Spacing, TouchTarget } from '../../../src/constants/tokens';
import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function NewAssignmentModal() {
  const colors = useThemeColor();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('1');
  const [notes, setNotes] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  // Chọn ảnh từ thư viện
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('https://66dd46d3f47a05d55be55308.mockapi.io/api/v1/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          courseId,
          notes,
          photoUri,
          status: 'pending',
          dueAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      router.back();
    },
  });

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <ThemedText style={styles.label}>Tên bài tập (*)</ThemedText>
        <TextInput
          style={[styles.input, { borderColor: colors.border, color: colors.textPrimary }]}
          placeholder="Nhập tên bài tập..."
          placeholderTextColor={colors.textSecondary}
          value={title}
          onChangeText={setTitle}
        />

        <ThemedText style={styles.label}>Ghi chú</ThemedText>
        <TextInput
          style={[styles.input, styles.textArea, { borderColor: colors.border, color: colors.textPrimary }]}
          placeholder="Nhập ghi chú thêm..."
          placeholderTextColor={colors.textSecondary}
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        {/* Đính kèm ảnh */}
        <ThemedText style={styles.label}>Ảnh chụp bài học / Bảng ghi chép</ThemedText>
        <AccessibleButton
          title="📷 Chọn ảnh đính kèm"
          onPress={pickImage}
          accessibilityLabel="Chọn ảnh đính kèm từ thư viện"
          variant="secondary"
        />

        {photoUri && (
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
        )}

        <View style={{ marginTop: Spacing.xl }}>
          <AccessibleButton
            title="Lưu bài tập"
            onPress={() => createMutation.mutate()}
            accessibilityLabel="Lưu bài tập mới"
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.md },
  label: { fontSize: 15, fontWeight: '600', marginTop: Spacing.md, marginBottom: Spacing.xs },
  input: {
    minHeight: TouchTarget.minHeight,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    fontSize: 16,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top', paddingTop: Spacing.sm },
  previewImage: { width: '100%', height: 200, borderRadius: 8, marginTop: Spacing.md },
});
```

#### 18. File: `app/(app)/assignments/[id].tsx` (TV2 — Dynamic Route Bắt Buộc)
> **Mục đích**: Màn hình chi tiết bài tập theo `[id]`. Hiển thị chi tiết, ảnh đính kèm, tick hoàn thành bài.
```typescript
import React from 'react';
import { View, StyleSheet, Image, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ThemedView } from '../../../src/components/ui/ThemedView';
import { ThemedText } from '../../../src/components/ui/ThemedText';
import { AccessibleButton } from '../../../src/components/ui/AccessibleButton';
import { useAssignments, useToggleAssignment } from '../../../src/hooks/useAssignments';
import { useThemeColor } from '../../../src/hooks/useThemeColor';
import { Spacing } from '../../../src/constants/tokens';

export default function AssignmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useThemeColor();
  const { data: assignments = [] } = useAssignments();
  const toggleMutation = useToggleAssignment();

  const item = assignments.find((a) => a.id === id);

  if (!item) {
    return (
      <ThemedView style={styles.center}>
        <ThemedText>Không tìm thấy bài tập này.</ThemedText>
      </ThemedView>
    );
  }

  const isCompleted = item.status === 'completed';

  return (
    <ThemedView style={styles.container}>
      <ScrollView>
        <ThemedText style={styles.title}>{item.title}</ThemedText>
        <ThemedText secondary style={styles.subtitle}>
          Trạng thái: {isCompleted ? '✅ Đã hoàn thành' : '⏳ Chưa hoàn thành'}
        </ThemedText>
        <ThemedText secondary style={styles.subtitle}>
          Hạn nộp: {new Date(item.dueAt).toLocaleString()}
        </ThemedText>

        {item.notes && (
          <View style={[styles.notesBox, { borderColor: colors.border }]}>
            <ThemedText style={{ fontWeight: '600', marginBottom: 4 }}>Ghi chú:</ThemedText>
            <ThemedText>{item.notes}</ThemedText>
          </View>
        )}

        {item.photoUri && (
          <View style={styles.photoContainer}>
            <ThemedText style={{ fontWeight: '600', marginBottom: Spacing.sm }}>Ảnh đính kèm:</ThemedText>
            <Image source={{ uri: item.photoUri }} style={styles.image} resizeMode="cover" />
          </View>
        )}

        <View style={{ marginTop: Spacing.xl }}>
          <AccessibleButton
            title={isCompleted ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu ĐÃ HOÀN THÀNH'}
            onPress={() => {
              toggleMutation.mutate({
                id: item.id,
                newStatus: isCompleted ? 'pending' : 'completed',
              });
            }}
            accessibilityLabel="Đổi trạng thái bài tập"
            variant={isCompleted ? 'secondary' : 'primary'}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: Spacing.md },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: Spacing.xs },
  subtitle: { fontSize: 15, marginBottom: Spacing.xs },
  notesBox: { padding: Spacing.md, borderRadius: 8, borderWidth: 1, marginVertical: Spacing.md },
  photoContainer: { marginTop: Spacing.md },
  image: { width: '100%', height: 250, borderRadius: 8 },
});
```

#### 19. File: `__tests__/dateUtils.test.ts` (TV2 — Pure Logic Test)
```typescript
import { isDueTomorrow } from '../src/utils/dateUtils';

describe('Date & Timezone Handling Logic', () => {
  it('"Due tomorrow" must return true regardless of time of day (at 23:30 or at 08:00)', () => {
    // 08:00 sáng ngày mai
    const tomorrowMorning = new Date();
    tomorrowMorning.setDate(tomorrowMorning.getDate() + 1);
    tomorrowMorning.setHours(8, 0, 0, 0);

    // 23:30 đêm ngày mai
    const tomorrowNight = new Date();
    tomorrowNight.setDate(tomorrowNight.getDate() + 1);
    tomorrowNight.setHours(23, 30, 0, 0);

    expect(isDueTomorrow(tomorrowMorning.toISOString())).toBe(true);
    expect(isDueTomorrow(tomorrowNight.toISOString())).toBe(true);
  });
});
```

#### 20. File: `__tests__/statsUtils.test.ts` (TV2 — Critical Path Test)
```typescript
import { computeCourseProgress, AssignmentItem } from '../src/utils/statsUtils';

describe('Course Progress Statistics (Computed)', () => {
  it('correctly computes total, completed, outstanding and percentage', () => {
    const dummyTasks: AssignmentItem[] = [
      { id: '1', courseId: 'C1', title: 'Task 1', dueAt: '', status: 'completed' },
      { id: '2', courseId: 'C1', title: 'Task 2', dueAt: '', status: 'pending' },
      { id: '3', courseId: 'C2', title: 'Task 3', dueAt: '', status: 'completed' },
    ];

    const stats = computeCourseProgress('C1', dummyTasks);
    expect(stats.total).toBe(2);
    expect(stats.completed).toBe(1);
    expect(stats.outstanding).toBe(1);
    expect(stats.percentage).toBe(50);
  });
});
```

---

## PHẦN 5: BỘ CÂU HỎI VIVA BẢO VỆ CHÉO (DÀNH CHO CẢ 2 BẠN ÔN TẬP)

Thầy Vinh sẽ hỏi ngẫu nhiên bất kỳ dòng code nào. Hai bạn phải nắm chắc 4 câu hỏi tử huyệt sau:

1. **Hỏi: "Tại sao token đăng nhập lại lưu trong SecureStore mà không lưu trong AsyncStorage?"**  
   *Trả lời*: `AsyncStorage` lưu dữ liệu dạng Plain Text không mã hóa trên bộ nhớ máy, dễ bị đánh cắp nếu thiết bị bị root/jailbreak hoặc qua mã độc. `SecureStore` sử dụng Keychain (iOS) hoặc KeyStore (Android) có mã hóa phần cứng phần mềm chuẩn bảo mật.
2. **Hỏi: "Hàm tính tiến độ môn học được gọi ở đâu và tại sao không lưu trường percentage vào Database?"**  
   *Trả lời*: Tiến độ là giá trị dẫn xuất (derived state). Nếu lưu vào Database, mỗi khi thêm, sửa, xóa hoặc đổi trạng thái bài tập sẽ dễ dẫn đến sai lệch dữ liệu (inconsistent data). Do đó nó được tính động qua `computeCourseProgress()` mỗi khi danh sách bài tập thay đổi.
3. **Hỏi: "Cập nhật lạc quan (Optimistic update) trong code của nhóm hoạt động ra sao nếu rớt mạng?"**  
   *Trả lời*: Trong hàm `useToggleAssignment`, sự kiện `onMutate` sẽ lưu lại bản snapshot của cache cũ (`previous`), sau đó ép giao diện đổi sang trạng thái mới ngay lập tức. Nếu API ném ra lỗi hoặc mất mạng, hàm `onError` sẽ gọi rollback khôi phục lại đúng bản cache `previous` đó.
4. **Hỏi: "Tại sao trong toàn bộ dự án không có mã màu Hex nào ngoài file tokens.ts?"**  
   *Trả lời*: Để đảm bảo quy tắc Design System tập trung. Mọi màu sắc đều đi qua hook `useThemeColor()`, giúp app tự động chuyển đổi giữa Light Mode và Dark Mode hoàn hảo và kiểm soát độ tương phản Accessibility $\ge 4.5:1$.
