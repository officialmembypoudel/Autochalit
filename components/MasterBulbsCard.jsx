import { TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect } from "react";
import { Card, Image, Text } from "@rneui/themed";
import { Icon } from "@rneui/base";
import { LightsContext } from "../context/lightsContext";
import { client, database } from "../configs/appwriteConfig";
import Loaders from "./Loaders";
import { Query } from "appwrite";
import { AuthContext } from "../context/authContext";

const MasterBulbsCard = ({
  footerBlock,
  footerLight,
  picture,
  onClickCard,
  onColor,
  offColor,
  onPicture,
}) => {
  const { allLightsOn, setAllLightsOn, loading, setLoading, reloader } =
    useContext(LightsContext);
  const { setError } = useContext(AuthContext);

  const handleMasterControl = () => {
    setLoading(true);
    const promise = database.updateDocument(
      "autochalid",
      "appliances",
      "allLights",
      { state: !allLightsOn }
    );

    promise.then(
      function (response) {
        console.log(`All lights is ${response.state}`);
        setAllLightsOn(response.state);
        // if (response.state === false) {
        const groundLight = database.updateDocument(
          "autochalid",
          "appliances",
          "groundLight",
          { state: response.state }
        );
        groundLight.then(
          function () {},
          function (error) {
            setError(error);
            setLoading(false);
          }
        );
        const level1Light = database.updateDocument(
          "autochalid",
          "appliances",
          "level1Light",
          { state: response.state }
        );
        level1Light.then(
          function () {},
          function (error) {
            setError(error);
            setLoading(false);
          }
        );
      },
      // },
      function (error) {
        setError(error);
        setLoading(false);
      }
    );
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
      onPress={!loading && handleMasterControl}
      disabled={loading}
    >
      <Card
        containerStyle={{
          //   width: "48%",
          borderWidth: 0,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: allLightsOn && !loading ? onColor : offColor,
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
          <Icon
            name="circle"
            color={allLightsOn && !loading ? "green" : "#dc3545"}
          />
        </View>
        <View
          style={{ alignItems: "center", marginVertical: 40, marginBottom: 30 }}
        >
          <Image
            resizeMode="contain"
            source={allLightsOn && !loading ? onPicture : picture}
            style={{
              width: 130,
              height: 130,
              marginLeft: "auto",
            }}
          />
        </View>
        {loading && <Loaders />}
        {!loading && (
          <>
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
          </>
        )}
      </Card>
    </TouchableOpacity>
  );
};

export default MasterBulbsCard;
