# -*- coding: utf-8 -*-
"""
Database of all files in the Study Planner project tree with complete
architectural analysis, code highlights, presentation scripts, and viva defense Q&A.
"""

PROJECT_METADATA = {
    "topic": "Đề tài 01: Ứng dụng Quản lý Kế hoạch Học tập (Study Planner)",
    "course": "Lập trình Mobile (Mã học phần: TH7011101 - Lớp: 23DTH1)",
    "university": "Trường Đại học Công nghệ Đồng Nai (DNTU) — Khoa Công nghệ Thông tin",
    "instructor": "Thầy Nguyễn Xuân Vinh",
    "member1": "Trần Bảo Trâm — MSSV: 1923050181 (Thành viên 1: Lead UI/UX, Design Tokens, Navigation, Lịch tuần, Notifications)",
    "member2": "Nguyễn Thị Hương Giang — MSSV: 1923051154 (Thành viên 2: Lead Data Layer, Zustand, SecureStore, TanStack Query, Offline Cache, Logic & Tests)",
    "version": "Release v1.0.0 — Tháng 10/2026",
    "repo": "https://github.com/giangnguyen2110/Study_Planner.git"
}

# Grouped Files List
SECTIONS = [
    {
        "id": "app_routes",
        "title": "PHẦN 1: TẦNG ĐIỀU HƯỚNG & MÀN HÌNH (DIRECTORY: app/ — EXPO ROUTER)",
        "desc": "Thư mục `app/` áp dụng cơ chế File-based Routing của Expo Router v3+. Cấu trúc thư mục phản ánh trực tiếp URL và cấu trúc ngăn xếp màn hình (Stack/Tabs/Modal).",
        "files": [
            {
                "path": "app/_layout.tsx",
                "name": "Root Layout & Global Application Configuration",
                "layer": "Presentation / Navigation Root",
                "owner": "Cả 2 Thành viên (TV1: Navigation & Listener; TV2: QueryClient & Auth Restore)",
                "requirement": "Must-Have #4 (Deep Linking & Navigation), Kỹ thuật nâng cao (QueryClient Cache)",
                "purpose": "Là thành phần gốc khởi động toàn ứng dụng, bọc toàn bộ app bằng QueryClientProvider, kích hoạt bộ lắng nghe thông báo và khôi phục phiên đăng nhập.",
                "key_code": [
                    ("QueryClientProvider", "Khởi tạo đối tượng `queryClient` duy nhất với cấu hình `retry: 2` (tự động thử lại 2 lần khi mạng lỗi) và `staleTime: 60000` (1 phút) trước khi bọc toàn bộ cây Component."),
                    ("useNotificationListener()", "Hook kích hoạt lắng nghe sự kiện người dùng bấm vào thanh thông báo của điện thoại để bắt Deep Link điều hướng sang `/assignments/[id]`."),
                    ("restoreSession()", "Gọi `useAuthStore.getState().restoreSession()` ngay trong `useEffect` để kiểm tra SecureStore, nếu có token thì tự động đăng nhập mà không bắt người dùng đăng nhập lại (Survive App Restart)."),
                    ("Stack Router", "Cấu hình 4 nhóm điều hướng chính: nhóm xác thực `(auth)`, nhóm ứng dụng bảo vệ `(app)`, màn hình modal pop-up `modal/new-assignment` và màn hình lỗi `+not-found`.")
                ],
                "presentation_speech": "Kính thưa Thầy, file `app/_layout.tsx` đóng vai trò là 'trái tim' khởi động của toàn dự án. Tại đây, nhóm em bọc toàn bộ ứng dụng bằng `QueryClientProvider` của TanStack Query v5 để cung cấp bộ nhớ đệm cache cho mọi màn hình. Đồng thời, hàm `restoreSession()` được gọi để khôi phục phiên đăng nhập từ phần cứng `SecureStore`, và `useNotificationListener()` luôn sẵn sàng đón nhận tương tác bấm vào thông báo deadline để mở đúng bài tập tương ứng.",
                "viva_trap": {
                    "question": "Tại sao nhóm em lại đặt QueryClientProvider và useNotificationListener ở app/_layout.tsx mà không đặt riêng ở từng màn hình?",
                    "answer": "Dạ thưa Thầy, `app/_layout.tsx` là Root Layout cao nhất, tồn tại xuyên suốt vòng đời ứng dụng và không bao giờ bị unmount khi người dùng chuyển tab hay chuyển trang. Đặt `QueryClientProvider` ở đây giúp toàn bộ cache dữ liệu được duy trì liên tục, tránh fetch lại thừa thãi. Đặt `useNotificationListener` ở đây đảm bảo ứng dụng luôn lắng nghe được sự kiện bấm thông báo từ hệ điều hành ngay cả khi app đang ở màn hình phụ hoặc chạy ngầm."
                }
            },
            {
                "path": "app/+not-found.tsx",
                "name": "404 Not Found & Deep Link Fallback Screen",
                "layer": "Presentation / Error Handling",
                "owner": "Trần Bảo Trâm (TV1)",
                "requirement": "Tiêu chuẩn UX/UI & Robust Deep Linking",
                "purpose": "Bảo vệ ứng dụng không bị crash khi người dùng mở một đường link không tồn tại hoặc payload của Deep Link bị sai lệch.",
                "key_code": [
                    ("Stack.Screen options", "Thiết lập tiêu đề 'Oops! Không tìm thấy trang'."),
                    ("AccessibleButton", "Nút bấm trợ năng điều hướng an toàn quay về Trang chủ (`router.replace('/')`) với vùng chạm đạt chuẩn 44x44pt."),
                    ("ThemedText & ThemedView", "Giao diện tự động thích ứng với chế độ Dark/Light mode.")
                ],
                "presentation_speech": "File `app/+not-found.tsx` đảm bảo tính bền vững của app (Graceful Degradation). Nếu người dùng truy cập một URL hoặc deep link không hợp lệ, thay vì để màn hình trắng hoặc văng ứng dụng, màn hình này sẽ xuất hiện một cách thân thiện và cung cấp nút bấm để đưa người dùng quay về Trang chủ an toàn.",
                "viva_trap": {
                    "question": "Màn hình +not-found.tsx này được kích hoạt trong trường hợp nào trong đồ án?",
                    "answer": "Dạ thưa Thầy, màn hình này kích hoạt khi Expo Router nhận một URL không khớp với bất kỳ file nào trong thư mục `app/`, ví dụ khi người dùng mở deep link `studyplanner://assignments/99999` mà mã bài tập không tồn tại, hoặc khi có lỗi gõ nhầm route trong quá trình phát triển."
                }
            },
            {
                "path": "app/(auth)/_layout.tsx",
                "name": "Authentication Stack Layout",
                "layer": "Presentation / Navigation Guard",
                "owner": "Nguyễn Thị Hương Giang (TV2)",
                "requirement": "Must-Have #5 (Auth State Management & Flow)",
                "purpose": "Quản lý ngăn xếp điều hướng cho nhóm màn hình chưa đăng nhập (Unauthenticated group).",
                "key_code": [
                    ("headerShown: false", "Ẩn header mặc định để màn hình đăng nhập hiển thị toàn màn hình hiện đại."),
                    ("Stack", "Cung cấp container để chứa màn hình `sign-in.tsx`.")
                ],
                "presentation_speech": "File `app/(auth)/_layout.tsx` thiết lập không gian riêng cho luồng xác thực, tắt thanh header thô cứng để tạo trải nghiệm đăng nhập mượt mà, tách biệt hoàn toàn với luồng chính của ứng dụng.",
                "viva_trap": {
                    "question": "Tại sao lại dùng cú pháp dấu ngoặc đơn (auth) trong tên thư mục?",
                    "answer": "Dạ thưa Thầy, trong Expo Router, dấu ngoặc đơn `(auth)` đại diện cho Route Group. Nó giúp nhóm các màn hình có chung mục đích hoặc chung layout lại với nhau mà KHÔNG làm thay đổi đường dẫn URL. Đường dẫn đến màn hình đăng nhập vẫn là `/sign-in` chứ không phải `/(auth)/sign-in`."
                }
            },
            {
                "path": "app/(auth)/sign-in.tsx",
                "name": "Sign-In Screen & Hardware Encrypted Session",
                "layer": "Presentation / Authentication Screen",
                "owner": "Nguyễn Thị Hương Giang (TV2)",
                "requirement": "Must-Have #5 (Auth State Management & Mock Auth)",
                "purpose": "Cho phép người dùng đăng nhập bằng tài khoản sinh viên hoặc tài khoản giảng viên, hiển thị thông tin tài khoản mẫu và lưu token vào SecureStore.",
                "key_code": [
                    ("useAuthStore.login()", "Gọi action đăng nhập từ Zustand store, xác thực thông tin và lưu session vào SecureStore."),
                    ("Quick Fill Buttons", "Hai nút điền nhanh tài khoản mẫu: 'Sinh viên mẫu (sv_dntu)' và 'Giảng viên mẫu (gv_vinh)' giúp Thầy kiểm tra tiện lợi."),
                    ("Error Banner", "Hiển thị thông báo lỗi rõ ràng nếu nhập sai tên đăng nhập hoặc mật khẩu."),
                    ("TouchTarget >= 44pt", "Mọi ô nhập liệu và nút bấm đăng nhập đều đáp ứng tối thiểu 44pt chiều cao.")
                ],
                "presentation_speech": "Kính thưa Thầy, màn hình `sign-in.tsx` cung cấp giao diện đăng nhập bảo mật. Nhóm đã tích hợp sẵn 2 nút tài khoản mẫu tiện lợi cho việc demo: Sinh viên `sv_dntu` và Giảng viên `gv_vinh`. Khi đăng nhập thành công, token và thông tin người dùng được mã hóa phần cứng vào `SecureStore` và app tự động chuyển sang Trang chủ.",
                "viva_trap": {
                    "question": "Nếu tắt ứng dụng hoàn toàn hoặc khởi động lại điện thoại thì người dùng có phải đăng nhập lại không?",
                    "answer": "Dạ thưa Thầy là KHÔNG ạ! Vì thông tin đăng nhập và token được lưu trữ bền vững trong `expo-secure-store` (Keystore trên Android / Keychain trên iOS). Khi mở lại app, hàm `restoreSession()` tại Root Layout sẽ tự động đọc lại token hợp lệ và duy trì trạng thái đăng nhập (Survive App Restart)."
                }
            },
            {
                "path": "app/(app)/_layout.tsx",
                "name": "Protected Route Guard Layout",
                "layer": "Presentation / Navigation Guard",
                "owner": "Nguyễn Thị Hương Giang (TV2)",
                "requirement": "Must-Have #5 (Auth Protection & Redirection)",
                "purpose": "Bảo vệ toàn bộ các màn hình chính của ứng dụng, lập tức chuyển hướng về `/sign-in` nếu người dùng chưa xác thực.",
                "key_code": [
                    ("useAuthStore(user, isLoading)", "Lắng nghe trực tiếp trạng thái đăng nhập từ Zustand auth store."),
                    ("ActivityIndicator", "Hiển thị vòng xoay tải trong khi `isLoading === true` (đang đọc SecureStore)."),
                    ("Redirect href='/sign-in'", "Nếu `!user` sau khi nạp xong, tự động chuyển hướng người dùng về trang đăng nhập, ngăn chặn truy cập trái phép.")
                ],
                "presentation_speech": "File `app/(app)/_layout.tsx` đóng vai trò là 'người gác cổng' bảo vệ ứng dụng. Bất kỳ ai cố tình truy cập vào các màn hình bài tập, lịch học hay tiến độ mà chưa đăng nhập đều bị chặn lại và chuyển hướng về màn hình đăng nhập ngay lập tức.",
                "viva_trap": {
                    "question": "Làm thế nào để tránh hiện tượng màn hình nhấp nháy (flicker) từ trang đăng nhập sang trang chủ khi vừa mở app?",
                    "answer": "Dạ thưa Thầy, nhóm em sử dụng biến trạng thái `isLoading` trong `useAuthStore`. Trong khi app đang đọc token từ SecureStore, file layout này sẽ hiển thị một `ActivityIndicator` xoay tròn. Chỉ khi nào quá trình đọc hoàn tất, layout mới quyết định render màn hình chính hay chuyển về `/sign-in`, loại bỏ hoàn toàn hiện tượng chớp nháy màn hình."
                }
            },
            {
                "path": "app/(app)/(tabs)/_layout.tsx",
                "name": "Bottom Tab Bar Navigator Layout",
                "layer": "Presentation / Navigation Tab Bar",
                "owner": "Trần Bảo Trâm (TV1)",
                "requirement": "Must-Have #4 (Navigation Tabs & Accessibility)",
                "purpose": "Định nghĩa thanh điều hướng dưới đáy gồm 3 Tab: Trang chủ (Home), Lịch học (Schedule), Tiến độ môn (Courses), tích hợp chuẩn trợ năng 44x44pt.",
                "key_code": [
                    ("Tabs component", "Thiết lập cấu hình 3 màn hình Tab với icon Ionicons trực quan: `home`, `calendar`, `book`."),
                    ("tabBarStyle minHeight: 64", "Đảm bảo vùng chạm của từng Tab luôn lớn hơn hoặc bằng 44x44pt, phù hợp với ngón tay người dùng."),
                    ("useThemeColor()", "Đồng bộ màu sắc thanh Tab Bar (`tabBarActiveTintColor`, `tabBarInactiveTintColor`, `backgroundColor`) theo đúng Theme Sáng/Tối.")
                ],
                "presentation_speech": "File `app/(app)/(tabs)/_layout.tsx` thiết kế thanh Tab Bar 3 mục chuẩn mực. Mỗi tab có icon và tiêu đề rõ ràng, màu sắc tự thích ứng với Dark Mode và chiều cao đạt 64pt, đảm bảo vùng bấm thoải mái không bao giờ bấm hụt.",
                "viva_trap": {
                    "question": "Mỗi tab bar item có đáp ứng tiêu chuẩn Accessibility của Thầy không?",
                    "answer": "Dạ thưa Thầy có ạ! Chiều cao thanh Tab được đặt là 64pt, chiều rộng chia đều cho 3 tab nên mỗi item có diện tích tiếp xúc trên 100x64pt, vượt xa tiêu chuẩn tối thiểu 44x44pt của Apple HIG và Android Accessibility."
                }
            },
            {
                "path": "app/(app)/(tabs)/index.tsx",
                "name": "Home Dashboard Screen",
                "layer": "Presentation / Main Screen",
                "owner": "Cả 2 Thành viên (TV1: Giao diện & Widget 48h; TV2: Query Data & Quick Filter)",
                "requirement": "Must-Have #1 (List View & Checkbox), Must-Have #2 (Urgent 48h Widget), Luật Zero-Hex",
                "purpose": "Màn hình Dashboard trung tâm: chào mừng người dùng, hiển thị Widget bài tập khẩn cấp 48h, thống kê nhanh, bộ lọc Tất cả/Chưa xong/Đã xong và danh sách bài tập kèm cập nhật lạc quan.",
                "key_code": [
                    ("Due48hWidget", "Nhúng widget hiển thị danh sách bài tập có hạn nộp trong vòng 48 giờ tới."),
                    ("Quick Stats Bar", "Thanh thống kê nhanh: Tổng số bài, Cần làm ngay, Đã hoàn thành."),
                    ("StateHandler", "Xử lý trọn vẹn 4 trạng thái tải dữ liệu mạng (Loading, Empty, Error có nút Thử lại, Content)."),
                    ("OfflineBanner", "Hiển thị cảnh báo màu hổ phách kèm thời gian thực tế lưu offline khi mất mạng.")
                ],
                "presentation_speech": "Màn hình Trang chủ `index.tsx` là nơi sinh viên nắm bắt toàn bộ công việc học tập. Ngay trên đầu là Widget 48h cảnh báo những bài tập sắp đến hạn. Phía dưới là thanh lọc nhanh và danh sách bài tập. Mọi thao tác tick chọn hoàn thành đều phản hồi tức thì nhờ cơ chế Cập nhật lạc quan.",
                "viva_trap": {
                    "question": "Nếu danh sách bài tập bị lỗi mạng khi vừa mở app thì trang chủ hiển thị thế nào?",
                    "answer": "Dạ thưa Thầy, component `StateHandler` sẽ bắt lỗi `isError` từ TanStack Query và render giao diện báo lỗi kèm nút 'Thử lại'. Khi bấm nút, hàm `refetch()` sẽ được kích hoạt lại. Nếu trước đó đã có dữ liệu trong AsyncStorage, app vẫn đọc dữ liệu ngoại tuyến lên và hiển thị banner hổ phách báo trạng thái ngoại tuyến."
                }
            },
            {
                "path": "app/(app)/(tabs)/schedule.tsx",
                "name": "Schedule & Weekly Calendar Screen",
                "layer": "Presentation / Main Screen",
                "owner": "Trần Bảo Trâm (TV1)",
                "requirement": "Must-Have #3 (Weekly View Calendar & Dot Status Indicator)",
                "purpose": "Màn hình Lịch học: cung cấp 2 chế độ hiển thị (Dải lịch tuần 7 ngày có chấm trạng thái và Chế độ xem danh sách phân nhóm theo ngày).",
                "key_code": [
                    ("WeeklyCalendar", "Component dải lịch tuần từ Thứ 2 đến Chủ nhật, tính toán ngày và hiển thị chấm đỏ nếu có bài tập."),
                    ("Dual Mode Switcher", "Nút chuyển đổi linh hoạt giữa 'Lịch tuần' và 'Toàn bộ danh sách'."),
                    ("Date Filter", "Lọc chính xác các bài tập có hạn nộp trùng với ngày người dùng đang chọn trên lịch."),
                    ("Floating Action Button (FAB)", "Nút bấm dấu cộng '+' nổi bật ở góc dưới để mở nhanh Modal tạo bài tập mới.")
                ],
                "presentation_speech": "Màn hình `schedule.tsx` giúp sinh viên lập kế hoạch tuần. Nhóm em cung cấp dải lịch 7 ngày trực quan từ Thứ 2 đến Chủ nhật. Ngày nào có bài tập sẽ có chấm tròn trạng thái. Sinh viên có thể bấm vào từng ngày để xem bài tập của riêng ngày đó hoặc chuyển sang chế độ danh sách tổng thể.",
                "viva_trap": {
                    "question": "Làm thế nào để xác định một ngày trên lịch tuần có bài tập hay không để hiển thị chấm tròn?",
                    "answer": "Dạ thưa Thầy, trong `WeeklyCalendar.tsx`, nhóm dùng hàm so sánh chuỗi ngày theo định dạng chuẩn ISO `YYYY-MM-DD` giữa từng ngày trong tuần và trường `dueDate` của bài tập. Nếu mảng bài tập lọc ra có độ dài > 0 thì sẽ render một chấm tròn nhỏ màu đỏ cam dưới số ngày."
                }
            },
            {
                "path": "app/(app)/(tabs)/courses.tsx",
                "name": "Courses Progress & Profile Screen",
                "layer": "Presentation / Main Screen",
                "owner": "Nguyễn Thị Hương Giang (TV2)",
                "requirement": "Must-Have #6 (Computed Course Progress %), Luật Dữ liệu Dẫn Xuất",
                "purpose": "Hiển thị tiến độ hoàn thành của từng môn học (tính toán động $O(N)$), thông tin sinh viên đăng nhập và nút đăng xuất tài khoản an toàn.",
                "key_code": [
                    ("computeCourseProgress()", "Hàm thuần túy tính toán tổng số bài, số bài đã xong và tỉ lệ phần trăm tiến độ của từng môn học một cách tự động, KHÔNG lưu cứng trong DB."),
                    ("Progress Bar", "Thanh tiến độ trực quan tự động đổi màu theo tỷ lệ phần trăm (dưới 50% màu cam, trên 80% màu xanh lục)."),
                    ("Sign-Out Action", "Nút đăng xuất gọi `useAuthStore.logout()`, xóa token khỏi SecureStore và tự động quay về màn hình đăng nhập.")
                ],
                "presentation_speech": "Màn hình `courses.tsx` hiện thực trọn vẹn yêu cầu Must-Have #6 của Thầy. Toàn bộ tỉ lệ phần trăm hoàn thành môn học đều là dữ liệu dẫn xuất được tính toán tự động qua hàm `computeCourseProgress()`. Màn hình này cũng hiển thị thông tin tài khoản sinh viên và hỗ trợ đăng xuất an toàn.",
                "viva_trap": {
                    "question": "Tại sao nhóm không lưu luôn cột 'percentage' vào bảng môn học trên Database cho tiện truy vấn?",
                    "answer": "Dạ thưa Thầy, đây là nguyên tắc 'Luật Dữ liệu Dẫn Xuất' (Derived State). Nếu lưu cứng cột `percentage` vào DB, mỗi khi sinh viên tick hoàn thành, thêm bài, xóa bài hay sửa deadline sẽ phải chạy lệnh UPDATE lại cột đó, rất dễ dẫn đến sai lệch dữ liệu (Data Inconsistency). Tính toán động $O(N)$ ở phía client đảm bảo tiến độ luôn chính xác 100% với dữ liệu bài tập thực tế."
                }
            },
            {
                "path": "app/(app)/assignments/[id].tsx",
                "name": "Assignment Detail & Deep Link Target Screen",
                "layer": "Presentation / Dynamic Route",
                "owner": "Cả 2 Thành viên (TV1: UI, Photo Preview, Banner; TV2: Query Data by ID)",
                "requirement": "Must-Have #4 (Deep Linking Target), Kỹ thuật nâng cao (Image Attachment)",
                "purpose": "Màn hình chi tiết bài tập được mở khi người dùng bấm vào danh sách hoặc bấm vào thông báo từ thanh hệ thống điện thoại.",
                "key_code": [
                    ("useLocalSearchParams<{ id: string }>()", "Trích xuất mã `id` bài tập từ đường dẫn động."),
                    ("Deep Link Amber Banner", "Hiển thị thanh thông báo màu hổ phách nổi bật 'Bạn đã mở bài tập này từ Thông báo / Deep Link' nếu người dùng truy cập từ notification."),
                    ("Photo Attachment Preview", "Hiển thị ảnh đính kèm bài tập (nếu có) được chụp hoặc chọn từ thư viện qua `expo-image-picker`."),
                    ("Toggle Checkbox & Due Date", "Cho phép tick hoàn thành trực tiếp từ màn hình chi tiết và xem ngày giờ nộp chính xác.")
                ],
                "presentation_speech": "File `[id].tsx` là màn hình đích của cơ chế Deep Linking. Khi người dùng bấm vào thông báo hẹn giờ, app sẽ mở thẳng vào màn hình này kèm theo banner hổ phách thông báo. Màn hình hiển thị đầy đủ tên bài, môn học, ghi chú và ảnh đính kèm minh chứng bài tập.",
                "viva_trap": {
                    "question": "Làm thế nào màn hình này biết được người dùng đang mở từ Deep Link hay bấm từ danh sách thông thường?",
                    "answer": "Dạ thưa Thầy, khi payload thông báo được gửi đi, nó đính kèm cờ query param `fromNotification=true`. Tại file `[id].tsx`, nhóm dùng `useLocalSearchParams` kiểm tra nếu có cờ này thì sẽ kích hoạt hiển thị thanh Banner màu hổ phách chào mừng người dùng đến từ Deep Link."
                }
            },
            {
                "path": "app/(app)/modal/new-assignment.tsx",
                "name": "New Assignment Interactive Modal Screen",
                "layer": "Presentation / Modal Form Screen",
                "owner": "Cả 2 Thành viên (TV1: Lịch tháng ◀/▶, Stepper giờ/phút, Photo; TV2: Mutation)",
                "requirement": "Must-Have #1 (Create Assignment), Kỹ thuật nâng cao (Precision Time & Photo)",
                "purpose": "Form tạo bài tập mới dạng Modal pop-up: tích hợp cuốn lịch tháng tương tác chọn ngày, nút tăng giảm giờ/phút độ chuẩn xác cao, phím tắt 23:59/17:00, chụp ảnh và tự động lên lịch thông báo.",
                "key_code": [
                    ("Interactive Calendar Grid", "Lưới lịch trực quan với nút chuyển tháng ◀ / ▶, các ô ngày kích thước >= 44x44pt, đổi màu ô được chọn."),
                    ("Hour & Minute Stepper", "Nút bấm ± tăng giảm từng giờ hoặc từng phút linh hoạt, loại bỏ hoàn toàn sự cố gõ nhầm định dạng giờ."),
                    ("Quick Presets (23:59 & 17:00)", "Hai nút phím tắt chọn nhanh 2 khung giờ nộp bài phổ biến nhất của sinh viên."),
                    ("expo-image-picker", "Hỗ trợ chụp ảnh hoặc chọn ảnh bìa bài tập từ bộ nhớ điện thoại."),
                    ("scheduleAssignmentNotification", "Tự động lên lịch thông báo nhắc bài trước hạn chót.")
                ],
                "presentation_speech": "Modal `new-assignment.tsx` được nhóm em đầu tư rất kỹ về trải nghiệm người dùng. Thay vì bắt người dùng tự gõ chuỗi ngày tháng dễ sai sót, nhóm xây dựng cuốn lịch tháng trực quan với nút chuyển tháng ◀ / ▶, bộ tăng giảm giờ phút chính xác và 2 nút phím tắt 23:59 và 17:00. Người dùng cũng có thể đính kèm ảnh bài tập tiện lợi.",
                "viva_trap": {
                    "question": "Tại sao nhóm lại tự dựng giao diện lịch tháng và stepper giờ phút mà không dùng thư viện ngoài?",
                    "answer": "Dạ thưa Thầy, việc tự dựng component lịch và stepper giúp nhóm em hoàn toàn kiểm soát được Luật Zero-Hex và tiêu chuẩn Touch Target >= 44x44pt của Thầy trên cả nền tảng iOS, Android và Web. Các thư viện ngoài thường bị lỗi xung đột giao diện khi đổi Dark Mode hoặc vùng chạm không đạt chuẩn 44pt."
                }
            }
        ]
    },
    {
        "id": "design_and_ui",
        "title": "PHẦN 2: THIẾT KẾ GIAO DIỆN & LINH KIỆN CƠ BẢN (src/constants/ & src/components/ui/)",
        "desc": "Các viên gạch giao diện nguyên tử (Atomic UI Components) và hệ thống Design Tokens tuân thủ nghiêm ngặt Luật Zero-Hex và chuẩn trợ năng WCAG 2.1 AA.",
        "files": [
            {
                "path": "src/constants/tokens.ts",
                "name": "Design Tokens & Single Source of Truth",
                "layer": "Design System / Constants",
                "owner": "Trần Bảo Trâm (TV1)",
                "requirement": "Luật Zero-Hex, Tiêu chuẩn Touch Target >= 44x44pt",
                "purpose": "Là file DUY NHẤT trong toàn bộ dự án được phép chứa mã màu Hex, quy định bảng màu Light/Dark, khoảng cách Spacing và chuẩn vùng chạm.",
                "key_code": [
                    ("Palette", "Bộ màu cơ bản (Blue, Amber, Green, Red, Gray) định nghĩa các sắc thái chuẩn."),
                    ("ThemeTokens.light & ThemeTokens.dark", "Bảng màu ngữ nghĩa (Semantic colors): `background`, `card`, `text`, `border`, `tint`, `urgent`."),
                    ("Spacing", "Hệ thống khoảng cách bội số của 8pt: xs: 4, sm: 8, md: 16, lg: 24, xl: 32."),
                    ("TouchTarget", "Quy định kích thước tối thiểu: `min: 44` (chuẩn công thái học ngón tay người dùng).")
                ],
                "presentation_speech": "File `tokens.ts` là 'Hiến pháp thiết kế' của ứng dụng. Nhóm em tuân thủ nghiêm ngặt Luật Zero-Hex: mọi mã màu đều tập trung tại đây. Khi điện thoại chuyển từ chế độ Sáng sang Tối, toàn bộ màu nền, màu chữ và viền đều được cấp phát tự động từ file này.",
                "viva_trap": {
                    "question": "Thầy kiểm tra ngẫu nhiên thấy trong file component nào có mã hex '#FFFFFF' thì sẽ trừ điểm thế nào?",
                    "answer": "Dạ thưa Thầy, dự án của nhóm cam kết 100% tuân thủ Luật Zero-Hex, không có bất kỳ file component nào chứa mã màu Hex ngoài `tokens.ts`. Mọi màu sắc đều được gọi qua hook `useThemeColor()` hoặc `ThemeTokens`."
                }
            },
            {
                "path": "src/components/ui/ThemedText.tsx",
                "name": "Themed Typography Component",
                "layer": "Atomic UI / Typography",
                "owner": "Trần Bảo Trâm (TV1)",
                "requirement": "Luật Zero-Hex & Đồng bộ Dark Mode",
                "purpose": "Component hiển thị chữ tự động lấy màu sắc phù hợp theo chế độ Sáng/Tối của thiết bị.",
                "key_code": [
                    ("variant mapping", "Hỗ trợ các kiểu chữ: `title` (24pt bold), `subtitle` (18pt semi-bold), `body` (15pt), `caption` (13pt muted), `link` (15pt tint)."),
                    ("useThemeColor()", "Tự động trích xuất màu chữ chính hoặc phụ từ theme hiện tại."),
                    ("TextProps inheritance", "Thừa kế đầy đủ các thuộc tính của React Native Text chuẩn.")
                ],
                "presentation_speech": "Component `ThemedText.tsx` thay thế hoàn toàn thẻ `Text` mặc định. Nó giúp toàn bộ văn bản trong ứng dụng tự động hiển thị đúng màu chữ tương phản cao, chống lóa mắt ở Dark Mode và rõ ràng ở Light Mode.",
                "viva_trap": {
                    "question": "Component ThemedText này xử lý Dark Mode như thế nào?",
                    "answer": "Dạ thưa Thầy, bên trong `ThemedText`, hook `useThemeColor()` được gọi để lấy ra đối tượng màu hiện tại. Nếu đang ở Dark Mode, màu chữ sẽ tự chuyển sang màu trắng ngà `#F1F5F9`, còn ở Light Mode là màu xám đen đậm `#0F172A`."
                }
            },
            {
                "path": "src/components/ui/ThemedView.tsx",
                "name": "Themed Container View Component",
                "layer": "Atomic UI / Container",
                "owner": "Trần Bảo Trâm (TV1)",
                "requirement": "Luật Zero-Hex & Đồng bộ Dark Mode",
                "purpose": "Component khung chứa (View) tự động đổi màu nền theo theme.",
                "key_code": [
                    ("backgroundColor: colors.background", "Gán màu nền mặc định từ bảng màu ngữ nghĩa của theme."),
                    ("ViewProps inheritance", "Hỗ trợ đầy đủ layout flexbox và style tùy biến bên ngoài truyền vào.")
                ],
                "presentation_speech": "File `ThemedView.tsx` cung cấp khung chứa giao diện chuẩn, tự động áp dụng màu nền đồng nhất toàn app mà không cần viết lặp lại các lệnh điều kiện kiểm tra Dark Mode.",
                "viva_trap": {
                    "question": "Tại sao không dùng trực tiếp thẻ View của React Native rồi gán style backgroundColor?",
                    "answer": "Dạ thưa Thầy, nếu dùng View trực tiếp thì ở mỗi màn hình ta đều phải import hook theme và gán style thủ công, gây lặp code (vi phạm nguyên lý DRY) và rất dễ quên khi tạo màn hình mới. `ThemedView` đóng gói sẵn logic này giúp code gọn gàng và chuẩn xác."
                }
            },
            {
                "path": "src/components/ui/AccessibleButton.tsx",
                "name": "Accessible Touch Target Button",
                "layer": "Atomic UI / Interactive",
                "owner": "Trần Bảo Trâm (TV1)",
                "requirement": "Luật Trợ Năng (Accessibility) & Touch Target >= 44x44pt",
                "purpose": "Nút bấm chuẩn mực đáp ứng tiêu chuẩn tiếp cận ngón tay người dùng và hỗ trợ người khiếm thị sử dụng trình đọc màn hình.",
                "key_code": [
                    ("minHeight: 44, minWidth: 44", "Ép buộc kích thước tối thiểu luôn đạt chuẩn 44x44pt."),
                    ("accessibilityRole='button'", "Khai báo vai trò nút bấm cho trình đọc màn hình TalkBack/VoiceOver."),
                    ("accessibilityLabel", "Thuộc tính bắt buộc mô tả hành động của nút bằng lời văn tự nhiên."),
                    ("activeOpacity: 0.7", "Cung cấp hiệu ứng thị giác phản hồi ngay lập tức khi ngón tay chạm vào nút.")
                ],
                "presentation_speech": "Component `AccessibleButton.tsx` hiện thực hóa tiêu chuẩn trợ năng cao cấp của Thầy. Mọi nút bấm trong ứng dụng khi dùng component này đều cam kết có diện tích tiếp xúc ngón tay tối thiểu 44x44pt và tích hợp sẵn nhãn đọc hỗ trợ người khuyết tật.",
                "viva_trap": {
                    "question": "Thầy dùng thước đo trong Xcode hoặc Android Inspector thấy nút của em nhỏ hơn 44pt thì giải thích sao?",
                    "answer": "Dạ thưa Thầy, trong `AccessibleButton.tsx`, thuộc tính `minHeight: TouchTarget.min` và `minWidth: TouchTarget.min` được cố định trong `StyleSheet`. Kể cả khi nội dung bên trong chỉ là một icon nhỏ 16pt, vùng chạm xung quanh (hit target) vẫn được đệm padding tối thiểu 44x44pt nên không thể nhỏ hơn chuẩn được ạ."
                }
            },
            {
                "path": "src/components/ui/StateHandler.tsx",
                "name": "4-States UI Lifecycle Handler",
                "layer": "Atomic UI / State Management",
                "owner": "Nguyễn Thị Hương Giang (TV2)",
                "requirement": "Luật 4 Trạng Thái (Loading, Empty, Error, Content)",
                "purpose": "Bảo đảm mọi màn hình tải dữ liệu đều xử lý đầy đủ và mượt mà cả 4 trạng thái, đặc biệt là nút 'Thử lại' khi có lỗi kết nối mạng.",
                "key_code": [
                    ("isLoading state", "Hiển thị vòng xoay `ActivityIndicator` và thông báo đang tải."),
                    ("isError state", "Hiển thị icon cảnh báo lỗi kèm nút `AccessibleButton` gọi hàm `onRetry()` thật sự."),
                    ("isEmpty state", "Hiển thị hình minh họa và thông báo danh sách trống thân thiện."),
                    ("children (Content)", "Render nội dung chính khi dữ liệu đã tải thành công.")
                ],
                "presentation_speech": "File `StateHandler.tsx` là giải pháp dứt điểm cho vấn đề màn hình trắng hoặc treo app khi rớt mạng. Nó tự động chuyển đổi giữa 4 trạng thái: Đang tải, Danh sách trống, Báo lỗi có nút Thử lại, và Hiển thị dữ liệu hoàn chỉnh.",
                "viva_trap": {
                    "question": "Nút 'Thử lại' trong StateHandler có gọi hàm refetch thật không hay chỉ là nút giả lập?",
                    "answer": "Dạ thưa Thầy, nút 'Thử lại' nhận prop `onRetry` và được truyền trực tiếp hàm `refetch` từ hook TanStack Query `useAssignments()` hoặc `useCourses()`. Khi người dùng bấm nút, ứng dụng sẽ thực sự gửi lại request mạng lên server để lấy dữ liệu mới."
                }
            },
            {
                "path": "src/components/ui/OfflineBanner.tsx",
                "name": "Real-time Offline Timestamp Alert Banner",
                "layer": "Atomic UI / Alert Banner",
                "owner": "Cả 2 Thành viên (TV1: UI Amber Banner; TV2: Real-time Timestamp & Store)",
                "requirement": "Kỹ thuật nâng cao (Offline Tolerance & Real-time Timestamp)",
                "purpose": "Hiển thị dải băng cảnh báo màu hổ phách khi mất kết nối mạng, hiển thị CHÍNH XÁC MỐC THỜI GIAN THỰC TẾ mà dữ liệu offline vừa được lưu/sửa đổi.",
                "key_code": [
                    ("useIsOffline()", "Lắng nghe trạng thái mất mạng từ Zustand `useNetworkStore`."),
                    ("useNetworkStore(cachedTime)", "Hiển thị chuỗi thời gian thực tế dạng `HH:MM:SS` ngay khi có thay đổi offline."),
                    ("Amber Styling", "Sử dụng mã màu cảnh báo tiêu chuẩn trong Tokens, nền vàng hổ phách nhạt chữ nâu đậm nổi bật.")
                ],
                "presentation_speech": "File `OfflineBanner.tsx` đem lại sự an tâm tuyệt đối cho sinh viên khi mất mạng. Banner màu hổ phách sẽ xuất hiện và thông báo rõ: 'Đang ở chế độ ngoại tuyến. Dữ liệu đã lưu cục bộ lúc HH:MM:SS'. Mốc thời gian này được cập nhật theo thời gian thực mỗi khi có thao tác mới.",
                "viva_trap": {
                    "question": "Thời gian hiển thị trên banner lấy từ đâu? Có phải là thời gian fix cứng không?",
                    "answer": "Dạ thưa Thầy, thời gian hoàn toàn là thời gian thực (dynamic real-time)! Mỗi khi app phát hiện mất mạng hoặc khi sinh viên tick bài tập trong chế độ offline, hàm xử lý sẽ gọi `new Date().toLocaleTimeString('vi-VN')` và lưu vào `cachedTime` của store, đảm bảo thời gian hiển thị luôn chuẩn xác tới từng giây."
                }
            }
        ]
    },
    {
        "id": "feature_components",
        "title": "PHẦN 3: TẦNG LINH KIỆN NGHIỆP VỤ (src/components/features/)",
        "desc": "Các linh kiện giao diện nghiệp vụ chuyên sâu phục vụ quản lý bài tập, cảnh báo hạn chót và hiển thị lịch học trực quan.",
        "files": [
            {
                "path": "src/components/features/AssignmentCard.tsx",
                "name": "Interactive Assignment Card Component",
                "layer": "Feature Component / Assignment Item",
                "owner": "Trần Bảo Trâm (TV1)",
                "requirement": "Must-Have #1 (List View, Strike-through, Checkbox 44pt), Luật Zero-Hex",
                "purpose": "Hiển thị thẻ bài tập với vạch màu nhận diện môn học, ô checkbox chuẩn 44x44pt, hiệu ứng gạch ngang chữ khi hoàn thành và chuyển trang chi tiết.",
                "key_code": [
                    ("Course Color Strip", "Vạch màu dọc bên trái thẻ giúp sinh viên nhận diện môn học trong 1 giây mà không cần đọc chữ."),
                    ("Checkbox HitTarget 44x44pt", "Bọc ô checkbox bằng TouchableOpacity có kích thước tối thiểu 44x44pt, tích hợp `accessibilityRole='checkbox'`."),
                    ("textDecorationLine: 'line-through'", "Tự động gạch ngang tiêu đề bài tập và làm mờ thẻ khi bài tập đã được đánh dấu hoàn thành."),
                    ("Optimistic Toggle Callback", "Gọi trực tiếp hàm `onToggle` để kích hoạt cập nhật lạc quan ngay lập tức.")
                ],
                "presentation_speech": "Component `AssignmentCard.tsx` là nơi người dùng tương tác nhiều nhất. Thẻ có vạch màu môn học đặc trưng, tiêu đề tự động gạch ngang khi làm xong và đặc biệt là ô checkbox được thiết kế vùng chạm tối thiểu 44x44pt, bấm cực kỳ nhạy và không bao giờ trượt.",
                "viva_trap": {
                    "question": "Làm thế nào để người dùng bấm vào checkbox thì tick hoàn thành, còn bấm vào thân thẻ thì mở màn hình chi tiết?",
                    "answer": "Dạ thưa Thầy, nhóm tách biệt thành 2 vùng Touchable riêng biệt: Vùng thân thẻ là một `TouchableOpacity` có sự kiện `onPress` điều hướng sang `/assignments/[id]`. Còn ô checkbox là một `TouchableOpacity` con độc lập có kích thước 44x44pt bắt sự kiện `onToggle(item.id)`, sự kiện này không bị nổi bọt (event bubbling) làm mở nhầm trang chi tiết."
                }
            },
            {
                "path": "src/components/features/Due48hWidget.tsx",
                "name": "Urgent 48-Hour Deadline Widget",
                "layer": "Feature Component / Urgent Deadlines",
                "owner": "Trần Bảo Trâm (TV1)",
                "requirement": "Must-Have #2 (Urgent Deadlines Sliding Window Widget)",
                "purpose": "Khối widget cảnh báo thông minh trên Trang chủ: quét toàn bộ bài tập và chỉ hiển thị những bài có hạn nộp trong vòng 48 giờ tới.",
                "key_code": [
                    ("isDueWithin48Hours()", "Sử dụng hàm tiện ích tính toán chính xác cửa sổ thời gian 48 giờ dựa trên ngày lịch `startOfDay`."),
                    ("Badge Đỏ / Hổ phách", "Hiển thị huy hiệu 'Gấp' hoặc 'Hạn chót' nổi bật để thúc đẩy sinh viên nộp bài."),
                    ("Empty State", "Nếu không có bài tập nào sắp đến hạn, hiển thị thông điệp nhẹ nhàng 'Tuyệt vời! Không có bài tập nào sắp hết hạn trong 48h'.")
                ],
                "presentation_speech": "File `Due48hWidget.tsx` là tính năng 'cứu cánh' giúp sinh viên không bao giờ bị quên bài. Widget này tự động tính toán cửa sổ trượt 48 giờ để đưa các bài tập khẩn cấp lên đầu trang chủ, giúp sinh viên ưu tiên hoàn thành trước.",
                "viva_trap": {
                    "question": "Nếu một bài tập đã được tick hoàn thành (completed: true) nhưng hạn nộp vẫn nằm trong 48h thì widget có hiển thị không?",
                    "answer": "Dạ thưa Thầy là KHÔNG ạ! Thuật toán lọc trong widget kết hợp 2 điều kiện: `!item.completed && isDueWithin48Hours(item.dueDate)`. Những bài đã xong sẽ tự động ẩn khỏi widget khẩn cấp để sinh viên tập trung vào các bài chưa làm."
                }
            },
            {
                "path": "src/components/features/WeeklyCalendar.tsx",
                "name": "Interactive 7-Day Weekly Calendar Strip",
                "layer": "Feature Component / Calendar View",
                "owner": "Trần Bảo Trâm (TV1)",
                "requirement": "Must-Have #3 (Weekly View Calendar Strip & Dot Indicator)",
                "purpose": "Thanh dải lịch 7 ngày trong tuần từ Thứ 2 đến Chủ nhật, hỗ trợ chọn ngày xem bài tập và hiển thị chấm tròn trạng thái biểu diễn bài tập.",
                "key_code": [
                    ("Monday-to-Sunday Range", "Tự động tính toán mốc ngày bắt đầu từ Thứ Hai của tuần hiện tại đến Chủ Nhật."),
                    ("Day Cell TouchTarget >= 44pt", "Mỗi ô ngày là một nút bấm vuông vức >= 44pt với số ngày và thứ viết tắt (T2, T3, T4...)."),
                    ("Status Dot Indicator", "Chấm tròn nhỏ màu đỏ cam xuất hiện dưới ô ngày nếu ngày đó có bài tập cần nộp."),
                    ("Selected Day Highlight", "Ô ngày đang được chọn sẽ đổi sang màu thương hiệu nổi bật để người dùng dễ theo dõi.")
                ],
                "presentation_speech": "Component `WeeklyCalendar.tsx` mang đến trải nghiệm lịch tuần chuẩn mực. Lịch trải dài từ Thứ 2 đến Chủ nhật theo đúng thói quen học tập của sinh viên Việt Nam. Chấm tròn trạng thái dưới từng ngày giúp nhìn vào là biết ngay ngày nào có bài tập cần giải quyết.",
                "viva_trap": {
                    "question": "Tại sao lịch tuần của nhóm bắt đầu từ Thứ Hai mà không phải Chủ Nhật như lịch mặc định của Mỹ?",
                    "answer": "Dạ thưa Thầy, theo văn hóa học tập và làm việc tại Việt Nam (chuẩn ISO 8601), tuần học luôn bắt đầu từ Thứ Hai và kết thúc vào Chủ Nhật. Thiết kế này giúp sinh viên theo dõi lịch học một cách trực quan, gần gũi và đúng thực tế nhất."
                }
            }
        ]
    },
    {
        "id": "state_and_security",
        "title": "PHẦN 4: TẦNG QUẢN TRỊ TRẠNG THÁI & BẢO MẬT PHẦN CỨNG (src/store/)",
        "desc": "Quản lý phiên đăng nhập và token người dùng bằng Zustand kết hợp mã hóa phần cứng expo-secure-store.",
        "files": [
            {
                "path": "src/store/authStore.ts",
                "name": "Hardware Encrypted Zustand Auth Store",
                "layer": "Application / State & Security Store",
                "owner": "Nguyễn Thị Hương Giang (TV2)",
                "requirement": "Must-Have #5 (Auth State Management & Hardware Encryption SecureStore)",
                "purpose": "Quản lý trạng thái xác thực toàn cục, cam kết lưu trữ token đăng nhập trong phần cứng an toàn Keychain/Keystore qua `expo-secure-store`, tuyệt đối không dùng `AsyncStorage` cho token.",
                "key_code": [
                    ("SecureStore.setItemAsync('auth_token')", "Lưu trữ token đăng nhập bằng thuật toán mã hóa phần cứng của hệ điều hành."),
                    ("restoreSession()", "Đọc lại token khi khởi động app, phục hồi phiên đăng nhập tự động (Survive App Restart)."),
                    ("login(username, password)", "Xác thực thông tin tài khoản mẫu, cấp phát token và lưu thông tin người dùng vào store."),
                    ("logout()", "Xóa sạch token khỏi SecureStore và đưa trạng thái `user` về `null` an toàn.")
                ],
                "presentation_speech": "File `authStore.ts` thể hiện sự nghiêm túc về bảo mật ứng dụng. Nhóm em tuân thủ nghiêm ngặt yêu cầu của Thầy: không bao giờ lưu token xác thực vào AsyncStorage thô mà sử dụng `expo-secure-store` để mã hóa qua Keystore trên Android và Keychain trên iOS.",
                "viva_trap": {
                    "question": "Tại sao không được lưu Token đăng nhập vào AsyncStorage mà bắt buộc phải dùng SecureStore?",
                    "answer": "Dạ thưa Thầy, `AsyncStorage` lưu trữ dữ liệu dưới dạng plain-text (văn bản thô không mã hóa) trong thư mục ứng dụng. Nếu điện thoại bị root, jailbreak hoặc bị phần mềm độc hại tấn công, hacker có thể trích xuất token rất dễ dàng. Ngược lại, `SecureStore` sử dụng chip bảo mật phần cứng chuyên dụng (Secure Enclave / TEE) để mã hóa khóa, đảm bảo an toàn tuyệt đối theo chuẩn bảo mật ngân hàng."
                }
            }
        ]
    },
    {
        "id": "data_hooks",
        "title": "PHẦN 5: TẦNG DỮ LIỆU MẠNG, CACHE & THÔNG BÁO (src/hooks/)",
        "desc": "Tầng tích hợp Remote API với TanStack Query v5, xử lý Cập nhật lạc quan (Optimistic Update), Đồng bộ Offline và Lập lịch Thông báo Deep Link.",
        "files": [
            {
                "path": "src/hooks/useThemeColor.ts",
                "name": "Dynamic Theme Sensor & Color Resolver Hook",
                "layer": "Infrastructure / Theme Hook",
                "owner": "Trần Bảo Trâm (TV1)",
                "requirement": "Luật Zero-Hex & Single Source of Truth",
                "purpose": "Lắng nghe chế độ sáng/tối của hệ điều hành hoặc tùy chọn trong cài đặt của người dùng, tự động trả về bộ mã màu tương ứng từ `tokens.ts`.",
                "key_code": [
                    ("useColorScheme()", "Cảm biến chế độ màu hệ thống từ React Native."),
                    ("useThemeStore", "Lấy thiết lập theme mà người dùng chủ động chọn (light, dark, hoặc system)."),
                    ("ThemeTokens[theme]", "Cấp phát bảng màu ngữ nghĩa chính xác cho toàn bộ giao diện.")
                ],
                "presentation_speech": "Hook `useThemeColor.ts` giúp ứng dụng tự động hòa nhịp cùng hệ thống. Khi người dùng bật Dark Mode trên điện thoại, hook này lập tức phát tín hiệu đổi màu cho toàn bộ component trong app mà không cần tải lại trang.",
                "viva_trap": {
                    "question": "Nếu người dùng chọn ép buộc chế độ Tối (Dark) trong app nhưng máy đang để Sáng (Light) thì hook này ưu tiên cái nào?",
                    "answer": "Dạ thưa Thầy, hook kiểm tra cấu hình trong `useThemeStore` trước: Nếu người dùng đã chỉ định rõ 'dark' hoặc 'light' thì sẽ ưu tiên lựa chọn của người dùng. Chỉ khi người dùng chọn 'system' thì hook mới lấy theo chế độ `useColorScheme()` của máy."
                }
            },
            {
                "path": "src/hooks/useAssignments.ts",
                "name": "TanStack Query Assignments CRUD & Offline Engine",
                "layer": "Data Layer / Remote API & Cache",
                "owner": "Nguyễn Thị Hương Giang (TV2)",
                "requirement": "Must-Have #1, Kỹ thuật nâng cao (Optimistic Updates & Offline Tolerance)",
                "purpose": "File dữ liệu trung tâm quản lý toàn bộ vòng đời của Bài tập: Fetch API, Cập nhật lạc quan kèm Rollback tự động khi lỗi mạng, Bộ nhớ đệm ngoại tuyến AsyncStorage và Giám sát kết nối mạng tự động.",
                "key_code": [
                    ("useQuery(['assignments'])", "Quản lý việc tải dữ liệu từ MockAPI, lưu cache TanStack Query với retry 2 lần."),
                    ("useToggleAssignment (Optimistic Update)", "Trong `onMutate`: hủy truy vấn đang chạy, lưu snapshot cache cũ (`previous`), ghi đè trạng thái mới ngay lập tức. Trong `onError`: khôi phục lại đúng `previous`. Trong `onSettled`: gọi `invalidateQueries` để đồng bộ server."),
                    ("AsyncStorage Offline Backup", "Tự động ghi bản sao dữ liệu vào AsyncStorage kèm mốc thời gian thực mỗi khi có dữ liệu mới."),
                    ("useNetworkStore & Listener", "Tự động lắng nghe sự kiện mạng (online/offline trên Web và bắt lỗi Fetch trên Mobile) để kích hoạt `isOffline` và `cachedTime`.")
                ],
                "presentation_speech": "Kính thưa Thầy, `useAssignments.ts` là đỉnh cao kỹ thuật về tầng dữ liệu trong đồ án của nhóm. Khi sinh viên bấm hoàn thành bài tập, giao diện đổi trạng thái trong 0 mili-giây nhờ Cập nhật lạc quan. Nếu server lỗi hoặc mất mạng, hệ thống tự động hoàn tác (rollback) trạng thái cũ. Khi mất mạng hoàn toàn, app tự chuyển sang đọc AsyncStorage và cập nhật mốc thời gian thực.",
                "viva_trap": {
                    "question": "Em hãy giải thích cơ chế 3 giai đoạn onMutate -> onError -> onSettled trong hàm useToggleAssignment?",
                    "answer": "Dạ thưa Thầy: 1. `onMutate` chạy trước khi request gửi đi: nó chụp lại bản sao cache hiện tại `previous` và ghi đè trạng thái mới lên UI để người dùng thấy phản hồi tức thì. 2. `onError` chạy nếu request thất bại hoặc mất mạng: nó dùng bản `previous` để rollback UI về trạng thái ban đầu, tránh sai lệch. 3. `onSettled` chạy khi request kết thúc (bất kể thành công hay lỗi): nó invalidate query để kéo dữ liệu mới nhất từ server về đồng bộ."
                }
            },
            {
                "path": "src/hooks/useCourses.ts",
                "name": "Courses Data Query Hook",
                "layer": "Data Layer / Courses API",
                "owner": "Nguyễn Thị Hương Giang (TV2)",
                "requirement": "Must-Have #6 (Course Data Management)",
                "purpose": "Truy vấn danh sách các môn học (Lập trình Mobile, Cơ sở Dữ liệu, Trí tuệ Nhân tạo...), gán mã màu nhận diện thương hiệu cho từng môn.",
                "key_code": [
                    ("useQuery(['courses'])", "Fetch danh sách môn học từ API hoặc mock data chuẩn, cache tự động với `staleTime` 5 phút."),
                    ("Course Entity", "Mỗi môn học gồm `id`, `name`, `code`, `color` và `instructor`.")
                ],
                "presentation_speech": "File `useCourses.ts` cung cấp danh sách môn học cho toàn bộ ứng dụng. Danh sách này được cache trong 5 phút để tối ưu hóa hiệu năng và giảm tải số lượng request mạng không cần thiết.",
                "viva_trap": {
                    "question": "Dữ liệu môn học có thay đổi thường xuyên không mà đặt staleTime là 5 phút?",
                    "answer": "Dạ thưa Thầy, thông tin môn học và giảng viên thường cố định trong suốt học kỳ, rất ít khi thay đổi. Đặt `staleTime: 5 phút` là hoàn toàn hợp lý, giúp màn hình Trang chủ và màn hình Lịch mở lên tức thì từ cache mà không cần request lại server mỗi lần chuyển tab."
                }
            },
            {
                "path": "src/hooks/useNotifications.ts",
                "name": "Expo Notifications & Deep Linking Hook",
                "layer": "Infrastructure / Push Notifications",
                "owner": "Trần Bảo Trâm (TV1)",
                "requirement": "Must-Have #4 (Notifications & Deep Linking)",
                "purpose": "Xin quyền thông báo, lên lịch thông báo nhắc bài tập trước hạn nộp, tạo nút kích hoạt thông báo demo và bắt sự kiện chạm vào thông báo để điều hướng Deep Link.",
                "key_code": [
                    ("requestNotificationPermissions()", "Kiểm tra và yêu cầu cấp quyền hiển thị thông báo trên thiết bị."),
                    ("scheduleAssignmentNotification()", "Lên lịch thông báo dựa trên hạn nộp của bài tập, đính kèm data payload `{ assignmentId: id }`."),
                    ("triggerDemoNotification()", "Kích hoạt thông báo tức thì sau 2 giây phục vụ buổi thuyết trình demo của Thầy."),
                    ("useNotificationListener()", "Lắng nghe sự kiện `addNotificationResponseReceivedListener`, trích xuất `assignmentId` và gọi `router.push('/assignments/' + id)`.")
                ],
                "presentation_speech": "File `useNotifications.ts` hiện thực trọn vẹn yêu cầu thông báo và Deep Link của Thầy. Nhóm em đã chuẩn bị sẵn hàm `triggerDemoNotification()`: khi bấm nút demo, sau 2 giây một thông báo sẽ xuất hiện trên thanh trạng thái. Khi Thầy bấm vào thông báo đó, ứng dụng sẽ lập tức mở đúng màn hình chi tiết của bài tập tương ứng.",
                "viva_trap": {
                    "question": "Deep Link hoạt động như thế nào khi người dùng bấm vào thông báo?",
                    "answer": "Dạ thưa Thầy, khi lên lịch thông báo bằng `Notifications.scheduleNotificationAsync`, nhóm đính kèm một object `data: { assignmentId: '123' }`. Trong `useNotificationListener`, khi người dùng bấm vào thông báo, listener sẽ bắt được `response.notification.request.content.data`, lấy ra `assignmentId` và dùng `router.push('/assignments/' + assignmentId)` để chuyển thẳng đến màn hình chi tiết bài tập."
                }
            }
        ]
    },
    {
        "id": "types_and_utils",
        "title": "PHẦN 6: KIỂU DỮ LIỆU & HÀM XỬ LÝ THUẦN TÚY (src/types/ & src/utils/)",
        "desc": "Mô hình dữ liệu TypeScript chặt chẽ và các hàm tính toán logic lõi (Pure Functions) xử lý múi giờ và tiến độ môn học.",
        "files": [
            {
                "path": "src/types/study.ts",
                "name": "Core Domain Models & TypeScript Interfaces",
                "layer": "Domain Model / Type Definitions",
                "owner": "Nguyễn Thị Hương Giang (TV2)",
                "requirement": "Tiêu chuẩn Type-Safety & Kiến trúc Phần mềm",
                "purpose": "Định nghĩa toàn bộ cấu trúc dữ liệu cho Ứng dụng: User, Course, AssignmentItem, CourseProgressStats, đảm bảo tính chặt chẽ về mặt kiểu dữ liệu.",
                "key_code": [
                    ("AssignmentItem interface", "Gồm: `id`, `title`, `courseId`, `dueDate`, `completed`, `notes`, `photoUri`."),
                    ("Course interface", "Gồm: `id`, `name`, `code`, `color`, `instructor`."),
                    ("User interface", "Gồm: `id`, `username`, `fullName`, `role`, `token`."),
                    ("CourseProgressStats interface", "Gồm: `courseId`, `total`, `completed`, `percentage` (dữ liệu dẫn xuất).")
                ],
                "presentation_speech": "File `study.ts` là bản vẽ thiết kế dữ liệu của cả hệ thống. Việc định nghĩa chặt chẽ TypeScript Interfaces giúp toàn bộ code trong dự án có tính Type-Safety tuyệt đối, loại bỏ hoàn toàn các lỗi cú pháp và lỗi truy cập thuộc tính không tồn tại.",
                "viva_trap": {
                    "question": "Trong AssignmentItem, thuộc tính photoUri có bắt buộc không?",
                    "answer": "Dạ thưa Thầy là không bắt buộc ạ, nó được định nghĩa là `photoUri?: string`. Sinh viên có thể tạo bài tập có ảnh đính kèm hoặc không có ảnh, hệ thống đều xử lý an toàn mà không bị lỗi undefined."
                }
            },
            {
                "path": "src/types/testing.d.ts",
                "name": "Jest & Testing TypeScript Declarations",
                "layer": "Testing / Type Declarations",
                "owner": "Nguyễn Thị Hương Giang (TV2)",
                "requirement": "Automated Testing Infrastructure",
                "purpose": "Khai báo kiểu cho môi trường kiểm thử Jest và các custom matchers của React Native Testing Library.",
                "key_code": [
                    ("declare global namespace Jest", "Cung cấp type hint cho các hàm test `describe`, `it`, `expect`.")
                ],
                "presentation_speech": "File `testing.d.ts` phục vụ hạ tầng kiểm thử tự động, giúp mã nguồn test có đầy đủ gợi ý và kiểm tra kiểu nghiêm ngặt trong quá trình viết Unit Test.",
                "viva_trap": {
                    "question": "File .d.ts có được biên dịch vào file chạy ứng dụng (bundle) cuối cùng không?",
                    "answer": "Dạ thưa Thầy là KHÔNG ạ! Các file `.d.ts` chỉ là file khai báo kiểu (Declaration files) phục vụ cho trình biên dịch TypeScript và IDE nhận diện cú pháp, nó sẽ tự động bị lược bỏ hoàn toàn khi đóng gói ứng dụng (bundle)."
                }
            },
            {
                "path": "src/utils/dateUtils.ts",
                "name": "Timezone Boundary & 48-Hour Deadline Pure Functions",
                "layer": "Core Logic / Date Utilities",
                "owner": "Nguyễn Thị Hương Giang (TV2)",
                "requirement": "Must-Have #2, Luật Xử Lý Ngày & Múi Giờ",
                "purpose": "Chứa các hàm xử lý ngày tháng thuần túy (Pure Functions), đặc biệt là hàm `startOfDay` đưa thời gian về mốc 00:00:00 để so sánh ngày chính xác không bị lệch giờ.",
                "key_code": [
                    ("startOfDay(date)", "Đưa mốc thời gian về `00:00:00.000` của ngày địa phương, giải quyết triệt để lỗi so sánh chênh lệch giờ."),
                    ("isDueWithin48Hours(dueDateStr, now)", "Thuật toán kiểm tra hạn nộp có nằm trong khoảng từ hôm nay đến 48 giờ tới hay không."),
                    ("formatDateVi(dateStr)", "Định dạng ngày theo chuẩn tiếng Việt: 'Thứ Hai, 15/10/2026'."),
                    ("getDaysInMonth(year, month)", "Tính toán số ngày trong tháng phục vụ dựng lưới lịch Modal.")
                ],
                "presentation_speech": "File `dateUtils.ts` giải quyết một trong những bài toán hóc búa nhất của lập trình Mobile: xử lý múi giờ và ngày lịch. Bằng cách sử dụng hàm `startOfDay()`, nhóm loại bỏ hoàn toàn lỗi cộng 24 giờ chay, đảm bảo hạn chót bài tập luôn chuẩn xác trên mọi thiết bị.",
                "viva_trap": {
                    "question": "Tại sao không lấy Date.now() + 48*60*60*1000 để kiểm tra hạn 48 giờ mà phải dùng startOfDay?",
                    "answer": "Dạ thưa Thầy, nếu sinh viên kiểm tra bài tập lúc 23:30 đêm, bài tập nộp vào 08:00 sáng mốt: Nếu cộng 48 giờ thuần túy theo mili-giây, khoảng cách thời gian có thể bị lệch qua ranh giới ngày. Hàm `startOfDay()` đưa cả hai mốc về 00:00:00 của ngày lịch, đảm bảo so sánh theo ngày dương lịch chuẩn xác 100% không phụ thuộc vào giờ sinh viên mở app."
                }
            },
            {
                "path": "src/utils/statsUtils.ts",
                "name": "Pure Mathematical Progress Computation O(N)",
                "layer": "Core Logic / Mathematical Statistics",
                "owner": "Nguyễn Thị Hương Giang (TV2)",
                "requirement": "Must-Have #6, Luật Dữ liệu Dẫn Xuất",
                "purpose": "Chứa hàm thuần túy `computeCourseProgress()` tính toán thống kê tiến độ môn học (tổng số bài, số bài xong, tỉ lệ %) với độ phức tạp tối ưu $O(N)$.",
                "key_code": [
                    ("computeCourseProgress(assignments, courseId)", "Hàm thuần túy nhận danh sách bài tập và mã môn học, trả về `{ total, completed, percentage }`."),
                    ("Edge cases handling", "Xử lý an toàn các trường hợp biên: môn học chưa có bài tập nào (trả về 0%, không bị lỗi chia cho 0 `NaN`), hoàn thành 0 bài (0%), hoàn thành toàn bộ (100%)."),
                    ("Math.round()", "Làm tròn phần trăm thành số nguyên đẹp mắt.")
                ],
                "presentation_speech": "File `statsUtils.ts` hiện thực thuật toán tính toán tiến độ môn học. Đây là hàm thuần túy (Pure Function) không có tác dụng phụ (no side-effects), độ phức tạp tuyến tính $O(N)$, xử lý hoàn hảo mọi trường hợp biên như danh sách rỗng hay chia cho 0.",
                "viva_trap": {
                    "question": "Nếu một môn học chưa có bài tập nào (total === 0) thì phép tính total > 0 ? Math.round((completed/total)*100) : 0 trả về gì?",
                    "answer": "Dạ thưa Thầy, hàm sẽ kiểm tra điều kiện `total === 0` và trả về ngay số `0%`. Phép kiểm tra này ngăn chặn hoàn toàn lỗi toán học chia cho 0 dẫn đến giá trị `NaN` (Not a Number) làm sập giao diện."
                }
            }
        ]
    },
    {
        "id": "automated_tests",
        "title": "PHẦN 7: TẦNG KIỂM THỬ TỰ ĐỘNG (DIRECTORY: __tests__/ — JEST)",
        "desc": "Hệ thống kiểm thử tự động toàn diện đạt 10/10 PASS trên 3 Test Suites, bao phủ cả Pure Logic Unit Tests và Component Accessibility Tests.",
        "files": [
            {
                "path": "__tests__/statsUtils.test.ts",
                "name": "Course Progress Statistics Unit Test Suite",
                "layer": "Automated Testing / Logic Unit Test",
                "owner": "Nguyễn Thị Hương Giang (TV2)",
                "requirement": "Tiêu chí Đồ án: Automated Tests (Critical Path Logic)",
                "purpose": "Kiểm thử tự động hàm tính phần trăm tiến độ môn học với mọi kịch bản và dữ liệu biên phức tạp.",
                "key_code": [
                    ("Test: empty assignments", "Xác nhận trả về 0% khi danh sách bài tập rỗng."),
                    ("Test: 0 completed out of 5", "Xác nhận trả về 0% khi chưa làm bài nào."),
                    ("Test: 3 completed out of 4", "Xác nhận trả về chính xác 75%."),
                    ("Test: all completed", "Xác nhận trả về 100% khi làm xong tất cả."),
                    ("Test: filter by courseId", "Xác nhận hàm chỉ tính bài tập của đúng môn học được yêu cầu, không tính nhầm sang môn khác.")
                ],
                "presentation_speech": "Bộ test `statsUtils.test.ts` kiểm tra tính toán toán học của tiến độ môn học. Tất cả 5 ca kiểm thử bao quát từ trường hợp danh sách rỗng, hoàn thành một phần đến hoàn thành toàn bộ đều đạt kết quả PASS 100%.",
                "viva_trap": {
                    "question": "Tại sao em lại chọn hàm computeCourseProgress để viết Unit Test đầu tiên?",
                    "answer": "Dạ thưa Thầy, vì đây là 'Luồng nghiệp vụ trọng yếu' (Critical Path). Tiến độ môn học phản ánh trực tiếp kết quả học tập của sinh viên. Nếu hàm này tính sai, toàn bộ giao diện thanh tiến độ và thống kê sẽ hiển thị sai lệch, nên bắt buộc phải có Unit Test tự động bảo vệ."
                }
            },
            {
                "path": "__tests__/dateUtils.test.ts",
                "name": "Date & Timezone Boundary Unit Test Suite",
                "layer": "Automated Testing / Logic Unit Test",
                "owner": "Nguyễn Thị Hương Giang (TV2)",
                "requirement": "Tiêu chí Đồ án: Automated Tests (Date & Timezone Logic)",
                "purpose": "Kiểm thử tự động hàm `isDueWithin48Hours` và `startOfDay` để chứng minh thuật toán không bị ảnh hưởng bởi chênh lệch giờ và múi giờ.",
                "key_code": [
                    ("Test: deadline in 12 hours", "Xác nhận trả về `true` (nằm trong 48h)."),
                    ("Test: deadline in 36 hours", "Xác nhận trả về `true` (nằm trong 48h)."),
                    ("Test: deadline in 5 days", "Xác nhận trả về `false` (ngoài cửa sổ 48h)."),
                    ("Test: past deadline", "Xác nhận trả về `false` (bài tập đã quá hạn)."),
                    ("Test: startOfDay normalization", "Xác nhận giờ, phút, giây, mili-giây đều được đưa về số 0 chuẩn xác.")
                ],
                "presentation_speech": "Bộ test `dateUtils.test.ts` chứng minh tính chính xác của thuật toán thời gian. Bất kể bài tập nộp vào lúc nửa đêm, sáng sớm hay cách 36 tiếng, các bài test đều xác nhận cửa sổ 48 giờ hoạt động hoàn toàn chính xác.",
                "viva_trap": {
                    "question": "Trong bài test dateUtils, làm thế nào để kết quả test không bị sai khi chạy ở các ngày khác nhau trong năm?",
                    "answer": "Dạ thưa Thầy, trong các ca kiểm thử, nhóm truyền vào tham số mốc `now` cố định (hoặc dùng hàm `new Date()`) rồi cộng trừ tương đối ngày từ mốc đó, giúp bài test luôn cho ra kết quả đồng nhất mà không phụ thuộc vào ngày chạy test."
                }
            },
            {
                "path": "__tests__/AssignmentCard.test.tsx",
                "name": "Assignment Card & Touch Target Component Test Suite",
                "layer": "Automated Testing / Component Accessibility Test",
                "owner": "Trần Bảo Trâm (TV1)",
                "requirement": "Tiêu chí Đồ án: Automated Tests (Component Accessibility & Interaction)",
                "purpose": "Kiểm thử tự động trên Component thực tế: xác minh vùng chạm tối thiểu 44x44pt và sự kiện click vào checkbox.",
                "key_code": [
                    ("Test: minHeight >= 44 & minWidth >= 44", "Kiểm tra style của ô checkbox đảm bảo đúng kích thước công thái học ngón tay người dùng."),
                    ("Test: fireEvent.press(checkbox)", "Mô phỏng ngón tay người dùng bấm vào checkbox và xác minh hàm `onToggle` được gọi đúng 1 lần với đúng `id` bài tập."),
                    ("Test: strike-through style", "Xác nhận khi `completed: true` thì style chữ có thuộc tính `line-through`.")
                ],
                "presentation_speech": "Bộ test `AssignmentCard.test.tsx` là minh chứng bằng code cho việc nhóm tuân thủ Luật Trợ Năng của Thầy. Jest tự động kiểm tra kích thước ô bấm đạt chuẩn tối thiểu 44x44pt và kiểm tra sự kiện bấm checkbox kích hoạt chính xác.",
                "viva_trap": {
                    "question": "Làm thế nào Jest kiểm tra được kích thước minHeight 44pt của component trên môi trường dòng lệnh không có màn hình thật?",
                    "answer": "Dạ thưa Thầy, Jest sử dụng `react-test-renderer` kết hợp thư viện testing để render component thành cây cấu trúc JSON (Virtual Tree). Từ cây này, test runner truy vấn đến node checkbox và kiểm tra thuộc tính `props.style`, xác minh `minHeight >= 44` và `minWidth >= 44`."
                }
            }
        ]
    },
    {
        "id": "config_and_docs",
        "title": "PHẦN 8: CẤU HÌNH DỰ ÁN, SCRIPTS & BÁO CÁO MINH BẠCH (ROOT FILES)",
        "desc": "Các file cấu hình chuẩn, script tự động hóa đóng gói và toàn bộ tài liệu minh bạch theo đúng yêu cầu đồ án của Thầy Nguyễn Xuân Vinh.",
        "files": [
            {
                "path": "README.md",
                "name": "Clean-Machine Setup & Running Documentation",
                "layer": "Documentation / Instructions",
                "owner": "Cả 2 Thành viên",
                "requirement": "Tiêu chuẩn Đồ án: Setup from Clean Machine",
                "purpose": "Tài liệu hướng dẫn chi tiết từng bước thiết lập và chạy dự án từ một chiếc máy tính hoàn toàn mới (Clean Machine) mà không gặp lỗi.",
                "key_code": [
                    ("Prerequisites", "Yêu cầu Node.js >= 18, npm/pnpm, Git."),
                    ("Installation commands", "`npm install` kèm giải thích script postinstall."),
                    ("Run commands", "`npm test` chạy 10 test Jest, `npx expo start -c` chạy app."),
                    ("Account table", "Bảng thông tin tài khoản demo sinh viên và giảng viên.")
                ],
                "presentation_speech": "File `README.md` được viết cực kỳ cặn kẽ. Bất kỳ ai tải mã nguồn về trên một chiếc máy tính mới đều có thể chạy thành công dự án chỉ sau 2 câu lệnh cài đặt và khởi động mà không gặp bất kỳ lỗi thiếu thư viện nào.",
                "viva_trap": {
                    "question": "Nếu máy của Thầy chưa cài biến môi trường gì cả thì có chạy được app không?",
                    "answer": "Dạ thưa Thầy có ạ! Dự án sử dụng Expo chuẩn, mọi dependencies đã được liệt kê đầy đủ trong `package.json` và cấu hình cổng đã được tối ưu, Thầy chỉ cần gõ `npm install` rồi `npm start` là app chạy mượt mà ngay trên trình duyệt hoặc điện thoại."
                }
            },
            {
                "path": "AI_LOG.md",
                "name": "Transparent AI Collaboration Log",
                "layer": "Documentation / Transparency",
                "owner": "Cả 2 Thành viên",
                "requirement": "Tiêu chí Đồ án: AI Collaboration Transparency",
                "purpose": "Nhật ký tương tác AI minh bạch 100%: ghi lại toàn bộ các câu lệnh prompt, những gì nhóm tiếp nhận, những gì nhóm BÁC BỎ và lý do kỹ thuật phản biện AI.",
                "key_code": [
                    ("Accepted prompts", "AI đề xuất khung sườn tokens, hàm date math cơ bản."),
                    ("Rejected prompts & Critical Thinking", "Bác bỏ đề xuất lưu auth token vào AsyncStorage của AI (vì vi phạm bảo mật), Bác bỏ việc AI dùng mã màu hex trực tiếp trong component (vi phạm Luật Zero-Hex)."),
                    ("Lessons learned", "Bài học rút ra về việc làm chủ mã nguồn và không phụ thuộc mù quáng vào AI.")
                ],
                "presentation_speech": "File `AI_LOG.md` thể hiện tinh thần liêm chính học thuật và tư duy phản biện của nhóm. Nhóm em ghi lại trung thực toàn bộ quá trình dùng AI, đặc biệt là những lần nhóm phát hiện AI viết code sai bảo mật và chủ động bác bỏ, sửa lại theo chuẩn kỹ thuật phần mềm.",
                "viva_trap": {
                    "question": "Trong quá trình làm đồ án, nhóm em đã bác bỏ đoạn code nào mà AI gợi ý?",
                    "answer": "Dạ thưa Thầy, một trong những lần bác bỏ quan trọng nhất là khi AI gợi ý dùng `AsyncStorage` để lưu token đăng nhập cho nhanh. Nhóm em đã phát hiện ngay đây là lỗ hổng bảo mật nghiêm trọng (Plaintext Token Storage) và bác bỏ hoàn toàn đề xuất đó, thay thế bằng `expo-secure-store` để mã hóa qua Keystore/Keychain của điện thoại."
                }
            },
            {
                "path": "REFLECTION.md & OnePage_Reflection.docx",
                "name": "One-Page Project Reflection",
                "layer": "Documentation / Academic Deliverable",
                "owner": "Cả 2 Thành viên",
                "requirement": "Tiêu chí Đồ án: One-Page Reflection Document",
                "purpose": "Bản đúc kết 1 trang cô đọng: tổng kết thành quả kỹ thuật, sự cố bảo mật do AI đề xuất và bài học kinh nghiệm trong kỹ thuật phần mềm di động.",
                "key_code": [
                    ("Phần 1: Thành tựu kỹ thuật", "Zero-Hex, Touch Target 44pt, Optimistic Update, SecureStore, Jest 10/10."),
                    ("Phần 2: Sự cố AI & Phản biện", "Phát hiện lỗi bảo mật AsyncStorage vs SecureStore."),
                    ("Phần 3: Bài học công nghiệp", "Derived State vs Stored State, Atomic UI Components.")
                ],
                "presentation_speech": "File `OnePage_Reflection.docx` là bản đúc kết ngắn gọn súc tích trong 1 trang giấy A4 theo đúng chuẩn mực của Thầy. Tài liệu tóm tắt toàn bộ giá trị học thuật và kỹ thuật mà nhóm đã gặt hái được sau đồ án này.",
                "viva_trap": {
                    "question": "Bài học lớn nhất mà nhóm em rút ra sau khi hoàn thành đồ án này là gì?",
                    "answer": "Dạ thưa Thầy, bài học lớn nhất là: 'Kỹ thuật phần mềm di động đòi hỏi tư duy kiến trúc ngay từ đầu'. Không thể vừa nghĩ vừa code bừa bãi. Việc xây dựng Design Tokens, quy ước Touch Target 44pt và phân tách rõ ràng giữa Derived State và Stored State đã giúp ứng dụng của nhóm chạy cực kỳ ổn định và không phát sinh lỗi vặt."
                }
            },
            {
                "path": "package.json",
                "name": "Project Manifest & Dependencies Configuration",
                "layer": "Configuration / Build System",
                "owner": "Cả 2 Thành viên",
                "requirement": "Hạ tầng Dự án & Thư viện Chuẩn",
                "purpose": "Quản lý toàn bộ thư viện phụ thuộc, scripts thực thi và thông tin định danh của ứng dụng di động.",
                "key_code": [
                    ("Dependencies", "expo-router, @tanstack/react-query v5, zustand, expo-secure-store, expo-notifications, expo-image-picker."),
                    ("Scripts", "`npm start`, `npm test` (chạy Jest test), `npm run android`, `npm run web`."),
                    ("Postinstall hook", "Chạy script vá tunnel tự động trên Windows.")
                ],
                "presentation_speech": "File `package.json` định nghĩa toàn bộ hệ sinh thái công nghệ của app. Tất cả thư viện được chọn lọc kỹ càng, đồng bộ phiên bản tương thích với Expo SDK mới nhất, giúp app chạy ổn định trên mọi nền tảng.",
                "viva_trap": {
                    "question": "Tại sao nhóm dùng TanStack Query v5 mà lại kết hợp thêm cả Zustand?",
                    "answer": "Dạ thưa Thầy, đây là kiến trúc phân tách trạng thái chuẩn mực (State Separation): TanStack Query chuyên trách quản lý Remote Server State (dữ liệu bất đồng bộ từ API, cache, refetch, optimistic update). Còn Zustand chuyên trách quản lý Client State cục bộ (trạng thái theme sáng/tối, phiên đăng nhập người dùng). Việc tách rời giúp app không bị phình to và code rõ ràng từng tầng."
                }
            },
            {
                "path": "tsconfig.json & jest.config.js",
                "name": "TypeScript & Jest Runner Configurations",
                "layer": "Configuration / Compiler & Test Runner",
                "owner": "Nguyễn Thị Hương Giang (TV2)",
                "requirement": "Tiêu chuẩn Type-Check & Testing Rigor",
                "purpose": "Cấu hình trình biên dịch TypeScript ở mức nghiêm ngặt (`strict: true`) và cấu hình test runner Jest với các module mock.",
                "key_code": [
                    ("tsconfig.json", "Kích hoạt `strict: true`, đảm bảo kiểm tra kiểu chặt chẽ và không cho phép lỗi type ngầm định."),
                    ("jest.config.js", "Cấu hình preset `jest-expo`, ánh xạ module mock cho react-native và AsyncStorage.")
                ],
                "presentation_speech": "Hai file cấu hình `tsconfig.json` và `jest.config.js` đảm bảo chất lượng mã nguồn luôn ở mức cao nhất. TypeScript bắt lỗi ngay khi gõ code, còn Jest đảm bảo mọi hàm logic đều chạy đúng như kỳ vọng.",
                "viva_trap": {
                    "question": "Lệnh npx tsc --noEmit của nhóm em chạy có bị lỗi đỏ nào không?",
                    "answer": "Dạ thưa Thầy, 100% không có một lỗi nào ạ! Dự án đã được kiểm tra kỹ qua lệnh `npx tsc --noEmit` và đạt kết quả 0 lỗi (0 errors), mã nguồn hoàn toàn sạch sẽ."
                }
            },
            {
                "path": "scripts/create_project_zip.py & scripts/generate_reflection_docx.py",
                "name": "Project Automation & Packaging Scripts",
                "layer": "Automation / Build Scripts",
                "owner": "Nguyễn Thị Hương Giang (TV2)",
                "requirement": "Tiêu chuẩn Nộp bài & Tự động hóa",
                "purpose": "Tự động hóa việc tạo file nộp bài ZIP sạch sẽ (loại bỏ node_modules, .git để file nhẹ dưới 1MB) và tự động sinh văn bản báo cáo Word chuẩn mực.",
                "key_code": [
                    ("create_project_zip.py", "Quét toàn bộ dự án, lọc bỏ các thư mục rác, tạo file ZIP chuẩn tên `1923050181_1923051154_StudyPlanner.zip`."),
                    ("generate_reflection_docx.py", "Sử dụng python-docx để tạo bản Word Reflection 1 trang đẹp mắt.")
                ],
                "presentation_speech": "Các script trong thư mục `scripts/` giúp tự động hóa toàn bộ quy trình phát hành và đóng gói sản phẩm. Nhờ đó, file ZIP nộp bài của nhóm có dung lượng cực nhẹ chỉ 0.87 MB nhưng chứa đầy đủ 100% mã nguồn và tài liệu của dự án.",
                "viva_trap": {
                    "question": "File ZIP nộp bài của nhóm em có chứa thư mục node_modules nặng hàng trăm MB không?",
                    "answer": "Dạ thưa Thầy là hoàn toàn KHÔNG ạ! Script `create_project_zip.py` đã tự động lọc bỏ `node_modules`, `.git` và `.expo`. File ZIP chỉ nặng 0.87 MB, sạch sẽ và sẵn sàng để Thầy giải nén rồi `npm install` kiểm tra ngay lập tức."
                }
            }
        ]
    }
]

print(f"Codebase data loaded with {len(SECTIONS)} sections.")
