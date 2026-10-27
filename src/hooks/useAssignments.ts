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
 * 3. TỰ ĐỘNG GIÁM SÁT KẾT NỐI MẠNG (OFFLINE MONITOR): Tự động phát hiện khi thiết bị mất Wi-Fi/mạng
 *    để kích hoạt OfflineBanner màu hổ phách theo đúng Yêu cầu bắt buộc số 6 của Thầy Nguyễn Xuân Vinh.
 * 
 * 🎓 CÂU HỎI VẤN ĐÁP (VIVA) CỦA THẦY NGUYỄN XUÂN VINH:
 * - Câu hỏi: "Cập nhật lạc quan (Optimistic update) trong code của nhóm hoạt động ra sao nếu rớt mạng?"
 * - Trả lời: "Dạ thưa Thầy, trong hàm `useToggleAssignment`, sự kiện `onMutate` sẽ lưu lại bản snapshot
 *   của cache cũ (`previous`), sau đó cập nhật trực tiếp cache TanStack Query để giao diện đổi sang trạng
 *   thái mới ngay lập tức. Nếu API ném ra lỗi hoặc mất mạng, hàm `onError` sẽ gọi lệnh khôi phục lại đúng
 *   bản cache `previous` đó. Cuối cùng hàm `onSettled` sẽ invalidateQueries để đồng bộ lại với server."
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { AssignmentItem } from '../types/study';

const API_URL = 'https://66dd46d3f47a05d55be55308.mockapi.io/api/v1/assignments';
const CACHE_KEY = 'cached_assignments_list';
const CACHE_TIMESTAMP_KEY = 'cached_assignments_timestamp';

/**
 * Trạng thái kết nối mạng ngoại tuyến (Network & Offline State Store)
 * Quản lý trạng thái Online/Offline đồng bộ toàn ứng dụng và hỗ trợ chế độ giả lập offline để quay video demo.
 */
interface NetworkState {
  isOffline: boolean;
  cachedTime: string | null;
  simulatedOffline: boolean;
  setIsOffline: (isOffline: boolean) => void;
  setCachedTime: (cachedTime: string | null) => void;
  setSimulatedOffline: (simulatedOffline: boolean) => void;
}

export const useNetworkStore = create<NetworkState>((set) => ({
  isOffline: false,
  cachedTime: null,
  simulatedOffline: false,
  setIsOffline: (isOffline) => set({ isOffline }),
  setCachedTime: (cachedTime) => set({ cachedTime }),
  setSimulatedOffline: (simulatedOffline) => set({ simulatedOffline }),
}));

/**
 * Hook trả về trạng thái ngoại tuyến (Offline)
 */
export function useIsOffline(): boolean {
  return useNetworkStore((state) => state.isOffline || state.simulatedOffline);
}

/**
 * Hook hỗ trợ bật/tắt chế độ giả lập Offline khi quay video demo đồ án
 */
export function useSimulatedOffline() {
  const simulatedOffline = useNetworkStore((state) => state.simulatedOffline);
  const setSimulatedOffline = useNetworkStore((state) => state.setSimulatedOffline);
  const queryClient = useQueryClient();

  const toggleSimulatedOffline = () => {
    const nextVal = !simulatedOffline;
    setSimulatedOffline(nextVal);
    queryClient.invalidateQueries({ queryKey: ['assignments'] });
  };

  return { simulatedOffline, toggleSimulatedOffline };
}

/**
 * Hook giám sát kết nối mạng chủ động (Active Network Monitor)
 * 1. Tự động kiểm tra mạng khi mở app (AppState active)
 * 2. Lắng nghe trạng thái Online/Offline trên Web
 * 3. Kiểm tra định kỳ để kích hoạt OfflineBanner ngay khi tắt Wi-Fi
 */
