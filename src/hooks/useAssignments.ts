/**
 * ============================================================================
 * TÊN FILE: src/hooks/useAssignments.ts
 * VAI TRÒ: DATA LAYER (TV2 - GIAO THOA VỚI TV1 QUA CUSTOM HOOK)
 * ============================================================================
 * 
 * 📌 MỤC ĐÍCH FILE:
 * Quản lý dữ liệu Bài tập (Assignments) từ Remote API bằng TanStack Query v5.
 * Tích hợp 2 kỹ thuật nâng cao quan trọng:
 * 1. CẬP NHẬT LẠC QUAN (OPTIMISTIC UPDATES) & TỰ ĐỘNG ROLLBACK: Khi tick hoàn thành bài tập,
 *    giao diện đổi trạng thái ngay lập tức; nếu API lỗi thì tự động rollback về trạng thái cũ.
 * 2. BỘ NHỚ ĐỆM NGOẠI TUYẾN (OFFLINE CACHE): Lưu dữ liệu vào AsyncStorage kèm mốc thời gian.
 * 
 * 🎓 CÂU HỎI VẤN ĐÁP (VIVA) CỦA THẦY NGUYỄN XUÂN VINH:
 * - Câu hỏi: "Cập nhật lạc quan (Optimistic update) trong code của nhóm hoạt động ra sao nếu rớt mạng?"
 * - Trả lời: "Dạ thưa Thầy, trong hàm `useToggleAssignment`, sự kiện `onMutate` sẽ lưu lại bản snapshot
 *   của cache cũ (`previous`), sau đó cập nhật trực tiếp cache TanStack Query để giao diện đổi sang trạng
 *   thái mới ngay lập tức. Nếu API ném ra lỗi hoặc mất mạng, hàm `onError` sẽ gọi lệnh khôi phục lại đúng
 *   bản cache `previous` đó. Cuối cùng hàm `onSettled` sẽ invalidateQueries để đồng bộ lại với server."
 * ============================================================================
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AssignmentItem } from '../types/study';

const API_URL = 'https://66dd46d3f47a05d55be55308.mockapi.io/api/v1/assignments';
const CACHE_KEY = 'cached_assignments_list';
const CACHE_TIMESTAMP_KEY = 'cached_assignments_timestamp';

// Hàm tải danh sách bài tập từ Remote API kèm cơ chế Offline Fallback
async function fetchAssignments(): Promise<AssignmentItem[]> {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Không thể kết nối đến máy chủ');
    const data: AssignmentItem[] = await res.json();

    // Lưu vào AsyncStorage làm offline cache và lưu mốc thời gian
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
    await AsyncStorage.setItem(CACHE_TIMESTAMP_KEY, new Date().toISOString());
    return data;
  } catch (error) {
    // Nếu rớt mạng hoặc lỗi API, đọc dữ liệu từ Offline Cache AsyncStorage
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
    throw error;
  }
}

// Hook lấy danh sách bài tập
export function useAssignments() {
  return useQuery({
    queryKey: ['assignments'],
    queryFn: fetchAssignments,
    staleTime: 60 * 1000, // Dữ liệu được coi là mới trong 60 giây
  });
}

// Hook đổi trạng thái bài tập (pending <-> completed) với OPTIMISTIC UPDATE
export function useToggleAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      newStatus,
    }: {
      id: string;
      newStatus: 'pending' | 'completed';
    }) => {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Cập nhật trạng thái thất bại');
      return res.json();
    },

    // 1. OPTIMISTIC UPDATE: Đổi trạng thái trên UI ngay tức khắc
    onMutate: async ({ id, newStatus }) => {
      // Hủy bỏ các query đang chạy ngầm để tránh ghi đè
      await queryClient.cancelQueries({ queryKey: ['assignments'] });

      // Lưu lại bản snapshot hiện tại để rollback nếu cần
      const previous = queryClient.getQueryData<AssignmentItem[]>(['assignments']);

      // Cập nhật bộ nhớ đệm cache ngay lập tức
      queryClient.setQueryData<AssignmentItem[]>(['assignments'], (old = []) =>
        old.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );

      return { previous };
    },

    // 2. ROLLBACK ON FAILURE: Nếu API báo lỗi hoặc mất mạng, hoàn tác về trạng thái cũ
    onError: (_err, _newVal, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['assignments'], context.previous);
      }
    },

    // 3. ON SETTLED: Luôn làm mới lại cache để đảm bảo nhất quán với server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });
}
