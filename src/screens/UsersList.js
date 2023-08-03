import { SectionList, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { firestore } from "../../firebase";
import Chat from "../components/Chat";
import { CURRENT_USER_ID } from "../../dummy_data";

async function fetchAllUsers() {
  const usersCollection = await firestore.collection("users").get();
  const usersData = usersCollection.docs.map((doc) => {
    return {
      type: "user", // type of item "user" or "chat" (for ui)
      id: doc.id,
      ...doc.data(),
    };
  });
  return usersData;
}

const UsersList = (props) => {
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);

  const data = [
    {
      title: "Chats",
      data: chats,
    },
    {
      title: "Users",
      data: users,
    },
  ];

  useEffect(() => {
    // Listener for chats collection
    const subscriber = firestore
      .collection("chats")
      .onSnapshot((documentSnapshot) => {
        const chatsData = documentSnapshot.docs.map((doc) => {
          return {
            type: "chat", // type of item "user" or "chat" (for ui)
            id: doc.id,
            ...doc.data(),
          };
        });
        setChats(chatsData);
        console.log("Chat data: ", chatsData);
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  useEffect(() => {
    fetchAllUsers().then((usersData) => {
      const removeUserFromList = usersData.filter(
        (user) => user.id !== CURRENT_USER_ID
      );
      setUsers(removeUserFromList);
    });
  }, []);

  const openChat = (item) => {
    props.navigation.navigate("ChatRoom", {
      name: item.name,
      chat_id: item.id,
    });
  };

  const renderUser = ({ item }) => {
    if (item.type === "chat") {
      // chatInfo returns other user data to use it for displaying name & chat img
      const chatInfo = item.users.find((chat) => chat.id !== CURRENT_USER_ID);
      const chatImg = chatInfo?.profileImage;
      const chatName = chatInfo?.name;
      return (
        <Chat
          onPress={() => openChat(item)}
          profileImage={chatImg}
          name={chatName}
        />
      );
    }
    return (
      <Chat
        onPress={() => openChat(item)}
        profileImage={item.profileImage}
        name={item.name}
      />
    );
  };

  return (
    <SectionList
      sections={data}
      keyExtractor={(item) => item.id}
      renderItem={renderUser}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.header}>{title}</Text>
      )}
    />
  );
};

export default UsersList;

const styles = StyleSheet.create({
  line: {
    width: "100%",
    height: 1,
    backgroundColor: "lightgray",
  },
  header: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    textAlignVertical: "center",
    alignItems: "center",
    fontSize: 18,
  },
});
