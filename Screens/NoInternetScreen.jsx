import { Button, Text } from "@rneui/base";
import { Image, View } from "react-native";
import noInternetImg from "../assets/images/no-internet.png";
import Loaders from "../components/Loaders";

const NoInternetScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-between",
        // alignItems: "center",
        backgroundColor: "#9197ae",
        // width: "100%",
        paddingHorizontal: 10,
        paddingBottom: 30,
        paddingTop: 70,
      }}
    >
      <View style={{ width: "100%", alignItems: "center" }}>
        <Image
          source={noInternetImg}
          style={{ width: "90%", height: 400 }}
          resizeMode="contain"
        />
        <Text
          h4
          h4Style={{
            textAlign: "center",
            color: "#273043",
            fontFamily: "OpenSans_600SemiBold",
            fontWeight: "600",
            textDecorationLine: "line-through",
          }}
        >
          Your Device is Not Connected to Internet
        </Text>
      </View>
      <Button
        title="Connecting"
        titleStyle={{
          color: "#273043",
          fontFamily: "OpenSans_600SemiBold",
          fontSize: 18,
        }}
        icon={
          <Button
            loading
            type="clear"
            loadingProps={{ size: "large", color: "#273043" }}
            buttonStyle={{ padding: 0 }}
          />
        }
        type="outline"
        buttonStyle={{
          borderColor: "#273043",
          justifyContent: "space-between",
          marginHorizontal: 20,
          //   paddingLeft: 30,
        }}
        iconPosition="right"
        size="md"
        radius={5}
      />
    </View>
  );
};

export default NoInternetScreen;
