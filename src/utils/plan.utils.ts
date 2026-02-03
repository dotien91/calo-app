// src/utils/plan.utils.ts

// 1. Định nghĩa các Type cho BMI
export type BMIType = 'UNDERWEIGHT' | 'NORMAL' | 'OVERWEIGHT' | 'OBESE';

export interface PlanCalculationData {
  currentWeight: string | number;
  height: string | number;
  age: string | number;
  targetWeight: string | number;
  gender: 'MALE' | 'FEMALE';
  activityLevel: 'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'MODERATELY_ACTIVE' | 'VERY_ACTIVE';
  pace: 'SLOW' | 'NORMAL' | 'FAST';
}

export interface PlanResult {
  dailyCalories: number;
  date: string;
  carbs: number;
  protein: number;
  fat: number;
  targetWeight: number;
  currentWeight: number;
  height: number;
  age: number;
  gender: 'MALE' | 'FEMALE';
  activityLevel: 'SEDENTARY' | 'LIGHTLY_ACTIVE' | 'MODERATELY_ACTIVE' | 'VERY_ACTIVE';
  pace: 'SLOW' | 'NORMAL' | 'FAST';
  isGaining: boolean;
}

// 2. Update Interface kết quả BMI
export interface BMIResult {
  value: string;
  type: BMIType; // <-- Trả về Type để xử lý logic
  color: string;
  rawBmi: number;
}

export const calculatePlan = (data: PlanCalculationData): PlanResult => {
  // ... (Giữ nguyên logic calculatePlan cũ của bạn ở đây) ...
  // Để tiết kiệm không gian, mình không paste lại đoạn calculatePlan dài 
  // vì nó không thay đổi. Bạn giữ nguyên code cũ phần này nhé.
  
  // CODE CŨ CỦA BẠN Ở ĐÂY...
  const currentWeight = parseFloat(String(data.currentWeight)) || 0;
  const height = parseFloat(String(data.height)) || 0;
  const age = parseFloat(String(data.age)) || 0;
  const targetWeight = parseFloat(String(data.targetWeight)) || 0;

  if (!currentWeight || !height || !age || !targetWeight) {
    return {
      dailyCalories: 2000,
      date: new Date().toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }),
      carbs: 250,
      protein: 100,
      fat: 67,
      targetWeight: targetWeight || currentWeight,
      currentWeight: currentWeight || 70,
      height: height || 170,
      age: age || 25,
      gender: data.gender || 'MALE',
      activityLevel: data.activityLevel || 'MODERATELY_ACTIVE',
      pace: data.pace || 'NORMAL',
      isGaining: (targetWeight || 0) > (currentWeight || 0)
    };
  }

  let bmr = 10 * currentWeight + 6.25 * height - 5 * age;
  bmr += data.gender === 'MALE' ? 5 : -161;

  const multipliers: Record<string, number> = {
    SEDENTARY: 1.2,
    LIGHTLY_ACTIVE: 1.375,
    MODERATELY_ACTIVE: 1.55,
    VERY_ACTIVE: 1.725,
  };
  const activityMultiplier = multipliers[data.activityLevel] || 1.375;
  const tdee = Math.round(bmr * activityMultiplier);

  const isGaining = targetWeight > currentWeight;
  const paceCal: Record<string, number> = { 
    SLOW: 250, NORMAL: 500, FAST: 1000 
  };
  const adjustment = paceCal[data.pace] || 500;
  const dailyCalories = isGaining ? tdee + adjustment : tdee - adjustment;
  const minCalories = data.gender === 'MALE' ? 1500 : 1200;
  const finalCalories = Math.max(dailyCalories, minCalories);

  const diff = Math.abs(targetWeight - currentWeight);
  const rate: Record<string, number> = { SLOW: 0.25, NORMAL: 0.5, FAST: 1.0 };
  const weeklyRate = rate[data.pace] || 0.5;
  const weeksNeeded = diff / weeklyRate;
  
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + Math.round(weeksNeeded * 7));

  const carbs = Math.round((finalCalories * 0.5) / 4);
  const protein = Math.round((finalCalories * 0.2) / 4);
  const fat = Math.round((finalCalories * 0.3) / 9);

  return {
    dailyCalories: Math.round(finalCalories),
    date: estimatedDate.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }),
    carbs,
    protein,
    fat,
    targetWeight,
    currentWeight,
    height,
    age,
    gender: data.gender,
    activityLevel: data.activityLevel,
    pace: data.pace,
    isGaining
  };
};

// --- LOGIC TÍNH BMI MỚI (Trả về TYPE) ---
export const calculateBMI = (weight: number | string, heightCm: number | string): BMIResult | null => {
  const w = parseFloat(String(weight));
  const h = parseFloat(String(heightCm));

  if (!w || !h || w <= 0 || h <= 0) return null;

  const heightInM = h / 100;
  const bmi = w / (heightInM * heightInM);
  
  let type: BMIType;
  let color = '';

  if (bmi < 18.5) {
    type = 'UNDERWEIGHT';
    color = "#FFB300"; // Orange
  } else if (bmi < 24.9) {
    type = 'NORMAL';
    color = "#4CAF50"; // Green
  } else if (bmi < 29.9) {
    type = 'OVERWEIGHT';
    color = "#FF9800"; // Dark Orange
  } else {
    type = 'OBESE';
    color = "#F44336"; // Red
  }

  return {
    value: bmi.toFixed(1),
    type,
    color,
    rawBmi: bmi
  };
};