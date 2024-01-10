/* eslint-disable camelcase */
import React, { useState, useEffect, useRef } from "react";
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
import { typePopup } from "@helpers/super.modal.helper";
import CommonStyle from "@theme/styles";

import PagerScrollMedia from "@shared-components/page-scroll-media/PageScrollMedia";
import ListActionOfPost from "@shared-components/action-bottomsheet/ListActionOfPost";
import ListActionOfComment from "@shared-components/action-bottomsheet/ListActionOfComment";
import StickBottomModal from "@shared-components/stick-bottom/StickBottomModal";
// Super modal help you create a modal with a title, a content and a button
// Usage:
// using normal one.
// eventEmitter.emit('show_super_modal', SuperModalHelper.getContentPopupNormal('Hi, I\'m a test modal'));
// todo custome view modal

interface SuperModalProps {}

const SuperModal: React.FC<SuperModalProps> = () => {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState({});
  const [isLoadingView, setIsLoadingView] = useState(false);
  const [listMedia, setListMeia] = useState([]);
  const [indexMedia, setIndexMedia] = useState(0);
  const [type, setType] = useState("");
  const scrollViewRef = useRef<any>(null);

  useEffect(() => {
    eventEmitter.on("show_super_modal", showModal);
    eventEmitter.on("close_super_modal", closeModal);
    eventEmitter.on("show_media", showMedia);
    eventEmitter.on("show_bottom_modal", showBottomModal);
    return () => {
      eventEmitter.off("show_super_modal", showModal);
      eventEmitter.off("close_super_modal", closeModal);
      eventEmitter.off("show_media", showMedia);
      eventEmitter.on("show_bottom_modal", showBottomModal);
    };
  }, []);

  const showBottomModal = (param: any) => {
    setType(param.type);
    setContent(param.data);
    setVisible(true);
  };

  const showModal = (_content: object) => {
    if (_content?.showLoading) {
      setIsLoadingView(true);
      return;
    }
    setContent(_content);
    setVisible(true);
  };

  const showMedia = (_listMedia: object) => {
    setListMeia(_listMedia.listLink);
    setIndexMedia(_listMedia.index);
    setTimeout(() => {
      scrollViewRef.current?.scrollToIndex(_listMedia.index);
    }, 2);
    setVisible(true);
  };

  const closeModal = () => {
    setIsLoadingView(false);
    setVisible(false);
    setContent([]);
    setListMeia([]);
    setType("");
  };

  const hasBtn = () => {
    return !!content?.data?.find((item) => item?.type == "btn");
  };

  const confirmType = () => {
    return content?.type == typePopup.confirmPopup;
  };

  const renderItem = (item: object, index: number) => {
    return (
      <View key={index}>
        {!item?.type && !!item?.text && (
          <Text style={[item?.style ? item.style : styles.txtDefault]}>
            {item.text}
          </Text>
        )}
        {item?.type == "btn" && !!item.text && (
          <TouchableOpacity
            style={{ ...styles.btnStyle, ...item.style }}
            onPress={item.onPress || closeModal}
          >
            <Text style={{ ...styles.txtBtn, ...item.txtBtn }}>
              {item.text}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (isLoadingView)
    return (
      <Modal
        isVisible={isLoadingView}
        onBackdropPress={closeModal}
        onSwipeComplete={closeModal}
        onBackButtonPress={closeModal}
        // useNativeDriver={true}
        style={styles.loadingView}
      >
        <ActivityIndicator color={palette.white} size={"large"} />
      </Modal>
    );

  if (!visible) return null;

  if (listMedia.length > 0) {
    return (
      <Modal
        isVisible={visible}
        onBackdropPress={closeModal}
        onSwipeComplete={closeModal}
        onBackButtonPress={closeModal}
        animationIn={"FadeIn"}
        animationOut={"FadeOut"}
        // useNativeDriver={true}
        style={styles.modalMedia}
      >
        <PagerScrollMedia
          index={indexMedia}
          listMedia={listMedia}
          closeModal={closeModal}
        />
      </Modal>
    );
  }

  if (type !== "") {
    return (
      <StickBottomModal
        isVisible={visible}
        header={""}
        onBackdropPress={() => setVisible(false)}
        onPressClose={() => setVisible(false)}
      >
        <View
          style={{
            ...CommonStyle.flex1,
            backgroundColor: palette.white,
            paddingHorizontal: 16,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          }}
        >
          {type === "post" && <ListActionOfPost data={content} />}
          {type === "comment" && <ListActionOfComment data={content} />}
        </View>
      </StickBottomModal>
    );
  }

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={closeModal}
      onSwipeComplete={closeModal}
      onBackButtonPress={closeModal}
      animationIn={"FadeIn"}
      animationOut={"FadeOut"}
      // useNativeDriver={true}
      style={styles.modal}
    >
      <View style={styles.modalInner}>
        {(content?.data || []).map((item, index) => renderItem(item, index))}
        {!confirmType() && !hasBtn() && (
          <TouchableOpacity style={styles.btnStyle} onPress={closeModal}>
            <Text style={styles.txtBtn}>OK</Text>
          </TouchableOpacity>
        )}
        {!!confirmType() && (
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
                content.cb();
                closeModal();
              }}
            >
              <Text style={styles.txtBtn}>Ok</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    ...CommonStyle.flexCenter,
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
  txtDefault: {
    fontSize: 16,
    textAlign: "center",
    ...CommonStyle.hnMedium,
    marginBottom: 12,
  },
  btnStyle: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: palette.green,
    borderRadius: 99,
    ...CommonStyle.flexCenter,
  },
  txtBtn: {
    color: palette.white,
    fontSize: 16,
    ...CommonStyle.hnSemiBold,
  },
});

export default SuperModal;
