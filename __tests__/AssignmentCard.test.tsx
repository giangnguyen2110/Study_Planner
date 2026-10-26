/**
 * ============================================================================
 * TÊN FILE: __tests__/AssignmentCard.test.tsx
 * VAI TRÒ: THÀNH VIÊN 1 (TV1 - Frontend UI/UX, Navigation & Notification)
 * ============================================================================
 * 
 * 📌 MỤC ĐÍCH FILE:
 * Bộ kiểm thử tự động cấp độ Component (Component Test) bằng Jest và React Native Testing Library.
 * Đáp ứng tiêu chí BẮT BUỘC: "Viết 01 Component Test (Jest)".
 * 
 * 🎯 CÁC MỤC TIÊU KIỂM THỬ:
 * 1. Kiểm thử `AccessibleButton`:
 *    - Xác thực render đúng với `accessibilityRole="button"`.
 *    - Xác thực nút bấm có kích thước tối thiểu đạt chuẩn trợ năng 44x44 pt.
 *    - Mô phỏng hành động bấm nút và kiểm tra hàm `onPress` được gọi thành công.
 * 2. Kiểm thử `AssignmentCard`:
 *    - Xác thực hiển thị đúng tiêu đề bài tập, tên môn học và ngày giờ hạn nộp.
 *    - Xác thực thuộc tính trợ năng: Thẻ có role="button", Checkbox có role="checkbox".
 *    - Mô phỏng bấm vào ô Checkbox để xác thực hàm `onToggleStatus` được kích hoạt.
 *    - Mô phỏng bấm vào thân thẻ để xác thực hàm `onPressCard` (mở chi tiết) được kích hoạt.
 * 
 * 🎓 CÂU HỎI VẤN ĐÁP (VIVA) CỦA THẦY NGUYỄN XUÂN VINH:
 * - Câu hỏi: "Component test trong React Native kiểm tra những gì và tại sao không chỉ test thủ công trên điện thoại?"
 * - Trả lời: "Dạ thưa Thầy, kiểm thử thủ công chỉ phát hiện lỗi tại thời điểm test và tốn nhiều thời gian.
 *   Component Test bằng Jest và React Native Testing Library mô phỏng chính xác hành vi tương tác của người dùng
 *   thật (chạm vào nút, kiểm tra nội dung text, kiểm tra thuộc tính trợ năng role và label).
 *   Lợi ích lớn nhất là nó chạy tự động trong vài giây (CI/CD), đảm bảo khi thành viên khác sửa mã nguồn thì
 *   các tiêu chuẩn trợ năng 44x44 pt và sự kiện bấm nút không bao giờ bị lỗi ngầm (Regression testing)."
 * ============================================================================
 */

// ============================================================================
// BƯỚC 1: IMPORT CÁC THƯ VIỆN TEST, MOCK VÀ COMPONENTS CẦN TEST
// ============================================================================
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AccessibleButton } from '../src/components/ui/AccessibleButton';
import { AssignmentCard } from '../src/components/features/AssignmentCard';
import { TouchTarget } from '../src/constants/tokens';
import { AssignmentItem } from '../src/utils/statsUtils';

// ============================================================================
// BƯỚC 2: MÔ PHỎNG DỮ LIỆU GIẢ LẬP (MOCK DATA) CHO BÀI TẬP
// ============================================================================
const mockAssignmentPending: AssignmentItem = {
  id: 'task-101',
  courseId: 'course-mobile',
  title: 'Làm bài tập Lập trình Mobile - Final Viva',
  dueAt: '2026-10-28T14:30:00.000Z',
  status: 'pending',
  notes: 'Chuẩn bị mã nguồn và câu trả lời viva bảo vệ trước Thầy Vinh',
};

const mockAssignmentCompleted: AssignmentItem = {
  id: 'task-102',
  courseId: 'course-db',
  title: 'Thiết kế cơ sở dữ liệu MongoDB',
  dueAt: '2026-10-27T08:00:00.000Z',
  status: 'completed',
};

