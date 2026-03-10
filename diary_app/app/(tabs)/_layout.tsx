import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import {Image, Pressable, TouchableOpacity, StyleSheet} from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import {Ionicons} from "@expo/vector-icons";
import {useAuth} from "@/contexts/AuthContext";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user, logout } = useAuth();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
          sceneStyle: {
            backgroundColor: "transparent",
          },
          headerShadowVisible:false,
        headerShown: useClientOnlyValue(false, true),
      }}>
    <Tabs.Screen
    name="profile"
    options={{
        title: "Profile",
        headerTitleAlign: 'center',
        tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color}/>,
        headerLeft: () => (
            <Image source={{uri: user.photoURL}}
            style={{
                width: 40,
                height: 40,
                borderRadius: 40,
                marginLeft: 20,
            }}/>
        ),
        headerRight: () => (
            <Link href={"/"} asChild>
                <TouchableOpacity onPress={() => logout}>
                    <Ionicons name="exit-outline"
                              style={{
                                  fontSize:40,
                                  borderRadius: 40,
                                  marginRight: 20,
                              }}/>
                </TouchableOpacity>
            </Link>
            )
        }}
    />
    </Tabs>
  );
}

