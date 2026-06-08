import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Ionicons from "@expo/vector-icons/Ionicons";

import HomeScreen from "../screens/HomeScreen";
import MapScreen from "../screens/MapScreen";
import AlertsScreen from "../screens/AlertsScreen";
import DashboardScreen from "../screens/DashboardScreen";
import SettingsScreen from "../screens/SettingsScreen";

import { COLORS } from "../theme/colors";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,

          tabBarStyle: {
            backgroundColor: "#1E293B",
            borderTopWidth: 0,
            height: 70,
          },

          tabBarActiveTintColor:
            COLORS.primary,

          tabBarInactiveTintColor:
            COLORS.subtitle,

          tabBarIcon: ({
            color,
            size,
          }) => {
            let iconName: any;

            if (route.name === "Home")
              iconName = "home";

            if (route.name === "Mapa")
              iconName = "map";

            if (route.name === "Alertas")
              iconName = "warning";

            if (route.name === "Dashboard")
              iconName = "stats-chart";

            if (
              route.name ===
              "Configurações"
            )
              iconName = "settings";

            return (
              <Ionicons
                name={iconName}
                size={size}
                color={color}
              />
            );
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
        />

        <Tab.Screen
          name="Mapa"
          component={MapScreen}
        />

        <Tab.Screen
          name="Alertas"
          component={AlertsScreen}
        />

        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
        />

        <Tab.Screen
          name="Configurações"
          component={SettingsScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}