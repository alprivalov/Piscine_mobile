import { View, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {WeatherProvider} from "@/app/context/WeatherContext";
import Currently from "@/app/components/Currently";
import * as Location from "expo-location";
import Today from "@/app/components/Today";
import Weekly from "@/app/components/Weekly";
import SearchBar from "@/app/components/SearchBar";
import {useEffect} from "react";

const Tab = createMaterialTopTabNavigator();

export default function Index() {

    return (
        <View style={{flex: 1}}>
            <WeatherProvider>
                <SearchBar/>
                <ImageBackground source={require("../assets/images/012375e9-b3bd-4383-87b3-cb07b14ee766.jpg")} resizeMode="cover" style={{ flex: 1 }}>
                <Tab.Navigator
                    tabBarPosition="bottom"
                    screenOptions={{
                        tabBarStyle: {
                            height: 100,
                            backgroundColor: "rgba(0,0,0,0.6)",
                            borderTopWidth: 0,
                            elevation: 0,
                        },
                        tabBarLabelStyle: {fontSize: 12},
                        sceneStyle: {backgroundColor: "transparent"},
                        tabBarActiveTintColor: '#16c1ff',
                        tabBarInactiveTintColor: '#bdc3c7',
                    }}
                >
                    <Tab.Screen
                        name="Currently"
                        component={Currently}
                        options={{
                            tabBarIcon: ({color}) => (
                                <Ionicons name="sunny-outline" size={20} color={color}/>
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="Today"
                        component={Today}
                        options={{
                            tabBarIcon: ({color}) => (
                                <Ionicons name="today-outline" size={20} color={color}/>
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="Weekly"
                        component={Weekly}
                        options={{
                            tabBarIcon: ({color}) => (
                                <Ionicons name="calendar-outline" size={20} color={color}/>
                            ),
                        }}
                    />
                </Tab.Navigator>
                </ImageBackground>
            </WeatherProvider>
        </View>
    );
}
