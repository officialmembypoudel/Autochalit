import React from "react";
import { Button } from "@rneui/themed";

const Loaders = () => {
  return (
    <Button loading size="md" loadingProps={{ size: "large" }} type="clear" />
  );
};

export default Loaders;
