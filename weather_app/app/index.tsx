import {StyleSheet, Text, View} from "react-native";
import AppBar from "@/app/components/AppBar";
import "react-native-gesture-handler";
import {Ionicons} from "@expo/vector-icons";


import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {useState, useEffect} from "react";

const Tab = createMaterialTopTabNavigator();

export default function Index() {

    const [search, setSearch] = useState<string>("");


    useEffect(() => {
        if (!search) return;
        console.log("Search changed:", search);
    }, [search]);


    function CurrentlyScreen() {
        return (
            <View style={styles.screen}>
                <Text style={styles.text}>Currently</Text>
                <Text style={styles.text}>{search}</Text>
            </View>
        );
    }

    function TodayScreen() {
        return (
            <View style={styles.screen}>
                <Text style={styles.text}>Today</Text>
                <Text style={styles.text}>{search}</Text>
            </View>
        );
    }

    function WeeklyScreen() {
        return (
            <View style={styles.screen}>
                <Text style={styles.text}>Weekly</Text>
                <Text style={styles.text}>{search}</Text>
            </View>
        );
    }

  return (
      <View style={{ flex: 1 }}>
          <AppBar
              value={search}
              onChange={setSearch}
              onLocate={() => console.log("locate")}
          />
          <Tab.Navigator tabBarPosition="bottom" screenOptions={{
              tabBarStyle: {height: 60},
              tabBarLabelStyle: {fontSize: 12},
          }}>
              <Tab.Screen name="Currently" component={CurrentlyScreen} options={{
                  tabBarIcon: ({color}) => {
                      return <Ionicons name="sunny-outline" size={20} color={color}/>;
                  }
              }} />
              <Tab.Screen name="Today" component={TodayScreen} options={{
                  tabBarIcon: ({color}) => {
                      return <Ionicons name="today-outline" size={20} color={color}/>;
                  }
              }} />
              <Tab.Screen name="Weekly" component={WeeklyScreen} options={{
                  tabBarIcon: ({color}) => {
                      return <Ionicons name="calendar-outline" size={20} color={color}/>;
                  }
              }} />
          </Tab.Navigator>
      </View>
  );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 36,
        fontWeight: "bold",
    }
});
