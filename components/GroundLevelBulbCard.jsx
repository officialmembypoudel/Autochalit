import { TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Card, Image, Text } from "@rneui/themed";
import lightOff from "../assets/images/bulb-off.png";
import lightOn from "../assets/images/bulb-on.png";
import { LightsContext } from "../context/lightsContext";
import { axiosInstance } from "../configs/axiosConfig";
import { client, database } from "../configs/appwriteConfig";

const GroundLevelBulbCard = ({
  offColor,
  onColor,
  uuid,
  allLights,
  setAllLights,
  topic,
}) => {
  const { setReloader, reloader } = useContext(LightsContext);
  const [isLightOn, setIsLightOn] = useState(false);
  const [lightState, setLightState] = useState(false);

  const bulbControl = () => {
    const promise = database.updateDocument("autochalid", "appliances", topic, {
      state: !isLightOn,
    });

    promise.then(
      function (response) {
        // console.log(`${topic} is ${response.state}`);
      },
      function (error) {
        // console.log(error);
      }
    );
  };

  useEffect(() => {
    const promise = database.getDocument("autochalid", "appliances", topic);
    promise.then(
      function (response) {
        setLightState(response.state);
      },
      function (error) {
        // console.log(error);
      }
    );
  }, []);

  useEffect(() => {
    const unsuscribe = client.subscribe(
      `databases.autochalid.collections.appliances.documents.${topic}`,
      (response) => {
        // console.log(response.payload.$updatedAt, "assdfghjkhgfdg");
        setLightState(response.payload.state);
        setReloader(response.payload.$updatedAt);
      }
    );
    console.log(`${topic} realtime suscribe`, reloader);
    return () => unsuscribe();
  }, []);

  useEffect(() => {
    const lightMqtt = () => {
      axiosInstance
        .get("/mqtt", {
          params: {
            topic,
            message: lightState ? "on" : "off",
          },
        })
        .then(function (response) {
          if (response.status === 200) {
            setIsLightOn(lightState);
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    };
    lightMqtt();
  }, [lightState]);

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: lightState ? onColor : "grey",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        elevation: 3,
      }}
      onPress={bulbControl}
    >
      <Image
        resizeMode="contain"
        source={lightState ? lightOn : lightOff}
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
          {lightState ? "Lights On" : "Lights Off"}
        </Text>
        <Text style={{ fontFamily: "OpenSans_300Light" }}>
          Tap to toogle lights
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default GroundLevelBulbCard;
