import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import colors from '../src/constants/colors';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor={colors.background} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontWeight: '700', fontSize: 17 },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        {/* Home — full custom header */}
        <Stack.Screen name="index" options={{ headerShown: false }} />

        {/* Add trip — standard dark header */}
        <Stack.Screen
          name="add-trip"
          options={{
            title: 'Nouveau Voyage',
            headerBackTitle: 'Retour',
          }}
        />

        {/* Trip detail — full custom hero */}
        <Stack.Screen name="trip/[id]" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
