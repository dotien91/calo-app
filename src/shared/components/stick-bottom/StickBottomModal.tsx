import React from "react";
import { useWindowDimensions, StyleSheet, ViewStyle } from "react-native";
import Modal, { ModalProps } from "react-native-modal";

interface IStickBottomModalProps extends ModalProps {
  heightPercent?: number | undefined;
  // header: ReactNode | string;
}

/**Modal stick at of page */
export default function StickBottomModal({
  heightPercent,
  children,
  style,
  backdropOpacity,
  ...restProps
}: IStickBottomModalProps) {
  const { height, width } = useWindowDimensions();

  return (
    <Modal
      {...restProps}
      backdropOpacity={backdropOpacity || 0.5}
      style={[
        style,
        styles.modal,
        { height: height * (heightPercent || 0.4), width },
      ]}
    >
      {/* {typeof header === "string" ? (
        <View style={styles.headerWrap}>
          <Text style={styles.headerText}>{header}</Text>
          <TouchableOpacity
            style={styles.headerCloseIcon}
            onPress={onPressClose}
          >
            <Icon
              type={IconType.AntDesign}
              name="closecircle"
              size={24}
              color="#c1c1c1"
            />
          </TouchableOpacity>
        </View>
      ) : (
        header
      )} */}
      {children}
    </Modal>
  );
}

interface Style {
  modal: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  modal: {
    position: "absolute",
    bottom: 0,
    margin: 0,
    zIndex: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: "red",
  },
});
