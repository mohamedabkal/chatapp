import { ActivityIndicator, SectionList, StyleSheet, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { firestore } from "../../firebase";
import Chat from "../components/Chat";
import useAuthUser from "../../useAuthUser";

function filterChats(chats, userID) {
  // show only user's chats
  const userChats = chats.filter((chat) =>
    chat.users.some((usr) => usr.id === userID)
  );
  return userChats;
}

// remove users that are already in chats arr
function filterUsersData(users, chats) {
  const chatUsers = [];
  chats.map((chat) => chat.users.map((usr) => chatUsers.push(usr.id)));
  const newUsers = users.filter((user) => !chatUsers.includes(user.id));
  return newUsers;
}

const UsersList = (props) => {
  const [usersData, setUsersData] = useState([]); // placeholder for users data (do not update this state)
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { currentUser } = useAuthUser();
  const CURRENT_USER_ID = currentUser?.uid;

  const data = [
    {
      title: "Chats",
      data: chats,
    },
    {
      title: "All Users",
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
        const filteredChats = filterChats(chatsData, CURRENT_USER_ID);
        setChats(filteredChats);
        console.log("Chat data: ", filteredChats);
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, [CURRENT_USER_ID]);

  useEffect(() => {
    if (CURRENT_USER_ID) {
      fetchAllUsers();
    }
  }, [CURRENT_USER_ID]);

  useEffect(() => {
    if (CURRENT_USER_ID) {
      setUsers(filterUsersData(usersData, chats));
    }
  }, [chats, CURRENT_USER_ID, loading]);

  async function fetchAllUsers() {
    try {
      setLoading(true);
      const usersCollection = await firestore
        .collection("users")
        .where("id", "!=", CURRENT_USER_ID)
        .get();
      const usersData = usersCollection.docs.map((doc) => {
        return {
          type: "user", // type of item "user" or "chat" (for ui)
          id: doc.data().id,
          ...doc.data(),
        };
      });
      setUsers(usersData);
      setUsersData(usersData);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  const openChat = (item, chatName) => {
    if (item.type === "chat") {
      props.navigation.navigate("ChatRoom", {
        name: chatName, // TODO: use the right property to display the name
        chat_id: item.id,
      });
    } else {
      props.navigation.navigate("ChatRoom", {
        name: item.name,
        other_user_id: item.id,
        other_user_name: item.name,
        other_user_img: item.profileImage,
        other_user_email: item.email,
        chat_id: null,
      });
    }
  };

  const renderUser = ({ item }) => {
    if (item.type === "chat") {
      // chatInfo returns other user data to use it for displaying name & chat img
      const chatInfo = item.users.find(
        (chatUsr) => chatUsr.id !== CURRENT_USER_ID
      );
      const chatImg = chatInfo?.profileImage;
      const chatName = chatInfo?.name;
      return (
        <Chat
          onPress={() => openChat(item, chatName)}
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

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

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
