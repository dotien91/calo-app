import * as React from "react";
import { Text } from "react-native";
import { TypedMedia } from "shared/models";
import CS from "@theme/styles";
import PressableBtn from "@shared-components/button/PressableBtn";
import { openUrl } from "@helpers/file.helper";
import IconBtn from "@shared-components/button/IconBtn";

interface ListFilePostItemProps {
  listFile: TypedMedia[];
}

const ListFilePostItem = ({ listFile }: ListFilePostItemProps) => {
  const listPdf = React.useMemo(() => {
    return listFile.filter((item) => item.media_mime_type.includes("pdf"));
  }, [listFile]);
  return (
    <>
      {listPdf.map((item: any, index: number) => {
        return (
          <PressableBtn
            key={index}
            onPress={() => openUrl(item.media_url)}
            style={{ marginTop: 8, ...CS.flexStart }}
          >
            <IconBtn name="file" customStyle={{ marginRight: 2 }} />
            <Text style={CS.txtLink}>{item?.media_file_name}</Text>
          </PressableBtn>
        );
      })}
    </>
  );
};

export default ListFilePostItem;
