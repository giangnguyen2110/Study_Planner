/**
 * ============================================================================
 * TÊN FILE: src/utils/statsUtils.ts
 * VAI TRÒ: DATA / UTILITY LAYER (TÍNH TOÁN TIẾN ĐỘ COMPUTED)
 * ============================================================================
 * 
 * 📌 MỤC ĐÍCH FILE:
 * Cung cấp hàm tính toán thống kê tiến độ môn học động (`computeCourseProgress`).
 * 
 * ⚠️ QUY TẮC BẮT BUỘC (LUẬT COMPUTED DATA):
 * "Thống kê tiến độ môn học (Course progress) phải là giá trị tính toán động (computed),
 * TUYỆT ĐỐI KHÔNG lưu cứng trong Database/API."
 * 
 * 🎓 CÂU HỎI VẤN ĐÁP (VIVA) CỦA THẦY NGUYỄN XUÂN VINH:
 * - Câu hỏi: "Hàm tính tiến độ môn học được gọi ở đâu và tại sao không lưu trường percentage vào Database?"
 * - Trả lời: "Dạ thưa Thầy, tiến độ hoàn thành là một giá trị dẫn xuất (derived state). Nếu lưu cứng
 *   trường percentage trong Database, mỗi khi sinh viên thêm bài tập mới, sửa hạn nộp, xóa bài hoặc tick
 *   đổi trạng thái hoàn thành, ta sẽ phải đồng bộ lại trường percentage này ở nhiều nơi, rất dễ gây ra
 *   lệch dữ liệu (data inconsistency). Vì vậy, nhóm tuân thủ triết lý 'Single Source of Truth': Chỉ lưu
 *   danh sách bài tập với status ('pending'/'completed'), còn tiến độ sẽ được hàm computeCourseProgress()
 *   tính toán trực tiếp (computed) tại thời điểm render."
 * ============================================================================
 */

// Import kiểu dữ liệu từ types
import { AssignmentItem, CourseProgress } from '../types/study';
export type { AssignmentItem, CourseProgress };

/**
 * Hàm `computeCourseProgress`:
 * @param courseId ID của môn học cần tính tiến độ
 * @param assignments Danh sách toàn bộ bài tập hiện có
 * @returns {CourseProgress} Object chứa total, completed, outstanding, và percentage
 */
export function computeCourseProgress(
  courseId: string,
  assignments: AssignmentItem[]
): CourseProgress {
  // Lọc ra các bài tập thuộc về môn học này
  const courseTasks = assignments.filter((a) => a.courseId === courseId);
  
  // Tổng số bài tập
  const total = courseTasks.length;
  
  // Số bài tập đã đánh dấu hoàn thành
  const completed = courseTasks.filter((a) => a.status === 'completed').length;
  
  // Số bài tập còn tồn đọng
  const outstanding = total - completed;
  
  // Tỉ lệ phần trăm hoàn thành làm tròn (tránh chia cho 0)
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { courseId, total, completed, outstanding, percentage };
}
