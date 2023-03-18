import React, { useCallback, useContext, useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

import { Dialog, Text } from "@rneui/themed";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import { AuthContext } from "../../context/authContext";

const GetPutErrorModal = () => {
  const { refreshing, setRefreshing, setError, error } =
    useContext(AuthContext);

  const [connection, setConnection] = useState({ type: "" });

  useEffect(() => {
    const unsuscribe = NetInfo.addEventListener((state) => {
      setConnection(state);
      // console.log(state);
    });
    // unsuscribe();
  }, []);
  const handleClose = useCallback(() => {
    setError({});
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  });

  //   console.log(error.message);
  return (
    <Dialog
      isVisible={error.message !== undefined}
      onBackdropPress={handleClose}
      statusBarTranslucent
      style={{ backgroundColor: "#dc3545" }}
      overlayStyle={{ backgroundColor: "#dc3545", borderRadius: 15 }}
    >
      <Dialog.Title
        title="We Encountered an Error!"
        titleStyle={{
          fontFamily: "OpenSans_700Bold",
          fontWeight: "600",
          color: "#f4f4f4",
        }}
      />
      <Text style={{ fontFamily: "OpenSans_600SemiBold", color: "#f4f4f4" }}>
        {error.message}
      </Text>

      {!connection.isInternetReachable && (
        <Text
          style={{
            fontFamily: "OpenSans_600SemiBold",
            color: "#f4f4f4",
            marginTop: 5,
          }}
        >
          {connection.type !== "none"
            ? `Connected to ${connection.type} with out internet connection.`
            : "You are not connected to the internet!"}
        </Text>
      )}
      <Dialog.Actions>
        <Dialog.Button
          title="savvy"
          onPress={handleClose}
          titleStyle={{
            fontFamily: "OpenSans_700Bold",
            color: "#f4f4f4",
          }}
          type="solid"
          color="#6f9ceb"
          buttonStyle={{ borderColor: "#6f9ceb", padding: 4 }}
          radius={5}
        />
      </Dialog.Actions>
    </Dialog>
  );
};

export default GetPutErrorModal;
