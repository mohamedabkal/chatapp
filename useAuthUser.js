import { useEffect, useState } from "react";
import { auth } from "./firebase";

const useAuthUser = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const subscriber = auth.onAuthStateChanged((user) => setCurrentUser(user));
    return () => {
      if (subscriber) {
        subscriber();
      }
    };
  }, []);

  return { currentUser };
};

export default useAuthUser;
