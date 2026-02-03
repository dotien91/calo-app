import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import { calculateBMI } from "@utils/plan.utils";
import { translations } from "@localization";

interface BMIStatusViewProps {
  weight: number;
  height: number;
}

const BMIStatusView: React.FC<BMIStatusViewProps> = ({ weight, height }) => {
  const theme = useTheme();

  // --- LOGIC TÍNH TOÁN BMI ---
  const bmiInfo = useMemo(() => {
    return calculateBMI(weight, height);
  }, [weight, height]);

  // --- RENDER ---
  if (!bmiInfo) {
    return (
      <View style={styles.container}>
        <Text style={{ color: "gray", fontSize: 12 }}>
          {translations.bmi?.waitingHeight ?? "Đang chờ dữ liệu chiều cao..."}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: theme.colors.text }]}>
        {translations.bmi?.estimateLabel ?? "BMI ước tính"}:{" "}
        <Text style={styles.value}>{bmiInfo.value}</Text>
      </Text>

      {/* Badge hiển thị trạng thái màu */}
      <View style={[styles.badge, { backgroundColor: bmiInfo.color + "20" }]}>
        <Text style={[styles.badgeText, { color: bmiInfo.color }]}>
          {translations.bmi?.[bmiInfo.type] ?? bmiInfo.type}
        </Text>
      </View>
    </View>
  );
};

// Styles nội bộ của riêng Component này
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    minHeight: 80, // Giữ chỗ để không bị giật layout
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
    opacity: 0.8,
  },
  value: {
    fontWeight: "bold",
    fontSize: 18,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontWeight: "700",
    fontSize: 14,
    textTransform: "uppercase",
  },
});

export default BMIStatusView;