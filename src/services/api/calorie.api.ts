import request, { METHOD } from "./api";

/**
 * Enums for Onboarding
 */
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export enum ActivityLevel {
  SEDENTARY = "SEDENTARY",
  LIGHTLY_ACTIVE = "LIGHTLY_ACTIVE",
  MODERATELY_ACTIVE = "MODERATELY_ACTIVE",
  VERY_ACTIVE = "VERY_ACTIVE",
  EXTREMELY_ACTIVE = "EXTREMELY_ACTIVE",
}

export enum WeightGoalPace {
  SLOW = "SLOW",
  NORMAL = "NORMAL",
  FAST = "FAST",
}

/**
 * Interface for Onboarding Data
 */
export interface OnboardingData {
  gender: Gender;
  age: number;
  height: number;
  currentWeight: number;
  targetWeight: number;
  activityLevel: ActivityLevel;
  pace: WeightGoalPace;
}

/**
 * Interface for Onboarding Response
 */
export interface OnboardingResponse {
  success: boolean;
  message: string;
  data: {
    onboarding: {
      _id: string;
      user_id: string;
      gender: string;
      age: number;
      height: number;
      current_weight: number;
      target_weight: number;
      activity_level: string;
      weight_goal_pace: string;
      bmr: number;
      tdee: number;
      target_calories: number;
      target_protein: number;
      target_carbs: number;
      target_fat: number;
      diet_type?: string | null;
      target_steps?: number | null;
      target_water?: number | null;
      weeks_to_goal: number;
      estimated_completion_date: string;
      createdAt: number;
      updatedAt: number;
    };
    plan: {
      bmr: number;
      tdee: number;
      daily_calories: number;
      macros: {
        protein_g: number;
        carbs_g: number;
        fat_g: number;
        protein_percent: number;
        carbs_percent: number;
        fat_percent: number;
      };
      weeks_to_goal: number;
      estimated_date: string;
    };
  };
}

/**
 * Interface for Getting Onboarding Response
 */
export interface GetOnboardingResponse {
  success: boolean;
  data: {
    _id: string;
    user_id: string;
    gender: string;
    age: number;
    height: number;
    current_weight: number;
    target_weight: number;
    activity_level: string;
    weight_goal_pace: string;
    bmr: number;
    tdee: number;
    target_calories: number;
    target_protein: number;
    target_carbs: number;
    target_fat: number;
    diet_type?: string | null;
    target_steps?: number | null;
    target_water?: number | null;
    weeks_to_goal: number;
    estimated_completion_date: string;
    createdAt: number;
    updatedAt: number;
  };
}

/**
 * Update Onboarding Goals (diet_type, target_steps, target_water)
 */
export interface UpdateOnboardingGoalsData {
  diet_type?: string;
  target_steps?: number;
  target_water?: number;
}

/**
 * Submit onboarding data and calculate calorie plan
 * @param data OnboardingData
 * @returns OnboardingResponse
 */
export async function submitOnboarding(
  data: OnboardingData
): Promise<OnboardingResponse> {
  return request({
    method: METHOD.POST,
    urlPath: "calorie/onboarding",
    data,
  }).then((response: any) => {
    return response;
  });
}

/**
 * Get user's onboarding data
 * @returns GetOnboardingResponse
 */
export async function getOnboarding(): Promise<GetOnboardingResponse> {
  return request({
    method: METHOD.GET,
    urlPath: "calorie/onboarding",
  }).then((response: any) => {
    return response;
  });
}

/**
 * Update onboarding goals (diet_type, target_steps, target_water)
 * @param data UpdateOnboardingGoalsData
 * @returns GetOnboardingResponse
 */
export async function updateOnboardingGoals(
  data: UpdateOnboardingGoalsData
): Promise<GetOnboardingResponse> {
  return request({
    method: METHOD.PATCH,
    urlPath: "calorie/onboarding",
    data,
  }).then((response: any) => {
    return response;
  });
}

/**
 * Analyze food image for calorie tracking
 * @param file Image file
 * @param country Optional country for context
 * @returns Analysis result
 */
export async function analyzeFoodImage(
  file: any,
  country?: string
): Promise<any> {
  const formData = new FormData();
  formData.append("image", file);
  
  return request({
    method: METHOD.POST,
    urlPath: `calorie/analyze${country ? `?country=${country}` : ""}`,
    data: formData,
    customHeader: {
      "Content-Type": "multipart/form-data",
    } as any,
  }).then((response: any) => {
     if (response.isError) throw response;
    return response.data;
  });
}

/**
 * Create manual calorie entry
 * @param data Manual calorie data
 * @returns Created entry
 */
export async function createManualCalorie(data: {
  food_name?: string;
  image_url?: string;
  total_weight: number;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  ingredients?: Array<{
    name: string;
    weight: number;
    unit?: "g" | "ml";
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
  }>;
}): Promise<any> {
  return request({
    method: METHOD.POST,
    urlPath: "calorie/manual",
    data,
  }).then((response: any) => {
     if (response.isError) throw response;
    return response.data;
  });
}

/**
 * Get calorie analysis list
 * @param params Query parameters
 * @returns List of calorie analysis
 */
export async function getCalorieList(params?: {
  page?: number;
  limit?: number;
  date_from?: string;
  date_to?: string;
}): Promise<any> {
  return request({
    method: METHOD.GET,
    urlPath: "calorie/list",
    params,
  }).then((response: any) => {
     if (response.isError) throw response;
    return response.data;
  });
}

/**
 * Get calorie analysis detail
 * @param id Analysis ID
 * @returns Analysis detail
 */
export async function getCalorieDetail(id: string): Promise<any> {
  return request({
    method: METHOD.GET,
    urlPath: `calorie/detail/${id}`,
  }).then((response: any) => {
     if (response.isError) throw response;
    return response.data;
  });
}

/**
 * Delete calorie analysis
 * @param id Analysis ID
 * @returns Delete result
 */
export async function deleteCalorie(id: string): Promise<any> {
  return request({
    method: METHOD.DELETE,
    urlPath: `calorie/delete/${id}`,
  }).then((response: any) => {
     if (response.isError) throw response;
    return response.data;
  });
}

/**
 * Get calorie statistics
 * @param params Query parameters
 * @returns Statistics data
 */
export async function getCalorieStats(params?: {
  date_from?: string;
  date_to?: string;
}): Promise<any> {
  return request({
    method: METHOD.GET,
    urlPath: "calorie/stats",
    params,
  }).then((response: any) => {
     if (response.isError) throw response;
    return response.data;
  });
}

/**
 * Get calorie data for a specific day (defaults to today)
 * @param date YYYY-MM-DD
 * @returns { records: any[], totals: { calories, protein, carbs, fat, meals } }
 */
export async function getCalorieDay(date?: string): Promise<any> {
  return request({
    method: METHOD.GET,
    urlPath: `calorie/day${date ? `?date=${date}` : ""}`,
  }).then((response: any) => {
     if (response.isError) throw response;
    // New backend returns { week: [...] }
    if (response.data && response.data.week) return response.data;
    return response.data;
  });
}
