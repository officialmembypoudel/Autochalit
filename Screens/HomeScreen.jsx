import { RefreshControl, SafeAreaView, ScrollView, View } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Text,
  useTheme,
  useThemeMode,
} from "@rneui/themed";
import ganesh from "../assets/images/headshot.jpg";
import MasterBulbsCard from "../components/MasterBulbsCard";
import bulbOff from "../assets/images/bulb-off.png";
import bulbOn from "../assets/images/bulb-on.png";
import lockOff from "../assets/images/lock-off.png";
import BulbControlCard from "../components/BulbControlCard";
import FanControlCard from "../components/FanControlCard";
import TvControlCard from "../components/PowerSocketCard";
import DoorControl from "../components/DoorControl";
import { LightsContext } from "../context/lightsContext";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/authContext";
import GroundLevelBulbCard from "../components/GroundLevelBulbCard";
import GetPutErrorModal from "../components/alerts/GetPutErrorModal";
import { getFirstNameFromFullName } from "../helperFunctions";
import PowerSocketCard from "../components/PowerSocketCard";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, refreshing, setRefreshing } = useContext(AuthContext);
  const { mode, setMode } = useThemeMode();
  const { theme } = useTheme();

  const refreshControl = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  });

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
                  fontFamily: "OpenSans_700Bold",
                  fontWeight: "600",
                }}
              >
                {`Welcome, ${getFirstNameFromFullName(user?.name)}!`}
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
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={refreshControl}
                />
              }
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
                  <GroundLevelBulbCard onColor="#74c69d" topic="groundLight" />
                  {/* <PowerSocketCard /> */}
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
                  <BulbControlCard onColor="#74c69d" topic="level1Light" />
                  <PowerSocketCard />
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
                Powered by Autochalit v9
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
          <GetPutErrorModal />
        </>
      )}
    </>
  );
};

export default HomeScreen;
