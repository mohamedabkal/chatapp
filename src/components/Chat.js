import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Image } from "expo-image";

const Chat = (props) => {
  return (
    <TouchableOpacity style={styles.chat} onPress={props.onPress}>
      <Image source={props.profileImage} style={styles.chatImg} />
      <Text>{props.name}</Text>
    </TouchableOpacity>
  );
};

export default Chat;

const styles = StyleSheet.create({
  chat: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 16,
    paddingHorizontal: 16,
    height: 80,
  },
  chatImg: {
    height: 55,
    width: 55,
    borderRadius: 100,
  },
});
