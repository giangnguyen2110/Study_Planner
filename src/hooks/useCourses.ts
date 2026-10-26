/**
 * ============================================================================
 * TÊN FILE: src/hooks/useCourses.ts
 * VAI TRÒ: DATA LAYER (TV2 - GIAO THOA VỚI TV1 QUA CUSTOM HOOK)
 * ============================================================================
 * 
 * 📌 MỤC ĐÍCH FILE:
 * Tải danh sách Môn học (Courses) của sinh viên từ Remote API / MockAPI.
 * Cung cấp thông tin tên môn, mã môn, và màu sắc nhận diện (`colour`) để
 * TV1 render vạch màu trên AssignmentCard và WeeklyCalendar.
 * ============================================================================
 */

import { useQuery } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Course } from '../types/study';

const COURSES_API_URL = 'https://66dd46d3f47a05d55be55308.mockapi.io/api/v1/courses';
const COURSES_CACHE_KEY = 'cached_courses_list';

// Dữ liệu dự phòng chuẩn nếu chưa kết nối được Remote API
const DEFAULT_COURSES: Course[] = [
  { id: '1', code: 'TH7011101', name: 'Lập trình Mobile', colour: '#2563EB' },
  { id: '2', code: 'CS102', name: 'Cơ sở dữ liệu', colour: '#16A34A' },
  { id: '3', code: 'CS103', name: 'Mạng máy tính', colour: '#D97706' },
  { id: '4', code: 'CS104', name: 'Cấu trúc dữ liệu & Giải thuật', colour: '#8B5CF6' },
  { id: '5', code: 'CS105', name: 'Trí tuệ nhân tạo', colour: '#EC4899' },
];

async function fetchCourses(): Promise<Course[]> {
  try {
    const res = await fetch(COURSES_API_URL);
    if (!res.ok) throw new Error('Không thể tải danh sách môn học');
    const data: Course[] = await res.json();
    await AsyncStorage.setItem(COURSES_CACHE_KEY, JSON.stringify(data));
    return data;
  } catch {
    const cached = await AsyncStorage.getItem(COURSES_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
    return DEFAULT_COURSES;
  }
}

export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
    staleTime: 5 * 60 * 1000, // 5 phút
  });
}
