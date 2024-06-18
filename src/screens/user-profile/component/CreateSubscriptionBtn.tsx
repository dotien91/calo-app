import React from "react";

import useUserHelper from "@helpers/hooks/useUserHelper";
import { navigate } from "@helpers/navigation.helper";
import { translations } from "@localization";
import TextBase from "@shared-components/TextBase";
import Button from "@shared-components/button/Button";
import { SCREENS } from "constants";
import { View } from "react-native";

const CreateSubscriptionBtn = () => {
  const { isTeacher } = useUserHelper();
  if (!isTeacher) return null;
  return (
    <View style={{ padding: 16, paddingBottom: 8 }}>
      <TextBase
        color={"link"}
        marginBottom={4}
        title={translations.subscription.description}
      />
      <Button
        onPress={() => navigate(SCREENS.CREATE_SUBSCRIPTION)}
        text={translations.subscription.addSubscription}
        type="outline"
      />
    </View>
  );
};

export default CreateSubscriptionBtn;
