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

import cmStyle from "@theme/styles";
import eventEmitter from "@services/event-emitter";
import { palette } from "@theme/themes";
import PagerScrollMedia from "./page-scroll-media/PageScrollMedia";
// Super modal help you create a modal with a title, a content and a button
// Usage:
// using normal one.
// eventEmitter.emit('show_super_modal', SuperModalHelper.getContentPopupNormal('Hi, I\'m a test modal'));
// todo custome view modal

interface SuperModalProps {}

const SuperModal: React.FC<SuperModalProps> = () => {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState([]);
  const [isLoadingView, setIsLoadingView] = useState(false);
  const [listMedia, setListMeia] = useState([]);
  const [indexMedia, setIndexMedia] = useState(0);
  const scrollViewRef = useRef<any>(null);

  useEffect(() => {
    eventEmitter.on("show_super_modal", showModal);
    eventEmitter.on("close_super_modal", closeModal);
    eventEmitter.on("show_media", showMedia);
    return () => {
      eventEmitter.off("show_super_modal", showModal);
      eventEmitter.off("close_super_modal", closeModal);
      eventEmitter.off("show_media", showMedia);
    };
  }, []);

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
  };

  const hasBtn = () => {
    return !!content.find((item) => item?.type == "btn");
  };

  const renderItem = (item: object, index: number) => {
    return (
      <View key={index}>
        {!item.type && !!item.text && (
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
        style={[styles.modal]}
      >
        <PagerScrollMedia
          index={indexMedia}
          listMedia={listMedia}
          closeModal={closeModal}
        />
      </Modal>
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
        {content.map((item, index) => renderItem(item, index))}

        {!hasBtn() && (
          <TouchableOpacity style={styles.btnStyle} onPress={closeModal}>
            <Text style={styles.txtBtn}>OK</Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    ...cmStyle.flexCenter,
  },
  loadingView: {
    ...cmStyle.flex1,
    margin: 0,
  },
  modalInner: {
    minWidth: "60%",
    backgroundColor: palette.black,
    borderRadius: 6,
    padding: 30,
    overflow: "hidden",
  },
  txtDefault: {
    fontSize: 16,
    textAlign: "center",
    ...cmStyle.hnMedium,
    marginBottom: 12,
  },
  btnStyle: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: palette.green,
    borderRadius: 99,
    ...cmStyle.flexCenter,
  },
  txtBtn: {
    color: palette.white,
    fontSize: 16,
    ...cmStyle.hnSemiBold,
  },
});

export default SuperModal;
