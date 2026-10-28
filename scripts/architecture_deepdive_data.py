# -*- coding: utf-8 -*-
"""
Database of 12 Core Architectural, Data Storage, Lifecycle, and Viva Defense Issues
for the Study Planner Mobile Final Project (DNTU - GV: Thầy Nguyễn Xuân Vinh).
"""

PROJECT_METADATA = {
    "topic": "Đề tài 01: Ứng dụng Quản lý Kế hoạch Học tập & Lịch học (Study Planner)",
    "course": "Lập trình Mobile (Mã học phần: TH7011101 - Lớp: 23DTH1)",
    "university": "Trường Đại học Công nghệ Đồng Nai (DNTU) — Khoa Công nghệ Thông tin",
    "instructor": "Thầy Nguyễn Xuân Vinh",
    "member1": "Trần Bảo Trâm — MSSV: 1923050181 (Thành viên 1: Lead UI/UX, Design Tokens, Navigation, Lịch tuần, Notifications)",
    "member2": "Nguyễn Thị Hương Giang — MSSV: 1923051154 (Thành viên 2: Lead Data Layer, Zustand, SecureStore, TanStack Query, Offline Cache, Logic & Tests)",
    "version": "Release v1.0.0 — Tháng 10/2026",
    "repo": "https://github.com/giangnguyen2110/Study_Planner.git"
}

