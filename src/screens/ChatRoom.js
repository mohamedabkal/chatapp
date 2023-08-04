import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { firestore } from "../../firebase";
import { formatTime, generateId } from "../../helpers";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import useAuthUser from "../../useAuthUser";
import Message from "../components/Message";
import ChatTextInput from "../components/ChatTextInput";

const ChatRoom = (props) => {
  const [messages, setMessages] = useState([]);
  const [chatID, setChatID] = useState(null);
  const [loading, setLoading] = useState(true);

  const params = props.route.params;

  const { currentUser } = useAuthUser();
  const CURRENT_USER_ID = currentUser?.uid; // TODO: use real user id

  // TODO: use real user info
  const CURRENT_USER = {
    id: CURRENT_USER_ID,
    name: currentUser?.email,
    profileImage: "https://randomuser.me/api/portraits/men/33.jpg",
    email: currentUser?.email,
  };

  useEffect(() => {
    if (params?.chat_id) {
      setChatID(params?.chat_id);
    }
  }, []);

  useEffect(() => {
    // Listener for messages
    const subscriber = firestore
      .collection(`chats/${chatID}/messages`)
      .orderBy("createdAt", "desc")
      .onSnapshot((documentSnapshot) => {
        const messgsData = documentSnapshot.docs.map((doc) => {
          return {
            id: doc.data().id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            sender_id: doc.data().sender_id,
          };
        });
        setMessages(messgsData);
        setLoading(false);
        console.log(
          "Messages data: ",
          Platform.OS === "ios" ? "🍏" : "🤖",
          messgsData
        );
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, [chatID]);

  const createNewChat = async () => {
    const newDocID = generateId();
    const newChatUsers = [
      CURRENT_USER,
      {
        id: params?.other_user_id,
        name: params?.other_user_name,
        profileImage: params?.other_user_img,
        email: params?.other_user_email,
      },
    ];

    return firestore
      .collection("chats")
      .doc(newDocID)
      .set({
        id: newDocID,
        users: newChatUsers,
      })
      .then(() => newDocID)
      .catch((err) => {
        // handle error
        console.error(err);
      });
  };

  const onSend = useCallback(
    (input) => {
      if (input.length > 0) {
        const newMessage = {
          id: generateId(),
          text: input,
          sender_id: CURRENT_USER_ID,
          createdAt: new Date(),
        };
        const newMessages = [...messages, newMessage];
        setMessages(newMessages);

        if (chatID === null) {
          // create new chat
          createNewChat().then((docID) => {
            console.log("✅ created new chat", docID);
            // send new message
            firestore.collection(`chats/${docID}/messages`).add(newMessage);
            // update chat id
            setChatID(docID);
          });
        } else {
          firestore
            .collection(`chats/${chatID}/messages`)
            .add(newMessage)
            .catch((err) => console.error(err));
        }
      }
    },
    [CURRENT_USER_ID, messages, chatID]
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" style={styles.container} />
      ) : (
        <FlatList
          data={messages}
          inverted
          contentContainerStyle={styles.reverse}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <Message
              key={item.id}
              message={item}
              accent={"#1f93f4"}
              isFromMe={item.sender_id === CURRENT_USER_ID}
              index={index}
              time={formatTime(item.createdAt)}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      )}
      <SafeAreaView style={styles.footerContainer} edges={["bottom"]}>
        <ChatTextInput onSend={onSend} />
      </SafeAreaView>
      {Platform.OS === "ios" && (
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={60} />
      )}
    </View>
  );
};

export default ChatRoom;

const styles = StyleSheet.create({
  container: { flex: 1 },
  reverse: {
    paddingVertical: 16,
  },
  headerContainer: {
    backgroundColor: "white",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "blue",
  },
  footerContainer: {
    backgroundColor: "white",
  },
});
