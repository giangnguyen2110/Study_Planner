/**
 * ============================================================================
 * TÊN FILE: src/components/ui/OfflineBanner.tsx
 * VAI TRÒ: THÀNH VIÊN 2 (TV2 - Data Architecture, State, Auth & Logic)
 * ============================================================================
 * 
 * 📌 MỤC ĐÍCH COMPONENT:
 * Hiển thị Banner cảnh báo trạng thái ngoại tuyến (Offline Banner):
 * 1. Đáp ứng tiêu chí bắt buộc của đề bài: "the last successful load is shown with a visible banner:
 *    showing saved data from <time>".
 * 2. Hiển thị ở đầu màn hình khi ứng dụng không có kết nối Internet nhưng vẫn có dữ liệu lưu trong cache.
 * 3. Tự động đổi màu theo Theme tokens (`offlineBanner` và `offlineText`), tuân thủ luật Zero-Hex.
 * ============================================================================
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { Spacing } from '../../constants/tokens';

interface Props {
  isOffline: boolean;
  savedTime?: string | null;
}

export function OfflineBanner({ isOffline, savedTime }: Props) {
  const colors = useThemeColor();

  // Nếu không mất mạng thì không hiển thị
  if (!isOffline) {
    return null;
  }

  // Định dạng mốc thời gian lưu dữ liệu
  let formattedTime = 'gần nhất';
  try {
    if (savedTime) {
      formattedTime = new Date(savedTime).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    }
  } catch {
    formattedTime = 'gần nhất';
  }

  return (
    <View
      accessibilityRole="alert"
      accessibilityLabel={`Đang xem dữ liệu ngoại tuyến lưu lúc ${formattedTime}`}
      style={[styles.banner, { backgroundColor: colors.offlineBanner }]}
    >
      <Text style={[styles.text, { color: colors.offlineText }]}>
        ⚠️ Đang xem dữ liệu ngoại tuyến lưu lúc {formattedTime}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom: Spacing.md,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
