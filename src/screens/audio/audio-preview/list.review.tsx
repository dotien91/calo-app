import * as React from "react";
import { View, StyleSheet, ScrollView } from "react-native";

import { ListReview } from "@services/api/podcast.api";
import ItemReview from "../components/ItemReview";

interface ListReviewProps {
  id: string;
}

const ListReviewView = ({ id }: ListReviewProps) => {
  const [listData, setListData] = React.useState<any[]>();
  const paramsRequest = {
    limit: 5,
    podcast_id: id,
  };

  React.useEffect(() => {
    getListReview();
  }, []);
  const getListReview = () => {
    ListReview(paramsRequest).then((res) => {
      if (!res.isError) {
        setListData(res.data);
      }
    });
  };
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        style={styles.viewListReview}
        showsHorizontalScrollIndicator={false}
      >
        {listData?.map((item, index) => {
          return <ItemReview item={item} key={index} />;
        })}
      </ScrollView>
    </View>
  );
};

export default React.memo(ListReviewView);

const styles = StyleSheet.create({
  container: {},
  viewListReview: {},
});
