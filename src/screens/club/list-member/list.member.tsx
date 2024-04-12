import * as React from "react";
import { StyleSheet, SafeAreaView } from "react-native";
import { useRoute } from "@react-navigation/native";
import Header from "@shared-components/header/Header";
import { translations } from "@localization";
// import { useListData } from "@helpers/hooks/useListData";
// import { getMemberGroup } from "@services/api/club.api";

// interface TypeClubMember{

// }

const ListMemberScreen = () => {
  const route = useRoute();
  const id_club = route.params.id_club || "";

  console.log("listMember...", id_club);

  // const paramsRequest = {
  //   limit: 5,
  // };

  // const {
  //   listData,
  //   onEndReach,
  //   isLoading,
  //   refreshControl,
  //   renderFooterComponent,
  //   _requestData,
  // } = useListData<TypeClubMember>(paramsRequest, getMemberGroup, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header text={translations.club.member} />
    </SafeAreaView>
  );
};

export default ListMemberScreen;

const styles = StyleSheet.create({
  container: {},
});
