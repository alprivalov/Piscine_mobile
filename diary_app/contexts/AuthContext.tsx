import {
    GithubAuthProvider, GoogleAuthProvider,
    onAuthStateChanged, signInWithCredential,
    signOut,
    User
} from "@firebase/auth";
import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState} from "react";
import {auth} from "@/firebase";
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import {router, useRootNavigationState, useSegments} from "expo-router";
import { makeRedirectUri, useAuthRequest} from "expo-auth-session";
import {createTokenWithCode} from "@/utils/CreateTokenWithCode";
import {Alert} from "react-native";

interface AppUser {
    uid: string;
    createdAt: string;
    displayName: string;
    lastLoginAt: string;
    photoURL: string;
    providerId: string;
    email: string;
}

const initialState = {
    uid: "",
    createdAt: "",
    displayName: "",
    lastLoginAt: "",
    photoURL: "",
    providerId: "",
    email: "",
}

interface ContextInterface {
    user: AppUser;
    loading : boolean,
    loginWithGoogle : () => void,
    loginWithGithub : () => void,
    signIn: Dispatch<SetStateAction<AppUser>>;
    logout: () => void;
}

const contextInitialState: ContextInterface = {
    user: initialState,
    loading : false,
    loginWithGoogle : () => Promise<void>,
    loginWithGithub : () => Promise<void>,
    signIn : () => {},
    logout : () => {},
}

const AuthContext = createContext<ContextInterface>(contextInitialState)

export function useAuth() {
    const context = useContext(AuthContext);
    if(context == null) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return context;
}

const discovery = {
    authorizationEndpoint: "https://github.com/login/oauth/authorize",
    tokenEndpoint: "https://github.com/login/oauth/access_token",
    revocationEndpoint: `https://github.com/settings/connections/application/${process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID}`,
}

function userFirebaseToAppUser( user: User ) {
    const displayName = user.displayName
        || user.providerData[0]?.displayName
        || user.email?.split('@')[0]
        || "User";

    const userData : AppUser = {
        uid: user.providerData[0].uid,
        displayName: displayName,
        photoURL : user.providerData[0].photoURL ?? "",
        providerId : user.providerData[0].providerId,
        createdAt : user.metadata.creationTime!,
        lastLoginAt : user.metadata.lastSignInTime!,
        email : user.providerData[0].email ?? "",
    }
    return userData;
}

function useProtectedRoute(user:AppUser) {
    const segments = useSegments();
    const navigationState = useRootNavigationState();
    const [hasNavigated, setHasNavigated] = useState<boolean>(false);

    useEffect(() => {
        if(!navigationState.key || hasNavigated) return;
        const isAuthGroup = segments[0]  === "(auth)"
        if(!user.uid && !isAuthGroup ){
            router.replace("/(auth)/sign-in")
            setHasNavigated(true);
        } else if (user.uid && isAuthGroup){
            router.replace("/(tabs)/profile")
            setHasNavigated(true);
        }


    }, [user.uid, segments, navigationState, hasNavigated]);
}

export function AuthProvider({children} : { children : ReactNode }) {
    const [user, setUser] = useState<AppUser>(initialState);
    const [loading, setLoading] = useState(false );

    useProtectedRoute(user)

    const clientId = process.env.EXPO_PUBLIC_GITHUB_CLIENT_ID;
    if (!clientId) return null;

    const [request, response, promptAsync] = useAuthRequest({
        clientId: clientId,
        scopes: ["identity", "user:email","user:follow","read:user"],
        redirectUri: makeRedirectUri(),
    },discovery);


    useEffect(() => {
        handleResponse();
    }, [response]);

    async function handleResponse() {
        if(response?.type === "success"){
            const { code } = response.params;
            const { token_type, scope, access_token } = await createTokenWithCode(code, request);
            if(!access_token) return ;

            const credential = GithubAuthProvider.credential(access_token);
            const data = await signInWithCredential(auth, credential);
            if(data.user){
                setUser(userFirebaseToAppUser(data.user));
                router.replace("/(tabs)/profile")
            } else {
                setUser(initialState);
                router.replace("/(auth)/sign-in")
            }
        }
    }

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if(user){
                setUser(userFirebaseToAppUser(user))
                router.replace("/(tabs)/profile")
            } else {
                setUser(initialState);
                router.replace("/(auth)/sign-in")
            }
        })
        return unsubscribeAuth;
    }, []);

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: "53629397633-g71i5qt15m0gb57crd19eqrdgcqn5a53.apps.googleusercontent.com",
        });
    }, []);

    const logout = async () => {
        try{
            await signOut(auth);
            await GoogleSignin.signOut();
            setUser(initialState);
        } catch(err){
            Alert.alert("Error", "Failed to log out");
        }
    }

    const loginWithGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const { data } = await GoogleSignin.signIn();

            if (data?.idToken) {
                const credential = GoogleAuthProvider.credential(data.idToken);
                await signInWithCredential(auth, credential);
            }
        } catch (error) {
            console.error("Google Sign-In Error:", error);
        }
    };

    const loginWithGithub = async () => {
        try{
            await promptAsync();
        } catch (err) {
            console.error("Github Sign-In Error:", err);
        }
    }

    return (
        <AuthContext.Provider
        value={{
            user,
            loading,
            loginWithGoogle,
            loginWithGithub,
            signIn: setUser,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    )
}
