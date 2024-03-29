import { TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Card, Image, Text } from "@rneui/themed";
import lightOff from "../assets/images/bulb-off.png";
import lightOn from "../assets/images/bulb-on.png";
import { LightsContext } from "../context/lightsContext";
import { axiosInstance } from "../configs/axiosConfig";
import { client, database } from "../configs/appwriteConfig";
import Loaders from "./Loaders";
import { AuthContext } from "../context/authContext";

const GroundLevelBulbCard = ({ offColor, onColor, topic }) => {
  const { refreshing, setRefreshing, setError } = useContext(AuthContext);
  const { setReloader, reloader, loading } = useContext(LightsContext);
  const [isLightOn, setIsLightOn] = useState(false);
  const [lightState, setLightState] = useState(false);
  const [loadingGround, setLoadingGround] = useState(true);

  const bulbControl = () => {
    setLoadingGround(true);
    const promise = database.updateDocument("autochalid", "appliances", topic, {
      state: !isLightOn,
    });

    promise.then(
      function (response) {
        // console.log(`${topic} is ${response.state}`);
      },
      function (error) {
        setError(error);
        setLoadingGround(false);
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
        setError(error);
      }
    );
  }, [refreshing]);

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
            setLoadingGround(false);
          }
        })
        .catch(function (error) {
          setError(error);
        });
    };
    lightMqtt();
  }, [lightState, refreshing]);

  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor:
          lightState && !loading && !loadingGround ? onColor : "grey",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        elevation: 3,
      }}
      onPress={(!loadingGround || !loading) && bulbControl}
      disabled={loadingGround || loading}
    >
      <Image
        resizeMode="contain"
        source={lightState && !loading && !loadingGround ? lightOn : lightOff}
        style={{ width: 50, height: 50 }}
      />
      <View>
        {loadingGround || (loading && <Loaders />)}
        {!loadingGround && !loading && (
          <>
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
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default GroundLevelBulbCard;
