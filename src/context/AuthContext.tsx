import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser
} from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { User } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface AuthContextProps {
  currentUser: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<string>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch user profile data from Firestore
  const fetchUserProfile = async (uid: string) => {
    try {
      console.log("Fetching user profile for UID:", uid);
      
      // First try to fetch from the 'users' collection
      const userDoc = await getDoc(doc(db, "users", uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        console.log("Found user in 'users' collection:", userData);
        console.log("Organization ID:", userData.organizationId);
        setUserProfile(userData);
        return;
      }
      
      // If not found in 'users', try the 'Users' collection (case sensitivity matters in Firestore)
      const userDocAlt = await getDoc(doc(db, "Users", uid));
      
      if (userDocAlt.exists()) {
        const userData = userDocAlt.data() as User;
        console.log("Found user in 'Users' collection:", userData);
        console.log("Organization ID:", userData.organizationId);
        setUserProfile(userData);
        return;
      }
      
      // If still not found, try querying by userUID field
      const usersQuery = query(collection(db, "users"), where("userUID", "==", uid));
      const querySnapshot = await getDocs(usersQuery);
      
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data() as User;
        console.log("Found user by userUID query:", userData);
        console.log("Organization ID:", userData.organizationId);
        setUserProfile(userData);
        return;
      }
      
      // Try Users collection with userUID query
      const usersQueryAlt = query(collection(db, "Users"), where("userUID", "==", uid));
      const querySnapshotAlt = await getDocs(usersQueryAlt);
      
      if (!querySnapshotAlt.empty) {
        const userData = querySnapshotAlt.docs[0].data() as User;
        console.log("Found user by userUID query in Users collection:", userData);
        console.log("Organization ID:", userData.organizationId);
        setUserProfile(userData);
        return;
      }

      // If we still can't find the user, create a default profile with org1
      console.log("User profile not found in Firestore, creating a default one");
      const defaultProfile = {
        id: uid,
        userUID: uid,
        organizationId: "org1", // Default organization for testing
        firstName: "Test",
        lastName: "User",
        username: "testuser",
        userEmail: currentUser?.email || "unknown@example.com",
        facilityName: "Test Facility",
        accountType: "Husbandry" as const
      };
      
      setUserProfile(defaultProfile as User);
      
      // Also save this default profile to Firestore
      await setDoc(doc(db, "users", uid), defaultProfile);
      console.log("Created default user profile with organization ID: org1");
      
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUserProfile(null);
    }
  };

  // Authentication state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        await fetchUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await fetchUserProfile(userCredential.user.uid);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user.uid;
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      toast({
        title: "Logout successful",
        description: "You have been logged out",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthProvider };
