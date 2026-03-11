import {Pressable, Text, StyleSheet} from "react-native";

type ButtonProps = {
    label: string;
    type : "number" | "operator" | "action" | "none" ;
    onPress: (label: string) => void;
};

export default function Button({ label, type, onPress }: ButtonProps) {
    return (
        <Pressable
            style={[styles.button, styles[type]]}
            onPress={() => onPress(label)}
        >
            <Text style={[styles.text, styles[`${type}Text`]]}>
                {label}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        flex: 1,
        margin: 2,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
    },

    text: {
        fontSize: 16,
    },

    number: {
        backgroundColor: "#607d8b",
    },

    operator: {
        backgroundColor: "#607d8b",
    },

    action: {
        backgroundColor: "#607d8b",
    },

    none: {
        backgroundColor: "",
    },

    numberText: {
        color: "#263238",
    },

    operatorText: {
        color: "white",
    },

    actionText: {
        color: "#aa292b", // rouge pour C / AC
        fontWeight: "600",
    },


    noneText: {
        color: "#e53935", // rouge pour C / AC
        fontWeight: "600",
    },
});
