import React from "react";
import { Dialog, Text } from "@rneui/themed";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";

const ModalAlert = ({
  isVisible,
  setIsVisible,
  message,
  title,
  handleClose,
}) => {
  return (
    <Dialog isVisible={isVisible} onBackdropPress={() => setIsVisible(false)}>
      <ExpoStatusBar style="red" />
      <Dialog.Title title={title} />
      <Text>{message}</Text>
      <Dialog.Actions>
        <Dialog.Button
          title="savvy"
          onPress={() => {
            setIsVisible(false);
            handleClose && handleClose();
          }}
        />
      </Dialog.Actions>
    </Dialog>
  );
};

export default ModalAlert;
