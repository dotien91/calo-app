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
import { typePopup } from "@helpers/super.modal.helper";
import CommonStyle from "@theme/styles";

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

  useEffect(() => {
    eventEmitter.on("show_super_modal", showModal);
    eventEmitter.on("close_super_modal", closeModal);
    return () => {
      eventEmitter.off("show_super_modal", showModal);
      eventEmitter.off("close_super_modal", closeModal);
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

  const closeModal = () => {
    setIsLoadingView(false);
    setVisible(false);
    setContent([]);
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
  console.log("contentcontent", content);
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
  loadingView: {
    flex: 1,
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
