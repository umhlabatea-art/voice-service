import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useSession } from '@/lib/session';
import { isConfigured } from '@/lib/supabase';
import { colors } from '@/lib/theme';

// Entry gate: route to the app when authenticated, else to sign-in.
export default function Index() {
  const { session, loading } = useSession();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.navy }}>
        <ActivityIndicator color={colors.gold} size="large" />
      </View>
    );
  }

  // Unconfigured builds still reach the login screen, which explains the state.
  if (!isConfigured || !session) return <Redirect href="/login" />;
  return <Redirect href="/(app)" />;
}
