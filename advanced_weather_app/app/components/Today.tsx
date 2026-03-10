import {ScrollView, Dimensions, StyleSheet, Text, View} from "react-native";
import {LineChart, lineDataItem} from "react-native-gifted-charts";
import React from "react";
import {useWeather} from "@/app/context/WeatherContext";
import {Fontisto} from "@expo/vector-icons";

const screen = Dimensions.get("window");

export default function Today() {
    const {
        city,
        region,
        country,
        today,
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

    const array : lineDataItem[] = today?.map((item,index)=> {
        return ({
            value: item.temperature_2m,
            label: `${item.time.getUTCHours()}h`,
            data: item.time
        })
    }).filter((item,index)=> index % 3 == 0) ??[];

    if (!city || !region || !country || !today?.length) return null;

    const maxValue = Math.max(...today?.map((item) => item.temperature_2m))

    return (
        <View style={styles.today}>
            <View style={styles.location}>
                <Text style={styles.city}>{city}</Text>
                <Text style={styles.region}>{region} {country}</Text>
            </View>
            <View style={styles.chart}>
                <View style={styles.chartWrapper}>
                    <LineChart
                        data = {array}
                        adjustToWidth={true}
                        yAxisTextStyle={{ color: '#7b95ac' }}
                        xAxisLabelTextStyle={{ color: '#7b95ac' }}
                        yAxisColor="#7b95ac"
                        xAxisColor="#7b95ac"
                        dataPointsColor1="#ff9904"
                        color1="#ff9904"
                        width={screen.width - 46}
                        spacing={(screen.width - 46) / array.length}
                        initialSpacing={10}
                        endSpacing={10}
                        maxValue={maxValue + 2}
                    />
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.todaySlide}
                        horizontal={true}
                        nestedScrollEnabled={true}
            >
                {today.map((item,index) => (
                    <View key={index}  style={styles.column}>
                        <Text style={styles.time}>{item.time.getUTCHours().toString().padStart(2, '0')}:{item.time.getMinutes().toString().padStart(2, '0')} </Text>
                        <Text style={styles.weather}>{getCurrentWeatherState(item.weather_code, 2, 24, 24)} </Text>
                        <Text style={styles.temperature}>{item.temperature_2m?.toPrecision(2)} °C </Text>
                        <Text style={styles.wind}> <Fontisto name="wind" size={16} color={"#3498DB"}/>{item.wind_speed_10m?.toPrecision(2)} km/h</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    errorScreen: { flex: 1, justifyContent: "center", alignItems: "center" },
    errorMessage: { textAlign: "center", fontSize: 21, color: "#f07772" },

    today: { flex:1 ,flexDirection: "column", alignItems: "center"},
    location: { alignItems: "center" },
    city: { color: "#2C3E50", fontSize: 24 },
    region: { color: "#7b95ac", fontSize: 24 },

    chart: { marginTop: 20, width: "100%", alignItems: "center" },
    chartWrapper: { overflow: "hidden", marginVertical: 10 },

    todaySlide: { marginBottom: 50, marginTop : 112 , backgroundColor: 'rgba(255,255,255,0.3)', flexDirection: "row" },
    column: { flexDirection: "column", alignItems: "center", justifyContent: "space-between", paddingVertical: 20, paddingHorizontal: 30 },

    time: { fontSize: 18 },
    weather: { fontSize: 24, color: "#7b95ac" },
    temperature: { color: "#16C1FF", fontSize: 20 },
    wind: { color: "#7b95ac", fontSize: 20 },
});