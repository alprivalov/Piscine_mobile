import {SafeAreaView} from "react-native-safe-area-context";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import {Link} from "expo-router";
import Colors from "@/constants/Colors";

export default function homeApp() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}> Welcome to your Diary</Text>
                <Link href={'/(auth)/sign-in'} asChild={true}>
                    <TouchableOpacity
                        style={styles.signInButton}
                    >
                        <Text style={styles.signUpButtonText}>Sign In</Text>
                    </TouchableOpacity>
                </Link>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
    },
    content: {
        flex:1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
    },
    signInButton: {
        width: "30%",
        alignItems: "center",
        backgroundColor: Colors.primary,
        padding: 12,
        borderRadius: 16,
        margin: 20,
    },
    signUpButtonText: {
        fontWeight: "bold",
        fontSize: 18,
        letterSpacing:1,
        color: Colors.white,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation:10,
    },
})