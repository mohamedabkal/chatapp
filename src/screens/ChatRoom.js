import React, { useCallback, useEffect, useState } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { SafeAreaView } from "react-native-safe-area-context";
import { firestore } from "../../firebase";
import { CURRENT_USER, OTHER_USER } from "../../dummy_data";
import { Platform } from "react-native";

const ChatRoom = (props) => {
  const [messages, setMessages] = useState([]);

  const params = props.route.params;

  const chatID = params?.chat_id;

  useEffect(() => {
    // Listener for messages
    const subscriber = firestore
      .collection(`chats/${chatID}/messages`)
      .orderBy("createdAt", "desc")
      .onSnapshot((documentSnapshot) => {
        const messgsData = documentSnapshot.docs.map((doc) => {
          return {
            _id: doc.data()._id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user,
          };
        });
        setMessages(messgsData);
        console.log("Messages data: ", messgsData);
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    const { _id, createdAt, user, text } = messages[0];
    firestore
      .collection(`chats/${chatID}/messages`)
      .add({ _id, createdAt, user, text });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={Platform.OS === "ios" ? CURRENT_USER : OTHER_USER}
      />
    </SafeAreaView>
  );
};

export default ChatRoom;
