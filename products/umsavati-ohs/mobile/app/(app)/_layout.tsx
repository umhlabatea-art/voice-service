import { Stack } from 'expo-router';
import { colors } from '@/lib/theme';

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.navy },
        headerTintColor: colors.bone,
        headerTitleStyle: { fontWeight: '600' },
        contentStyle: { backgroundColor: colors.bone },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Organisations' }} />
      <Stack.Screen name="org/[id]" options={{ title: 'Compliance' }} />
    </Stack>
  );
}
