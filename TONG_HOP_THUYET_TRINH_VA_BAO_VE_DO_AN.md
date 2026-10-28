# ĐỀ TÀI 01: ỨNG DỤNG QUẢN LÝ KẾ HOẠCH HỌC TẬP (STUDY PLANNER)
## TÀI LIỆU TOÀN DIỆN THUYẾT MINH, DEMO & VẤN ĐÁP BẢO VỆ ĐỒ ÁN
### (MASTER SPECIFICATION: DEMO GUIDE, ARCHITECTURE & CODEBASE WALKTHROUGH)

> **Môn học**: Lập trình Mobile (Mã học phần: TH7011101 - Lớp: 23DTH1)  
> **Đơn vị đào tạo**: Trường Đại học Công nghệ Đồng Nai (DNTU) — Khoa Công nghệ Thông tin  
> **Giảng viên hướng dẫn & chấm thi**: **Thầy Nguyễn Xuân Vinh**  
> **Sinh viên thực hiện**:  
> - **Trần Bảo Trâm — MSSV: 1923050181 (Thành viên 1: Lead UI/UX, Design Tokens, Navigation, Lịch tuần, Notifications)**  
> - **Nguyễn Thị Hương Giang — MSSV: 1923051154 (Thành viên 2: Lead Data Layer, Zustand, SecureStore, TanStack Query, Offline Cache, Logic & Tests)**  
> **Phiên bản**: Release v1.0.0 — Tháng 10/2026 | **Kho mã nguồn Git**: [https://github.com/giangnguyen2110/Study_Planner.git](https://github.com/giangnguyen2110/Study_Planner.git)  

---

## PHẦN 1: HƯỚNG DẪN DEMO THỰC TẾ & BẢN ĐỒ TƯƠNG TÁC

### 1.1 Bảng Tài Khoản & Mật Khẩu Đăng Nhập Demo
- **Nút 1-Click Demo (Khuyên dùng)**: Bấm nút `⚡ Đăng nhập nhanh (Tài khoản SV)` tại màn hình đăng nhập để vào thẳng Trang chủ.
- **Tài khoản nhập tay**: Email `1923051154@dntu.edu.vn` (hoặc email bất kỳ), Mật khẩu `123456`.
- **Nơi lưu trữ**: Mã hóa phần cứng qua `expo-secure-store` tại `src/store/authStore.ts`.

### 1.2 Bản Đồ 10 Điểm Tương Tác Demo Trực Tiếp Trên App
| STT | Tính năng tương tác Demo | Thao tác thực tế trên màn hình | File UI & File Logic |
| :---: | :--- | :--- | :--- |
| 01 | **Màn hình Đăng nhập & Quản lý Phiên (Auth Session)** | Bấm nút '⚡ Đăng nhập nhanh (Tài khoản SV)' để vào Trang chủ ngay lập tức (không cần gõ phím). | UI: `app/(auth)/sign-in.tsx`<br>Logic: `src/store/authStore.ts` |
| 02 | **Widget Khẩn Cấp 48 Giờ (48-Hour Deadline Widget)** | Tại Trang chủ (Tab 1), chỉ tay vào khối Banner trên cùng có huy hiệu 'GẤP' màu đỏ cam. | UI: `app/(app)/(tabs)/index.tsx`<br>Logic: `src/components/features/Due48hWidget.tsx
src/utils/dateUtils.ts` |
| 03 | **Cập Nhật Lạc Quan (Optimistic Update) & Checkbox >= 44x44pt** | Chạm vào ô checkbox tròn của bài tập: giao diện đổi trạng thái tức thì (0ms, chữ gạch ngang). | UI: `src/components/features/AssignmentCard.tsx`<br>Logic: `src/hooks/useAssignments.ts (hàm useToggleAssignment)` |
| 04 | **Lịch Học Tuần (Weekly Calendar T2 đến CN) & Chấm Tròn Trạng Thái** | Chuyển sang Tab 2 (Lịch học): Bấm vào các ngày trong dải lịch 7 ngày T2-CN có chấm đỏ cam. | UI: `app/(app)/(tabs)/schedule.tsx`<br>Logic: `src/components/features/WeeklyCalendar.tsx` |
| 05 | **Modal Tạo Bài Mới (Lịch Tháng ◀/▶, Chỉnh Giờ/Phút ±, Presets 23:59/17:00, Ảnh)** | Bấm nút dấu cộng '+' màu xanh: Chuyển tháng ◀/▶, chỉnh giờ phút bằng nút ±, bấm phím tắt 23:59, đính kèm ảnh. | UI: `app/(app)/modal/new-assignment.tsx`<br>Logic: `src/hooks/useAssignments.ts (hàm useCreateAssignment)` |
| 06 | **Nhắc Nhở Deadline & Deep Linking (Bấm Thông Báo Nhảy Vào Bài Tập)** | Mở chi tiết bài tập -> Bấm '🔔 Bật Nhắc Nhở Deadline' -> Sau 2s chạm vào thông báo -> App nhảy vào chi tiết kèm Banner. | UI: `app/(app)/assignments/[id].tsx`<br>Logic: `src/hooks/useNotifications.ts (triggerImmediateDemoNotification)
app/_layout.tsx (useNotificationListener)` |
| 07 | **Chế Độ Ngoại Tuyến (Offline Tolerance) & Banner Mốc Thời Gian Thực** | Tắt Wi-Fi / bật Offline: Banner hổ phách hiện trên đầu trang chủ kèm mốc giờ thực 'Lưu cục bộ lúc HH:MM:SS'. | UI: `src/components/ui/OfflineBanner.tsx`<br>Logic: `src/hooks/useAssignments.ts (useNetworkStore & AsyncStorage)` |
| 08 | **Tiến Độ Môn Học (%) - Derived State & Đăng Xuất** | Chuyển sang Tab 3 (Tiến độ): Xem thanh % đổi màu (cam <50%, xanh >80%) và bấm nút Đăng Xuất. | UI: `app/(app)/(tabs)/courses.tsx`<br>Logic: `src/utils/statsUtils.ts (computeCourseProgress O(N))
src/store/authStore.ts (signOut)` |
| 09 | **Đổi Giao Diện Sáng / Tối (Dark / Light Mode) & Luật Zero-Hex** | Tại Tab 3, bấm các nút '🌙 Tối', '☀️ Sáng', '⚙️ Hệ thống' để thấy toàn bộ giao diện đổi màu mượt mà. | UI: `app/(app)/(tabs)/courses.tsx`<br>Logic: `src/constants/tokens.ts (ThemeTokens)
src/hooks/useThemeColor.ts` |
| 10 | **Chạy Kiểm Thử Tự Động Jest (10/10 PASS) Cho Thầy Xem** | Mở Terminal gõ lệnh: npm test -> Kết quả xanh lá 10/10 PASS trên cả 3 test suites. | UI: `Terminal Command Line: npm test`<br>Logic: `__tests__/statsUtils.test.ts
__tests__/dateUtils.test.ts
__tests__/AssignmentCard.test.tsx` |

### 1.3 Kịch Bản Thao Tác Nhanh 6 Bước 'Bấm Đâu Trúng Đó'
1. **Bước 1 (Đăng nhập)**: Mở app -> Bấm `⚡ Đăng nhập nhanh` -> Vào Trang chủ ngay.
2. **Bước 2 (Trang chủ & 48h & Checkbox)**: Chỉ Widget 48h -> Tick thử 1 bài tập (Cập nhật lạc quan 0ms).
3. **Bước 3 (Lịch tuần)**: Sang Tab 2 -> Bấm các ngày có chấm đỏ cam -> Chuyển sang Danh sách.
4. **Bước 4 (Tạo bài & Ảnh)**: Bấm '+' -> Chuyển tháng ◀/▶, chỉnh giờ phút ±, bấm phím tắt 23:59, chọn ảnh -> Lưu.
5. **Bước 5 (Deep Linking)**: Bấm bài vừa tạo -> Bấm `🔔 Bật Nhắc Nhở Deadline` -> Sau 2s chạm thông báo -> App nhảy vào chi tiết kèm Banner.
6. **Bước 6 (Tiến độ & Dark Mode)**: Sang Tab 3 -> Giải thích Derived State % -> Bấm nút `🌙 Tối` (Dark Mode) -> Bấm Đăng xuất.

---

## PHẦN 2: CHUYÊN ĐỀ 12 VẤN ĐỀ KIẾN TRÚC & LƯU TRỮ DỮ LIỆU CỐT LÕI

### 📌 VẤN ĐỀ 01: DỮ LIỆU ĐĂNG NHẬP (AUTH TOKEN & SESSION) ĐƯỢC LƯU Ở ĐÂU? TẠI SAO CẤM DÙNG ASYNCSTORAGE?
- **Lĩnh vực chuyên sâu**: Bảo Mật Phần Cứng & Quản Trị Phiên (Security & Auth)
- **Thành viên phụ trách**: **Nguyễn Thị Hương Giang (TV2)**
- **Tiêu chuẩn đồ án đáp ứng**: Must-Have #5 (Auth State Management & Hardware Encryption)

#### 1. Vấn Đề Đặt Ra & Nguy Cơ Tiềm Ẩn:
Trong ứng dụng di động, việc lưu trữ token xác thực (JWT/Auth Token) quyết định trực tiếp tới an toàn tài khoản sinh viên. Nếu lưu sai chỗ, kẻ tấn công hoặc phần mềm độc hại có thể đánh cắp token để giả mạo người dùng.

#### 2. Dữ Liệu Được Lưu Ở Đâu & Công Nghệ Áp Dụng:
Nằm trong chip mã hóa phần cứng của thiết bị qua thư viện `expo-secure-store`:
- Trên iOS: Lưu trong Apple Keychain (mã hóa cấp hệ điều hành Secure Enclave).
- Trên Android: Lưu trong Android Keystore / KeyStore TEE (Trusted Execution Environment).
- File hiện thực: `src/store/authStore.ts`.

#### 3. Phản Biện Giải Pháp & Tại Sao Không Chọn Công Nghệ Khác:
TẠI SAO CẤM DÙNG ASYNCSTORAGE:
AsyncStorage lưu dữ liệu dưới dạng văn bản thô (Plaintext JSON) trong sandbox thư mục của app. Nếu điện thoại bị root (Android) hoặc jailbreak (iOS), hoặc bị mã độc đọc file hệ thống, token sẽ bị trích xuất dễ dàng (Lỗ hổng Plaintext Token Storage). Trong quá trình phát triển, AI từng đề xuất dùng AsyncStorage cho nhanh, nhưng nhóm đã chủ động BÁC BỎ đề xuất này và thay thế bằng `expo-secure-store`.

#### 4. Cơ Chế Hoạt Động & Điểm Nhấn Mã Nguồn:
- **`[Lưu token an toàn]`**: `await SecureStore.setItemAsync('auth_token', token);` mã hóa và cất giữ token vào phần cứng.
- **`[Survive App Restart]`**: Khi người dùng đóng hẳn app hoặc khởi động lại điện thoại, hàm `restoreSession()` tại Root Layout `app/_layout.tsx` tự động đọc lại token hợp lệ và duy trì phiên đăng nhập mà không bắt đăng nhập lại.
- **`[Đăng xuất an toàn]`**: `await SecureStore.deleteItemAsync('auth_token');` xóa sạch dấu vết mã hóa khi người dùng bấm Đăng xuất.

> **🗣️ Lời thoại thuyết trình mẫu:**
> *"Kính thưa Thầy, về vấn đề lưu trữ dữ liệu đăng nhập: Nhóm em tuyệt đối KHÔNG lưu token vào AsyncStorage như các đoạn mã trôi nổi trên mạng. Toàn bộ Auth Token và phiên đăng nhập được mã hóa qua `expo-secure-store`, tận dụng chip bảo mật phần cứng Keychain trên iOS và Keystore trên Android. Nhờ đó, ứng dụng vừa duy trì được phiên đăng nhập khi khởi động lại máy (Survive App Restart), vừa chống lại được mọi nguy cơ trích xuất token khi máy bị root."*

> **🎯 Bẫy vấn đáp của Thầy Nguyễn Xuân Vinh & Cách trả lời đạt điểm 10:**
> - **Thầy hỏi**: *"Nếu Thầy mở file hệ thống của điện thoại đã root ra xem, Thầy có đọc được token đăng nhập của app em không?"*
> - **Sinh viên trả lời**: *"Dạ thưa Thầy là KHÔNG THỂ ạ! Vì `expo-secure-store` lưu khóa và dữ liệu trong phần cứng bảo mật riêng (TEE / Secure Enclave) của chip xử lý điện thoại. Dữ liệu khi lưu đã được mã hóa bằng thuật toán cấp quân sự (AES-256), nên dù máy có bị root thì hacker cũng chỉ thấy chuỗi mã hóa vô nghĩa chứ không đọc được token gốc."*

---

### 📌 VẤN ĐỀ 02: DỮ LIỆU BÀI TẬP & MÔN HỌC (SERVER STATE) ĐƯỢC LƯU Ở ĐÂU? QUẢN LÝ VÒNG ĐỜI CACHE RA SAO?
- **Lĩnh vực chuyên sâu**: Dữ Liệu Mạng & Bộ Nhớ Đệm (Remote API & Caching)
- **Thành viên phụ trách**: **Nguyễn Thị Hương Giang (TV2)**
- **Tiêu chuẩn đồ án đáp ứng**: Must-Have #1, Kỹ thuật nâng cao (TanStack Query v5 Server State)

#### 1. Vấn Đề Đặt Ra & Nguy Cơ Tiềm Ẩn:
Nếu mỗi lần người dùng chuyển màn hình, ứng dụng lại gửi một request mạng lên server để lấy lại danh sách bài tập thì sẽ gây tốn băng thông, tiêu hao pin và làm giật lag giao diện (màn hình trắng loading liên tục).

#### 2. Dữ Liệu Được Lưu Ở Đâu & Công Nghệ Áp Dụng:
Được lưu trữ trong Bộ nhớ đệm RAM (In-Memory Cache) của TanStack Query v5 (`QueryClient`) thông qua Custom Hook `useAssignments()` và `useCourses()`.
- File cấu hình: `app/_layout.tsx` và `src/hooks/useAssignments.ts`.

#### 3. Phản Biện Giải Pháp & Tại Sao Không Chọn Công Nghệ Khác:
TẠI SAO DÙNG TANSTACK QUERY THAY VÌ REDUX/ZUSTAND CHO DỮ LIỆU MẠNG:
Redux hay Zustand chỉ là kho chứa tĩnh (Client Store). Nếu lưu dữ liệu mạng vào Zustand, ta phải tự viết thủ công logic chống gửi trùng request (Request Deduplication), tự tính thời gian hết hạn (Stale Time), tự viết hàm gọi lại khi mạng chập chờn (Retry Logic). TanStack Query là thư viện chuẩn công nghiệp chuyên trị Server State, tự động giải quyết toàn bộ các bài toán này chỉ với vài dòng cấu hình.

#### 4. Cơ Chế Hoạt Động & Điểm Nhấn Mã Nguồn:
- **`[Cấu hình QueryClient]`**: `retry: 2` (tự động thử lại 2 lần nếu mất kết nối mạng), `staleTime: 60000` (dữ liệu được xem là 'tươi mới' trong 1 phút, không fetch lại thừa thãi).
- **`[Background Refetch]`**: Khi người dùng mở lại app từ chạy ngầm hoặc kết nối mạng trở lại, TanStack Query tự động kéo dữ liệu mới ngầm dưới nền mà không làm gián đoạn trải nghiệm người dùng.
- **`[Query Key Separation]`**: Tách bạch khóa cache: `['assignments']` cho bài tập, `['courses']` cho môn học, `['assignments', id]` cho chi tiết bài tập.

> **🗣️ Lời thoại thuyết trình mẫu:**
> *"Dữ liệu bài tập và môn học được quản lý độc lập tại tầng Data Layer bằng TanStack Query v5. Dữ liệu được lưu trong bộ nhớ đệm RAM với thời gian tươi mới là 1 phút và cơ chế tự động thử lại 2 lần. Khi chuyển đổi qua lại giữa Trang chủ và Lịch học, dữ liệu xuất hiện ngay trong 0 mili-giây từ cache mà không cần hiển thị vòng xoay loading gây ức chế cho sinh viên."*

> **🎯 Bẫy vấn đáp của Thầy Nguyễn Xuân Vinh & Cách trả lời đạt điểm 10:**
> - **Thầy hỏi**: *"Tại sao trong app/_layout.tsx nhóm em lại bọc toàn bộ ứng dụng bằng QueryClientProvider?"*
> - **Sinh viên trả lời**: *"Dạ thưa Thầy, `app/_layout.tsx` là component gốc cao nhất của Expo Router, không bao giờ bị unmount trong suốt vòng đời của app. Đặt `QueryClientProvider` tại đây giúp toàn bộ các màn hình con ở bất kỳ đâu đều chia sẻ chung một thể hiện cache duy nhất, đảm bảo tính đồng nhất dữ liệu và duy trì bộ nhớ đệm liên tục."*

---

### 📌 VẤN ĐỀ 03: KHI MẤT MẠNG (OFFLINE), DỮ LIỆU ĐƯỢC LƯU Ở ĐÂU VÀ HOẠT ĐỘNG RA SAO?
- **Lĩnh vực chuyên sâu**: Dung Lỗi Ngoại Tuyến & Bộ Nhớ Đệm Cục Bộ (Offline Tolerance)
- **Thành viên phụ trách**: **Cả 2 Thành viên (TV2: AsyncStorage & Hook; TV1: OfflineBanner UI)**
- **Tiêu chuẩn đồ án đáp ứng**: Kỹ thuật nâng cao (Offline Tolerance & Real-time Timestamp)

#### 1. Vấn Đề Đặt Ra & Nguy Cơ Tiềm Ẩn:
Khi sinh viên vào phòng học mất sóng Wi-Fi hoặc tắt 4G, nếu ứng dụng báo lỗi đỏ hoặc sập màn hình thì sẽ ảnh hưởng nghiêm trọng đến việc ôn tập. Ứng dụng phải tự động thích ứng và bảo toàn dữ liệu ngoại tuyến.

#### 2. Dữ Liệu Được Lưu Ở Đâu & Công Nghệ Áp Dụng:
Được lưu trữ bền vững trong `@react-native-async-storage/async-storage` dưới 2 khóa định danh:
1. `cached_assignments_list`: Chuỗi JSON lưu toàn bộ mảng bài tập hiện tại.
2. `cached_assignments_timestamp`: Chuỗi thời gian thực tế dạng `HH:MM:SS` ghi nhận thời điểm lưu gần nhất.
- File hiện thực: `src/hooks/useAssignments.ts` và `src/components/ui/OfflineBanner.tsx`.

#### 3. Phản Biện Giải Pháp & Tại Sao Không Chọn Công Nghệ Khác:
TẠI SAO Ở ĐÂY LẠI DÙNG ASYNCSTORAGE MÀ KHÔNG DÙNG SECURESTORE:
Vì dữ liệu bài tập và danh sách hạn nộp là thông tin phi bảo mật (không phải mật khẩu hay thẻ tín dụng). `AsyncStorage` được thiết kế tối ưu cho việc đọc/ghi mảng dữ liệu JSON có kích thước lớn. Dùng SecureStore cho mảng dữ liệu lớn sẽ làm giảm tốc độ đọc ghi do chi phí giải mã phần cứng không cần thiết.

#### 4. Cơ Chế Hoạt Động & Điểm Nhấn Mã Nguồn:
- **`[Tự động sao lưu ngầm]`**: Mỗi khi TanStack Query tải thành công dữ liệu mới từ API, hàm `cacheAssignmentsOffline(data)` lập tức ghi đè bản sao mới nhất vào AsyncStorage.
- **`[Tự động chuyển nguồn khi mất mạng]`**: Khi phát hiện mất kết nối (qua trình lắng nghe mạng hoặc khi API văng lỗi), app lập tức đọc dữ liệu từ `loadCachedAssignments()` lên giao diện.
- **`[Mốc thời gian thực tế (Dynamic Timestamp)]`**: Khi mất mạng hoặc khi tick bài tập offline, app lấy `new Date().toLocaleTimeString('vi-VN')` và lưu vào `useNetworkStore`, kích hoạt `OfflineBanner` màu hổ phách hiển thị chính xác thời gian thực tế.

> **🗣️ Lời thoại thuyết trình mẫu:**
> *"Kính thưa Thầy, cơ chế ngoại tuyến của nhóm em hoạt động hoàn toàn tự động. Khi mất mạng, app không hề bị đơ mà lập tức chuyển sang đọc bản sao lưu trữ trong AsyncStorage. Đồng thời, một thanh Banner màu hổ phách xuất hiện trên đầu trang chủ thông báo: 'Đang ở chế độ ngoại tuyến. Dữ liệu đã lưu cục bộ lúc HH:MM:SS'. Mốc thời gian này được ghi nhận theo thời gian thực tế của thiết bị, tạo sự minh bạch tuyệt đối."*

> **🎯 Bẫy vấn đáp của Thầy Nguyễn Xuân Vinh & Cách trả lời đạt điểm 10:**
> - **Thầy hỏi**: *"Làm thế nào để ứng dụng tự nhận biết được thiết bị vừa bị mất mạng để chuyển sang chế độ offline?"*
> - **Sinh viên trả lời**: *"Dạ thưa Thầy, trong `src/hooks/useAssignments.ts`, nhóm kết hợp 2 kỹ thuật: Trên nền tảng Web, hook lắng nghe sự kiện `window.addEventListener('offline')` và `online`. Trên nền tảng Mobile, hook chủ động bắt lỗi `Network request failed` trong khối `queryFn`. Khi có lỗi, hàm sẽ lập tức set cờ `setIsOffline(true)` và nạp ngay dữ liệu từ AsyncStorage lên màn hình."*

---

### 📌 VẤN ĐỀ 04: CẬP NHẬT LẠC QUAN (OPTIMISTIC UPDATE) KHI TICK BÀI TẬP HOẠT ĐỘNG THẾ NÀO? NẾU SERVER LỖI THÌ SAO?
- **Lĩnh vực chuyên sâu**: Trải Nghiệm Người Dùng Cao Cấp & Toàn Vẹn Dữ Liệu (UI & Consistency)
- **Thành viên phụ trách**: **Nguyễn Thị Hương Giang (TV2)**
- **Tiêu chuẩn đồ án đáp ứng**: Must-Have #1, Kỹ thuật nâng cao (Optimistic Mutation with Automatic Rollback)

#### 1. Vấn Đề Đặt Ra & Nguy Cơ Tiềm Ẩn:
Nếu người dùng bấm tick hoàn thành bài tập mà phải chờ 1-2 giây để server phản hồi mới thấy dấu tick đổi màu thì cảm giác sử dụng rất chậm chạp. Tuy nhiên, nếu đổi giao diện ngay mà server ném lỗi thì dữ liệu sẽ bị sai lệch.

#### 2. Dữ Liệu Được Lưu Ở Đâu & Công Nghệ Áp Dụng:
Xử lý trực tiếp trên bộ nhớ đệm cache của TanStack Query qua phương thức `queryClient.setQueryData(['assignments'], ...)` kết hợp với snapshot rollback.
- File hiện thực: `src/hooks/useAssignments.ts` (hàm `useToggleAssignment`).

#### 3. Phản Biện Giải Pháp & Tại Sao Không Chọn Công Nghệ Khác:
TẠI SAO PHẢI CÓ CƠ CHẾ ROLLBACK:
Nhiều bạn sinh viên chỉ dùng `useState` cục bộ để đổi trạng thái checkbox ngay lập tức nhưng bỏ qua bước xử lý lỗi mạng. Nếu rớt mạng hoặc API lỗi 500, checkbox trên máy sinh viên vẫn hiện 'Đã xong' nhưng trên server vẫn là 'Chưa xong', dẫn đến việc sinh viên tưởng đã nộp bài nhưng thực chất bị 0 điểm. Quy trình 3 bước của TanStack Query giải quyết triệt để lỗi này.

#### 4. Cơ Chế Hoạt Động & Điểm Nhấn Mã Nguồn:
- **`[Bước 1: onMutate]`**: Hủy bỏ mọi truy vấn ngầm đang chạy (`cancelQueries`). Chụp lại bản sao hiện tại của danh sách bài tập lưu vào biến `previous`. Ghi đè trạng thái `completed: !completed` lên cache UI ngay lập tức (phản hồi trong 0ms).
- **`[Bước 2: onError]`**: Nếu request API thất bại hoặc mất mạng, hàm `onError` lập tức lấy bản sao `previous` ghi đè lại vào cache, đưa ô checkbox quay về trạng thái cũ (Rollback tự động).
- **`[Bước 3: onSettled]`**: Khi request kết thúc (dù thành công hay thất bại), gọi `invalidateQueries` để đồng bộ lại dữ liệu chuẩn xác nhất từ server.

> **🗣️ Lời thoại thuyết trình mẫu:**
> *"Thao tác tick hoàn thành bài tập của nhóm áp dụng kỹ thuật Cập nhật lạc quan (Optimistic Update). Khi sinh viên chạm vào checkbox, giao diện đổi trạng thái trong 0 mili-giây. Nhưng điểm đắt giá nhất là cơ chế Rollback tự động: nếu đường truyền mạng bị ngắt đột ngột, hệ thống sẽ tự động hoàn tác checkbox về trạng thái cũ và báo lỗi, đảm bảo dữ liệu hiển thị không bao giờ sai lệch với server."*

> **🎯 Bẫy vấn đáp của Thầy Nguyễn Xuân Vinh & Cách trả lời đạt điểm 10:**
> - **Thầy hỏi**: *"Em hãy chỉ rõ trong code đoạn nào thực hiện việc chụp ảnh snapshot và đoạn nào thực hiện rollback?"*
> - **Sinh viên trả lời**: *"Dạ thưa Thầy, trong file `src/hooks/useAssignments.ts`: Tại dòng 140 hàm `onMutate`, lệnh `const previous = queryClient.getQueryData(['assignments'])` chính là bước chụp ảnh snapshot. Còn tại dòng 165 hàm `onError`, lệnh `queryClient.setQueryData(['assignments'], context.previous)` chính là bước phục hồi snapshot để rollback giao diện."*

---

### 📌 VẤN ĐỀ 05: TIẾN ĐỘ MÔN HỌC (%) ĐƯỢC LƯU Ở ĐÂU TRONG DATABASE? TẠI SAO LÀ DERIVED STATE?
- **Lĩnh vực chuyên sâu**: Kiến Trúc Dữ Liệu Dẫn Xuất (Data Architecture & Derived State)
- **Thành viên phụ trách**: **Nguyễn Thị Hương Giang (TV2)**
- **Tiêu chuẩn đồ án đáp ứng**: Must-Have #6, Luật Dữ Liệu Dẫn Xuất (Derived Data Law)

#### 1. Vấn Đề Đặt Ra & Nguy Cơ Tiềm Ẩn:
Màn hình Tiến độ môn học cần hiển thị: Tổng số bài, Số bài đã xong, và Tỉ lệ phần trăm hoàn thành (%) của từng môn. Câu hỏi đặt ra là: Có nên tạo thêm cột `percentage` trong bảng Môn học trên Database không?

#### 2. Dữ Liệu Được Lưu Ở Đâu & Công Nghệ Áp Dụng:
HOÀN TOÀN KHÔNG LƯU TRONG DATABASE HOẶC API!
- Bản chất: Đây là **Derived State (Dữ liệu dẫn xuất)**.
- Vị trí tính toán: Được tính toán động (dynamically computed) ở phía Client bằng hàm thuần túy `computeCourseProgress(assignments, courseId)`.
- File hiện thực: `src/utils/statsUtils.ts` và được gọi tại `app/(app)/(tabs)/courses.tsx`.

#### 3. Phản Biện Giải Pháp & Tại Sao Không Chọn Công Nghệ Khác:
TẠI SAO KHÔNG LƯU CỘT PERCENTAGE VÀO DATABASE:
Nếu lưu cứng cột `percentage` vào DB, mỗi khi người dùng: thêm bài mới, tick hoàn thành bài, xóa bài, hoặc sửa môn học, hệ thống bắt buộc phải gửi câu lệnh UPDATE để tính lại cột này. Trong môi trường di động mạng chập chờn, việc cập nhật nhiều bảng cùng lúc rất dễ bị lỗi bất đồng bộ (Data Inconsistency). Hơn nữa, nếu API trả về `percentage: 80%` nhưng thực tế sinh viên đếm chỉ có 2/4 bài thì sẽ gây mất lòng tin. Tính toán động $O(N)$ từ mảng bài tập gốc đảm bảo tiến độ luôn đúng 100%.

#### 4. Cơ Chế Hoạt Động & Điểm Nhấn Mã Nguồn:
- **`[Thuật toán O(N) thuần túy]`**: Lọc các bài tập thuộc `courseId`, đếm `total` và `completed` trong đúng 1 lượt duyệt mảng.
- **`[Xử lý an toàn phép chia cho 0]`**: Nếu môn học chưa có bài tập nào (`total === 0`), hàm trả về ngay số `0%`, ngăn chặn hoàn toàn lỗi toán học chia cho 0 sinh ra giá trị `NaN` làm vỡ giao diện.
- **`[Làm tròn chuẩn xác]`**: Dùng `Math.round((completed / total) * 100)` cho ra số nguyên đẹp mắt.

> **🗣️ Lời thoại thuyết trình mẫu:**
> *"Kính thưa Thầy, nhóm em tuân thủ nghiêm ngặt nguyên lý kiến trúc phần mềm: 'Single Source of Truth' và 'Derived State'. Tỉ lệ phần trăm tiến độ môn học hoàn toàn không lưu cứng trong database. Nó được tính toán động tức thời thông qua hàm thuần túy `computeCourseProgress()`. Bất cứ khi nào có thay đổi ở danh sách bài tập, tiến độ các môn học sẽ tự động nhảy số chính xác mà không sợ bị lệch dữ liệu."*

> **🎯 Bẫy vấn đáp của Thầy Nguyễn Xuân Vinh & Cách trả lời đạt điểm 10:**
> - **Thầy hỏi**: *"Nếu một sinh viên có 10,000 bài tập thì việc tính toán động O(N) trên máy điện thoại có bị giật lag không?"*
> - **Sinh viên trả lời**: *"Dạ thưa Thầy, một sinh viên trong một học kỳ thường chỉ có từ vài chục đến tối đa vài trăm bài tập. Một vòng lặp mảng vài trăm phần tử trong JavaScript chỉ mất chưa đầy 0.1 mili-giây trên CPU điện thoại. Kể cả với 10,000 phần tử, độ phức tạp $O(N)$ vẫn chạy trong vài mili-giây và có thể tối ưu thêm bằng `useMemo`. Do đó giải pháp tính toán động vừa tuyệt đối chính xác vừa đạt hiệu năng vượt trội."*

---

### 📌 VẤN ĐỀ 06: ẢNH CHỤP BÀI TẬP ĐÍNH KÈM (PHOTO ATTACHMENT) ĐƯỢC LƯU Ở ĐÂU VÀ XỬ LÝ RA SAO?
- **Lĩnh vực chuyên sâu**: Quản Trị Tệp Đa Phương Tiện (Media & File Management)
- **Thành viên phụ trách**: **Cả 2 Thành viên (TV1: ImagePicker UI; TV2: URI Data Model)**
- **Tiêu chuẩn đồ án đáp ứng**: Kỹ thuật nâng cao (Camera & Image Attachment via expo-image-picker)

#### 1. Vấn Đề Đặt Ra & Nguy Cơ Tiềm Ẩn:
Khi sinh viên chụp ảnh bài tập trên bảng hoặc chụp trang vở đính kèm vào ứng dụng, việc lưu trữ ảnh phải đảm bảo tốc độ mở app mượt mà và không làm tràn bộ nhớ điện thoại.

#### 2. Dữ Liệu Được Lưu Ở Đâu & Công Nghệ Áp Dụng:
Được lưu trữ dưới dạng **Đường dẫn cục bộ (Local File URI: `file:///...`)** trong thư mục sandbox cache/documents của ứng dụng thông qua thư viện `expo-image-picker`.
- Thuộc tính mô hình: `photoUri?: string` trong `src/types/study.ts`.
- File hiện thực: `app/(app)/modal/new-assignment.tsx` và `app/(app)/assignments/[id].tsx`.

#### 3. Phản Biện Giải Pháp & Tại Sao Không Chọn Công Nghệ Khác:
TẠI SAO KHÔNG CHUYỂN ẢNH THÀNH CHUỖI BASE64 ĐỂ LƯU VÀO STATE/DATABASE:
Một bức ảnh chụp điện thoại dung lượng 3-5MB khi chuyển sang Base64 sẽ sinh ra chuỗi văn bản dài hàng triệu ký tự. Nếu lưu chuỗi này vào Zustand State hoặc AsyncStorage sẽ làm nghẽn RAM, làm chậm tiến trình JSON parse và gây lag giật giao diện nghiêm trọng. Lưu đường dẫn tệp (`file:///...`) chỉ tốn vài chục byte bộ nhớ, ảnh được tải trực tiếp từ đĩa bằng native bridge mượt mà.

#### 4. Cơ Chế Hoạt Động & Điểm Nhấn Mã Nguồn:
- **`[ImagePicker Options]`**: Cấu hình `mediaTypes: ImagePicker.MediaTypeOptions.Images`, `allowsEditing: true`, `quality: 0.7` để nén ảnh vừa đủ sắc nét mà không tốn dung lượng.
- **`[Xem trước ảnh (Photo Preview)]`**: Hiển thị ảnh thumbnail ngay trong Modal tạo bài và hiển thị banner ảnh lớn ở màn hình chi tiết bài tập `assignments/[id].tsx`.
- **`[Thuộc tính tùy chọn (Optional)]`**: Trường `photoUri` là optional (`?`), nếu sinh viên không đính kèm ảnh thì component vẫn render giao diện ghi chú bình thường mà không phát sinh lỗi.

> **🗣️ Lời thoại thuyết trình mẫu:**
> *"Chức năng đính kèm ảnh bài tập sử dụng thư viện `expo-image-picker`. Nhóm em tối ưu bằng cách chỉ lưu đường dẫn tệp cục bộ (`photoUri`) với chất lượng nén 0.7 thay vì lưu chuỗi Base64 cồng kềnh. Điều này giúp dung lượng bộ nhớ app cực kỳ nhẹ, mở ảnh tức thì và bảo đảm hiệu năng tối đa cho thiết bị."*

> **🎯 Bẫy vấn đáp của Thầy Nguyễn Xuân Vinh & Cách trả lời đạt điểm 10:**
> - **Thầy hỏi**: *"Nếu người dùng từ chối cấp quyền truy cập Camera hoặc Thư viện ảnh thì app có bị crash không?"*
> - **Sinh viên trả lời**: *"Dạ thưa Thầy là KHÔNG ạ! Trước khi mở thư viện ảnh, hàm `ImagePicker.requestMediaLibraryPermissionsAsync()` sẽ kiểm tra quyền. Nếu người dùng từ chối cấp quyền, hàm sẽ trả về `status !== 'granted'` và app hiển thị thông báo nhẹ nhàng nhắc nhở chứ không hề bị văng ứng dụng."*

---

### 📌 VẤN ĐỀ 07: TẠI SAO KHÔNG BỊ LỖI MÚI GIỜ VÀ CHÊNH LỆCH GIỜ KHI TÍNH HẠN 48 GIỜ? (HÀM STARTOFDAY)
- **Lĩnh vực chuyên sâu**: Xử Lý Thời Gian & Múi Giờ (Date & Timezone Architecture)
- **Thành viên phụ trách**: **Nguyễn Thị Hương Giang (TV2)**
- **Tiêu chuẩn đồ án đáp ứng**: Must-Have #2, Luật Xử Lý Ngày & Múi Giờ

#### 1. Vấn Đề Đặt Ra & Nguy Cơ Tiềm Ẩn:
Một trong những bẫy lập trình phổ biến nhất trên di động là tính toán hạn chót bị sai lệch do chênh lệch giờ và ranh giới ngày theo lịch.

#### 2. Dữ Liệu Được Lưu Ở Đâu & Công Nghệ Áp Dụng:
Được xử lý bởi bộ hàm thuần túy tại `src/utils/dateUtils.ts` (hàm `startOfDay` và `isDueWithin48Hours`), được kiểm thử nghiêm ngặt bởi Jest test suite `__tests__/dateUtils.test.ts`.

#### 3. Phản Biện Giải Pháp & Tại Sao Không Chọn Công Nghệ Khác:
TẠI SAO KHÔNG DÙNG CÁCH CỘNG 48 GIỜ THUẦN TÚY (Date.now() + 48*60*60*1000):
Ví dụ: Sinh viên mở app lúc 23:30 đêm Thứ Hai để kiểm tra bài tập nộp vào lúc 08:00 sáng Thứ Tư (cách 32.5 tiếng). Nếu cộng trừ thuần túy theo mili-giây, khoảng cách có thể chưa tròn ngày hoặc bị vượt qua ranh giới múi giờ UTC. Bằng cách dùng hàm `startOfDay()`, toàn bộ mốc thời gian được đưa về `00:00:00.000` của ngày lịch địa phương, đảm bảo phép so sánh 'hôm nay', 'ngày mai', 'ngày mốt' luôn chính xác 100% không phụ thuộc vào giờ sinh viên mở app.

#### 4. Cơ Chế Hoạt Động & Điểm Nhấn Mã Nguồn:
- **`[Hàm startOfDay(date)]`**: Tạo một đối tượng Date mới, gán `setHours(0, 0, 0, 0)` để triệt tiêu toàn bộ yếu tố giờ, phút, giây, mili-giây thừa.
- **`[Cửa sổ trượt 48 giờ]`**: Thuật toán kiểm tra hạn nộp: ngày hết hạn phải $\ge$ hôm nay và $\le$ hôm nay + 2 ngày theo lịch dương.
- **`[Lọc bài chưa làm]`**: Widget 48h chỉ quét những bài `!completed && isDueWithin48Hours(dueDate)` để không làm phiền sinh viên với các bài đã nộp.

> **🗣️ Lời thoại thuyết trình mẫu:**
> *"Để giải quyết triệt để lỗi múi giờ và ranh giới ngày, nhóm em xây dựng hàm `startOfDay()`. Hàm này quy chuẩn mọi mốc thời gian về 00:00:00 của ngày lịch. Nhờ đó, tính năng cảnh báo hạn chót 48 giờ luôn hoạt động chuẩn xác dù sinh viên mở app vào sáng sớm hay lúc nửa đêm."*

> **🎯 Bẫy vấn đáp của Thầy Nguyễn Xuân Vinh & Cách trả lời đạt điểm 10:**
> - **Thầy hỏi**: *"Nếu thiết bị của sinh viên bị lệch múi giờ (ví dụ chuyển sang múi giờ Nhật Bản UTC+9) thì app tính hạn nộp thế nào?"*
> - **Sinh viên trả lời**: *"Dạ thưa Thầy, các chuỗi ngày trong app được lưu theo chuẩn ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`). Khi hàm `new Date(dateStr)` được gọi, JavaScript Engine trên điện thoại sẽ tự động chuyển đổi mốc giờ UTC đó về giờ địa phương của thiết bị hiện tại, kết hợp với `startOfDay` nên kết quả hiển thị luôn đúng theo ngày lịch nơi sinh viên đang sinh sống."*

---

### 📌 VẤN ĐỀ 08: CƠ CHẾ DEEP LINKING HOẠT ĐỘNG THẾ NÀO KHI BẤM VÀO THÔNG BÁO DEADLINE?
- **Lĩnh vực chuyên sâu**: Điều Hướng Động & Thông Báo Đẩy (Notifications & Deep Linking)
- **Thành viên phụ trách**: **Trần Bảo Trâm (TV1)**
- **Tiêu chuẩn đồ án đáp ứng**: Must-Have #4 (Expo Notifications & Deep Linking Navigation)

#### 1. Vấn Đề Đặt Ra & Nguy Cơ Tiềm Ẩn:
Khi thông báo deadline xuất hiện trên thanh trạng thái của điện thoại, nếu người dùng bấm vào mà app chỉ mở màn hình Trang chủ thì họ lại phải mất công tìm kiếm bài tập đó. Deep Linking phải đưa người dùng vào thẳng màn hình chi tiết bài tập.

#### 2. Dữ Liệu Được Lưu Ở Đâu & Công Nghệ Áp Dụng:
Được xử lý tại `src/hooks/useNotifications.ts` (lên lịch thông báo kèm payload) và `app/_layout.tsx` (lắng nghe sự kiện toàn cục), đích đến là `app/(app)/assignments/[id].tsx`.

#### 3. Phản Biện Giải Pháp & Tại Sao Không Chọn Công Nghệ Khác:
TẠI SAO ĐẶT LISTENER Ở ROOT LAYOUT THAY VÌ Ở TỪNG MÀN HÌNH:
Nếu đặt listener ở `index.tsx`, khi người dùng đang ở tab `schedule.tsx` hoặc `courses.tsx` mà bấm vào thông báo, listener sẽ không bắt được sự kiện hoặc bị unmount. Đặt `useNotificationListener()` ở `app/_layout.tsx` đảm bảo ứng dụng luôn đón nhận được sự kiện chạm thông báo ở mọi thời điểm.

#### 4. Cơ Chế Hoạt Động & Điểm Nhấn Mã Nguồn:
- **`[Lên lịch kèm Payload]`**: Trong hàm `scheduleAssignmentNotification`, object gửi đi có chứa thuộc tính `data: { assignmentId: item.id }`.
- **`[Bộ lắng nghe toàn cục]`**: Hook `useNotificationListener` đăng ký `Notifications.addNotificationResponseReceivedListener`.
- **`[Điều hướng Deep Link]`**: Khi sinh viên bấm vào thông báo, listener trích xuất `assignmentId` và gọi `router.push('/assignments/' + assignmentId + '?fromNotification=true')`.
- **`[Thanh Banner Hổ Phách]`**: Màn hình chi tiết kiểm tra cờ `fromNotification` để hiển thị thanh chào mừng màu hổ phách: 'Bạn đã mở bài tập này từ Thông báo / Deep Link'.

> **🗣️ Lời thoại thuyết trình mẫu:**
> *"File `useNotifications.ts` hiện thực cơ chế Deep Linking hoàn chỉnh. Khi thông báo deadline được lên lịch, nhóm gắn kèm mã định danh của bài tập vào payload. Khi Thầy chạm vào thông báo trên điện thoại, hệ điều hành sẽ kích hoạt listener tại Root Layout và tự động điều hướng thẳng vào màn hình chi tiết của bài tập đó kèm banner xác nhận màu hổ phách."*

> **🎯 Bẫy vấn đáp của Thầy Nguyễn Xuân Vinh & Cách trả lời đạt điểm 10:**
> - **Thầy hỏi**: *"Nếu người dùng bấm vào một thông báo của một bài tập đã bị xóa trước đó thì app xử lý thế nào?"*
> - **Sinh viên trả lời**: *"Dạ thưa Thầy, nhóm đã dự liệu trường hợp này: Khi điều hướng đến `/assignments/[id]`, hook `useAssignments()` sẽ tìm bài tập theo `id`. Nếu không tìm thấy, màn hình hiển thị trạng thái `StateHandler` thông báo 'Không tìm thấy bài tập' và cung cấp nút 'Quay về trang chủ', ứng dụng hoàn toàn không bị crash."*

---

### 📌 VẤN ĐỀ 09: BẢNG MÀU & CHẾ ĐỘ DARK/LIGHT MODE ĐƯỢC LƯU Ở ĐÂU? LUẬT ZERO-HEX HOẠT ĐỘNG RA SAO?
- **Lĩnh vực chuyên sâu**: Hệ Thống Thiết Kế & Quản Trị Giao Diện (Design System & Zero-Hex)
- **Thành viên phụ trách**: **Trần Bảo Trâm (TV1)**
- **Tiêu chuẩn đồ án đáp ứng**: Luật Zero-Hex & Single Source of Truth

#### 1. Vấn Đề Đặt Ra & Nguy Cơ Tiềm Ẩn:
Nếu viết trực tiếp mã màu hex `#FFFFFF` hay `#2563EB` rải rác trong hàng chục màn hình và component, khi muốn đổi màu thương hiệu hoặc hỗ trợ Dark Mode sẽ phải đi sửa từng file một, rất dễ sót và vỡ giao diện.

#### 2. Dữ Liệu Được Lưu Ở Đâu & Công Nghệ Áp Dụng:
Toàn bộ mã màu Hex được tập trung tại một nơi DUY NHẤT: `src/constants/tokens.ts` (Luật Zero-Hex). Cấu hình chế độ hiển thị (light/dark/system) của người dùng được lưu trong `useThemeStore` (Zustand).
- Cấp phát màu qua hook: `src/hooks/useThemeColor.ts`.

#### 3. Phản Biện Giải Pháp & Tại Sao Không Chọn Công Nghệ Khác:
LỢI ÍCH CỦA LUẬT ZERO-HEX:
1. *Single Source of Truth*: Đổi mã màu tại 1 dòng trong `tokens.ts` là toàn bộ ứng dụng tự đổi theo.
2. *Đồng bộ Dark Mode hoàn hảo*: Toàn bộ màu chữ (`ThemedText`), màu nền (`ThemedView`), màu thẻ và viền tự động đảo màu tương phản cao, bảo vệ mắt người dùng khi dùng ban đêm.
3. *Chuẩn mực công nghiệp*: Cách tiếp cận tương đồng với Design System của các tập đoàn lớn (Material Design của Google, Human Interface Guidelines của Apple).

#### 4. Cơ Chế Hoạt Động & Điểm Nhấn Mã Nguồn:
- **`[ThemeTokens Structure]`**: Phân chia rõ ràng `ThemeTokens.light` và `ThemeTokens.dark` với các tên ngữ nghĩa: `background`, `card`, `text`, `textSecondary`, `border`, `tint`, `urgent`.
- **`[useThemeColor Hook]`**: Tự động phát hiện chế độ màu của máy qua `useColorScheme()` hoặc thiết lập riêng trong `useThemeStore` để trả về đúng palette.
- **`[100% Zero-Hex Cam Kết]`**: Không có bất kỳ file JSX/TSX nào trong thư mục `app/` và `src/components/` chứa mã màu Hex thô.

> **🗣️ Lời thoại thuyết trình mẫu:**
> *"Dự án của nhóm em tuân thủ triệt để Luật Zero-Hex: Mã màu Hex chỉ xuất hiện tại duy nhất 1 file `tokens.ts`. Mọi component đều sử dụng mã màu ngữ nghĩa thông qua hook `useThemeColor()`. Khi Thầy chuyển điện thoại sang chế độ Dark Mode, toàn bộ giao diện từ chữ, nền, viền thẻ đến thanh tab bar đều tự động đồng bộ sang tone tối sang trọng mà không cần tải lại app."*

> **🎯 Bẫy vấn đáp của Thầy Nguyễn Xuân Vinh & Cách trả lời đạt điểm 10:**
> - **Thầy hỏi**: *"Thầy kiểm tra ngẫu nhiên thấy trong file component nào có mã hex thì nhóm giải thích sao?"*
> - **Sinh viên trả lời**: *"Dạ thưa Thầy, Thầy có thể dùng tính năng Search của VS Code quét toàn bộ thư mục `app/` và `src/components/` với từ khóa `#`: Nhóm cam đoan 100% không có mã màu hex nào ngoài file `src/constants/tokens.ts`. Mọi màu sắc đều được gọi qua Design Tokens chuẩn mực."*

---

### 📌 VẤN ĐỀ 10: TIÊU CHUẨN CÔNG THÁI HỌC VÙNG CHẠM (TOUCH TARGET >= 44X44PT) VÀ TRỢ NĂNG (ACCESSIBILITY)?
- **Lĩnh vực chuyên sâu**: Công Thái Học & Tiêu Chuẩn Trợ Năng (Ergonomics & WCAG 2.1 AA)
- **Thành viên phụ trách**: **Trần Bảo Trâm (TV1)**
- **Tiêu chuẩn đồ án đáp ứng**: Luật Trợ Năng (Accessibility) & Touch Target >= 44x44pt

#### 1. Vấn Đề Đặt Ra & Nguy Cơ Tiềm Ẩn:
Màn hình điện thoại có kích thước nhỏ, ngón tay người dùng có tiết diện tiếp xúc khoảng 8-10mm. Nếu thiết kế nút bấm quá nhỏ (ví dụ ô checkbox chỉ 16-20pt), người dùng sẽ liên tục bị bấm trượt, đặc biệt là người lớn tuổi hoặc người khiếm thị.

#### 2. Dữ Liệu Được Lưu Ở Đâu & Công Nghệ Áp Dụng:
Được quy định tại `TouchTarget.min = 44` trong `src/constants/tokens.ts` và áp dụng trên tất cả component tương tác:
- `src/components/ui/AccessibleButton.tsx`
- `src/components/features/AssignmentCard.tsx` (ô checkbox)
- `src/components/features/WeeklyCalendar.tsx` (ô chọn ngày)
- `app/(app)/(tabs)/_layout.tsx` (thanh Tab bar chiều cao 64pt).

#### 3. Phản Biện Giải Pháp & Tại Sao Không Chọn Công Nghệ Khác:
TẠI SAO BẮT BUỘC PHẢI LÀ 44X44PT:
Con số 44x44 point là tiêu chuẩn vàng được quy định chính thức trong Apple Human Interface Guidelines và Google Android Material Design. Nó tương đương với vùng tiếp xúc vật lý tối thiểu của đầu ngón tay cái người dùng. Ngoài ra, việc bổ sung `accessibilityRole` và `accessibilityLabel` giúp ứng dụng đạt chuẩn quốc tế WCAG 2.1 AA.

#### 4. Cơ Chế Hoạt Động & Điểm Nhấn Mã Nguồn:
- **`[minHeight & minWidth: 44]`**: Cố định trong style để kể cả khi nội dung bên trong chỉ là 1 icon nhỏ 16pt, vùng chạm xung quanh (hit area) vẫn được đệm đủ 44x44pt.
- **`[accessibilityRole]`**: Khai báo rõ ràng vai trò là `button` hoặc `checkbox` để phần mềm đọc màn hình nhận diện.
- **`[accessibilityLabel]`**: Cung cấp văn bản mô tả hành động (ví dụ: 'Đánh dấu hoàn thành bài tập Lập trình Mobile') để người khiếm thị nghe được qua tai nghe.
- **`[Automated Test]`**: Jest test suite `__tests__/AssignmentCard.test.tsx` tự động kiểm tra xác nhận vùng chạm đạt chuẩn >= 44pt.

> **🗣️ Lời thoại thuyết trình mẫu:**
> *"Về mặt công thái học người dùng, nhóm em hiện thực nghiêm ngặt Luật Trợ Năng: Tất cả các nút bấm, ô checkbox và từng ngày trên lịch đều có vùng chạm tối thiểu 44x44pt. Người dùng thao tác bằng một tay cực kỳ thoải mái và không bao giờ bị bấm trượt. Các nhãn trợ năng VoiceOver/TalkBack cũng được tích hợp đầy đủ."*

> **🎯 Bẫy vấn đáp của Thầy Nguyễn Xuân Vinh & Cách trả lời đạt điểm 10:**
> - **Thầy hỏi**: *"Làm thế nào để chứng minh ô checkbox của nhóm em đạt kích thước 44x44pt trong khi mắt nhìn thấy ô vuông chỉ khoảng 24pt?"*
> - **Sinh viên trả lời**: *"Dạ thưa Thầy, ô vuông checkbox có kích thước hiển thị thị giác là 24pt, nhưng nó được bọc bên trong một container `TouchableOpacity` có thuộc tính `minHeight: TouchTarget.min` (44pt) và `minWidth: TouchTarget.min` (44pt). Trong file `__tests__/AssignmentCard.test.tsx`, nhóm đã viết test case tự động kiểm tra thuộc tính style này và kết quả test báo PASS 100%."*

---

### 📌 VẤN ĐỀ 11: BỘ XỬ LÝ 4 TRẠNG THÁI (STATEHANDLER) GIẢI QUYẾT VẤN ĐỀ GÌ CỦA TRẢI NGHIỆM NGƯỜI DÙNG?
- **Lĩnh vực chuyên sâu**: Vòng Đời Giao Diện & Xử Lý Sự Cố (UI Lifecycle & Fault Tolerance)
- **Thành viên phụ trách**: **Nguyễn Thị Hương Giang (TV2)**
- **Tiêu chuẩn đồ án đáp ứng**: Luật 4 Trạng Thái (Loading, Empty, Error with working retry, Content)

#### 1. Vấn Đề Đặt Ra & Nguy Cơ Tiềm Ẩn:
Rất nhiều ứng dụng của sinh viên chỉ code trường hợp 'mọi thứ đều chạy tốt' (Happy Path). Khi gặp mạng chậm, mạng chập chờn hoặc danh sách chưa có dữ liệu, app sẽ bị trắng xóa hoặc đứng hình làm người dùng bối rối.

#### 2. Dữ Liệu Được Lưu Ở Đâu & Công Nghệ Áp Dụng:
Được đóng gói thành component dùng chung tại `src/components/ui/StateHandler.tsx` và được nhúng tại tất cả các màn hình nạp dữ liệu: `index.tsx`, `schedule.tsx`, `courses.tsx`.

#### 3. Phản Biện Giải Pháp & Tại Sao Không Chọn Công Nghệ Khác:
TẠI SAO BẮT BUỘC PHẢI CÓ NÚT THỬ LẠI (RETRY) HOẠT ĐỘNG THẬT:
Khi gặp lỗi mạng, nếu chỉ hiện dòng chữ 'Đã có lỗi xảy ra' thì người dùng bắt buộc phải tắt app đi mở lại từ đầu. Việc cung cấp nút 'Thử lại' gọi trực tiếp hàm `refetch()` giúp người dùng có thể kích hoạt tải lại dữ liệu ngay tại chỗ khi mạng vừa hồi phục, mang lại trải nghiệm chuẩn sản phẩm thương mại.

#### 4. Cơ Chế Hoạt Động & Điểm Nhấn Mã Nguồn:
- **`[1. Loading State]`**: Hiển thị vòng xoay `ActivityIndicator` màu thương hiệu kèm thông điệp đang tải.
- **`[2. Empty State]`**: Hiển thị icon hộp rỗng thân thiện kèm câu động viên khi sinh viên đã hoàn thành hết bài tập.
- **`[3. Error State with Working Retry]`**: Hiển thị icon cảnh báo lỗi và nút bấm `AccessibleButton` truyền hàm `onRetry` gọi thẳng `refetch()` của TanStack Query.
- **`[4. Content State]`**: Render nội dung chính của trang một cách mượt mà.

> **🗣️ Lời thoại thuyết trình mẫu:**
> *"Component `StateHandler.tsx` là lá chắn bảo vệ trải nghiệm người dùng của nhóm. Mọi màn hình tải dữ liệu đều bắt buộc đi qua 4 trạng thái: Đang tải, Danh sách trống, Báo lỗi có nút Thử lại thật sự, và Nội dung hoàn chỉnh. Nhờ đó, ứng dụng không bao giờ bị rơi vào trạng thái 'chết' hay màn hình trắng."*

> **🎯 Bẫy vấn đáp của Thầy Nguyễn Xuân Vinh & Cách trả lời đạt điểm 10:**
> - **Thầy hỏi**: *"Nếu mạng bị chập chờn cứ bật tắt liên tục thì nút Thử lại trong StateHandler hoạt động thế nào?"*
> - **Sinh viên trả lời**: *"Dạ thưa Thầy, khi bấm nút 'Thử lại', hàm `onRetry` gọi lệnh `refetch()` của TanStack Query. Nếu lần thử đó vẫn chưa có mạng, component lập tức duy trì ở trạng thái Error để người dùng bấm lại. Khi có mạng trở lại, chỉ cần bấm 'Thử lại' là dữ liệu lập tức được kéo về và tự động chuyển sang trạng thái Content."*

---

### 📌 VẤN ĐỀ 12: CHIẾN LƯỢC PHÂN TÁCH 4 VÙNG TRẠNG THÁI: CLIENT STATE VS SERVER STATE VS OFFLINE VS SECURE?
- **Lĩnh vực chuyên sâu**: Kiến Trúc Quản Trị Trạng Thái Toàn Cục (State Separation Architecture)
- **Thành viên phụ trách**: **Cả 2 Thành viên (TV1: Client State & UI; TV2: Server State & Secure Storage)**
- **Tiêu chuẩn đồ án đáp ứng**: Kiến trúc Phần mềm Chuyên Nghiệp (Separation of Concerns)

#### 1. Vấn Đề Đặt Ra & Nguy Cơ Tiềm Ẩn:
Một sai lầm kinh điển của các lập trình viên mới là dồn tất cả dữ liệu (từ token, dữ liệu API, biến theme, trạng thái checkbox) vào chung một kho lưu trữ (như Redux hoặc AsyncStorage), dẫn đến code bị phình to, rối rắm và khó bảo trì.

#### 2. Dữ Liệu Được Lưu Ở Đâu & Công Nghệ Áp Dụng:
Dự án Study Planner phân chia rành mạch thành 4 vùng trạng thái độc lập tương ứng với 4 công nghệ tối ưu nhất:
1. *Secure State*: `expo-secure-store` (Token xác thực).
2. *Server State*: TanStack Query v5 (Bài tập, Môn học từ API).
3. *Client State*: Zustand (Theme, Trạng thái đóng mở, Bộ lọc).
4. *Offline State*: AsyncStorage (Bản sao lưu trữ ngoại tuyến khi mất mạng).

#### 3. Phản Biện Giải Pháp & Tại Sao Không Chọn Công Nghệ Khác:
LỢI ÍCH CỦA VIỆC PHÂN TÁCH 4 VÙNG TRẠNG THÁI:
- *Đúng công cụ cho đúng việc (Best tool for the job)*: Không ép một thư viện phải làm những việc nó không giỏi.
- *Hiệu năng tối ưu*: Thay đổi trạng thái theme ở Client State không làm kích hoạt fetch lại dữ liệu Server State.
- *Bảo mật cao nhất*: Dữ liệu nhạy cảm được cô lập trong phần cứng mã hóa, không bị phơi nhiễm ra các tầng lưu trữ thông thường.

#### 4. Cơ Chế Hoạt Động & Điểm Nhấn Mã Nguồn:
- **`[Zustand (Client State)]`**: Quản lý trong `src/store/authStore.ts` (trạng thái đăng nhập) và `useThemeStore` (chế độ sáng tối). Rất nhẹ, không cần boilerplate.
- **`[TanStack Query (Server State)]`**: Quản lý trong `src/hooks/useAssignments.ts` và `useCourses.ts`. Tự động cache và đồng bộ.
- **`[AsyncStorage (Offline State)]`**: Quản lý bản sao lưu trữ JSON cục bộ kèm timestamp.
- **`[SecureStore (Secure State)]`**: Quản lý khóa bí mật và token đăng nhập.

> **🗣️ Lời thoại thuyết trình mẫu:**
> *"Điểm tự hào nhất về mặt kiến trúc của nhóm em là Chiến lược phân tách 4 vùng trạng thái (State Separation). Nhóm không dồn cục code mà phân chia rành mạch: Token lưu trong SecureStore mã hóa phần cứng; Dữ liệu API do TanStack Query quản lý cache; Trạng thái giao diện do Zustand phụ trách; và Bản sao ngoại tuyến lưu trong AsyncStorage. Cấu trúc này giúp mã nguồn cực kỳ trong sáng, dễ mở rộng và đạt chuẩn mực của các dự án phần mềm di động quy mô lớn."*

> **🎯 Bẫy vấn đáp của Thầy Nguyễn Xuân Vinh & Cách trả lời đạt điểm 10:**
> - **Thầy hỏi**: *"Tại sao nhóm em dùng cả Zustand lẫn TanStack Query mà không gộp chung vào 1 cái?"*
> - **Sinh viên trả lời**: *"Dạ thưa Thầy, vì bản chất của Client State và Server State là hoàn toàn khác nhau: Client State (như chọn Dark Mode, đóng mở filter) là dữ liệu đồng bộ, tức thời, nằm hoàn toàn trên máy. Còn Server State (như danh sách bài tập) là dữ liệu bất đồng bộ từ xa, cần xử lý độ trễ mạng, cache, thử lại khi lỗi và cập nhật lạc quan. Dùng TanStack Query chuyên trị Server State và Zustand chuyên trị Client State là kiến trúc chuẩn mực được cộng đồng React Native toàn cầu khuyến nghị."*

---

## PHẦN 3: HỒ SƠ THUYẾT MINH CHI TIẾT THEO CÂY THƯ MỤC DỰ ÁN

### PHẦN 1: TẦNG ĐIỀU HƯỚNG & MÀN HÌNH (DIRECTORY: app/ — EXPO ROUTER)
*Thư mục `app/` áp dụng cơ chế File-based Routing của Expo Router v3+. Cấu trúc thư mục phản ánh trực tiếp URL và cấu trúc ngăn xếp màn hình (Stack/Tabs/Modal).*

#### 📄 `app/_layout.tsx` — Root Layout & Global Application Configuration
- **Phân tầng**: Presentation / Navigation Root | **Phụ trách**: **Cả 2 Thành viên (TV1: Navigation & Listener; TV2: QueryClient & Auth Restore)** | **Đáp ứng**: Must-Have #4 (Deep Linking & Navigation), Kỹ thuật nâng cao (QueryClient Cache)
- **Mục đích**: Là thành phần gốc khởi động toàn ứng dụng, bọc toàn bộ app bằng QueryClientProvider, kích hoạt bộ lắng nghe thông báo và khôi phục phiên đăng nhập.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[QueryClientProvider]`**: Khởi tạo đối tượng `queryClient` duy nhất với cấu hình `retry: 2` (tự động thử lại 2 lần khi mạng lỗi) và `staleTime: 60000` (1 phút) trước khi bọc toàn bộ cây Component.
- **`[useNotificationListener()]`**: Hook kích hoạt lắng nghe sự kiện người dùng bấm vào thanh thông báo của điện thoại để bắt Deep Link điều hướng sang `/assignments/[id]`.
- **`[restoreSession()]`**: Gọi `useAuthStore.getState().restoreSession()` ngay trong `useEffect` để kiểm tra SecureStore, nếu có token thì tự động đăng nhập mà không bắt người dùng đăng nhập lại (Survive App Restart).
- **`[Stack Router]`**: Cấu hình 4 nhóm điều hướng chính: nhóm xác thực `(auth)`, nhóm ứng dụng bảo vệ `(app)`, màn hình modal pop-up `modal/new-assignment` và màn hình lỗi `+not-found`.

> **🗣️ Lời thoại**: *"Kính thưa Thầy, file `app/_layout.tsx` đóng vai trò là 'trái tim' khởi động của toàn dự án. Tại đây, nhóm em bọc toàn bộ ứng dụng bằng `QueryClientProvider` của TanStack Query v5 để cung cấp bộ nhớ đệm cache cho mọi màn hình. Đồng thời, hàm `restoreSession()` được gọi để khôi phục phiên đăng nhập từ phần cứng `SecureStore`, và `useNotificationListener()` luôn sẵn sàng đón nhận tương tác bấm vào thông báo deadline để mở đúng bài tập tương ứng."*

> **🎯 Vấn đáp Thầy Vinh**: *"Tại sao nhóm em lại đặt QueryClientProvider và useNotificationListener ở app/_layout.tsx mà không đặt riêng ở từng màn hình?"* -> *"Dạ thưa Thầy, `app/_layout.tsx` là Root Layout cao nhất, tồn tại xuyên suốt vòng đời ứng dụng và không bao giờ bị unmount khi người dùng chuyển tab hay chuyển trang. Đặt `QueryClientProvider` ở đây giúp toàn bộ cache dữ liệu được duy trì liên tục, tránh fetch lại thừa thãi. Đặt `useNotificationListener` ở đây đảm bảo ứng dụng luôn lắng nghe được sự kiện bấm thông báo từ hệ điều hành ngay cả khi app đang ở màn hình phụ hoặc chạy ngầm."*

---

#### 📄 `app/+not-found.tsx` — 404 Not Found & Deep Link Fallback Screen
- **Phân tầng**: Presentation / Error Handling | **Phụ trách**: **Trần Bảo Trâm (TV1)** | **Đáp ứng**: Tiêu chuẩn UX/UI & Robust Deep Linking
- **Mục đích**: Bảo vệ ứng dụng không bị crash khi người dùng mở một đường link không tồn tại hoặc payload của Deep Link bị sai lệch.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[Stack.Screen options]`**: Thiết lập tiêu đề 'Oops! Không tìm thấy trang'.
- **`[AccessibleButton]`**: Nút bấm trợ năng điều hướng an toàn quay về Trang chủ (`router.replace('/')`) với vùng chạm đạt chuẩn 44x44pt.
- **`[ThemedText & ThemedView]`**: Giao diện tự động thích ứng với chế độ Dark/Light mode.

> **🗣️ Lời thoại**: *"File `app/+not-found.tsx` đảm bảo tính bền vững của app (Graceful Degradation). Nếu người dùng truy cập một URL hoặc deep link không hợp lệ, thay vì để màn hình trắng hoặc văng ứng dụng, màn hình này sẽ xuất hiện một cách thân thiện và cung cấp nút bấm để đưa người dùng quay về Trang chủ an toàn."*

> **🎯 Vấn đáp Thầy Vinh**: *"Màn hình +not-found.tsx này được kích hoạt trong trường hợp nào trong đồ án?"* -> *"Dạ thưa Thầy, màn hình này kích hoạt khi Expo Router nhận một URL không khớp với bất kỳ file nào trong thư mục `app/`, ví dụ khi người dùng mở deep link `studyplanner://assignments/99999` mà mã bài tập không tồn tại, hoặc khi có lỗi gõ nhầm route trong quá trình phát triển."*

---

#### 📄 `app/(auth)/_layout.tsx` — Authentication Stack Layout
- **Phân tầng**: Presentation / Navigation Guard | **Phụ trách**: **Nguyễn Thị Hương Giang (TV2)** | **Đáp ứng**: Must-Have #5 (Auth State Management & Flow)
- **Mục đích**: Quản lý ngăn xếp điều hướng cho nhóm màn hình chưa đăng nhập (Unauthenticated group).

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[headerShown: false]`**: Ẩn header mặc định để màn hình đăng nhập hiển thị toàn màn hình hiện đại.
- **`[Stack]`**: Cung cấp container để chứa màn hình `sign-in.tsx`.

> **🗣️ Lời thoại**: *"File `app/(auth)/_layout.tsx` thiết lập không gian riêng cho luồng xác thực, tắt thanh header thô cứng để tạo trải nghiệm đăng nhập mượt mà, tách biệt hoàn toàn với luồng chính của ứng dụng."*

> **🎯 Vấn đáp Thầy Vinh**: *"Tại sao lại dùng cú pháp dấu ngoặc đơn (auth) trong tên thư mục?"* -> *"Dạ thưa Thầy, trong Expo Router, dấu ngoặc đơn `(auth)` đại diện cho Route Group. Nó giúp nhóm các màn hình có chung mục đích hoặc chung layout lại với nhau mà KHÔNG làm thay đổi đường dẫn URL. Đường dẫn đến màn hình đăng nhập vẫn là `/sign-in` chứ không phải `/(auth)/sign-in`."*

---

#### 📄 `app/(auth)/sign-in.tsx` — Sign-In Screen & Hardware Encrypted Session
- **Phân tầng**: Presentation / Authentication Screen | **Phụ trách**: **Nguyễn Thị Hương Giang (TV2)** | **Đáp ứng**: Must-Have #5 (Auth State Management & Mock Auth)
- **Mục đích**: Cho phép người dùng đăng nhập bằng tài khoản sinh viên hoặc tài khoản giảng viên, hiển thị thông tin tài khoản mẫu và lưu token vào SecureStore.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[useAuthStore.login()]`**: Gọi action đăng nhập từ Zustand store, xác thực thông tin và lưu session vào SecureStore.
- **`[Quick Fill Buttons]`**: Hai nút điền nhanh tài khoản mẫu: 'Sinh viên mẫu (sv_dntu)' và 'Giảng viên mẫu (gv_vinh)' giúp Thầy kiểm tra tiện lợi.
- **`[Error Banner]`**: Hiển thị thông báo lỗi rõ ràng nếu nhập sai tên đăng nhập hoặc mật khẩu.
- **`[TouchTarget >= 44pt]`**: Mọi ô nhập liệu và nút bấm đăng nhập đều đáp ứng tối thiểu 44pt chiều cao.

> **🗣️ Lời thoại**: *"Kính thưa Thầy, màn hình `sign-in.tsx` cung cấp giao diện đăng nhập bảo mật. Nhóm đã tích hợp sẵn 2 nút tài khoản mẫu tiện lợi cho việc demo: Sinh viên `sv_dntu` và Giảng viên `gv_vinh`. Khi đăng nhập thành công, token và thông tin người dùng được mã hóa phần cứng vào `SecureStore` và app tự động chuyển sang Trang chủ."*

> **🎯 Vấn đáp Thầy Vinh**: *"Nếu tắt ứng dụng hoàn toàn hoặc khởi động lại điện thoại thì người dùng có phải đăng nhập lại không?"* -> *"Dạ thưa Thầy là KHÔNG ạ! Vì thông tin đăng nhập và token được lưu trữ bền vững trong `expo-secure-store` (Keystore trên Android / Keychain trên iOS). Khi mở lại app, hàm `restoreSession()` tại Root Layout sẽ tự động đọc lại token hợp lệ và duy trì trạng thái đăng nhập (Survive App Restart)."*

---

#### 📄 `app/(app)/_layout.tsx` — Protected Route Guard Layout
- **Phân tầng**: Presentation / Navigation Guard | **Phụ trách**: **Nguyễn Thị Hương Giang (TV2)** | **Đáp ứng**: Must-Have #5 (Auth Protection & Redirection)
- **Mục đích**: Bảo vệ toàn bộ các màn hình chính của ứng dụng, lập tức chuyển hướng về `/sign-in` nếu người dùng chưa xác thực.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[useAuthStore(user, isLoading)]`**: Lắng nghe trực tiếp trạng thái đăng nhập từ Zustand auth store.
- **`[ActivityIndicator]`**: Hiển thị vòng xoay tải trong khi `isLoading === true` (đang đọc SecureStore).
- **`[Redirect href='/sign-in']`**: Nếu `!user` sau khi nạp xong, tự động chuyển hướng người dùng về trang đăng nhập, ngăn chặn truy cập trái phép.

> **🗣️ Lời thoại**: *"File `app/(app)/_layout.tsx` đóng vai trò là 'người gác cổng' bảo vệ ứng dụng. Bất kỳ ai cố tình truy cập vào các màn hình bài tập, lịch học hay tiến độ mà chưa đăng nhập đều bị chặn lại và chuyển hướng về màn hình đăng nhập ngay lập tức."*

> **🎯 Vấn đáp Thầy Vinh**: *"Làm thế nào để tránh hiện tượng màn hình nhấp nháy (flicker) từ trang đăng nhập sang trang chủ khi vừa mở app?"* -> *"Dạ thưa Thầy, nhóm em sử dụng biến trạng thái `isLoading` trong `useAuthStore`. Trong khi app đang đọc token từ SecureStore, file layout này sẽ hiển thị một `ActivityIndicator` xoay tròn. Chỉ khi nào quá trình đọc hoàn tất, layout mới quyết định render màn hình chính hay chuyển về `/sign-in`, loại bỏ hoàn toàn hiện tượng chớp nháy màn hình."*

---

#### 📄 `app/(app)/(tabs)/_layout.tsx` — Bottom Tab Bar Navigator Layout
- **Phân tầng**: Presentation / Navigation Tab Bar | **Phụ trách**: **Trần Bảo Trâm (TV1)** | **Đáp ứng**: Must-Have #4 (Navigation Tabs & Accessibility)
- **Mục đích**: Định nghĩa thanh điều hướng dưới đáy gồm 3 Tab: Trang chủ (Home), Lịch học (Schedule), Tiến độ môn (Courses), tích hợp chuẩn trợ năng 44x44pt.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[Tabs component]`**: Thiết lập cấu hình 3 màn hình Tab với icon Ionicons trực quan: `home`, `calendar`, `book`.
- **`[tabBarStyle minHeight: 64]`**: Đảm bảo vùng chạm của từng Tab luôn lớn hơn hoặc bằng 44x44pt, phù hợp với ngón tay người dùng.
- **`[useThemeColor()]`**: Đồng bộ màu sắc thanh Tab Bar (`tabBarActiveTintColor`, `tabBarInactiveTintColor`, `backgroundColor`) theo đúng Theme Sáng/Tối.

> **🗣️ Lời thoại**: *"File `app/(app)/(tabs)/_layout.tsx` thiết kế thanh Tab Bar 3 mục chuẩn mực. Mỗi tab có icon và tiêu đề rõ ràng, màu sắc tự thích ứng với Dark Mode và chiều cao đạt 64pt, đảm bảo vùng bấm thoải mái không bao giờ bấm hụt."*

> **🎯 Vấn đáp Thầy Vinh**: *"Mỗi tab bar item có đáp ứng tiêu chuẩn Accessibility của Thầy không?"* -> *"Dạ thưa Thầy có ạ! Chiều cao thanh Tab được đặt là 64pt, chiều rộng chia đều cho 3 tab nên mỗi item có diện tích tiếp xúc trên 100x64pt, vượt xa tiêu chuẩn tối thiểu 44x44pt của Apple HIG và Android Accessibility."*

---

#### 📄 `app/(app)/(tabs)/index.tsx` — Home Dashboard Screen
- **Phân tầng**: Presentation / Main Screen | **Phụ trách**: **Cả 2 Thành viên (TV1: Giao diện & Widget 48h; TV2: Query Data & Quick Filter)** | **Đáp ứng**: Must-Have #1 (List View & Checkbox), Must-Have #2 (Urgent 48h Widget), Luật Zero-Hex
- **Mục đích**: Màn hình Dashboard trung tâm: chào mừng người dùng, hiển thị Widget bài tập khẩn cấp 48h, thống kê nhanh, bộ lọc Tất cả/Chưa xong/Đã xong và danh sách bài tập kèm cập nhật lạc quan.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[Due48hWidget]`**: Nhúng widget hiển thị danh sách bài tập có hạn nộp trong vòng 48 giờ tới.
- **`[Quick Stats Bar]`**: Thanh thống kê nhanh: Tổng số bài, Cần làm ngay, Đã hoàn thành.
- **`[StateHandler]`**: Xử lý trọn vẹn 4 trạng thái tải dữ liệu mạng (Loading, Empty, Error có nút Thử lại, Content).
- **`[OfflineBanner]`**: Hiển thị cảnh báo màu hổ phách kèm thời gian thực tế lưu offline khi mất mạng.

> **🗣️ Lời thoại**: *"Màn hình Trang chủ `index.tsx` là nơi sinh viên nắm bắt toàn bộ công việc học tập. Ngay trên đầu là Widget 48h cảnh báo những bài tập sắp đến hạn. Phía dưới là thanh lọc nhanh và danh sách bài tập. Mọi thao tác tick chọn hoàn thành đều phản hồi tức thì nhờ cơ chế Cập nhật lạc quan."*

> **🎯 Vấn đáp Thầy Vinh**: *"Nếu danh sách bài tập bị lỗi mạng khi vừa mở app thì trang chủ hiển thị thế nào?"* -> *"Dạ thưa Thầy, component `StateHandler` sẽ bắt lỗi `isError` từ TanStack Query và render giao diện báo lỗi kèm nút 'Thử lại'. Khi bấm nút, hàm `refetch()` sẽ được kích hoạt lại. Nếu trước đó đã có dữ liệu trong AsyncStorage, app vẫn đọc dữ liệu ngoại tuyến lên và hiển thị banner hổ phách báo trạng thái ngoại tuyến."*

---

#### 📄 `app/(app)/(tabs)/schedule.tsx` — Schedule & Weekly Calendar Screen
- **Phân tầng**: Presentation / Main Screen | **Phụ trách**: **Trần Bảo Trâm (TV1)** | **Đáp ứng**: Must-Have #3 (Weekly View Calendar & Dot Status Indicator)
- **Mục đích**: Màn hình Lịch học: cung cấp 2 chế độ hiển thị (Dải lịch tuần 7 ngày có chấm trạng thái và Chế độ xem danh sách phân nhóm theo ngày).

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[WeeklyCalendar]`**: Component dải lịch tuần từ Thứ 2 đến Chủ nhật, tính toán ngày và hiển thị chấm đỏ nếu có bài tập.
- **`[Dual Mode Switcher]`**: Nút chuyển đổi linh hoạt giữa 'Lịch tuần' và 'Toàn bộ danh sách'.
- **`[Date Filter]`**: Lọc chính xác các bài tập có hạn nộp trùng với ngày người dùng đang chọn trên lịch.
- **`[Floating Action Button (FAB)]`**: Nút bấm dấu cộng '+' nổi bật ở góc dưới để mở nhanh Modal tạo bài tập mới.

> **🗣️ Lời thoại**: *"Màn hình `schedule.tsx` giúp sinh viên lập kế hoạch tuần. Nhóm em cung cấp dải lịch 7 ngày trực quan từ Thứ 2 đến Chủ nhật. Ngày nào có bài tập sẽ có chấm tròn trạng thái. Sinh viên có thể bấm vào từng ngày để xem bài tập của riêng ngày đó hoặc chuyển sang chế độ danh sách tổng thể."*

> **🎯 Vấn đáp Thầy Vinh**: *"Làm thế nào để xác định một ngày trên lịch tuần có bài tập hay không để hiển thị chấm tròn?"* -> *"Dạ thưa Thầy, trong `WeeklyCalendar.tsx`, nhóm dùng hàm so sánh chuỗi ngày theo định dạng chuẩn ISO `YYYY-MM-DD` giữa từng ngày trong tuần và trường `dueDate` của bài tập. Nếu mảng bài tập lọc ra có độ dài > 0 thì sẽ render một chấm tròn nhỏ màu đỏ cam dưới số ngày."*

---

#### 📄 `app/(app)/(tabs)/courses.tsx` — Courses Progress & Profile Screen
- **Phân tầng**: Presentation / Main Screen | **Phụ trách**: **Nguyễn Thị Hương Giang (TV2)** | **Đáp ứng**: Must-Have #6 (Computed Course Progress %), Luật Dữ liệu Dẫn Xuất
- **Mục đích**: Hiển thị tiến độ hoàn thành của từng môn học (tính toán động $O(N)$), thông tin sinh viên đăng nhập và nút đăng xuất tài khoản an toàn.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[computeCourseProgress()]`**: Hàm thuần túy tính toán tổng số bài, số bài đã xong và tỉ lệ phần trăm tiến độ của từng môn học một cách tự động, KHÔNG lưu cứng trong DB.
- **`[Progress Bar]`**: Thanh tiến độ trực quan tự động đổi màu theo tỷ lệ phần trăm (dưới 50% màu cam, trên 80% màu xanh lục).
- **`[Sign-Out Action]`**: Nút đăng xuất gọi `useAuthStore.logout()`, xóa token khỏi SecureStore và tự động quay về màn hình đăng nhập.

> **🗣️ Lời thoại**: *"Màn hình `courses.tsx` hiện thực trọn vẹn yêu cầu Must-Have #6 của Thầy. Toàn bộ tỉ lệ phần trăm hoàn thành môn học đều là dữ liệu dẫn xuất được tính toán tự động qua hàm `computeCourseProgress()`. Màn hình này cũng hiển thị thông tin tài khoản sinh viên và hỗ trợ đăng xuất an toàn."*

> **🎯 Vấn đáp Thầy Vinh**: *"Tại sao nhóm không lưu luôn cột 'percentage' vào bảng môn học trên Database cho tiện truy vấn?"* -> *"Dạ thưa Thầy, đây là nguyên tắc 'Luật Dữ liệu Dẫn Xuất' (Derived State). Nếu lưu cứng cột `percentage` vào DB, mỗi khi sinh viên tick hoàn thành, thêm bài, xóa bài hay sửa deadline sẽ phải chạy lệnh UPDATE lại cột đó, rất dễ dẫn đến sai lệch dữ liệu (Data Inconsistency). Tính toán động $O(N)$ ở phía client đảm bảo tiến độ luôn chính xác 100% với dữ liệu bài tập thực tế."*

---

#### 📄 `app/(app)/assignments/[id].tsx` — Assignment Detail & Deep Link Target Screen
- **Phân tầng**: Presentation / Dynamic Route | **Phụ trách**: **Cả 2 Thành viên (TV1: UI, Photo Preview, Banner; TV2: Query Data by ID)** | **Đáp ứng**: Must-Have #4 (Deep Linking Target), Kỹ thuật nâng cao (Image Attachment)
- **Mục đích**: Màn hình chi tiết bài tập được mở khi người dùng bấm vào danh sách hoặc bấm vào thông báo từ thanh hệ thống điện thoại.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[useLocalSearchParams<{ id: string }>()]`**: Trích xuất mã `id` bài tập từ đường dẫn động.
- **`[Deep Link Amber Banner]`**: Hiển thị thanh thông báo màu hổ phách nổi bật 'Bạn đã mở bài tập này từ Thông báo / Deep Link' nếu người dùng truy cập từ notification.
- **`[Photo Attachment Preview]`**: Hiển thị ảnh đính kèm bài tập (nếu có) được chụp hoặc chọn từ thư viện qua `expo-image-picker`.
- **`[Toggle Checkbox & Due Date]`**: Cho phép tick hoàn thành trực tiếp từ màn hình chi tiết và xem ngày giờ nộp chính xác.

> **🗣️ Lời thoại**: *"File `[id].tsx` là màn hình đích của cơ chế Deep Linking. Khi người dùng bấm vào thông báo hẹn giờ, app sẽ mở thẳng vào màn hình này kèm theo banner hổ phách thông báo. Màn hình hiển thị đầy đủ tên bài, môn học, ghi chú và ảnh đính kèm minh chứng bài tập."*

> **🎯 Vấn đáp Thầy Vinh**: *"Làm thế nào màn hình này biết được người dùng đang mở từ Deep Link hay bấm từ danh sách thông thường?"* -> *"Dạ thưa Thầy, khi payload thông báo được gửi đi, nó đính kèm cờ query param `fromNotification=true`. Tại file `[id].tsx`, nhóm dùng `useLocalSearchParams` kiểm tra nếu có cờ này thì sẽ kích hoạt hiển thị thanh Banner màu hổ phách chào mừng người dùng đến từ Deep Link."*

---

#### 📄 `app/(app)/modal/new-assignment.tsx` — New Assignment Interactive Modal Screen
- **Phân tầng**: Presentation / Modal Form Screen | **Phụ trách**: **Cả 2 Thành viên (TV1: Lịch tháng ◀/▶, Stepper giờ/phút, Photo; TV2: Mutation)** | **Đáp ứng**: Must-Have #1 (Create Assignment), Kỹ thuật nâng cao (Precision Time & Photo)
- **Mục đích**: Form tạo bài tập mới dạng Modal pop-up: tích hợp cuốn lịch tháng tương tác chọn ngày, nút tăng giảm giờ/phút độ chuẩn xác cao, phím tắt 23:59/17:00, chụp ảnh và tự động lên lịch thông báo.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[Interactive Calendar Grid]`**: Lưới lịch trực quan với nút chuyển tháng ◀ / ▶, các ô ngày kích thước >= 44x44pt, đổi màu ô được chọn.
- **`[Hour & Minute Stepper]`**: Nút bấm ± tăng giảm từng giờ hoặc từng phút linh hoạt, loại bỏ hoàn toàn sự cố gõ nhầm định dạng giờ.
- **`[Quick Presets (23:59 & 17:00)]`**: Hai nút phím tắt chọn nhanh 2 khung giờ nộp bài phổ biến nhất của sinh viên.
- **`[expo-image-picker]`**: Hỗ trợ chụp ảnh hoặc chọn ảnh bìa bài tập từ bộ nhớ điện thoại.
- **`[scheduleAssignmentNotification]`**: Tự động lên lịch thông báo nhắc bài trước hạn chót.

> **🗣️ Lời thoại**: *"Modal `new-assignment.tsx` được nhóm em đầu tư rất kỹ về trải nghiệm người dùng. Thay vì bắt người dùng tự gõ chuỗi ngày tháng dễ sai sót, nhóm xây dựng cuốn lịch tháng trực quan với nút chuyển tháng ◀ / ▶, bộ tăng giảm giờ phút chính xác và 2 nút phím tắt 23:59 và 17:00. Người dùng cũng có thể đính kèm ảnh bài tập tiện lợi."*

> **🎯 Vấn đáp Thầy Vinh**: *"Tại sao nhóm lại tự dựng giao diện lịch tháng và stepper giờ phút mà không dùng thư viện ngoài?"* -> *"Dạ thưa Thầy, việc tự dựng component lịch và stepper giúp nhóm em hoàn toàn kiểm soát được Luật Zero-Hex và tiêu chuẩn Touch Target >= 44x44pt của Thầy trên cả nền tảng iOS, Android và Web. Các thư viện ngoài thường bị lỗi xung đột giao diện khi đổi Dark Mode hoặc vùng chạm không đạt chuẩn 44pt."*

---

### PHẦN 2: THIẾT KẾ GIAO DIỆN & LINH KIỆN CƠ BẢN (src/constants/ & src/components/ui/)
*Các viên gạch giao diện nguyên tử (Atomic UI Components) và hệ thống Design Tokens tuân thủ nghiêm ngặt Luật Zero-Hex và chuẩn trợ năng WCAG 2.1 AA.*

#### 📄 `src/constants/tokens.ts` — Design Tokens & Single Source of Truth
- **Phân tầng**: Design System / Constants | **Phụ trách**: **Trần Bảo Trâm (TV1)** | **Đáp ứng**: Luật Zero-Hex, Tiêu chuẩn Touch Target >= 44x44pt
- **Mục đích**: Là file DUY NHẤT trong toàn bộ dự án được phép chứa mã màu Hex, quy định bảng màu Light/Dark, khoảng cách Spacing và chuẩn vùng chạm.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[Palette]`**: Bộ màu cơ bản (Blue, Amber, Green, Red, Gray) định nghĩa các sắc thái chuẩn.
- **`[ThemeTokens.light & ThemeTokens.dark]`**: Bảng màu ngữ nghĩa (Semantic colors): `background`, `card`, `text`, `border`, `tint`, `urgent`.
- **`[Spacing]`**: Hệ thống khoảng cách bội số của 8pt: xs: 4, sm: 8, md: 16, lg: 24, xl: 32.
- **`[TouchTarget]`**: Quy định kích thước tối thiểu: `min: 44` (chuẩn công thái học ngón tay người dùng).

> **🗣️ Lời thoại**: *"File `tokens.ts` là 'Hiến pháp thiết kế' của ứng dụng. Nhóm em tuân thủ nghiêm ngặt Luật Zero-Hex: mọi mã màu đều tập trung tại đây. Khi điện thoại chuyển từ chế độ Sáng sang Tối, toàn bộ màu nền, màu chữ và viền đều được cấp phát tự động từ file này."*

> **🎯 Vấn đáp Thầy Vinh**: *"Thầy kiểm tra ngẫu nhiên thấy trong file component nào có mã hex '#FFFFFF' thì sẽ trừ điểm thế nào?"* -> *"Dạ thưa Thầy, dự án của nhóm cam kết 100% tuân thủ Luật Zero-Hex, không có bất kỳ file component nào chứa mã màu Hex ngoài `tokens.ts`. Mọi màu sắc đều được gọi qua hook `useThemeColor()` hoặc `ThemeTokens`."*

---

#### 📄 `src/components/ui/ThemedText.tsx` — Themed Typography Component
- **Phân tầng**: Atomic UI / Typography | **Phụ trách**: **Trần Bảo Trâm (TV1)** | **Đáp ứng**: Luật Zero-Hex & Đồng bộ Dark Mode
- **Mục đích**: Component hiển thị chữ tự động lấy màu sắc phù hợp theo chế độ Sáng/Tối của thiết bị.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[variant mapping]`**: Hỗ trợ các kiểu chữ: `title` (24pt bold), `subtitle` (18pt semi-bold), `body` (15pt), `caption` (13pt muted), `link` (15pt tint).
- **`[useThemeColor()]`**: Tự động trích xuất màu chữ chính hoặc phụ từ theme hiện tại.
- **`[TextProps inheritance]`**: Thừa kế đầy đủ các thuộc tính của React Native Text chuẩn.

> **🗣️ Lời thoại**: *"Component `ThemedText.tsx` thay thế hoàn toàn thẻ `Text` mặc định. Nó giúp toàn bộ văn bản trong ứng dụng tự động hiển thị đúng màu chữ tương phản cao, chống lóa mắt ở Dark Mode và rõ ràng ở Light Mode."*

> **🎯 Vấn đáp Thầy Vinh**: *"Component ThemedText này xử lý Dark Mode như thế nào?"* -> *"Dạ thưa Thầy, bên trong `ThemedText`, hook `useThemeColor()` được gọi để lấy ra đối tượng màu hiện tại. Nếu đang ở Dark Mode, màu chữ sẽ tự chuyển sang màu trắng ngà `#F1F5F9`, còn ở Light Mode là màu xám đen đậm `#0F172A`."*

---

#### 📄 `src/components/ui/ThemedView.tsx` — Themed Container View Component
- **Phân tầng**: Atomic UI / Container | **Phụ trách**: **Trần Bảo Trâm (TV1)** | **Đáp ứng**: Luật Zero-Hex & Đồng bộ Dark Mode
- **Mục đích**: Component khung chứa (View) tự động đổi màu nền theo theme.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[backgroundColor: colors.background]`**: Gán màu nền mặc định từ bảng màu ngữ nghĩa của theme.
- **`[ViewProps inheritance]`**: Hỗ trợ đầy đủ layout flexbox và style tùy biến bên ngoài truyền vào.

> **🗣️ Lời thoại**: *"File `ThemedView.tsx` cung cấp khung chứa giao diện chuẩn, tự động áp dụng màu nền đồng nhất toàn app mà không cần viết lặp lại các lệnh điều kiện kiểm tra Dark Mode."*

> **🎯 Vấn đáp Thầy Vinh**: *"Tại sao không dùng trực tiếp thẻ View của React Native rồi gán style backgroundColor?"* -> *"Dạ thưa Thầy, nếu dùng View trực tiếp thì ở mỗi màn hình ta đều phải import hook theme và gán style thủ công, gây lặp code (vi phạm nguyên lý DRY) và rất dễ quên khi tạo màn hình mới. `ThemedView` đóng gói sẵn logic này giúp code gọn gàng và chuẩn xác."*

---

#### 📄 `src/components/ui/AccessibleButton.tsx` — Accessible Touch Target Button
- **Phân tầng**: Atomic UI / Interactive | **Phụ trách**: **Trần Bảo Trâm (TV1)** | **Đáp ứng**: Luật Trợ Năng (Accessibility) & Touch Target >= 44x44pt
- **Mục đích**: Nút bấm chuẩn mực đáp ứng tiêu chuẩn tiếp cận ngón tay người dùng và hỗ trợ người khiếm thị sử dụng trình đọc màn hình.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[minHeight: 44, minWidth: 44]`**: Ép buộc kích thước tối thiểu luôn đạt chuẩn 44x44pt.
- **`[accessibilityRole='button']`**: Khai báo vai trò nút bấm cho trình đọc màn hình TalkBack/VoiceOver.
- **`[accessibilityLabel]`**: Thuộc tính bắt buộc mô tả hành động của nút bằng lời văn tự nhiên.
- **`[activeOpacity: 0.7]`**: Cung cấp hiệu ứng thị giác phản hồi ngay lập tức khi ngón tay chạm vào nút.

> **🗣️ Lời thoại**: *"Component `AccessibleButton.tsx` hiện thực hóa tiêu chuẩn trợ năng cao cấp của Thầy. Mọi nút bấm trong ứng dụng khi dùng component này đều cam kết có diện tích tiếp xúc ngón tay tối thiểu 44x44pt và tích hợp sẵn nhãn đọc hỗ trợ người khuyết tật."*

> **🎯 Vấn đáp Thầy Vinh**: *"Thầy dùng thước đo trong Xcode hoặc Android Inspector thấy nút của em nhỏ hơn 44pt thì giải thích sao?"* -> *"Dạ thưa Thầy, trong `AccessibleButton.tsx`, thuộc tính `minHeight: TouchTarget.min` và `minWidth: TouchTarget.min` được cố định trong `StyleSheet`. Kể cả khi nội dung bên trong chỉ là một icon nhỏ 16pt, vùng chạm xung quanh (hit target) vẫn được đệm padding tối thiểu 44x44pt nên không thể nhỏ hơn chuẩn được ạ."*

---

#### 📄 `src/components/ui/StateHandler.tsx` — 4-States UI Lifecycle Handler
- **Phân tầng**: Atomic UI / State Management | **Phụ trách**: **Nguyễn Thị Hương Giang (TV2)** | **Đáp ứng**: Luật 4 Trạng Thái (Loading, Empty, Error, Content)
- **Mục đích**: Bảo đảm mọi màn hình tải dữ liệu đều xử lý đầy đủ và mượt mà cả 4 trạng thái, đặc biệt là nút 'Thử lại' khi có lỗi kết nối mạng.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[isLoading state]`**: Hiển thị vòng xoay `ActivityIndicator` và thông báo đang tải.
- **`[isError state]`**: Hiển thị icon cảnh báo lỗi kèm nút `AccessibleButton` gọi hàm `onRetry()` thật sự.
- **`[isEmpty state]`**: Hiển thị hình minh họa và thông báo danh sách trống thân thiện.
- **`[children (Content)]`**: Render nội dung chính khi dữ liệu đã tải thành công.

> **🗣️ Lời thoại**: *"File `StateHandler.tsx` là giải pháp dứt điểm cho vấn đề màn hình trắng hoặc treo app khi rớt mạng. Nó tự động chuyển đổi giữa 4 trạng thái: Đang tải, Danh sách trống, Báo lỗi có nút Thử lại, và Hiển thị dữ liệu hoàn chỉnh."*

> **🎯 Vấn đáp Thầy Vinh**: *"Nút 'Thử lại' trong StateHandler có gọi hàm refetch thật không hay chỉ là nút giả lập?"* -> *"Dạ thưa Thầy, nút 'Thử lại' nhận prop `onRetry` và được truyền trực tiếp hàm `refetch` từ hook TanStack Query `useAssignments()` hoặc `useCourses()`. Khi người dùng bấm nút, ứng dụng sẽ thực sự gửi lại request mạng lên server để lấy dữ liệu mới."*

---

#### 📄 `src/components/ui/OfflineBanner.tsx` — Real-time Offline Timestamp Alert Banner
- **Phân tầng**: Atomic UI / Alert Banner | **Phụ trách**: **Cả 2 Thành viên (TV1: UI Amber Banner; TV2: Real-time Timestamp & Store)** | **Đáp ứng**: Kỹ thuật nâng cao (Offline Tolerance & Real-time Timestamp)
- **Mục đích**: Hiển thị dải băng cảnh báo màu hổ phách khi mất kết nối mạng, hiển thị CHÍNH XÁC MỐC THỜI GIAN THỰC TẾ mà dữ liệu offline vừa được lưu/sửa đổi.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[useIsOffline()]`**: Lắng nghe trạng thái mất mạng từ Zustand `useNetworkStore`.
- **`[useNetworkStore(cachedTime)]`**: Hiển thị chuỗi thời gian thực tế dạng `HH:MM:SS` ngay khi có thay đổi offline.
- **`[Amber Styling]`**: Sử dụng mã màu cảnh báo tiêu chuẩn trong Tokens, nền vàng hổ phách nhạt chữ nâu đậm nổi bật.

> **🗣️ Lời thoại**: *"File `OfflineBanner.tsx` đem lại sự an tâm tuyệt đối cho sinh viên khi mất mạng. Banner màu hổ phách sẽ xuất hiện và thông báo rõ: 'Đang ở chế độ ngoại tuyến. Dữ liệu đã lưu cục bộ lúc HH:MM:SS'. Mốc thời gian này được cập nhật theo thời gian thực mỗi khi có thao tác mới."*

> **🎯 Vấn đáp Thầy Vinh**: *"Thời gian hiển thị trên banner lấy từ đâu? Có phải là thời gian fix cứng không?"* -> *"Dạ thưa Thầy, thời gian hoàn toàn là thời gian thực (dynamic real-time)! Mỗi khi app phát hiện mất mạng hoặc khi sinh viên tick bài tập trong chế độ offline, hàm xử lý sẽ gọi `new Date().toLocaleTimeString('vi-VN')` và lưu vào `cachedTime` của store, đảm bảo thời gian hiển thị luôn chuẩn xác tới từng giây."*

---

### PHẦN 3: TẦNG LINH KIỆN NGHIỆP VỤ (src/components/features/)
*Các linh kiện giao diện nghiệp vụ chuyên sâu phục vụ quản lý bài tập, cảnh báo hạn chót và hiển thị lịch học trực quan.*

#### 📄 `src/components/features/AssignmentCard.tsx` — Interactive Assignment Card Component
- **Phân tầng**: Feature Component / Assignment Item | **Phụ trách**: **Trần Bảo Trâm (TV1)** | **Đáp ứng**: Must-Have #1 (List View, Strike-through, Checkbox 44pt), Luật Zero-Hex
- **Mục đích**: Hiển thị thẻ bài tập với vạch màu nhận diện môn học, ô checkbox chuẩn 44x44pt, hiệu ứng gạch ngang chữ khi hoàn thành và chuyển trang chi tiết.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[Course Color Strip]`**: Vạch màu dọc bên trái thẻ giúp sinh viên nhận diện môn học trong 1 giây mà không cần đọc chữ.
- **`[Checkbox HitTarget 44x44pt]`**: Bọc ô checkbox bằng TouchableOpacity có kích thước tối thiểu 44x44pt, tích hợp `accessibilityRole='checkbox'`.
- **`[textDecorationLine: 'line-through']`**: Tự động gạch ngang tiêu đề bài tập và làm mờ thẻ khi bài tập đã được đánh dấu hoàn thành.
- **`[Optimistic Toggle Callback]`**: Gọi trực tiếp hàm `onToggle` để kích hoạt cập nhật lạc quan ngay lập tức.

> **🗣️ Lời thoại**: *"Component `AssignmentCard.tsx` là nơi người dùng tương tác nhiều nhất. Thẻ có vạch màu môn học đặc trưng, tiêu đề tự động gạch ngang khi làm xong và đặc biệt là ô checkbox được thiết kế vùng chạm tối thiểu 44x44pt, bấm cực kỳ nhạy và không bao giờ trượt."*

> **🎯 Vấn đáp Thầy Vinh**: *"Làm thế nào để người dùng bấm vào checkbox thì tick hoàn thành, còn bấm vào thân thẻ thì mở màn hình chi tiết?"* -> *"Dạ thưa Thầy, nhóm tách biệt thành 2 vùng Touchable riêng biệt: Vùng thân thẻ là một `TouchableOpacity` có sự kiện `onPress` điều hướng sang `/assignments/[id]`. Còn ô checkbox là một `TouchableOpacity` con độc lập có kích thước 44x44pt bắt sự kiện `onToggle(item.id)`, sự kiện này không bị nổi bọt (event bubbling) làm mở nhầm trang chi tiết."*

---

#### 📄 `src/components/features/Due48hWidget.tsx` — Urgent 48-Hour Deadline Widget
- **Phân tầng**: Feature Component / Urgent Deadlines | **Phụ trách**: **Trần Bảo Trâm (TV1)** | **Đáp ứng**: Must-Have #2 (Urgent Deadlines Sliding Window Widget)
- **Mục đích**: Khối widget cảnh báo thông minh trên Trang chủ: quét toàn bộ bài tập và chỉ hiển thị những bài có hạn nộp trong vòng 48 giờ tới.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[isDueWithin48Hours()]`**: Sử dụng hàm tiện ích tính toán chính xác cửa sổ thời gian 48 giờ dựa trên ngày lịch `startOfDay`.
- **`[Badge Đỏ / Hổ phách]`**: Hiển thị huy hiệu 'Gấp' hoặc 'Hạn chót' nổi bật để thúc đẩy sinh viên nộp bài.
- **`[Empty State]`**: Nếu không có bài tập nào sắp đến hạn, hiển thị thông điệp nhẹ nhàng 'Tuyệt vời! Không có bài tập nào sắp hết hạn trong 48h'.

> **🗣️ Lời thoại**: *"File `Due48hWidget.tsx` là tính năng 'cứu cánh' giúp sinh viên không bao giờ bị quên bài. Widget này tự động tính toán cửa sổ trượt 48 giờ để đưa các bài tập khẩn cấp lên đầu trang chủ, giúp sinh viên ưu tiên hoàn thành trước."*

> **🎯 Vấn đáp Thầy Vinh**: *"Nếu một bài tập đã được tick hoàn thành (completed: true) nhưng hạn nộp vẫn nằm trong 48h thì widget có hiển thị không?"* -> *"Dạ thưa Thầy là KHÔNG ạ! Thuật toán lọc trong widget kết hợp 2 điều kiện: `!item.completed && isDueWithin48Hours(item.dueDate)`. Những bài đã xong sẽ tự động ẩn khỏi widget khẩn cấp để sinh viên tập trung vào các bài chưa làm."*

---

#### 📄 `src/components/features/WeeklyCalendar.tsx` — Interactive 7-Day Weekly Calendar Strip
- **Phân tầng**: Feature Component / Calendar View | **Phụ trách**: **Trần Bảo Trâm (TV1)** | **Đáp ứng**: Must-Have #3 (Weekly View Calendar Strip & Dot Indicator)
- **Mục đích**: Thanh dải lịch 7 ngày trong tuần từ Thứ 2 đến Chủ nhật, hỗ trợ chọn ngày xem bài tập và hiển thị chấm tròn trạng thái biểu diễn bài tập.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[Monday-to-Sunday Range]`**: Tự động tính toán mốc ngày bắt đầu từ Thứ Hai của tuần hiện tại đến Chủ Nhật.
- **`[Day Cell TouchTarget >= 44pt]`**: Mỗi ô ngày là một nút bấm vuông vức >= 44pt với số ngày và thứ viết tắt (T2, T3, T4...).
- **`[Status Dot Indicator]`**: Chấm tròn nhỏ màu đỏ cam xuất hiện dưới ô ngày nếu ngày đó có bài tập cần nộp.
- **`[Selected Day Highlight]`**: Ô ngày đang được chọn sẽ đổi sang màu thương hiệu nổi bật để người dùng dễ theo dõi.

> **🗣️ Lời thoại**: *"Component `WeeklyCalendar.tsx` mang đến trải nghiệm lịch tuần chuẩn mực. Lịch trải dài từ Thứ 2 đến Chủ nhật theo đúng thói quen học tập của sinh viên Việt Nam. Chấm tròn trạng thái dưới từng ngày giúp nhìn vào là biết ngay ngày nào có bài tập cần giải quyết."*

> **🎯 Vấn đáp Thầy Vinh**: *"Tại sao lịch tuần của nhóm bắt đầu từ Thứ Hai mà không phải Chủ Nhật như lịch mặc định của Mỹ?"* -> *"Dạ thưa Thầy, theo văn hóa học tập và làm việc tại Việt Nam (chuẩn ISO 8601), tuần học luôn bắt đầu từ Thứ Hai và kết thúc vào Chủ Nhật. Thiết kế này giúp sinh viên theo dõi lịch học một cách trực quan, gần gũi và đúng thực tế nhất."*

---

### PHẦN 4: TẦNG QUẢN TRỊ TRẠNG THÁI & BẢO MẬT PHẦN CỨNG (src/store/)
*Quản lý phiên đăng nhập và token người dùng bằng Zustand kết hợp mã hóa phần cứng expo-secure-store.*

#### 📄 `src/store/authStore.ts` — Hardware Encrypted Zustand Auth Store
- **Phân tầng**: Application / State & Security Store | **Phụ trách**: **Nguyễn Thị Hương Giang (TV2)** | **Đáp ứng**: Must-Have #5 (Auth State Management & Hardware Encryption SecureStore)
- **Mục đích**: Quản lý trạng thái xác thực toàn cục, cam kết lưu trữ token đăng nhập trong phần cứng an toàn Keychain/Keystore qua `expo-secure-store`, tuyệt đối không dùng `AsyncStorage` cho token.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[SecureStore.setItemAsync('auth_token')]`**: Lưu trữ token đăng nhập bằng thuật toán mã hóa phần cứng của hệ điều hành.
- **`[restoreSession()]`**: Đọc lại token khi khởi động app, phục hồi phiên đăng nhập tự động (Survive App Restart).
- **`[login(username, password)]`**: Xác thực thông tin tài khoản mẫu, cấp phát token và lưu thông tin người dùng vào store.
- **`[logout()]`**: Xóa sạch token khỏi SecureStore và đưa trạng thái `user` về `null` an toàn.

> **🗣️ Lời thoại**: *"File `authStore.ts` thể hiện sự nghiêm túc về bảo mật ứng dụng. Nhóm em tuân thủ nghiêm ngặt yêu cầu của Thầy: không bao giờ lưu token xác thực vào AsyncStorage thô mà sử dụng `expo-secure-store` để mã hóa qua Keystore trên Android và Keychain trên iOS."*

> **🎯 Vấn đáp Thầy Vinh**: *"Tại sao không được lưu Token đăng nhập vào AsyncStorage mà bắt buộc phải dùng SecureStore?"* -> *"Dạ thưa Thầy, `AsyncStorage` lưu trữ dữ liệu dưới dạng plain-text (văn bản thô không mã hóa) trong thư mục ứng dụng. Nếu điện thoại bị root, jailbreak hoặc bị phần mềm độc hại tấn công, hacker có thể trích xuất token rất dễ dàng. Ngược lại, `SecureStore` sử dụng chip bảo mật phần cứng chuyên dụng (Secure Enclave / TEE) để mã hóa khóa, đảm bảo an toàn tuyệt đối theo chuẩn bảo mật ngân hàng."*

---

### PHẦN 5: TẦNG DỮ LIỆU MẠNG, CACHE & THÔNG BÁO (src/hooks/)
*Tầng tích hợp Remote API với TanStack Query v5, xử lý Cập nhật lạc quan (Optimistic Update), Đồng bộ Offline và Lập lịch Thông báo Deep Link.*

#### 📄 `src/hooks/useThemeColor.ts` — Dynamic Theme Sensor & Color Resolver Hook
- **Phân tầng**: Infrastructure / Theme Hook | **Phụ trách**: **Trần Bảo Trâm (TV1)** | **Đáp ứng**: Luật Zero-Hex & Single Source of Truth
- **Mục đích**: Lắng nghe chế độ sáng/tối của hệ điều hành hoặc tùy chọn trong cài đặt của người dùng, tự động trả về bộ mã màu tương ứng từ `tokens.ts`.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[useColorScheme()]`**: Cảm biến chế độ màu hệ thống từ React Native.
- **`[useThemeStore]`**: Lấy thiết lập theme mà người dùng chủ động chọn (light, dark, hoặc system).
- **`[ThemeTokens[theme]]`**: Cấp phát bảng màu ngữ nghĩa chính xác cho toàn bộ giao diện.

> **🗣️ Lời thoại**: *"Hook `useThemeColor.ts` giúp ứng dụng tự động hòa nhịp cùng hệ thống. Khi người dùng bật Dark Mode trên điện thoại, hook này lập tức phát tín hiệu đổi màu cho toàn bộ component trong app mà không cần tải lại trang."*

> **🎯 Vấn đáp Thầy Vinh**: *"Nếu người dùng chọn ép buộc chế độ Tối (Dark) trong app nhưng máy đang để Sáng (Light) thì hook này ưu tiên cái nào?"* -> *"Dạ thưa Thầy, hook kiểm tra cấu hình trong `useThemeStore` trước: Nếu người dùng đã chỉ định rõ 'dark' hoặc 'light' thì sẽ ưu tiên lựa chọn của người dùng. Chỉ khi người dùng chọn 'system' thì hook mới lấy theo chế độ `useColorScheme()` của máy."*

---

#### 📄 `src/hooks/useAssignments.ts` — TanStack Query Assignments CRUD & Offline Engine
- **Phân tầng**: Data Layer / Remote API & Cache | **Phụ trách**: **Nguyễn Thị Hương Giang (TV2)** | **Đáp ứng**: Must-Have #1, Kỹ thuật nâng cao (Optimistic Updates & Offline Tolerance)
- **Mục đích**: File dữ liệu trung tâm quản lý toàn bộ vòng đời của Bài tập: Fetch API, Cập nhật lạc quan kèm Rollback tự động khi lỗi mạng, Bộ nhớ đệm ngoại tuyến AsyncStorage và Giám sát kết nối mạng tự động.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[useQuery(['assignments'])]`**: Quản lý việc tải dữ liệu từ MockAPI, lưu cache TanStack Query với retry 2 lần.
- **`[useToggleAssignment (Optimistic Update)]`**: Trong `onMutate`: hủy truy vấn đang chạy, lưu snapshot cache cũ (`previous`), ghi đè trạng thái mới ngay lập tức. Trong `onError`: khôi phục lại đúng `previous`. Trong `onSettled`: gọi `invalidateQueries` để đồng bộ server.
- **`[AsyncStorage Offline Backup]`**: Tự động ghi bản sao dữ liệu vào AsyncStorage kèm mốc thời gian thực mỗi khi có dữ liệu mới.
- **`[useNetworkStore & Listener]`**: Tự động lắng nghe sự kiện mạng (online/offline trên Web và bắt lỗi Fetch trên Mobile) để kích hoạt `isOffline` và `cachedTime`.

> **🗣️ Lời thoại**: *"Kính thưa Thầy, `useAssignments.ts` là đỉnh cao kỹ thuật về tầng dữ liệu trong đồ án của nhóm. Khi sinh viên bấm hoàn thành bài tập, giao diện đổi trạng thái trong 0 mili-giây nhờ Cập nhật lạc quan. Nếu server lỗi hoặc mất mạng, hệ thống tự động hoàn tác (rollback) trạng thái cũ. Khi mất mạng hoàn toàn, app tự chuyển sang đọc AsyncStorage và cập nhật mốc thời gian thực."*

> **🎯 Vấn đáp Thầy Vinh**: *"Em hãy giải thích cơ chế 3 giai đoạn onMutate -> onError -> onSettled trong hàm useToggleAssignment?"* -> *"Dạ thưa Thầy: 1. `onMutate` chạy trước khi request gửi đi: nó chụp lại bản sao cache hiện tại `previous` và ghi đè trạng thái mới lên UI để người dùng thấy phản hồi tức thì. 2. `onError` chạy nếu request thất bại hoặc mất mạng: nó dùng bản `previous` để rollback UI về trạng thái ban đầu, tránh sai lệch. 3. `onSettled` chạy khi request kết thúc (bất kể thành công hay lỗi): nó invalidate query để kéo dữ liệu mới nhất từ server về đồng bộ."*

---

#### 📄 `src/hooks/useCourses.ts` — Courses Data Query Hook
- **Phân tầng**: Data Layer / Courses API | **Phụ trách**: **Nguyễn Thị Hương Giang (TV2)** | **Đáp ứng**: Must-Have #6 (Course Data Management)
- **Mục đích**: Truy vấn danh sách các môn học (Lập trình Mobile, Cơ sở Dữ liệu, Trí tuệ Nhân tạo...), gán mã màu nhận diện thương hiệu cho từng môn.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[useQuery(['courses'])]`**: Fetch danh sách môn học từ API hoặc mock data chuẩn, cache tự động với `staleTime` 5 phút.
- **`[Course Entity]`**: Mỗi môn học gồm `id`, `name`, `code`, `color` và `instructor`.

> **🗣️ Lời thoại**: *"File `useCourses.ts` cung cấp danh sách môn học cho toàn bộ ứng dụng. Danh sách này được cache trong 5 phút để tối ưu hóa hiệu năng và giảm tải số lượng request mạng không cần thiết."*

> **🎯 Vấn đáp Thầy Vinh**: *"Dữ liệu môn học có thay đổi thường xuyên không mà đặt staleTime là 5 phút?"* -> *"Dạ thưa Thầy, thông tin môn học và giảng viên thường cố định trong suốt học kỳ, rất ít khi thay đổi. Đặt `staleTime: 5 phút` là hoàn toàn hợp lý, giúp màn hình Trang chủ và màn hình Lịch mở lên tức thì từ cache mà không cần request lại server mỗi lần chuyển tab."*

---

#### 📄 `src/hooks/useNotifications.ts` — Expo Notifications & Deep Linking Hook
- **Phân tầng**: Infrastructure / Push Notifications | **Phụ trách**: **Trần Bảo Trâm (TV1)** | **Đáp ứng**: Must-Have #4 (Notifications & Deep Linking)
- **Mục đích**: Xin quyền thông báo, lên lịch thông báo nhắc bài tập trước hạn nộp, tạo nút kích hoạt thông báo demo và bắt sự kiện chạm vào thông báo để điều hướng Deep Link.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[requestNotificationPermissions()]`**: Kiểm tra và yêu cầu cấp quyền hiển thị thông báo trên thiết bị.
- **`[scheduleAssignmentNotification()]`**: Lên lịch thông báo dựa trên hạn nộp của bài tập, đính kèm data payload `{ assignmentId: id }`.
- **`[triggerDemoNotification()]`**: Kích hoạt thông báo tức thì sau 2 giây phục vụ buổi thuyết trình demo của Thầy.
- **`[useNotificationListener()]`**: Lắng nghe sự kiện `addNotificationResponseReceivedListener`, trích xuất `assignmentId` và gọi `router.push('/assignments/' + id)`.

> **🗣️ Lời thoại**: *"File `useNotifications.ts` hiện thực trọn vẹn yêu cầu thông báo và Deep Link của Thầy. Nhóm em đã chuẩn bị sẵn hàm `triggerDemoNotification()`: khi bấm nút demo, sau 2 giây một thông báo sẽ xuất hiện trên thanh trạng thái. Khi Thầy bấm vào thông báo đó, ứng dụng sẽ lập tức mở đúng màn hình chi tiết của bài tập tương ứng."*

> **🎯 Vấn đáp Thầy Vinh**: *"Deep Link hoạt động như thế nào khi người dùng bấm vào thông báo?"* -> *"Dạ thưa Thầy, khi lên lịch thông báo bằng `Notifications.scheduleNotificationAsync`, nhóm đính kèm một object `data: { assignmentId: '123' }`. Trong `useNotificationListener`, khi người dùng bấm vào thông báo, listener sẽ bắt được `response.notification.request.content.data`, lấy ra `assignmentId` và dùng `router.push('/assignments/' + assignmentId)` để chuyển thẳng đến màn hình chi tiết bài tập."*

---

### PHẦN 6: KIỂU DỮ LIỆU & HÀM XỬ LÝ THUẦN TÚY (src/types/ & src/utils/)
*Mô hình dữ liệu TypeScript chặt chẽ và các hàm tính toán logic lõi (Pure Functions) xử lý múi giờ và tiến độ môn học.*

#### 📄 `src/types/study.ts` — Core Domain Models & TypeScript Interfaces
- **Phân tầng**: Domain Model / Type Definitions | **Phụ trách**: **Nguyễn Thị Hương Giang (TV2)** | **Đáp ứng**: Tiêu chuẩn Type-Safety & Kiến trúc Phần mềm
- **Mục đích**: Định nghĩa toàn bộ cấu trúc dữ liệu cho Ứng dụng: User, Course, AssignmentItem, CourseProgressStats, đảm bảo tính chặt chẽ về mặt kiểu dữ liệu.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[AssignmentItem interface]`**: Gồm: `id`, `title`, `courseId`, `dueDate`, `completed`, `notes`, `photoUri`.
- **`[Course interface]`**: Gồm: `id`, `name`, `code`, `color`, `instructor`.
- **`[User interface]`**: Gồm: `id`, `username`, `fullName`, `role`, `token`.
- **`[CourseProgressStats interface]`**: Gồm: `courseId`, `total`, `completed`, `percentage` (dữ liệu dẫn xuất).

> **🗣️ Lời thoại**: *"File `study.ts` là bản vẽ thiết kế dữ liệu của cả hệ thống. Việc định nghĩa chặt chẽ TypeScript Interfaces giúp toàn bộ code trong dự án có tính Type-Safety tuyệt đối, loại bỏ hoàn toàn các lỗi cú pháp và lỗi truy cập thuộc tính không tồn tại."*

> **🎯 Vấn đáp Thầy Vinh**: *"Trong AssignmentItem, thuộc tính photoUri có bắt buộc không?"* -> *"Dạ thưa Thầy là không bắt buộc ạ, nó được định nghĩa là `photoUri?: string`. Sinh viên có thể tạo bài tập có ảnh đính kèm hoặc không có ảnh, hệ thống đều xử lý an toàn mà không bị lỗi undefined."*

---

#### 📄 `src/types/testing.d.ts` — Jest & Testing TypeScript Declarations
- **Phân tầng**: Testing / Type Declarations | **Phụ trách**: **Nguyễn Thị Hương Giang (TV2)** | **Đáp ứng**: Automated Testing Infrastructure
- **Mục đích**: Khai báo kiểu cho môi trường kiểm thử Jest và các custom matchers của React Native Testing Library.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[declare global namespace Jest]`**: Cung cấp type hint cho các hàm test `describe`, `it`, `expect`.

> **🗣️ Lời thoại**: *"File `testing.d.ts` phục vụ hạ tầng kiểm thử tự động, giúp mã nguồn test có đầy đủ gợi ý và kiểm tra kiểu nghiêm ngặt trong quá trình viết Unit Test."*

> **🎯 Vấn đáp Thầy Vinh**: *"File .d.ts có được biên dịch vào file chạy ứng dụng (bundle) cuối cùng không?"* -> *"Dạ thưa Thầy là KHÔNG ạ! Các file `.d.ts` chỉ là file khai báo kiểu (Declaration files) phục vụ cho trình biên dịch TypeScript và IDE nhận diện cú pháp, nó sẽ tự động bị lược bỏ hoàn toàn khi đóng gói ứng dụng (bundle)."*

---

#### 📄 `src/utils/dateUtils.ts` — Timezone Boundary & 48-Hour Deadline Pure Functions
- **Phân tầng**: Core Logic / Date Utilities | **Phụ trách**: **Nguyễn Thị Hương Giang (TV2)** | **Đáp ứng**: Must-Have #2, Luật Xử Lý Ngày & Múi Giờ
- **Mục đích**: Chứa các hàm xử lý ngày tháng thuần túy (Pure Functions), đặc biệt là hàm `startOfDay` đưa thời gian về mốc 00:00:00 để so sánh ngày chính xác không bị lệch giờ.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[startOfDay(date)]`**: Đưa mốc thời gian về `00:00:00.000` của ngày địa phương, giải quyết triệt để lỗi so sánh chênh lệch giờ.
- **`[isDueWithin48Hours(dueDateStr, now)]`**: Thuật toán kiểm tra hạn nộp có nằm trong khoảng từ hôm nay đến 48 giờ tới hay không.
- **`[formatDateVi(dateStr)]`**: Định dạng ngày theo chuẩn tiếng Việt: 'Thứ Hai, 15/10/2026'.
- **`[getDaysInMonth(year, month)]`**: Tính toán số ngày trong tháng phục vụ dựng lưới lịch Modal.

> **🗣️ Lời thoại**: *"File `dateUtils.ts` giải quyết một trong những bài toán hóc búa nhất của lập trình Mobile: xử lý múi giờ và ngày lịch. Bằng cách sử dụng hàm `startOfDay()`, nhóm loại bỏ hoàn toàn lỗi cộng 24 giờ chay, đảm bảo hạn chót bài tập luôn chuẩn xác trên mọi thiết bị."*

> **🎯 Vấn đáp Thầy Vinh**: *"Tại sao không lấy Date.now() + 48*60*60*1000 để kiểm tra hạn 48 giờ mà phải dùng startOfDay?"* -> *"Dạ thưa Thầy, nếu sinh viên kiểm tra bài tập lúc 23:30 đêm, bài tập nộp vào 08:00 sáng mốt: Nếu cộng 48 giờ thuần túy theo mili-giây, khoảng cách thời gian có thể bị lệch qua ranh giới ngày. Hàm `startOfDay()` đưa cả hai mốc về 00:00:00 của ngày lịch, đảm bảo so sánh theo ngày dương lịch chuẩn xác 100% không phụ thuộc vào giờ sinh viên mở app."*

---

#### 📄 `src/utils/statsUtils.ts` — Pure Mathematical Progress Computation O(N)
- **Phân tầng**: Core Logic / Mathematical Statistics | **Phụ trách**: **Nguyễn Thị Hương Giang (TV2)** | **Đáp ứng**: Must-Have #6, Luật Dữ liệu Dẫn Xuất
- **Mục đích**: Chứa hàm thuần túy `computeCourseProgress()` tính toán thống kê tiến độ môn học (tổng số bài, số bài xong, tỉ lệ %) với độ phức tạp tối ưu $O(N)$.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[computeCourseProgress(assignments, courseId)]`**: Hàm thuần túy nhận danh sách bài tập và mã môn học, trả về `{ total, completed, percentage }`.
- **`[Edge cases handling]`**: Xử lý an toàn các trường hợp biên: môn học chưa có bài tập nào (trả về 0%, không bị lỗi chia cho 0 `NaN`), hoàn thành 0 bài (0%), hoàn thành toàn bộ (100%).
- **`[Math.round()]`**: Làm tròn phần trăm thành số nguyên đẹp mắt.

> **🗣️ Lời thoại**: *"File `statsUtils.ts` hiện thực thuật toán tính toán tiến độ môn học. Đây là hàm thuần túy (Pure Function) không có tác dụng phụ (no side-effects), độ phức tạp tuyến tính $O(N)$, xử lý hoàn hảo mọi trường hợp biên như danh sách rỗng hay chia cho 0."*

> **🎯 Vấn đáp Thầy Vinh**: *"Nếu một môn học chưa có bài tập nào (total === 0) thì phép tính total > 0 ? Math.round((completed/total)*100) : 0 trả về gì?"* -> *"Dạ thưa Thầy, hàm sẽ kiểm tra điều kiện `total === 0` và trả về ngay số `0%`. Phép kiểm tra này ngăn chặn hoàn toàn lỗi toán học chia cho 0 dẫn đến giá trị `NaN` (Not a Number) làm sập giao diện."*

---

### PHẦN 7: TẦNG KIỂM THỬ TỰ ĐỘNG (DIRECTORY: __tests__/ — JEST)
*Hệ thống kiểm thử tự động toàn diện đạt 10/10 PASS trên 3 Test Suites, bao phủ cả Pure Logic Unit Tests và Component Accessibility Tests.*

#### 📄 `__tests__/statsUtils.test.ts` — Course Progress Statistics Unit Test Suite
- **Phân tầng**: Automated Testing / Logic Unit Test | **Phụ trách**: **Nguyễn Thị Hương Giang (TV2)** | **Đáp ứng**: Tiêu chí Đồ án: Automated Tests (Critical Path Logic)
- **Mục đích**: Kiểm thử tự động hàm tính phần trăm tiến độ môn học với mọi kịch bản và dữ liệu biên phức tạp.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[Test: empty assignments]`**: Xác nhận trả về 0% khi danh sách bài tập rỗng.
- **`[Test: 0 completed out of 5]`**: Xác nhận trả về 0% khi chưa làm bài nào.
- **`[Test: 3 completed out of 4]`**: Xác nhận trả về chính xác 75%.
- **`[Test: all completed]`**: Xác nhận trả về 100% khi làm xong tất cả.
- **`[Test: filter by courseId]`**: Xác nhận hàm chỉ tính bài tập của đúng môn học được yêu cầu, không tính nhầm sang môn khác.

> **🗣️ Lời thoại**: *"Bộ test `statsUtils.test.ts` kiểm tra tính toán toán học của tiến độ môn học. Tất cả 5 ca kiểm thử bao quát từ trường hợp danh sách rỗng, hoàn thành một phần đến hoàn thành toàn bộ đều đạt kết quả PASS 100%."*

> **🎯 Vấn đáp Thầy Vinh**: *"Tại sao em lại chọn hàm computeCourseProgress để viết Unit Test đầu tiên?"* -> *"Dạ thưa Thầy, vì đây là 'Luồng nghiệp vụ trọng yếu' (Critical Path). Tiến độ môn học phản ánh trực tiếp kết quả học tập của sinh viên. Nếu hàm này tính sai, toàn bộ giao diện thanh tiến độ và thống kê sẽ hiển thị sai lệch, nên bắt buộc phải có Unit Test tự động bảo vệ."*

---

#### 📄 `__tests__/dateUtils.test.ts` — Date & Timezone Boundary Unit Test Suite
- **Phân tầng**: Automated Testing / Logic Unit Test | **Phụ trách**: **Nguyễn Thị Hương Giang (TV2)** | **Đáp ứng**: Tiêu chí Đồ án: Automated Tests (Date & Timezone Logic)
- **Mục đích**: Kiểm thử tự động hàm `isDueWithin48Hours` và `startOfDay` để chứng minh thuật toán không bị ảnh hưởng bởi chênh lệch giờ và múi giờ.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[Test: deadline in 12 hours]`**: Xác nhận trả về `true` (nằm trong 48h).
- **`[Test: deadline in 36 hours]`**: Xác nhận trả về `true` (nằm trong 48h).
- **`[Test: deadline in 5 days]`**: Xác nhận trả về `false` (ngoài cửa sổ 48h).
- **`[Test: past deadline]`**: Xác nhận trả về `false` (bài tập đã quá hạn).
- **`[Test: startOfDay normalization]`**: Xác nhận giờ, phút, giây, mili-giây đều được đưa về số 0 chuẩn xác.

> **🗣️ Lời thoại**: *"Bộ test `dateUtils.test.ts` chứng minh tính chính xác của thuật toán thời gian. Bất kể bài tập nộp vào lúc nửa đêm, sáng sớm hay cách 36 tiếng, các bài test đều xác nhận cửa sổ 48 giờ hoạt động hoàn toàn chính xác."*

> **🎯 Vấn đáp Thầy Vinh**: *"Trong bài test dateUtils, làm thế nào để kết quả test không bị sai khi chạy ở các ngày khác nhau trong năm?"* -> *"Dạ thưa Thầy, trong các ca kiểm thử, nhóm truyền vào tham số mốc `now` cố định (hoặc dùng hàm `new Date()`) rồi cộng trừ tương đối ngày từ mốc đó, giúp bài test luôn cho ra kết quả đồng nhất mà không phụ thuộc vào ngày chạy test."*

---

#### 📄 `__tests__/AssignmentCard.test.tsx` — Assignment Card & Touch Target Component Test Suite
- **Phân tầng**: Automated Testing / Component Accessibility Test | **Phụ trách**: **Trần Bảo Trâm (TV1)** | **Đáp ứng**: Tiêu chí Đồ án: Automated Tests (Component Accessibility & Interaction)
- **Mục đích**: Kiểm thử tự động trên Component thực tế: xác minh vùng chạm tối thiểu 44x44pt và sự kiện click vào checkbox.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[Test: minHeight >= 44 & minWidth >= 44]`**: Kiểm tra style của ô checkbox đảm bảo đúng kích thước công thái học ngón tay người dùng.
- **`[Test: fireEvent.press(checkbox)]`**: Mô phỏng ngón tay người dùng bấm vào checkbox và xác minh hàm `onToggle` được gọi đúng 1 lần với đúng `id` bài tập.
- **`[Test: strike-through style]`**: Xác nhận khi `completed: true` thì style chữ có thuộc tính `line-through`.

> **🗣️ Lời thoại**: *"Bộ test `AssignmentCard.test.tsx` là minh chứng bằng code cho việc nhóm tuân thủ Luật Trợ Năng của Thầy. Jest tự động kiểm tra kích thước ô bấm đạt chuẩn tối thiểu 44x44pt và kiểm tra sự kiện bấm checkbox kích hoạt chính xác."*

> **🎯 Vấn đáp Thầy Vinh**: *"Làm thế nào Jest kiểm tra được kích thước minHeight 44pt của component trên môi trường dòng lệnh không có màn hình thật?"* -> *"Dạ thưa Thầy, Jest sử dụng `react-test-renderer` kết hợp thư viện testing để render component thành cây cấu trúc JSON (Virtual Tree). Từ cây này, test runner truy vấn đến node checkbox và kiểm tra thuộc tính `props.style`, xác minh `minHeight >= 44` và `minWidth >= 44`."*

---

### PHẦN 8: CẤU HÌNH DỰ ÁN, SCRIPTS & BÁO CÁO MINH BẠCH (ROOT FILES)
*Các file cấu hình chuẩn, script tự động hóa đóng gói và toàn bộ tài liệu minh bạch theo đúng yêu cầu đồ án của Thầy Nguyễn Xuân Vinh.*

#### 📄 `README.md` — Clean-Machine Setup & Running Documentation
- **Phân tầng**: Documentation / Instructions | **Phụ trách**: **Cả 2 Thành viên** | **Đáp ứng**: Tiêu chuẩn Đồ án: Setup from Clean Machine
- **Mục đích**: Tài liệu hướng dẫn chi tiết từng bước thiết lập và chạy dự án từ một chiếc máy tính hoàn toàn mới (Clean Machine) mà không gặp lỗi.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[Prerequisites]`**: Yêu cầu Node.js >= 18, npm/pnpm, Git.
- **`[Installation commands]`**: `npm install` kèm giải thích script postinstall.
- **`[Run commands]`**: `npm test` chạy 10 test Jest, `npx expo start -c` chạy app.
- **`[Account table]`**: Bảng thông tin tài khoản demo sinh viên và giảng viên.

> **🗣️ Lời thoại**: *"File `README.md` được viết cực kỳ cặn kẽ. Bất kỳ ai tải mã nguồn về trên một chiếc máy tính mới đều có thể chạy thành công dự án chỉ sau 2 câu lệnh cài đặt và khởi động mà không gặp bất kỳ lỗi thiếu thư viện nào."*

> **🎯 Vấn đáp Thầy Vinh**: *"Nếu máy của Thầy chưa cài biến môi trường gì cả thì có chạy được app không?"* -> *"Dạ thưa Thầy có ạ! Dự án sử dụng Expo chuẩn, mọi dependencies đã được liệt kê đầy đủ trong `package.json` và cấu hình cổng đã được tối ưu, Thầy chỉ cần gõ `npm install` rồi `npm start` là app chạy mượt mà ngay trên trình duyệt hoặc điện thoại."*

---

#### 📄 `AI_LOG.md` — Transparent AI Collaboration Log
- **Phân tầng**: Documentation / Transparency | **Phụ trách**: **Cả 2 Thành viên** | **Đáp ứng**: Tiêu chí Đồ án: AI Collaboration Transparency
- **Mục đích**: Nhật ký tương tác AI minh bạch 100%: ghi lại toàn bộ các câu lệnh prompt, những gì nhóm tiếp nhận, những gì nhóm BÁC BỎ và lý do kỹ thuật phản biện AI.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[Accepted prompts]`**: AI đề xuất khung sườn tokens, hàm date math cơ bản.
- **`[Rejected prompts & Critical Thinking]`**: Bác bỏ đề xuất lưu auth token vào AsyncStorage của AI (vì vi phạm bảo mật), Bác bỏ việc AI dùng mã màu hex trực tiếp trong component (vi phạm Luật Zero-Hex).
- **`[Lessons learned]`**: Bài học rút ra về việc làm chủ mã nguồn và không phụ thuộc mù quáng vào AI.

> **🗣️ Lời thoại**: *"File `AI_LOG.md` thể hiện tinh thần liêm chính học thuật và tư duy phản biện của nhóm. Nhóm em ghi lại trung thực toàn bộ quá trình dùng AI, đặc biệt là những lần nhóm phát hiện AI viết code sai bảo mật và chủ động bác bỏ, sửa lại theo chuẩn kỹ thuật phần mềm."*

> **🎯 Vấn đáp Thầy Vinh**: *"Trong quá trình làm đồ án, nhóm em đã bác bỏ đoạn code nào mà AI gợi ý?"* -> *"Dạ thưa Thầy, một trong những lần bác bỏ quan trọng nhất là khi AI gợi ý dùng `AsyncStorage` để lưu token đăng nhập cho nhanh. Nhóm em đã phát hiện ngay đây là lỗ hổng bảo mật nghiêm trọng (Plaintext Token Storage) và bác bỏ hoàn toàn đề xuất đó, thay thế bằng `expo-secure-store` để mã hóa qua Keystore/Keychain của điện thoại."*

---

#### 📄 `REFLECTION.md & OnePage_Reflection.docx` — One-Page Project Reflection
- **Phân tầng**: Documentation / Academic Deliverable | **Phụ trách**: **Cả 2 Thành viên** | **Đáp ứng**: Tiêu chí Đồ án: One-Page Reflection Document
- **Mục đích**: Bản đúc kết 1 trang cô đọng: tổng kết thành quả kỹ thuật, sự cố bảo mật do AI đề xuất và bài học kinh nghiệm trong kỹ thuật phần mềm di động.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[Phần 1: Thành tựu kỹ thuật]`**: Zero-Hex, Touch Target 44pt, Optimistic Update, SecureStore, Jest 10/10.
- **`[Phần 2: Sự cố AI & Phản biện]`**: Phát hiện lỗi bảo mật AsyncStorage vs SecureStore.
- **`[Phần 3: Bài học công nghiệp]`**: Derived State vs Stored State, Atomic UI Components.

> **🗣️ Lời thoại**: *"File `OnePage_Reflection.docx` là bản đúc kết ngắn gọn súc tích trong 1 trang giấy A4 theo đúng chuẩn mực của Thầy. Tài liệu tóm tắt toàn bộ giá trị học thuật và kỹ thuật mà nhóm đã gặt hái được sau đồ án này."*

> **🎯 Vấn đáp Thầy Vinh**: *"Bài học lớn nhất mà nhóm em rút ra sau khi hoàn thành đồ án này là gì?"* -> *"Dạ thưa Thầy, bài học lớn nhất là: 'Kỹ thuật phần mềm di động đòi hỏi tư duy kiến trúc ngay từ đầu'. Không thể vừa nghĩ vừa code bừa bãi. Việc xây dựng Design Tokens, quy ước Touch Target 44pt và phân tách rõ ràng giữa Derived State và Stored State đã giúp ứng dụng của nhóm chạy cực kỳ ổn định và không phát sinh lỗi vặt."*

---

#### 📄 `package.json` — Project Manifest & Dependencies Configuration
- **Phân tầng**: Configuration / Build System | **Phụ trách**: **Cả 2 Thành viên** | **Đáp ứng**: Hạ tầng Dự án & Thư viện Chuẩn
- **Mục đích**: Quản lý toàn bộ thư viện phụ thuộc, scripts thực thi và thông tin định danh của ứng dụng di động.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[Dependencies]`**: expo-router, @tanstack/react-query v5, zustand, expo-secure-store, expo-notifications, expo-image-picker.
- **`[Scripts]`**: `npm start`, `npm test` (chạy Jest test), `npm run android`, `npm run web`.
- **`[Postinstall hook]`**: Chạy script vá tunnel tự động trên Windows.

> **🗣️ Lời thoại**: *"File `package.json` định nghĩa toàn bộ hệ sinh thái công nghệ của app. Tất cả thư viện được chọn lọc kỹ càng, đồng bộ phiên bản tương thích với Expo SDK mới nhất, giúp app chạy ổn định trên mọi nền tảng."*

> **🎯 Vấn đáp Thầy Vinh**: *"Tại sao nhóm dùng TanStack Query v5 mà lại kết hợp thêm cả Zustand?"* -> *"Dạ thưa Thầy, đây là kiến trúc phân tách trạng thái chuẩn mực (State Separation): TanStack Query chuyên trách quản lý Remote Server State (dữ liệu bất đồng bộ từ API, cache, refetch, optimistic update). Còn Zustand chuyên trách quản lý Client State cục bộ (trạng thái theme sáng/tối, phiên đăng nhập người dùng). Việc tách rời giúp app không bị phình to và code rõ ràng từng tầng."*

---

#### 📄 `tsconfig.json & jest.config.js` — TypeScript & Jest Runner Configurations
- **Phân tầng**: Configuration / Compiler & Test Runner | **Phụ trách**: **Nguyễn Thị Hương Giang (TV2)** | **Đáp ứng**: Tiêu chuẩn Type-Check & Testing Rigor
- **Mục đích**: Cấu hình trình biên dịch TypeScript ở mức nghiêm ngặt (`strict: true`) và cấu hình test runner Jest với các module mock.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[tsconfig.json]`**: Kích hoạt `strict: true`, đảm bảo kiểm tra kiểu chặt chẽ và không cho phép lỗi type ngầm định.
- **`[jest.config.js]`**: Cấu hình preset `jest-expo`, ánh xạ module mock cho react-native và AsyncStorage.

> **🗣️ Lời thoại**: *"Hai file cấu hình `tsconfig.json` và `jest.config.js` đảm bảo chất lượng mã nguồn luôn ở mức cao nhất. TypeScript bắt lỗi ngay khi gõ code, còn Jest đảm bảo mọi hàm logic đều chạy đúng như kỳ vọng."*

> **🎯 Vấn đáp Thầy Vinh**: *"Lệnh npx tsc --noEmit của nhóm em chạy có bị lỗi đỏ nào không?"* -> *"Dạ thưa Thầy, 100% không có một lỗi nào ạ! Dự án đã được kiểm tra kỹ qua lệnh `npx tsc --noEmit` và đạt kết quả 0 lỗi (0 errors), mã nguồn hoàn toàn sạch sẽ."*

---

#### 📄 `scripts/create_project_zip.py & scripts/generate_reflection_docx.py` — Project Automation & Packaging Scripts
- **Phân tầng**: Automation / Build Scripts | **Phụ trách**: **Nguyễn Thị Hương Giang (TV2)** | **Đáp ứng**: Tiêu chuẩn Nộp bài & Tự động hóa
- **Mục đích**: Tự động hóa việc tạo file nộp bài ZIP sạch sẽ (loại bỏ node_modules, .git để file nhẹ dưới 1MB) và tự động sinh văn bản báo cáo Word chuẩn mực.

##### 🔍 Điểm Nhấn Kỹ Thuật:
- **`[create_project_zip.py]`**: Quét toàn bộ dự án, lọc bỏ các thư mục rác, tạo file ZIP chuẩn tên `1923050181_1923051154_StudyPlanner.zip`.
- **`[generate_reflection_docx.py]`**: Sử dụng python-docx để tạo bản Word Reflection 1 trang đẹp mắt.

> **🗣️ Lời thoại**: *"Các script trong thư mục `scripts/` giúp tự động hóa toàn bộ quy trình phát hành và đóng gói sản phẩm. Nhờ đó, file ZIP nộp bài của nhóm có dung lượng cực nhẹ chỉ 0.87 MB nhưng chứa đầy đủ 100% mã nguồn và tài liệu của dự án."*

> **🎯 Vấn đáp Thầy Vinh**: *"File ZIP nộp bài của nhóm em có chứa thư mục node_modules nặng hàng trăm MB không?"* -> *"Dạ thưa Thầy là hoàn toàn KHÔNG ạ! Script `create_project_zip.py` đã tự động lọc bỏ `node_modules`, `.git` và `.expo`. File ZIP chỉ nặng 0.87 MB, sạch sẽ và sẵn sàng để Thầy giải nén rồi `npm install` kiểm tra ngay lập tức."*

---

## PHẦN 4: MA TRẬN PHẢN ỨNG NHANH CHO BÀN VẤN ĐÁP (GOLDEN CHEAT-SHEET)

| Câu hỏi / File Thầy chỉ | Người đáp | Dòng code mở ngay | Từ khóa trả lời ghi điểm tuyệt đối |
| :--- | :---: | :--- | :--- |
| Token đăng nhập lưu ở đâu? | TV2 (Giang) | `src/store/authStore.ts` | *Lưu trong chip mã hóa phần cứng SecureStore (Keychain/Keystore), survive app restart, tuyệt đối cấm AsyncStorage.* |
| Dữ liệu bài tập lưu ở đâu? | TV2 (Giang) | `src/hooks/useAssignments.ts` | *Lưu trong bộ nhớ đệm RAM TanStack Query v5 với staleTime 1 phút và retry 2 lần.* |
| Mất mạng dữ liệu lưu ở đâu? | Cả 2 | `src/components/ui/OfflineBanner.tsx` | *Lưu trong AsyncStorage kèm mốc thời gian thực tế hiển thị trên Banner hổ phách.* |
| Optimistic Update hoạt động ra sao? | TV2 (Giang) | `src/hooks/useAssignments.ts` | *onMutate chụp snapshot cache cũ -> onError tự động rollback -> onSettled đồng bộ server.* |
| Tiến độ % lưu ở đâu trong DB? | TV2 (Giang) | `src/utils/statsUtils.ts` | *Không lưu trong DB! Là Derived State O(N) tính toán động để triệt tiêu Data Inconsistency.* |
| Ảnh đính kèm lưu ở đâu? | TV1 (Trâm) | `app/(app)/modal/new-assignment.tsx` | *Lưu đường dẫn Local URI file:/// trong sandbox app, không lưu Base64 tránh nghẽn RAM.* |
| Tại sao không lỗi múi giờ 48h? | TV2 (Giang) | `src/utils/dateUtils.ts` | *Dùng hàm startOfDay đưa thời gian về 00:00:00 ngày lịch địa phương, không cộng trừ mili-giây chay.* |
| Deep Link hoạt động thế nào? | TV1 (Trâm) | `app/_layout.tsx` | *Payload notification chứa assignmentId, Listener ở Root Layout đón nhận điều hướng sang [id].* |
| Luật Zero-Hex hoạt động ra sao? | TV1 (Trâm) | `src/constants/tokens.ts` | *Mã hex tập trung duy nhất ở tokens.ts, UI dùng Semantic Tokens qua useThemeColor đổi Dark Mode tự động.* |
| Vùng chạm 44x44pt ở đâu? | TV1 (Trâm) | `src/components/ui/AccessibleButton.tsx` | *Cố định minHeight/minWidth 44pt tại AccessibleButton và ô checkbox, đạt chuẩn Apple HIG & WCAG 2.1 AA.* |
| StateHandler làm nhiệm vụ gì? | TV2 (Giang) | `src/components/ui/StateHandler.tsx` | *Xử lý đủ 4 trạng thái: Loading, Empty, Error có nút Retry gọi refetch thật sự, và Content.* |
| Tại sao phân tách 4 vùng state? | Cả 2 | `Kiến trúc tổng thể` | *Phân tách Separation of Concerns: Server State (TanStack), Client State (Zustand), Offline (AsyncStorage), Secure (SecureStore).* |

---
*Tài liệu tổng hợp duy nhất phục vụ bảo vệ Đồ án Mobile Final Project — DNTU 2026.*