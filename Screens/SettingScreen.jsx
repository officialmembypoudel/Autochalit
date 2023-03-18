import { ScrollView, StyleSheet, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Card,
  Divider,
  Icon,
  Text,
  useTheme,
  useThemeMode,
} from "@rneui/themed";
import { AuthContext } from "../context/authContext";
import userImg from "../assets/images/headshot.jpg";
import { Button } from "@rneui/base";
import NetInfo from "@react-native-community/netinfo";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { mode, setMode } = useThemeMode();
  const { user, logOut } = useContext(AuthContext);
  const [connection, setConnection] = useState({ type: "" });

  // console.log(user);
  useEffect(() => {
    const unsuscribe = NetInfo.addEventListener((state) => {
      setConnection(state);
      // console.log(state);
    });
    // unsuscribe();
  }, []);
  // console.log

  const handleModeChange = async (mode) => {
    try {
      await AsyncStorage.setItem("@mode", mode);
    } catch (error) {}
  };

  return (
    <ScrollView
      style={{
        backgroundColor: theme.theme.colors.background,
        flex: 1,
        paddingTop: 20,
        paddingHorizontal: 10,
      }}
    >
      <Avatar
        source={userImg}
        rounded
        size="xlarge"
        containerStyle={{
          alignSelf: "center",
          borderWidth: 2,
          borderColor: theme.theme.colors.primary,
          padding: 3,
        }}
      />
      <Text
        style={{
          fontFamily: "OpenSans_600SemiBold",
          fontSize: 25,
          textAlign: "center",
          marginTop: 10,
        }}
      >
        {user?.name}
      </Text>
      <Text
        style={{
          fontFamily: "OpenSans_600SemiBold",
          fontSize: 18,
          marginTop: 20,
        }}
      >
        Account
      </Text>
      <Divider style={{ marginVertical: 5 }} />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 5,
        }}
      >
        <Icon
          name="email"
          type="fontisto"
          style={{ marginRight: 10 }}
          size={20}
        />
        <Text
          style={{
            fontFamily: "OpenSans_400Regular",
            fontSize: 16,
            // marginTop: 20,
          }}
        >
          {user?.email}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 5,
        }}
      >
        <Icon
          name="phone"
          type="simple-line-icon"
          style={{ marginRight: 10 }}
          size={20}
        />
        <Text
          style={{
            fontFamily: "OpenSans_400Regular",
            fontSize: 16,
            // marginTop: 20,
          }}
        >
          {user?.phone}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 5,
        }}
      >
        <Icon
          name="history"
          // type="octicon"
          style={{ marginRight: 10 }}
          size={20}
        />
        <Text
          style={{
            fontFamily: "OpenSans_400Regular",
            fontSize: 16,
            // marginTop: 20,
          }}
        >
          {`Registered on ${new Date(user?.registration).toDateString()}`}
        </Text>
      </View>
      <Text
        style={{
          fontFamily: "OpenSans_600SemiBold",
          fontSize: 18,
          marginTop: 20,
        }}
      >
        Settings
      </Text>
      <Divider style={{ marginVertical: 5 }} />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginVertical: 5,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            // marginVertical: 5,
          }}
        >
          <Icon
            name="moon"
            type="ionicon"
            style={{ marginRight: 10 }}
            size={20}
          />
          <Text
            style={{
              fontFamily: "OpenSans_400Regular",
              fontSize: 16,
              // marginTop: 20,
            }}
          >
            Dark Mode
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginVertical: 5,
          }}
        >
          <Button
            title="off"
            titleStyle={{ fontFamily: "OpenSans_500Medium" }}
            type={mode === "dark" ? "clear" : "solid"}
            color="primary"
            onPress={() => {
              handleModeChange("light");
              setMode("light");
            }}
            buttonStyle={{ borderRadius: 10, padding: 3, margin: 0 }}
          />
          <Button
            title="on"
            type={mode === "light" ? "clear" : "solid"}
            titleStyle={{ fontFamily: "OpenSans_500Medium" }}
            color="success"
            onPress={() => {
              handleModeChange("dark");
              setMode("dark");
            }}
            buttonStyle={{ borderRadius: 10, padding: 3, margin: 0 }}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginVertical: 5,
        }}
      >
        <Icon
          name={
            connection?.type !== "none" ? connection?.type : "cloud-offline"
          }
          type="ionicon"
          style={{ marginRight: 10 }}
          size={20}
        />
        <Text
          style={{
            fontFamily: "OpenSans_400Regular",
            fontSize: 16,
            // marginTop: 20,
          }}
        >
          {connection.type !== "none"
            ? `Connected to ${connection?.type}`
            : "No connection"}
        </Text>
      </View>

      <Button
        title="Logout"
        titleStyle={{ fontFamily: "OpenSans_500Medium" }}
        color="error"
        radius={5}
        buttonStyle={{
          padding: 13,
          width: "100%",
          alignSelf: "center",
          marginTop: 60,
        }}
        onPress={() => {
          logOut();
          // navigation.navigate("Login");
        }}
      />
    </ScrollView>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({});
