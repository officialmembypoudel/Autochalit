import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NetInfo from "@react-native-community/netinfo";

import { Button } from "@rneui/base";
import { Icon, Text, useTheme } from "@rneui/themed";
import { useContext, useEffect, useState } from "react";
import { View } from "react-native";
import { account } from "../configs/appwriteConfig";
import { AuthContext } from "../context/authContext";
import HomeScreen from "../Screens/HomeScreen";
import LoginScreen from "../Screens/LoginScreen";
import RegisterScreen from "../Screens/RegisterScreen";
import SettingScreen from "../Screens/SettingScreen";
import NoInternetScreen from "../Screens/NoInternetScreen";
import LoadingScreen from "../Screens/LoadingScreen";
import EdinUserInfoScreen from "../Screens/EdinUserInfoScreen";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  const { user, loading, isSignedIn } = useContext(AuthContext);
  const { theme } = useTheme();
  const [connection, setConnection] = useState({ type: "" });

  useEffect(() => {
    const unsuscribe = NetInfo.addEventListener((state) => {
      setConnection(state);
      // console.log(state);
    });
    // unsuscribe();
  }, []);

  return (
    <>
      {/* {!connection.isInternetReachable && (
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="NoInternet" component={NoInternetScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      )} */}
      {loading && (
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

      {!loading && (
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!isSignedIn && (
              <Stack.Group>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen
                  name="Information"
                  component={EdinUserInfoScreen}
                />
              </Stack.Group>
            )}
            {user?.name === undefined && isSignedIn && (
              <Stack.Screen name="Loading" component={LoadingScreen} />
            )}
            {user.name !== undefined && isSignedIn && (
              <Stack.Group>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen
                  name="Settings"
                  options={{
                    headerShown: true,
                    headerStyle: { backgroundColor: theme.colors.background },
                    headerTitleStyle: {
                      color: theme.colors.black,
                      fontFamily: "OpenSans_700Bold",
                      fontWeight: "600",
                    },
                    headerTintColor: theme.colors.black,
                  }}
                  component={SettingScreen}
                />
              </Stack.Group>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </>
  );
}
