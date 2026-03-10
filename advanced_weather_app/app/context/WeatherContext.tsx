import React, {createContext, JSX, useContext, useEffect, useState} from "react";
import * as Location from "expo-location";
import {Text, View} from "react-native";
import {fetchWeatherApi} from "openmeteo";
import {Fontisto, MaterialCommunityIcons} from "@expo/vector-icons";

type WeatherContextType = {
    city: string | null,
    region: string | null,
    country: string | null,
    current: any | null,
    errorMessage?: string | undefined,
    getCurrentWeatherState: (
        code: number | undefined,
        type: number,
        iconSize: number,
        textSize: number,
    ) => JSX.Element | null,
}

type currentProps = {
    time: Date,
    temperature_2m?: number,
    wind_speed_10m?: number,
    temperature_2m_min?: number,
    temperature_2m_max?: number,
    weather_code?: number,
}

type weatherProps = {
    latitude: number,
    longitude: number,
    current?: string[],
    daily?: string[],
    hourly?: string[],
};

type CurrentLocation = {
    longitude: number,
    latitude: number,
}

const WeatherContext = createContext<WeatherContextType | null>(null);

export const WeatherProvider = ({ children }: {children: React.ReactNode }) => {
    const [city, setCity] = useState<string | null>(null);
    const [region, setRegion] = useState<string | null>(null);
    const [country, setCountry] = useState<string | null>(null);

    const [today, setToday] = useState<currentProps[]>();
    const [weekly, setWeekly] = useState<currentProps[]>();
    const [current, setCurrent] = useState<currentProps>({
        time: new Date(),
        temperature_2m: 5,
        wind_speed_10m: 5,
        temperature_2m_min: 5,
        temperature_2m_max: 5,
        weather_code: 5,
    });

    const [currentLocation, setCurrentLocation] = useState<CurrentLocation | null>(null);

    const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

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



            const reverse = await Location.reverseGeocodeAsync({ latitude: curlocation.coords.latitude, longitude:curlocation.coords.longitude });
            reverse.map(
                (items) => {
                    setCity(items.city)
                    setRegion(items.region)
                    setCountry(items.country)
                }
            )


            setCurrentLocation({
                latitude : curlocation.coords.latitude,
                longitude : curlocation.coords.longitude,
            });

        } catch (Error) {
            setErrorMessage("Geolocation Error");
        }
    }

    useEffect(() => {
        handleGeolocation();
    }, []);

    useEffect(() => {
        if (!currentLocation) return ;
        getCurrentWeather({
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            current: ["temperature_2m", "wind_speed_10m", "weather_code"]
        });
        getTodayWeather({
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            hourly: ["temperature_2m", "wind_speed_10m", "weather_code"],
        });
        getWeeklyWeather({
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            daily: ["temperature_2m_max", "temperature_2m_min", "weather_code"],
        });
    }, [currentLocation]);

    const getCurrentWeatherState = (weather_code: number | undefined, type: number, iconSize: number ,textSize: number) => {
        if (weather_code === undefined) return null;

        const colors = {
            sun: "#FFD700",
            cloud: "#FFFFFF",
            fog: "#BDC3C7",
            rain: "#3498DB",
            thunder: "#F1C40F"
        };

        const WeatherDisplay = ({icon, label, type} : { icon: React.ReactNode, label: string, type : number} ) => (
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                {type == 1 && <Text style={{fontSize: textSize}}>{label}</Text>}
                {icon}
            </View>
        )


        if (weather_code >= 95)
            return <WeatherDisplay type={type} label="Thunderstorm" icon={<MaterialCommunityIcons name="weather-lightning-rainy" size={iconSize} color={colors.thunder} />} />;
        else if (weather_code >= 80)
            return <WeatherDisplay type={type} label="Rains showers" icon={<Fontisto name="rains" size={iconSize} color={colors.rain}/>} />;
        else if (weather_code >= 45)
            return <WeatherDisplay type={type} label="Fog" icon={<Fontisto name="fog" size={iconSize} color={colors.rain}/>} />;
        else if (weather_code >= 3)
            return <WeatherDisplay type={type} label="Cloudy" icon={<Fontisto name="cloudy" size={iconSize} color={colors.cloud}/>} />;
        else if (weather_code >= 1)
            return <WeatherDisplay type={type} label="Mainly clear" icon={<Fontisto name="day-cloudy" size={iconSize} color={colors.sun}/>} />;
        else
            return <WeatherDisplay type={type} label="Clear sky" icon={<Fontisto name="day-sunny" size={iconSize} color={colors.sun}/>} />;
    };



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
            setCurrent(weatherData);
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

            setToday(weatherData);


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
            setWeekly(weatherData);
        } catch (err) {
            setErrorMessage("Weather fetch error:");
        }
    };


    const value = {
        city,
        region,
        country,
        current,
        today,
        weekly,
        errorMessage,
        currentLocation,
        setCity,
        setRegion,
        setCountry,
        setCurrent,
        setToday,
        setWeekly,
        setErrorMessage,
        setCurrentLocation,
        getCurrentWeatherState,
    };

    return (
      <WeatherContext.Provider value={value}>
        {children}
      </WeatherContext.Provider>
    );
}


export const useWeather = () => {
    const context = useContext(WeatherContext);
    if (!context) {
        throw new Error("useWeather must be used within WeatherProvider");
    }
    return context;
}
