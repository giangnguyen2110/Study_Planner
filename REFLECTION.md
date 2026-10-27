# ONE-PAGE REFLECTION — BẢN ĐÚC KẾT DỰ ÁN CUỐI KỲ

> **Môn học**: Lập trình Mobile (TH7011101 - Lớp 23DTH1)  
> **Dự án**: Final Project — Topic 01: Study Planner  
> **Nhóm sinh viên**: 
> - Trần Bảo Trâm (Thành viên 1)
> - Nguyễn Thị Hương Giang - MSSV: 1923051154 (Thành viên 2)  
> **Yêu cầu của Thầy**: *"A one-page reflection: what you would do differently, and one thing an AI assistant got wrong that you caught."*

---

## 1. NHỮNG ĐIỀU NHÓM SẼ LÀM KHÁC ĐI NẾU BẮT ĐẦU LẠI DỰ ÁN (WHAT WE WOULD DO DIFFERENTLY)

Nếu có cơ hội được bắt đầu lại dự án này từ Ngày 01 thay vì giai đoạn nước rút, nhóm chúng em sẽ thực hiện 3 cải tiến chiến lược sau:

1. **Khóa chặt Contract Dữ liệu (API Schema & Types) trước khi gõ dòng code UI đầu tiên**:
   - Ở giai đoạn đầu, hai thành viên bắt đầu làm việc hơi song song trong khi mô hình dữ liệu của bài tập (`Assignment`) chưa được định nghĩa hoàn toàn đồng nhất giữa trường `dueDate` hay `dueAt`, và `photo` hay `photoUri`. Việc này khiến nhóm mất khoảng nửa ngày để refactor và đồng bộ lại các Custom Hook. Nếu làm lại, nhóm sẽ dành trọn 2 tiếng đầu tiên chỉ để thống nhất file `src/types/study.ts` và tạo Mock API chuẩn mực trước.
2. **Thiết lập Pipeline Tự động hóa Kiểm thử (Automated Test Pipeline) ngay từ Commit #1**:
   - Nhóm viết các file mã nguồn giao diện trước, sau đó mới quay lại cấu hình Jest và viết test. Việc này khiến một số component khi render trong môi trường test bị thiếu mock của React Native. Nếu làm lại, nhóm sẽ áp dụng phương pháp TDD (Test-Driven Development) hoặc chí ít là cấu hình Jest xanh lét ngay từ commit khởi tạo dự án để không bị tốn thời gian debug cấu hình về sau.
3. **Phân tách State quản lý bộ lọc (Filter State) vào Zustand sớm hơn**:
   - Ở phiên bản đầu, bộ lọc theo môn học và trạng thái được lưu ở Local State (`useState`) bên trong màn hình `schedule.tsx`. Điều này khiến việc khi người dùng bấm vào một môn học từ màn hình Dashboard để chuyển qua xem danh sách của riêng môn đó gặp chút khó khăn. Nhóm đã nhận ra và hiểu sâu sắc lý do tại sao Thầy Vinh luôn nhấn mạnh sự khác biệt giữa Local State và Shared State trong Zustand.

---

## 2. MỘT LỖI SAI CỦA TRỢ LÝ AI MÀ NHÓM ĐÃ TỰ TAY BẮT ĐƯỢC (ONE THING AN AI GOT WRONG THAT WE CAUGHT)

Trong suốt quá trình phát triển dự án cùng AI, tình huống sai sót điển hình và nguy hiểm nhất mà nhóm đã tự phát hiện và sửa được chính là **Lỗ hổng lưu trữ Auth Token trong `AsyncStorage`**:

### Chi tiết tình huống:
Khi nhóm yêu cầu AI hỗ trợ viết Store quản lý đăng nhập cho ứng dụng Study Planner với yêu cầu *"App tắt đi bật lại vẫn nhớ tài khoản và khi đăng xuất thì dọn sạch session"*, trợ lý AI đã tự động sinh ra đoạn mã sử dụng middleware `persist` của Zustand với cấu hình mặc định:

```typescript
// ĐOẠN CODE SAI LẦM DO AI SINH RA:
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
    }),
    {
      name: 'auth-storage',
      getStorage: () => AsyncStorage, // ❌ LỖI BẢO MẬT TỬ HUYỆT!
    }
  )
);
```

### Tại sao đoạn mã trên của AI lại sai nghiêm trọng?
1. **Vi phạm tiêu chí bảo mật của Thầy Nguyễn Xuân Vinh**: Trong bài Lab 08 và Handout của Đồ án, Thầy đã ghi rõ bằng chữ in hoa: *"Secrets in SecureStore only. A sign-in screen, a session store, and the token in SecureStore — never in AsyncStorage"*.
2. **Bản chất kỹ thuật**: `AsyncStorage` trong React Native chỉ là một file SQLite hoặc SharedPreferences không được mã hóa. Bất kỳ ai có quyền root trên điện thoại hoặc các ứng dụng độc hại đều có thể dễ dàng đọc trộm chuỗi JWT Token và mạo danh sinh viên.
3. **Hậu quả nếu nhóm không phát hiện**: Nếu nhóm nộp đoạn mã này của AI lên chấm thi, Thầy Vinh sẽ trừ toàn bộ điểm của phần Xác thực (Auth) vì vi phạm lỗi kiến trúc căn bản đã được dặn dò trên lớp.

### Nhóm đã tự tay bắt lỗi và sửa lại ra sao?
Nhóm đã kiên quyết từ chối giải pháp này của AI và tự tay viết lại toàn bộ tầng lưu trữ bằng thư viện **`expo-secure-store`**:
- Token được lưu qua `SecureStore.setItemAsync('study_planner_auth_token', token)` sử dụng Keychain (iOS) và Keystore (Android) được mã hóa phần cứng AES-256.
- Viết riêng hàm `restoreSession()` để khôi phục phiên khi app khởi động, đảm bảo session sống sót qua các lần restart mà không bao giờ để lộ token dưới dạng Plain Text.

---

## 3. LỜI KẾT
Dự án Study Planner đã giúp nhóm chúng em không chỉ nâng cao kỹ năng lập trình di động với Expo SDK 57 và React 19, mà quan trọng hơn là rèn luyện được **tư duy phản biện công nghệ**: Biết sử dụng AI như một công cụ hỗ trợ thông minh, nhưng tuyệt đối không phụ thuộc mù quáng, luôn làm chủ từng dòng mã nguồn và bảo vệ sản phẩm bằng chính kiến thức thật của mình!
