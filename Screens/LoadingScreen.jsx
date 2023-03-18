import { View } from "react-native";
import React from "react";
import { Button } from "@rneui/themed";

const LoadingScreen = () => {
  return (
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
  );
};

export default LoadingScreen;
