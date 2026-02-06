import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import AnimatedLottieView from "lottie-react-native";

import eventEmitter from "@services/event-emitter";
import useStore from "@services/zustand/store";
import { palette } from "@theme/themes";
import {
  EnumModalContentType,
  EnumStyleModalType,
  IShowModalParams,
} from "@helpers/super.modal.helper";
import CommonStyle from "@theme/styles";

import ImageSlideShow from "@shared-components/image-slideshow/ImageSlideshow";
import ListActionOfPost from "@shared-components/action-bottomsheet/ListActionOfPost";
import ListActionOfComment from "@shared-components/action-bottomsheet/ListActionOfComment";
import StickBottomModal from "@shared-components/stick-bottom/StickBottomModal";

import ReportView from "./modal-inner/ReportView";
import IconBtn from "@shared-components/button/IconBtn";
import SelectBox from "@shared-components/modal/modal-inner/SelectBox";
import LottieComponent from "@shared-components/lottie/LottieComponent";
import ListUser from "./modal-inner/ListUser";
import InputViewModal from "@shared-components/input-modal/input.modal";
import ListActionInner from "./modal-inner/ListActionInner";
import EarnPointView from "./modal-inner/EarnPointView";
import ListBank from "./modal-inner/ListBank";
import { ScreenHeight } from "@freakycoder/react-native-helpers";
import SelectCourseView from "./modal-inner/SelectCourseView";
import ConfirmViewBottom from "@shared-components/comfirm-view-bottom/comfirm.view.bottom";
import ViewMore from "./modal-inner/ViewMore";
import SubscriptionView from "./modal-inner/SubscriptionView";
import QuickActionMenu from "./modal-inner/QuickActionMenu";
import ChooseLanguageView from "./modal-inner/ChooseLanguageView";
import CalendarPickerView from "./modal-inner/CalendarPickerView";

interface SuperModalProps {}

const SuperModal: React.FC<SuperModalProps> = () => {
  const isLightMode = useStore((state) => state.isLightMode);
  const [data, setData] = useState<any>();
  const [visible, setVisible] = useState(false);
  const [styleModalType, setStyleModalType] = useState<EnumStyleModalType | undefined>();
  const [contentModalType, setContentModalType] = useState<EnumModalContentType | undefined>();

  useEffect(() => {
    eventEmitter.on("show_super_modal", showModal);
    eventEmitter.on("close_super_modal", closeModal);
    return () => {
      eventEmitter.off("show_super_modal", showModal);
      eventEmitter.off("close_super_modal", closeModal);
    };
  }, []);

  const showModal = ({
    contentModalType,
    styleModalType,
    data,
  }: IShowModalParams) => {
    setVisible(true);
    setData(data);
    setStyleModalType(styleModalType);
    setContentModalType(contentModalType);
  };

  useEffect(() => {
    if (!visible) {
      setTimeout(() => {
        setStyleModalType(undefined);
        setContentModalType(undefined);
      }, 300);
    }
  }, [visible]);

  const closeModal = () => {
    setVisible(false);
  };

  if (!contentModalType || !styleModalType) return null;

  const renderLoading = () => {
    return (
      <LottieComponent
        resizeMode="contain"
        height={120}
        customStyle={{}}
        lottieJson={require("../../../assets/lotties/loading-circle.json")}
      />
    );
  };

  // ... (Giữ nguyên các hàm renderConfirmView, renderConfirmEvaluationView) ...
  const renderConfirmView = () => {
      // (Code cũ giữ nguyên để tiết kiệm không gian hiển thị)
      return <View />; 
  };
  const renderConfirmEvaluationView = () => {
      // (Code cũ giữ nguyên)
      return <View />;
  };
  
  const renderContentModal = () => {
    return (
      <>
        {contentModalType == EnumModalContentType.Report && <ReportView {...data} />}
        {contentModalType == EnumModalContentType.PostAction && <ListActionOfPost data={data} />}
        {contentModalType == EnumModalContentType.CommentAction && <ListActionOfComment data={data} />}
        {contentModalType == EnumModalContentType.FilterTypeCourse && <SelectBox {...data} />}
        {contentModalType == EnumModalContentType.ListUser && <ListUser {...data} />}
        {contentModalType == EnumModalContentType.ConfirmBottom && <ConfirmViewBottom {...data} closeModal={closeModal} />}
        {contentModalType == EnumModalContentType.ListMoreAction && <ListActionInner {...data} closeModal={closeModal} />}
        {contentModalType == EnumModalContentType.TextInput && <InputViewModal {...data} closeModal={closeModal} />}
        {contentModalType == EnumModalContentType.CustomView && data?.customView?.()}
        {contentModalType == EnumModalContentType.SearchBank && <ListBank {...data} closeModal={closeModal} />}
        {contentModalType == EnumModalContentType.FilterSortClub && <SelectBox {...data} />}
        {contentModalType == EnumModalContentType.LottieAnimation && <EarnPointView {...data} />}
        {contentModalType == EnumModalContentType.Confirm && renderConfirmView()}
        {contentModalType == EnumModalContentType.ConfirmEvaluation && renderConfirmEvaluationView()}
        {contentModalType == EnumModalContentType.Loading && renderLoading()}
        {contentModalType == EnumModalContentType.Library && <ImageSlideShow {...data} closeModal={closeModal} />}
        {contentModalType == EnumModalContentType.SelectCourse && <SelectCourseView {...data} />}
        {contentModalType == EnumModalContentType.ViewMore && <ViewMore {...data} />}
        {contentModalType == EnumModalContentType.SubscriptionView && <SubscriptionView />}
        
        {/* Render QuickActionMenu */}
        {contentModalType == EnumModalContentType.QuickActionMenu && (
          <QuickActionMenu onClose={closeModal} onNavigate={data?.onNavigate} />
        )}
        {/* Render Choose Language (bottom sheet) */}
        {contentModalType == EnumModalContentType.ChooseLanguage && (
          <ChooseLanguageView closeModal={closeModal} />
        )}
        {/* Render Calendar Picker */}
        {contentModalType == EnumModalContentType.CalendarPicker && (
          <CalendarPickerView
            selectedDate={data?.selectedDate ?? new Date()}
            onDateSelect={(date: Date) => {
              try {
                data?.onDateSelect?.(date);
              } finally {
                closeModal();
              }
            }}
            style={data?.calendarStyle}
          />
        )}
      </>
    );
  };

  // --- XỬ LÝ BOTTOM MODAL ---
  if (styleModalType == EnumStyleModalType.Bottom) {
    const isQuickAction = contentModalType === EnumModalContentType.QuickActionMenu;
    const isChooseLanguage = contentModalType === EnumModalContentType.ChooseLanguage;
    const bottomBg = !isQuickAction && isChooseLanguage && !isLightMode ? "#000000" : undefined;

    return (
      <StickBottomModal
        isVisible={visible}
        onBackdropPress={closeModal}
        backdropOpacity={data?.backdropOpacity}
        animationIn="slideInUp"
        animationInTiming={200}
        animationOut="slideOutDown"
        animationOutTiming={200}
        // [STYLE RIÊNG 1] Loại bỏ margin mặc định của modal để nó sát cạnh màn hình
        style={isQuickAction ? styles.quickActionModal : undefined}
        {...({} as any)}
      >
        <View 
          style={[
            // [STYLE RIÊNG 2] Chọn style nội dung dựa trên loại modal
            isQuickAction ? styles.quickActionInner : styles.bottomInner, 
            data?.style ? data.style : {}
          ]}
        >
          {/* Chỉ hiện nút X và thanh ngang nếu KHÔNG PHẢI là QuickAction */}
          {!isQuickAction && (
            <>
              {!data?.hideCloseIcon && (
                <IconBtn
                  onPress={closeModal}
                  name={"x"}
                  size={32}
                  customStyle={styles.closeIcon}
                />
              )}
              <View
                style={{
                  height: 4,
                  width: 32,
                  borderRadius: 99,
                  backgroundColor: palette.grey3,
                  position: "absolute",
                  left: "50%",
                  marginRight: 16,
                  top: 8,
                }}
              />
            </>
          )}
          
          {renderContentModal()}
        </View>
      </StickBottomModal>
    );
  }

  // ... (Giữ nguyên logic Full và Middle) ...
  if (styleModalType == EnumStyleModalType.Full) {
     // ...
     return null;
  }
  if (styleModalType == EnumStyleModalType.Middle) {
    return (
      <Modal
        isVisible={visible}
        onBackdropPress={closeModal}
        onBackButtonPress={closeModal}
        backdropOpacity={data?.backdropOpacity ?? 0.5}
        animationIn="zoomIn"
        animationOut="zoomOut"
        animationInTiming={160}
        animationOutTiming={160}
        style={styles.modal}
      >
        <View style={[styles.modalInner, data?.style ? data.style : {}]}>
          {renderContentModal()}
        </View>
      </Modal>
    );
  }
  
  return null;
};

