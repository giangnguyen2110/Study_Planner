/**
 * ============================================================================
 * TÊN FILE: src/utils/dateUtils.ts
 * VAI TRÒ: DATA / UTILITY LAYER (XỬ LÝ NGÀY GIỜ & MÚI GIỜ)
 * ============================================================================
 * 
 * 📌 MỤC ĐÍCH FILE:
 * Cung cấp các hàm xử lý tính toán ngày giờ, hạn nộp bài tập chính xác theo múi giờ
 * địa phương của thiết bị, giải quyết trọn vẹn yêu cầu kỹ thuật:
 * "The part that will take longer than you think: Timezone & Date handling".
 * 
 * ⚠️ QUY TẮC BẮT BUỘC (LUẬT DATE & TIMEZONE):
 * Tính toán deadline (ví dụ: 'Due tomorrow', 'Due in 48 hours') phải xử lý theo
 * ngày địa phương (`startOfDay`), đảm bảo dù sinh viên mở app kiểm tra vào lúc
 * 23:30 đêm hay 08:00 sáng thì kết quả logic "hạn ngày mai" vẫn đồng nhất 100%.
 * 
 * 🎓 CÂU HỎI VẤN ĐÁP (VIVA) CỦA THẦY NGUYỄN XUÂN VINH:
 * - Câu hỏi: "Tại sao hàm `isDueTomorrow()` lại cần dùng hàm `startOfDay()` thay vì lấy Date.now() + 24h?"
 * - Trả lời: "Dạ thưa Thầy, nếu chỉ cộng 24 giờ thuần túy, một bài tập nộp vào lúc 09:00 sáng ngày mai
 *   nhưng khi sinh viên mở app lúc 23:30 tối nay thì khoảng cách chỉ là 9.5 giờ (chưa đủ 24 giờ), hoặc
 *   ngược lại. Bằng cách dùng `startOfDay()`, ta đưa cả ngày hôm nay và ngày đến hạn về mốc 00:00:00
 *   theo giờ địa phương của thiết bị, sau đó chỉ cần so sánh ngày theo lịch (Calendar Date). Nhờ đó,
 *   bất kể mở app lúc 08:00 sáng hay 23:30 đêm, kết quả 'Hạn nộp ngày mai' luôn tuyệt đối chính xác."
 * ============================================================================
 */

/**
 * Hàm `startOfDay`:
 * Chuyển một đối tượng Date về mốc thời gian 00:00:00.000 của chính ngày đó
 * theo múi giờ địa phương (Local Timezone).
 */
export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Hàm `isDueTomorrow`:
 * Kiểm tra xem một mốc thời gian ISO có rơi vào ngày mai hay không.
 * @param dueAtIso Chuỗi ngày giờ ISO 8601 (ví dụ: '2026-10-27T14:00:00Z')
 * @returns boolean true nếu hạn nộp rơi vào ngày mai
 */
export function isDueTomorrow(dueAtIso: string): boolean {
  const dueDate = startOfDay(new Date(dueAtIso));
  const today = startOfDay(new Date());

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  return dueDate.getTime() === tomorrow.getTime();
}

/**
 * Hàm `isDueWithin48Hours`:
 * Kiểm tra xem bài tập có hạn nộp trong vòng 48 giờ tới tính từ thời điểm hiện tại hay không.
 * Điều kiện: Hạn nộp chưa trôi qua (diffHours >= 0) và cách hiện tại không quá 48 giờ.
 * @param dueAtIso Chuỗi ngày giờ ISO
 * @returns boolean
 */
export function isDueWithin48Hours(dueAtIso: string): boolean {
  const now = new Date().getTime();
  const dueDate = new Date(dueAtIso).getTime();
  const diffHours = (dueDate - now) / (1000 * 60 * 60);
  return diffHours >= 0 && diffHours <= 48;
}

/**
 * Hàm `formatDateDisplay`:
 * Định dạng ngày giờ thân thiện cho người dùng Việt Nam (dd/mm/yyyy).
 */
export function formatDateDisplay(dateIso: string): string {
  const d = new Date(dateIso);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}
