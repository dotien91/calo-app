import React, { useMemo } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Calendar, LocaleConfig, DateData } from "react-native-calendars";
import { useTheme } from "@react-navigation/native";
import { palette } from "@theme/themes"; // Hoặc file màu của bạn
import useStore from "@services/zustand/store";

// --- 1. Locales (chạy 1 lần khi import) ---
LocaleConfig.locales["vi"] = {
  monthNames: [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
  ],
  monthNamesShort: ["Th.1", "Th.2", "Th.3", "Th.4", "Th.5", "Th.6", "Th.7", "Th.8", "Th.9", "Th.10", "Th.11", "Th.12"],
  dayNames: ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"],
  dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
  today: "Hôm nay",
};

LocaleConfig.locales["en"] = {
  monthNames: [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ],
  monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  today: "Today",
};

LocaleConfig.locales["jp"] = {
  monthNames: [
    "1月", "2月", "3月", "4月", "5月", "6月",
    "7月", "8月", "9月", "10月", "11月", "12月",
  ],
  monthNamesShort: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
  dayNames: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"],
  dayNamesShort: ["日", "月", "火", "水", "木", "金", "土"],
  today: "今日",
};

// --- 2. Props ---
interface CalendarPickerViewProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  style?: ViewStyle; // Để custom container nếu cần
}

const CalendarPickerView: React.FC<CalendarPickerViewProps> = ({
  selectedDate,
  onDateSelect,
  style,
}) => {
  const theme = useTheme();
  const currentLanguage = useStore((state) => state.language);
  const { colors, dark } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Set locale theo ngôn ngữ app (fallback en)
  LocaleConfig.defaultLocale = currentLanguage === "vi" || currentLanguage === "jp" ? currentLanguage : "en";

  // Màu chủ đạo (Lấy từ theme hoặc hardcode màu xanh lá)
  const ACCENT_COLOR = palette?.green2 || "#4ADE80"; 
  const TEXT_COLOR = colors.text;
  const BG_COLOR = colors.card ?? (dark ? "#1C1C1E" : "#FFFFFF");
  const MUTED_TEXT = colors.textOpacity8 ?? (dark ? "#A0A0A0" : "#666666");

  // Format Date object -> YYYY-MM-DD (Local time) để tránh lệch múi giờ
  const getFormattedDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const currentString = getFormattedDate(selectedDate);

  return (
    <View style={[styles.container, { backgroundColor: BG_COLOR }, style]}>
      <Calendar
        // --- Cấu hình Logic ---
        current={currentString}
        // Giới hạn ngày (ví dụ không cho chọn tương lai)
        maxDate={getFormattedDate(new Date())}
        
        onDayPress={(day: DateData) => {
          // day.timestamp trả về UTC 00:00, ta tạo Date object theo giờ địa phương
          const newDate = new Date(day.year, day.month - 1, day.day);
          onDateSelect(newDate);
        }}

        // --- Cấu hình Giao diện ---
        markingType={'custom'}
        markedDates={{
          [currentString]: {
            customStyles: {
              container: {
                backgroundColor: ACCENT_COLOR,
                borderRadius: 8, // Bo góc vuông nhẹ thay vì tròn vo
                elevation: 2
              },
              text: {
                color: '#000000', // Chữ đen trên nền xanh cho dễ đọc
                fontWeight: 'bold'
              }
            }
          }
        }}
        
        // --- Theme Adapter cho Dark/Light mode ---
        theme={{
          backgroundColor: "transparent",
          calendarBackground: "transparent", // container bên ngoài đã set BG_COLOR
          textSectionTitleColor: MUTED_TEXT,
          selectedDayBackgroundColor: ACCENT_COLOR,
          selectedDayTextColor: "#000000",
          todayTextColor: ACCENT_COLOR,
          dayTextColor: TEXT_COLOR,
          textDisabledColor: dark ? "#444444" : "#d9e1e8",
          dotColor: ACCENT_COLOR,
          monthTextColor: TEXT_COLOR,
          indicatorColor: ACCENT_COLOR,
          arrowColor: ACCENT_COLOR, // Màu mũi tên chuyển tháng
          
          // Font styling
          textDayFontWeight: "400",
          textMonthFontWeight: "bold",
          textDayHeaderFontWeight: "600",
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 14,
        }}
      />
    </View>
  );
};

export default CalendarPickerView;

// --- Styles ---
const createStyles = (_theme: any) => {
  return StyleSheet.create({
    container: {
      width: '100%',
      borderRadius: 16,
      overflow: "hidden",
      padding: 8,
    },
  });
};