export function useNetworkMonitor() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // 1. Tải mốc thời gian lưu trữ từ AsyncStorage
    AsyncStorage.getItem(CACHE_TIMESTAMP_KEY).then((time) => {
      if (time) useNetworkStore.getState().setCachedTime(time);
    });

    // 2. Hàm kiểm tra mạng chủ động (Active Ping)
    const checkNetwork = async () => {
      if (useNetworkStore.getState().simulatedOffline) return;
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3500);
        const res = await fetch(API_URL, { method: 'GET', signal: controller.signal });
        clearTimeout(timeout);
        if (res.ok) {
          if (useNetworkStore.getState().isOffline) {
            useNetworkStore.getState().setIsOffline(false);
            queryClient.invalidateQueries({ queryKey: ['assignments'] });
          }
        } else {
          useNetworkStore.getState().setIsOffline(true);
        }
      } catch {
        useNetworkStore.getState().setIsOffline(true);
      }
    };

    // Kiểm tra ngay khi mount
    checkNetwork();

    // 3. Lắng nghe thay đổi AppState (khi ứng dụng chuyển sang foreground)
    const appStateSub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        checkNetwork();
      }
    });

    // 4. Lắng nghe sự kiện Online/Offline trên Web
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const handleOnline = () => {
        useNetworkStore.getState().setIsOffline(false);
        queryClient.invalidateQueries({ queryKey: ['assignments'] });
      };
      const handleOffline = () => {
        useNetworkStore.getState().setIsOffline(true);
      };
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        useNetworkStore.getState().setIsOffline(true);
      }

      return () => {
        appStateSub.remove();
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }

    // 5. Kiểm tra định kỳ mỗi 8 giây trên Mobile
    const interval = setInterval(checkNetwork, 8000);

    return () => {
      appStateSub.remove();
      clearInterval(interval);
    };
  }, [queryClient]);
}

/**
 * Danh sách bài tập mẫu ban đầu (Initial Seed Data)
 * Đảm bảo ứng dụng chạy mượt mà ngay cả khi không có kết nối Remote API hoặc mạng rớt.
 * Các mốc thời gian được tạo động theo thời gian thực (ngày mai, 48h, tuần này).
 */
export function getDefaultAssignments(): AssignmentItem[] {
  const now = new Date();

  // Bài 1: Hạn nộp ngày mai (trong 24h - 48h)
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(17, 0, 0, 0);

  // Bài 2: Hạn nộp trong 48h (ngày kia)
  const inTwoDays = new Date(now);
  inTwoDays.setDate(now.getDate() + 2);
  inTwoDays.setHours(10, 0, 0, 0);

  // Bài 3: Hạn nộp trong 3 ngày tới
  const inThreeDays = new Date(now);
  inThreeDays.setDate(now.getDate() + 3);
  inThreeDays.setHours(23, 59, 0, 0);

  // Bài 4: Hạn nộp trong 5 ngày tới
  const inFiveDays = new Date(now);
  inFiveDays.setDate(now.getDate() + 5);
  inFiveDays.setHours(23, 59, 0, 0);

  // Bài 5: Đã hoàn thành từ hôm qua
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  yesterday.setHours(18, 0, 0, 0);

  // Bài 6: Bài tập tuần tới
  const inSevenDays = new Date(now);
  inSevenDays.setDate(now.getDate() + 7);
  inSevenDays.setHours(20, 0, 0, 0);

  return [
    {
      id: '1',
      courseId: '1', // Lập trình Mobile (TH7011101)
      title: 'Hoàn thiện Báo cáo Đồ án Mobile & Slide thuyết trình Viva',
      notes: 'Soạn slide báo cáo đồ án Study Planner và chuẩn bị kịch bản trả lời vấn đáp với Thầy Nguyễn Xuân Vinh.',
      dueAt: tomorrow.toISOString(),
      status: 'pending',
    },
    {
      id: '2',
      courseId: '1', // Lập trình Mobile (TH7011101)
      title: 'Thực hành demo ứng dụng & Kiểm thử Zero-Hex trên máy thật',
      notes: 'Kiểm tra độ nảy của nút bấm 44x44, chuyển đổi dark/light mode và chức năng xem tuần.',
      dueAt: inTwoDays.toISOString(),
      status: 'pending',
    },
    {
      id: '3',
      courseId: '2', // Cơ sở dữ liệu (CS102)
      title: 'Thiết kế sơ đồ ERD & Chuẩn hóa dữ liệu 3NF',
      notes: 'Bài tập nhóm tuần 8: chuẩn hóa cơ sở dữ liệu quan hệ quản lý thư viện sinh viên.',
      dueAt: inThreeDays.toISOString(),
      status: 'pending',
    },
    {
      id: '4',
      courseId: '3', // Mạng máy tính (CS103)
      title: 'Cấu hình định tuyến OSPF đa vùng trên Packet Tracer',
      notes: 'Nộp file .pkt kèm báo cáo phân tích bảng định tuyến Router.',
      dueAt: inFiveDays.toISOString(),
      status: 'pending',
    },
    {
      id: '5',
      courseId: '4', // Cấu trúc dữ liệu & Giải thuật (CS104)
      title: 'Cài đặt thuật toán Dijkstra tìm đường đi ngắn nhất',
      notes: 'Viết bằng TypeScript/C++, tối ưu độ phức tạp bằng Binary Heap O(E log V).',
      dueAt: yesterday.toISOString(),
      status: 'completed',
    },
    {
      id: '6',
      courseId: '5', // Trí tuệ nhân tạo (CS105)
      title: 'Báo cáo huấn luyện mô hình phân loại ảnh với PyTorch CNN',
      notes: 'Train trên tập dữ liệu CIFAR-10 đạt độ chính xác > 85%.',
      dueAt: inSevenDays.toISOString(),
      status: 'pending',
    },
  ];
}

