import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import {useAuth} from "@/contexts/AuthContext";
import {SafeAreaView} from "react-native-safe-area-context";
import {Ionicons} from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function signIn() {
    const { loginWithGoogle, loginWithGithub, loading } = useAuth();

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}

                style={styles.keyboardView}
            >
                <View style={styles.content}>
                    <Text style={styles.title}>Login</Text>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={loginWithGoogle}
                        disabled={loading}>
                        <Ionicons name="logo-google" size={20} color="#fff" style={{marginRight: 10}}/>
                        <Text style={styles.buttonText}>Continue with Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={() => loginWithGithub()}
                        disabled={loading}>
                        <Ionicons name="logo-github" size={20} color="#fff" style={{marginRight: 10}}/>
                        <Text style={styles.buttonText}>Continue with Github</Text>
                    </TouchableOpacity>

                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },

    keyboardView: {
        flex: 1,
        justifyContent: "center",
        padding: 16,
    },
    content: {
        alignItems: "center",
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 8,
    },

    input: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
    },
    button: {
        width: "100%",
        height: 50,
        flexDirection: "row",
        backgroundColor: "#007AFF",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16,
    },
    buttonDisabled: {
        backgroundColor: "#999",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    linkContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent : "center"
    },
    link: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        backgroundColor: "#eee",
    },
    linkText: {
        marginRight: 8,
        color: "#666",
    },
    linkButton: {
        color: "#007AFF",
        fontWeight: "bold",
    },
});