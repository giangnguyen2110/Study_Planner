# AI_LOG.md — NHẬT KÝ SỬ DỤNG TRỢ LÝ TRÍ TUỆ NHÂN TẠO (AI)

> **Môn học**: Lập trình Mobile (TH7011101 - Lớp 23DTH1)  
> **Dự án**: Final Project — Topic 01: Study Planner  
> **Nhóm sinh viên**: 
> - Trần Bảo Trâm (Thành viên 1)
> - Nguyễn Thị Hương Giang - MSSV: 1923051154 (Thành viên 2)  
> **Quy định môn học**: *"AI_LOG.md is compulsory and is part of the process mark: what you asked, what you accepted, what you rejected and why."*

---

## 1. TỔNG QUAN CHÍNH SÁCH SỬ DỤNG AI CỦA NHÓM
Nhóm sử dụng các trợ lý AI (Gemini, Claude) như một người cộng sự cặp lập trình (Pair Programmer) để hỗ trợ:
- Lên ý tưởng kiến trúc thư mục chuẩn theo Expo Router.
- Viết các hàm logic tính toán thời gian và toán học.
- Hỗ trợ cú pháp TypeScript Strict Mode và cấu hình Jest.

Tất cả các đoạn mã do AI đề xuất đều được nhóm rà soát thủ công, đối chiếu với 6 quy định khắt khe của Thầy Nguyễn Xuân Vinh, thử nghiệm thực tế và refactor lại.

---

## 2. NHẬT KÝ CÁC PHIÊN LÀM VIỆC VỚI AI

### Phiên 1: Khởi tạo kiến trúc Theme Tokens & Trợ năng (Accessibility)
- **Câu hỏi / Prompt của nhóm**:  
  *"Làm thế nào để tạo hệ thống Dark/Light mode trong React Native mà toàn bộ codebase không có bất kỳ mã màu Hex nào ngoài file tokens.ts, đồng thời các nút bấm đều đạt kích thước tối thiểu 44x44 pt?"*
- **Đề xuất từ AI**:  
  AI đề xuất viết file `tokens.ts` chứa bảng màu Light/Dark và tạo một Custom Hook `useThemeColor()`. Đối với component nút bấm, AI gợi ý dùng `TouchableOpacity` bọc `Text` với `minHeight: 44, minWidth: 44`.
- **Phần NHÓM CHẤP NHẬN**:  
  Nhóm áp dụng cấu trúc `Colors.light` và `Colors.dark`, đồng thời viết `AccessibleButton.tsx` với đầy đủ `accessibilityRole="button"` và `accessibilityLabel`.
- **Phần NHÓM TỪ CHỐI (REJECTED) & LÝ DO**:  
  ❌ **Từ chối**: Ban đầu AI gợi ý dùng thư viện `react-native-paper` hoặc `styled-components` để quản lý theme.  
  👉 **Lý do từ chối**: Thầy Vinh yêu cầu chỉ sử dụng Function Components và Hooks thuần túy của React Native & Expo Router. Cài thêm thư viện theme bên thứ ba sẽ làm nặng bundle, dễ gây xung đột phiên bản với React 19 và không chứng minh được nhóm tự làm chủ Design Tokens.

---

### Phiên 2: Xây dựng Auth Session và Quản lý State
- **Câu hỏi / Prompt của nhóm**:  
  *"Thiết kế Auth Store bằng Zustand và lưu token xác thực người dùng để app tắt đi bật lại vẫn nhớ đăng nhập, khi đăng xuất thì xóa sạch."*
- **Đề xuất từ AI**:  
  AI viết một đoạn code dùng Zustand middleware `persist` kết hợp với `AsyncStorage` để lưu toàn bộ state gồm token và user.
- **Phần NHÓM CHẤP NHẬN**:  
  Nhóm chấp nhận mô hình Zustand với các hàm `signIn`, `signOut`, `restoreSession` và việc sử dụng các Selectors (`selectIsAuthenticated`, `selectCurrentUser`).
- **Phần NHÓM TỪ CHỐI (REJECTED) & LÝ DO (ĐIỂM NHẤN QUAN TRỌNG)**:  
  ❌ **Từ chối quyết liệt**: AI đề xuất dùng `AsyncStorage` để lưu Auth Token:  
  `await AsyncStorage.setItem('authToken', token);`  
  👉 **Lý do từ chối**: Đây là lỗi bảo mật "tử huyệt" bị Thầy Vinh cấm tuyệt đối trong Lab 08 và Đề tài cuối kỳ! `AsyncStorage` lưu trữ Plain Text không mã hóa, rất nguy hiểm. Nhóm đã tự tay sửa lại thành **`expo-secure-store`** (`SecureStore.setItemAsync(TOKEN_KEY, token)`), đảm bảo token được mã hóa phần cứng an toàn tuyệt đối.

