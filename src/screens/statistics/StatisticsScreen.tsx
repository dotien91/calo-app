import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";
import Icon from "react-native-vector-icons/Ionicons";

import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import { getMyBodyTracking, MyBodyTrackingItem } from "@services/api/track.api";

const { width } = Dimensions.get("window");

// --- Helpers: từ đầu tháng đến cuối tháng, nhóm theo ngày ---
/** Khoảng từ ngày 1 đến ngày cuối của tháng (referenceMonth = ngày 1 tháng đó). */
function getDateRangeForMonth(refMonth: Date): { date_from: string; date_to: string } {
  const y = refMonth.getFullYear();
  const m = refMonth.getMonth();
  const start = new Date(y, m, 1);
  const end = new Date(y, m + 1, 0);
  return {
    date_from: start.toISOString().slice(0, 10),
    date_to: end.toISOString().slice(0, 10),
  };
}

/** Nhóm theo ngày trong tháng: key = YYYY-MM-DD, value = trung bình cân nặng trong ngày. */
function groupByDay(
  items: Array<{ tracked_at: string; value: number | string; createdAt?: number }>
): { dayKey: string; day: number; avg: number }[] {
  const byDay: Record<string, number[]> = {};
  for (const item of items) {
    const d = new Date(item.tracked_at || (item.createdAt ?? 0));
    const key = d.toISOString().slice(0, 10); // YYYY-MM-DD
    if (!byDay[key]) byDay[key] = [];
    const v = Number(item.value);
    if (!Number.isNaN(v)) byDay[key].push(v);
  }
  return Object.entries(byDay)
    .map(([dayKey, values]) => ({
      dayKey,
      day: parseInt(dayKey.slice(8, 10), 10),
      avg: values.reduce((a, b) => a + b, 0) / values.length,
    }))
    .sort((a, b) => a.dayKey.localeCompare(b.dayKey));
}

/**
 * Điền ngày thiếu: ngày không có dữ liệu dùng giá trị ngày gần nhất trước đó.
 * Các ngày trước ngày có dữ liệu đầu tiên dùng luôn giá trị của ngày đầu tiên có dữ liệu.
 */
function fillMissingDaysWithPrevious(
  lastDayOfMonth: number,
  grouped: { day: number; avg: number }[]
): { day: number; value: number }[] {
  const byDay = new Map(grouped.map((g) => [g.day, g.avg]));
  const firstValue = grouped.length > 0 ? grouped[0].avg : undefined;
  let lastValue: number | undefined = firstValue;
  const result: { day: number; value: number }[] = [];
  for (let day = 1; day <= lastDayOfMonth; day++) {
    const value = byDay.get(day) ?? lastValue ?? firstValue;
    if (value !== undefined) {
      lastValue = value;
      result.push({ day, value: Math.round(value * 10) / 10 });
    }
  }
  return result;
}

// --- CONSTANTS COLORS (Lấy từ hình ảnh Dark Mode) ---
const COLORS = {
  bg: "#000000",
  cardBg: "#1C1C1E",
  textPrimary: "#FFFFFF",
  textSecondary: "#8E8E93",
  accent: "#4ADE80", // Màu xanh lá
  targetRed: "#FF3B30", // Màu đỏ mục tiêu
  gridLine: "#2C2C2E",
  progressBarBg: "#2C2C2E",
};

const CHART_LIMIT = 365;

