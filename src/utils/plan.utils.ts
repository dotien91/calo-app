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
  isGaining: boolean;
}

export const calculatePlan = (data: PlanCalculationData): PlanResult => {
  const currentWeight = parseFloat(String(data.currentWeight)) || 0;
  const height = parseFloat(String(data.height)) || 0;
  const age = parseFloat(String(data.age)) || 0;
  const targetWeight = parseFloat(String(data.targetWeight)) || 0;

  // 1. Tính BMR (Mifflin-St Jeor)
  // Nam: +5, Nữ: -161
  let bmr = 10 * currentWeight + 6.25 * height - 5 * age;
  bmr += data.gender === 'MALE' ? 5 : -161;

  // 2. TDEE Multiplier
  const multipliers: Record<string, number> = {
    SEDENTARY: 1.2,
    LIGHTLY_ACTIVE: 1.375,
    MODERATELY_ACTIVE: 1.55,
    VERY_ACTIVE: 1.725,
  };
  const activityMultiplier = multipliers[data.activityLevel] || 1.375;
  const tdee = Math.round(bmr * activityMultiplier);

  // 3. Tính Calories mục tiêu (Tăng/Giảm)
  const isGaining = targetWeight > currentWeight;
  const paceCal: Record<string, number> = { SLOW: 250, NORMAL: 500, FAST: 1000 };
  const adjustment = paceCal[data.pace] || 500;
  
  // Nếu Tăng cân -> Cộng thêm, Giảm cân -> Trừ đi
  const dailyCalories = isGaining ? tdee + adjustment : tdee - adjustment;

  // 4. Tính ngày hoàn thành
  const diff = Math.abs(targetWeight - currentWeight);
  const rate: Record<string, number> = { SLOW: 0.25, NORMAL: 0.5, FAST: 1.0 }; // kg/tuần
  const weeksNeeded = diff / (rate[data.pace] || 0.5);
  
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + Math.round(weeksNeeded * 7));

  // 5. Chia Macros (50% Carb - 20% Protein - 30% Fat)
  // 1g Carb = 4kcal, 1g Pro = 4kcal, 1g Fat = 9kcal
  return {
    dailyCalories: Math.round(dailyCalories),
    date: estimatedDate.toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }),
    carbs: Math.round((dailyCalories * 0.5) / 4),
    protein: Math.round((dailyCalories * 0.2) / 4),
    fat: Math.round((dailyCalories * 0.3) / 9),
    targetWeight,
    currentWeight,
    isGaining
  };
};
