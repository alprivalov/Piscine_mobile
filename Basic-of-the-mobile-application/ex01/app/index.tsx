import { Text, View, StyleSheet } from "react-native";
import Button from "./components/Button";
import { useState } from "react";

export default function Index() {
    const [text, setText] = useState<string>("A  simple text");


    const handlePress = () => {
        text === "A  simple text" ? setText("Hello World!") : setText("A  simple text");
    }


    return (
        <View style={styles.screen}>
            <View style={styles.content}>
                <Text style={styles.textBox}>{text}</Text>
                <Button label="Click me" onPress={handlePress}></Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        alignItems: "center",
    },
    textBox: {
        backgroundColor: "#6b6f00", // vert olive (proche du screen)
        color: "white",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
        marginBottom: 10,
        fontSize: 16,
    },
});
