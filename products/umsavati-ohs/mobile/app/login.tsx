import { useState } from 'react';
import { useRouter } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Button, Notice } from '@/components/ui';
import { supabase, isConfigured } from '@/lib/supabase';
import { colors, spacing } from '@/lib/theme';

type Mode = 'sign-in' | 'sign-up';

export default function Login() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('sign-in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function submit() {
    setError(null);
    setInfo(null);
    if (!email || !password) {
      setError('Enter an email and password.');
      return;
    }
    setBusy(true);
    try {
      if (mode === 'sign-in') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.replace('/(app)');
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.session) router.replace('/(app)');
        else setInfo('Account created. Check your email to confirm, then sign in.');
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Authentication failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.brand}>UMHLABATEA (Pty) Ltd</Text>
        <Text style={styles.title}>Umsavati OHS</Text>
        <Text style={styles.subtitle}>Occupational health & safety compliance, on site.</Text>

        {!isConfigured ? (
          <Notice>
            Not connected. Set EXPO_PUBLIC_SUPABASE_URL and
            EXPO_PUBLIC_SUPABASE_ANON_KEY in .env, then restart Expo.
          </Notice>
        ) : (
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.steel}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.steel}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {info ? <Text style={styles.info}>{info}</Text> : null}
            <Button
              label={mode === 'sign-in' ? 'Sign in' : 'Create account'}
              onPress={submit}
              loading={busy}
            />
            <Button
              label={mode === 'sign-in' ? 'Need an account? Sign up' : 'Have an account? Sign in'}
              variant="outline"
              onPress={() => {
                setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in');
                setError(null);
                setInfo(null);
              }}
            />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.lg, gap: spacing.sm, flexGrow: 1, justifyContent: 'center' },
  brand: { color: colors.gold, fontSize: 12, letterSpacing: 1, fontWeight: '600' },
  title: { color: colors.navy, fontSize: 32, fontWeight: '700' },
  subtitle: { color: colors.steel, fontSize: 15, marginBottom: spacing.lg },
  form: { gap: spacing.sm },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    color: colors.navy,
    fontSize: 15,
    backgroundColor: colors.surface,
  },
  error: { color: colors.ohsNonCompliant, fontSize: 14 },
  info: { color: colors.ohsCompliant, fontSize: 14 },
});
