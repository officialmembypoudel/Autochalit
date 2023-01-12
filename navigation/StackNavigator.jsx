import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  const { user, loading, isSignedIn } = useContext(AuthContext);
  const { theme } = useTheme();
  return (
    <>
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
              </Stack.Group>
            )}
            {isSignedIn && (
              <Stack.Group>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen
                  name="Settings"
                  options={{
                    headerShown: true,
                    headerStyle: { backgroundColor: theme.colors.background },
                    headerTitleStyle: { color: theme.colors.black },
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