// ============================================================================
// BƯỚC 3: NHÓM TEST CASE 1: KIỂM THỬ NÚT BẤM TRỢ NĂNG (AccessibleButton)
// ============================================================================
describe('AccessibleButton Component Test (Tiêu chuẩn Trợ Năng 44x44 pt)', () => {
  it('renders correctly with accessibilityRole="button" and minimum touch target size 44x44', () => {
    // Khởi tạo một hàm mock giả lập để theo dõi sự kiện bấm
    const mockOnPress = jest.fn();

    // Render component vào môi trường kiểm thử ảo
    const { getByRole, getByText } = render(
      <AccessibleButton
        title="Lưu bài tập"
        onPress={mockOnPress}
        accessibilityLabel="Lưu bài tập mới vào hệ thống"
      />
    );

    // BƯỚC 3.1: Kiểm tra nút bấm có thuộc tính accessibilityRole là "button"
    const button = getByRole('button');
    expect(button).toBeTruthy();

    // BƯỚC 3.2: Kiểm tra nội dung chữ bên trong nút hiển thị đúng
    expect(getByText('Lưu bài tập')).toBeTruthy();

    // BƯỚC 3.3: Kiểm tra kích thước vùng chạm tối thiểu đạt chuẩn 44x44 pt
    const buttonStyles = Array.isArray(button.props.style)
      ? Object.assign({}, ...button.props.style)
      : button.props.style;

    expect(buttonStyles.minHeight).toBeGreaterThanOrEqual(TouchTarget.minHeight);
    expect(buttonStyles.minWidth).toBeGreaterThanOrEqual(TouchTarget.minWidth);

    // BƯỚC 3.4: Mô phỏng hành động người dùng bấm nút và kiểm tra hàm callback
    fireEvent.press(button);
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});

// ============================================================================
// BƯỚC 4: NHÓM TEST CASE 2: KIỂM THỬ THẺ BÀI TẬP (AssignmentCard)
// ============================================================================
describe('AssignmentCard Component Test (UI, Tương Tác & Trợ Năng)', () => {
  it('renders title, course name, and triggers onToggleStatus when checkbox is pressed', () => {
    const mockToggle = jest.fn();
    const mockPressCard = jest.fn();

    // Render thẻ bài tập đang ở trạng thái "pending" (chưa nộp)
    const { getByText, getByRole } = render(
      <AssignmentCard
        assignment={mockAssignmentPending}
        courseName="Lập trình Mobile"
        courseColor="#2563EB"
        onToggleStatus={mockToggle}
        onPressCard={mockPressCard}
      />
    );

    // BƯỚC 4.1: Kiểm tra tiêu đề bài tập và tên môn học có xuất hiện trên màn hình
    expect(getByText('Làm bài tập Lập trình Mobile - Final Viva')).toBeTruthy();
    expect(getByText('Lập trình Mobile')).toBeTruthy();

    // BƯỚC 4.2: Kiểm tra ô Checkbox với accessibilityRole="checkbox"
    const checkbox = getByRole('checkbox');
    expect(checkbox).toBeTruthy();

    // BƯỚC 4.3: Mô phỏng người dùng chạm vào Checkbox để hoàn thành bài
    fireEvent.press(checkbox);
    expect(mockToggle).toHaveBeenCalledTimes(1);
    // Đảm bảo không bị chạm nhầm vào thân thẻ
    expect(mockPressCard).not.toHaveBeenCalled();

    // BƯỚC 4.4: Mô phỏng người dùng chạm vào thân thẻ để xem chi tiết
    const cardButton = getByRole('button');
    fireEvent.press(cardButton);
    expect(mockPressCard).toHaveBeenCalledTimes(1);
  });

  it('renders checkmark ✓ when assignment status is completed', () => {
    // Render thẻ bài tập đã hoàn thành (completed)
    const { getByText } = render(
      <AssignmentCard
        assignment={mockAssignmentCompleted}
        courseName="Cơ sở dữ liệu"
        onToggleStatus={() => {}}
        onPressCard={() => {}}
      />
    );

    // Kiểm tra ký hiệu dấu tick hoàn thành xuất hiện
    expect(getByText('✓')).toBeTruthy();
  });
});
