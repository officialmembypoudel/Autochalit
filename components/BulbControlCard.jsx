import { TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Card, Image, Text } from "@rneui/themed";
import lightOff from "../assets/images/bulb-off.png";
import lightOn from "../assets/images/bulb-on.png";
import { LightsContext } from "../context/lightsContext";

const BulbControlCard = ({
  offColor,
  onColor,
  uuid,
  allLights,
  setAllLights,
}) => {
  const { allLightsOn, setAllLightsOn } = useContext(LightsContext);

  const [isLightOn, setIsLightOn] = useState(false);

  const bulbControl = () => {
    let lit = !isLightOn;
    setIsLightOn(!isLightOn);
    const bulbs = [...allLights, { uuid, lit }];
    const filteredBulbs = [
      ...new Map(bulbs.map((light) => [light["uuid"], light])).values(),
    ];
    setAllLights(filteredBulbs);
  };

  useEffect(() => {
    let thisBulb = allLights.filter((light) => light.uuid === uuid);
    if (thisBulb.length) setIsLightOn(thisBulb[0].lit);
  }, [allLights]);

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: isLightOn || allLightsOn ? onColor : "grey",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        elevation: 3,
      }}
      onPress={bulbControl}
    >
      <Image
        resizeMode="contain"
        source={isLightOn || allLightsOn ? lightOn : lightOff}
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
          {isLightOn || allLightsOn ? "Lights On" : "Lights Off"}
        </Text>
        <Text style={{ fontFamily: "OpenSans_300Light" }}>
          Tap to toogle lights
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default BulbControlCard;
