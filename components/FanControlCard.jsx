import { TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Image, Text } from "@rneui/themed";
import fanOff from "../assets/images/fan-off.png";
import fanOn from "../assets/images/power-on.png";
import { axiosInstance } from "../configs/axiosConfig";
import { Client } from "appwrite";
import { database } from "../configs/appwriteConfig";
import { AuthContext } from "../context/authContext";
// import { client } from "../configs/appwriteConfig";

const FanControlCard = () => {
  const { refreshing, setRefreshing, setError } = useContext(AuthContext);

  const [isFanOn, setIsFanOn] = useState(false);
  const [fanFromCloud, setFanFromCloud] = useState();
  const [loading, setLoading] = useState(true);

  const handleFanCardClick = () => {
    setLoading(true);
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
        setError(error);
        setLoading(false);
        // console.log(error.message);
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
        setError(error);
      }
    );
  }, [refreshing]);

  useEffect(() => {
    const fanMqtt = () => {
      axiosInstance
        .get("/mqtt", {
          params: {
            topic: "powerSocket",
            message: !isFanOn ? "on" : "off",
          },
        })
        .then(function (response) {
          if (response.status === 200) {
            setIsFanOn(fanFromCloud);
            setLoading(false);
          }
        })
        .catch(function (error) {
          setError(error);
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
        backgroundColor: isFanOn ? "#4a8fe7" : "grey",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        elevation: 3,
        marginTop: 20,
      }}
      onPress={handleFanCardClick}
      disabled={loading}
    >
      <Image
        resizeMode="contain"
        source={isFanOn ? fanOn : fanOff}
        style={{ width: 50, height: 50 }}
      />
      <View>
        {loading && (
          <Button
            loading
            size="md"
            loadingProps={{ size: "large" }}
            type="clear"
          />
        )}
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
              {isFanOn ? "Power Socket On" : "Power Socket Off"}
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

export default FanControlCard;
