import { TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Card, Image, Text } from "@rneui/themed";
import fanOff from "../assets/images/fan-off.png";
import fanOn from "../assets/images/fan-on.png";

const FanControlCard = () => {
  const [isFanOn, setIsFanOn] = useState(false);
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: isFanOn ? "#ccdbfd" : "grey",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        elevation: 3,
        marginTop: 20,
      }}
      onPress={() => setIsFanOn(!isFanOn)}
    >
      <Image
        resizeMode="contain"
        source={isFanOn ? fanOn : fanOff}
        style={{ width: 50, height: 50 }}
      />
      <View>
        <Text
          h4
          h4Style={{
            fontFamily: "OpenSans_500Medium",
            fontWeight: "500",
            fontSize: 18,
            textAlign: "right",
          }}
        >
          {isFanOn ? "Fan On" : "Fan Off"}
        </Text>
        <Text style={{ fontFamily: "OpenSans_300Light" }}>
          Tap to toogle Fan
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default FanControlCard;
