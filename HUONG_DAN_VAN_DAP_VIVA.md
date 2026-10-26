# STUDY PLANNER — CẨM NANG VẤN ĐÁP & TRANH LUẬN BẢO VỆ ĐỒ ÁN (VIVA DEFENSE GUIDE)
## DÀNH CHO CẢ 2 THÀNH VIÊN (TV1 & TV2) — BẢO VỆ TRƯỚC THẦY NGUYỄN XUÂN VINH

> **Môn học**: Lập trình Mobile (TH7011101 - Lớp 23DTH1) — Trường Đại học Công nghệ Đồng Nai (DNTU)  
> **Giảng viên chấm thi**: Thầy Nguyễn Xuân Vinh  
> **Tỉ trọng điểm**: 50% điểm tổng kết môn  
> **Quy định quan trọng nhất của Thầy**: *"Giảng viên sẽ chọn ngẫu nhiên các đoạn mã từ repository của nhóm, kể cả những đoạn mã sinh viên không trực tiếp viết, để yêu cầu giải thích."*

---

## MỤC LỤC
1. [Chiến Lược Bảo Vệ Viva Đạt Điểm Tuyệt Đối](#phần-1-chiến-lược-bảo-vệ-viva-đạt-điểm-tuyệt-đối)
2. [6 "Luật Bất Thành Văn" Của Đồ Án (Các Bẫy Thường Gặp)](#phần-2-6-luật-bất-thành-văn-của-đồ-án)
3. [Bộ Câu Hỏi & Trả Lời Vấn Đáp Chi Tiết Theo Từng File](#phần-3-bộ-câu-hỏi--trả-lời-theo-từng-file)
   - [Nhóm Frontend, UI/UX, Navigation & Notification (TV1)](#31-nhóm-frontend-uiux-navigation--notification-tv1)
   - [Nhóm Data Layer, Core Logic, Offline & State (TV2 & Giao thoa)](#32-nhóm-data-layer-core-logic-offline--state-tv2--giao-thoa)
4. [Kịch Bản 10 Câu Hỏi "Bẫy Góc / Bẻ Lập Trình" Của Thầy Vinh](#phần-4-kịch-bản-10-câu-hỏi-bẫy-góc-khó-nhằn)
5. [Bảng Tra Cứu Nhanh: Thầy Hỏi Gì -> Mở Ngay Dòng Nào](#phần-5-bảng-tra-cứu-nhanh-thầy-hỏi-gì---mở-ngay-dòng-nào)

---

## PHẦN 1: CHIẾN LƯỢC BẢO VỆ VIVA ĐẠT ĐIỂM TUYỆT ĐỐI

### 1. Tâm lý và phong thái trả lời
- **Bình tĩnh, tự tin**: Thầy Vinh không hỏi đánh đố ngoài chương trình, Thầy chỉ kiểm tra xem sinh viên có **thực sự hiểu code trong repo** hay chỉ copy-paste trên mạng.
- **Nguyên tắc "Hỏi đâu - Mở file đó"**: Khi Thầy hỏi về một chức năng, đừng chỉ trả lời lý thuyết suông. Hãy mở ngay file mã nguồn tương ứng, trỏ chuột vào đúng hàm và giải thích từ logic code. Thầy sẽ đánh giá cực kỳ cao sự chuyên nghiệp này!
- **Hỗ trợ đồng đội**: Nếu TV2 bị hỏi trúng file của TV1 hoặc ngược lại, hãy trả lời tự nhiên theo kịch bản trong cẩm nang này. Tuyệt đối **KHÔNG ĐƯỢC NÓI**: *"Đoạn này bạn kia làm, em không biết"*.

---

## PHẦN 2: 6 "LUẬT BẤT THÀNH VĂN" CỦA ĐỒ ÁN

Đây là 6 nguyên tắc kiến trúc cốt lõi chi phối toàn bộ mã nguồn dự án. Thầy Vinh chắc chắn sẽ hỏi xoay quanh 6 luật này:

### 1. Luật Zero-Hex (Không mã màu Hex trong UI)
- **Quy tắc**: Trong toàn bộ dự án, mã màu Hex (`#FFFFFF`, `#2563EB`...) chỉ được xuất hiện ở **DUY NHẤT 1 FILE**: `src/constants/tokens.ts`.
- **Tại sao?**: Đảm bảo nguyên lý *Single Source of Truth* cho Design System. Khi người dùng bật Dark Mode trên điện thoại, toàn bộ giao diện tự động đồng bộ mà không cần chỉnh sửa hàng chục màn hình khác nhau.

### 2. Luật Trợ Năng (Accessibility Standards)
- **Quy tắc**: Mọi nút bấm, ô checkbox, tabbar, icon touchable đều phải có:
  + Vùng chạm tối thiểu $44 \times 44$ pt (`minHeight: 44, minWidth: 44`).
  + `accessibilityRole`: `"button"` hoặc `"checkbox"`.
  + `accessibilityLabel`: Văn bản mô tả rõ ràng hành động (ví dụ: *"Lưu bài tập mới"*, *"Đánh dấu hoàn thành bài tập..."*).
- **Tại sao?**: Đáp ứng tiêu chuẩn công thái học ngón tay người dùng của Apple/Google (Apple HIG & Android Accessibility) và chuẩn WCAG 2.1 AA cho người khiếm thị dùng phần mềm đọc màn hình (TalkBack/VoiceOver).

### 3. Luật 4 Trạng Thái (4-States Law)
- **Quy tắc**: Mọi màn hình tải dữ liệu mạng đều phải xử lý đủ 4 trạng thái qua component `StateHandler.tsx`:
  1. `Loading`: Hiện `ActivityIndicator` xoay tròn.
  2. `Empty`: Hiện thông báo danh sách trống.
  3. `Error with working retry`: Hiện thông báo lỗi và nút "Thử lại" gọi hàm `refetch()` thật sự.
  4. `Content`: Hiển thị dữ liệu chính.
- **Tại sao?**: Loại bỏ tình trạng màn hình trắng xóa hoặc đơ khi mất mạng, mang lại trải nghiệm người dùng (UX) đạt chuẩn Production.

### 4. Luật Phân Tách State & Bảo Mật
- **Auth Token đăng nhập**: **CHỈ ĐƯỢC LƯU TRONG `SecureStore`**, tuyệt đối cấm lưu vào `AsyncStorage`.
- **Dữ liệu mạng (Remote API)**: Quản lý bằng **TanStack Query v5** (bộ nhớ đệm cache, auto refetch, stale time).
- **Dữ liệu ứng dụng chia sẻ (Client State)**: Quản lý bằng **Zustand** với Selector.
- **Dữ liệu ngoại tuyến (Offline Cache)**: Lưu trong **AsyncStorage** kèm mốc thời gian lưu.

### 5. Luật Dữ Liệu Dẫn Xuất (Computed Data Law)
- **Quy tắc**: Thống kê tiến độ môn học (tổng số bài, số bài đã xong, tỉ lệ %) là giá trị tính toán động (**computed**) thông qua hàm `computeCourseProgress()`, **TUYỆT ĐỐI KHÔNG lưu cứng cột `percentage` trong Database/API**.
- **Tại sao?**: Nếu lưu cứng trong DB, mỗi khi sinh viên tick hoàn thành, thêm bài mới, sửa hạn nộp hay xóa bài sẽ phải cập nhật lại trường percentage này, rất dễ dẫn đến sai lệch dữ liệu (Data Inconsistency). Tính động (derived state) đảm bảo luôn chuẩn xác 100%.

### 6. Luật Xử Lý Ngày & Múi Giờ (Date & Timezone Law)
- **Quy tắc**: Tính toán deadline ("Due tomorrow", "Due in 48 hours") bắt buộc phải xử lý theo ngày địa phương bằng hàm `startOfDay()`, **không được lấy `Date.now() + 24 * 60 * 60 * 1000` thuần túy**.
- **Tại sao?**: Nếu sinh viên mở app lúc 23:30 đêm kiểm tra bài tập nộp vào 08:00 sáng mai: Nếu cộng 24h chay, khoảng cách chỉ là 8.5 tiếng (chưa đủ 24h) dẫn đến tính toán sai. Bằng cách dùng `startOfDay()`, ta đưa cả hôm nay và ngày mai về mốc 00:00:00 của ngày theo lịch, đảm bảo kết quả luôn đồng nhất.

---

## PHẦN 3: BỘ CÂU HỎI & TRẢ LỜI THEO TỪNG FILE

### 3.1. NHÓM FRONTEND, UI/UX, NAVIGATION & NOTIFICATION (TV1)

#### 📄 File 1: `src/constants/tokens.ts`
- **Chức năng**: Khai báo bảng màu `Colors.light` và `Colors.dark`, hệ thống khoảng cách `Spacing` (4, 8, 16, 24, 32), và kích thước vùng bấm `TouchTarget` (min 44x44).
- ❓ **Thầy hỏi**: *"Nếu Thầy muốn đổi màu chủ đạo của app từ xanh dương sang xanh lá cây thì em sửa ở đâu?"*
  - 🗣️ **Trả lời**: *"Dạ thưa Thầy, em chỉ cần vào file `src/constants/tokens.ts`, tại dòng `Colors.light.tint` và `Colors.dark.tint` em đổi sang mã màu xanh lá cây mong muốn. Do toàn bộ app đều dùng `useThemeColor()`, tất cả nút bấm, tab bar, tiêu đề sẽ tự động đổi màu theo mà không cần sửa bất kỳ file nào khác."*
- ❓ **Thầy hỏi**: *"Tại sao Spacing lại là các con số 4, 8, 16, 24, 32?"*
  - 🗣️ **Trả lời**: *"Dạ đây là hệ thống 8-point grid tiêu chuẩn trong thiết kế UI/UX di động. Bội số của 8pt giúp các phần tử trên màn hình luôn thẳng hàng, cân đối thị giác trên mọi kích thước màn hình điện thoại từ màn hình nhỏ đến màn hình Pro Max."*

---

#### 📄 File 2: `src/hooks/useThemeColor.ts`
- **Chức năng**: Custom hook đọc theme hệ điều hành qua `useColorScheme()` và trả về bảng màu `Colors.dark` hoặc `Colors.light`.
- ❓ **Thầy hỏi**: *"Tại sao dòng cuối em lại viết `return scheme === 'dark' ? Colors.dark : Colors.light` mà không viết `return Colors[scheme]`?"*
  - 🗣️ **Trả lời**: *"Dạ thưa Thầy, hàm `useColorScheme()` của React Native có thể trả về các giá trị như `null`, `undefined` hoặc `'unspecified'`. Nếu viết `Colors[scheme]` thì TypeScript ở chế độ Strict Mode sẽ báo lỗi index signature. Viết toán tử 3 ngôi kiểm tra `scheme === 'dark'` giúp đảm bảo an toàn kiểu 100% (Type-safety), nếu thiết bị trả về null hoặc light thì luôn fallback an toàn về `Colors.light`."*

---

#### 📄 File 3 & 4: `src/components/ui/ThemedView.tsx` & `ThemedText.tsx`
- **Chức năng**: Component container và text tự động áp dụng màu nền và màu chữ theo theme.
- ❓ **Thầy hỏi**: *"Trong `ThemedText.tsx`, cờ `secondary` hoạt động như thế nào?"*
  - 🗣️ **Trả lời**: *"Dạ thưa Thầy, khi một đoạn text có `secondary={true}` (như ngày giờ, ghi chú, phụ đề), component sẽ gán màu `colors.textSecondary` (màu xám dịu hơn) thay vì `colors.textPrimary` (đen đậm/trắng sáng). Điều này giúp mắt người dùng dễ dàng phân biệt đâu là tiêu đề quan trọng và đâu là thông tin phụ trợ."*
- ❓ **Thầy hỏi**: *"Trong `ThemedView.tsx`, tại sao style lại truyền dưới dạng mảng `[{ backgroundColor: colors.background }, style]`?"*
  - 🗣️ **Trả lời**: *"Dạ để phần tử đầu tiên luôn đặt màu nền mặc định theo theme hệ thống, còn phần tử thứ hai `style` cho phép component cha bên ngoài ghi đè (override) các thuộc tính như padding, margin, bo góc hoặc nền trong suốt khi có nhu cầu đặc thù."*

---

#### 📄 File 5: `src/components/ui/AccessibleButton.tsx`
- **Chức năng**: Nút bấm chuẩn trợ năng với 3 biến thể: `primary`, `secondary`, `danger`.
- ❓ **Thầy hỏi**: *"Giải thích các thuộc tính trợ năng bên trong component nút bấm này?"*
  - 🗣️ **Trả lời**: *"Dạ thưa Thầy:
    1. `minHeight: 44, minWidth: 44`: Đảm bảo kích thước tối thiểu $44 \times 44$ pt để ngón tay chạm không bị trượt.
    2. `accessibilityRole="button"`: Khai báo với hệ điều hành đây là phần tử có thể bấm được.
    3. `accessibilityLabel`: Chuỗi văn bản để TalkBack/VoiceOver đọc to hành động cho người khiếm thị."*
- ❓ **Thầy hỏi**: *"Biến thể `secondary` khác biến thể `primary` ở điểm nào trong code?"*
  - 🗣️ **Trả lời**: *"Dạ biến thể `primary` dùng cho nút hành động chính, có nền màu `colors.tint` và chữ trắng. Biến thể `secondary` dùng cho hành động phụ, có nền trong suốt/surface, có thêm viền border (`borderWidth: 1`) và chữ màu `colors.textPrimary`."*

---

#### 📄 File 6: `src/components/features/AssignmentCard.tsx`
- **Chức năng**: Thẻ bài tập hiển thị vạch màu môn học, tiêu đề gạch ngang khi xong, hạn nộp, checkbox đổi trạng thái, chạm vào thẻ mở chi tiết.
- ❓ **Thầy hỏi**: *"Tại sao thẻ bài tập này lồng 2 `TouchableOpacity` mà khi bấm checkbox không bị vô tình mở trang chi tiết bài tập?"*
  - 🗣️ **Trả lời**: *"Dạ thưa Thầy, trong React Native, sự kiện chạm (Touch Event) được kích hoạt ưu tiên từ component con bên trong trước. Khi sinh viên bấm trúng ô Checkbox con, sự kiện `onToggleStatus` sẽ xử lý việc đổi trạng thái hoàn thành ngay lập tức mà không lan truyền (không kích hoạt) sự kiện `onPressCard` của TouchableOpacity cha."*
- ❓ **Thầy hỏi**: *"Tiêu đề bài tập bị gạch ngang khi hoàn thành bằng thuộc tính nào?"*
  - 🗣️ **Trả lời**: *"Dạ bằng thuộc tính `textDecorationLine: isCompleted ? 'line-through' : 'none'` và em giảm `opacity: isCompleted ? 0.6 : 1` để người dùng thấy rõ bài tập này đã được giải quyết."*

---

#### 📄 File 7: `src/components/features/Due48hWidget.tsx`
- **Chức năng**: Widget trên Home Screen tóm tắt các deadline trong 48 giờ tới (tiêu chí điểm > 8.0).
- ❓ **Thầy hỏi**: *"Đoạn code nào thực hiện việc lọc các bài tập trong vòng 48 giờ tới?"*
  - 🗣️ **Trả lời**: *"Dạ tại dòng 49–53:
    `assignments.filter((item) => item.status === 'pending' && isDueWithin48Hours(item.dueAt))`
    Hàm này kết hợp 2 điều kiện: Bài tập chưa hoàn thành (`pending`) và thời gian đến hạn nằm trong khoảng từ 0 đến 48 giờ tính từ thời điểm hiện tại."*

---

#### 📄 File 8: `src/components/features/WeeklyCalendar.tsx`
- **Chức năng**: Giao diện lịch tuần hiển thị 7 ngày từ Thứ Hai đến Chủ Nhật, có chấm chỉ báo bài tập và lọc bài theo ngày được chọn.
- ❓ **Thầy hỏi**: *"Thuật toán hàm `getWeekDays()` tính toán Thứ Hai đầu tuần như thế nào?"*
  - 🗣️ **Trả lời**: *"Dạ thưa Thầy:
    Trong JavaScript, hàm `getDay()` trả về 0 cho Chủ Nhật, 1 cho Thứ Hai...
    Để tìm ngày Thứ Hai đầu tuần:
    - Nếu hôm nay là Chủ Nhật (0), ta trừ đi 6 ngày (`diff = -6`).
    - Nếu hôm nay là các thứ khác (1 đến 6), ta trừ đi `(dayOfWeek - 1)` ngày.
    Sau khi lùi về đúng Thứ Hai, em dùng vòng lặp chạy từ 0 đến 6 để cộng thêm ngày, sinh ra chính xác mảng 7 ngày liên tiếp từ Thứ Hai đến Chủ Nhật."*
- ❓ **Thầy hỏi**: *"Chấm tròn (task dot) trên từng ngày thể hiện điều gì?"*
  - 🗣️ **Trả lời**: *"Dạ:
    - Chấm màu đỏ: Ngày đó có ít nhất một bài tập chưa nộp (`hasPendingTask === true`).
    - Chấm màu xanh: Ngày đó có bài tập nhưng đã hoàn thành hết (`status === 'completed'`).
    - Không có chấm: Ngày đó không có bài tập nào đến hạn."*

---

#### 📄 File 9: `src/hooks/useNotifications.ts`
- **Chức năng**: Quản lý thông báo cục bộ và Deep Linking mở thẳng bài tập.
- ❓ **Thầy hỏi**: *"Deep Linking từ thông báo hoạt động ra sao nếu app đang tắt hoàn toàn?"*
  - 🗣️ **Trả lời**: *"Dạ thưa Thầy:
    Khi tạo thông báo trong hàm `scheduleAssignmentNotification`, em gắn object `data: { assignmentId }`.
    Khi người dùng chạm vào thông báo trên thanh Notification của điện thoại, hệ điều hành sẽ khởi động app và kích hoạt listener `Notifications.addNotificationResponseReceivedListener`.
    Hook `useNotificationListener` bóc tách `assignmentId` ra và thực thi lệnh:
    `router.push('/assignments/' + assignmentId)` của Expo Router để mở trực tiếp màn hình chi tiết bài tập đó."*

---

#### 📄 File 10: `app/(app)/(tabs)/index.tsx`
- **Chức năng**: Màn hình Trang Chủ (Home Dashboard).
- ❓ **Thầy hỏi**: *"Tại sao khi em tạo bài tập mới ở màn hình Modal thì quay về màn hình Home dữ liệu lại tự động cập nhật ngay?"*
  - 🗣️ **Trả lời**: *"Dạ thưa Thầy, nhờ vào cơ chế Reactive Cache của TanStack Query v5. Ở màn hình Home, em gọi hook `useAssignments()`. Khi màn hình Modal thêm bài tập thành công, nó gọi lệnh `queryClient.invalidateQueries({ queryKey: ['assignments'] })`. Lệnh này đánh dấu cache cũ đã lỗi thời và tự động kích hoạt fetch lại ngầm, giúp màn hình Home tự động re-render dữ liệu mới nhất mà không cần truyền callback thủ công."*

---

#### 📄 File 11: `app/(app)/(tabs)/schedule.tsx`
- **Chức năng**: Màn hình quản lý lịch học hỗ trợ 2 chế độ List View và Weekly View.
- ❓ **Thầy hỏi**: *"Khi người dùng đang chọn lọc bài tập 'Chưa nộp' ở chế độ Danh sách, rồi bấm sang chế độ 'Theo Tuần' thì bộ lọc có bị mất không?"*
  - 🗣️ **Trả lời**: *"Dạ hoàn toàn không bị mất thưa Thầy. State `statusFilter` nằm ở component cha `ScheduleScreen`. Mảng `filteredAssignments` được tính toán trước, sau đó nếu là chế độ Danh Sách thì truyền vào `FlatList`, nếu là chế độ Theo Tuần thì truyền vào `<WeeklyCalendar assignments={filteredAssignments} />`. Vì vậy khi chuyển đổi qua lại giữa 2 chế độ, kết quả lọc luôn được giữ nguyên."*

---

#### 📄 File 12: `app/+not-found.tsx`
- **Chức năng**: Màn hình lỗi 404 chuẩn Expo Router.
- ❓ **Thầy hỏi**: *"Ý nghĩa của dấu `+` trong file `+not-found.tsx` là gì?"*
  - 🗣️ **Trả lời**: *"Dạ trong Expo Router (File-based routing), dấu cộng `+` là tiền tố quy ước cho các file hệ thống đặc biệt (Special system routes). File `+not-found.tsx` hoạt động như một route dự phòng (Catch-all unmatched route). Nếu người dùng điều hướng bằng URL hoặc Deep Link trỏ tới một đường dẫn không tồn tại trong thư mục `app/`, Expo Router tự động hiển thị màn hình này thay vì gây crash app."*

---

#### 📄 File 13: `__tests__/AssignmentCard.test.tsx`
- **Chức năng**: Bộ kiểm thử tự động Component Test với Jest và React Native Testing Library.
- ❓ **Thầy hỏi**: *"Bộ test này của em kiểm tra những tiêu chí cụ thể nào?"*
  - 🗣️ **Trả lời**: *"Dạ thưa Thầy, bộ test kiểm tra 3 tiêu chí quan trọng:
    1. Kiểm tra `AccessibleButton` có `accessibilityRole="button"`, hiển thị đúng chữ, có kích thước tối thiểu đạt chuẩn trợ năng $\ge 44 \times 44$ pt và bắt được sự kiện click `fireEvent.press`.
    2. Kiểm tra `AssignmentCard` hiển thị đúng tiêu đề, tên môn học, có `role="checkbox"`, và khi chạm vào checkbox thì hàm `onToggleStatus` được kích hoạt mà không làm kích hoạt mở thẻ.
    3. Kiểm tra khi bài tập có `status === 'completed'` thì dấu tick `✓` xuất hiện chính xác."*

---

### 3.2. NHÓM DATA LAYER, CORE LOGIC, OFFLINE & STATE (TV2 & GIAO THOA)

*(Kể cả bạn là TV1, Thầy Vinh vẫn có thể hỏi bạn các đoạn mã này! Hãy nắm chắc các câu trả lời sau)*

#### 📄 File 14: `src/utils/dateUtils.ts`
- **Chức năng**: Xử lý ngày giờ chuẩn múi giờ địa phương (`startOfDay`, `isDueTomorrow`, `isDueWithin48Hours`).
- ❓ **Thầy hỏi**: *"Tại sao hàm `isDueTomorrow()` lại cần dùng hàm `startOfDay()` thay vì lấy Date.now() + 24h?"*
  - 🗣️ **Trả lời**: *"Dạ thưa Thầy, nếu chỉ cộng 24 giờ đơn thuần, một bài tập nộp vào lúc 08:00 sáng ngày mai nhưng khi sinh viên mở app lúc 23:30 tối nay kiểm tra thì khoảng cách chỉ là 8.5 tiếng (chưa đủ 24 tiếng), hệ thống sẽ không nhận diện là ngày mai.
    Bằng cách dùng `startOfDay()`, ta đưa cả ngày hôm nay và ngày đến hạn về mốc 00:00:00 của ngày theo lịch. Sau đó chỉ cần so sánh ngày theo lịch (Calendar Date). Nhờ đó, bất kể sinh viên mở app lúc 08:00 sáng hay 23:30 đêm, kết quả 'Hạn nộp ngày mai' luôn đồng nhất 100%."*

---

#### 📄 File 15: `src/utils/statsUtils.ts`
- **Chức năng**: Tính toán tiến độ môn học động (`computeCourseProgress`).
- ❓ **Thầy hỏi**: *"Tại sao không lưu cột percentage tiến độ vào Database mà phải dùng hàm này tính động?"*
  - 🗣️ **Trả lời**: *"Dạ thưa Thầy, đây là áp dụng LUẬT COMPUTED DATA. Tiến độ hoàn thành là một giá trị dẫn xuất (derived state). Nếu lưu cứng cột percentage trong Database, mỗi khi sinh viên thêm bài tập mới, sửa hạn nộp, xóa bài hoặc tick đổi trạng thái hoàn thành, ta sẽ phải đồng bộ lại trường percentage này ở nhiều nơi, rất dễ gây ra lệch dữ liệu (data inconsistency). Do đó, nhóm chỉ lưu danh sách bài tập, còn tiến độ sẽ được hàm `computeCourseProgress()` tính toán trực tiếp mỗi khi render."*

---

#### 📄 File 16: `src/hooks/useAssignments.ts`
- **Chức năng**: TanStack Query + **Cập nhật lạc quan (Optimistic Updates)** + **Bộ nhớ đệm ngoại tuyến (Offline Cache)**.
- ❓ **Thầy hỏi**: *"Cập nhật lạc quan (Optimistic update) trong code của nhóm hoạt động ra sao nếu rớt mạng?"*
  - 🗣️ **Trả lời**: *"Dạ thưa Thầy, trong hàm `useToggleAssignment`:
    1. Khi người dùng bấm nút: Sự kiện `onMutate` chạy trước tiên. Nó chụp lại bản sao dữ liệu cũ (`previous = getQueryData`), sau đó ép giao diện đổi sang trạng thái mới ngay lập tức để người dùng không phải chờ mạng.
    2. Nếu rớt mạng hoặc API ném ra lỗi: Hàm `onError` được kích hoạt. Nó lấy bản sao `context.previous` đã lưu ở bước 1 để rollback (khôi phục lại trạng thái cũ) trên giao diện.
    3. Cuối cùng: Hàm `onSettled` gọi `invalidateQueries` để đồng bộ lại dữ liệu chuẩn xác với máy chủ."*
- ❓ **Thầy hỏi**: *"Khi điện thoại bị ngắt WiFi/4G, làm sao ứng dụng vẫn mở lên và hiển thị được bài tập?"*
  - 🗣️ **Trả lời**: *"Dạ trong hàm `fetchAssignments()`, mỗi khi tải dữ liệu thành công từ Remote API, em lưu toàn bộ dữ liệu vào `AsyncStorage` bằng key `cached_assignments_list` kèm mốc thời gian lưu `cached_assignments_timestamp`. Khi mất mạng, khối `catch` sẽ bắt lỗi mạng và đọc ngược dữ liệu từ `AsyncStorage` lên hiển thị."*

---

#### 📄 File 17: `src/components/ui/StateHandler.tsx`
- **Chức năng**: Xử lý đủ 4 trạng thái: Loading, Error with retry, Empty, Content.
- ❓ **Thầy hỏi**: *"Tại sao phải bọc `StateHandler` ở mọi màn hình?"*
  - 🗣️ **Trả lời**: *"Dạ để đảm bảo ứng dụng không bao giờ bị đứng màn hình hoặc văng app. Khi đang tải thì có vòng xoay Loading; khi mất mạng thì hiện thông báo lỗi kèm nút 'Thử lại' gọi hàm `refetch()`; khi danh sách rỗng thì hiện thông báo thân thiện; khi có dữ liệu thì render nội dung chính."*

---

#### 📄 File 18: `app/_layout.tsx` (Root Layout)
- **Chức năng**: Cấu hình gốc toàn bộ app.
- ❓ **Thầy hỏi**: *"Tại sao `QueryClientProvider` và `useNotificationListener` lại được đặt trong Root Layout?"*
  - 🗣️ **Trả lời**: *"Dạ thưa Thầy, Root Layout (`app/_layout.tsx`) là component cha cao nhất tồn tại xuyên suốt vòng đời của app và không bao giờ bị unmount khi chuyển màn hình. Đặt `QueryClientProvider` ở đây giúp toàn bộ màn hình con đều dùng chung một bộ nhớ đệm cache. Đặt `useNotificationListener` ở đây giúp app luôn sẵn sàng bắt sự kiện bấm vào thông báo từ thanh trạng thái điện thoại dù người dùng đang đứng ở bất kỳ màn hình nào."*

---

## PHẦN 4: KỊCH BẢN 10 CÂU HỎI "BẪY GÓC" KHÓ NHẰN CỦA THẦY VINH

### Câu 1: "Tại sao token phiên đăng nhập (Auth Session) không lưu vào AsyncStorage cho tiện mà phải dùng SecureStore?"
- **Trả lời**: `AsyncStorage` lưu dữ liệu dưới dạng văn bản thuần (Plain text) không mã hóa trên bộ nhớ máy, nếu điện thoại bị root/jailbreak hoặc cài ứng dụng độc hại thì token rất dễ bị đánh cắp. `SecureStore` sử dụng phần cứng bảo mật Keychain (trên iOS) và KeyStore (trên Android) có mã hóa AES chuẩn bảo mật cấp hệ điều hành.

### Câu 2: "Tại sao các nút bấm trong app của nhóm không dùng thẻ Button có sẵn của React Native?"
- **Trả lời**: Thẻ `<Button>` mặc định của React Native không thể tùy biến giao diện linh hoạt (màu nền, bo góc, viền) và không đảm bảo đồng bộ được tiêu chuẩn kích thước tối thiểu 44x44 pt trên cả 2 nền tảng iOS và Android. Tạo `AccessibleButton` từ `TouchableOpacity` giúp kiểm soát 100% kích thước trợ năng và màu sắc Design System.

### Câu 3: "Khi người dùng tick bài tập đã hoàn thành thì thứ tự trên widget Due48h có thay đổi không?"
- **Trả lời**: Có thay đổi ngay lập tức thưa Thầy. Vì widget `Due48hWidget` có điều kiện lọc `item.status === 'pending'`. Khi tick hoàn thành, trạng thái chuyển sang `'completed'`, bài tập đó sẽ tự động biến mất khỏi danh sách 48h tới.

### Câu 4: "Tại sao dùng TanStack Query rồi mà dự án vẫn cần Zustand?"
- **Trả lời**: Để phân tách rõ ràng phạm vi của State (Separation of Concerns):
  - **TanStack Query**: Quản lý **Server State** (dữ liệu từ máy chủ API: danh sách bài tập, môn học, cache, re-fetch, retry).
  - **Zustand**: Quản lý **Client State** (trạng thái nội bộ phía máy khách: phiên đăng nhập của người dùng, token, các bộ lọc đang chọn).

### Câu 5: "Nếu mạng bị chập chờn (lúc có lúc mất) thì TanStack Query xử lý ra sao?"
- **Trả lời**: Trong `app/_layout.tsx`, nhóm đã cấu hình `retry: 2`. Khi gọi API thất bại, TanStack Query sẽ tự động thử kết nối lại 2 lần nữa với thuật toán Exponential Backoff (tăng dần thời gian chờ giữa các lần thử) trước khi ném ra lỗi `isError` cho `StateHandler`.

### Câu 6: "Màn hình 404 hoạt động như thế nào khi người dùng nhận một thông báo có assignmentId bị sai hoặc đã bị xóa?"
- **Trả lời**: Khi người dùng nhấn vào thông báo có `assignmentId` không tồn tại, Expo Router sẽ mở màn hình `/assignments/[id]`. Tại đây, hàm tìm kiếm `assignments.find(a => a.id === id)` sẽ trả về `undefined`. Màn hình chi tiết bắt được trường hợp này và hiển thị thông báo lỗi thân thiện *"Không tìm thấy bài tập này"*.

### Câu 7: "Tại sao không dùng thư viện Date-fns hay Moment.js mà lại tự viết dateUtils?"
- **Trả lời**: Các thư viện như Moment.js có dung lượng rất nặng làm tăng kích thước bundle của ứng dụng di động. Tự viết `dateUtils.ts` với các hàm thuần JavaScript (`startOfDay`, `getTime`) vừa giúp app siêu nhẹ, vừa giải quyết chính xác 100% bài toán timezone của đề tài.

### Câu 8: "Khi nào thì ảnh chụp bài tập được tải lên server và lưu ở dạng gì?"
- **Trả lời**: Sinh viên dùng `ImagePicker.launchImageLibraryAsync()` để chọn ảnh. Ảnh được lưu đường dẫn tạm cục bộ `photoUri`. Khi bấm nút "Lưu bài tập", mutation gửi object chứa trường `photoUri` này lên server MockAPI lưu trữ.

### Câu 9: "Làm thế nào để ứng dụng phân biệt được người dùng đang dùng Dark Mode hay Light Mode?"
- **Trả lời**: Thông qua hook `useThemeColor()`. Hook này gọi `useColorScheme()` của React Native để đọc trực tiếp cấu hình giao diện của hệ thống điện thoại và trả về bộ mã màu tương ứng.

### Câu 10: "Thầy thấy repo có thư mục `__tests__`. Hãy chạy test cho Thầy xem và giải thích kết quả?"
- **Hành động**: Mở Terminal gõ:
  ```bash
  npm test
  ```
- **Giải thích**: *"Dạ thưa Thầy, bộ test kiểm thử tự động 3 ca kiểm thử của `AccessibleButton` và `AssignmentCard`: kiểm tra chuẩn trợ năng 44x44 pt, role button, checkbox và sự kiện tick hoàn thành bài. Kết quả 3/3 ca kiểm thử đều PASS trong 5.9 giây."*

---

## PHẦN 5: BẢNG TRA CỨU NHANH: THẦY HỎI GÌ -> MỞ NGAY DÒNG NÀO

| Thầy Vinh hỏi chủ đề | Tên file cần mở ngay | Dòng code trọng tâm |
| :--- | :--- | :--- |
| **Bảng màu Light / Dark** | `src/constants/tokens.ts` | Dòng 34 – 95 |
| **Kích thước trợ năng 44x44 pt** | `src/constants/tokens.ts`<br>`src/components/ui/AccessibleButton.tsx` | Dòng 108 – 113 (`TouchTarget`)<br>Dòng 107 – 123 (`styles.button`) |
| **Đổi theme sáng tối tự động** | `src/hooks/useThemeColor.ts` | Dòng 48 – 54 |
| **Gạch ngang tiêu đề bài tập** | `src/components/features/AssignmentCard.tsx` | Dòng 102 – 107 (`textDecorationLine`) |
| **Ô Checkbox trợ năng 44x44** | `src/components/features/AssignmentCard.tsx` | Dòng 137 – 150 & 195 – 205 |
| **Lọc deadline trong 48 giờ tới** | `src/components/features/Due48hWidget.tsx` | Dòng 49 – 54 (`dueSoonTasks`) |
| **Thuật toán sinh 7 ngày tuần** | `src/components/features/WeeklyCalendar.tsx` | Dòng 48 – 65 (`getWeekDays`) |
| **Deep Linking từ Notification** | `src/hooks/useNotifications.ts` | Dòng 86 – 107 (`useNotificationListener`) |
| **Chuyển đổi List View & Weekly** | `app/(app)/(tabs)/schedule.tsx` | Dòng 51 (`viewMode`) & 172 – 218 |
| **Trang lỗi 404** | `app/+not-found.tsx` | Dòng 40 – 63 |
| **Bộ kiểm thử Component Test** | `__tests__/AssignmentCard.test.tsx` | Dòng 58 – 144 |
| **Hàm startOfDay (Date/Timezone)** | `src/utils/dateUtils.ts` | Dòng 35 – 39 (`startOfDay`) |
| **Tính tiến độ môn học (Computed)** | `src/utils/statsUtils.ts` | Dòng 40 – 58 (`computeCourseProgress`) |
| **Optimistic Updates & Rollback** | `src/hooks/useAssignments.ts` | Dòng 46 – 83 (`onMutate`, `onError`) |
| **Offline Cache AsyncStorage** | `src/hooks/useAssignments.ts` | Dòng 17 – 35 (`fetchAssignments`) |
| **Xử lý 4 trạng thái màn hình** | `src/components/ui/StateHandler.tsx` | Dòng 39 – 78 |

---

> 💡 **LỜI KHUYÊN CUỐI CÙNG CHO 2 BẠN**:  
> Trước giờ bảo vệ, hãy cùng nhau mở tài liệu này và hỏi - đáp chéo cho nhau 1 lần. Chúc 2 bạn bảo vệ tự tin, trả lời lưu loát và đạt điểm tuyệt đối 10/10 môn Lập trình Mobile của Thầy Nguyễn Xuân Vinh! 🌟
