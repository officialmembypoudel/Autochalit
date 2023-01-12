import { SafeAreaView, ScrollView, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Text,
  useTheme,
  useThemeMode,
} from "@rneui/themed";
import ganesh from "../assets/images/headshot.jpg";
import ModeToggler from "../components/ModeToggler";
import MasterBulbsCard from "../components/MasterBulbsCard";
import bulbOff from "../assets/images/bulb-off.png";
import bulbOn from "../assets/images/bulb-on.png";
import lockOff from "../assets/images/lock-off.png";
import BulbControlCard from "../components/BulbControlCard";
import FanControlCard from "../components/FanControlCard";
import TvControlCard from "../components/TvControlCard";
import DoorControl from "../components/DoorControl";
import { LightsContext } from "../context/lightsContext";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/authContext";
import GroundLevelBulbCard from "../components/GroundLevelBulbCard";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { allLightsOn, setAllLightsOn } = useContext(LightsContext);
  const { user } = useContext(AuthContext);
  const { mode, setMode } = useThemeMode();
  const { theme } = useTheme();
  const [groundLights, setGroundLights] = useState(false);
  const [allLights, setAllLights] = useState([
    { uuid: 1, lit: false },
    { uuid: 2, lit: false },
  ]);

  useEffect(() => {
    let allBulbs = allLights.length;
    let litChecker = allLights.filter((light) => light.lit === true).length;
    if (allBulbs > 1 && litChecker > 1 && allBulbs === litChecker) {
      setAllLightsOn(true);
    } else {
      setAllLightsOn(false);
    }
  }, [allLights]);
  console.log(user);
  return (
    <>
      {!user?.name && (
        <View
          style={{
            flex: 1,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            type="clear"
            loading={true}
            color="warning"
            loadingProps={{ size: "large", color: "#dc3545" }}
          />
        </View>
      )}
      {user?.name && (
        <>
          <StatusBar style="auto" />
          <View
            style={{
              flex: 1,
              paddingTop: 60,
              paddingHorizontal: 10,
              backgroundColor: theme.colors.background,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                h3
                h3Style={{
                  fontFamily: "OpenSans_800ExtraBold",
                  fontWeight: "800",
                }}
              >
                {`Welcome, ${user?.name}!`}
              </Text>
              {/* <ModeToggler /> */}

              <Avatar
                rounded
                size="medium"
                source={ganesh}
                containerStyle={{
                  backgroundColor: theme.colors.black,
                  padding: 1,
                  elevation: 3,
                }}
                onPress={() => {
                  navigation.navigate("Settings");
                }}
              />
            </View>

            <Text style={{ fontFamily: "OpenSans_300Light", marginBottom: 20 }}>
              Your Smart Home Dashboard
            </Text>
            {/* <Text
        style={{
          fontFamily: "OpenSans_300Light_Italic",
          fontSize: 12,
          marginLeft: 60,
          color: "#dc3545",
        }}
      >
        - powered by Autochalit
      </Text> */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              overScrollMode="never"
              contentContainerStyle={{ paddingBottom: 30 }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <MasterBulbsCard
                  footerBlock="Lights Off"
                  footerLight="Control All Lights"
                  picture={bulbOff}
                  offColor="rgb(52, 58, 64)"
                  onColor="#74c69d"
                  onPicture={bulbOn}
                  allLights={allLights}
                  setAllLights={setAllLights}
                />
                <DoorControl
                  footerBlock="Locked"
                  footerLight="Control Main Door"
                  picture={lockOff}
                  offColor="#6e1423"
                  onColor="#6e1423"
                />
              </View>
              <Card
                containerStyle={{
                  margin: 0,
                  borderWidth: 0,
                  elevation: 5,
                  borderRadius: 20,
                  backgroundColor:
                    mode === "light" ? theme.colors.background : "#2b2d42",
                  marginVertical: 20,
                }}
              >
                <Text
                  h4
                  h4Style={{
                    fontFamily: "OpenSans_600SemiBold",
                    fontWeight: "600",
                    marginBottom: 20,
                  }}
                >
                  Ground Floor
                </Text>
                <View>
                  <GroundLevelBulbCard
                    uuid={1}
                    onColor="#74c69d"
                    allLights={allLights}
                    setAllLights={setAllLights}
                    topic="groundLight"
                  />
                  <FanControlCard />
                </View>
              </Card>
              <Card
                containerStyle={{
                  margin: 0,
                  borderWidth: 0,
                  elevation: 5,
                  borderRadius: 20,
                  backgroundColor:
                    mode === "light" ? theme.colors.background : "#2b2d42",
                  marginTop: 20,
                }}
              >
                <Text
                  h4
                  h4Style={{
                    fontFamily: "OpenSans_600SemiBold",
                    fontWeight: "600",
                    marginBottom: 20,
                  }}
                >
                  Level 1
                </Text>
                <View>
                  <BulbControlCard
                    uuid={2}
                    onColor="#74c69d"
                    allLights={allLights}
                    setAllLights={setAllLights}
                    topic="level1Light"
                  />
                  <TvControlCard />
                </View>
              </Card>

              <Text
                style={{
                  fontFamily: "OpenSans_400Regular",
                  fontsize: 13,
                  textAlign: "center",
                  marginTop: 50,
                }}
              >
                Powered by Autochalit v4
              </Text>
              <Text
                style={{
                  fontFamily: "OpenSans_300Light_Italic",
                  fontsize: 8,
                  textAlign: "center",
                  // marginTop: 20,
                }}
              >
                Automated House By Memby, Anil, Roshan & Subodh
              </Text>
            </ScrollView>
          </View>
        </>
      )}
    </>
  );
};

export default HomeScreen;
