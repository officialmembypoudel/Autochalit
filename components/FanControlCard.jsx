import { TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Card, Image, Text } from "@rneui/themed";
import fanOff from "../assets/images/fan-off.png";
import fanOn from "../assets/images/fan-on.png";
import { axiosInstance } from "../configs/axiosConfig";
import { Client } from "appwrite";
import { database } from "../configs/appwriteConfig";
// import { client } from "../configs/appwriteConfig";

const FanControlCard = () => {
  const [isFanOn, setIsFanOn] = useState(false);
  const [fanFromCloud, setFanFromCloud] = useState();

  const handleFanCardClick = () => {
    const promise = database.updateDocument(
      "autochalid",
      "appliances",
      "groundFan",
      { state: !isFanOn }
    );

    promise.then(
      function (response) {
        console.log(`fan is ${response.state}`);
      },
      function (error) {
        console.log(error);
      }
    );
  };

  const client = new Client()
    .setEndpoint("https://playground.itsoch.com/v1") // Your API Endpoint
    .setProject("autochalit");

  useEffect(() => {
    const unsuscribe = client.subscribe(
      "databases.autochalid.collections.appliances.documents.groundFan",
      (response) => {
        console.log(response.payload.name);
        setFanFromCloud(response.payload.state);
      }
    );
    console.log("fan realtime suscribe");
    return () => unsuscribe();
  }, []);

  useEffect(() => {
    const promise = database.getDocument(
      "autochalid",
      "appliances",
      "groundFan"
    );

    promise.then(
      function (response) {
        setFanFromCloud(response.state);
      },
      function (error) {
        console.log(error);
      }
    );
  }, []);

  useEffect(() => {
    const fanMqtt = () => {
      axiosInstance
        .get("/mqtt", {
          params: {
            topic: "fan",
            message: fanFromCloud ? "on" : "off",
          },
        })
        .then(function (response) {
          if (response.status === 200) {
            setIsFanOn(fanFromCloud);
            console.log("mfklweegrydug");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    fanMqtt();
  }, [fanFromCloud]);

  console.log("fuck", fanFromCloud);
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
      onPress={handleFanCardClick}
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
