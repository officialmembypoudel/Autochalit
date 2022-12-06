import { TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { Card, Image, Text } from "@rneui/themed";
import tvOff from "../assets/images/tv-off.png";
import tvOn from "../assets/images/tv-on.png";

const TvControlCard = () => {
  const [isTvOn, setIsTvOn] = useState(false);

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: isTvOn ? "#ffbf69" : "grey",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        elevation: 3,
        marginTop: 20,
      }}
      onPress={() => setIsTvOn(!isTvOn)}
    >
      <Image
        resizeMode="contain"
        source={isTvOn ? tvOn : tvOff}
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
          {isTvOn ? "TV On" : "Tv Off"}
        </Text>
        <Text style={{ fontFamily: "OpenSans_300Light" }}>
          Tap to toogle TV
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default TvControlCard;
