import React from "react";
import { StyleSheet, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

function Message(props) {
  const { message, accent, isFromMe, index, time } = props;

  return (
    <Animated.View
      style={[
        styles.message,
        isFromMe
          ? [styles.messageMe, { backgroundColor: accent }]
          : styles.messageThem,
      ]}
      entering={FadeInDown.delay(25 * index)}
    >
      <Text
        style={[
          styles.messageText,
          {
            color: isFromMe ? "white" : "black",
            textAlign: isFromMe ? "right" : "left",
          },
        ]}
      >
        {message.text}
      </Text>
      <Text style={[styles.time, { color: isFromMe ? "white" : "#444" }]}>
        {time}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  message: {
    maxWidth: "80%",
    marginVertical: 2,
    marginHorizontal: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    rowGap: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageMe: {
    alignSelf: "flex-end",
    backgroundColor: "pink",
  },
  messageThem: {
    alignSelf: "flex-start",
    backgroundColor: "white",
  },
  time: {
    fontSize: 10,
    textAlign: "right",
    opacity: 0.7,
  },
});

export default Message;