const StatisticsScreen = () => {
  // Tháng đang xem: từ đầu tháng đến cuối tháng (mặc định = tháng hiện tại)
  const [referenceMonth, setReferenceMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [loading, setLoading] = useState(true);
  const [weightItems, setWeightItems] = useState<MyBodyTrackingItem[]>([]);

  const { date_from, date_to } = useMemo(
    () => getDateRangeForMonth(referenceMonth),
    [referenceMonth]
  );

  const fetchWeight = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await getMyBodyTracking({
        metric: "weight",
        date_from,
        date_to,
        limit: CHART_LIMIT,
        order_by: "ASC",
      });
      setWeightItems(data);
    } catch (_) {
      setWeightItems([]);
    } finally {
      setLoading(false);
    }
  }, [date_from, date_to]);

  useEffect(() => {
    fetchWeight();
  }, [fetchWeight]);

  // Số ngày trong tháng đang xem (28/29/30/31)
  const lastDayOfMonth = useMemo(
    () => new Date(referenceMonth.getFullYear(), referenceMonth.getMonth() + 1, 0).getDate(),
    [referenceMonth]
  );

  // Dữ liệu chart: gộp theo ngày, ngày thiếu dùng giá trị ngày trước
  const chartData = useMemo(() => {
    const grouped = groupByDay(weightItems);
    const filled = fillMissingDaysWithPrevious(lastDayOfMonth, grouped);
    return filled.map(({ day, value }) => ({
      value,
      label: String(day),
    }));
  }, [weightItems, lastDayOfMonth]);

  // Summary: cân nặng hiện tại (cuối kỳ), thay đổi (đầu - cuối)
  const summary = useMemo(() => {
    if (chartData.length === 0)
      return { current: 0, change: 0, first: 0, last: 0 };
    const first = chartData[0].value;
    const last = chartData[chartData.length - 1].value;
    return {
      current: last,
      change: Math.round((last - first) * 10) / 10,
      first,
      last,
    };
  }, [chartData]);

  const goPrevMonth = useCallback(() => {
    setReferenceMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const goNextMonth = useCallback(() => {
    const now = new Date();
    const currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
    setReferenceMonth((prev) => {
      const next = new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
      return next > currentStart ? currentStart : next;
    });
  }, []);

  const isNextDisabled = useMemo(() => {
    const now = new Date();
    const currentStart = new Date(now.getFullYear(), now.getMonth(), 1);
    return referenceMonth >= currentStart;
  }, [referenceMonth]);

  const dateNavText = useMemo(() => {
    return `thg ${referenceMonth.getMonth() + 1} ${referenceMonth.getFullYear()}`;
  }, [referenceMonth]);

  const renderSummaryCard = () => {
    const changeStr = summary.change >= 0 ? `+${summary.change}` : `${summary.change}`;
    return (
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.labelSmall}>THAY ĐỔI</Text>
            <Text style={styles.valueLarge}>{changeStr} kg</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.labelSmall}>CÂN NẶNG HIỆN TẠI</Text>
            <Text style={styles.valueLarge}>{summary.current ? `${summary.current} kg` : "—"}</Text>
          </View>
        </View>

        <Text style={[styles.labelSmall, { marginTop: 24, marginBottom: 8 }]}>
          ĐÃ ĐẠT ĐƯỢC 0% MỤC TIÊU
        </Text>

        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarFill} />
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.labelBottom}>{summary.first ? `${summary.first} kg` : "—"}</Text>
          <Icon name="arrow-forward" size={14} color={COLORS.textSecondary} />
          <Text style={styles.labelBottom}>{summary.last ? `${summary.last} kg` : "—"}</Text>
        </View>
      </View>
    );
  };

  const renderDateNavigator = () => {
    return (
      <View style={styles.dateNavContainer}>
        <TouchableOpacity style={styles.navBtn} onPress={goPrevMonth} activeOpacity={0.7}>
          <Icon name="chevron-back" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <Text style={styles.dateNavText} numberOfLines={1}>
          {dateNavText}
        </Text>

        <TouchableOpacity
          style={[styles.navBtn, isNextDisabled && styles.navBtnDisabled]}
          onPress={goNextMonth}
          disabled={isNextDisabled}
          activeOpacity={0.7}
        >
          <Icon
            name="chevron-forward"
            size={20}
            color={isNextDisabled ? COLORS.gridLine : COLORS.textSecondary}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderChart = () => {
    return (
      <View>
        <Text style={styles.sectionTitle}>Tiến trình cân nặng (kg)</Text>

        {loading ? (
          <View style={styles.chartPlaceholder}>
            <ActivityIndicator size="large" color={COLORS.accent} />
          </View>
        ) : chartData.length === 0 ? (
          <View style={styles.chartPlaceholder}>
            <Text style={styles.placeholderText}>Chưa có dữ liệu trong khoảng thời gian này</Text>
          </View>
        ) : (
          <View style={{ marginTop: 20, marginLeft: -10 }}>
            <LineChart
              data={chartData}
              areaChart={false}
              color={COLORS.accent}
              thickness={3}
              startFillColor={COLORS.accent}
              endFillColor={COLORS.accent}
              startOpacity={0.9}
              endOpacity={0.2}
              initialSpacing={20}
              spacing={Math.max((width - 60) / (chartData.length || 1), 24)}
              hideDataPoints={false}
              dataPointsColor={COLORS.bg}
              dataPointsRadius={6}
              dataPointLabelWidth={30}
              dataPointLabelShiftY={-20}
              textColor={COLORS.textSecondary}
              hideRules
              showVerticalLines
              verticalLinesColor={COLORS.gridLine}
              verticalLinesThickness={1}
              xAxisColor="transparent"
              yAxisColor="transparent"
              yAxisTextStyle={{ color: COLORS.textSecondary, fontSize: 12 }}
              xAxisLabelTextStyle={{ color: COLORS.textSecondary, fontSize: 12, marginTop: 4 }}
              noOfSections={4}
              customDataPoint={() => (
                <View
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    backgroundColor: COLORS.accent,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: COLORS.bg,
                    }}
                  />
                </View>
              )}
            />
          </View>
        )}

        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, { backgroundColor: COLORS.accent }]} />
            <Text style={styles.legendText}>Cân nặng trong tháng (kg)</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[CS.container, { backgroundColor: COLORS.bg }]}>
      {/* Header custom: Thêm nút 3 chấm bên phải */}
      <Header 
        hideBackBtn 
        text="Tiến Trình" 
        // Nếu Header của bạn support renderRight, hãy bỏ comment dòng dưới
        // renderRight={() => <Icon name="ellipsis-horizontal" size={24} color={COLORS.textPrimary} />}
        customStyle={{ backgroundColor: COLORS.bg }}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {renderSummaryCard()}
        {renderDateNavigator()}
        {renderChart()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default StatisticsScreen;

// --- STYLES ---
const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelSmall: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  valueLarge: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  progressBarContainer: {
    height: 36,
    backgroundColor: "#2C2C2E", // Màu nền thanh progress
    borderRadius: 8,
    overflow: "hidden",
    justifyContent: "center",
    marginBottom: 8,
  },
  progressBarFill: {
    height: "100%",
    width: "0%", // Width dynamic theo % goal
    backgroundColor: COLORS.accent,
  },
  labelBottom: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  
  // Date Nav
  dateNavContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  navBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.cardBg,
    justifyContent: "center",
    alignItems: "center",
  },
  navBtnDisabled: {
    opacity: 0.5,
  },
  dateNavText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },

  chartPlaceholder: {
    minHeight: 200,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  placeholderText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    gap: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendLine: {
    width: 20,
    height: 3,
    borderRadius: 1.5,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});