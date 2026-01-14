import React, { useRef, useState } from "react";
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Pressable,
  Text,
} from "react-native";
import * as NavigationService from "react-navigation-helpers";
import PageControl from "react-native-page-control";
import { ScreenWidth } from "@freakycoder/react-native-helpers";
import useStore from "@services/zustand/store";
import { translations } from "@localization";
import IconSvg from "assets/svg";
import { updateSession } from "@services/api/notification.api";
import { LANG, _setJson } from "@services/local-storage";

import Button from "@shared-components/button/Button";
import TextBase from "@shared-components/TextBase";
import { SCREENS } from "constants";
import { palette } from "@theme/themes";
import { calculatePlan, PlanCalculationData } from "@utils/plan.utils";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface OnboardingScreenProps {}

const OnboardingScreen: React.FC<OnboardingScreenProps> = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<FlatList>(null);
  const setLanguage = useStore((state) => state.setLanguage);
  const currentLanguage = useStore((state) => state.language);

  const [formData, setFormData] = useState<PlanCalculationData>({
    currentWeight: "",
    height: "",
    age: "",
    targetWeight: "",
    gender: "MALE",
    activityLevel: "MODERATELY_ACTIVE",
    pace: "NORMAL",
  });

  const languageList = [
    {
      label: "Vietnamese",
      value: "vi",
      flag: <IconSvg name="icFlagvi" size={20} />,
    },
    {
      label: "Japanese",
      value: "jp",
      flag: <IconSvg name="icFlagjp" size={20} />,
    },
    {
      label: "English",
      value: "en",
      flag: <IconSvg name="icFlagen" size={20} />,
    },
  ];

  const updateFormData = (key: keyof PlanCalculationData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleLanguageSelect = (value: string) => {
    translations.setLanguage(value);
    setLanguage(value);
    _setJson(LANG, value);
    updateSession({ picked_language: value });
    // Điều hướng đến màn hình đầu tiên của onboarding
    NavigationService.navigate(SCREENS.CURRENT_WEIGHT, {
      formData: {
        currentWeight: "",
        height: "",
        age: "",
        targetWeight: "",
        gender: "MALE",
        activityLevel: "MODERATELY_ACTIVE",
        pace: "NORMAL",
      },
    });
  };

  const renderScreen0 = () => (
    <ScrollView
      style={styles.screenContainer}
      contentContainerStyle={styles.screenContent}
      showsVerticalScrollIndicator={false}
    >
      <TextBase
        fontSize={24}
        fontWeight="700"
        color="text"
        style={styles.title}
      >
        {translations.changeLanguage}
      </TextBase>
      <TextBase
        fontSize={16}
        fontWeight="400"
        color="textOpacity8"
        style={styles.subtitle}
      >
        Chọn ngôn ngữ bạn muốn sử dụng
      </TextBase>

      <View style={styles.optionsContainer}>
        {languageList.map((item) => {
          const isSelected = item.value === currentLanguage;
          return (
            <TouchableOpacity
              key={item.value}
              style={[
                styles.optionCard,
                isSelected && styles.optionCardSelected,
              ]}
              onPress={() => handleLanguageSelect(item.value)}
            >
              <View style={styles.languageItem}>
                <View style={styles.languageLeft}>
                  {item.flag}
                  <Text style={styles.languageText}>{item.label}</Text>
                </View>
                {isSelected && <IconSvg name="icCheckCircleFill" size={24} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );

  const renderScreen1 = () => (
    <ScrollView
      style={styles.screenContainer}
      contentContainerStyle={styles.screenContent}
      showsVerticalScrollIndicator={false}
    >
      <TextBase
        fontSize={24}
        fontWeight="700"
        color="text"
        style={styles.title}
      >
        Thông tin cơ bản
      </TextBase>
      <TextBase
        fontSize={16}
        fontWeight="400"
        color="textOpacity8"
        style={styles.subtitle}
      >
        Hãy cho chúng tôi biết một số thông tin để tính toán kế hoạch phù hợp với bạn
      </TextBase>

      <View style={styles.inputGroup}>
        <TextBase fontSize={16} fontWeight="600" color="text" style={styles.label}>
          Cân nặng hiện tại (kg)
        </TextBase>
        <TextInput
          style={styles.input}
          placeholder="Ví dụ: 70"
          keyboardType="numeric"
          value={String(formData.currentWeight)}
          onChangeText={(text) => updateFormData("currentWeight", text)}
          placeholderTextColor={palette.placeholder}
        />
      </View>

      <View style={styles.inputGroup}>
        <TextBase fontSize={16} fontWeight="600" color="text" style={styles.label}>
          Chiều cao (cm)
        </TextBase>
        <TextInput
          style={styles.input}
          placeholder="Ví dụ: 170"
          keyboardType="numeric"
          value={String(formData.height)}
          onChangeText={(text) => updateFormData("height", text)}
          placeholderTextColor={palette.placeholder}
        />
      </View>

      <View style={styles.inputGroup}>
        <TextBase fontSize={16} fontWeight="600" color="text" style={styles.label}>
          Tuổi
        </TextBase>
        <TextInput
          style={styles.input}
          placeholder="Ví dụ: 25"
          keyboardType="numeric"
          value={String(formData.age)}
          onChangeText={(text) => updateFormData("age", text)}
          placeholderTextColor={palette.placeholder}
        />
      </View>

      <View style={styles.inputGroup}>
        <TextBase fontSize={16} fontWeight="600" color="text" style={styles.label}>
          Cân nặng mục tiêu (kg)
        </TextBase>
        <TextInput
          style={styles.input}
          placeholder="Ví dụ: 65"
          keyboardType="numeric"
          value={String(formData.targetWeight)}
          onChangeText={(text) => updateFormData("targetWeight", text)}
          placeholderTextColor={palette.placeholder}
        />
      </View>
    </ScrollView>
  );

  const renderScreen2 = () => (
    <ScrollView
      style={styles.screenContainer}
      contentContainerStyle={styles.screenContent}
      showsVerticalScrollIndicator={false}
    >
      <TextBase fontSize={24} fontWeight="700" color="text" style={styles.title}>
        Giới tính
      </TextBase>
      <TextBase
        fontSize={16}
        fontWeight="400"
        color="textOpacity8"
        style={styles.subtitle}
      >
        Chọn giới tính của bạn
      </TextBase>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            formData.gender === "MALE" && styles.optionButtonSelected,
          ]}
          onPress={() => updateFormData("gender", "MALE")}
        >
          <TextBase
            fontSize={18}
            fontWeight="600"
            color={formData.gender === "MALE" ? "white" : "text"}
          >
            Nam
          </TextBase>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButton,
            formData.gender === "FEMALE" && styles.optionButtonSelected,
          ]}
          onPress={() => updateFormData("gender", "FEMALE")}
        >
          <TextBase
            fontSize={18}
            fontWeight="600"
            color={formData.gender === "FEMALE" ? "white" : "text"}
          >
            Nữ
          </TextBase>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderScreen3 = () => (
    <ScrollView
      style={styles.screenContainer}
      contentContainerStyle={styles.screenContent}
      showsVerticalScrollIndicator={false}
    >
      <TextBase fontSize={24} fontWeight="700" color="text" style={styles.title}>
        Mức độ hoạt động
      </TextBase>
      <TextBase
        fontSize={16}
        fontWeight="400"
        color="textOpacity8"
        style={styles.subtitle}
      >
        Mô tả mức độ hoạt động hàng ngày của bạn
      </TextBase>

      <View style={styles.optionsContainer}>
        {[
          { key: "SEDENTARY", label: "Ít vận động", desc: "Ngồi nhiều, ít tập thể dục" },
          {
            key: "LIGHTLY_ACTIVE",
            label: "Vận động nhẹ",
            desc: "Tập thể dục 1-3 lần/tuần",
          },
          {
            key: "MODERATELY_ACTIVE",
            label: "Vận động vừa",
            desc: "Tập thể dục 3-5 lần/tuần",
          },
          {
            key: "VERY_ACTIVE",
            label: "Vận động nhiều",
            desc: "Tập thể dục 6-7 lần/tuần",
          },
        ].map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.optionCard,
              formData.activityLevel === item.key && styles.optionCardSelected,
            ]}
            onPress={() =>
              updateFormData("activityLevel", item.key as PlanCalculationData["activityLevel"])
            }
          >
            <TextBase
              fontSize={18}
              fontWeight="600"
              color={formData.activityLevel === item.key ? "primary" : "text"}
            >
              {item.label}
            </TextBase>
            <TextBase
              fontSize={14}
              fontWeight="400"
              color={formData.activityLevel === item.key ? "primary" : "textOpacity8"}
              style={styles.optionDesc}
            >
              {item.desc}
            </TextBase>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderScreen4 = () => (
    <ScrollView
      style={styles.screenContainer}
      contentContainerStyle={styles.screenContent}
      showsVerticalScrollIndicator={false}
    >
      <TextBase fontSize={24} fontWeight="700" color="text" style={styles.title}>
        Tốc độ thay đổi
      </TextBase>
      <TextBase
        fontSize={16}
        fontWeight="400"
        color="textOpacity8"
        style={styles.subtitle}
      >
        Bạn muốn đạt mục tiêu với tốc độ nào?
      </TextBase>

      <View style={styles.optionsContainer}>
        {[
          { key: "SLOW", label: "Chậm", desc: "0.25 kg/tuần - An toàn và bền vững" },
          { key: "NORMAL", label: "Bình thường", desc: "0.5 kg/tuần - Cân bằng" },
          { key: "FAST", label: "Nhanh", desc: "1 kg/tuần - Cần kiên trì" },
        ].map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.optionCard,
              formData.pace === item.key && styles.optionCardSelected,
            ]}
            onPress={() =>
              updateFormData("pace", item.key as PlanCalculationData["pace"])
            }
          >
            <TextBase
              fontSize={18}
              fontWeight="600"
              color={formData.pace === item.key ? "primary" : "text"}
            >
              {item.label}
            </TextBase>
            <TextBase
              fontSize={14}
              fontWeight="400"
              color={formData.pace === item.key ? "primary" : "textOpacity8"}
              style={styles.optionDesc}
            >
              {item.desc}
            </TextBase>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderScreens = [
    { component: renderScreen0() },
    { component: renderScreen1() },
    { component: renderScreen2() },
    { component: renderScreen3() },
    { component: renderScreen4() },
  ];

  const nextRight = () => {
    // Bỏ qua step chọn ngôn ngữ (step 0) vì đã tự động chuyển khi chọn
    if (currentPage === 0) {
      return;
    }
    if (currentPage < renderScreens.length - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      scrollViewRef.current?.scrollToOffset({
        offset: newPage * SCREEN_WIDTH,
        animated: true,
      });
    } else {
      // Validate và tính toán
      if (
        formData.currentWeight &&
        formData.height &&
        formData.age &&
        formData.targetWeight
      ) {
        const result = calculatePlan(formData);
        NavigationService.navigate(SCREENS.PLAN_RESULT, { planResult: result });
      }
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.containerItem}>{item.component}</View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={scrollViewRef}
        style={styles.flatList}
        data={renderScreens}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        pagingEnabled
        horizontal
        scrollEnabled={false}
        onMomentumScrollEnd={(ev) => {
          setCurrentPage(
            Math.round(ev.nativeEvent.contentOffset.x / SCREEN_WIDTH)
          );
        }}
      />
      <View style={styles.viewPage}>
        <PageControl
          style={styles.pageControl}
          numberOfPages={renderScreens.length}
          currentPage={currentPage}
          hidesForSinglePage
          pageIndicatorTintColor={palette.grey1}
          currentPageIndicatorTintColor={palette.btnRedPrimary}
          indicatorStyle={{ borderRadius: 5 }}
          currentIndicatorStyle={{ borderRadius: 24, width: 24, height: 8 }}
          indicatorSize={{ width: 8, height: 8 }}
        />
        {currentPage !== 0 && (
          <Button
            style={styles.button}
            text={currentPage === renderScreens.length - 1 ? "Xem kết quả" : "Tiếp tục"}
            backgroundColor={palette.primary}
            textColor={palette.white}
            onPress={nextRight}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.white,
  },
  flatList: {
    flex: 1,
  },
  containerItem: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  screenContent: {
    paddingTop: 40,
    paddingBottom: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: palette.grey1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: palette.text,
    backgroundColor: palette.white,
  },
  optionsContainer: {
    gap: 16,
  },
  optionButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: palette.grey1,
    alignItems: "center",
    backgroundColor: palette.white,
  },
  optionButtonSelected: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  optionCard: {
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: palette.grey1,
    backgroundColor: palette.white,
  },
  optionCardSelected: {
    borderColor: palette.primary,
    backgroundColor: palette.secondColor,
  },
  optionDesc: {
    marginTop: 4,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  languageLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  languageText: {
    fontSize: 18,
    fontWeight: "600",
    color: palette.text,
  },
  viewPage: {
    alignItems: "center",
    marginHorizontal: 16,
    paddingBottom: 20,
  },
  pageControl: {
    height: 54,
    width: ScreenWidth - 32,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
});
