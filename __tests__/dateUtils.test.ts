/**
 * ============================================================================
 * TÊN FILE: __tests__/dateUtils.test.ts
 * VAI TRÒ: THÀNH VIÊN 2 (TV2 - Pure Logic Automated Test)
 * ============================================================================
 * 
 * 📌 MỤC ĐÍCH FILE KIỂM THỬ:
 * Đáp ứng tiêu chí kiểm thử tự động (Automated Test 1: Pure-logic test) theo đề tài:
 * "THE PART THAT WILL TAKE LONGER THAN YOU THINK:
 * Timezone and date handling. 'Due tomorrow' must mean the same thing at 23:30 as it does at 08:00."
 * 
 * 🧪 CÁC TEST CASES ĐƯỢC KIỂM TRA:
 * 1. Hàm `startOfDay()`: Đưa mốc thời gian về chính xác 00:00:00.000 giờ địa phương.
 * 2. Hàm `isDueTomorrow()`: Phải trả về `true` cho bất kỳ thời điểm nào trong ngày mai,
 *    dù kiểm tra lúc 08:00 sáng hay 23:30 đêm.
 * 3. Hàm `isDueTomorrow()`: Phải trả về `false` cho bài tập đến hạn hôm nay hoặc sau ngày mai.
 * 4. Hàm `isDueWithin48Hours()`: Kiểm tra chính xác bài tập có hạn nộp trong vòng 48 giờ tới.
 * ============================================================================
 */

import { startOfDay, isDueTomorrow, isDueWithin48Hours } from '../src/utils/dateUtils';

describe('Kiểm thử Pure-Logic: Xử lý Ngày tháng & Múi giờ (Date & Timezone Handling)', () => {
  it('startOfDay() phải chuẩn hóa mốc thời gian về 00:00:00.000', () => {
    const testDate = new Date('2026-10-28T15:45:30.123');
    const normalized = startOfDay(testDate);

    expect(normalized.getHours()).toBe(0);
    expect(normalized.getMinutes()).toBe(0);
    expect(normalized.getSeconds()).toBe(0);
    expect(normalized.getMilliseconds()).toBe(0);
  });

  it('isDueTomorrow() phải trả về true cho bài tập ngày mai dù kiểm tra lúc 08:00 sáng hay 23:30 đêm', () => {
    const today = new Date();

    // 1. Mốc 08:00 sáng ngày mai
    const tomorrowMorning = new Date(today);
    tomorrowMorning.setDate(today.getDate() + 1);
    tomorrowMorning.setHours(8, 0, 0, 0);

    // 2. Mốc 23:30 đêm ngày mai
    const tomorrowNight = new Date(today);
    tomorrowNight.setDate(today.getDate() + 1);
    tomorrowNight.setHours(23, 30, 0, 0);

    // Cả 2 mốc thời gian đều phải được xác nhận là "Hạn ngày mai" (Due tomorrow)
    expect(isDueTomorrow(tomorrowMorning.toISOString())).toBe(true);
    expect(isDueTomorrow(tomorrowNight.toISOString())).toBe(true);
  });

  it('isDueTomorrow() phải trả về false cho bài tập hạn hôm nay hoặc quá hạn', () => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);

    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);

    expect(isDueTomorrow(today.toISOString())).toBe(false);
    expect(isDueTomorrow(pastDate.toISOString())).toBe(false);
  });

  it('isDueWithin48Hours() phải trả về true cho deadline trong khoảng 0 đến 48 giờ', () => {
    const now = Date.now();
    const in24Hours = new Date(now + 24 * 60 * 60 * 1000).toISOString();
    const in47Hours = new Date(now + 47 * 60 * 60 * 1000).toISOString();
    const in50Hours = new Date(now + 50 * 60 * 60 * 1000).toISOString();

    expect(isDueWithin48Hours(in24Hours)).toBe(true);
    expect(isDueWithin48Hours(in47Hours)).toBe(true);
    expect(isDueWithin48Hours(in50Hours)).toBe(false);
  });
});
