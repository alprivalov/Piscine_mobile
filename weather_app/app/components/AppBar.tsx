import {Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import { useMemo, useState } from "react";
import {Ionicons} from "@expo/vector-icons";

type Props = {
    value: string;
    onChange: (value: string) => void;
    onLocate: () => void;
};

const ARTISTS = ['Paris', 'New York', 'London'];

export default function AppBar({ value, onChange, onLocate }: Props) {
    const [focus, setFocus] = useState<boolean>(false);

    const suggestions = useMemo(() => {
        if (!focus || !value) return [];
        return ARTISTS.filter(item =>
            item.toLowerCase().includes(value.toLowerCase())
        );
    }, [value, focus]);

    return (
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="#cfcfcf" />

                <TextInput
                    placeholder="Search location..."
                    placeholderTextColor="#999"
                    onChangeText={(onChange)}
                    value={value}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    style={styles.input}
                />
                <View style={styles.divider}></View>

                <View >
                    <Pressable onPress={()=>{
                        onChange("Geolocation");
                    }}>
                        <Ionicons name="navigate" size={20} color="#cfcfcf" />
                    </Pressable>
                </View>

            </View>

            {focus && suggestions.length > 0 && (
                <View style={styles.suggestions}>
                    {suggestions.map(item => (
                        <Pressable
                            key={item}
                            onPress={()=> {
                                onChange(item);
                                setFocus(false);
                            }}
                        >
                            <Text key={item} style={styles.suggestionItem}>
                                {item}
                            </Text>
                        </Pressable>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#5f616e',
        padding: 12,
    },

    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 44,
    },

    input: {
        flex: 1,
        color: 'white',
        fontSize: 12,
        marginLeft: 8,
    },

    divider: {
        width: 1,
        height: 24,
        backgroundColor: '#ffffff',
        marginHorizontal: 10,
    },

    suggestions: {
        marginTop: 8,
        backgroundColor: '#6a6d7a',
        borderRadius: 8,
        overflow: 'hidden',
    },

    suggestionItem: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        color: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#8b8e9b',
    },
});