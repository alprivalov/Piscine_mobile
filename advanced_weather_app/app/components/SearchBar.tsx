import {useWeather} from "@/app/context/WeatherContext";
import {Ionicons} from "@expo/vector-icons";
import * as Location from "expo-location";
import React, {useEffect, useMemo, useState} from "react";
import { View, TextInput, Text, Pressable, StyleSheet } from "react-native";
import {error} from "@expo/fingerprint/cli/build/utils/log";


export default function SearchBar() {

    const [inputSearch, setInputSearch] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>();

    const { setCity, setRegion, setCountry, setCurrentLocation, setErrorMessage } = useWeather();



    useEffect(() => {
        if(!inputSearch){
            setSuggestions([]);
            return;
        }

        const fetchCity = async () => {
            try {
                const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
                    inputSearch
                )}&count=5&language=en&format=json`;

                const response = await fetch(url);
                return await response.json();
            } catch (err) {
                setErrorMessage("The service connection is lost, please check your internet connection and try again.");
                setSuggestions([]);
            }
        };

        fetchCity().then(r => setSuggestions(r.results));
    }, [inputSearch]);


    const suggestionsMemo = useMemo(() => {
        return suggestions
    }, [suggestions]);

    const handleGeolocation = async () => {
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

            let curlocation = await Location.getLastKnownPositionAsync();
            if (!curlocation) {
                curlocation = await Location.getCurrentPositionAsync();
            }

            setCurrentLocation({
                latitude : curlocation.coords.latitude,
                longitude : curlocation.coords.longitude,
            });


            const reverse = await Location.reverseGeocodeAsync({ latitude: curlocation.coords.latitude, longitude:curlocation.coords.longitude });
            reverse.map(
                (items) => {
                    setCity(items.city)
                    setRegion(items.region)
                    setCountry(items.country)
                }
            )
            setErrorMessage(undefined);
            setInputSearch("");
        } catch (Error) {
            setErrorMessage("Geolocation Error");
        }
    }

    return(
        <View style={styles.container}>
            <View style={styles.searchBar}>
                <Ionicons name="search" size={20} color="#000"/>

                <TextInput
                    value={inputSearch}
                    placeholder="Search location..."
                    placeholderTextColor="#000"
                    onChangeText={setInputSearch}
                    style={styles.input}
                />

                <View style={styles.divider}/>

                <Pressable onPress={handleGeolocation}>
                    <Ionicons name="navigate" size={20} color="#000"/>
                </Pressable>
            </View>

            <View style={styles.suggestions}>
                {suggestionsMemo && suggestionsMemo.map((city) =>(
                        <View style={styles.suggestions}
                              key={`${city.latitude}-${city.longitude}`}
                        >
                            <Pressable
                                onPress={() => {
                                    setCurrentLocation({
                                        latitude : city.latitude,
                                        longitude : city.longitude,
                                    })
                                    setCity(city.name);
                                    setRegion(city.admin1);
                                    setCountry(city.country);
                                    setInputSearch("");
                                    setErrorMessage(undefined);
                                }}>
                                <Text style={styles.suggestionItem}> <Ionicons name="business-outline" size={20} /> <Text style={styles.bold}> {city.name}</Text>{", " + city.admin1 + ", " + city.country}</Text>
                            </Pressable>
                        </View>
                    )
                )}
            </View>
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        backgroundColor: '#34495e',
        paddingTop: 10,
        paddingBottom: 12,
        paddingHorizontal: 12,
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
        backgroundColor: 'rgba(255,255,255,0.3)',
        marginHorizontal: 10,
    },

    suggestionItem: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 2,
    },

    suggestions: {
        overflow: 'hidden',
    },

    bold: {
        fontWeight: "bold",
    },

});