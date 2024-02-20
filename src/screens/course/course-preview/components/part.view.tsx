import * as React from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import * as Animatable from "react-native-animatable";
import * as FileViewer from "react-native-file-viewer";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import RNFS from "react-native-fs";

import Accordion from "react-native-collapsible/Accordion";
import PressableBtn from "@shared-components/button/PressableBtn";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { getListModule } from "@services/api/course.api";
import { ICourseModuleItem } from "models/course.model";
import useStore from "@services/zustand/store";
import { showToast } from "@helpers/super.modal.helper";
import LoadingList from "@shared-components/loading.list.component";
import { formatTime } from "@utils/date.utils";
import IconSvg from "assets/svg";
import { downloadFileToPath } from "@helpers/file.helper";
import { translations } from "@localization";
import eventEmitter from "@services/event-emitter";

const { width } = Dimensions.get("screen");
interface PartViewProps {
  id: string;
  hide?: boolean;
  onPressItem?: (item: any) => void;
  isLearnScreen?: boolean;
  itemSelected?: any;
}

const PartView = ({
  id,
  hide,
  onPressItem,
  isLearnScreen,
  itemSelected,
}: PartViewProps) => {
  const userData = useStore((state) => state.userData);
  const param = {
    auth_id: userData?._id,
    course_id: id,
  };

  const [sectionList, setSectionList] = React.useState<ICourseModuleItem[]>([]);
  const [activeSections, setActiveSections] = React.useState<number[]>([0]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const _getListModule = () => {
    getListModule(param).then((res) => {
      if (!res.isError) {
        setIsLoading(false);
        setSectionList(res.data);
      } else {
        setIsLoading(false);
        showToast({ type: "error", message: res.mesage });
      }
    });
  };

  React.useEffect(() => {
    _getListModule();
  }, [id]);
  React.useEffect(() => {
    eventEmitter.on("reload_data_preview", _getListModule);
    return () => {
      eventEmitter.off("reload_data_preview", _getListModule);
    };
  });

  const _renderHeader = (section: ICourseModuleItem, index: number) => {
    return (
      <PressableBtn onPress={() => _updateSections(index)}>
        <Animatable.View
          duration={300}
          transition="backgroundColor"
          style={{
            flexDirection: "row",
            height: 40,
            alignItems: "center",
            justifyContent: "space-between",
            width: width - 32,
          }}
        >
          <Text style={styles.headerText}>{section.title}</Text>
          <Icon
            size={24}
            name={
              activeSections.indexOf(index) >= 0 ? "chevron-up" : "chevron-down"
            }
            type={IconType.Ionicons}
          />
        </Animatable.View>
      </PressableBtn>
    );
  };

  const _renderContent = (
    section: ICourseModuleItem,
    i: number,
    isActive: boolean,
  ) => {
    return (
      <Animatable.View
        duration={300}
        transition="backgroundColor"
        style={{
          backgroundColor: palette.background,
        }}
      >
        <Animatable.View
          key={i}
          duration={300}
          easing="ease-out"
          animation={isActive ? "zoomIn" : "zoomOut"}
        >
          {section.children?.map((item, index) => (
            <Lession
              key={item._id}
              index={index}
              data={item}
              itemSelected={itemSelected}
              pressItem={() => onPressItem && onPressItem(item)}
              isLearnScreen={isLearnScreen}
            />
          ))}
        </Animatable.View>
      </Animatable.View>
    );
  };
  const _updateSections = (active: number) => {
    setActiveSections((activeSections) => {
      if (activeSections.indexOf(active) < 0) {
        return [...activeSections, active];
      } else {
        return activeSections.filter((i) => i != active);
      }
    });
  };
  if (hide) {
    return null;
  }

  return (
    <View style={styles.container}>
      {isLoading && <LoadingList />}
      <Accordion
        sections={sectionList}
        activeSections={activeSections}
        renderHeader={_renderHeader}
        renderContent={_renderContent}
        onChange={() => {}}
      />
    </View>
  );
};

export default React.memo(PartView);

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  headerText: {
    ...CS.hnSemiBold,
  },
  viewContent: {
    flexDirection: "row",
    height: 52,
    alignItems: "center",
    paddingVertical: 4,
  },
  textDetail: {
    ...CS.hnRegular,
    fontSize: 16,
    lineHeight: 24,
  },
  textDes: {
    ...CS.hnRegular,
    fontSize: 12,
    lineHeight: 16,
    color: palette.textOpacity6,
  },
});

interface LessionProps {
  data: any;
  pressItem: () => void;
  index: number;
  isLearnScreen?: boolean;
  itemSelected?: any;
}

const Lession = ({
  data,
  pressItem,
  index,
  isLearnScreen,
  itemSelected,
}: LessionProps) => {
  const media_duration =
    data?.media_id?.media_meta?.find((i) => i.key === "duration")?.value || 0;
  const fileCourseLocal = useStore((state) => state.fileCourseLocal);
  const addFileCourseLocal = useStore((state) => state.addFileCourseLocal);
  const isDownload = (fileCourseLocal || []).filter(
    (item) => item.id === data._id,
  );
  const isSelected = data?._id === itemSelected?._id;
  const _downloadFile = async () => {
    if (isDownload.length > 0) {
      FileViewer.open(isDownload[0].localFile);
    } else {
      data.media_id.media_url, data._id;
      const file = await downloadFileToPath(
        data.media_id.media_url,
        `${RNFS.DocumentDirectoryPath}/${data._id}`,
      );
      console.log("fileLocal...", fileCourseLocal);
      if (file) {
        addFileCourseLocal(data._id, file);
      }
    }
  };

  return (
    <PressableBtn
      style={[
        styles.viewContent,
        isSelected && { backgroundColor: palette.background2 },
      ]}
      onPress={pressItem}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          ...CS.center,
          backgroundColor: palette.background2,
          marginRight: 8,
        }}
      >
        {data.type === "video" ? (
          <Text style={CS.hnRegular}>{index + 1}</Text>
        ) : (
          <IconSvg name="icFile" size={16} />
        )}
      </View>
      <View style={{ flex: 1, height: 60, justifyContent: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {data.is_view && <IconSvg name="icCheckCircleFill" size={16} />}
          {data.is_view && <View style={{ width: 4 }} />}
          <Animatable.Text style={styles.textDetail}>
            {data.title}
          </Animatable.Text>
        </View>
        {data.type === "video" && (
          <Animatable.Text style={styles.textDes}>
            {data.type === "video" ? "video - " : ""}
            {formatTime(media_duration)} {translations.minutes}
          </Animatable.Text>
        )}
      </View>
      {data.type === "video" && !isLearnScreen && (
        <Icon type={IconType.Ionicons} name={"play-circle-outline"} size={20} />
      )}
      {data.type !== "video" && isLearnScreen && (
        <PressableBtn
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: palette.background2,
            ...CS.center,
          }}
          onPress={() => {
            _downloadFile();
          }}
        >
          {isDownload.length == 0 ? (
            <Icon
              type={IconType.Ionicons}
              name={"download-outline"}
              size={13}
            />
          ) : (
            <IconSvg name="icCheckCircleFill" size={16} />
          )}
        </PressableBtn>
      )}
    </PressableBtn>
  );
};
