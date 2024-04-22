import React from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";

import CS from "@theme/styles";
import Header from "@shared-components/header/Header";
import ItemDetailEvent from "./item.detail.event";
import {
  EnumModalContentType,
  EnumStyleModalType,
  showSuperModal,
} from "@helpers/super.modal.helper";

const DetailScreenEvent = () => {
  const route = useRoute();
  const tier = route.params?.tier || "1";

  const item = route.params?.item;
  const pressMore = () => {
    showSuperModal({
      contentModalType: EnumModalContentType.MoreEventDetail,
      styleModalType: EnumStyleModalType.Bottom,
      data: {
        hideCloseIcon: true,
        item: item,
      },
    });
  };

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header
        iconNameRight={tier != 1 ? "more-vertical" : ""}
        onPressRight={pressMore}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <ItemDetailEvent item={item} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailScreenEvent;
