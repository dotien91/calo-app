import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import Modal, { ModalProps } from "react-native-modal";

interface IModalCalendarProps extends ModalProps {
  heightPercent?: number | undefined;
  // header: ReactNode | string;
}

/**Modal stick at of page */
export default function ModalCalendar({
  children,
  backdropOpacity,
  animationIn,
  animationOut,
  ...restProps
}: IModalCalendarProps) {
  return (
    <Modal
      {...restProps}
      backdropOpacity={backdropOpacity || 0.5}
      style={styles.modal}
      animationIn={animationIn || "fadeInRight"}
      animationOut={animationOut || "fadeOutRight"}
      animationInTiming={200}
      avoidKeyboard={true}
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
    margin: 0,
    padding: 0,
    borderRadius: 0,
  },
});