// Hàm tải danh sách bài tập từ Remote API kèm cơ chế Offline Fallback
async function fetchAssignments(): Promise<AssignmentItem[]> {
  const isSimulated = useNetworkStore.getState().simulatedOffline;
  if (isSimulated) {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    const timestamp = (await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY)) || new Date().toISOString();
    useNetworkStore.getState().setIsOffline(true);
    useNetworkStore.getState().setCachedTime(timestamp);
    return cached ? JSON.parse(cached) : getDefaultAssignments();
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(API_URL, { signal: controller.signal });
    clearTimeout(timer);

    if (!res.ok) throw new Error('Không thể kết nối đến máy chủ');
    const data: AssignmentItem[] = await res.json();
    if (!Array.isArray(data)) throw new Error('Dữ liệu máy chủ không hợp lệ');

    // Lưu vào AsyncStorage làm offline cache và lưu mốc thời gian
    const now = new Date().toISOString();
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
    await AsyncStorage.setItem(CACHE_TIMESTAMP_KEY, now);
    useNetworkStore.getState().setIsOffline(false);
    useNetworkStore.getState().setCachedTime(now);
    return data;
  } catch {
    // Nếu rớt mạng hoặc lỗi API, đọc dữ liệu từ Offline Cache AsyncStorage
    const now = new Date().toISOString();
    const cachedTime = (await AsyncStorage.getItem(CACHE_TIMESTAMP_KEY)) || now;
    useNetworkStore.getState().setIsOffline(true);
    useNetworkStore.getState().setCachedTime(cachedTime);

    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
    // Khởi tạo dữ liệu ban đầu nếu lần đầu mở ứng dụng chưa có cache
    const defaults = getDefaultAssignments();
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(defaults));
    await AsyncStorage.setItem(CACHE_TIMESTAMP_KEY, now);
    return defaults;
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
      try {
        const res = await fetch(`${API_URL}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        });
        if (res.ok) {
          return await res.json();
        }
      } catch {
        useNetworkStore.getState().setIsOffline(true);
        // Fallback ghi vào offline cache nếu không có kết nối mạng
      }

      // Cập nhật Offline Storage
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const list: AssignmentItem[] = JSON.parse(cached);
        const updated = list.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        );
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(updated));
      }
      return { id, status: newStatus };
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

    // 2. ROLLBACK ON FAILURE: Nếu có lỗi không mong muốn, hoàn tác về trạng thái cũ
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

// Hook tạo bài tập mới
export function useCreateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newAssignment: Omit<AssignmentItem, 'id'>) => {
      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAssignment),
        });
        if (res.ok) {
          return await res.json();
        }
      } catch {
        useNetworkStore.getState().setIsOffline(true);
        // Bỏ qua lỗi mạng
      }

      // Tạo id tạm thời và ghi vào cache
      const createdItem: AssignmentItem = {
        ...newAssignment,
        id: String(Date.now()),
      };

      const cached = await AsyncStorage.getItem(CACHE_KEY);
      const list: AssignmentItem[] = cached ? JSON.parse(cached) : getDefaultAssignments();
      const updated = [createdItem, ...list];
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(updated));

      return createdItem;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
    },
  });
}

/**
 * Hook lấy mốc thời gian lưu trữ ngoại tuyến gần nhất từ AsyncStorage
 * Phục vụ hiển thị OfflineBanner khi chạy chế độ offline: "showing saved data from <time>"
 */
export function useOfflineCacheTime(): string | null {
  const storeCachedTime = useNetworkStore((state) => state.cachedTime);
  const [cachedTime, setCachedTime] = useState<string | null>(storeCachedTime);

  useEffect(() => {
    if (storeCachedTime) {
      setCachedTime(storeCachedTime);
    } else {
      AsyncStorage.getItem(CACHE_TIMESTAMP_KEY).then((time) => {
        if (time) setCachedTime(time);
      });
    }
  }, [storeCachedTime]);

  return storeCachedTime || cachedTime;
}
