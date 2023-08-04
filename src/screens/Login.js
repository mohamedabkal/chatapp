import { Button, TextInput, View } from "react-native";
import React from "react";
import { useState } from "react";
import { auth, firestore } from "../../firebase";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("12345678");

  const login = async () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log("User account created & signed in!");
        props.navigation.navigate("Chats");
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          console.log("That email address is already in use!");
        }

        if (error.code === "auth/invalid-email") {
          console.log("That email address is invalid!");
        }

        console.error(error);
      });
  };

  const signup = async () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((currentUser) => {
        console.log("User account created & signed in!");
        firestore
          .collection("users")
          .doc(currentUser.user.uid)
          .set({
            id: currentUser.user.uid,
            name: email,
            country: "Morocco",
            email,
            profileImage: `https://randomuser.me/api/portraits/men/${Math.floor(
              Math.random() * 100
            )}.jpg`,
          })
          .then(() => props.navigation.navigate("Chats"));
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          console.log("That email address is already in use!");
        }

        if (error.code === "auth/invalid-email") {
          console.log("That email address is invalid!");
        }

        console.error(error);
      });
  };

  return (
    <View style={{ padding: 24, rowGap: 16 }}>
      <TextInput
        placeholder="email"
        onChangeText={setEmail}
        style={{
          height: 40,
          width: "100%",
          backgroundColor: "white",
          paddingHorizontal: 8,
        }}
      />
      <TextInput
        placeholder="password"
        onChangeText={setPassword}
        secureTextEntry
        style={{
          height: 40,
          width: "100%",
          backgroundColor: "white",
          paddingHorizontal: 8,
        }}
      />
      <Button title="Login" onPress={login} />
      <Button title="Signup" onPress={signup} />
    </View>
  );
};

export default Login;
