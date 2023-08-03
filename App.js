import "react-native-gesture-handler";

import { createStackNavigator } from "@react-navigation/stack";
import UsersList from "./src/screens/UsersList";
import { NavigationContainer } from "@react-navigation/native";
import ChatRoom from "./src/screens/ChatRoom";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Stack = createStackNavigator();

function Navigation() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Chats" component={UsersList} />
          <Stack.Screen
            name="ChatRoom"
            component={ChatRoom}
            options={({ route }) => ({ headerTitle: route.params?.name })}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default function App() {
  return <Navigation />;
}
