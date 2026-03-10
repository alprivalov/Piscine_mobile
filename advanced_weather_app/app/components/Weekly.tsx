import {ScrollView,Dimensions , StyleSheet, Text, View} from "react-native";
import {LineChart, lineDataItem} from "react-native-gifted-charts";
import React from "react";
import {useWeather} from "@/app/context/WeatherContext";

const screen = Dimensions.get("window");

export default function Weekly() {
    const {
        city,
        region,
        country,
        weekly,
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
    if (!city || !region || !country || !weekly?.length ) return null;

    const temperature_2m_min : lineDataItem[] = weekly?.map((item,index)=> {
        return ({
            value: item.temperature_2m_min,
            label: `${item.time.getDate()}/${item.time.getMonth() + 1}`,
            data: item.time
        })
    }) ??[];

    const temperature_2m_max : lineDataItem[] = weekly?.map((item,index)=> {
        return ({
            value: item.temperature_2m_max,
            label: `${item.time.getDate()}`,
            data: item.time
        })
    }) ??[];

    const maxValue = Math.max(...weekly?.map((item) => item.temperature_2m_max))

    return (
        <View style={styles.weekly} >
            <View style={styles.location}>
                <Text style={styles.city}>{city}</Text>
                <Text style={styles.region}>{region}, {country}</Text>
            </View>
            <View style={styles.chart}>
                <Text style={styles.chartTitle}>Weekly Temperatures</Text>
                <View style={styles.chartWrapper}>
                    <LineChart
                        yAxisTextStyle={{ color: '#7b95ac' }}
                        xAxisLabelTextStyle={{ color: '#7b95ac' }}
                        yAxisColor="#7b95ac"
                        xAxisColor="#7b95ac"
                        color1="#3498DB"
                        color2="#E74C3C"
                        dataPointsColor1="#3498DB"
                        dataPointsColor2="#E74C3C"
                        width={screen.width - 46}
                        spacing={(screen.width - 46) / temperature_2m_min.length}
                        initialSpacing={10}
                        endSpacing={10}
                        maxValue={maxValue + 2}
                        data={temperature_2m_min}
                        data2={temperature_2m_max}
                    />
                </View>
                <View style={styles.legend}>
                    <View style={styles.legendItem}>
                        <View style={styles.legendLineBlue}>
                            <View style={styles.legendDotBlue}></View>
                        </View>
                        <Text style={styles.legendText}> min temperature</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={styles.legendLineRed}>
                            <View style={styles.legendDotRed}></View>
                        </View>
                        <Text style={styles.legendText}> max temperature</Text>
                    </View>
                </View>
            </View>
            <ScrollView
                contentContainerStyle={styles.weeklySlide}
                horizontal={true}
                nestedScrollEnabled={true}
            >
                {weekly.map((item,index) => (
                    <View key={index} style={styles.column}>
                        <Text style={styles.time}>{(item.time.getMonth() + 1).toString().padStart(2, "0")}/{item.time.getDate().toString().padStart(2, "0")}</Text>
                        <Text style={styles.weather}>{getCurrentWeatherState(item.weather_code, 2, 24, 24)}</Text>
                        <Text style={styles.temperatureMax}>{item.temperature_2m_max?.toPrecision(2)} °C max</Text>
                        <Text style={styles.temperatureMin}>{item.temperature_2m_min?.toPrecision(2)} °C min</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    errorScreen: { flex: 1, justifyContent: "center", alignItems: "center" },
    errorMessage: { textAlign: "center", fontSize: 21, color: "#f07772" },

    weekly: {flex:1, flexDirection: "column", alignItems: "center" },
    location: { alignItems: "center" },
    city: { color: "#2C3E50", fontSize: 24 },
    region: { color: "#7b95ac", fontSize: 24 },

    chart: { marginTop: 20, width: "100%", alignItems: "center" },
    chartWrapper: { overflow: "hidden", marginVertical: 10 },
    chartTitle: { color: "#000", fontSize: 24 },

    legend: { flexDirection: "row", justifyContent: "center", marginTop: 10 },
    legendItem: { flexDirection: "row", alignItems: "center", marginHorizontal: 10 },
    legendLineBlue: { width: 24, height: 2, backgroundColor: "#3498db", marginRight: 6, justifyContent: "center" },
    legendLineRed: { width: 24, height: 2, backgroundColor: "#E74C3C", marginRight: 6, justifyContent: "center" },
    legendDotBlue: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#3498db" },
    legendDotRed: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#E74C3C" },
    legendText: { fontSize: 14, color: "#000" },

    weeklySlide: {  marginVertical: 50, backgroundColor: 'rgba(255,255,255,0.3)', flexDirection: "row" },
    column: { flexDirection: "column", alignItems: "center", justifyContent: "space-between", paddingVertical: 20, paddingHorizontal: 30 },
    time: { fontSize: 18 },
    weather: { fontSize: 24, color: "#7b95ac" },
    temperatureMax: { color: "#dc4702", fontSize: 20 },
    temperatureMin: { color: "#16C1FF", fontSize: 20 },
});