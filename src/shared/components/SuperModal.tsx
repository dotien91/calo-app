import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    eventEmitter.on("show_super_modal", showModal);
    eventEmitter.on("close_super_modal", closeModal);
    return () => {
      eventEmitter.off("show_super_modal", showModal);
      eventEmitter.off("close_super_modal", closeModal);
    };
  }, []);

  const showModal = (_content: object) => {
    setVisible(true);
    if (_content?.showLoading) {
      setIsLoadingView(true);
      return;
    }
    setContent(_content);
  };

  const closeModal = () => {
    setVisible(false);
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
        {item?.type == "btn" && (
          <TouchableOpacity style={item.btnStyle} onPress={item.onPress}>
            <Text style={[item?.txtBtn ? item.txtBtn : styles.txtBtn]}>
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
        isVisible={visible}
        onBackdropPress={closeModal}
        onSwipeComplete={closeModal}
        onBackButtonPress={closeModal}
        useNativeDriver={true}
        style={styles.loadingView}
      >
        <ActivityIndicator color={palette.white} size={"large"} />
      </Modal>
    );

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={closeModal}
      onSwipeComplete={closeModal}
      onBackButtonPress={closeModal}
      useNativeDriver={true}
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
    flex: 1,
    margin: 0,
  },
  modalInner: {
    minWidth: "60%",
    backgroundColor: palette.white,
    borderRadius: 6,
    padding: 20,
    overflow: "hidden",
  },
  txtDefault: {
    fontSize: 16,
    textAlign: "center",
    ...cmStyle.hnMedium,
    marginBottom: 8,
  },
  btnStyle: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: palette.primary,
    borderRadius: 6,
    ...cmStyle.flexCenter,
  },
  txtBtn: {
    color: palette.white,
    fontSize: 16,
    ...cmStyle.hnSemiBold,
  },
});

export default SuperModal;
