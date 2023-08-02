import "react-native-gesture-handler";

import { createStackNavigator } from "@react-navigation/stack";
import UsersList from "./src/screens/UsersList";
import { NavigationContainer } from "@react-navigation/native";
import ChatRoom from "./src/screens/ChatRoom";

const Stack = createStackNavigator();

function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Chats" component={UsersList} />
        <Stack.Screen name="ChatRoom" component={ChatRoom} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return <Navigation />;
}
