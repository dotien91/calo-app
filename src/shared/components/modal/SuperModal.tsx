/* eslint-disable camelcase */
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

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
import CourseFilterModalInnter from "@screens/course-tab/components/course.filter.modal.inner";
import IconBtn from "@shared-components/button/IconBtn";
import SelectBox from "@shared-components/modal/modal-inner/SelectBox";
import LottieComponent from "@shared-components/lottie/LottieComponent";
import ActionMore from "@screens/course/detail-teacher/components/ActionMore";
import ChatRoomClass from "@screens/chat/room-chat/chat.room.class.video";
import ListUser from "./modal-inner/ListUser";
import PopupCreateLesson from "@screens/course/course-create/components/PartViewCreate/popup.create.lesson";
import ConfirmViewBottom from "@shared-components/comfirm-view-bottom/comfirm.view.bottom";
import InputViewModal from "@shared-components/input-modal/input.modal";
import ListActionInner from "./modal-inner/ListActionInner";
import GamificationView from "./modal-inner/GamificationView";
import EarnPointView from "./modal-inner/EarnPointView";
import ListCourseLiveStream from "@screens/stream/stream-modal/stream.modal.list.course";
import FilterAffiliate from "@screens/affiliate/components/FilterAffiliate";
import ListBank from "./modal-inner/ListBank";
import SelectRadioButton from "@screens/code-activations/select.radio.button";
import ReferralPopup from "@screens/profile.screen/referral.popup";
import TeacherClassModalInner from "@screens/teacher-courses/teacher.class.modal.inner";
import { ScreenHeight } from "@freakycoder/react-native-helpers";
import PopupCourseDetail from "@screens/course/course-preview/components/popup.more";
import PopupCoupon from "@screens/course/course-preview/components/popup.coupon";
import ReferralPopupTask from "@shared-components/task-item/task.referral.popup";
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
  const [data, setData] = useState();
  const [visible, setVisible] = useState(true);
  const [styleModalType, setStyleModalType] = useState<EnumStyleModalType>();
  const [contentModalType, setContentModalType] =
    useState<EnumModalContentType>();
  // const [contentModalType, setContentModalType] =
  //   useState<EnumModalContentType>(EnumModalContentType.ListCourse);
  //   const [styleModalType, setStyleModalType] = useState<EnumStyleModalType>("middle");

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
        setStyleModalType("");
        setContentModalType("");
      }, 300);
    }
  }, [visible]);

  const closeModal = () => {
    setVisible(false);
  };

  if (!contentModalType || !styleModalType) return null;

  const getStyleModal = () => {
    switch (contentModalType) {
      case EnumModalContentType.ChatRoom:
        return styles.chatView;
      case EnumModalContentType.Loading:
        return styles.loadingView;
        break;
      case EnumModalContentType.Library:
        return styles.modalMedia;
        break;
      default:
        return styles.modal;
        break;
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
    return (
      <View style={styles.modalInner}>
        <Text style={styles.title}>{data?.title}</Text>
        <Text style={styles.desc}>{data?.desc}</Text>
        <View style={CommonStyle.flexRear}>
          <TouchableOpacity
            style={[styles.btnStyle, { flex: 1 }]}
            onPress={closeModal}
          >
            <Text style={[styles.txtBtn, { color: palette.textOpacity6 }]}>
              {data.textCancel || "Cancel"}
            </Text>
          </TouchableOpacity>
          <View style={{ width: 10 }} />
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
            <Text style={styles.txtBtn}>{data.textApprove || "Ok"}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (styleModalType == EnumStyleModalType.Bottom) {
    return (
      <StickBottomModal
        isVisible={visible}
        onBackdropPress={closeModal}
        // swipeDirection={["down"]}
        // onSwipeComplete={closeModal}
      >
        <View style={styles.bottomInner}>
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
          {contentModalType == EnumModalContentType.Report && (
            <ReportView {...data} />
          )}
          {contentModalType == EnumModalContentType.PostAction && (
            <ListActionOfPost data={data} />
          )}
          {contentModalType == EnumModalContentType.CommentAction && (
            <ListActionOfComment data={data} />
          )}
          {contentModalType == EnumModalContentType.FilterListCourse && (
            <CourseFilterModalInnter {...data} />
          )}
          {contentModalType == EnumModalContentType.FilterTypeCourse && (
            <SelectBox {...data} />
          )}
          {contentModalType == EnumModalContentType.MoreTeacher && (
            <ActionMore data={data} />
          )}
          {contentModalType == EnumModalContentType.ChatRoom && (
            <ChatRoomClass {...data} />
          )}
          {contentModalType == EnumModalContentType.ListUser && (
            <ListUser {...data} />
          )}
          {contentModalType == EnumModalContentType.AddLesson && (
            <PopupCreateLesson {...data} />
          )}
          {contentModalType == EnumModalContentType.Confirm && (
            <ConfirmViewBottom {...data} closeModal={closeModal} />
          )}
          {contentModalType == EnumModalContentType.ListMoreAction && (
            <ListActionInner {...data} closeModal={closeModal} />
          )}
          {contentModalType == EnumModalContentType.TextInput && (
            <InputViewModal {...data} closeModal={closeModal} />
          )}
          {contentModalType == EnumModalContentType.GamificationView && (
            <GamificationView {...data} closeModal={closeModal} />
          )}
          {contentModalType == EnumModalContentType.CustomView &&
            data.customView()}
          {contentModalType == EnumModalContentType.ListCourse && (
            <ListCourseLiveStream {...data} />
          )}
          {contentModalType == EnumModalContentType.FilterAffiliate && (
            <FilterAffiliate data={data} />
          )}
          {contentModalType == EnumModalContentType.SearchBank && (
            <ListBank {...data} closeModal={closeModal} />
          )}
          {contentModalType == EnumModalContentType.SelectSort && (
            <SelectRadioButton data={data} />
          )}
          {contentModalType == EnumModalContentType.Referral && (
            <ReferralPopup data={data} />
          )}
          {contentModalType == EnumModalContentType.TeacherClass && (
            <TeacherClassModalInner {...data} />
          )}
          {contentModalType == EnumModalContentType.MoreCourse && (
            <PopupCourseDetail {...data} />
          )}
          {contentModalType == EnumModalContentType.AddCouponToCourse && (
            <PopupCoupon {...data} />
          )}
          {contentModalType == EnumModalContentType.RefferralTask && (
            <ReferralPopupTask data={data} />
          )}
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
        {contentModalType == EnumModalContentType.LottieAnimation && (
          <EarnPointView {...data} />
        )}
        {contentModalType == EnumModalContentType.Confirm &&
          renderConfirmView()}
        {contentModalType == EnumModalContentType.Loading && renderLoading()}
        {contentModalType == EnumModalContentType.Library && (
          <ImageSlideShow {...data} closeModal={closeModal} />
        )}
        {contentModalType == EnumModalContentType.CustomView &&
          data.customView()}
        {contentModalType == EnumModalContentType.ListCourse && (
          <ListCourseLiveStream {...data} />
        )}
        {contentModalType == EnumModalContentType.ChatRoom && (
          <ChatRoomClass {...data} />
        )}
      </Modal>
    );
  }
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
    minWidth: "60%",
    backgroundColor: palette.white,
    borderRadius: 6,
    padding: 30,
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
});

export default SuperModal;
