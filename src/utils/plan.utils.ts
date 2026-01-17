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

export const calculatePlan = (data: PlanCalculationData): PlanResult => {
  // Parse và validate dữ liệu
  const currentWeight = parseFloat(String(data.currentWeight)) || 0;
  const height = parseFloat(String(data.height)) || 0;
  const age = parseFloat(String(data.age)) || 0;
  const targetWeight = parseFloat(String(data.targetWeight)) || 0;

  // Validate dữ liệu đầu vào
  if (!currentWeight || !height || !age || !targetWeight) {
    console.warn('Invalid input data:', { currentWeight, height, age, targetWeight });
    // Trả về giá trị mặc định nếu thiếu dữ liệu
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

  // 1. Tính BMR (Mifflin-St Jeor Equation)
  // Công thức: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(years) + gender_factor
  // Nam: +5, Nữ: -161
  let bmr = 10 * currentWeight + 6.25 * height - 5 * age;
  bmr += data.gender === 'MALE' ? 5 : -161;

  // 2. Tính TDEE (Total Daily Energy Expenditure) = BMR × Activity Multiplier
  const multipliers: Record<string, number> = {
    SEDENTARY: 1.2,
    LIGHTLY_ACTIVE: 1.375,
    MODERATELY_ACTIVE: 1.55,
    VERY_ACTIVE: 1.725,
  };
  const activityMultiplier = multipliers[data.activityLevel] || 1.375;
  const tdee = Math.round(bmr * activityMultiplier);

  // 3. Tính Calories mục tiêu dựa trên tốc độ thay đổi
  const isGaining = targetWeight > currentWeight;
  const paceCal: Record<string, number> = { 
    SLOW: 250,    // ±250 kcal/ngày = 0.25 kg/tuần
    NORMAL: 500,  // ±500 kcal/ngày = 0.5 kg/tuần
    FAST: 1000    // ±1000 kcal/ngày = 1 kg/tuần
  };
  const adjustment = paceCal[data.pace] || 500;
  
  // Nếu Tăng cân -> Cộng thêm calories, Giảm cân -> Trừ đi calories
  const dailyCalories = isGaining ? tdee + adjustment : tdee - adjustment;

  // Đảm bảo calories không quá thấp (tối thiểu 1200 kcal cho nữ, 1500 kcal cho nam)
  const minCalories = data.gender === 'MALE' ? 1500 : 1200;
  const finalCalories = Math.max(dailyCalories, minCalories);

  // 4. Tính ngày hoàn thành mục tiêu
  const diff = Math.abs(targetWeight - currentWeight);
  const rate: Record<string, number> = { 
    SLOW: 0.25,    // 0.25 kg/tuần
    NORMAL: 0.5,   // 0.5 kg/tuần
    FAST: 1.0      // 1 kg/tuần
  };
  const weeklyRate = rate[data.pace] || 0.5;
  const weeksNeeded = diff / weeklyRate;
  
  const estimatedDate = new Date();
  estimatedDate.setDate(estimatedDate.getDate() + Math.round(weeksNeeded * 7));

  // 5. Chia Macros theo tỷ lệ chuẩn: 50% Carb - 20% Protein - 30% Fat
  // 1g Carb = 4kcal, 1g Protein = 4kcal, 1g Fat = 9kcal
  const carbs = Math.round((finalCalories * 0.5) / 4);
  const protein = Math.round((finalCalories * 0.2) / 4);
  const fat = Math.round((finalCalories * 0.3) / 9);

  console.log('Plan calculation:', {
    currentWeight,
    height,
    age,
    targetWeight,
    gender: data.gender,
    activityLevel: data.activityLevel,
    pace: data.pace,
    bmr: Math.round(bmr),
    tdee,
    finalCalories,
    isGaining,
    weeksNeeded: Math.round(weeksNeeded * 10) / 10,
    carbs,
    protein,
    fat
  });

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
