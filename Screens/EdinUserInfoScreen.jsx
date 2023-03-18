import {
  ImageBackground,
  Keyboard,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Avatar, Button, Icon, Input, Text } from "@rneui/base";
import registerBg from "../assets/images/registerBg.jpg";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";
import { account, database, storage } from "../configs/appwriteConfig";
import uuid from "react-native-uuid";
import { AuthContext } from "../context/authContext";
import ModalAlert from "../components/alerts/ModalAlert";
import { imageURLGenerator } from "../helperFunctions";

const defaultUser = { name: "", email: "", code: null, password: "" };

const code = 1298;

const EdinUserInfoScreen = ({ route: { params } }) => {
  const navigation = useNavigation();
  const { user, setUser } = useContext(AuthContext);
  const [newUser, setNewUser] = useState(user);
  const [loading, setLoading] = useState(false);
  const [invalidCode, setInvalidCode] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(true);
  const [serverError, SetServerError] = useState(false);
  const [serverErrorMsg, SetServerErrorMsg] = useState("");
  const [invalidInputs, setInvalidInputs] = useState({
    name: false,
    code: false,
  });
  const [image, setImage] = useState(null);
  const [magetoupload, setImagetoupload] = useState(null);

  const handleUpdateUserInfo = () => {
    Keyboard.dismiss();

    if (image) {
      let uriParts = image.uri.split(".");
      let fileType = uriParts[uriParts.length - 1];

      let formData = new FormData();
      let file = new File("[kandfo]", "photo", {
        uri: image.uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });

      console.log(typeof file);
      const promise = storage.createFile(
        "63be679edce6e5f97d09",
        uuid.v4(),
        file
      );

      promise.then(
        function (response) {
          const createUserRecord = database.createDocument(
            "autochalid",
            "userInfo",
            uuid.v4(),
            {
              name: newUser.name,
              email: "test@test.com",
              userId: newUser.userId,
              phone: newUser.phone,
              address: newUser.address,
              imageId: response.$id,
            }
          );

          createUserRecord.then(
            function (success) {
              //   navigation.navigate("Home");
              setLoading(false);
            },
            function (recordError) {
              setLoading(false);
              console.log("create record error", recordError);
              SetServerError(true);
              SetServerErrorMsg(recordError.message);
            }
          );
        },
        function (error) {
          setLoading(false);
          console.log("create photo record error", error);
          SetServerError(true);
          SetServerErrorMsg(error);
        }
      );
    } else {
      const createUserRecord = database.createDocument(
        "autochalid",
        "userInfo",
        newUser.userId,
        {
          name: newUser.name,
          email: newUser.email,
          userId: newUser.userId,
          phone: newUser.phone,
          address: newUser.address,
        }
      );

      createUserRecord.then(
        function (success) {
          navigation.navigate("Home");
          setLoading(false);
        },
        function (recordError) {
          setLoading(false);
          console.log("create record error", recordError);
          SetServerError(true);
          SetServerErrorMsg(recordError.message);
        }
      );
    }
  };

  const handleInvalidModalClose = () => {
    console.log("shit");
  };
  //   console.log(image);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      //   capture: true,
    });

    console.log(result);

    if (!result.canceled) {
      const dataa = Object.values(result);
      var data = new FormData();
      data.append("image", {
        path: result.assets[0].uri, //image uri
        originalname: result.assets[0].fileName,
        type: "image",
        fieldname: "demo_image",
      });
      setImage(result.assets[0]);
      setImagetoupload(data);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ScrollView
        style={{
          backgroundColor: "#343a40",
          paddingHorizontal: 30,
          paddingVertical: 70,
        }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: 100,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Text
          h3
          h3Style={{
            fontFamily: "OpenSans_600SemiBold",
            fontWeight: "600",
            color: "#dee2e6",
          }}
        >
          We just Need a Little Bit of Your Information
        </Text>
        <View style={{ marginTop: 30 }}>
          <Avatar
            rounded
            size="xlarge"
            containerStyle={{
              backgroundColor: "#f4f4f4",
              marginBottom: 30,
              alignSelf: "center",
            }}
            source={{
              uri: image
                ? image?.uri
                : imageURLGenerator("63be679edce6e5f97d09", "noImage"),
            }}
            onPress={pickImage}
          >
            <Avatar.Accessory
              size={30}
              style={{ backgroundColor: "red", marginRight: 20 }}
              iconProps={{ name: "camera" }}
            />
          </Avatar>
          <Input
            value={newUser.name}
            placeholder="Name"
            containerStyle={{
              paddingHorizontal: 0,
              marginBottom: invalidInputs.name ? 10 : 0,
            }}
            inputContainerStyle={{
              borderBottomWidth: 0,
              padding: 10,
              borderRadius: 8,
              backgroundColor: "#dee2e6",
            }}
            style={{ fontFamily: "OpenSans_400Regular" }}
            autoCapitalize="words"
            leftIcon={<Icon name="person-outline" type="ionicon" />}
            onChangeText={(text) => {
              if (text === "") {
                setInvalidInputs({ ...invalidInputs, name: true });
              } else {
                setInvalidInputs({ ...invalidInputs, name: false });
              }
              setNewUser({ ...newUser, name: text });
            }}
            errorMessage={invalidInputs.name && "Please enter your name!"}
          />
          <Input
            value={newUser.email}
            placeholder="yourname@mail.com"
            containerStyle={{
              paddingHorizontal: 0,
            }}
            inputContainerStyle={{
              borderBottomWidth: 0,
              padding: 10,
              borderRadius: 8,
              backgroundColor: "#dee2e6",
            }}
            style={{ fontFamily: "OpenSans_400Regular" }}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Icon name="email" type="fontisto" />}
            disabled
          />
          <Input
            value={newUser.address}
            placeholder="Address"
            containerStyle={{
              paddingHorizontal: 0,
              marginBottom: invalidInputs.address ? 10 : 0,
            }}
            inputContainerStyle={{
              borderBottomWidth: 0,
              padding: 10,
              borderRadius: 8,
              backgroundColor: "#dee2e6",
            }}
            style={{ fontFamily: "OpenSans_400Regular" }}
            autoCapitalize="words"
            leftIcon={<Icon name="address" type="entypo" />}
            onChangeText={(text) => {
              if (text === "") {
                setInvalidInputs({ ...invalidInputs, address: true });
              } else {
                setInvalidInputs({ ...invalidInputs, address: false });
              }
              setNewUser({ ...newUser, address: text });
            }}
            errorMessage={invalidInputs.address && "Please enter your Address!"}
          />

          <Input
            value={newUser.Phone}
            placeholder="Phone"
            containerStyle={{
              paddingHorizontal: 0,
              marginBottom: invalidInputs.code ? 10 : 0,
            }}
            inputContainerStyle={{
              borderBottomWidth: 0,
              padding: 10,
              borderRadius: 8,
              backgroundColor: "#dee2e6",
            }}
            style={{ fontFamily: "OpenSans_400Regular" }}
            keyboardType="number-pad"
            leftIcon={<Icon name="phone-portrait-outline" type="ionicon" />}
            onChangeText={(text) => {
              //   setReEnterCode(false);
              if (text === "") {
                setInvalidInputs({ ...invalidInputs, phone: true });
              } else {
                setInvalidInputs({ ...invalidInputs, phone: false });
              }
              setNewUser({ ...newUser, phone: parseInt(text) });
            }}
            errorMessage={
              invalidInputs.phone ? "Please enter your Phone Number!" : null
            }
          />
        </View>
        <Button
          loading={loading}
          title="Continue"
          color="success"
          containerStyle={{ borderRadius: 8 }}
          size="lg"
          buttonStyle={{ padding: 15, backgroundColor: "#9fffcb" }}
          titleStyle={{ color: "#1a1a1a", fontFamily: "OpenSans_500Medium" }}
          onPress={handleUpdateUserInfo}
          disabled={Boolean(
            !newUser.name ||
              //   !newUser.email ||
              !newUser.address ||
              !newUser.phone
          )}
          disabledStyle={{ backgroundColor: "grey" }}
        />
        <Button
          title="I have an Account!"
          color="warning"
          containerStyle={{ borderRadius: 8, marginVertical: 30 }}
          size="lg"
          buttonStyle={{
            padding: 15,
            borderColor: "#bfdbf7",
            //   borderWidth: 2,
            borderRadius: 8,
          }}
          titleStyle={{ color: "#bfdbf7", fontFamily: "OpenSans_400Regular" }}
          type="outline"
          onPress={() => navigation.navigate("Register")}
        />
        <Text
          style={{
            textAlign: "center",
            color: "#dee2e6",
            fontFamily: "OpenSans_300Light",
            marginVertical: 20,
          }}
        >
          Autochalit v6, an inovative IoT project, Year 2, 2022
        </Text>
      </ScrollView>
      <ModalAlert
        isVisible={invalidCode}
        setIsVisible={setInvalidCode}
        title="Bollocks"
        message="The Access Code you entered seems to be incorrect, please re-check and try again!"
        handleClose={handleInvalidModalClose}
      />
      <ModalAlert
        isVisible={serverError}
        setIsVisible={SetServerError}
        title="Bollocks Server Error!"
        message={serverErrorMsg + ", " + "please try again Later!"}
        handleClose={handleInvalidModalClose}
      />
    </View>
  );
};

export default EdinUserInfoScreen;

const styles = StyleSheet.create({});
