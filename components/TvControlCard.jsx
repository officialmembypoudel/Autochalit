import { TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Card, Image, Text } from "@rneui/themed";
import tvOff from "../assets/images/tv-off.png";
import tvOn from "../assets/images/tv-on.png";
import { axiosInstance } from "../configs/axiosConfig";
import { client, database } from "../configs/appwriteConfig";

const TvControlCard = () => {
  const [isTvOn, setIsTvOn] = useState(false);
  const [tvFromCloud, setTvFromCloud] = useState(false);

  const handleTVCardClick = () => {
    const promise = database.updateDocument(
      "autochalid",
      "appliances",
      "level1TV",
      {
        state: !isTvOn,
      }
    );
    promise.then(
      function (response) {
        console.log(`Fan is ${response.state}`);
      },
      function (error) {
        console.log(error);
      }
    );
  };
  useEffect(() => {
    const promise = database.getDocument(
      "autochalid",
      "appliances",
      "level1TV"
    );

    promise.then(
      function (response) {
        setTvFromCloud(response.state);
      },
      function (error) {
        console.log(error);
      }
    );
  }, []);
  useEffect(() => {
    const unsuscribe = client.subscribe(
      "databases.autochalid.collections.appliances.documents.level1TV",
      (response) => {
        console.log(response.payload.name);
        setTvFromCloud(response.payload.state);
      }
    );
    console.log("fan realtime suscribe");
    return () => unsuscribe();
  }, []);

  useEffect(() => {
    const fanMqtt = () => {
      axiosInstance
        .get("/mqtt", {
          params: {
            topic: "tv",
            message: tvFromCloud ? "on" : "off",
          },
        })
        .then(function (response) {
          if (response.status === 200) {
            setIsTvOn(tvFromCloud);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    fanMqtt();
  }, [tvFromCloud]);
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
      onPress={handleTVCardClick}
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
