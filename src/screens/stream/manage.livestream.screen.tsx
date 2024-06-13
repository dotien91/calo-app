import React from "react";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import * as NavigationService from "react-navigation-helpers";
/**
 * ? Local Imports
 */
import { ICourseItem } from "models/course.model";
import EmptyResultView from "@shared-components/empty.data.component";
import { translations } from "@localization";

import LoadingList from "@shared-components/loading.list.component";
import StreamCard from "@screens/home/components/list-livestream/stream.card";
import { getListLiveStream } from "@services/api/stream.api";
import { useListData } from "@helpers/hooks/useListData";
import Header from "@shared-components/header/Header";
import useStore from "@services/zustand/store";
import eventEmitter from "@services/event-emitter";

interface ManageLivestreamScreenProps {}

const ManageLivestreamScreen: React.FC<ManageLivestreamScreenProps> = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header text={translations.updateLivestream.list} />
      <ListSearch type={["schedule"]} />
    </SafeAreaView>
  );
};

const ListSearch = ({ type }: { type: string[] }) => {
  const userData = useStore((state) => state.userData);

  React.useEffect(() => {
    eventEmitter.on("reload_list_stream", _requestData);
    return () => {
      eventEmitter.off("reload_list_stream", _requestData);
    };
  }, []);

  const paramRequest = React.useMemo(() => {
    return {
      limit: "5",
      livestream_status: type,
      user_id: userData?._id,
      order_by: "DESC",
    };
  }, [userData]);

  const {
    noData,
    listData,
    isLoading,
    onEndReach,
    renderFooterComponent,
    _requestData,
  } = useListData<ICourseItem>(paramRequest, getListLiveStream, []);

  const renderItem = ({ item }: { item: ICourseItem }, index: number) => {
    return <StreamCard isEditMode data={item} key={index} />;
  };

  const renderLoading = () => {
    if (!isLoading) return null;
    return (
      <View style={{ marginTop: 10 }}>
        <LoadingList />
      </View>
    );
  };

  return (
    <View>
      {renderLoading()}
      {!listData?.length && !isLoading && noData && (
        <EmptyResultView title={translations.emptyList} />
      )}
      <FlatList
        contentContainerStyle={{ paddingBottom: 32 }}
        data={listData}
        renderItem={renderItem}
        onEndReachedThreshold={0}
        onEndReached={onEndReach}
        removeClippedSubviews={true}
        keyExtractor={(item) => item?._id + "" || item?.last_active}
        ListFooterComponent={renderFooterComponent()}
      />
    </View>
  );
};

export default ManageLivestreamScreen;
