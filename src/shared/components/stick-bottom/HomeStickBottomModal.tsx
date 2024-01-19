import * as React from "react";
import StickBottomModal from "./StickBottomModal";
import eventEmitter from "@services/event-emitter";
import ListActionOfPost from "@shared-components/action-bottomsheet/ListActionOfPost";
import { View } from "@motify/components";
import CommonStyle from "@theme/styles";
import { palette } from "@theme/themes";
import ListActionOfComment from "@shared-components/action-bottomsheet/ListActionOfComment";

const HomeStickBottomModal = () => {
  const [visible, setVisible] = React.useState(false);
  const [content] = React.useState();
  const [type] = React.useState("");
  const [header] = React.useState("");
  // React.useEffect(() => {
  //   eventEmitter.on("show_bottom_modal", showBottomModal);
  //   eventEmitter.on("close_bottom_modal", closeBottomModal);
  //   return () => {
  //     eventEmitter.off("show_bottom_modal", showBottomModal);
  //     eventEmitter.off("close_bottom_modal", closeBottomModal);
  //   };
  // }, []);

  return (
    <StickBottomModal
      visible={visible}
      header={header}
      onBackdropPress={() => setVisible(false)}
      onPressClose={() => setVisible(false)}
    >
      <View
        style={{
          ...CommonStyle.flex1,
          backgroundColor: palette.white,
          paddingHorizontal: 16,
        }}
      >
        {type === "post" && <ListActionOfPost data={content} />}
        {type === "comment" && <ListActionOfComment data={content} />}
      </View>
    </StickBottomModal>
  );
};

export const showStickBottom = (
  data: any,
  type: string,
  isDetail?: boolean,
) => {
  eventEmitter.emit("show_bottom_modal", {
    data,
    type,
    isDetail,
  });
};

export const closeStickBottom = () => {
  eventEmitter.emit("close_bottom_modal");
};
export default HomeStickBottomModal;
