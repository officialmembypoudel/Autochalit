import {
  ImageBackground,
  Keyboard,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import { Avatar, Button, Input, Text } from "@rneui/base";
import loginBg from "../assets/images/loginBg.jpg";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";
import { account } from "../configs/appwriteConfig";
import { AuthContext } from "../context/authContext";
import { Icon } from "@rneui/base";
import appIcon from "../assets/images/logo-lg-white.png";
import { useTheme } from "@rneui/themed";

const defaultCreds = {
  email: "",
  password: "",
};

const LoginScreen = () => {
  const { setUser, setIsSignedIn, setAuthCheck } = useContext(AuthContext);
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [creds, setCreds] = useState(defaultCreds);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});

  const handleLogin = () => {
    Keyboard.dismiss();
    setLoading(true);
    const promise = account.createEmailSession(creds.email, creds.password);

    promise.then(
      function (response) {
        // navigation.navigate("Home");
        setAuthCheck(true);
        // setUser(response);
        setCreds(defaultCreds);
        setLoading(false);
        setIsSignedIn(true);
      },
      function (error) {
        console.log(error);
        setError(error);
        setLoading(false);
        setAuthCheck(true);
        setIsSignedIn(false);
      }
    );
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
    >
      <ImageBackground
        source={loginBg}
        style={{ flex: 1, justifyContent: "flex-end", position: "relative" }}
        resizeMode="cover"
      >
        <Avatar
          size="large"
          rounded
          source={appIcon}
          containerStyle={{
            backgroundColor: "#1a1a1a",
            padding: 8,
            // marginBottom: 40,
            position: "absolute",
            top: 40,
            right: 20,
          }}
          imageProps={{ resizeMode: "contain", resizeMethod: "scale" }}
        />
        <BlurView
          intensity={85}
          tint={"dark"}
          style={{
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingHorizontal: 30,
            paddingVertical: 30,
          }}
        >
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text
              h3
              h3Style={{
                fontFamily: "OpenSans_600SemiBold",
                fontWeight: "600",
                //   fontSize: 30,
                color: "#f4f4f4",
              }}
            >
              Welcome!
            </Text>
            <View style={{ marginTop: 30 }}>
              <Input
                value={creds.email}
                placeholder="yourname@mail.com"
                containerStyle={{
                  paddingHorizontal: 0,
                }}
                inputContainerStyle={{
                  borderBottomWidth: 0,
                  padding: 10,
                  borderRadius: 8,
                  backgroundColor: "#f4f4f4",
                }}
                style={{ fontFamily: "OpenSans_400Regular" }}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(text) => {
                  setError({});
                  setCreds({ ...creds, email: text });
                }}
                leftIcon={<Icon name="email" type="fontisto" />}
              />
              <Input
                value={creds.password}
                placeholder="password"
                containerStyle={{
                  paddingHorizontal: 0,
                }}
                inputContainerStyle={{
                  borderBottomWidth: 0,
                  padding: 10,
                  borderRadius: 8,
                  backgroundColor: "#f4f4f4",
                }}
                style={{ fontFamily: "OpenSans_400Regular" }}
                secureTextEntry={true}
                onChangeText={(text) => {
                  setError({});
                  setCreds({ ...creds, password: text });
                }}
                leftIcon={<Icon name="lock-closed-outline" type="ionicon" />}
              />
            </View>
            {error.message && (
              <Text
                style={{
                  fontFamily: "OpenSans_500Medium",
                  color: "#f45b69",
                  marginBottom: 10,
                }}
              >
                {error.message}
              </Text>
            )}
            <Button
              disabled={Boolean(
                !creds.email || !creds.password || error.message
              )}
              disabledStyle={{ backgroundColor: "grey" }}
              loading={loading}
              title="Login"
              color="success"
              containerStyle={{ borderRadius: 8 }}
              size="lg"
              buttonStyle={{ padding: 15, backgroundColor: "#274c77" }}
              titleStyle={{
                color: "#f4f4f4",
                fontFamily: "OpenSans_500Medium",
              }}
              onPress={handleLogin}
            />
            <Button
              title="I don't have an Account!"
              color="warning"
              containerStyle={{ borderRadius: 8, marginVertical: 30 }}
              size="lg"
              buttonStyle={{
                padding: 15,
                borderColor: "#f4f4f4",
                //   borderWidth: 2,
                borderRadius: 8,
              }}
              titleStyle={{
                color: "#f4f4f4",
                fontFamily: "OpenSans_400Regular",
              }}
              type="outline"
              onPress={() => navigation.navigate("Register")}
            />
            <Text
              style={{
                textAlign: "center",
                color: "#f4f4f4",
                fontFamily: "OpenSans_300Light",
              }}
            >
              Autochalit v10, an inovative IoT project, Year 2, 2022
            </Text>
          </ScrollView>
        </BlurView>
      </ImageBackground>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
