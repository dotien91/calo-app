import { getListLiveStream } from "@services/api/stream.api";
import { palette } from "@theme/themes";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import StreamCard from "./stream.card";
import eventEmitter from "@services/event-emitter";
import PageControl from "react-native-page-control";

const fakedata = [
  {
    _id: "65eae58c3b6b447b7e849cd7",
    user_id: {
      _id: "659e59d11775abbd6d99d0b3",
      user_login: "dangth.tobi_gmail.com",
      user_avatar:
        "https://files.exam24h.com/upload/2024/03/07_1709780089649/659e59d11775abbd6d99d0b3-1709780089648-IMG_0007.WEBP",
      user_avatar_thumbnail:
        "https://files.exam24h.com/upload/2024/03/07_1709780089656/659e59d11775abbd6d99d0b3-1709780089656-thumbnail-IMG_0007.WEBP",
      display_name: "Hai Dang",
      user_role: "teacher",
      user_status: 1,
      official_status: false,
      last_active: "2024-03-08T10:16:24.000Z",
      user_active: 1,
    },
    language: "en",
    avatar: null,
    media_id: null,
    title: "Hi",
    caption: "",
    cookies: "",
    ref_id: null,
    product_id: null,
    country: "Vietnam",
    like_number: 0,
    view_number: 1,
    comment_number: 0,
    livestream_status: "live",
    ready_status: "",
    input_type: "",
    livestream_source: "",
    whip_data: "",
    whep_data: "",
    cloudflare_stream_id: "",
    music_id: [],
    hashtag_id: [],
    react_value: {
      haha_value: 0,
      like_value: 0,
      love_value: 0,
      care_value: 0,
      wow_value: 0,
      sad_value: 0,
      angry_value: 0,
      _id: "65eae58c3b6b447b7e849cd8",
    },
    livestream_data: {
      rtmp_url: "rtmp://broadcast.ieltshunter.io:1935/live",
      m3u8_url: "https://live.ieltshunter.io/hls/GtOJagcpH14AZ3v9YG9x.m3u8",
      ingest_endpoint: "",
      stream_key: "GtOJagcpH14AZ3v9YG9x",
      _id: "65eae58c3b6b447b7e849cdb",
    },
    history_media: [],
    createdAt: "2024-03-08T10:16:44.920Z",
    updatedAt: "2024-03-08T10:40:29.955Z",
    __v: 0,
  },
  {
    _id: "65eae58c3b6b447b7e849cd7",
    user_id: {
      _id: "659e59d11775abbd6d99d0b3",
      user_login: "dangth.tobi_gmail.com",
      user_avatar:
        "https://files.exam24h.com/upload/2024/03/07_1709780089649/659e59d11775abbd6d99d0b3-1709780089648-IMG_0007.WEBP",
      user_avatar_thumbnail:
        "https://files.exam24h.com/upload/2024/03/07_1709780089656/659e59d11775abbd6d99d0b3-1709780089656-thumbnail-IMG_0007.WEBP",
      display_name: "Hai Dang",
      user_role: "teacher",
      user_status: 1,
      official_status: false,
      last_active: "2024-03-08T10:16:24.000Z",
      user_active: 1,
    },
    language: "en",
    avatar: null,
    media_id: null,
    title: "Hi",
    caption: "",
    cookies: "",
    ref_id: null,
    product_id: null,
    country: "Vietnam",
    like_number: 0,
    view_number: 1,
    comment_number: 0,
    livestream_status: "live",
    ready_status: "",
    input_type: "",
    livestream_source: "",
    whip_data: "",
    whep_data: "",
    cloudflare_stream_id: "",
    music_id: [],
    hashtag_id: [],
    react_value: {
      haha_value: 0,
      like_value: 0,
      love_value: 0,
      care_value: 0,
      wow_value: 0,
      sad_value: 0,
      angry_value: 0,
      _id: "65eae58c3b6b447b7e849cd8",
    },
    livestream_data: {
      rtmp_url: "rtmp://broadcast.ieltshunter.io:1935/live",
      m3u8_url: "https://live.ieltshunter.io/hls/GtOJagcpH14AZ3v9YG9x.m3u8",
      ingest_endpoint: "",
      stream_key: "GtOJagcpH14AZ3v9YG9x",
      _id: "65eae58c3b6b447b7e849cdb",
    },
    history_media: [],
    createdAt: "2024-03-08T10:16:44.920Z",
    updatedAt: "2024-03-08T10:40:29.955Z",
    __v: 0,
  },
  {
    _id: "65eae58c3b6b447b7e849cd7",
    user_id: {
      _id: "659e59d11775abbd6d99d0b3",
      user_login: "dangth.tobi_gmail.com",
      user_avatar:
        "https://files.exam24h.com/upload/2024/03/07_1709780089649/659e59d11775abbd6d99d0b3-1709780089648-IMG_0007.WEBP",
      user_avatar_thumbnail:
        "https://files.exam24h.com/upload/2024/03/07_1709780089656/659e59d11775abbd6d99d0b3-1709780089656-thumbnail-IMG_0007.WEBP",
      display_name: "Hai Dang",
      user_role: "teacher",
      user_status: 1,
      official_status: false,
      last_active: "2024-03-08T10:16:24.000Z",
      user_active: 1,
    },
    language: "en",
    avatar: null,
    media_id: null,
    title: "Hi",
    caption: "",
    cookies: "",
    ref_id: null,
    product_id: null,
    country: "Vietnam",
    like_number: 0,
    view_number: 1,
    comment_number: 0,
    livestream_status: "live",
    ready_status: "",
    input_type: "",
    livestream_source: "",
    whip_data: "",
    whep_data: "",
    cloudflare_stream_id: "",
    music_id: [],
    hashtag_id: [],
    react_value: {
      haha_value: 0,
      like_value: 0,
      love_value: 0,
      care_value: 0,
      wow_value: 0,
      sad_value: 0,
      angry_value: 0,
      _id: "65eae58c3b6b447b7e849cd8",
    },
    livestream_data: {
      rtmp_url: "rtmp://broadcast.ieltshunter.io:1935/live",
      m3u8_url: "https://live.ieltshunter.io/hls/GtOJagcpH14AZ3v9YG9x.m3u8",
      ingest_endpoint: "",
      stream_key: "GtOJagcpH14AZ3v9YG9x",
      _id: "65eae58c3b6b447b7e849cdb",
    },
    history_media: [],
    createdAt: "2024-03-08T10:16:44.920Z",
    updatedAt: "2024-03-08T10:40:29.955Z",
    __v: 0,
  },
];
interface ListLiveStreamProps {
  isListLiveStream: boolean;
}
const ListLiveStream = ({ isListLiveStream }: ListLiveStreamProps) => {
  const listRef = useRef(null);
  const [listDataStream, setListDataStream] = useState([]);
  const [currentPage, setcurrentPage] = useState(0);

  const renderItem = ({ item }: any) => {
    if (item?.livestream_status)
      return <StreamCard key={item._id} data={item} />;
  };

  useEffect(() => {
    const typeEmit = isListLiveStream
      ? "reload_listStream_live"
      : "reload_list_stream";
    eventEmitter.on(typeEmit, onRefresh);
    return () => {
      eventEmitter.off(typeEmit, onRefresh);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onRefresh = () => {
    _getListLiveStream();
    setTimeout(() => {
      listRef && listRef.current?.scrollToOffset({ animated: true, offset: 0 });
    }, 200);
  };

  const _getListLiveStream = () => {
    getListLiveStream().then((res) => {
      if (!res.isError) {
        console.log(
          "_getListLiveStream000000000",
          JSON.stringify(res, null, 2),
        );

        // const listDataStream = res.data.filter(
        const listDataStream = fakedata.filter(
          (item) => item?.livestream_status == "live",
        );
        setListDataStream(listDataStream.reverse());
      }
    });
  };

  useEffect(() => {
    _getListLiveStream();
  }, []);

  if (listDataStream.length == 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        ref={listRef}
        data={listDataStream}
        renderItem={renderItem}
        onEndReachedThreshold={0}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={true}
        keyExtractor={(item) => item?._id + ""}
        onMomentumScrollEnd={(ev) => {
          setcurrentPage(
            Math.round(
              ev.nativeEvent.contentOffset.x / Dimensions.get("window").width,
            ),
          );
        }}
      />
      <PageControl
        style={styles.stylePageControl}
        numberOfPages={listDataStream.length}
        currentPage={currentPage}
        hidesForSinglePage
        pageIndicatorTintColor={palette.white}
        currentPageIndicatorTintColor={palette.btnRedPrimary}
        indicatorStyle={{ borderRadius: 5 }}
        currentIndicatorStyle={{ borderRadius: 5, width: 24, height: 8 }}
        indicatorSize={{ width: 8, height: 8 }}
        onPageIndicatorPress={renderItem}
      />
    </View>
  );
};

export default ListLiveStream;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    height: 180,
  },
  stylePageControl: {
    position: "absolute",
    right: 5,
    bottom: 4,
  },
});
