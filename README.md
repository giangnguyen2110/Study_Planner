# STUDY PLANNER — ỨNG DỤNG QUẢN LÝ KẾ HOẠCH HỌC TẬP SINH VIÊN

> **Môn học**: Lập trình Mobile (TH7011101 - Lớp 23DTH1)  
> **Trường**: Đại học Công nghệ Đồng Nai (DNTU) — Khoa Công nghệ Thông tin  
> **Giảng viên**: Thầy Nguyễn Xuân Vinh  
> **Nhóm thực hiện**: 
> - **Thành viên 1**: Trần Bảo Trâm (Frontend UI/UX, Navigation & Notification)
> - **Thành viên 2**: Nguyễn Thị Hương Giang - MSSV: 1923051154 (Data Layer, State, Auth, Offline & Logic)
> - **Repository**: `https://github.com/giangnguyen2110/Study_Planner.git`

---

## 📱 GIỚI THIỆU SẢN PHẨM

**Study Planner** là ứng dụng di động hỗ trợ sinh viên quản lý từ 5–7 môn học cùng một lúc, thường xuyên tra cứu lịch học, bài tập, hạn chót và nhận thông báo nhắc nhở khi di chuyển giữa các giảng đường.

### 🌟 Các tính năng nổi bật:
1. **Xác thực phiên an toàn (Auth Session)**: Đăng nhập/Đăng xuất. Phiên đăng nhập sống sót qua các lần tắt/mở lại app (Survive App Restart). Token được bảo mật tuyệt đối trong **`SecureStore`**. Đăng xuất dọn sạch token và cache.
2. **Quản lý Môn học & Bài tập (Remote API CRUD)**: Tải dữ liệu từ Remote API, hỗ trợ tạo mới và chỉnh sửa trực tiếp trên app.
3. **Hai chế độ xem Lịch trình (Weekly View & List View)**: Xem lịch theo tuần 7 ngày (Thứ 2 $\to$ CN) hoặc xem dạng danh sách, kèm bộ lọc theo môn học và trạng thái nộp bài.
4. **Nhắc nhở hạn chót & Deep Linking**: Thông báo cục bộ (`expo-notifications`). Bấm vào thông báo sẽ mở thẳng vào màn hình chi tiết bài tập (`/assignments/[id]`).
5. **Thống kê tiến độ động (Computed Progress)**: Tỉ lệ hoàn thành %, số bài đã nộp/còn lại theo từng môn học được tính toán động (computed), không lưu cứng trong DB.
6. **Khả năng hoạt động Ngoại tuyến (Offline Tolerance)**: Khi mất mạng, app hiển thị dữ liệu lưu gần nhất từ `AsyncStorage` kèm banner: *"⚠️ Đang xem dữ liệu ngoại tuyến lưu lúc <thời gian>"*.
7. **Đính kèm ảnh bài học (Photo Attachment)**: Chụp/chọn ảnh ghi chú viết tay hoặc bảng bài giảng đính kèm vào bài tập (`expo-image-picker`).
8. **Widget tóm tắt 48 giờ**: Khối thông tin nổi bật trên trang chủ hiển thị các deadline sắp đến hạn trong vòng 48 giờ tới.
9. **Cập nhật lạc quan (Optimistic Updates)**: Tick hoàn thành bài tập đổi trạng thái tức thì trên UI, tự động rollback khôi phục nếu API lỗi hoặc mất mạng.

---

## 🛠️ YÊU CẦU MÔI TRƯỜNG & HƯỚNG DẪN CÀI ĐẶT

### 1. Yêu cầu tiên quyết
- **Node.js**: Phiên bản LTS (v20.x hoặc v22.x).
- **npm**: Phiên bản 10.x trở lên.
- **Thiết bị chạy**: Điện thoại thật có cài app **Expo Go** (Android/iOS) hoặc chạy trực tiếp trên Trình duyệt Web / Android Emulator.

