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

const BulbControlCard = ({ offColor, onColor, topic }) => {
  const { setReloader, reloader, loading } = useContext(LightsContext);
  const { refreshing, setRefreshing, setError } = useContext(AuthContext);
  const [isLightOn, setIsLightOn] = useState(false);
  const [lightState, setLightState] = useState(false);
  const [loadingLevel1, setLoadingLevel1] = useState(true);

  const bulbControl = () => {
    setLoadingLevel1(true);
    const promise = database.updateDocument("autochalid", "appliances", topic, {
      state: !isLightOn,
    });

    promise.then(
      function (response) {
        // console.log(`${topic} is ${response.state}`);
      },
      function (error) {
        // console.log(error);
        setError(error);
        setLoadingLevel1(false);
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
        // console.log(error);
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
    // console.log(`${topic} realtime suscribe`, reloader);
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
            setLoadingLevel1(false);
          }
        })
        .catch(function (error) {
          // console.log(error);
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
        backgroundColor: lightState ? onColor : "grey",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        elevation: 3,
      }}
      onPress={(!loadingLevel1 || !loading) && bulbControl}
      disabled={loadingLevel1 || loading}
    >
      <Image
        resizeMode="contain"
        source={lightState && !loading && !loadingLevel1 ? lightOn : lightOff}
        style={{ width: 50, height: 50 }}
      />
      <View>
        {loadingLevel1 || (loading && <Loaders />)}
        {!loadingLevel1 && !loading && (
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
              {lightState && !loading && !loadingLevel1
                ? "Lights On"
                : "Lights Off"}
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

export default BulbControlCard;
