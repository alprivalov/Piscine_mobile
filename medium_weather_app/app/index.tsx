import { Pressable, StyleSheet, Text, TextInput, View, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useState, useMemo, useEffect } from "react";

import { fetchWeatherApi } from "openmeteo";

const Tab = createMaterialTopTabNavigator();

type weatherProps = {
    latitude: number,
    longitude: number,
    current?: string[],
    daily?: string[],
    hourly?: string[],
};

type currentProps = {
    time: Date,
    temperature_2m?: number,
    wind_speed_10m?: number,
    temperature_2m_min?: number,
    temperature_2m_max?: number,
    weather_code?: number,
}

export default function Index() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [city, setCity] = useState<string | null>(null);
    const [region, setRegion] = useState<string | null>(null);
    const [country, setCountry] = useState<string | null>(null);
    const [weather, setWeather] = useState<any[]>();
    const [current, setCurrentWeather] = useState<currentProps>();
    const [today, setTodayWeather] = useState<currentProps[]>();
    const [weekly, setWeeklyWeather] = useState<currentProps[]>();
    const [errorMessage, setErrorMessage] = useState<string>();
    const [citys, setCitys] = useState<any[]>();
    const [inputSearch, setinputSearch] = useState("");
    const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);



    useEffect(() => {
        if(!inputSearch){
            setCitys([]);
            return;
        }

        const fetchCity = async () => {
            try {
                const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
                    inputSearch
                )}&count=5&language=en&format=json`;

                const response = await fetch(url);
                const data = await response.json();

                setCitys(data.results ?? []);
            } catch (err) {
                setErrorMessage("The service connection is lost, please check your internet connection and try again.");
                setCitys([]);
            }
        };
        fetchCity();
    }, [inputSearch]);


    const suggestions = useMemo(() => {
        return citys
    }, [citys]);


    useEffect(() => {
        const getPermission = async () => {
            try {
                const {status} = await Location.requestForegroundPermissionsAsync();
                if (status !== "granted") {
                    setErrorMessage("Geolocation is not available, please enable it in your App Settings");
                    return;
                }

                const servicesEnabled = await Location.hasServicesEnabledAsync();
                if (!servicesEnabled) {
                    setErrorMessage("Gps deactivated on your android");
                    return;
                }

                let currentLocation = await Location.getLastKnownPositionAsync();
                if (!currentLocation) {
                    currentLocation = await Location.getCurrentPositionAsync();
                }

                const reverse = await Location.reverseGeocodeAsync({ latitude: currentLocation.coords.latitude, longitude:currentLocation.coords.longitude });
                reverse.map(
                    (items) => {
                        setCity(items.city)
                        setRegion(items.region)
                        setCountry(items.country)
                    }
                )

                setCurrentLocation(currentLocation);
            } catch (err) {
                setErrorMessage("Location error:");
            }
        };

        getPermission();
    }, []);


    const getCurrentWeather = async ({latitude, longitude, current}: weatherProps) => {
        const url = "https://api.open-meteo.com/v1/forecast";
        try {
            const responses = await fetchWeatherApi(url, { latitude, longitude, current });
            if (!responses || responses.length === 0) {
                setErrorMessage("could not find any result for the supplied address or coordinates.");
                return;
            }
            const response = responses[0];
            const utcOffsetSeconds = response.utcOffsetSeconds();
            const cur = response.current()!;

            const weatherData : currentProps = {
                time: new Date((Number(cur.time()) + utcOffsetSeconds) * 1000),
                temperature_2m: cur.variables(0)!.value(),
                wind_speed_10m: cur.variables(1)!.value(),
                weather_code:  cur.variables(2)!.value(),
            };
            setCurrentWeather(weatherData);
        } catch (err) {
            setErrorMessage("Weather fetch error:");
        }
    };


    const getTodayWeather = async ({latitude, longitude, hourly}: weatherProps) => {
        const url = "https://api.open-meteo.com/v1/forecast";
        try {
            const responses = await fetchWeatherApi(url, { latitude, longitude, hourly, forecast_days: 1 });
            if (!responses || responses.length === 0) {
                setErrorMessage("could not find any result for the supplied address or coordinates.");
                return;
            }
            const response = responses[0];

            const hour = response.hourly()!;


            const times = Array.from(
                { length: (Number(hour.timeEnd()) - Number(hour.time())) / hour.interval() },
                (_, i) => new Date((Number(hour.time()) + i * hour.interval()) * 1000)
            );
            const temperature_2m = hour.variables(0)!.valuesArray();
            const wind_speed_10m = hour.variables(1)!.valuesArray();
            const weather_code = hour.variables(2)!.valuesArray();
            if(!temperature_2m || !wind_speed_10m || !weather_code)
                return ;

            const weatherData: currentProps[] = times.map((time, index) => ({
                time,
                temperature_2m: temperature_2m[index],
                wind_speed_10m: wind_speed_10m[index],
                weather_code: weather_code[index],
            }));

            setTodayWeather(weatherData);


        } catch (err) {
            setErrorMessage("Weather fetch error:");
        }
    };


    const getWeeklyWeather = async ({latitude, longitude, daily}: weatherProps) => {
        const url = "https://api.open-meteo.com/v1/forecast";
        try {
            const start_date = new Date();
            const currentDayNumber = start_date.getDay() - 1;

            start_date.setDate(start_date.getDate() - currentDayNumber);

            const end_date = new Date();
            end_date.setDate(start_date.getDate() + 6);

            const responses = await fetchWeatherApi(url, { latitude, longitude, daily, start_date: start_date.toISOString().split('T')[0], end_date: end_date.toISOString().split('T')[0] });
            if (!responses || responses.length === 0) {
                setErrorMessage("could not find any result for the supplied address or coordinates.");
                return;
            }
            const response = responses[0];

            const day = response.daily()!;


            const times = Array.from(
                { length: (Number(day.timeEnd()) - Number(day.time())) / day.interval() },
                (_, i) => new Date((Number(day.time()) + i * day.interval()) * 1000)
            );
            const temperature_2m_max = day.variables(0)!.valuesArray();
            const temperature_2m_min = day.variables(1)!.valuesArray();
            const weather_code = day.variables(2)!.valuesArray();
            if(!temperature_2m_max || !temperature_2m_min || !weather_code)
                return ;

            const weatherData: currentProps[] = times.map((time, index) => ({
                time,
                temperature_2m_max: temperature_2m_max[index],
                temperature_2m_min: temperature_2m_min[index],
                weather_code: weather_code[index],

            }));
            setWeeklyWeather(weatherData);
        } catch (err) {
            setErrorMessage("Weather fetch error:");
        }
    };


    const getCurrentWeatherState = (weather_code:number | undefined) => {
        if (!weather_code)
            return null;
        if(weather_code >= 95) return "Thunderstorm";
        else if(weather_code >= 85) return "Snow showers";
        else if(weather_code >= 80) return "Rain showers";
        else if(weather_code >= 77) return "Snow grains";
        else if(weather_code >= 71) return "Snow fall";
        else if(weather_code >= 66) return "Freezing Rain";
        else if(weather_code >= 61) return "Rain";
        else if(weather_code >= 56) return "Freezing Drizzle";
        else if(weather_code >= 51) return "Drizzle";
        else if(weather_code >= 45) return "Fog";
        else if(weather_code >= 3) return "Partly cloudy and overcast";
        else if(weather_code >= 2) return "Partly cloudy";
        else if(weather_code >= 1) return "Mainly clear";
        else if(weather_code >= 0) return "Clear sky";
    }



    const Currently = () => {
        if (errorMessage){
            return (
                <ScrollView contentContainerStyle={styles.errorScreen}>
                    <Text style={styles.textNoGeo}>{errorMessage}</Text>
                </ScrollView>
            )
        }

        if(city && region && country && current){
            return (
                <ScrollView contentContainerStyle={styles.screen}>
                    <Text>{city}</Text>
                    <Text>{region}</Text>
                    <Text>{country}</Text>
                    <View style={styles.data}>
                        <Text style={styles.text}>{current.temperature_2m?.toPrecision(2)} °C</Text>
                        <Text style={styles.text}>{getCurrentWeatherState(current.weather_code)}</Text>
                        <Text style={styles.text}> {current.wind_speed_10m?.toPrecision(2)} km/h</Text>
                    </View>
                </ScrollView>
            );
        }
    };


    const Today = () => {
        if (errorMessage){
            return (
                <ScrollView contentContainerStyle={styles.errorScreen}>
                    <Text style={styles.textNoGeo}>{errorMessage}</Text>
                </ScrollView>
            )
        }

        if (city && region && country && today) {
            return (
                <ScrollView contentContainerStyle={styles.screen}>
                    <Text>{city}</Text>
                    <Text>{region}</Text>
                    <Text>{country}</Text>
                    {today.map((item,index) => (
                        <View key={index}  style={styles.data}>
                            <Text style={styles.text}>{item.time.getUTCHours().toString().padStart(2, '0')}:{item.time.getMinutes().toString().padStart(2, '0')} </Text>
                            <Text style={styles.text}>{item.temperature_2m?.toPrecision(2)} °C </Text>
                            <Text style={styles.text}>{getCurrentWeatherState(item.weather_code)} </Text>
                            <Text style={styles.text}>{item.wind_speed_10m?.toPrecision(2)} km/h</Text>
                        </View>
                    ))}
                </ScrollView>
            );
        }
    };


    const Weekly = () => {
        if (errorMessage){
            return (
                <ScrollView contentContainerStyle={styles.errorScreen}>
                    <Text style={styles.textNoGeo}>{errorMessage}</Text>
                </ScrollView>
            )
        }

        if (city && region && country && weekly ) {
            return (
                <ScrollView contentContainerStyle={styles.screen} >
                    <Text>{city}</Text>
                    <Text>{region}</Text>
                    <Text>{country}</Text>
                    {weekly.map((item,index) => (
                        <View key={index} style={styles.data}>
                            <Text style={styles.text}>{item.time.getFullYear().toString()}-{(item.time.getMonth() + 1).toString()}-{item.time.getDate().toString()}</Text>
                            <Text style={styles.text}>{item.temperature_2m_min?.toPrecision(2)} °C </Text>
                            <Text style={styles.text}>{item.temperature_2m_max?.toPrecision(2)} °C </Text>
                            <Text style={styles.text}>{getCurrentWeatherState(item.weather_code)}</Text>
                        </View>
                    ))}
                </ScrollView>
            );
        }
    };

    return (
        <View style={{flex: 1}}>
            <View style={styles.container}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#cfcfcf"/>

                    <TextInput
                        value={inputSearch}
                        placeholder="Search location..."
                        placeholderTextColor="#999"
                        onChangeText={setinputSearch}
                        style={styles.input}
                    />

                    <View style={styles.divider}/>

                    <Pressable
                        onPress={async () => {
                            if(currentLocation) {
                                getCurrentWeather({
                                    latitude: currentLocation.coords.latitude,
                                    longitude: currentLocation.coords.longitude,
                                    current: ["temperature_2m", "wind_speed_10m", "weather_code"]
                                })

                                getTodayWeather({
                                    latitude: currentLocation.coords.latitude,
                                    longitude: currentLocation.coords.longitude,
                                    hourly: ["temperature_2m", "wind_speed_10m", "weather_code"]
                                })

                                getWeeklyWeather({
                                    latitude: currentLocation.coords.latitude,
                                    longitude: currentLocation.coords.longitude,
                                    daily: ["temperature_2m_max", "temperature_2m_min", "weather_code"]
                                })

                                const reverse = await Location.reverseGeocodeAsync({ latitude: currentLocation.coords.latitude, longitude:currentLocation.coords.longitude });
                                reverse.map(
                                    (items) => {
                                        setCity(items.city)
                                        setRegion(items.region)
                                        setCountry(items.country)
                                    }
                                )
                                setErrorMessage(undefined)
                                setinputSearch("");
                            } else {
                                setErrorMessage("Geolocation is not available, please enable it in your App Settings");
                            }
                        }}
                    >
                        <Ionicons name="navigate" size={20} color="#cfcfcf"/>
                    </Pressable>
                </View>

                <View style={styles.suggestions}>
                    {suggestions && suggestions.map((city) => (
                        <Pressable
                            key={`${city.latitude}-${city.longitude}`}
                            onPress={() => {
                                getCurrentWeather({
                                    latitude: city.latitude,
                                    longitude: city.longitude,
                                    current: ["temperature_2m", "wind_speed_10m", "weather_code"]
                                })

                                getTodayWeather ({
                                    latitude: city.latitude,
                                    longitude: city.longitude,
                                    hourly: ["temperature_2m", "wind_speed_10m","weather_code"]
                                })

                                getWeeklyWeather ({
                                    latitude: city.latitude,
                                    longitude: city.longitude,
                                    daily: ["temperature_2m_max", "temperature_2m_min", "weather_code"]
                                })
                                setCity(city.name);
                                setRegion(city.admin1);
                                setCountry(city.country);
                                setErrorMessage(undefined)
                                setinputSearch("");
                            }}
                        >
                            <Text style={styles.suggestionItem}>{city.name + ", " + city.admin1 + ", " + city.country}</Text>
                        </Pressable>
                    ))}
                </View>
            </View>

            <Tab.Navigator
                tabBarPosition="bottom"
                screenOptions={{
                    tabBarStyle: {height: 60},
                    tabBarLabelStyle: {fontSize: 12},
                }}
            >
                <Tab.Screen
                    name="Currently"
                    children={() => <Currently/>}
                    options={{
                        tabBarIcon: ({color}) => (
                            <Ionicons name="sunny-outline" size={20} color={color}/>
                        ),
                    }}
                />
                <Tab.Screen
                    name="Today"
                    children={() => <Today/>}
                    options={{
                        tabBarIcon: ({color}) => (
                            <Ionicons name="today-outline" size={20} color={color}/>
                        ),
                    }}
                />
                <Tab.Screen
                    name="Weekly"
                    children={() => <Weekly/>}
                    options={{
                        tabBarIcon: ({color}) => (
                            <Ionicons name="calendar-outline" size={20} color={color}/>
                        ),
                    }}
                />
            </Tab.Navigator>
        </View>
    );
}


const styles = StyleSheet.create({
    screen: {
        justifyContent: "flex-start",
        alignItems: "center",
    },
    errorScreen: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    data : {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 5,
    },
    text: {
        flex: 1,
        textAlign: "center",
        fontSize: 12,
        fontWeight: "bold",
    },

    textNoGeo: {
        textAlign: "center",
        fontSize: 21,
        color: "#f07772",
    },

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