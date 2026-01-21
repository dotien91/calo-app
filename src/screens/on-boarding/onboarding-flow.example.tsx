/**
 * Example: Complete Onboarding Flow with API Integration
 * 
 * This file demonstrates how to integrate the onboarding API
 * with your goal screen and onboarding flow.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  submitOnboarding,
  getOnboarding,
  updateOnboardingGoals,
  Gender,
  ActivityLevel,
  WeightGoalPace,
  type OnboardingData,
  type OnboardingResponse,
  type GetOnboardingResponse,
} from '@services/api/calorie.api';

/**
 * Example 1: Submit Initial Onboarding Data
 * This would typically be called after user completes the onboarding form
 */
export const OnboardingSubmitExample = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleSubmitOnboarding = async () => {
    // Collect user's onboarding data from form inputs
    const onboardingData: OnboardingData = {
      gender: Gender.MALE,
      age: 30,
      height: 175, // cm
      currentWeight: 80, // kg
      targetWeight: 70, // kg
      activityLevel: ActivityLevel.MODERATELY_ACTIVE,
      pace: WeightGoalPace.NORMAL,
    };

    try {
      setLoading(true);
      const response: OnboardingResponse = await submitOnboarding(onboardingData);

      if (response.success) {
        console.log('Onboarding Plan:', response.data.plan);
        console.log('Onboarding Data:', response.data.onboarding);

        // Display results to user
        Alert.alert(
          'Kế hoạch của bạn',
          `Calories mục tiêu: ${response.data.plan.daily_calories} kcal/ngày\n` +
          `Protein: ${response.data.plan.macros.protein_g}g\n` +
          `Carbs: ${response.data.plan.macros.carbs_g}g\n` +
          `Fat: ${response.data.plan.macros.fat_g}g\n` +
          `Thời gian dự kiến: ${response.data.plan.weeks_to_goal} tuần`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate to next screen or home
                // navigation.navigate('Home');
              },
            },
          ]
        );
      }
    } catch (error: any) {
      console.error('Onboarding error:', error);
      Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra khi tạo kế hoạch.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TouchableOpacity
        onPress={handleSubmitOnboarding}
        disabled={loading}
        style={{
          backgroundColor: '#007AFF',
          padding: 15,
          borderRadius: 10,
          alignItems: 'center',
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
            Tạo Kế Hoạch
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

/**
 * Example 2: Get Existing Onboarding Data
 * Load user's existing onboarding data when they open settings or goals screen
 */
export const OnboardingDataExample = () => {
  const [onboardingData, setOnboardingData] = useState<GetOnboardingResponse['data'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOnboardingData();
  }, []);

  const loadOnboardingData = async () => {
    try {
      setLoading(true);
      const response: GetOnboardingResponse = await getOnboarding();

      if (response.success) {
        setOnboardingData(response.data);
        console.log('User Goals:', {
          calories: response.data.target_calories,
          protein: response.data.target_protein,
          carbs: response.data.target_carbs,
          fat: response.data.target_fat,
          steps: response.data.target_steps,
          water: response.data.target_water,
          dietType: response.data.diet_type,
        });
      }
    } catch (error: any) {
      console.error('Load onboarding error:', error);
      if (error.message?.includes('Chưa có thông tin')) {
        // User hasn't completed onboarding yet
        // Navigate to onboarding flow
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  if (!onboardingData) {
    return <Text>Chưa có dữ liệu onboarding</Text>;
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Mục tiêu của bạn
      </Text>
      <Text>Calories: {onboardingData.target_calories} kcal</Text>
      <Text>Protein: {onboardingData.target_protein}g</Text>
      <Text>Carbs: {onboardingData.target_carbs}g</Text>
      <Text>Fat: {onboardingData.target_fat}g</Text>
      <Text>Bước chân: {onboardingData.target_steps || 'Chưa đặt'}</Text>
      <Text>Nước: {onboardingData.target_water || 'Chưa đặt'}ml</Text>
      <Text>Chế độ ăn: {onboardingData.diet_type || 'Chưa chọn'}</Text>
    </View>
  );
};

/**
 * Example 3: Update Goals (Diet Type, Steps, Water)
 * This is what your goal.screen.tsx now does!
 */
export const UpdateGoalsExample = () => {
  const [loading, setLoading] = useState(false);

  const handleUpdateDietType = async (dietType: string) => {
    try {
      setLoading(true);
      const response = await updateOnboardingGoals({
        diet_type: dietType,
      });

      if (response.success) {
        Alert.alert('Thành công', 'Chế độ ăn đã được cập nhật!');
        console.log('Updated data:', response.data);
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể cập nhật chế độ ăn.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSteps = async (steps: number) => {
    try {
      setLoading(true);
      const response = await updateOnboardingGoals({
        target_steps: steps,
      });

      if (response.success) {
        Alert.alert('Thành công', `Mục tiêu bước chân: ${steps} bước/ngày`);
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể cập nhật mục tiêu bước chân.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWater = async (water: number) => {
    try {
      setLoading(true);
      const response = await updateOnboardingGoals({
        target_water: water,
      });

      if (response.success) {
        Alert.alert('Thành công', `Mục tiêu nước: ${water}ml/ngày`);
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message || 'Không thể cập nhật mục tiêu nước.');
    } finally {
      setLoading(false);
    }
  };

  // Update multiple goals at once
  const handleUpdateMultipleGoals = async () => {
    try {
      setLoading(true);
      const response = await updateOnboardingGoals({
        diet_type: 'Cân bằng',
        target_steps: 10000,
        target_water: 2000,
      });

      if (response.success) {
        Alert.alert('Thành công', 'Tất cả mục tiêu đã được cập nhật!');
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20, gap: 10 }}>
      <TouchableOpacity
        onPress={() => handleUpdateDietType('Cân bằng')}
        disabled={loading}
        style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 10 }}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>
          Cập nhật chế độ ăn: Cân bằng
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleUpdateSteps(10000)}
        disabled={loading}
        style={{ backgroundColor: '#34C759', padding: 15, borderRadius: 10 }}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>
          Đặt mục tiêu: 10,000 bước
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleUpdateWater(2000)}
        disabled={loading}
        style={{ backgroundColor: '#5AC8FA', padding: 15, borderRadius: 10 }}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>
          Đặt mục tiêu: 2000ml nước
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleUpdateMultipleGoals}
        disabled={loading}
        style={{ backgroundColor: '#FF9500', padding: 15, borderRadius: 10 }}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>
          Cập nhật tất cả mục tiêu
        </Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * Example 4: How to use in your navigation
 * 
 * When navigating to goal.screen.tsx, pass the appropriate params:
 */
export const NavigationExample = () => {
  const navigation = useNavigation<any>();

  const navigateToSetSteps = () => {
    navigation.navigate('GOAL', {
      type: 'INPUT',
      title: 'Mục tiêu bước chân',
      description: 'Số bước chân bạn muốn đạt được mỗi ngày',
      initialValue: '10000',
      unit: 'bước',
      iconType: 'step',
    });
  };

  const navigateToSetWater = () => {
    navigation.navigate('GOAL', {
      type: 'INPUT',
      title: 'Mục tiêu nước',
      description: 'Lượng nước bạn cần uống mỗi ngày',
      initialValue: '2000',
      unit: 'ml',
      iconType: 'water',
    });
  };

  const navigateToSetDiet = () => {
    navigation.navigate('GOAL', {
      type: 'DIET',
      title: 'Chế độ ăn',
      initialValue: '1', // ID of selected diet
    });
  };

  const navigateToSetWeight = () => {
    navigation.navigate('GOAL', {
      type: 'WEIGHT',
      title: 'Cân nặng mục tiêu',
      initialValue: '70.0',
    });
  };

  return null;
};
