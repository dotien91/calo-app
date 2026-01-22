/* eslint-disable camelcase */
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import AnimatedLottieView from "lottie-react-native";

import eventEmitter from "@services/event-emitter";
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
import { translations } from "@localization";
import SelectCourseView from "./modal-inner/SelectCourseView";
import ConfirmViewBottom from "@shared-components/comfirm-view-bottom/comfirm.view.bottom";
import ViewMore from "./modal-inner/ViewMore";
import SubscriptionView from "./modal-inner/SubscriptionView";

// Super modal help you create a modal with a title, a content and a button
// Usage:
// using normal one.
// example
// show loading
// showSuperModal({
//   contentModalType: EnumModalContentType.Loading,
//   styleModalType: EnumStyleModalType.Middle,
// })

// show report
// showSuperModal({
//   contentModalType: EnumModalContentType.Report,
//   styleModalType: EnumStyleModalType.Bottom,
//   data
// })

interface SuperModalProps {}

const SuperModal: React.FC<SuperModalProps> = () => {
  const [data, setData] = useState<any>();
  const [visible, setVisible] = useState(false);
  const [styleModalType, setStyleModalType] = useState<EnumStyleModalType | undefined>();
  const [contentModalType, setContentModalType] =
    useState<EnumModalContentType | undefined>();
  // const [contentModalType, setContentModalType] =
  //   useState<EnumModalContentType>(EnumModalContentType.SubscriptionView);
  // const [styleModalType, setStyleModalType] = useState<EnumStyleModalType>("middle");

  useEffect(() => {
    eventEmitter.on("show_super_modal", showModal);
    eventEmitter.on("close_super_modal", closeModal);
    return () => {
      eventEmitter.off("show_super_modal", showModal);
      eventEmitter.off("close_super_modal", closeModal);
    };
  }, []);

  // useEffect(() => {
  //   console.log({
  //     styleModalType,
  //     contentModalType,
  //   });
  // }, [styleModalType, contentModalType]);

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

  const getStyleModal = () => {
    switch (contentModalType) {
      case EnumModalContentType.Loading:
        return styles.loadingView;
      case EnumModalContentType.Library:
        return styles.modalMedia;
      default:
        return styles.modal;
    }
  };

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

  const renderConfirmView = () => {
    const showCancelBtn = !data?.hideCancelBtn;
    const linkLotties = !!data?.linkLotties;
    return (
      <View style={styles.modalInner}>
        <Text style={styles.title}>{data?.title}</Text>
        <Text style={styles.desc}>{data?.desc}</Text>
        <View style={styles.viewLotties}>
          {linkLotties && (
            <AnimatedLottieView
              source={data?.linkLotties}
              style={styles.lotties}
              loop
              speed={1.5}
              autoPlay
            />
          )}
        </View>
        <View style={CommonStyle.flexRear}>
          {showCancelBtn && (
            <TouchableOpacity
              style={[styles.btnStyle, { flex: 1 }]}
              onPress={closeModal}
            >
              <Text style={[styles.txtBtn, { color: palette.textOpacity6 }]}>
                {data?.textCancel || translations.cancel}
              </Text>
            </TouchableOpacity>
          )}
          {showCancelBtn && <View style={{ width: 10 }} />}
          <TouchableOpacity
            style={[
              styles.btnStyle,
              { backgroundColor: palette.primary, flex: 1 },
            ]}
            onPress={() => {
              if (data.cb) data.cb();
              closeModal();
            }}
          >
            <Text style={styles.txtBtn}>
              {data?.textApprove || translations.permissions.positive}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderConfirmEvaluationView = () => {
    const showCancelBtn = !data?.hideCancelBtn;
    const linkLotties = !!data?.linkLotties;
    return (
      <View style={styles.modalInner}>
        <Text style={styles.title}>{data?.title}</Text>
        <Text style={styles.desc}>{data?.desc}</Text>
        <View style={styles.viewLotties}>
          {linkLotties && (
            <AnimatedLottieView
              source={data?.linkLotties}
              style={styles.lotties}
              loop
              speed={1.5}
              autoPlay
            />
          )}
        </View>
        <View style={CommonStyle.flexRear}>
          {showCancelBtn && (
            <TouchableOpacity
              style={[styles.btnStyle, { flex: 1 }]}
              onPress={closeModal}
            >
              <Text style={[styles.txtBtn, { color: palette.textOpacity6 }]}>
                {data?.textCancel || translations.cancel}
              </Text>
            </TouchableOpacity>
          )}
          {showCancelBtn && <View style={{ width: 10 }} />}
          <TouchableOpacity
            style={[
              styles.btnStyle,
              { backgroundColor: palette.primary, flex: 1 },
            ]}
            onPress={() => {
              if (data.cb) data.cb();
              if (data.toEvaluation) data.toEvaluation();
              // closeModal();
            }}
          >
            <Text style={styles.txtBtn}>
              {data?.textApprove || translations.permissions.positive}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const renderContentModal = () => {
    return (
      <>
        {contentModalType == EnumModalContentType.Report && (
          <ReportView {...data} />
        )}
        {contentModalType == EnumModalContentType.PostAction && (
          <ListActionOfPost data={data} />
        )}
        {contentModalType == EnumModalContentType.CommentAction && (
          <ListActionOfComment data={data} />
        )}
        {contentModalType == EnumModalContentType.FilterTypeCourse && (
          <SelectBox {...data} />
        )}
        {contentModalType == EnumModalContentType.ListUser && (
          <ListUser {...data} />
        )}
        {contentModalType == EnumModalContentType.ConfirmBottom && (
          <ConfirmViewBottom {...data} closeModal={closeModal} />
        )}
        {contentModalType == EnumModalContentType.ListMoreAction && (
          <ListActionInner {...data} closeModal={closeModal} />
        )}
        {contentModalType == EnumModalContentType.TextInput && (
          <InputViewModal {...data} closeModal={closeModal} />
        )}
        {contentModalType == EnumModalContentType.CustomView &&
          data?.customView?.()}
        {contentModalType == EnumModalContentType.SearchBank && (
          <ListBank {...data} closeModal={closeModal} />
        )}
        {contentModalType == EnumModalContentType.FilterSortClub && (
          <SelectBox {...data} />
        )}
        {contentModalType == EnumModalContentType.LottieAnimation && (
          <EarnPointView {...data} />
        )}
        {contentModalType == EnumModalContentType.Confirm &&
          renderConfirmView()}
        {contentModalType == EnumModalContentType.ConfirmEvaluation &&
          renderConfirmEvaluationView()}
        {contentModalType == EnumModalContentType.Loading && renderLoading()}
        {contentModalType == EnumModalContentType.Library && (
          <ImageSlideShow {...data} closeModal={closeModal} />
        )}
        {contentModalType == EnumModalContentType.SelectCourse && (
          <SelectCourseView {...data} />
        )}
        {contentModalType == EnumModalContentType.ViewMore && (
          <ViewMore {...data} />
        )}
        {contentModalType == EnumModalContentType.SubscriptionView && (
          <SubscriptionView />
        )}
      </>
    );
  };

  if (styleModalType == EnumStyleModalType.Bottom) {
    return (
      <StickBottomModal
        isVisible={visible}
        onBackdropPress={closeModal}
        backdropOpacity={data?.backdropOpacity}
        animationIn="slideInUp"
        animationInTiming={200}
        animationOut="slideOutDown"
        animationOutTiming={200}
        {...({} as any)}
      >
        <View style={[styles.bottomInner, data?.style ? data.style : {}]}>
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
          {renderContentModal()}
        </View>
      </StickBottomModal>
    );
  }

  if (styleModalType == EnumStyleModalType.Full) {
    return (
      <StickBottomModal
        isVisible={visible}
        onBackdropPress={closeModal}
        animationIn="slideInUp"
        animationInTiming={200}
        animationOut="slideOutDown"
        animationOutTiming={200}
        {...({} as any)}
      >
        <View style={styles.fullModal}>
          {/* <View
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
          /> */}
          {renderContentModal()}
        </View>
      </StickBottomModal>
    );
  }

  if (styleModalType == EnumStyleModalType.Middle) {
    return (
      <Modal
        isVisible={visible}
        onBackdropPress={closeModal}
        propagateSwipe={true}
        style={getStyleModal()}
        backdropOpacity={
          contentModalType == EnumModalContentType.LottieAnimation
            ? 0
            : contentModalType == EnumModalContentType.Loading
            ? 0.1
            : 0.6
        }
      >
        {renderContentModal()}
      </Modal>
    );
  }
  
  return null;
};

const styles = StyleSheet.create({
  modal: {
    ...CommonStyle.flexCenter,
    // backgroundColor: palette.white,
  },
  bottomInner: {
    // ...CommonStyle.flex1,
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
  fullModal: {
    // ...CommonStyle.flex1,
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
    // backgroundColor: palette.whiteOverlay
  },
  chatView: {
    ...CommonStyle.flex1,
    margin: 0,
    minHeight: 300,
    // backgroundColor: palette.whiteOverlay
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
