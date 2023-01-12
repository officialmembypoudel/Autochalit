import { TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Card, Image, Text } from "@rneui/themed";
import { Icon } from "@rneui/base";
import { LightsContext } from "../context/lightsContext";
import unlockedPNG from "../assets/images/unlocked.png";
import { axiosInstance } from "../configs/axiosConfig";
import { client, database } from "../configs/appwriteConfig";

const DoorControl = ({
  footerBlock,
  footerLight,
  picture,
  onClickCard,
  onColor,
  offColor,
}) => {
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [doorFromCloud, setDoorFromCloud] = useState(false);

  const handleDoorCardClick = () => {
    const promise = database.updateDocument(
      "autochalid",
      "appliances",
      "mainDoor",
      { state: !isDoorOpen }
    );

    promise.then(
      function (response) {
        console.log("door is", response.state);
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
      "mainDoor"
    );

    promise.then(
      function (response) {
        setDoorFromCloud(response.state);
      },
      function (error) {
        console.log(error);
      }
    );
  }, []);

  useEffect(() => {
    const unsuscribe = client.subscribe(
      "databases.autochalid.collections.appliances.documents.mainDoor",
      (response) => {
        console.log(response.payload.name);
        setDoorFromCloud(response.payload.state);
      }
    );
    console.log("door realtime suscribe");
    return () => unsuscribe();
  }, []);

  useEffect(() => {
    const doorMqtt = () => {
      axiosInstance
        .get("/mqtt", {
          params: { topic: "door", message: doorFromCloud ? "on" : "off" },
        })
        .then(function (response) {
          console.log(response);
          if (response.status === 200) {
            setIsDoorOpen(doorFromCloud);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    };
    doorMqtt();
  }, [doorFromCloud]);
  return (
    <TouchableOpacity
      style={{
        elevation: 5,
        backgroundColor: "rgba(255,255,255,0)",
        width: "48%",
        marginVertical: 20,
        borderRadius: 21,
      }}
      onPress={handleDoorCardClick}
    >
      <Card
        containerStyle={{
          //   width: "48%",
          borderWidth: 0,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: doorFromCloud ? "#ffd972" : offColor,
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
          <Icon name="circle" color={doorFromCloud ? "green" : "#dc3545"} />
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
          {doorFromCloud ? "Door Open" : footerBlock}
        </Text>
      </Card>
    </TouchableOpacity>
  );
};

export default DoorControl;
