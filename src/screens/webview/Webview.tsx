import * as React from "react";
import { SafeAreaView } from "react-native";
import { WebView } from "react-native-webview";
import { useRoute } from "@react-navigation/native";
import Header from "@shared-components/header/Header";
import CS from "@theme/styles";

const WebviewScreen = () => {
  const route = useRoute();
  const header = route.params["txtHeader"] || "";
  const link = route.params["link"] || "";
  console.log(header, link);
  const renderWebView = () => {
    return (
      <WebView
        source={{
          uri: link,
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
      />
    );
  };

  return (
    <SafeAreaView style={CS.safeAreaView}>
      <Header text={header} />
      {renderWebView()}
    </SafeAreaView>
  );
};

export default WebviewScreen;