---

### Phiên 3: Xử lý Ngày tháng & Timezone ("Due Tomorrow" Logic)
- **Câu hỏi / Prompt của nhóm**:  
  *"Làm thế nào để hàm kiểm tra bài tập 'Hạn ngày mai' (isDueTomorrow) cho kết quả chính xác dù người dùng kiểm tra lúc 23:30 đêm hay lúc 08:00 sáng?"*
- **Đề xuất từ AI**:  
  AI ban đầu đưa ra công thức tính bằng khoảng cách mili-giây thô:  
  `const diff = dueDate.getTime() - Date.now(); return diff > 0 && diff <= 24 * 60 * 60 * 1000;`
- **Phần NHÓM TỪ CHỐI (REJECTED) & LÝ DO**:  
  ❌ **Từ chối**: Đoạn mã trên của AI bị sai logic nghiêm trọng về mặt thực tế! Nếu kiểm tra lúc 23:30 đêm hôm nay, một bài tập có hạn lúc 08:00 sáng ngày mai (cách nhau chỉ 8.5 tiếng) sẽ rơi vào khoảng 24h và bị tính là "hạn trong ngày", trong khi về mặt lịch trình nó là "Hạn ngày mai". Ngược lại, một bài tập hạn 23:00 đêm mai (cách 23.5 tiếng) lại có thể bị trượt ra ngoài ranh giới nếu thời gian lệch múi giờ.  
  👉 **Cách nhóm sửa lại**: Nhóm đã yêu cầu AI bỏ cách tính mili-giây thô và xây dựng hàm `startOfDay(date)`: Đưa cả 2 mốc thời gian về `00:00:00.000` của ngày địa phương, sau đó so sánh ngày mục tiêu với `today + 1 ngày`. Nhờ đó, dù kiểm tra lúc 08:00 sáng hay 23:30 đêm thì kết quả đều nhất quán 100%.

---

### Phiên 4: Cập nhật Lạc quan (Optimistic Update) và Rollback
- **Câu hỏi / Prompt của nhóm**:  
  *"Cấu hình useMutation trong TanStack Query v5 để khi tick hoàn thành bài tập, giao diện đổi ngay lập tức và tự phục hồi nếu mất mạng."*
- **Đề xuất từ AI**:  
  AI cung cấp cấu trúc `onMutate`, `onError`, `onSettled`. Trong `onMutate`, hủy các query đang chạy (`cancelQueries`), chụp lại snapshot (`previous`) và cập nhật cache bằng `setQueryData`. Nếu lỗi, `onError` sẽ nạp lại snapshot `previous`.
- **Phần NHÓM CHẤP NHẬN**:  
  Nhóm chấp nhận 100% giải pháp này vì đúng chuẩn TanStack Query v5 chính thức và đã viết thêm cơ chế ghi vào `AsyncStorage` để giữ dữ liệu ngoại tuyến.

---

## 3. BẢNG TỔNG KẾT CÁC LẦN TỪ CHỐI ĐỀ XUẤT CỦA AI

| STT | Đề xuất ban đầu của AI | Quyết định của nhóm | Lý do từ chối & Hướng khắc phục |
| :---: | :--- | :---: | :--- |
| 1 | Lưu Token đăng nhập vào `AsyncStorage` | **TỪ CHỐI** | Vi phạm luật bảo mật của Thầy Vinh. Đổi sang dùng `expo-secure-store` để mã hóa Keychain/Keystore. |
| 2 | Dùng mã màu Hex trực tiếp trong StyleSheet | **TỪ CHỐI** | Vi phạm Luật Zero-Hex của đồ án. Bắt buộc chuyển đổi toàn bộ màu sắc qua `useThemeColor()` từ `tokens.ts`. |
| 3 | Tính toán Timezone 'Due tomorrow' bằng chênh lệch mili-giây thô ($< 24h$) | **TỪ CHỐI** | Sai lệch logic giữa sáng sớm và đêm muộn. Sửa lại chuẩn hóa theo `startOfDay()` đầu ngày địa phương. |
| 4 | Dùng Redux Toolkit và RTK Query | **TỪ CHỐI** | Cồng kềnh, vi phạm yêu cầu công nghệ (Đề bài yêu cầu Zustand cho Shared State và TanStack Query cho Server Data). |
| 5 | Dùng Class Components trong màn hình Modal | **TỪ CHỐI** | Vi phạm tiêu chí đề bài: *"Function components and hooks only"*. Viết lại 100% bằng React Hooks. |
