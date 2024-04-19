import React, { memo } from "react";
import { StyleSheet, View, FlatList, Text } from "react-native";

import { TypedChatMediaLocal } from "models/chat.model";
import CS from "@theme/styles";
import { useRoute } from "@react-navigation/native";
import { useListData } from "@helpers/hooks/useListData";
import { MediaType } from "react-native-image-picker";
import { getMediaClub } from "@services/api/club.api";
import PressableBtn from "@shared-components/button/PressableBtn";
import { openUrl } from "@helpers/file.helper";
import IconBtn from "@shared-components/button/IconBtn";
import EmptyResultView from "@shared-components/empty.data.component";
import { translations } from "@localization";

const ClubFilesView = () => {
  const route = useRoute();
  const clubId = route.params?.["club_id"];

  const { listData, isLoading, onEndReach, renderFooterComponent } =
    useListData<MediaType>(
      {
        group_id: clubId,
        media_type: "file",
        order_by: "DESC",
        sort_by: "createdAt",
        limit: 20,
      },
      getMediaClub,
    );

  const renderItem = ({
    item,
    index,
  }: {
    item: TypedChatMediaLocal;
    index: number;
  }) => {
    return (
      <PressableBtn
        key={index}
        onPress={() => openUrl(item?.media_url)}
        style={{ marginTop: 8, ...CS.flexStart, flex: 1 }}
      >
        <IconBtn name="file" customStyle={{ marginRight: 2 }} />
        <Text style={CS.txtLink}>{item?.media_file_name}</Text>
      </PressableBtn>
    );
  };

  return (
    <View style={styles.box}>
      {!isLoading && !listData.length && (
        <EmptyResultView title={translations.notFound} />
      )}
      <FlatList
        data={listData}
        renderItem={renderItem}
        onEndReached={onEndReach}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        ListFooterComponent={renderFooterComponent()}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  box: {},
});

export default memo(ClubFilesView);
