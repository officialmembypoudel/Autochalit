import { TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Card, Image, Text } from "@rneui/themed";
import tvOff from "../assets/images/tv-off.png";
import powerOn from "../assets/images/power-on.png";
import { axiosInstance } from "../configs/axiosConfig";
import { client, database } from "../configs/appwriteConfig";
import Loaders from "./Loaders";
import { AuthContext } from "../context/authContext";

const PowerSocketCard = () => {
  const { refreshing, setRefreshing, setError } = useContext(AuthContext);
  const [isPowerOn, setIsPowerOn] = useState(false);
  const [powerFromCloud, setPowerFromCloud] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleTVCardClick = () => {
    setLoading(true);
    const promise = database.updateDocument(
      "autochalid",
      "appliances",
      "level1PS",
      {
        state: !isPowerOn,
      }
    );
    promise.then(
      function (response) {
        // console.log(`Fan is ${response.state}`);
      },
      function (error) {
        setError(error);
        setLoading(false);
      }
    );
  };
  useEffect(() => {
    const promise = database.getDocument(
      "autochalid",
      "appliances",
      "level1PS"
    );

    promise.then(
      function (response) {
        setPowerFromCloud(response.state);
      },
      function (error) {
        setError(error);
      }
    );
  }, [refreshing]);
  useEffect(() => {
    const unsuscribe = client.subscribe(
      "databases.autochalid.collections.appliances.documents.level1PS",
      (response) => {
        setPowerFromCloud(response.payload.state);
      }
    );
    // console.log("fan realtime suscribe");
    return () => unsuscribe();
  }, []);

  useEffect(() => {
    const fanMqtt = () => {
      axiosInstance
        .get("/mqtt", {
          params: {
            topic: "powerSocket",
            message: powerFromCloud ? "on" : "off",
          },
        })
        .then(function (response) {
          if (response.status === 200) {
            setIsPowerOn(powerFromCloud);
            setLoading(false);
          }
        })
        .catch(function (error) {
          setError(error);
        });
    };
    fanMqtt();
  }, [powerFromCloud]);
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: isPowerOn && !loading ? "#ffbf69" : "grey",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        elevation: 3,
        marginTop: 20,
      }}
      onPress={!loading && handleTVCardClick}
      disabled={loading}
    >
      <Image
        resizeMode="contain"
        source={isPowerOn && !loading ? powerOn : powerOn}
        style={{ width: 50, height: 50 }}
      />
      <View>
        {loading && <Loaders />}
        {!loading && (
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
              {isPowerOn ? "Power Socket On" : "Power Socket Off"}
            </Text>
            <Text style={{ fontFamily: "OpenSans_300Light" }}>
              Tap to toogle Power Socket
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default PowerSocketCard;