const styles = StyleSheet.create({
  modal: {
    ...CommonStyle.flexCenter,
  },
  // --- STYLE MẶC ĐỊNH CHO BOTTOM SHEET ---
  bottomInner: {
    backgroundColor: palette.white,
    paddingHorizontal: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 16,
    maxHeight: (ScreenHeight / 5) * 4,
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
  },
  
  // --- STYLE RIÊNG CHO QUICK ACTION MENU ---
  
  // 1. Style cho container Modal (loại bỏ margin)
  quickActionModal: {
    margin: 0, // Quan trọng: Để modal tràn hết màn hình
    justifyContent: 'flex-end', // Đẩy nội dung xuống đáy
  },

  // 2. Style cho nội dung bên trong (Trong suốt, dính đáy)
  quickActionInner: {
    backgroundColor: 'transparent', // Nền trong suốt
    width: '100%',
    position: 'absolute', // Neo tuyệt đối
    bottom: 0,            // Dính sát đáy
    paddingBottom: 0,     // Reset padding
    alignItems: 'center', // Căn giữa nội dung ngang
  },

  // ... (Các style khác giữ nguyên)
  fullModal: {
    backgroundColor: palette.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 16,
    height: ScreenHeight,
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
  },
  modalMedia: {
    ...CommonStyle.flexCenter,
    margin: 0,
  },
  loadingView: {
    ...CommonStyle.flex1,
    margin: 0,
  },
  modalInner: {
    minWidth: "70%",
    backgroundColor: palette.white,
    borderRadius: 6,
    padding: 16,
    overflow: "hidden",
  },
  btnStyle: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: palette.btnInactive2,
    borderRadius: 8,
    ...CommonStyle.flexCenter,
  },
  txtBtn: {
    ...CommonStyle.hnSemiBold,
    fontSize: 16,
    color: palette.white,
  },
  title: {
    ...CommonStyle.hnSemiBold,
    fontSize: 20,
    color: palette.text,
    textAlign: "center",
  },
  desc: {
    ...CommonStyle.hnRegular,
    fontSize: 14,
    color: palette.text,
    textAlign: "center",
    marginBottom: 24,
  },
  closeIcon: {
    position: "absolute",
    left: 14,
    top: 24,
    zIndex: 1,
  },
  viewLotties: {
    width: "100%",
    ...CommonStyle.center,
  },
  lotties: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
});

export default React.memo(SuperModal);