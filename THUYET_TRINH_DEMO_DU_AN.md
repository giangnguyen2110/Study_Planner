# STUDY PLANNER — KỊCH BẢN THUYẾT TRÌNH, DEMO VÀ GIẢI TRÌNH KỸ THUẬT CHI TIẾT
## DỰ ÁN CUỐI KỲ: LẬP TRÌNH DI ĐỘNG (TH7011101) — GV: THẦY NGUYỄN XUÂN VINH
**Kho lưu trữ GitHub chính thức:** [https://github.com/giangnguyen2110/Study_Planner.git](https://github.com/giangnguyen2110/Study_Planner.git) (Nhánh `main`)  
**Công nghệ nền tảng:** React Native 0.88, Expo SDK 58, TypeScript Strict Mode, TanStack Query v5, Zustand v5, Expo Router v58, Jest Testing.

---

## MỤC LỤC TÀI LIỆU
1. [Cấu Trúc Repository & Bản Đồ Phân Chia Trách Nhiệm 50/50](#phần-1-cấu-trúc-repository--bản-đồ-phân-chia-trách-nhiệm-5050)
2. [Kịch Bản Thuyết Trình & Live Demo Từng Bước Cho 2 Thành Viên](#phần-2-kịch-bản-thuyết-trình--live-demo-từng-bước-cho-2-thành-viên)
3. [Cách Thức Hoạt Động Kỹ Thuật Toàn Hệ Thống (System Architecture & Data Flows)](#phần-3-cách-thức-hoạt-động-kỹ-thuật-toàn-hệ-thống)
4. [Phân Tích Ý Nghĩa Kỹ Thuật Từng Đoạn Code Trọng Tâm (Trực diện, không ẩn dụ)](#phần-4-phân-tích-ý-nghĩa-kỹ-thuật-từng-đoạn-code-trọng-tâm)
5. [Bảng Đối Chiếu 100% Tiêu Chí Đề Bài Của Giảng Viên](#phần-5-bảng-đối-chiếu-100-tiêu-chí-đề-bài-của-giảng-viên)

---

## PHẦN 1: CẤU TRÚC REPOSITORY & BẢN ĐỒ PHÂN CHIA TRÁCH NHIỆM 50/50

Dự án được tổ chức theo kiến trúc phân tầng rõ ràng (Layered Architecture), phân chia rành mạch giữa giao diện hiển thị (Presentation Layer) và dữ liệu nghiệp vụ (Data & Domain Layer).

```
Study_Planner/
├── app/                                 # Hệ thống Điều hướng & Màn hình (Expo Router File-based Routing)
│   ├── _layout.tsx                      # Root Layout: QueryClientProvider, Notification Listener (Chung)
│   ├── +not-found.tsx                   # Màn hình bắt lỗi 404 Not Found (TV1)
│   ├── (auth)/                          # Nhóm màn hình xác thực người dùng
│   │   ├── _layout.tsx                  # Stack Layout cho Auth (TV2)
│   │   └── sign-in.tsx                  # Màn hình đăng nhập sinh viên, lưu token SecureStore (TV2)
│   └── (app)/                           # Nhóm màn hình chính được bảo vệ (Protected Routes)
│       ├── _layout.tsx                  # App Stack: Kiểm tra Auth Session, điều hướng bảo mật (TV2)
│       ├── assignments/
│       │   └── [id].tsx                 # Dynamic Route: Xem chi tiết bài tập, ảnh đính kèm, Deep Link (TV2)
│       ├── modal/
│       │   └── new-assignment.tsx       # Modal thêm bài tập mới + ImagePicker đính kèm ảnh (TV2)
│       └── (tabs)/                      # Thanh điều hướng 3 Tab dưới đáy
│           ├── _layout.tsx              # Bottom Tab Navigator: Icons, Colors, Labels (TV1)
│           ├── index.tsx                # Tab 1: Trang chủ Dashboard, Widget 48h, Thống kê (TV1)
│           ├── schedule.tsx             # Tab 2: Lịch học, chuyển đổi List/Weekly View, Lọc kép (TV1)
│           └── courses.tsx              # Tab 3: Tiến độ môn học Computed, Thông tin User & Đăng xuất (TV2/TV1)
│
├── src/                                 # Mã nguồn ứng dụng (Core Application Source)
│   ├── constants/
│   │   └── tokens.ts                    # Design Tokens: Bảng màu Zero-Hex, Spacing 8pt, TouchTarget 44x44 (TV1)
│   ├── types/
│   │   ├── study.ts                     # TypeScript Domain Models: Course, AssignmentItem, CourseProgress (Chung)
│   │   └── testing.d.ts                 # Type declarations cho Testing Library (Chung)
│   ├── hooks/
│   │   ├── useThemeColor.ts             # Hook nhận diện Light/Dark Mode của hệ điều hành (TV1)
│   │   ├── useNotifications.ts          # Hook lập lịch thông báo cục bộ & bắt sự kiện Deep Linking (TV1)
│   │   ├── useAssignments.ts            # TanStack Query Hook: CRUD, Optimistic Update, Offline Storage (TV2)
│   │   └── useCourses.ts                # TanStack Query Hook: Tải môn học, Fallback màu sắc (TV2)
│   ├── store/
│   │   └── authStore.ts                 # Zustand Store: Quản lý Auth Session, token SecureStore, Selectors (TV2)
│   ├── utils/
│   │   ├── dateUtils.ts                 # Logic ngày giờ: startOfDay, isDueTomorrow, isDueWithin48Hours (TV2)
│   │   └── statsUtils.ts                # Logic toán học: computeCourseProgress tính % động (TV2)
│   └── components/
│       ├── ui/                          # Thư viện linh kiện giao diện cơ bản (Atomic Components)
│       │   ├── ThemedText.tsx           # Text component tự động đổi màu theo theme (TV1)
│       │   ├── ThemedView.tsx           # View container tự động đổi màu nền theo theme (TV1)
│       │   ├── AccessibleButton.tsx     # Nút bấm đạt chuẩn công thái học 44x44pt WCAG 2.1 AA (TV1)
│       │   ├── StateHandler.tsx         # Xử lý 4 trạng thái: Loading, Empty, Error có Retry, Content (TV2)
│       │   └── OfflineBanner.tsx        # Banner hiển thị mốc thời gian khi chạy offline (TV2)
│       └── features/                    # Thư viện linh kiện nghiệp vụ chuyên biệt
│           ├── AssignmentCard.tsx       # Thẻ bài tập: vạch màu môn, gạch ngang khi xong, checkbox 44x44 (TV1)
│           ├── Due48hWidget.tsx         # Widget trang chủ: tóm tắt deadline trong 48h (TV1)
│           └── WeeklyCalendar.tsx       # Lịch tuần 7 ngày (T2-CN), tính toán đầu tuần, chấm trạng thái (TV1)
│
├── __tests__/                           # Thư mục kiểm thử tự động (Jest & React Native Testing Library)
│   ├── AssignmentCard.test.tsx          # Component Test: AccessibleButton 44x44pt & checkbox event (TV1)
│   ├── dateUtils.test.ts                # Logic Test: startOfDay, isDueTomorrow, 48h boundary (TV2)
│   └── statsUtils.test.ts               # Critical Path Test: computeCourseProgress 0%, 50%, 100% (TV2)
│
├── HUONG_DAN_VAN_DAP_VIVA.md            # Cẩm nang 6 luật, 10 câu hỏi bẫy góc & tra cứu code Viva (Chung)
├── PROJECT_SPEC_AND_WORK_DIVISION.md    # Đặc tả chi tiết phân chia công việc 50/50 (Chung)
└── package.json                         # Cấu hình dự án, dependencies và test scripts
```

---

## PHẦN 2: KỊCH BẢN THUYẾT TRÌNH & LIVE DEMO TỪNG BƯỚC CHO 2 THÀNH VIÊN

> **Thời lượng chuẩn**: 10 – 12 phút.  
> **Phân vai**:
> - **TV1**: Trưởng nhóm Frontend UI/UX, Design Tokens, Navigation, Widget 48h, Lịch tuần và Thông báo.
> - **TV2**: Trưởng nhóm Data, Auth SecureStore, Zustand, TanStack Query, Optimistic Update và Logic toán học.

---

### MÀN 1: MỞ ĐẦU & TỔNG QUAN HỆ THỐNG (1 phút — TV1 & TV2)

* **Hành động**: Máy tính chiếu màn hình ứng dụng tại `http://localhost:8081` hoặc màn hình điện thoại kết nối qua Expo Go. Mở song song mã nguồn trên VS Code.
* **TV1 trình bày**:
  > *"Kính chào Thầy Nguyễn Xuân Vinh. Hôm nay nhóm chúng em gồm 2 thành viên xin phép báo cáo đồ án kết thúc môn Lập trình Mobile: Ứng dụng **Study Planner** quản lý học tập cá nhân. Toàn bộ mã nguồn dự án được xây dựng bằng React Native trên nền Expo SDK 58 và TypeScript chế độ nghiêm ngặt (Strict Mode). Em là [Tên TV1], phụ trách Lớp hiển thị (Presentation Layer), hệ thống Design Tokens, Trợ năng Accessibility, màn hình Dashboard, Lịch tuần và Cơ chế Thông báo cục bộ. Đồng đội của em là [Tên TV2], phụ trách Lớp dữ liệu (Data & Domain Layer), Xác thực người dùng, Quản lý State bằng Zustand, Đồng bộ mạng TanStack Query, Cập nhật lạc quan và Logic tính toán thời gian."*
* **TV2 trình bày**:
  > *"Dự án của nhóm chúng em đáp ứng đầy đủ 6/6 Yêu cầu bắt buộc (Must-Have) và 3/3 Yêu cầu nâng cao để đạt thang điểm trên 8.0, đồng thời giải quyết triệt để bài toán biên múi giờ và tuân thủ các chuẩn công thái học ngón tay di động."*

---

### MÀN 2: XÁC THỰC NGƯỜI DÙNG & BẢO MẬT PHIÊN VỚI SECURESTORE (1.5 phút — TV2 DEMO)

* **Hành động trên màn hình**: Đang ở màn hình Đăng nhập `/(auth)/sign-in`.
* **TV2 thuyết minh & thao tác**:
  1. *Thao tác*: Bấm vào nút **"Tài khoản mẫu: Nguyễn Văn A (23DTH1)"** để tự động điền form, sau đó bấm nút **"Đăng Nhập Vào Hệ Thống"**.
  2. *Giải thích mã nguồn*:
     > *"Thưa Thầy, theo yêu cầu đề bài, token phiên làm việc bắt buộc phải tồn tại qua các lần tắt mở ứng dụng (Survive app restart) và phải lưu trữ bảo mật. Em đã sử dụng thư viện `expo-secure-store`. Trong file [src/store/authStore.ts](file:///d:/LapTrinhMobile/Study_Planner/src/store/authStore.ts), hàm `signIn` gọi lệnh `SecureStore.setItemAsync(TOKEN_KEY, token)` để lưu trữ vào phân vùng Keychain trên iOS và Keystore trên Android được mã hóa phần cứng AES-256, hoàn toàn không lưu vào `AsyncStorage` để chống rò rỉ dữ liệu."*
  3. *Thao tác*: Tải lại trang (F5 / reload app), ứng dụng lập tức nhận diện phiên làm việc và duy trì ở Trang chủ mà không bắt đăng nhập lại.
  4. *Giải thích mã nguồn*:
     > *"Khi khởi động, hàm `restoreSession()` trong `authStore` tự động đọc token từ SecureStore. Tại file [app/(app)/_layout.tsx](file:///d:/LapTrinhMobile/Study_Planner/app/%28app%29/_layout.tsx), em triển khai cơ chế Route Guard thông qua Selector `selectIsAuthenticated`: nếu chưa xác thực, Expo Router sẽ dùng `<Redirect href="/(auth)/sign-in" />` để chặn truy cập trái phép."*

---

### MÀN 3: TRANG CHỦ DASHBOARD & WIDGET DEADLINE 48H (2 phút — TV1 DEMO)

* **Hành động trên màn hình**: Màn hình Trang chủ `/(app)/(tabs)/index`.
* **TV1 thuyết minh & thao tác**:
  1. *Thao tác*: Trỏ chuột vào lời chào đầu trang và khối Widget 48h màu cam.
  2. *Giải thích mã nguồn*:
     > *"Thưa Thầy, tại màn hình Trang chủ [app/(app)/(tabs)/index.tsx](file:///d:/LapTrinhMobile/Study_Planner/app/%28app%29/%28tabs%29/index.tsx), khối đầu tiên là lời chào định dạng theo thời gian thực tiếng Việt. Ngay phía dưới là **Widget tóm tắt deadline trong 48 giờ tới** ([Due48hWidget.tsx](file:///d:/LapTrinhMobile/Study_Planner/src/components/features/Due48hWidget.tsx)) — một trong ba yêu cầu nâng cao (> 8.0 điểm).*
     > 
     > *Widget này nhận mảng bài tập từ TanStack Query và áp dụng bộ lọc:*
     > ```typescript
     > assignments.filter(item => item.status === 'pending' && isDueWithin48Hours(item.dueAt))
     > ```
     > *Chỉ các bài tập chưa nộp và có thời gian hạn nộp cách thời điểm hiện tại từ 0 đến 48 giờ mới được xuất hiện, kèm theo giờ và ngày nộp chính xác."*
  3. *Thao tác*: Chỉ vào 3 ô thống kê (Tổng bài: 6, Chưa nộp: 5, Đã xong: 1).
  4. *Giải thích Design Tokens & Accessibility*:
     > *"Toàn bộ giao diện tuân thủ tuyệt đối **Luật Zero-Hex**: không có bất kỳ mã hex nào nằm ngoài file [src/constants/tokens.ts](file:///d:/LapTrinhMobile/Study_Planner/src/constants/tokens.ts). Mọi màu sắc đều được cấp phát động qua hook [src/hooks/useThemeColor.ts](file:///d:/LapTrinhMobile/Study_Planner/src/hooks/useThemeColor.ts). Các nút bấm đều đạt kích thước tối thiểu $44 \times 44$ pt theo quy định của Apple HIG và Google Material Design."*

---

### MÀN 4: CẬP NHẬT LẠC QUAN (OPTIMISTIC UPDATE) & TỰ ĐỘNG ROLLBACK (2 phút — TV2 DEMO)

* **Hành động trên màn hình**: Tại danh sách bài tập ưu tiên ở Trang chủ.
* **TV2 thuyết minh & thao tác**:
  1. *Thao tác*: Bấm vào ô checkbox $44 \times 44$ pt của bài tập *"Hoàn thiện Báo cáo Đồ án Mobile"*.
  2. *Quan sát*:
     - Tiêu đề bài tập ngay lập tức bị gạch ngang (`line-through`).
     - Số lượng bài tập trên Widget 48h giảm từ 2 xuống 1.
     - Ô thống kê "Chưa nộp" giảm từ 5 xuống 4, "Đã xong" tăng từ 1 lên 2.
     - Toàn bộ thay đổi diễn ra trong 0 mili-giây, không hề có độ trễ xoay vòng tròn.
  3. *Giải thích mã nguồn*:
     > *"Thưa Thầy, đây là tính năng nâng cao thứ ba: **Cập nhật lạc quan (Optimistic Updates)** được triển khai trong file [src/hooks/useAssignments.ts](file:///d:/LapTrinhMobile/Study_Planner/src/hooks/useAssignments.ts) thông qua `useMutation` của TanStack Query:
     > 1. Trong sự kiện `onMutate`: Em gọi `queryClient.cancelQueries` để ngăn các truy vấn mạng đang chạy ngầm, sau đó chụp một bản sao snapshot bộ nhớ cache hiện tại qua `previous = queryClient.getQueryData(['assignments'])`. Ngay lập tức, em ghi đè dữ liệu mới vào cache bằng `queryClient.setQueryData` để giao diện đổi trạng thái tức thì.
     > 2. Trong sự kiện `onError`: Nếu mạng bị ngắt kết nối hoặc máy chủ phản hồi mã lỗi 500/400, hàm `onError` sẽ lập tức kích hoạt lệnh `queryClient.setQueryData(['assignments'], context.previous)` để hoàn tác (Rollback) lại trạng thái ban đầu, bảo vệ dữ liệu không bị sai lệch.
     > 3. Trong sự kiện `onSettled`: Luôn gọi `queryClient.invalidateQueries` để đồng bộ lại dữ liệu chuẩn xác nhất từ máy chủ."*

---

### MÀN 5: LỊCH HỌC, XEM THEO TUẦN (WEEKLY VIEW) & BỘ LỌC KÉP (2 phút — TV1 DEMO)

* **Hành động trên màn hình**: Chuyển sang Tab 2: **"Lịch học"** (`/(app)/(tabs)/schedule`).
* **TV1 thuyết minh & thao tác**:
  1. *Thao tác*: Trỏ vào thanh điều hướng chế độ xem: Bấm chuyển đổi giữa **"📋 Danh sách"** và **"🗓️ Theo Tuần"**.
  2. *Giải thích mã nguồn*:
     > *"Thưa Thầy, tại màn hình [app/(app)/(tabs)/schedule.tsx](file:///d:/LapTrinhMobile/Study_Planner/app/%28app%29/%28tabs%29/schedule.tsx), hệ thống hỗ trợ 2 chế độ xem theo yêu cầu bắt buộc số 3 của đề bài.
     > Khi bật chế độ 'Theo Tuần', component [WeeklyCalendar.tsx](file:///d:/LapTrinhMobile/Study_Planner/src/components/features/WeeklyCalendar.tsx) được kích hoạt:
     > - Hàm `getWeekDays()` sử dụng thuật toán tính toán độ lệch ngày:
     >   ```typescript
     >   const dayOfWeek = current.getDay(); // 0 là CN, 1 là T2
     >   const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
     >   ```
     >   Thuật toán luôn lùi mốc thời gian về đúng Thứ Hai đầu tuần, sau đó cộng dồn 7 ngày liên tiếp từ Thứ Hai đến Chủ Nhật.
     > - Trên từng ngày, hệ thống duyệt mảng bài tập: nếu ngày đó có bài tập chưa nộp thì hiển thị chấm đỏ (`hasPendingTask`), nếu toàn bộ bài tập trong ngày đã giải quyết xong thì hiển thị chấm xanh lá."*
  3. *Thao tác*: Bấm nút **"Tuần sau ⏩"**, sau đó bấm nút **"Hôm nay"** để quay về tuần hiện tại.
  4. *Thao tác*: Thử nghiệm **Bộ lọc kép**:
     - Bấm chọn trạng thái: **"⏳ Chưa nộp"**.
     - Bấm chọn môn học: **"TH7011101"**.
     > *"Hai bộ lọc này hoạt động đồng thời bằng toán tử logic AND trong hàm `filter()`: `matchesStatus && matchesCourse`, đảm bảo sinh viên có thể tra cứu bài tập theo bất kỳ tiêu chí kết hợp nào."*

---

### MÀN 6: TIẾN ĐỘ TÍNH TOÁN ĐỘNG (COMPUTED DATA) & ĐĂNG XUẤT (1.5 phút — TV2 DEMO)

* **Hành động trên màn hình**: Chuyển sang Tab 3: **"Tiến độ môn"** (`/(app)/(tabs)/courses`).
* **TV2 thuyết minh & thao tác**:
  1. *Thao tác*: Trỏ chuột vào thanh phần trăm tiến độ của từng môn học (Lập trình Mobile: 50%, Cấu trúc dữ liệu: 100%, Cơ sở dữ liệu: 0%).
  2. *Giải thích mã nguồn*:
     > *"Thưa Thầy, theo Yêu cầu bắt buộc số 5: **Tiến độ môn học phải được tính toán động (computed), không lưu cứng trong Database**.
     > Trong file [src/utils/statsUtils.ts](file:///d:/LapTrinhMobile/Study_Planner/src/utils/statsUtils.ts), em xây dựng hàm thuần túy `computeCourseProgress`:
     > ```typescript
     > export function computeCourseProgress(courseId: string, assignments: AssignmentItem[]): CourseProgress {
     >   const courseTasks = assignments.filter((a) => a.courseId === courseId);
     >   const total = courseTasks.length;
     >   if (total === 0) return { courseId, total: 0, completed: 0, outstanding: 0, percentage: 0 };
     >   const completed = courseTasks.filter((a) => a.status === 'completed').length;
     >   const percentage = Math.round((completed / total) * 100);
     >   return { courseId, total, completed, outstanding: total - completed, percentage };
     > }
     > ```
     > Khi sinh viên hoàn thành bài tập, hàm này được tính toán lại ngay trong bộ nhớ với độ phức tạp $O(N)$ cực kỳ nhanh, loại bỏ hoàn toàn nguy cơ bất đồng bộ dữ liệu (Data Inconsistency) nếu lưu trường `percentage` trong Database."*
  3. *Thao tác*: Kéo xuống cuối màn hình, bấm nút **"🚪 Đăng Xuất Khỏi Thiết Bị"**.
     > *"Hàm `handleSignOut` thực hiện 2 thao tác dọn dẹp triệt để: gọi `queryClient.clear()` xóa sạch cache của người dùng cũ để tránh rò rỉ dữ liệu sang người dùng mới, sau đó gọi `signOut()` trong `authStore` xóa token trong SecureStore và điều hướng trở lại màn hình Đăng nhập."*
  4. *Thao tác*: Bấm đăng nhập lại để tiếp tục phần demo tiếp theo.

---

### MÀN 7: TẠO BÀI TẬP CÓ ẢNH (IMAGE PICKER) & LẬP LỊCH THÔNG BÁO (1.5 phút — TV2 DEMO)

* **Hành động trên màn hình**: Bấm nút **"➕ Tạo bài mới"** trên Trang chủ để mở Modal `/(app)/modal/new-assignment`.
* **TV2 thuyết minh & thao tác**:
  1. *Thao tác*:
     - Nhập tiêu đề: *"Chuẩn bị bài tập lớn Mobile"*.
     - Chọn môn học: *"TH7011101 - Lập trình Mobile"*.
     - Bấm nút **"📷 Chọn ảnh đính kèm từ thư viện"**, chọn một bức ảnh chụp bài giảng. Ảnh lập tức hiển thị bản xem trước (preview) trên form.
     - Bấm nút **"💾 Lưu bài tập mới"**.
  2. *Giải thích mã nguồn*:
     > *"Thưa Thầy, đây là tính năng nâng cao thứ nhất (> 8.0 điểm): tích hợp thư viện `expo-image-picker` trong file [app/(app)/modal/new-assignment.tsx](file:///d:/LapTrinhMobile/Study_Planner/app/%28app%29/modal/new-assignment.tsx).
     > Khi người dùng bấm lưu, mutation gửi đối tượng chứa đường dẫn `photoUri` lên hệ thống. Đồng thời, hệ thống tự động kích hoạt hàm `scheduleAssignmentNotification` trong [src/hooks/useNotifications.ts](file:///d:/LapTrinhMobile/Study_Planner/src/hooks/useNotifications.ts) để lập lịch báo thức trước thời điểm nộp bài 1 tiếng qua Expo Notifications."*

---

### MÀN 8: CƠ CHẾ THÔNG BÁO & DEEP LINKING (1.5 phút — TV1 DEMO)

* **Hành động trên màn hình**: Đang đứng tại Trang chủ hoặc một màn hình bất kỳ.
* **TV1 thuyết minh & thao tác**:
  1. *Thao tác*: Tại thẻ **"🔔 Demo Deep Linking (Sau 2s)"** ở đầu Trang chủ, bấm nút **"Bấm Demo 🔔"**.
  2. *Quan sát*:
     - Sau đúng 2 giây, một thông báo xuất hiện trên thanh trạng thái của hệ điều hành: *"⏰ Sắp đến hạn nộp bài: Hoàn thiện Báo cáo Đồ án Mobile..."*.
     - Dùng chuột/ngón tay chạm trực tiếp vào thông báo đó.
     - Ứng dụng tự động chuyển hướng màn hình, phóng thẳng vào trang Chi tiết bài tập: `/assignments/1`!
     - Trên trang chi tiết hiện rõ thông tin bài tập, vạch màu môn, ảnh đính kèm và banner màu xanh xác nhận: *"🎉 Bạn vừa truy cập thành công qua Deep Linking từ Thông Báo!"*.
  3. *Giải thích mã nguồn*:
     > *"Thưa Thầy, cơ chế Deep Linking theo Yêu cầu bắt buộc số 4 được triển khai thông qua hook `useNotificationListener()` đặt tại Root Layout [app/_layout.tsx](file:///d:/LapTrinhMobile/Study_Planner/app/_layout.tsx):
     > Khi lập lịch thông báo, trường `data` được đính kèm: `{ assignmentId: id }`.
     > Khi người dùng tương tác với thông báo trên thanh hệ thống, hàm lắng nghe `Notifications.addNotificationResponseReceivedListener` bắt được sự kiện, trích xuất `response.notification.request.content.data.assignmentId` và gọi lệnh `router.push('/assignments/' + assignmentId)`. Nhờ đặt tại Root Layout, tính năng này hoạt động xuyên suốt bất kể người dùng đang đứng ở màn hình nào."*

---

### MÀN 9: BẢO VỆ NGOẠI TUYẾN & CHẠY KIỂM THỬ TỰ ĐỘNG JEST (1.5 phút — TV1 & TV2)

* **Hành động**: Mở Terminal trên VS Code.
* **TV2 giải thích Cơ chế Ngoại tuyến (Offline Mode)**:
  > *"Thưa Thầy, đối với Yêu cầu bắt buộc số 6: Chạy offline hiển thị banner thời gian:
  > Trong file [src/hooks/useAssignments.ts](file:///d:/LapTrinhMobile/Study_Planner/src/hooks/useAssignments.ts), mỗi khi tải dữ liệu thành công từ Remote API, hệ thống lưu toàn bộ mảng bài tập vào `AsyncStorage` kèm mốc thời gian ISO (`cached_assignments_timestamp`). Khi thiết bị mất kết nối Internet, truy vấn mạng thất bại nhưng hàm `fetchAssignments` tự động chuyển sang đọc từ cache AsyncStorage. Component [OfflineBanner.tsx](file:///d:/LapTrinhMobile/Study_Planner/src/components/ui/OfflineBanner.tsx) bắt được trạng thái này và hiển thị dải thông báo màu hổ phách: `⚠️ Đang xem dữ liệu ngoại tuyến lưu lúc 10:15:30`."*

* **TV1 chạy lệnh kiểm thử**:
  1. *Thao tác*: Gõ lệnh trên Terminal:
     ```bash
     npm test
     ```
  2. *Kết quả hiển thị trên màn hình*:
     ```
     PASS __tests__/statsUtils.test.ts
     PASS __tests__/dateUtils.test.ts
     PASS __tests__/AssignmentCard.test.tsx

     Test Suites: 3 passed, 3 total
     Tests:       10 passed, 10 total
     Snapshots:   0 total
     Time:        1.31 s
     Ran all test suites.
     ```
  3. *TV1 & TV2 kết luận*:
     > *"Dự án của nhóm vượt chỉ tiêu kiểm thử của môn học: thay vì tối thiểu 3 tests, nhóm em đã xây dựng **10 ca kiểm thử tự động trên 3 bộ test suites** hoàn chỉnh:
     > - Bộ test 1 (TV1): Kiểm tra chuẩn trợ năng $44 \times 44$ pt và sự kiện tick checkbox của `AssignmentCard`.
     > - Bộ test 2 (TV2): Kiểm tra thuật toán múi giờ `startOfDay` và biên giới hạn 48 giờ của `dateUtils`.
     > - Bộ test 3 (TV2): Kiểm tra đường chạy tới hạn (Critical Path) tính % tiến độ của `statsUtils`.
     > Cả 10/10 test đều đạt kết quả PASS 100% trong 1.3 giây."*

---

## PHẦN 3: CÁCH THỨC HOẠT ĐỘNG KỸ THUẬT TOÀN HỆ THỐNG

### 1. Luồng Dữ Liệu & Bộ Nhớ Đệm (Data Flow & Caching)
```
[Remote Server / MockAPI]
       │  ▲
       ▼  │ (HTTP GET / PUT / POST)
[TanStack Query v5 Hook] ──(Lưu bản sao)──► [AsyncStorage Offline Cache]
       │                                              │
       │ (Cấp phát dữ liệu mượt mà)                  │ (Fallback khi mất mạng)
       ▼                                              ▼
[React Native Components] ◄────────────────── [OfflineBanner (<time>)]
```
1. Khi có mạng: Dữ liệu tải từ Remote API, đưa vào TanStack Query memory cache (staleTime 60s) và đồng thời ghi đè vào `AsyncStorage` kèm timestamp.
2. Khi mất mạng: `fetch` ném ra lỗi, khối `catch` trong `useAssignments` tự động đọc dữ liệu từ `AsyncStorage`, nạp vào giao diện và hiển thị `OfflineBanner`.

---

### 2. Luồng Xác Thực Người Dùng (Auth Session Flow)
```
[User Form / sign-in.tsx]
       │
       ▼ (Bấm Đăng Nhập)
[authStore.signIn(token, user)]
       │
       ├──► [Expo SecureStore] (Lưu trữ mã hóa phần cứng Keychain/Keystore)
       └──► [Zustand State]   (Cập nhật token, user, isAuthenticated: true)
                 │
                 ▼ (Lắng nghe qua Selector)
       [app/(app)/_layout.tsx] ──► Render các Tab chính (Trang chủ, Lịch, Môn)
```
1. Trạng thái phiên đăng nhập được lưu trữ đồng thời ở 2 tầng: tầng bộ nhớ RAM (Zustand State) cho tốc độ truy xuất tức thì, và tầng ổ đĩa mã hóa phần cứng (Expo SecureStore) để sống sót qua các lần tắt app.
2. `AppLayout` sử dụng selector `selectIsAuthenticated`: nếu giá trị là `false`, router ngay lập tức chuyển hướng sang `/(auth)/sign-in`.

---

### 3. Luồng Thông Báo & Deep Linking (Notification & Deep Link Flow)
```
[Tạo Bài Tập / new-assignment.tsx]
       │
       ▼ (Gọi scheduleAssignmentNotification)
[Expo Notifications Scheduler] ──(Hẹn giờ trước deadline 1h)──► [OS Notification Center]
                                                                      │
                                                                      ▼ (Người dùng chạm thông báo)
[app/_layout.tsx: useNotificationListener] ◄───────────────────────────┘
       │
       ▼ (Trích xuất assignmentId từ response.data)
[router.push('/assignments/' + id)] ──► [Màn hình chi tiết /assignments/[id].tsx]
```

---

## PHẦN 4: PHÂN TÍCH Ý NGHĨA KỸ THUẬT TỪNG ĐOẠN CODE TRỌNG TÂM

*(Phần này giải thích chính xác mặt kỹ thuật của từng đoạn code, không dùng hình tượng ví von để sinh viên trả lời trực diện với Giảng viên)*

### 1. File `src/constants/tokens.ts` (TV1)
```typescript
export const TouchTarget = {
  minHeight: 44,
  minWidth: 44,
} as const;
```
* **Ý nghĩa kỹ thuật**: Thuộc tính `as const` biến object thành kiểu dữ liệu bất biến (Read-only Literal Types). Con số `44` đại diện cho 44 điểm mật độ điểm ảnh (Point/dp). Đây là kích thước vật lý tối thiểu để một đầu ngón tay người trưởng thành có thể chạm chính xác mà không kích hoạt nhầm phần tử liền kề, đáp ứng tiêu chuẩn WCAG 2.1 Success Criterion 2.5.5 Target Size.

---

### 2. File `src/hooks/useThemeColor.ts` (TV1)
```typescript
export function useThemeColor() {
  const scheme = useColorScheme();
  return scheme === 'dark' ? Colors.dark : Colors.light;
}
```
* **Ý nghĩa kỹ thuật**: Hàm `useColorScheme()` từ `react-native` trả về kiểu `ColorSchemeName` (`'light' | 'dark' | null | undefined`). Việc sử dụng toán tử ba ngôi `scheme === 'dark' ? Colors.dark : Colors.light` đảm bảo tính Type-safe 100%: nếu thiết bị trả về `null` hoặc `'unspecified'`, hook luôn tự động fallback về `Colors.light`, ngăn chặn triệt để lỗi truy xuất thuộc tính `undefined`.

---

### 3. File `src/utils/dateUtils.ts` (TV2)
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
```
* **Ý nghĩa kỹ thuật**:
  - `startOfDay` đưa các thành phần Giờ, Phút, Giây và Mili-giây về số `0` tuyệt đối theo múi giờ địa phương của thiết bị.
  - Phép so sánh `dueDate.getTime() === tomorrow.getTime()` so sánh giá trị Epoch Unix timestamp (mili-giây) của hai ngày lịch.
  - **Bẫy kỹ thuật được giải quyết**: Nếu sinh viên kiểm tra bài tập lúc 23:30 đêm hôm nay cho một bài tập đến hạn vào 08:00 sáng mai: Nếu lấy `Date.now() + 24h`, khoảng cách thực tế chỉ là 8.5 giờ (chưa đủ 24 giờ). Việc chuẩn hóa bằng `startOfDay` đưa cả ngày hiện tại và ngày deadline về mốc `00:00:00`, biến bài toán so sánh thời gian tương đối thành so sánh khoảng cách ngày lịch cố định ($T+1$), đảm bảo kết quả luôn đồng nhất bất kể mở app lúc nào.

---

### 4. File `src/utils/statsUtils.ts` (TV2)
```typescript
export function computeCourseProgress(
  courseId: string,
  assignments: AssignmentItem[]
): CourseProgress {
  const courseTasks = assignments.filter((a) => a.courseId === courseId);
  const total = courseTasks.length;
  if (total === 0) {
    return { courseId, total: 0, completed: 0, outstanding: 0, percentage: 0 };
  }
  const completed = courseTasks.filter((a) => a.status === 'completed').length;
  const percentage = Math.round((completed / total) * 100);
  return { courseId, total, completed, outstanding: total - completed, percentage };
}
```
* **Ý nghĩa kỹ thuật**:
  - Hàm nhận vào hai tham số đầu vào và trả về một đối tượng mới, hoàn toàn không làm biến đổi (mutate) mảng `assignments` ban đầu.
  - Xử lý điều kiện biên $total = 0$ để tránh lỗi chia cho số không (`Division by zero` dẫn đến giá trị `NaN`).
  - Hàm `Math.round()` chuẩn hóa phần trăm thành số nguyên $(0 \rightarrow 100)$.

---

### 5. File `src/hooks/useAssignments.ts` — Optimistic Mutation (TV2)
```typescript
export function useToggleAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, newStatus }: { id: string; newStatus: 'pending' | 'completed' }) => {
      // Gọi API cập nhật trạng thái
    },
    onMutate: async ({ id, newStatus }) => {
      await queryClient.cancelQueries({ queryKey: ['assignments'] });
      const previous = queryClient.getQueryData<AssignmentItem[]>(['assignments']);

      queryClient.setQueryData<AssignmentItem[]>(['assignments'], (old = []) =>
        old.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      return { previous };
    },
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
* **Ý nghĩa kỹ thuật**:
  - `queryClient.cancelQueries`: Hủy các background refetch để tránh tình trạng race-condition (dữ liệu cũ từ mạng đè lên dữ liệu vừa cập nhật).
  - Snapshot `previous`: Lưu bản sao lưu của cache vào context của mutation.
  - `queryClient.setQueryData`: Cập nhật trực tiếp in-memory cache, kích hoạt React re-render lại component ngay tức thì mà không cần chờ phản hồi HTTP.
  - `onError`: Khôi phục lại đúng bản snapshot `context.previous` nếu phát sinh sự cố mạng.

---

### 6. File `src/components/ui/AccessibleButton.tsx` (TV1)
```typescript
<TouchableOpacity
  accessibilityRole="button"
  accessibilityLabel={accessibilityLabel}
  activeOpacity={0.8}
  onPress={onPress}
  style={[
    styles.button,
    { backgroundColor: getBackgroundColor() },
    variant === 'secondary' && { borderWidth: 1, borderColor: colors.border },
    style,
  ]}
  {...props}
>
  <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
</TouchableOpacity>
```
* **Ý nghĩa kỹ thuật**:
  - `accessibilityRole="button"`: Khai báo với hệ thống trợ năng (Accessibility Framework) của iOS (UIAccessibilityTraits) và Android (AccessibilityNodeInfo) rằng đây là một nút bấm tương tác được.
  - `accessibilityLabel`: Cung cấp nội dung văn bản để các công cụ đọc màn hình (TalkBack trên Android, VoiceOver trên iOS) đọc to cho người khiếm thị.
  - Mảng style đa tầng cho phép component tự quản lý màu nền mặc định theo biến thể (`variant`), nhưng vẫn cho phép component cha ghi đè thuộc tính khi cần thiết thông qua prop `style`.

---

### 7. File `src/components/features/AssignmentCard.tsx` (TV1)
```typescript
<TouchableOpacity
  accessibilityRole="checkbox"
  accessibilityState={{ checked: isCompleted }}
  accessibilityLabel={`Đánh dấu bài tập ${item.title} là ${isCompleted ? 'chưa hoàn thành' : 'đã hoàn thành'}`}
  onPress={onToggleStatus}
  style={[styles.checkboxTouchTarget, { borderColor: isCompleted ? colors.tint : colors.border }]}
>
  <View style={[styles.checkboxBox, isCompleted && { backgroundColor: colors.tint }]}>
    {isCompleted && <Text style={styles.checkmark}>✓</Text>}
  </View>
</TouchableOpacity>
```
* **Ý nghĩa kỹ thuật**:
  - `accessibilityRole="checkbox"` và `accessibilityState={{ checked: isCompleted }}`: Thông báo chính xác trạng thái Boolean của hộp kiểm cho phần mềm đọc màn hình.
  - Tách rời vùng bấm `checkboxTouchTarget` ($\ge 44 \times 44$ pt) với phần hiển thị đồ họa `checkboxBox` ($22 \times 22$ pt): Giúp giao diện giữ được vẻ thanh thoát, gọn gàng nhưng vùng nhận diện cảm ứng vật lý của ngón tay vẫn đạt chuẩn 44pt.
  - Sự kiện `onToggleStatus` chỉ kích hoạt tại nút con, không kích hoạt sự kiện bấm vào thân thẻ cha `onPressCard`.

---

### 8. File `src/components/features/WeeklyCalendar.tsx` (TV1)
```typescript
function getWeekDays(baseDate: Date): Date[] {
  const current = new Date(baseDate);
  const dayOfWeek = current.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(current);
  monday.setDate(current.getDate() + diff);

  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const nextDay = new Date(monday);
    nextDay.setDate(monday.getDate() + i);
    days.push(nextDay);
  }
  return days;
}
```
* **Ý nghĩa kỹ thuật**:
  - Trong JavaScript standard library, hàm `Date.prototype.getDay()` quy ước: `0 = Chủ Nhật, 1 = Thứ Hai, ..., 6 = Thứ Bảy`.
  - Nếu `dayOfWeek === 0` (Chủ Nhật), độ lệch để về Thứ Hai đầu tuần trước là `-6` ngày. Đối với các thứ từ 1 đến 6, độ lệch là `1 - dayOfWeek` ngày.
  - Vòng lặp `for (let i = 0; i < 7; i++)` tạo ra một mảng mới gồm 7 đối tượng `Date` độc lập đại diện chính xác cho tuần làm việc từ Thứ Hai đến Chủ Nhật.

---

### 9. File `src/hooks/useNotifications.ts` (TV1)
```typescript
export function useNotificationListener() {
  const router = useRouter();

  useEffect(() => {
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const assignmentId = response.notification.request.content.data?.assignmentId;
        if (assignmentId) {
          router.push(`/assignments/${assignmentId}`);
        }
      }
    );

    return () => {
      responseSubscription.remove();
    };
  }, [router]);
}
```
* **Ý nghĩa kỹ thuật**:
  - `addNotificationResponseReceivedListener`: Lắng nghe sự kiện người dùng bấm vào một thông báo đã hiển thị trên thanh thông báo của hệ điều hành.
  - Hàm dọn dẹp `responseSubscription.remove()` được đặt trong cleanup function của `useEffect` để hủy đăng ký listener khi component bị unmount, ngăn ngừa rò rỉ bộ nhớ (Memory Leak).
  - Sử dụng imperative navigation `router.push` để điều hướng sâu (Deep Linking) tới dynamic route `app/(app)/assignments/[id].tsx`.

---

### 10. File `src/store/authStore.ts` (TV2)
```typescript
export const selectIsAuthenticated = (state: AuthState) => !!state.token;
export const selectCurrentUser = (state: AuthState) => state.user;
export const selectAuthLoading = (state: AuthState) => state.isLoading;
```
* **Ý nghĩa kỹ thuật**:
  - Các hàm Selector giúp component chỉ đăng ký lắng nghe (subscribe) đúng phần dữ liệu tối thiểu mà nó cần.
  - Ví dụ: Một component chỉ cần biết trạng thái đăng nhập sẽ dùng `useAuthStore(selectIsAuthenticated)`. Khi thông tin `user.name` hoặc `user.email` thay đổi nhưng `token` không đổi, component đó sẽ **không bị re-render lại**, tối ưu hóa hiệu năng render của React.

---

## PHẦN 5: BẢNG ĐỐI CHIẾU 100% TIÊU CHÍ ĐỀ BÀI CỦA GIẢNG VIÊN

| Tiêu chuẩn kỹ thuật | File hiện thực hóa | Trạng thái nghiệm thu |
| :--- | :--- | :---: |
| **1. Sign-in/Sign-out token SecureStore** | `src/store/authStore.ts`<br>`app/(auth)/sign-in.tsx` |  Đạt 100% |
| **2. Courses & Assignments CRUD qua Remote API** | `src/hooks/useAssignments.ts`<br>`src/hooks/useCourses.ts` |  Đạt 100% |
| **3. Weekly View & List View kèm lọc** | `app/(app)/(tabs)/schedule.tsx`<br>`src/components/features/WeeklyCalendar.tsx` |  Đạt 100% |
| **4. Deadline notifications + Deep linking** | `src/hooks/useNotifications.ts`<br>`app/(app)/assignments/[id].tsx` |  Đạt 100% |
| **5. Tiến độ tính toán động (computed, không lưu DB)** | `src/utils/statsUtils.ts`<br>`app/(app)/(tabs)/courses.tsx` |  Đạt 100% |
| **6. Chạy offline hiển thị banner thời gian** | `src/components/ui/OfflineBanner.tsx`<br>`src/hooks/useAssignments.ts` |  Đạt 100% |
| **7. [Nâng cao > 8.0] Đính kèm ảnh ImagePicker** | `app/(app)/modal/new-assignment.tsx`<br>`app/(app)/assignments/[id].tsx` |  Đạt 100% |
| **8. [Nâng cao > 8.0] Widget deadline 48h trên trang chủ** | `src/components/features/Due48hWidget.tsx`<br>`app/(app)/(tabs)/index.tsx` |  Đạt 100% |
| **9. [Nâng cao > 8.0] Optimistic update & Rollback** | `src/hooks/useAssignments.ts` (`onMutate`, `onError`) |  Đạt 100% |
| **10. Bẫy múi giờ Date & Timezone (`startOfDay`)** | `src/utils/dateUtils.ts` |  Đạt 100% |
| **11. Quy tắc Zero-Hex** | `src/constants/tokens.ts`<br>`src/hooks/useThemeColor.ts` |  Đạt 100% |
| **12. Chuẩn trợ năng Accessibility $\ge 44 \times 44$ pt** | `src/components/ui/AccessibleButton.tsx`<br>`src/components/features/AssignmentCard.tsx` |  Đạt 100% |
| **13. Kiểm thử tự động Jest ($\ge 3$ tests)** | `__tests__/AssignmentCard.test.tsx`<br>`__tests__/dateUtils.test.ts`<br>`__tests__/statsUtils.test.ts` |  Vượt chỉ tiêu (**10/10 tests PASS**) |

---

> 🎯 **Lời dặn khi bước vào phòng vấn đáp Viva**:
> - Hai bạn giữ vững tác phong tự tin, xưng hô rõ ràng.
> - Khi Thầy Vinh yêu cầu giải thích đoạn mã nào, mở ngay file mã nguồn tương ứng theo bảng tra cứu ở trên, trỏ đúng vào hàm và giải thích tường minh theo cơ chế phần mềm. Chúc 2 bạn bảo vệ xuất sắc và đạt điểm số cao nhất! 🌟
