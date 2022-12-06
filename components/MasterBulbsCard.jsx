import { TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect } from "react";
import { Card, Image, Text } from "@rneui/themed";
import { Icon } from "@rneui/base";
import { LightsContext } from "../context/lightsContext";

const MasterBulbsCard = ({
  footerBlock,
  footerLight,
  picture,
  onClickCard,
  onColor,
  offColor,
  onPicture,
  allLights,
  setAllLights,
}) => {
  const { allLightsOn, setAllLightsOn } = useContext(LightsContext);

  const handleMasterControl = () => {
    setAllLightsOn(!allLightsOn);
    if (allLights.length) {
      let newarray = allLights;
      let newState = newarray.map((light) => {
        return { ...light, lit: !allLightsOn };
      });
      setAllLights(newState);
    }
  };

  return (
    <TouchableOpacity
      style={{
        elevation: 5,
        backgroundColor: "rgba(255,255,255,0)",
        width: "48%",
        marginVertical: 20,
        borderRadius: 21,
      }}
      onPress={handleMasterControl}
    >
      <Card
        containerStyle={{
          //   width: "48%",
          borderWidth: 0,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: allLightsOn ? onColor : offColor,
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
          <Icon name="circle" color={allLightsOn ? "green" : "#dc3545"} />
        </View>
        <View
          style={{ alignItems: "center", marginVertical: 40, marginBottom: 30 }}
        >
          <Image
            resizeMode="contain"
            source={allLightsOn ? onPicture : picture}
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
          {allLightsOn ? "Lights On" : footerBlock}
        </Text>
      </Card>
    </TouchableOpacity>
  );
};

export default MasterBulbsCard;
