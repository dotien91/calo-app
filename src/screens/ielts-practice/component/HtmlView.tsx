import React from "react";
import { View } from "react-native";
import RenderHtml from "react-native-render-html";

/**
 * ? Local Imports
 */
import CS from "@theme/styles";
import { Device } from "@utils/device.ui.utils";
import Button from "@shared-components/button/Button";
import { translations } from "@localization";
import { styleHtml } from "../styles/html.styles";

const width = Device.width;
interface IHtmlView {
  content: string;
  showViewMore?: boolean;
}

const HtmlView = ({ showViewMore = false, content }: IHtmlView) => {
  const [expand, setExpand] = React.useState(true);

  const toggleView = () => {
    setExpand((expand) => !expand);
  };

  if (!expand)
    return (
      <Button
        showRightIcon={true}
        style={{ marginTop: 16 }}
        onPress={toggleView}
        text={translations.ieltsPractice.showPassage}
        iconName={"chevron-down"}
        type="viewmore"
      />
    );

  return (
    <View style={[!expand && { maxHeight: 0 }]}>
      <RenderHtml
        contentWidth={width - 32}
        source={{ html: content }}
        tagsStyles={styleHtml}
      />
      {showViewMore && content?.length > 500 && (
        <Button
          showRightIcon={true}
          onPress={toggleView}
          text={translations.ieltsPractice.hidePassage}
          iconName={"chevron-up"}
          type="viewmore"
        />
      )}
    </View>
  );
};

export default React.memo(HtmlView);
