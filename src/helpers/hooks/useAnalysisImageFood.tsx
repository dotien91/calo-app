import { analysisFoodImage } from "@services/api/post.api";
import * as React from "react";
import { Platform } from "react-native";
import { selectMedia } from "@helpers/file.helper";
import { showToast } from "@helpers/super.modal.helper";
import { translations } from "@localization";

const isIos = Platform.OS === "ios";

export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

// 1. Định nghĩa Type cho dữ liệu trả về từ AI
export interface Ingredient {
  name: string;
  weight: number;
  unit: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

export interface FoodAnalysisResult {
  food_name: string;
  health_score: number;
  health_reason: string;
  total_weight: number;
  total_calories: number;
  total_carbs: number;
  total_protein: number;
  total_fat: number;
  ingredients: Ingredient[];
  image_url: string;
}

export function useAnalysisImageFood(selectionLimit = 1) {
  const [image, setImage] = React.useState<any | null>(null);
  // Thêm state để lưu kết quả phân tích
  const [analysisResult, setAnalysisResult] = React.useState<FoodAnalysisResult | null>(null);
  const [status, setStatus] = React.useState<UploadStatus>('idle');

  const getFileName = (i: any) => {
    return i.fileName || i.name || (i.uri || "")?.split("/")?.reverse()?.[0] || "";
  };

  const getLinkUri = (i: any) => {
    if (i.src) return i.src;
    if (isIos) {
      return i.uri?.replace("file://", "");
    }
    return i.uri;
  };

  const onSelectPicture = async () => {
    selectMedia({
      config: { 
        mediaType: "photo", 
        selectionLimit: 1 
      },
      callback: async (images: any) => {
        if (!images?.[0]) return;
        
        const imageObj = images[0];
        
        const fileData = {
          uri: imageObj.uri || "",
          fileName: imageObj.name || "",
          type: imageObj.type || "",
        };

        // Ảnh local (Preview tạm thời trong lúc upload)
        const localImage = {
          uri: getLinkUri(fileData),
          type: fileData.type,
          name: getFileName(fileData),
          isLocal: true 
        };
        
        setImage(localImage);
        setAnalysisResult(null); // Reset kết quả cũ
        setStatus('uploading');

        try {
            // Gọi API phân tích
            const res = await analysisFoodImage({
                name: localImage.name,
                uri: localImage.uri,
                type: localImage.type,
            });

            console.log("Server Response:", res); 

            // --- XỬ LÝ DATA TRẢ VỀ TỪ AI ---
            if (!res.isError && res.data) {
              const data = res.data as FoodAnalysisResult;
              
              // 1. Lưu toàn bộ dữ liệu phân tích
              setAnalysisResult(data);

              // 2. Cập nhật lại ảnh từ URL server trả về (để đảm bảo ảnh chuẩn)
              const remoteImage = {
                uri: data.image_url, // Lấy từ field image_url trong JSON
                name: data.food_name,
                isLocal: false
              };
              
              console.log("Analysis Success:", data.food_name);
              
              setImage(remoteImage);
              setStatus('success');
            } else {
              console.log("Analysis failed response:", res);
              setStatus('error');
              showToast({
                type: "error",
                message: translations.post.uploadImageFaild || "Không thể phân tích ảnh",
              });
            }
            // --------------------------------------

        } catch (error) {
            console.error("Analysis Error:", error);
            setStatus('error');
            showToast({ type: "error", message: "Error analyzing image" });
        }
      },
      croping: false,
      _finally: () => {
      }
    });
  };

  const clearImage = () => {
    setImage(null);
    setAnalysisResult(null);
    setStatus('idle');
  };

  return {
    image,      // Object ảnh (uri, name...)
    analysisResult, // Object chứa data dinh dưỡng (calories, ingredients...)
    setImage,
    status,
    onSelectPicture,
    clearImage,
  };
}