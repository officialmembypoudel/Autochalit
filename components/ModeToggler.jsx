import { View } from "react-native";
import React, { useState } from "react";
import { Switch, useThemeMode } from "@rneui/themed";

const ModeToggler = () => {
  const { mode, setMode } = useThemeMode();

  const [themeMode, setThemeMode] = useState("light");
  const [isToggled, setIsToggled] = useState(false);

  const handleMode = (state) => {
    setMode(isToggled ? "light" : "dark");
  };
  return (
    <View>
      <Switch
        value={isToggled}
        onChange={(value) => {
          // setThemeMode(themeMode === 'light' ? 'dark' : 'light')
          handleMode(value.nativeEvent.value);
          setIsToggled(!isToggled);
        }}
      />
    </View>
  );
};

export default ModeToggler;
