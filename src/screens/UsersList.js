import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "expo-image";
import { firestore } from "../../firebase";

const UsersList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Listener for users collection
    const subscriber = firestore
      .collection("users")
      .onSnapshot((documentSnapshot) => {
        console.log("Users Collection: ", documentSnapshot.docs);
        const usersData = documentSnapshot.docs.map((doc) => doc.data());
        setUsers(usersData);
        console.log("User data: ", usersData);
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, []);

  const renderChat = ({ item }) => {
    return (
      <TouchableOpacity style={styles.user}>
        <Image source={item.profileImage} style={styles.userImg} />
        <Text>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={users}
      renderItem={renderChat}
      ItemSeparatorComponent={<View style={styles.line} />}
    />
  );
};

export default UsersList;

const styles = StyleSheet.create({
  user: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 16,
    paddingHorizontal: 16,
    height: 80,
  },
  userImg: {
    height: 55,
    width: 55,
    borderRadius: 100,
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: "lightgray",
  },
});
