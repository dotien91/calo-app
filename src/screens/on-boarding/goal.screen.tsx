import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, useTheme } from '@react-navigation/native';
import { CaretLeft, PersonSimpleRun, Fire, Drop, Check } from 'phosphor-react-native';
import { createStyles } from './goal.screen.style';
import { updateOnboardingGoals } from '@services/api/calorie.api';
import { translations } from '@localization';
import useStore from '@services/zustand/store';

// --- DATA ---
const DIET_OPTIONS = [
  { id: '1', key: 'BALANCED', title: translations.dietTypes.BALANCED, desc: 'Balanced approach to nutrition', macros: '20% protein, 50% carbs, 30% fat' },
  { id: '2', key: 'LOW_CARB', title: translations.dietTypes.LOW_CARB, desc: 'Reduced carbohydrate intake', macros: '40% protein, 20% carbs, 40% fat' },
  { id: '3', key: 'LOW_FAT', title: translations.dietTypes.LOW_FAT, desc: 'Reduced fat intake', macros: '30% protein, 55% carbs, 15% fat' },
  { id: '4', key: 'HIGH_PROTEIN', title: translations.dietTypes.HIGH_PROTEIN, desc: 'Increased protein intake', macros: '45% protein, 30% carbs, 25% fat' },
  { id: '5', key: 'KETO', title: translations.dietTypes.KETO, desc: 'Low carb, high fat diet', macros: '25% protein, 5% carbs, 70% fat' },
  { id: '6', key: 'VEGETARIAN', title: translations.dietTypes.VEGETARIAN, desc: 'No meat, fish or poultry', macros: '25% protein, 50% carbs, 25% fat' },
];

// --- INTERFACES ---
type ScreenType = 'INPUT' | 'WEIGHT' | 'DIET';

interface GoalDetailParams {
  type: ScreenType;
  title: string;
  description?: string;
  initialValue: string | any;
  unit?: string;
  iconType?: 'step' | 'fire' | 'water';
}

const GoalDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const theme = useTheme();
  const { colors, dark } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const onboardingData = useStore((state) => state.onboardingData);
  const setOnboardingData = useStore((state) => state.setOnboardingData);

  // Lấy Params truyền sang, có fallback mặc định để tránh crash
  const params = (route.params as GoalDetailParams) || {
    type: 'INPUT',
    title: 'Mục tiêu',
    initialValue: '',
  };

  // State
  const [inputValue, setInputValue] = useState(params.initialValue || getInitialValue());
  const [selectedDietId, setSelectedDietId] = useState(params.initialValue || getInitialValue());
  const [weightInt, setWeightInt] = useState(70);
  const [weightDec, setWeightDec] = useState(0);
  const [loading, setLoading] = useState(false);

  // Helper function to get initial value from onboarding data
  function getInitialValue(): string {
    if (!onboardingData) return '';

    switch (params.iconType) {
      case 'step':
        return onboardingData.target_steps?.toString() || '10000';
      case 'water':
        return onboardingData.target_water?.toString() || '2000';
      case 'fire':
        return onboardingData.target_calories?.toString() || '2045';
      default:
        if (params.type === 'DIET') {
          // Map diet type back to ID for selection
          const diet = DIET_OPTIONS.find(d => d.key === onboardingData.diet_type);
          return diet?.id || '1';
        }
        if (params.type === 'WEIGHT') {
          const weight = onboardingData.target_weight || 70;
          return weight.toString();
        }
        return '';
    }
  }

  // --- HELPER: Render Icon ---
  const renderHeaderIcon = () => {
    // Icon trong vòng tròn luôn màu đen (hoặc màu nền) để tương phản với màu xanh Primary
    const iconProps = { size: 32, color: colors.background, weight: "fill" as const };
    
    switch (params.iconType) {
      case 'fire': return <Fire {...iconProps} />;
      case 'water': return <Drop {...iconProps} />;
      case 'step': default: return <PersonSimpleRun {...iconProps} />;
    }
  };

  // --- LAYOUT 1: INPUT (Text Input khổng lồ) ---
  const renderInputLayout = () => {
    return (
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
           {renderHeaderIcon()}
        </View>

        {params.description && (
          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionText}>{params.description}</Text>
          </View>
        )}

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={inputValue}
            onChangeText={setInputValue}
            keyboardType="numeric"
            autoFocus
            selectionColor={colors.primary}
          />
          <View style={styles.underline} />
          <Text style={styles.unitText}>{params.unit}</Text>
        </View>
      </View>
    );
  };

  // --- LAYOUT 2: DIET LIST (Chọn chế độ ăn) ---
  const renderDietLayout = () => {
    // Khi active (Nền xanh), chữ chuyển sang màu Đen (hoặc Trắng) để dễ đọc
    // Nếu theme Primary màu xanh sáng (Lime), chữ Đen (colors.background ở Darkmode) sẽ nét hơn
    const activeTextColor = dark ? '#000000' : '#FFFFFF'; 

    return (
      <View style={{ flex: 1, width: '100%', paddingHorizontal: 16 }}>
        <ScrollView 
          contentContainerStyle={styles.selectionListContent}
          showsVerticalScrollIndicator={false}
        >
          {DIET_OPTIONS.map((item) => {
            const isActive = item.id === selectedDietId;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.dietCard, isActive && styles.dietCardActive]}
                onPress={() => setSelectedDietId(item.id)}
                activeOpacity={0.8}
              >
                <View style={styles.dietHeaderRow}>
                  <Text style={[styles.dietTitle, isActive && { color: activeTextColor }]}>
                    {item.title}
                  </Text>
                  {isActive && <Check size={20} color={activeTextColor} weight="bold" />}
                </View>
                
                <Text style={[styles.dietDesc, isActive && { color: activeTextColor, opacity: 0.8 }]}>
                  {item.desc}
                </Text>
                
                <Text style={[styles.dietMacros, isActive && { color: activeTextColor }]}>
                  {item.macros}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  // --- LAYOUT 3: WEIGHT PICKER (Giả lập Wheel Picker) ---
  const renderWeightLayout = () => {
    const integers = Array.from({ length: 150 }, (_, i) => i + 30);
    const decimals = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    return (
      <View style={styles.pickerContainer}>
         <View style={styles.pickerWrapper}>
            <View style={styles.pickerOverlay} />

            {/* Cột số nguyên */}
            <View style={styles.pickerColumn}>
              <FlatList
                data={integers}
                keyExtractor={(item) => item.toString()}
                snapToInterval={50}
                decelerationRate="fast"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 75 }}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.pickerItem} 
                    onPress={() => setWeightInt(item)}
                  >
                    <Text style={[styles.pickerText, weightInt !== item && { opacity: 0.3 }]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
                onMomentumScrollEnd={(ev) => {
                   const index = Math.round(ev.nativeEvent.contentOffset.y / 50);
                   if(integers[index]) setWeightInt(integers[index]);
                }}
              />
            </View>

            <Text style={[styles.pickerText, { paddingBottom: 8 }]}>.</Text>

            {/* Cột số thập phân */}
            <View style={styles.pickerColumn}>
              <FlatList
                data={decimals}
                keyExtractor={(item) => item.toString()}
                snapToInterval={50}
                decelerationRate="fast"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingVertical: 75 }}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.pickerItem} 
                    onPress={() => setWeightDec(item)}
                  >
                    <Text style={[styles.pickerText, weightDec !== item && { opacity: 0.3 }]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
                 onMomentumScrollEnd={(ev) => {
                   const index = Math.round(ev.nativeEvent.contentOffset.y / 50);
                   if(decimals[index] !== undefined) setWeightDec(decimals[index]);
                }}
              />
            </View>

            <Text style={styles.pickerUnit}>kg</Text>
         </View>
      </View>
    );
  };

  const handleSave = async () => {
    let result;
    if (params.type === 'DIET') result = selectedDietId;
    else if (params.type === 'WEIGHT') result = `${weightInt}.${weightDec}`;
    else result = inputValue;

    console.log("Saving value:", result);

    // Prepare data to update to backend
    const updateData: any = {};
    
    // Map result to appropriate field based on iconType/type
    if (params.iconType === 'step') {
      updateData.target_steps = parseInt(result, 10);
    } else if (params.iconType === 'water') {
      updateData.target_water = parseInt(result, 10);
    } else if (params.iconType === 'fire') {
      updateData.target_calories = parseInt(result, 10);
    } else if (params.type === 'DIET') {
      // Map diet ID to diet type key
      const selectedDiet = DIET_OPTIONS.find(d => d.id === result);
      updateData.diet_type = selectedDiet?.key || result;
    } else if (params.type === 'WEIGHT') {
      updateData.target_weight = parseFloat(result);
    }

    // Call API to update onboarding goals
    try {
      setLoading(true);
      const response = await updateOnboardingGoals(updateData);
      console.log("responseresponse", response);
      if (!response.isError) {
        console.log("Update success:", response.data);
        
        // Update onboarding data in store
        setOnboardingData(response.data);
        
        Alert.alert("Thành công", "Mục tiêu đã được cập nhật!");
        navigation.goBack();
      } else {
        Alert.alert("Lỗi", "Không thể cập nhật mục tiêu. Vui lòng thử lại!");
      }
    } catch (error: any) {
      console.error("Error updating goal:", error);
      
      const message = error?.message || "Có lỗi xảy ra khi cập nhật mục tiêu.";
      
      Alert.alert(
        "Thông báo", 
        message,
        [
            { text: "Đóng", style: "cancel" }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <CaretLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{params.title}</Text>
        </View>

        {/* Dynamic Content Area */}
        <View style={{ flex: 1 }}>
          {params.type === 'INPUT' && renderInputLayout()}
          {params.type === 'DIET' && renderDietLayout()}
          {params.type === 'WEIGHT' && renderWeightLayout()}
        </View>

        {/* Save Button */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "position" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.saveButton, loading && { opacity: 0.6 }]} 
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Lưu</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default GoalDetailScreen;