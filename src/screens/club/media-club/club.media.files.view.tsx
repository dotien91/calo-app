import React, { memo } from "react";
import { StyleSheet, View, FlatList } from "react-native";

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
import LoadingList from "@shared-components/loading.list.component";
import TextBase from "@shared-components/TextBase";
import { formatFullDate } from "@utils/date.utils";
import { palette } from "@theme/themes";
import { EnumColors } from "models";

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

  const renderItem = ({ item, index }: { item: MediaType; index: number }) => {
    return (
      <PressableBtn
        key={index}
        onPress={() => openUrl(item?.media_url)}
        style={styles.box}
      >
        <IconBtn name="file" customStyle={styles.icon} size={32} />
        <View>
          <TextBase color={EnumColors.text} fontWeight="700">
            {item?.media_file_name}
          </TextBase>
          <TextBase fontSize={12} color={EnumColors.textOpacity6}>
            {formatFullDate(item?.createdAt)}
          </TextBase>
        </View>
      </PressableBtn>
    );
  };

  return (
    <View style={styles.box}>
      {!isLoading && !listData.length && (
        <EmptyResultView title={translations.notFound} />
      )}
      {isLoading && <LoadingList />}
      <FlatList
        data={listData}
        renderItem={renderItem}
        onEndReached={onEndReach}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
        keyExtractor={(item) => item._id}
        ListFooterComponent={renderFooterComponent()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  box: {
    marginTop: 8,
    ...CS.flexStart,
    ...CS.borderBottomStyle,
    paddingBottom: 8,
  },
  icon: {
    marginRight: 12,
    color: palette.textOpacity6,
  },
});

export default memo(ClubFilesView);
