import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const baseWidth = 360;
const scaleFactor = width / baseWidth;

import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="allTasks"
            options={{
              title: 'Todas as Tarefas',
              headerStyle: {
                backgroundColor: Colors[colorScheme ?? 'light'].tint,
                elevation: 0, 
                shadowOpacity: 0, 
                borderBottomWidth: 0, 
              },
              headerTitleStyle: {
                color: Colors[colorScheme ?? 'light'].title,
                fontSize: 22 * scaleFactor,
              },
              headerTintColor: Colors[colorScheme ?? 'light'].title,
              headerTitleAlign: 'center',
              headerShadowVisible: false, 
            }}
          />

          <Stack.Screen name="+not-found" />
        </Stack>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}
