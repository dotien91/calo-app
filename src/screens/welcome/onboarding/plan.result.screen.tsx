import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import * as NavigationService from "react-navigation-helpers";
import { useRoute } from "@react-navigation/native";

import Button from "@shared-components/button/Button";
import TextBase from "@shared-components/TextBase";
import { SCREENS } from "constants";
import { palette } from "@theme/themes";
import { PlanResult } from "@utils/plan.utils";
import { _setJson } from "@services/local-storage";

interface PlanResultScreenProps {}

const PlanResultScreen: React.FC<PlanResultScreenProps> = () => {
  const route = useRoute();
  const planResult = (route.params as any)?.planResult as PlanResult;

  if (!planResult) {
    return null;
  }

  const handleFinish = () => {
    // _setJson("is_first_open_app", false);
    NavigationService.replace(SCREENS.TABS);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TextBase fontSize={28} fontWeight="700" color="text" style={styles.title}>
            Kế hoạch của bạn
          </TextBase>
          <TextBase
            fontSize={16}
            fontWeight="400"
            color="textOpacity8"
            style={styles.subtitle}
          >
            Dựa trên thông tin bạn cung cấp, đây là kế hoạch dinh dưỡng phù hợp
          </TextBase>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <TextBase fontSize={20} fontWeight="700" color="text">
              Mục tiêu
            </TextBase>
          </View>
          <View style={styles.goalRow}>
            <View style={styles.goalItem}>
              <TextBase fontSize={14} fontWeight="400" color="textOpacity8">
                Cân nặng hiện tại
              </TextBase>
              <TextBase fontSize={24} fontWeight="700" color="text" style={styles.goalValue}>
                {planResult.currentWeight} kg
              </TextBase>
            </View>
            <View style={styles.goalArrow}>
              <TextBase fontSize={20} fontWeight="700" color="primary">
                →
              </TextBase>
            </View>
            <View style={styles.goalItem}>
              <TextBase fontSize={14} fontWeight="400" color="textOpacity8">
                Cân nặng mục tiêu
              </TextBase>
              <TextBase fontSize={24} fontWeight="700" color="text" style={styles.goalValue}>
                {planResult.targetWeight} kg
              </TextBase>
            </View>
          </View>
          <View style={styles.goalInfo}>
            <TextBase fontSize={14} fontWeight="400" color="textOpacity8">
              {planResult.isGaining ? "Tăng cân" : "Giảm cân"} • Dự kiến đạt vào{" "}
              {planResult.date}
            </TextBase>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <TextBase fontSize={20} fontWeight="700" color="text">
              Calories hàng ngày
            </TextBase>
          </View>
          <View style={styles.caloriesContainer}>
            <TextBase fontSize={48} fontWeight="700" color="primary" style={styles.caloriesValue}>
              {planResult.dailyCalories}
            </TextBase>
            <TextBase fontSize={18} fontWeight="400" color="textOpacity8">
              kcal/ngày
            </TextBase>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <TextBase fontSize={20} fontWeight="700" color="text">
              Phân bổ Macro
            </TextBase>
          </View>
          <View style={styles.macroContainer}>
            <View style={styles.macroItem}>
              <View style={[styles.macroBar, { backgroundColor: palette.primary }]} />
              <View style={styles.macroContent}>
                <TextBase fontSize={16} fontWeight="600" color="text">
                  Carb
                </TextBase>
                <TextBase fontSize={14} fontWeight="400" color="textOpacity8">
                  50%
                </TextBase>
                <TextBase fontSize={20} fontWeight="700" color="text" style={styles.macroValue}>
                  {planResult.carbs} g
                </TextBase>
              </View>
            </View>

            <View style={styles.macroItem}>
              <View style={[styles.macroBar, { backgroundColor: palette.green }]} />
              <View style={styles.macroContent}>
                <TextBase fontSize={16} fontWeight="600" color="text">
                  Protein
                </TextBase>
                <TextBase fontSize={14} fontWeight="400" color="textOpacity8">
                  20%
                </TextBase>
                <TextBase fontSize={20} fontWeight="700" color="text" style={styles.macroValue}>
                  {planResult.protein} g
                </TextBase>
              </View>
            </View>

            <View style={styles.macroItem}>
              <View style={[styles.macroBar, { backgroundColor: palette.yellow }]} />
              <View style={styles.macroContent}>
                <TextBase fontSize={16} fontWeight="600" color="text">
                  Fat
                </TextBase>
                <TextBase fontSize={14} fontWeight="400" color="textOpacity8">
                  30%
                </TextBase>
                <TextBase fontSize={20} fontWeight="700" color="text" style={styles.macroValue}>
                  {planResult.fat} g
                </TextBase>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.infoCard}>
          <TextBase fontSize={14} fontWeight="400" color="textOpacity8" style={styles.infoText}>
            💡 Lưu ý: Đây là kế hoạch tham khảo dựa trên công thức Mifflin-St Jeor. 
            Kết quả có thể khác nhau tùy theo cơ địa và chế độ tập luyện của bạn.
          </TextBase>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          style={styles.button}
          text="Bắt đầu"
          backgroundColor={palette.primary}
          textColor={palette.white}
          onPress={handleFinish}
        />
      </View>
    </SafeAreaView>
  );
};

export default PlanResultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.white,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    textAlign: "center",
  },
  card: {
    backgroundColor: palette.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: palette.grey1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    marginBottom: 16,
  },
  goalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  goalItem: {
    flex: 1,
    alignItems: "center",
  },
  goalArrow: {
    paddingHorizontal: 16,
  },
  goalValue: {
    marginTop: 4,
  },
  goalInfo: {
    marginTop: 12,
    alignItems: "center",
  },
  caloriesContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  caloriesValue: {
    marginBottom: 8,
  },
  macroContainer: {
    gap: 16,
  },
  macroItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  macroBar: {
    width: 4,
    height: 60,
    borderRadius: 2,
  },
  macroContent: {
    flex: 1,
  },
  macroValue: {
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: palette.grey1 + "20",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  infoText: {
    lineHeight: 20,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: palette.white,
    borderTopWidth: 1,
    borderTopColor: palette.grey1,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
});
