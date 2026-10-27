/**
 * ============================================================================
 * TÊN FILE: __tests__/statsUtils.test.ts
 * VAI TRÒ: THÀNH VIÊN 2 (TV2 - Critical Path Automated Test)
 * ============================================================================
 * 
 * 📌 MỤC ĐÍCH FILE KIỂM THỬ:
 * Đáp ứng tiêu chí kiểm thử tự động (Automated Test 3: Critical path test) theo đề tài:
 * "Progress statistics: completed versus outstanding per course, computed, never stored."
 * 
 * 🧪 CÁC TEST CASES ĐƯỢC KIỂM TRA:
 * 1. Tính toán chuẩn xác số bài đã nộp (completed), số bài tồn đọng (outstanding),
 *    tổng số bài (total) và tỷ lệ % hoàn thành (percentage).
 * 2. Xử lý trường hợp an toàn: Môn học chưa có bài tập nào (total = 0) -> percentage = 0 (tránh lỗi chia cho 0).
 * 3. Xử lý trường hợp hoàn thành 100% (completed == total).
 * 4. Xử lý trường hợp có nhiều môn học khác nhau trong danh sách mà chỉ lọc đúng môn được yêu cầu.
 * ============================================================================
 */

import { computeCourseProgress, CourseProgress } from '../src/utils/statsUtils';
import { AssignmentItem } from '../src/types/study';

describe('Kiểm thử Critical-Path: Tính toán tiến độ môn học động (Computed Progress Statistics)', () => {
  const mockAssignments: AssignmentItem[] = [
    {
      id: '1',
      courseId: 'CS101',
      title: 'Bài tập 1 môn CS101',
      dueAt: new Date().toISOString(),
      status: 'completed',
    },
    {
      id: '2',
      courseId: 'CS101',
      title: 'Bài tập 2 môn CS101',
      dueAt: new Date().toISOString(),
      status: 'pending',
    },
    {
      id: '3',
      courseId: 'CS101',
      title: 'Bài tập 3 môn CS101',
      dueAt: new Date().toISOString(),
      status: 'pending',
    },
    {
      id: '4',
      courseId: 'CS101',
      title: 'Bài tập 4 môn CS101',
      dueAt: new Date().toISOString(),
      status: 'completed',
    },
    // Môn học khác (CS102)
    {
      id: '5',
      courseId: 'CS102',
      title: 'Bài tập 1 môn CS102',
      dueAt: new Date().toISOString(),
      status: 'completed',
    },
  ];

  it('phải tính toán chính xác số bài hoàn thành, tồn đọng và tỷ lệ % cho môn CS101', () => {
    const stats: CourseProgress = computeCourseProgress('CS101', mockAssignments);

    expect(stats.courseId).toBe('CS101');
    expect(stats.total).toBe(4); // 4 bài thuộc CS101
    expect(stats.completed).toBe(2); // 2 bài completed
    expect(stats.outstanding).toBe(2); // 2 bài pending
    expect(stats.percentage).toBe(50); // 2/4 = 50%
  });

  it('phải trả về percentage = 0 và không bị lỗi chia cho 0 khi môn học chưa có bài tập nào', () => {
    const emptyStats = computeCourseProgress('EMPTY_COURSE', mockAssignments);

    expect(emptyStats.total).toBe(0);
    expect(emptyStats.completed).toBe(0);
    expect(emptyStats.outstanding).toBe(0);
    expect(emptyStats.percentage).toBe(0);
    expect(isNaN(emptyStats.percentage)).toBe(false);
  });

  it('phải trả về percentage = 100% khi tất cả bài tập của môn đều đã hoàn thành', () => {
    const allCompletedStats = computeCourseProgress('CS102', mockAssignments);

    expect(allCompletedStats.total).toBe(1);
    expect(allCompletedStats.completed).toBe(1);
    expect(allCompletedStats.outstanding).toBe(0);
    expect(allCompletedStats.percentage).toBe(100);
  });
});