### 2. Các bước khởi chạy dự án từ máy sạch
```bash
# Bước 1: Clone mã nguồn từ GitHub
git clone https://github.com/giangnguyen2110/Study_Planner.git
cd Study_Planner

# Bước 2: Cài đặt toàn bộ dependencies theo lockfile
npm install

# Bước 3: Khởi động ứng dụng Expo
npx expo start
```

### 3. Phím tắt khi chạy Expo:
- Bấm phím **`w`**: Mở ứng dụng trên trình duyệt Web.
- Bấm phím **`a`**: Mở trên máy ảo Android Emulator.
- Quét mã QR trên terminal bằng app **Expo Go** trên điện thoại để trải nghiệm trực tiếp.

---

## 🧪 CHẠY KIỂM THỬ TỰ ĐỘNG & KIỂM TRA KIỂU

Dự án tuân thủ nghiêm ngặt chuẩn TypeScript Strict Mode và có đủ 3 bộ kiểm thử tự động (Jest):
```bash
# 1. Kiểm tra toàn bộ kiểu TypeScript (0 lỗi)
npm run typecheck

# 2. Chạy toàn bộ 3 bài test tự động (Pure Logic, Component, Critical Path)
npm test
```

---

## 📂 CẤU TRÚC THƯ MỤC DỰ ÁN

```
StudyPlanner/
├── app/                                # Cấu trúc điều hướng Expo Router (File-based routing)
│   ├── _layout.tsx                     # Root Layout: QueryClientProvider, Notification Listener, Session Restore
│   ├── +not-found.tsx                  # Màn hình lỗi 404 chuẩn
│   ├── (auth)/                         # Nhóm route xác thực
│   │   ├── _layout.tsx
│   │   └── sign-in.tsx                 # Màn hình đăng nhập (có nút demo nhanh)
│   └── (app)/                          # Nhóm route chính (Protected: yêu cầu đăng nhập)
│       ├── _layout.tsx                 # App stack & route protection redirect
│       ├── (tabs)/                     # Thanh điều hướng Bottom Tabs
│       │   ├── _layout.tsx
│       │   ├── index.tsx               # Màn hình Home (Dashboard, 48h Widget, Quick Stats)
│       │   ├── schedule.tsx            # Màn hình Lịch trình (Weekly Calendar & List View)
│       │   └── courses.tsx             # Màn hình Môn học (Tiến độ % & Nút Đăng xuất)
│       ├── assignments/
│       │   └── [id].tsx                # Dynamic Route: Chi tiết bài tập (Hỗ trợ Deep Link)
│       └── modal/
│           └── new-assignment.tsx      # Modal Route: Thêm bài tập mới & đính kèm ảnh
├── src/
│   ├── components/
│   │   ├── features/                   # AssignmentCard, Due48hWidget, WeeklyCalendar
│   │   └── ui/                         # ThemedText, ThemedView, AccessibleButton (44x44), StateHandler, OfflineBanner
│   ├── constants/
│   │   └── tokens.ts                   # FILE DUY NHẤT chứa mã màu Hex (Zero-Hex Law), Spacing, TouchTarget
│   ├── hooks/                          # useAssignments, useCourses, useNotifications, useThemeColor
│   ├── store/
│   │   └── authStore.ts                # Zustand Auth Store + SecureStore + Selectors
│   ├── types/                          # Định nghĩa kiểu dữ liệu Course, Assignment, User
│   └── utils/                          # dateUtils.ts (Timezone chuẩn), statsUtils.ts (Computed Stats)
├── __tests__/                          # 3 bộ kiểm thử tự động (Jest)
│   ├── dateUtils.test.ts               # Test 1: Pure-logic test (Timezone & 'Due tomorrow')
│   ├── AssignmentCard.test.tsx         # Test 2: Component test (Accessibility & UI)
│   └── statsUtils.test.ts              # Test 3: Critical-path test (Tính toán % tiến độ môn học)
├── AI_LOG.md                           # Nhật ký sử dụng trợ lý AI của nhóm
├── REFLECTION.md                       # Bản đúc kết kinh nghiệm & 1 lỗi AI đã bắt được
└── README.md                           # Tài liệu hướng dẫn sử dụng này
```
