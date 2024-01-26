/* eslint-disable camelcase */
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Modal from "react-native-modal";

import eventEmitter from "@services/event-emitter";
import { palette } from "@theme/themes";
import {
  EnumModalContentType,
  EnumStyleModalType,
  IShowModalParams,
} from "@helpers/super.modal.helper";
import CommonStyle from "@theme/styles";

import PagerScrollMedia from "@shared-components/page-scroll-media/PageScrollMedia";
import ListActionOfPost from "@shared-components/action-bottomsheet/ListActionOfPost";
import ListActionOfComment from "@shared-components/action-bottomsheet/ListActionOfComment";
import StickBottomModal from "@shared-components/stick-bottom/StickBottomModal";
import ReportView from "./modal-inner/ReportView";
import CourseFilterModalInnter from "@screens/course/components/course.filter.modal.inner";
import IconBtn from "@shared-components/button/IconBtn";
import SelectBox from "@shared-components/modal/modal-inner/SelectBox";
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
  const [styleModalType, setStyleModalType] = useState<EnumStyleModalType>();
  const [contentModalType, setContentModalType] =
    useState<EnumModalContentType>();

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
    setStyleModalType(styleModalType);
    setContentModalType(contentModalType);
    setData(data);
  };

  const closeModal = () => {
    setStyleModalType("");
    setContentModalType("");
  };

  if (!contentModalType || !styleModalType) return null;

  const getStyleModal = () => {
    switch (contentModalType) {
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
    return <ActivityIndicator color={palette.white} size={"large"} />;
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
            <Text style={styles.txtBtn}>Cancel</Text>
          </TouchableOpacity>
          <View style={{ width: 10 }} />
          <TouchableOpacity
            style={[
              styles.btnStyle,
              { backgroundColor: palette.danger, flex: 1 },
            ]}
            onPress={() => {
              if (data.cb) data.cb();
              closeModal();
            }}
          >
            <Text style={styles.txtBtn}>Ok</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (styleModalType == EnumStyleModalType.Bottom) {
    return (
      <StickBottomModal
        isVisible={true}
        onBackdropPress={closeModal}
        onPressClose={closeModal}
      >
        <View style={styles.bottomInner}>
          <IconBtn
            onPress={closeModal}
            name={"x"}
            size={32}
            customStyle={styles.closeIcon}
          />
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
        </View>
      </StickBottomModal>
    );
  }

  if (styleModalType == EnumStyleModalType.Middle) {
    return (
      <Modal
        isVisible={true}
        onBackdropPress={closeModal}
        onSwipeComplete={closeModal}
        onBackButtonPress={closeModal}
        useNativeDriver={true}
        style={getStyleModal()}
      >
        {contentModalType == EnumModalContentType.Confirm &&
          renderConfirmView()}
        {contentModalType == EnumModalContentType.Loading && renderLoading()}
        {contentModalType == EnumModalContentType.Library && (
          <PagerScrollMedia {...data} closeModal={closeModal} />
        )}
      </Modal>
    );
  }
};

const styles = StyleSheet.create({
  modal: {
    ...CommonStyle.flexCenter,
  },
  bottomInner: {
    ...CommonStyle.flex1,
    backgroundColor: palette.white,
    paddingHorizontal: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 16,
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
    minWidth: "60%",
    backgroundColor: palette.white,
    borderRadius: 6,
    padding: 30,
    overflow: "hidden",
  },
  btnStyle: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: palette.green,
    borderRadius: 99,
    ...CommonStyle.flexCenter,
  },
  txtBtn: {
    ...CommonStyle.hnSemiBold,
    fontSize: 16,
    color: palette.white,
  },
  title: {
    ...CommonStyle.hnBold,
    fontSize: 20,
    color: palette.text,
    textAlign: "center",
  },
  desc: {
    ...CommonStyle.hnRegular,
    fontSize: 16,
    color: palette.text,
    textAlign: "center",
    marginBottom: 12,
  },
  closeIcon: {
    position: "absolute",
    left: 14,
    top: 24,
    zIndex: 1,
  },
});

export default SuperModal;