ARCHITECTURAL_ISSUES = [
    {
        "id": "issue_01",
        "num": 1,
        "title": "DỮ LIỆU ĐĂNG NHẬP (AUTH TOKEN & SESSION) ĐƯỢC LƯU Ở ĐÂU? TẠI SAO CẤM DÙNG ASYNCSTORAGE?",
        "category": "Bảo Mật Phần Cứng & Quản Trị Phiên (Security & Auth)",
        "owner": "Nguyễn Thị Hương Giang (TV2)",
        "requirement": "Must-Have #5 (Auth State Management & Hardware Encryption)",
        "problem_statement": "Trong ứng dụng di động, việc lưu trữ token xác thực (JWT/Auth Token) quyết định trực tiếp tới an toàn tài khoản sinh viên. Nếu lưu sai chỗ, kẻ tấn công hoặc phần mềm độc hại có thể đánh cắp token để giả mạo người dùng.",
        "storage_location": "Nằm trong chip mã hóa phần cứng của thiết bị qua thư viện `expo-secure-store`:\n- Trên iOS: Lưu trong Apple Keychain (mã hóa cấp hệ điều hành Secure Enclave).\n- Trên Android: Lưu trong Android Keystore / KeyStore TEE (Trusted Execution Environment).\n- File hiện thực: `src/store/authStore.ts`.",
        "why_not_alternative": "TẠI SAO CẤM DÙNG ASYNCSTORAGE:\nAsyncStorage lưu dữ liệu dưới dạng văn bản thô (Plaintext JSON) trong sandbox thư mục của app. Nếu điện thoại bị root (Android) hoặc jailbreak (iOS), hoặc bị mã độc đọc file hệ thống, token sẽ bị trích xuất dễ dàng (Lỗ hổng Plaintext Token Storage). Trong quá trình phát triển, AI từng đề xuất dùng AsyncStorage cho nhanh, nhưng nhóm đã chủ động BÁC BỎ đề xuất này và thay thế bằng `expo-secure-store`.",
        "technical_mechanism": [
            ("Lưu token an toàn", "`await SecureStore.setItemAsync('auth_token', token);` mã hóa và cất giữ token vào phần cứng."),
            ("Survive App Restart", "Khi người dùng đóng hẳn app hoặc khởi động lại điện thoại, hàm `restoreSession()` tại Root Layout `app/_layout.tsx` tự động đọc lại token hợp lệ và duy trì phiên đăng nhập mà không bắt đăng nhập lại."),
            ("Đăng xuất an toàn", "`await SecureStore.deleteItemAsync('auth_token');` xóa sạch dấu vết mã hóa khi người dùng bấm Đăng xuất.")
        ],
        "speech": "Kính thưa Thầy, về vấn đề lưu trữ dữ liệu đăng nhập: Nhóm em tuyệt đối KHÔNG lưu token vào AsyncStorage như các đoạn mã trôi nổi trên mạng. Toàn bộ Auth Token và phiên đăng nhập được mã hóa qua `expo-secure-store`, tận dụng chip bảo mật phần cứng Keychain trên iOS và Keystore trên Android. Nhờ đó, ứng dụng vừa duy trì được phiên đăng nhập khi khởi động lại máy (Survive App Restart), vừa chống lại được mọi nguy cơ trích xuất token khi máy bị root.",
        "viva_qna": {
            "question": "Nếu Thầy mở file hệ thống của điện thoại đã root ra xem, Thầy có đọc được token đăng nhập của app em không?",
            "answer": "Dạ thưa Thầy là KHÔNG THỂ ạ! Vì `expo-secure-store` lưu khóa và dữ liệu trong phần cứng bảo mật riêng (TEE / Secure Enclave) của chip xử lý điện thoại. Dữ liệu khi lưu đã được mã hóa bằng thuật toán cấp quân sự (AES-256), nên dù máy có bị root thì hacker cũng chỉ thấy chuỗi mã hóa vô nghĩa chứ không đọc được token gốc."
        }
    },
    {
        "id": "issue_02",
        "num": 2,
        "title": "DỮ LIỆU BÀI TẬP & MÔN HỌC (SERVER STATE) ĐƯỢC LƯU Ở ĐÂU? QUẢN LÝ VÒNG ĐỜI CACHE RA SAO?",
        "category": "Dữ Liệu Mạng & Bộ Nhớ Đệm (Remote API & Caching)",
        "owner": "Nguyễn Thị Hương Giang (TV2)",
        "requirement": "Must-Have #1, Kỹ thuật nâng cao (TanStack Query v5 Server State)",
        "problem_statement": "Nếu mỗi lần người dùng chuyển màn hình, ứng dụng lại gửi một request mạng lên server để lấy lại danh sách bài tập thì sẽ gây tốn băng thông, tiêu hao pin và làm giật lag giao diện (màn hình trắng loading liên tục).",
        "storage_location": "Được lưu trữ trong Bộ nhớ đệm RAM (In-Memory Cache) của TanStack Query v5 (`QueryClient`) thông qua Custom Hook `useAssignments()` và `useCourses()`.\n- File cấu hình: `app/_layout.tsx` và `src/hooks/useAssignments.ts`.",
        "why_not_alternative": "TẠI SAO DÙNG TANSTACK QUERY THAY VÌ REDUX/ZUSTAND CHO DỮ LIỆU MẠNG:\nRedux hay Zustand chỉ là kho chứa tĩnh (Client Store). Nếu lưu dữ liệu mạng vào Zustand, ta phải tự viết thủ công logic chống gửi trùng request (Request Deduplication), tự tính thời gian hết hạn (Stale Time), tự viết hàm gọi lại khi mạng chập chờn (Retry Logic). TanStack Query là thư viện chuẩn công nghiệp chuyên trị Server State, tự động giải quyết toàn bộ các bài toán này chỉ với vài dòng cấu hình.",
        "technical_mechanism": [
            ("Cấu hình QueryClient", "`retry: 2` (tự động thử lại 2 lần nếu mất kết nối mạng), `staleTime: 60000` (dữ liệu được xem là 'tươi mới' trong 1 phút, không fetch lại thừa thãi)."),
            ("Background Refetch", "Khi người dùng mở lại app từ chạy ngầm hoặc kết nối mạng trở lại, TanStack Query tự động kéo dữ liệu mới ngầm dưới nền mà không làm gián đoạn trải nghiệm người dùng."),
            ("Query Key Separation", "Tách bạch khóa cache: `['assignments']` cho bài tập, `['courses']` cho môn học, `['assignments', id]` cho chi tiết bài tập.")
        ],
        "speech": "Dữ liệu bài tập và môn học được quản lý độc lập tại tầng Data Layer bằng TanStack Query v5. Dữ liệu được lưu trong bộ nhớ đệm RAM với thời gian tươi mới là 1 phút và cơ chế tự động thử lại 2 lần. Khi chuyển đổi qua lại giữa Trang chủ và Lịch học, dữ liệu xuất hiện ngay trong 0 mili-giây từ cache mà không cần hiển thị vòng xoay loading gây ức chế cho sinh viên.",
        "viva_qna": {
            "question": "Tại sao trong app/_layout.tsx nhóm em lại bọc toàn bộ ứng dụng bằng QueryClientProvider?",
            "answer": "Dạ thưa Thầy, `app/_layout.tsx` là component gốc cao nhất của Expo Router, không bao giờ bị unmount trong suốt vòng đời của app. Đặt `QueryClientProvider` tại đây giúp toàn bộ các màn hình con ở bất kỳ đâu đều chia sẻ chung một thể hiện cache duy nhất, đảm bảo tính đồng nhất dữ liệu và duy trì bộ nhớ đệm liên tục."
        }
    },
    {
        "id": "issue_03",
        "num": 3,
        "title": "KHI MẤT MẠNG (OFFLINE), DỮ LIỆU ĐƯỢC LƯU Ở ĐÂU VÀ HOẠT ĐỘNG RA SAO?",
        "category": "Dung Lỗi Ngoại Tuyến & Bộ Nhớ Đệm Cục Bộ (Offline Tolerance)",
        "owner": "Cả 2 Thành viên (TV2: AsyncStorage & Hook; TV1: OfflineBanner UI)",
        "requirement": "Kỹ thuật nâng cao (Offline Tolerance & Real-time Timestamp)",
        "problem_statement": "Khi sinh viên vào phòng học mất sóng Wi-Fi hoặc tắt 4G, nếu ứng dụng báo lỗi đỏ hoặc sập màn hình thì sẽ ảnh hưởng nghiêm trọng đến việc ôn tập. Ứng dụng phải tự động thích ứng và bảo toàn dữ liệu ngoại tuyến.",
        "storage_location": "Được lưu trữ bền vững trong `@react-native-async-storage/async-storage` dưới 2 khóa định danh:\n1. `cached_assignments_list`: Chuỗi JSON lưu toàn bộ mảng bài tập hiện tại.\n2. `cached_assignments_timestamp`: Chuỗi thời gian thực tế dạng `HH:MM:SS` ghi nhận thời điểm lưu gần nhất.\n- File hiện thực: `src/hooks/useAssignments.ts` và `src/components/ui/OfflineBanner.tsx`.",
        "why_not_alternative": "TẠI SAO Ở ĐÂY LẠI DÙNG ASYNCSTORAGE MÀ KHÔNG DÙNG SECURESTORE:\nVì dữ liệu bài tập và danh sách hạn nộp là thông tin phi bảo mật (không phải mật khẩu hay thẻ tín dụng). `AsyncStorage` được thiết kế tối ưu cho việc đọc/ghi mảng dữ liệu JSON có kích thước lớn. Dùng SecureStore cho mảng dữ liệu lớn sẽ làm giảm tốc độ đọc ghi do chi phí giải mã phần cứng không cần thiết.",
        "technical_mechanism": [
            ("Tự động sao lưu ngầm", "Mỗi khi TanStack Query tải thành công dữ liệu mới từ API, hàm `cacheAssignmentsOffline(data)` lập tức ghi đè bản sao mới nhất vào AsyncStorage."),
            ("Tự động chuyển nguồn khi mất mạng", "Khi phát hiện mất kết nối (qua trình lắng nghe mạng hoặc khi API văng lỗi), app lập tức đọc dữ liệu từ `loadCachedAssignments()` lên giao diện."),
            ("Mốc thời gian thực tế (Dynamic Timestamp)", "Khi mất mạng hoặc khi tick bài tập offline, app lấy `new Date().toLocaleTimeString('vi-VN')` và lưu vào `useNetworkStore`, kích hoạt `OfflineBanner` màu hổ phách hiển thị chính xác thời gian thực tế.")
        ],
        "speech": "Kính thưa Thầy, cơ chế ngoại tuyến của nhóm em hoạt động hoàn toàn tự động. Khi mất mạng, app không hề bị đơ mà lập tức chuyển sang đọc bản sao lưu trữ trong AsyncStorage. Đồng thời, một thanh Banner màu hổ phách xuất hiện trên đầu trang chủ thông báo: 'Đang ở chế độ ngoại tuyến. Dữ liệu đã lưu cục bộ lúc HH:MM:SS'. Mốc thời gian này được ghi nhận theo thời gian thực tế của thiết bị, tạo sự minh bạch tuyệt đối.",
        "viva_qna": {
            "question": "Làm thế nào để ứng dụng tự nhận biết được thiết bị vừa bị mất mạng để chuyển sang chế độ offline?",
            "answer": "Dạ thưa Thầy, trong `src/hooks/useAssignments.ts`, nhóm kết hợp 2 kỹ thuật: Trên nền tảng Web, hook lắng nghe sự kiện `window.addEventListener('offline')` và `online`. Trên nền tảng Mobile, hook chủ động bắt lỗi `Network request failed` trong khối `queryFn`. Khi có lỗi, hàm sẽ lập tức set cờ `setIsOffline(true)` và nạp ngay dữ liệu từ AsyncStorage lên màn hình."
        }
    },
    {
        "id": "issue_04",
        "num": 4,
        "title": "CẬP NHẬT LẠC QUAN (OPTIMISTIC UPDATE) KHI TICK BÀI TẬP HOẠT ĐỘNG THẾ NÀO? NẾU SERVER LỖI THÌ SAO?",
        "category": "Trải Nghiệm Người Dùng Cao Cấp & Toàn Vẹn Dữ Liệu (UI & Consistency)",
        "owner": "Nguyễn Thị Hương Giang (TV2)",
        "requirement": "Must-Have #1, Kỹ thuật nâng cao (Optimistic Mutation with Automatic Rollback)",
        "problem_statement": "Nếu người dùng bấm tick hoàn thành bài tập mà phải chờ 1-2 giây để server phản hồi mới thấy dấu tick đổi màu thì cảm giác sử dụng rất chậm chạp. Tuy nhiên, nếu đổi giao diện ngay mà server ném lỗi thì dữ liệu sẽ bị sai lệch.",
        "storage_location": "Xử lý trực tiếp trên bộ nhớ đệm cache của TanStack Query qua phương thức `queryClient.setQueryData(['assignments'], ...)` kết hợp với snapshot rollback.\n- File hiện thực: `src/hooks/useAssignments.ts` (hàm `useToggleAssignment`).",
        "why_not_alternative": "TẠI SAO PHẢI CÓ CƠ CHẾ ROLLBACK:\nNhiều bạn sinh viên chỉ dùng `useState` cục bộ để đổi trạng thái checkbox ngay lập tức nhưng bỏ qua bước xử lý lỗi mạng. Nếu rớt mạng hoặc API lỗi 500, checkbox trên máy sinh viên vẫn hiện 'Đã xong' nhưng trên server vẫn là 'Chưa xong', dẫn đến việc sinh viên tưởng đã nộp bài nhưng thực chất bị 0 điểm. Quy trình 3 bước của TanStack Query giải quyết triệt để lỗi này.",
        "technical_mechanism": [
            ("Bước 1: onMutate", "Hủy bỏ mọi truy vấn ngầm đang chạy (`cancelQueries`). Chụp lại bản sao hiện tại của danh sách bài tập lưu vào biến `previous`. Ghi đè trạng thái `completed: !completed` lên cache UI ngay lập tức (phản hồi trong 0ms)."),
            ("Bước 2: onError", "Nếu request API thất bại hoặc mất mạng, hàm `onError` lập tức lấy bản sao `previous` ghi đè lại vào cache, đưa ô checkbox quay về trạng thái cũ (Rollback tự động)."),
            ("Bước 3: onSettled", "Khi request kết thúc (dù thành công hay thất bại), gọi `invalidateQueries` để đồng bộ lại dữ liệu chuẩn xác nhất từ server.")
        ],
        "speech": "Thao tác tick hoàn thành bài tập của nhóm áp dụng kỹ thuật Cập nhật lạc quan (Optimistic Update). Khi sinh viên chạm vào checkbox, giao diện đổi trạng thái trong 0 mili-giây. Nhưng điểm đắt giá nhất là cơ chế Rollback tự động: nếu đường truyền mạng bị ngắt đột ngột, hệ thống sẽ tự động hoàn tác checkbox về trạng thái cũ và báo lỗi, đảm bảo dữ liệu hiển thị không bao giờ sai lệch với server.",
        "viva_qna": {
            "question": "Em hãy chỉ rõ trong code đoạn nào thực hiện việc chụp ảnh snapshot và đoạn nào thực hiện rollback?",
            "answer": "Dạ thưa Thầy, trong file `src/hooks/useAssignments.ts`: Tại dòng 140 hàm `onMutate`, lệnh `const previous = queryClient.getQueryData(['assignments'])` chính là bước chụp ảnh snapshot. Còn tại dòng 165 hàm `onError`, lệnh `queryClient.setQueryData(['assignments'], context.previous)` chính là bước phục hồi snapshot để rollback giao diện."
        }
    },
    {
        "id": "issue_05",
        "num": 5,
        "title": "TIẾN ĐỘ MÔN HỌC (%) ĐƯỢC LƯU Ở ĐÂU TRONG DATABASE? TẠI SAO LÀ DERIVED STATE?",
        "category": "Kiến Trúc Dữ Liệu Dẫn Xuất (Data Architecture & Derived State)",
        "owner": "Nguyễn Thị Hương Giang (TV2)",
        "requirement": "Must-Have #6, Luật Dữ Liệu Dẫn Xuất (Derived Data Law)",
        "problem_statement": "Màn hình Tiến độ môn học cần hiển thị: Tổng số bài, Số bài đã xong, và Tỉ lệ phần trăm hoàn thành (%) của từng môn. Câu hỏi đặt ra là: Có nên tạo thêm cột `percentage` trong bảng Môn học trên Database không?",
        "storage_location": "HOÀN TOÀN KHÔNG LƯU TRONG DATABASE HOẶC API!\n- Bản chất: Đây là **Derived State (Dữ liệu dẫn xuất)**.\n- Vị trí tính toán: Được tính toán động (dynamically computed) ở phía Client bằng hàm thuần túy `computeCourseProgress(assignments, courseId)`.\n- File hiện thực: `src/utils/statsUtils.ts` và được gọi tại `app/(app)/(tabs)/courses.tsx`.",
        "why_not_alternative": "TẠI SAO KHÔNG LƯU CỘT PERCENTAGE VÀO DATABASE:\nNếu lưu cứng cột `percentage` vào DB, mỗi khi người dùng: thêm bài mới, tick hoàn thành bài, xóa bài, hoặc sửa môn học, hệ thống bắt buộc phải gửi câu lệnh UPDATE để tính lại cột này. Trong môi trường di động mạng chập chờn, việc cập nhật nhiều bảng cùng lúc rất dễ bị lỗi bất đồng bộ (Data Inconsistency). Hơn nữa, nếu API trả về `percentage: 80%` nhưng thực tế sinh viên đếm chỉ có 2/4 bài thì sẽ gây mất lòng tin. Tính toán động $O(N)$ từ mảng bài tập gốc đảm bảo tiến độ luôn đúng 100%.",
        "technical_mechanism": [
            ("Thuật toán O(N) thuần túy", "Lọc các bài tập thuộc `courseId`, đếm `total` và `completed` trong đúng 1 lượt duyệt mảng."),
            ("Xử lý an toàn phép chia cho 0", "Nếu môn học chưa có bài tập nào (`total === 0`), hàm trả về ngay số `0%`, ngăn chặn hoàn toàn lỗi toán học chia cho 0 sinh ra giá trị `NaN` làm vỡ giao diện."),
            ("Làm tròn chuẩn xác", "Dùng `Math.round((completed / total) * 100)` cho ra số nguyên đẹp mắt.")
        ],
        "speech": "Kính thưa Thầy, nhóm em tuân thủ nghiêm ngặt nguyên lý kiến trúc phần mềm: 'Single Source of Truth' và 'Derived State'. Tỉ lệ phần trăm tiến độ môn học hoàn toàn không lưu cứng trong database. Nó được tính toán động tức thời thông qua hàm thuần túy `computeCourseProgress()`. Bất cứ khi nào có thay đổi ở danh sách bài tập, tiến độ các môn học sẽ tự động nhảy số chính xác mà không sợ bị lệch dữ liệu.",
        "viva_qna": {
            "question": "Nếu một sinh viên có 10,000 bài tập thì việc tính toán động O(N) trên máy điện thoại có bị giật lag không?",
            "answer": "Dạ thưa Thầy, một sinh viên trong một học kỳ thường chỉ có từ vài chục đến tối đa vài trăm bài tập. Một vòng lặp mảng vài trăm phần tử trong JavaScript chỉ mất chưa đầy 0.1 mili-giây trên CPU điện thoại. Kể cả với 10,000 phần tử, độ phức tạp $O(N)$ vẫn chạy trong vài mili-giây và có thể tối ưu thêm bằng `useMemo`. Do đó giải pháp tính toán động vừa tuyệt đối chính xác vừa đạt hiệu năng vượt trội."
        }
    },
    {
        "id": "issue_06",
        "num": 6,
        "title": "ẢNH CHỤP BÀI TẬP ĐÍNH KÈM (PHOTO ATTACHMENT) ĐƯỢC LƯU Ở ĐÂU VÀ XỬ LÝ RA SAO?",
        "category": "Quản Trị Tệp Đa Phương Tiện (Media & File Management)",
        "owner": "Cả 2 Thành viên (TV1: ImagePicker UI; TV2: URI Data Model)",
        "requirement": "Kỹ thuật nâng cao (Camera & Image Attachment via expo-image-picker)",
        "problem_statement": "Khi sinh viên chụp ảnh bài tập trên bảng hoặc chụp trang vở đính kèm vào ứng dụng, việc lưu trữ ảnh phải đảm bảo tốc độ mở app mượt mà và không làm tràn bộ nhớ điện thoại.",
        "storage_location": "Được lưu trữ dưới dạng **Đường dẫn cục bộ (Local File URI: `file:///...`)** trong thư mục sandbox cache/documents của ứng dụng thông qua thư viện `expo-image-picker`.\n- Thuộc tính mô hình: `photoUri?: string` trong `src/types/study.ts`.\n- File hiện thực: `app/(app)/modal/new-assignment.tsx` và `app/(app)/assignments/[id].tsx`.",
        "why_not_alternative": "TẠI SAO KHÔNG CHUYỂN ẢNH THÀNH CHUỖI BASE64 ĐỂ LƯU VÀO STATE/DATABASE:\nMột bức ảnh chụp điện thoại dung lượng 3-5MB khi chuyển sang Base64 sẽ sinh ra chuỗi văn bản dài hàng triệu ký tự. Nếu lưu chuỗi này vào Zustand State hoặc AsyncStorage sẽ làm nghẽn RAM, làm chậm tiến trình JSON parse và gây lag giật giao diện nghiêm trọng. Lưu đường dẫn tệp (`file:///...`) chỉ tốn vài chục byte bộ nhớ, ảnh được tải trực tiếp từ đĩa bằng native bridge mượt mà.",
        "technical_mechanism": [
            ("ImagePicker Options", "Cấu hình `mediaTypes: ImagePicker.MediaTypeOptions.Images`, `allowsEditing: true`, `quality: 0.7` để nén ảnh vừa đủ sắc nét mà không tốn dung lượng."),
            ("Xem trước ảnh (Photo Preview)", "Hiển thị ảnh thumbnail ngay trong Modal tạo bài và hiển thị banner ảnh lớn ở màn hình chi tiết bài tập `assignments/[id].tsx`."),
            ("Thuộc tính tùy chọn (Optional)", "Trường `photoUri` là optional (`?`), nếu sinh viên không đính kèm ảnh thì component vẫn render giao diện ghi chú bình thường mà không phát sinh lỗi.")
        ],
        "speech": "Chức năng đính kèm ảnh bài tập sử dụng thư viện `expo-image-picker`. Nhóm em tối ưu bằng cách chỉ lưu đường dẫn tệp cục bộ (`photoUri`) với chất lượng nén 0.7 thay vì lưu chuỗi Base64 cồng kềnh. Điều này giúp dung lượng bộ nhớ app cực kỳ nhẹ, mở ảnh tức thì và bảo đảm hiệu năng tối đa cho thiết bị.",
        "viva_qna": {
            "question": "Nếu người dùng từ chối cấp quyền truy cập Camera hoặc Thư viện ảnh thì app có bị crash không?",
            "answer": "Dạ thưa Thầy là KHÔNG ạ! Trước khi mở thư viện ảnh, hàm `ImagePicker.requestMediaLibraryPermissionsAsync()` sẽ kiểm tra quyền. Nếu người dùng từ chối cấp quyền, hàm sẽ trả về `status !== 'granted'` và app hiển thị thông báo nhẹ nhàng nhắc nhở chứ không hề bị văng ứng dụng."
        }
    },
    {
        "id": "issue_07",
        "num": 7,
        "title": "TẠI SAO KHÔNG BỊ LỖI MÚI GIỜ VÀ CHÊNH LỆCH GIỜ KHI TÍNH HẠN 48 GIỜ? (HÀM STARTOFDAY)",
        "category": "Xử Lý Thời Gian & Múi Giờ (Date & Timezone Architecture)",
        "owner": "Nguyễn Thị Hương Giang (TV2)",
        "requirement": "Must-Have #2, Luật Xử Lý Ngày & Múi Giờ",
        "problem_statement": "Một trong những bẫy lập trình phổ biến nhất trên di động là tính toán hạn chót bị sai lệch do chênh lệch giờ và ranh giới ngày theo lịch.",
        "storage_location": "Được xử lý bởi bộ hàm thuần túy tại `src/utils/dateUtils.ts` (hàm `startOfDay` và `isDueWithin48Hours`), được kiểm thử nghiêm ngặt bởi Jest test suite `__tests__/dateUtils.test.ts`.",
        "why_not_alternative": "TẠI SAO KHÔNG DÙNG CÁCH CỘNG 48 GIỜ THUẦN TÚY (Date.now() + 48*60*60*1000):\nVí dụ: Sinh viên mở app lúc 23:30 đêm Thứ Hai để kiểm tra bài tập nộp vào lúc 08:00 sáng Thứ Tư (cách 32.5 tiếng). Nếu cộng trừ thuần túy theo mili-giây, khoảng cách có thể chưa tròn ngày hoặc bị vượt qua ranh giới múi giờ UTC. Bằng cách dùng hàm `startOfDay()`, toàn bộ mốc thời gian được đưa về `00:00:00.000` của ngày lịch địa phương, đảm bảo phép so sánh 'hôm nay', 'ngày mai', 'ngày mốt' luôn chính xác 100% không phụ thuộc vào giờ sinh viên mở app.",
        "technical_mechanism": [
            ("Hàm startOfDay(date)", "Tạo một đối tượng Date mới, gán `setHours(0, 0, 0, 0)` để triệt tiêu toàn bộ yếu tố giờ, phút, giây, mili-giây thừa."),
            ("Cửa sổ trượt 48 giờ", "Thuật toán kiểm tra hạn nộp: ngày hết hạn phải $\\ge$ hôm nay và $\\le$ hôm nay + 2 ngày theo lịch dương."),
            ("Lọc bài chưa làm", "Widget 48h chỉ quét những bài `!completed && isDueWithin48Hours(dueDate)` để không làm phiền sinh viên với các bài đã nộp.")
        ],
        "speech": "Để giải quyết triệt để lỗi múi giờ và ranh giới ngày, nhóm em xây dựng hàm `startOfDay()`. Hàm này quy chuẩn mọi mốc thời gian về 00:00:00 của ngày lịch. Nhờ đó, tính năng cảnh báo hạn chót 48 giờ luôn hoạt động chuẩn xác dù sinh viên mở app vào sáng sớm hay lúc nửa đêm.",
        "viva_qna": {
            "question": "Nếu thiết bị của sinh viên bị lệch múi giờ (ví dụ chuyển sang múi giờ Nhật Bản UTC+9) thì app tính hạn nộp thế nào?",
            "answer": "Dạ thưa Thầy, các chuỗi ngày trong app được lưu theo chuẩn ISO 8601 (`YYYY-MM-DDTHH:mm:ss.sssZ`). Khi hàm `new Date(dateStr)` được gọi, JavaScript Engine trên điện thoại sẽ tự động chuyển đổi mốc giờ UTC đó về giờ địa phương của thiết bị hiện tại, kết hợp với `startOfDay` nên kết quả hiển thị luôn đúng theo ngày lịch nơi sinh viên đang sinh sống."
        }
    },
    {
        "id": "issue_08",
        "num": 8,
        "title": "CƠ CHẾ DEEP LINKING HOẠT ĐỘNG THẾ NÀO KHI BẤM VÀO THÔNG BÁO DEADLINE?",
        "category": "Điều Hướng Động & Thông Báo Đẩy (Notifications & Deep Linking)",
        "owner": "Trần Bảo Trâm (TV1)",
        "requirement": "Must-Have #4 (Expo Notifications & Deep Linking Navigation)",
        "problem_statement": "Khi thông báo deadline xuất hiện trên thanh trạng thái của điện thoại, nếu người dùng bấm vào mà app chỉ mở màn hình Trang chủ thì họ lại phải mất công tìm kiếm bài tập đó. Deep Linking phải đưa người dùng vào thẳng màn hình chi tiết bài tập.",
        "storage_location": "Được xử lý tại `src/hooks/useNotifications.ts` (lên lịch thông báo kèm payload) và `app/_layout.tsx` (lắng nghe sự kiện toàn cục), đích đến là `app/(app)/assignments/[id].tsx`.",
        "why_not_alternative": "TẠI SAO ĐẶT LISTENER Ở ROOT LAYOUT THAY VÌ Ở TỪNG MÀN HÌNH:\nNếu đặt listener ở `index.tsx`, khi người dùng đang ở tab `schedule.tsx` hoặc `courses.tsx` mà bấm vào thông báo, listener sẽ không bắt được sự kiện hoặc bị unmount. Đặt `useNotificationListener()` ở `app/_layout.tsx` đảm bảo ứng dụng luôn đón nhận được sự kiện chạm thông báo ở mọi thời điểm.",
        "technical_mechanism": [
            ("Lên lịch kèm Payload", "Trong hàm `scheduleAssignmentNotification`, object gửi đi có chứa thuộc tính `data: { assignmentId: item.id }`."),
            ("Bộ lắng nghe toàn cục", "Hook `useNotificationListener` đăng ký `Notifications.addNotificationResponseReceivedListener`."),
            ("Điều hướng Deep Link", "Khi sinh viên bấm vào thông báo, listener trích xuất `assignmentId` và gọi `router.push('/assignments/' + assignmentId + '?fromNotification=true')`."),
            ("Thanh Banner Hổ Phách", "Màn hình chi tiết kiểm tra cờ `fromNotification` để hiển thị thanh chào mừng màu hổ phách: 'Bạn đã mở bài tập này từ Thông báo / Deep Link'.")
        ],
        "speech": "File `useNotifications.ts` hiện thực cơ chế Deep Linking hoàn chỉnh. Khi thông báo deadline được lên lịch, nhóm gắn kèm mã định danh của bài tập vào payload. Khi Thầy chạm vào thông báo trên điện thoại, hệ điều hành sẽ kích hoạt listener tại Root Layout và tự động điều hướng thẳng vào màn hình chi tiết của bài tập đó kèm banner xác nhận màu hổ phách.",
        "viva_qna": {
            "question": "Nếu người dùng bấm vào một thông báo của một bài tập đã bị xóa trước đó thì app xử lý thế nào?",
            "answer": "Dạ thưa Thầy, nhóm đã dự liệu trường hợp này: Khi điều hướng đến `/assignments/[id]`, hook `useAssignments()` sẽ tìm bài tập theo `id`. Nếu không tìm thấy, màn hình hiển thị trạng thái `StateHandler` thông báo 'Không tìm thấy bài tập' và cung cấp nút 'Quay về trang chủ', ứng dụng hoàn toàn không bị crash."
        }
    },
    {
        "id": "issue_09",
        "num": 9,
        "title": "BẢNG MÀU & CHẾ ĐỘ DARK/LIGHT MODE ĐƯỢC LƯU Ở ĐÂU? LUẬT ZERO-HEX HOẠT ĐỘNG RA SAO?",
        "category": "Hệ Thống Thiết Kế & Quản Trị Giao Diện (Design System & Zero-Hex)",
        "owner": "Trần Bảo Trâm (TV1)",
        "requirement": "Luật Zero-Hex & Single Source of Truth",
        "problem_statement": "Nếu viết trực tiếp mã màu hex `#FFFFFF` hay `#2563EB` rải rác trong hàng chục màn hình và component, khi muốn đổi màu thương hiệu hoặc hỗ trợ Dark Mode sẽ phải đi sửa từng file một, rất dễ sót và vỡ giao diện.",
        "storage_location": "Toàn bộ mã màu Hex được tập trung tại một nơi DUY NHẤT: `src/constants/tokens.ts` (Luật Zero-Hex). Cấu hình chế độ hiển thị (light/dark/system) của người dùng được lưu trong `useThemeStore` (Zustand).\n- Cấp phát màu qua hook: `src/hooks/useThemeColor.ts`.",
        "why_not_alternative": "LỢI ÍCH CỦA LUẬT ZERO-HEX:\n1. *Single Source of Truth*: Đổi mã màu tại 1 dòng trong `tokens.ts` là toàn bộ ứng dụng tự đổi theo.\n2. *Đồng bộ Dark Mode hoàn hảo*: Toàn bộ màu chữ (`ThemedText`), màu nền (`ThemedView`), màu thẻ và viền tự động đảo màu tương phản cao, bảo vệ mắt người dùng khi dùng ban đêm.\n3. *Chuẩn mực công nghiệp*: Cách tiếp cận tương đồng với Design System của các tập đoàn lớn (Material Design của Google, Human Interface Guidelines của Apple).",
        "technical_mechanism": [
            ("ThemeTokens Structure", "Phân chia rõ ràng `ThemeTokens.light` và `ThemeTokens.dark` với các tên ngữ nghĩa: `background`, `card`, `text`, `textSecondary`, `border`, `tint`, `urgent`."),
            ("useThemeColor Hook", "Tự động phát hiện chế độ màu của máy qua `useColorScheme()` hoặc thiết lập riêng trong `useThemeStore` để trả về đúng palette."),
            ("100% Zero-Hex Cam Kết", "Không có bất kỳ file JSX/TSX nào trong thư mục `app/` và `src/components/` chứa mã màu Hex thô.")
        ],
        "speech": "Dự án của nhóm em tuân thủ triệt để Luật Zero-Hex: Mã màu Hex chỉ xuất hiện tại duy nhất 1 file `tokens.ts`. Mọi component đều sử dụng mã màu ngữ nghĩa thông qua hook `useThemeColor()`. Khi Thầy chuyển điện thoại sang chế độ Dark Mode, toàn bộ giao diện từ chữ, nền, viền thẻ đến thanh tab bar đều tự động đồng bộ sang tone tối sang trọng mà không cần tải lại app.",
        "viva_qna": {
            "question": "Thầy kiểm tra ngẫu nhiên thấy trong file component nào có mã hex thì nhóm giải thích sao?",
            "answer": "Dạ thưa Thầy, Thầy có thể dùng tính năng Search của VS Code quét toàn bộ thư mục `app/` và `src/components/` với từ khóa `#`: Nhóm cam đoan 100% không có mã màu hex nào ngoài file `src/constants/tokens.ts`. Mọi màu sắc đều được gọi qua Design Tokens chuẩn mực."
        }
    },
    {
        "id": "issue_10",
        "num": 10,
        "title": "TIÊU CHUẨN CÔNG THÁI HỌC VÙNG CHẠM (TOUCH TARGET >= 44X44PT) VÀ TRỢ NĂNG (ACCESSIBILITY)?",
        "category": "Công Thái Học & Tiêu Chuẩn Trợ Năng (Ergonomics & WCAG 2.1 AA)",
        "owner": "Trần Bảo Trâm (TV1)",
        "requirement": "Luật Trợ Năng (Accessibility) & Touch Target >= 44x44pt",
        "problem_statement": "Màn hình điện thoại có kích thước nhỏ, ngón tay người dùng có tiết diện tiếp xúc khoảng 8-10mm. Nếu thiết kế nút bấm quá nhỏ (ví dụ ô checkbox chỉ 16-20pt), người dùng sẽ liên tục bị bấm trượt, đặc biệt là người lớn tuổi hoặc người khiếm thị.",
        "storage_location": "Được quy định tại `TouchTarget.min = 44` trong `src/constants/tokens.ts` và áp dụng trên tất cả component tương tác:\n- `src/components/ui/AccessibleButton.tsx`\n- `src/components/features/AssignmentCard.tsx` (ô checkbox)\n- `src/components/features/WeeklyCalendar.tsx` (ô chọn ngày)\n- `app/(app)/(tabs)/_layout.tsx` (thanh Tab bar chiều cao 64pt).",
        "why_not_alternative": "TẠI SAO BẮT BUỘC PHẢI LÀ 44X44PT:\nCon số 44x44 point là tiêu chuẩn vàng được quy định chính thức trong Apple Human Interface Guidelines và Google Android Material Design. Nó tương đương với vùng tiếp xúc vật lý tối thiểu của đầu ngón tay cái người dùng. Ngoài ra, việc bổ sung `accessibilityRole` và `accessibilityLabel` giúp ứng dụng đạt chuẩn quốc tế WCAG 2.1 AA.",
        "technical_mechanism": [
            ("minHeight & minWidth: 44", "Cố định trong style để kể cả khi nội dung bên trong chỉ là 1 icon nhỏ 16pt, vùng chạm xung quanh (hit area) vẫn được đệm đủ 44x44pt."),
            ("accessibilityRole", "Khai báo rõ ràng vai trò là `button` hoặc `checkbox` để phần mềm đọc màn hình nhận diện."),
            ("accessibilityLabel", "Cung cấp văn bản mô tả hành động (ví dụ: 'Đánh dấu hoàn thành bài tập Lập trình Mobile') để người khiếm thị nghe được qua tai nghe."),
            ("Automated Test", "Jest test suite `__tests__/AssignmentCard.test.tsx` tự động kiểm tra xác nhận vùng chạm đạt chuẩn >= 44pt.")
        ],
        "speech": "Về mặt công thái học người dùng, nhóm em hiện thực nghiêm ngặt Luật Trợ Năng: Tất cả các nút bấm, ô checkbox và từng ngày trên lịch đều có vùng chạm tối thiểu 44x44pt. Người dùng thao tác bằng một tay cực kỳ thoải mái và không bao giờ bị bấm trượt. Các nhãn trợ năng VoiceOver/TalkBack cũng được tích hợp đầy đủ.",
        "viva_qna": {
            "question": "Làm thế nào để chứng minh ô checkbox của nhóm em đạt kích thước 44x44pt trong khi mắt nhìn thấy ô vuông chỉ khoảng 24pt?",
            "answer": "Dạ thưa Thầy, ô vuông checkbox có kích thước hiển thị thị giác là 24pt, nhưng nó được bọc bên trong một container `TouchableOpacity` có thuộc tính `minHeight: TouchTarget.min` (44pt) và `minWidth: TouchTarget.min` (44pt). Trong file `__tests__/AssignmentCard.test.tsx`, nhóm đã viết test case tự động kiểm tra thuộc tính style này và kết quả test báo PASS 100%."
        }
    },
    {
        "id": "issue_11",
        "num": 11,
        "title": "BỘ XỬ LÝ 4 TRẠNG THÁI (STATEHANDLER) GIẢI QUYẾT VẤN ĐỀ GÌ CỦA TRẢI NGHIỆM NGƯỜI DÙNG?",
        "category": "Vòng Đời Giao Diện & Xử Lý Sự Cố (UI Lifecycle & Fault Tolerance)",
        "owner": "Nguyễn Thị Hương Giang (TV2)",
        "requirement": "Luật 4 Trạng Thái (Loading, Empty, Error with working retry, Content)",
        "problem_statement": "Rất nhiều ứng dụng của sinh viên chỉ code trường hợp 'mọi thứ đều chạy tốt' (Happy Path). Khi gặp mạng chậm, mạng chập chờn hoặc danh sách chưa có dữ liệu, app sẽ bị trắng xóa hoặc đứng hình làm người dùng bối rối.",
        "storage_location": "Được đóng gói thành component dùng chung tại `src/components/ui/StateHandler.tsx` và được nhúng tại tất cả các màn hình nạp dữ liệu: `index.tsx`, `schedule.tsx`, `courses.tsx`.",
        "why_not_alternative": "TẠI SAO BẮT BUỘC PHẢI CÓ NÚT THỬ LẠI (RETRY) HOẠT ĐỘNG THẬT:\nKhi gặp lỗi mạng, nếu chỉ hiện dòng chữ 'Đã có lỗi xảy ra' thì người dùng bắt buộc phải tắt app đi mở lại từ đầu. Việc cung cấp nút 'Thử lại' gọi trực tiếp hàm `refetch()` giúp người dùng có thể kích hoạt tải lại dữ liệu ngay tại chỗ khi mạng vừa hồi phục, mang lại trải nghiệm chuẩn sản phẩm thương mại.",
        "technical_mechanism": [
            ("1. Loading State", "Hiển thị vòng xoay `ActivityIndicator` màu thương hiệu kèm thông điệp đang tải."),
            ("2. Empty State", "Hiển thị icon hộp rỗng thân thiện kèm câu động viên khi sinh viên đã hoàn thành hết bài tập."),
            ("3. Error State with Working Retry", "Hiển thị icon cảnh báo lỗi và nút bấm `AccessibleButton` truyền hàm `onRetry` gọi thẳng `refetch()` của TanStack Query."),
            ("4. Content State", "Render nội dung chính của trang một cách mượt mà.")
        ],
        "speech": "Component `StateHandler.tsx` là lá chắn bảo vệ trải nghiệm người dùng của nhóm. Mọi màn hình tải dữ liệu đều bắt buộc đi qua 4 trạng thái: Đang tải, Danh sách trống, Báo lỗi có nút Thử lại thật sự, và Nội dung hoàn chỉnh. Nhờ đó, ứng dụng không bao giờ bị rơi vào trạng thái 'chết' hay màn hình trắng.",
        "viva_qna": {
            "question": "Nếu mạng bị chập chờn cứ bật tắt liên tục thì nút Thử lại trong StateHandler hoạt động thế nào?",
            "answer": "Dạ thưa Thầy, khi bấm nút 'Thử lại', hàm `onRetry` gọi lệnh `refetch()` của TanStack Query. Nếu lần thử đó vẫn chưa có mạng, component lập tức duy trì ở trạng thái Error để người dùng bấm lại. Khi có mạng trở lại, chỉ cần bấm 'Thử lại' là dữ liệu lập tức được kéo về và tự động chuyển sang trạng thái Content."
        }
    },
    {
        "id": "issue_12",
        "num": 12,
        "title": "CHIẾN LƯỢC PHÂN TÁCH 4 VÙNG TRẠNG THÁI: CLIENT STATE VS SERVER STATE VS OFFLINE VS SECURE?",
        "category": "Kiến Trúc Quản Trị Trạng Thái Toàn Cục (State Separation Architecture)",
        "owner": "Cả 2 Thành viên (TV1: Client State & UI; TV2: Server State & Secure Storage)",
        "requirement": "Kiến trúc Phần mềm Chuyên Nghiệp (Separation of Concerns)",
        "problem_statement": "Một sai lầm kinh điển của các lập trình viên mới là dồn tất cả dữ liệu (từ token, dữ liệu API, biến theme, trạng thái checkbox) vào chung một kho lưu trữ (như Redux hoặc AsyncStorage), dẫn đến code bị phình to, rối rắm và khó bảo trì.",
        "storage_location": "Dự án Study Planner phân chia rành mạch thành 4 vùng trạng thái độc lập tương ứng với 4 công nghệ tối ưu nhất:\n1. *Secure State*: `expo-secure-store` (Token xác thực).\n2. *Server State*: TanStack Query v5 (Bài tập, Môn học từ API).\n3. *Client State*: Zustand (Theme, Trạng thái đóng mở, Bộ lọc).\n4. *Offline State*: AsyncStorage (Bản sao lưu trữ ngoại tuyến khi mất mạng).",
        "why_not_alternative": "LỢI ÍCH CỦA VIỆC PHÂN TÁCH 4 VÙNG TRẠNG THÁI:\n- *Đúng công cụ cho đúng việc (Best tool for the job)*: Không ép một thư viện phải làm những việc nó không giỏi.\n- *Hiệu năng tối ưu*: Thay đổi trạng thái theme ở Client State không làm kích hoạt fetch lại dữ liệu Server State.\n- *Bảo mật cao nhất*: Dữ liệu nhạy cảm được cô lập trong phần cứng mã hóa, không bị phơi nhiễm ra các tầng lưu trữ thông thường.",
        "technical_mechanism": [
            ("Zustand (Client State)", "Quản lý trong `src/store/authStore.ts` (trạng thái đăng nhập) và `useThemeStore` (chế độ sáng tối). Rất nhẹ, không cần boilerplate."),
            ("TanStack Query (Server State)", "Quản lý trong `src/hooks/useAssignments.ts` và `useCourses.ts`. Tự động cache và đồng bộ."),
            ("AsyncStorage (Offline State)", "Quản lý bản sao lưu trữ JSON cục bộ kèm timestamp."),
            ("SecureStore (Secure State)", "Quản lý khóa bí mật và token đăng nhập.")
        ],
        "speech": "Điểm tự hào nhất về mặt kiến trúc của nhóm em là Chiến lược phân tách 4 vùng trạng thái (State Separation). Nhóm không dồn cục code mà phân chia rành mạch: Token lưu trong SecureStore mã hóa phần cứng; Dữ liệu API do TanStack Query quản lý cache; Trạng thái giao diện do Zustand phụ trách; và Bản sao ngoại tuyến lưu trong AsyncStorage. Cấu trúc này giúp mã nguồn cực kỳ trong sáng, dễ mở rộng và đạt chuẩn mực của các dự án phần mềm di động quy mô lớn.",
        "viva_qna": {
            "question": "Tại sao nhóm em dùng cả Zustand lẫn TanStack Query mà không gộp chung vào 1 cái?",
            "answer": "Dạ thưa Thầy, vì bản chất của Client State và Server State là hoàn toàn khác nhau: Client State (như chọn Dark Mode, đóng mở filter) là dữ liệu đồng bộ, tức thời, nằm hoàn toàn trên máy. Còn Server State (như danh sách bài tập) là dữ liệu bất đồng bộ từ xa, cần xử lý độ trễ mạng, cache, thử lại khi lỗi và cập nhật lạc quan. Dùng TanStack Query chuyên trị Server State và Zustand chuyên trị Client State là kiến trúc chuẩn mực được cộng đồng React Native toàn cầu khuyến nghị."
        }
    }
]

print(f"Loaded {len(ARCHITECTURAL_ISSUES)} architectural deep-dive issues.")
