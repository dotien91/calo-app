import React, { useEffect } from "react";
import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";

import { translations } from "@localization";
import LoadingList from "@shared-components/loading.list.component";
import { SCREENS } from "constants";
import { useListData } from "@helpers/hooks/useListData";
import eventEmitter from "@services/event-emitter";
import useStore from "@services/zustand/store";
import EmptyResultView from "@shared-components/empty.data.component";
import Header from "@shared-components/header/Header";
import CS from "@theme/styles";
import { navigate } from "@helpers/navigation.helper";
import {
  requestDeleteCertificate,
  requestListCertificate,
} from "@services/api/user.api";
import TextBase from "@shared-components/TextBase";
import { palette } from "@theme/themes";
import { EnumColors } from "models";
import { formatDateMonth } from "@utils/date.utils";
import IconBtn from "@shared-components/button/IconBtn";
import {
  EnumModalContentType,
  EnumStyleModalType,
  closeSuperModal,
  showSuperModal,
  showToast,
} from "@helpers/super.modal.helper";

const ManagedCertificateScreen = () => {
  const userData = useStore((state) => state.userData);

  const paramsRequest = React.useMemo(() => {
    return {
      limit: "20",
      user_id: userData?._id || "",
      order_by: "DESC",
    };
  }, []);

  const {
    listData,
    onEndReach,
    isLoading,
    refreshControl,
    renderFooterComponent,
    _requestData,
  } = useListData<any>(paramsRequest, requestListCertificate, []);

  useEffect(() => {
    eventEmitter.on("reload_list_certificate", _requestData);
    return () => {
      eventEmitter.off("reload_list_certificate", _requestData);
    };
  }, []);

  useEffect(() => {
    _requestData(true);
  }, [userData?._id]);

  const renderLoading = () => {
    return <LoadingList numberItem={3} />;
  };

  const renderItemSelected = ({ item }) => {
    return <CertificateItem data={item} />;
  };

  const renderEmpty = () => {
    return <EmptyResultView title={translations.emptyList} />;
  };

  const renderHeader = () => {
    return (
      <>
        {listData.length == 0 && isLoading && renderLoading()}
        {listData.length == 0 && !isLoading && renderEmpty()}
      </>
    );
  };

  const addCertificate = () => {
    navigate(SCREENS.CREATE_CERTIFICATE);
  };

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header
        text={translations.manageCertificate.title}
        iconNameRight="plus"
        onPressRight={addCertificate}
      />
      <FlatList
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.list}
        showsHorizontalScrollIndicator={false}
        data={listData}
        renderItem={renderItemSelected}
        scrollEventThrottle={16}
        initialNumToRender={2}
        onEndReachedThreshold={0}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item?._id + ""}
        onEndReached={onEndReach}
        refreshControl={refreshControl()}
        ListFooterComponent={renderFooterComponent()}
      />
    </SafeAreaView>
  );
};

const CertificateItem = ({ data }) => {
  const openEditCertificatePage = () => {
    closeSuperModal();
    navigate(SCREENS.CREATE_CERTIFICATE, {
      data: data,
    });
  };

  const _requestDeleteCertificate = () => {
    requestDeleteCertificate(data._id).then((response) => {
      if (!response.isError) {
        showToast({
          type: "success",
          message: translations.manageCertificate.deleteCertificateSuccess,
        });
        eventEmitter.emit("reload_list_certificate");
      } else {
        showToast({
          type: "error",
        });
      }
    });
  };

  const showConfirmDelete = () => {
    showSuperModal({
      styleModalType: EnumStyleModalType.Bottom,
      contentModalType: EnumModalContentType.Confirm,
      data: {
        hideCloseIcon: true,
        title: translations.manageCertificate.confirmDeleteCertificate,
        cb: _requestDeleteCertificate,
      },
    });
  };
  const showMoreModal = () => {
    showSuperModal({
      styleModalType: EnumStyleModalType.Bottom,
      contentModalType: EnumModalContentType.ViewMore,
      data: {
        hideCloseIcon: true,
        listItem: [
          {
            icon: "edit",
            title: translations.manageCertificate.editCertificate,
            onPress: openEditCertificatePage,
          },
          {
            icon: "trash",
            title: translations.manageCertificate.deleteCertificate,
            onPress: showConfirmDelete,
          },
        ],
      },
    });
  };
  return (
    <View style={styles.certificateItem}>
      <View style={{ flex: 1 }}>
        <View style={CS.flexStart}>
          <TextBase
            fontSize={12}
            color={EnumColors.textOpacity6}
            title={formatDateMonth(data?.end_issued) + "  "}
          />
          {data?.status == "pending" ? (
            <IconBtn size={14} name="clock" color={palette.info} />
          ) : (
            <IconBtn size={14} name="check-circle" color={palette.green} />
          )}
        </View>
        <View style={CS.flexRear}>
          <TextBase style={{ flex: 1, paddingRight: 12 }} title={data.label} />
        </View>
      </View>
      <IconBtn name="more-vertical" onPress={showMoreModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingBottom: 60,
    paddingHorizontal: 16,
  },
  certificateItem: {
    paddingVertical: 8,
    ...CS.flexRear,
  },
});

export default ManagedCertificateScreen;
