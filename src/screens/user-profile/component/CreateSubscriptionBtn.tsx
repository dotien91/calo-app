import useUserHelper from "@helpers/hooks/useUserHelper";
import { navigate } from "@helpers/navigation.helper";
import { translations } from "@localization";
import useStore from "@services/zustand/store";
import TextBase from "@shared-components/TextBase";
import Button from "@shared-components/button/Button";
import CS from "@theme/styles";
import { palette } from "@theme/themes";
import { SCREENS } from "constants";
import { View } from "react-native";

const CreateSubscriptionBtn = () => {
  const userData = useStore((state) => state.userData);
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
