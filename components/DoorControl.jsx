import { TouchableOpacity, View } from "react-native";
import React, { useContext, useState } from "react";
import { Card, Image, Text } from "@rneui/themed";
import { Icon } from "@rneui/base";
import { LightsContext } from "../context/lightsContext";
import unlockedPNG from "../assets/images/unlocked.png";

const DoorControl = ({
  footerBlock,
  footerLight,
  picture,
  onClickCard,
  onColor,
  offColor,
}) => {
  const [isDoorOpen, setIsDoorOpen] = useState(false);

  return (
    <TouchableOpacity
      style={{
        elevation: 5,
        backgroundColor: "rgba(255,255,255,0)",
        width: "48%",
        marginVertical: 20,
        borderRadius: 21,
      }}
      onPress={() => setIsDoorOpen(!isDoorOpen)}
    >
      <Card
        containerStyle={{
          //   width: "48%",
          borderWidth: 0,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isDoorOpen ? "#ffd972" : offColor,
          borderRadius: 20,
          margin: 0,
          position: "relative",
          elevation: 0,
        }}
      >
        <View
          style={{
            position: "absolute",
            top: -5,
            right: -15,
          }}
        >
          <Icon name="circle" color={isDoorOpen ? "green" : "#dc3545"} />
        </View>
        <View
          style={{ alignItems: "center", marginVertical: 40, marginBottom: 30 }}
        >
          <Image
            resizeMode="contain"
            source={isDoorOpen ? unlockedPNG : picture}
            style={{
              width: 130,
              height: 130,
              marginLeft: "auto",
            }}
          />
        </View>
        <Text
          style={{
            fontFamily: "OpenSans_300Light",
            color: "#6c757d",
            textAlign: "center",
          }}
        >
          {footerLight}
        </Text>
        <Text
          h4
          h4Style={{
            fontFamily: "OpenSans_600SemiBold",
            fontWeight: "600",
            color: "#6c757d",
            textAlign: "center",
          }}
        >
          {isDoorOpen ? "Door Open" : footerBlock}
        </Text>
      </Card>
    </TouchableOpacity>
  );
};

export default DoorControl;
