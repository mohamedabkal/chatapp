import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useState } from "react";

const ChatTextInput = (props) => {
  const { onSend } = props;

  const [input, setInput] = useState("");

  const sendMessg = useCallback(() => {
    onSend(input);
    setInput("");
  }, [input]);

  return (
    <View style={styles.wrapper}>
      <TextInput
        placeholder="Message"
        style={styles.input}
        onChangeText={setInput}
        multiline
        value={input}
      />
      <TouchableOpacity onPress={sendMessg} disabled={input.length === 0}>
        <Text>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChatTextInput;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    columnGap: 16,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    marginVertical: 12,
  },
});
