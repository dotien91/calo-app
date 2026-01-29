import * as React from "react";
import { Platform } from "react-native";
import { PhotoFile } from "react-native-vision-camera"; // Import type từ thư viện Camera

// 1. SERVICES & HELPERS
import { analysisFoodImage } from "@services/api/post.api";
import { selectMedia } from "@helpers/file.helper"; // Helper chọn ảnh thư viện có sẵn của bạn
import { showToast } from "@helpers/super.modal.helper";
import { translations } from "@localization";

const isIos = Platform.OS === "ios";

// --- TYPES DEFINITION ---
export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

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

// Interface chuẩn hóa file trước khi upload
interface NormalizedFile {
  uri: string;
  name: string;
  type: string;
}

export function useAnalysisImageFood(selectionLimit = 1) {
  // --- STATE ---
  const [image, setImage] = React.useState<any | null>(null);
  const [analysisResult, setAnalysisResult] = React.useState<FoodAnalysisResult | null>(null);
  const [status, setStatus] = React.useState<UploadStatus>('idle');

  /**
   * Helper: Xử lý URI để hiển thị lên UI (FastImage/Image)
   * iOS đôi khi gặp vấn đề hiển thị nếu URI local có prefix 'file://'
   */
  const getDisplayUri = (uri: string) => {
    if (isIos && uri.startsWith("file://")) {
      return uri.replace("file://", "");
    }
    return uri;
  };

  /**
   * 🟢 CORE FUNCTION: XỬ LÝ UPLOAD VÀ GỌI API
   * Hàm này nhận đầu vào đã được chuẩn hóa, không quan tâm nguồn gốc ảnh (Cam hay Lib)
   */
  const _processAnalyze = async (fileData: NormalizedFile) => {
    // 1. Cập nhật UI ngay lập tức (Optimistic UI)
    setImage({
      uri: getDisplayUri(fileData.uri), // URI dùng để hiển thị
      name: fileData.name,
      type: fileData.type,
      isLocal: true 
    });
    setAnalysisResult(null);
    setStatus('uploading');

    try {
      // 2. Gọi API Phân tích
      // Lưu ý: FormData cần URI có 'file://' (đặc biệt trên Android), nên dùng uri gốc
      const res = await analysisFoodImage({
          name: fileData.name,
          uri: fileData.uri, 
          type: fileData.type,
      });

      console.log("🤖 AI Response:", res);

      // 3. Xử lý kết quả trả về
      if (!res.isError && res.data) {
        const data = res.data as FoodAnalysisResult;
        
        setAnalysisResult(data);
        
        // Nếu Server trả về link ảnh (đã qua xử lý/crop), cập nhật lại để hiển thị
        if (data.image_url) {
             setImage({ 
               uri: data.image_url, 
               name: data.food_name, 
               isLocal: false 
             });
        }
        
        setStatus('success');
      } else {
        // Xử lý lỗi logic từ Server
        setStatus('error');
        showToast({
          type: "error",
          message: translations.post.uploadImageFaild || "Không thể phân tích ảnh này.",
        });
      }

    } catch (error) {
      console.error("🔥 Upload Error:", error);
      setStatus('error');
      showToast({ type: "error", message: "Lỗi kết nối máy chủ." });
    }
  };

  /**
   * 📸 ACTION 1: CHỤP ẢNH TỪ CAMERA
   * Nhận input là PhotoFile từ react-native-vision-camera
   */
  const onTakePhoto = async (photo: PhotoFile) => {
    if (!photo) return;

    // VisionCamera trả về path (vd: /private/var/...), cần thêm protocol file:// để làm việc với FormData
    const rawPath = photo.path;
    const uri = rawPath.startsWith('file://') ? rawPath : `file://${rawPath}`;

    const fileData: NormalizedFile = {
      uri: uri,
      name: `cam_${Date.now()}.jpg`, // Tự sinh tên file
      type: 'image/jpeg',            // Ảnh từ camera luôn là jpeg/heic
    };

    // Gọi luồng xử lý chung
    await _processAnalyze(fileData);
  };

  /**
   * 🖼️ ACTION 2: CHỌN ẢNH TỪ THƯ VIỆN
   * Sử dụng helper selectMedia có sẵn
   */
 // ... (các đoạn code trên giữ nguyên)

 const onSelectPicture = async () => {
  selectMedia({
    config: { 
      mediaType: "photo", 
      selectionLimit: 1 
    },
    
    // 🔥 SỬA LẠI DÒNG NÀY:
    // Chuyển thành true để dùng lại thư viện "openPicker" cũ của bạn
    croping: true, 
    
    callback: async (assets: any[]) => {
      // Lưu ý: Thư viện crop-picker trả về object khác một chút, 
      // nhưng thường selectMedia của bạn đã chuẩn hóa thành array rồi.
      // Nếu assets trả về 1 object đơn lẻ (do thư viện crop), ta cần check:
      
      // Log ra xem data trả về là gì để chắc chắn
      console.log("Assets selected:", assets);

      let item;
      // Case 1: Helper trả về mảng (Logic cũ)
      if (Array.isArray(assets) && assets.length > 0) {
          item = assets[0];
      } 
      // Case 2: Helper trả về object đơn (Logic openPicker thường gặp)
      else if (assets && !Array.isArray(assets)) {
          item = assets; 
      }

      if (item) {
        // Logic mapping dữ liệu từ openPicker (thường key là path thay vì uri)
        const fileData = {
          uri: item.path || item.uri || "", // openPicker thường dùng .path
          name: item.filename || item.fileName || `lib_${Date.now()}.jpg`,
          type: item.mime || item.type || "image/jpeg",
        };

        await _processAnalyze(fileData);
      }
    },
    _finally: () => {
    }
  });
};

// ...

  // Reset trạng thái
  const clearImage = () => {
    setImage(null);
    setAnalysisResult(null);
    setStatus('idle');
  };

  return {
    // Data
    image,          // Object ảnh preview {uri, isLocal...}
    analysisResult, // Object kết quả dinh dưỡng từ API
    status,         // 'idle' | 'uploading' | 'success' | 'error'
    
    // Actions
    onSelectPicture, // Gắn vào nút thư viện
    onTakePhoto,     // Gắn vào nút chụp ảnh (truyền PhotoFile vào)
    clearImage,      // Gắn vào nút Back/Close
  };
}