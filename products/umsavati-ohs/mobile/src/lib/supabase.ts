import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Env-guard mirrors the web app: the UI checks `isConfigured` and shows a
// "not connected" state instead of crashing when .env is absent.
export const isConfigured = Boolean(url && anonKey);

// Session token store. SecureStore is the encrypted keychain/keystore, but it
// caps values at ~2 KB; a large session can overflow, so fall back to
// AsyncStorage above the limit. Web has no SecureStore — use AsyncStorage.
const SECURE_LIMIT = 2000;

const secureAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => {
    if (value.length > SECURE_LIMIT) return AsyncStorage.setItem(key, value);
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

const storage = Platform.OS === 'web' ? AsyncStorage : secureAdapter;

// A single client instance. When unconfigured we still construct one against
// placeholder values so imports resolve; callers gate on `isConfigured`.
export const supabase: SupabaseClient = createClient(
  url ?? 'http://localhost',
  anonKey ?? 'public-anon-placeholder',
  {
    auth: {
      storage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);
