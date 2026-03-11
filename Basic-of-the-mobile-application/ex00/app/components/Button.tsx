import { Pressable, Text, StyleSheet } from 'react-native';

type ButtonProps = {
    label: string;
    onPress: () => void;
};
export default function Button({ label, onPress }: ButtonProps) {
    return (
        <Pressable style={styles.button} onPress={onPress}>
            <Text style={styles.label}> {label}</Text>
        </Pressable>
    );
}


const styles = StyleSheet.create({
    button: {
        backgroundColor: "#f2f2f2",
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 12,
    },
    label: {
        fontSize: 12,
        color: "#444",
    },
});
