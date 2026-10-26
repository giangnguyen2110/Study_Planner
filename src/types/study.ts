/**
 * ============================================================================
 * TÊN FILE: src/types/study.ts
 * VAI TRÒ: CHUNG (SHARED TYPE DEFINITIONS CHO TV1 VÀ TV2)
 * ============================================================================
 * 
 * 📌 MỤC ĐÍCH FILE:
 * Định nghĩa các kiểu dữ liệu cốt lõi (Core Domain Types) của ứng dụng Study Planner:
 * - `Course`: Môn học do sinh viên đăng ký.
 * - `Assignment`: Bài tập / Nhiệm vụ học tập cần hoàn thành.
 * - `User`: Thông tin người dùng đăng nhập.
 * - `CourseProgress`: Tiến độ môn học được tính toán động (Computed).
 * ============================================================================
 */

// Kiểu dữ liệu Môn học (Course)
export interface Course {
  id: string;        // Định danh duy nhất của môn học
  code: string;      // Mã môn học (ví dụ: 'CS101', 'TH7011101')
  name: string;      // Tên môn học (ví dụ: 'Lập trình Mobile', 'Cấu trúc dữ liệu')
  colour: string;    // Màu nhận diện môn học (ví dụ: '#2563EB')
}

// Kiểu dữ liệu Bài tập (Assignment / Task)
export interface AssignmentItem {
  id: string;                        // ID duy nhất của bài tập
  courseId: string;                  // Khoá ngoại liên kết tới Course.id
  title: string;                     // Tiêu đề / tên bài tập
  dueAt: string;                     // Hạn nộp định dạng chuẩn ISO 8601 (ví dụ: '2026-10-28T23:59:00Z')
  status: 'pending' | 'completed';   // Trạng thái: 'pending' (chưa nộp) hoặc 'completed' (đã hoàn thành)
  notes?: string;                    // Ghi chú thêm của sinh viên
  photoUri?: string;                 // Đường dẫn ảnh đính kèm (chụp bảng, đề bài)
}

// Kiểu dữ liệu Thống kê tiến độ môn học (Computed Course Progress)
export interface CourseProgress {
  courseId: string;    // ID môn học được tính
  total: number;       // Tổng số bài tập của môn
  completed: number;   // Số bài tập đã hoàn thành
  outstanding: number; // Số bài tập còn tồn đọng chưa nộp
  percentage: number;  // Tỉ lệ % hoàn thành (0 -> 100)
}

// Kiểu thông tin người dùng
export interface User {
  id: string;
  name: string;
  email: string;
}
