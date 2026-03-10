import {useWeather} from "@/app/context/WeatherContext";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import React from "react";
import {Fontisto} from "@expo/vector-icons";

export default function Currently() {
    const {
        city,
        region,
        country,
        current,
        errorMessage,
        getCurrentWeatherState
    } = useWeather()

    if (errorMessage){
        return (
            <ScrollView contentContainerStyle={styles.errorScreen}>
                <Text style={styles.errorMessage}>{errorMessage}</Text>
            </ScrollView>
        )
    }

    if (!city || !region || !country || !current) return null;

    return (
        <View style={styles.current}>
            <View style={styles.location}>
                <Text style={styles.city}>{city}</Text>
                <Text style={styles.region}>{region}, {country}</Text>
            </View>
            <Text style={styles.temperature}>{current.temperature_2m?.toPrecision(2)} °C</Text>
            {getCurrentWeatherState(current.weather_code, 1, 96, 26)}
            <Text style={styles.wind}> <Fontisto name="wind" size={16} color={"#3498DB"}/>{current.wind_speed_10m?.toPrecision(2)} km/h</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    errorScreen: { flex: 1, justifyContent: "center", alignItems: "center" },
    errorMessage: { textAlign: "center", fontSize: 21, color: "#f07772" },

    current: { marginVertical: 100, flex: 1, alignItems: "center", justifyContent: "space-between" },
    location: { alignItems: "center" },

    city: { color: "#2C3E50", fontSize: 24 },
    region: { color: "#7b95ac", fontSize: 24 },
    temperature: { color: "#16C1FF", fontSize: 46 },
    wind: { color: "#7b95ac", fontSize: 18 },
});