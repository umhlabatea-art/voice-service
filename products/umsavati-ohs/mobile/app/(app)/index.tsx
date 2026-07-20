import { useCallback, useState } from 'react';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button, Card, Notice } from '@/components/ui';
import { supabase, isConfigured } from '@/lib/supabase';
import { colors, spacing } from '@/lib/theme';
import type { Organisation } from '@/lib/types';

export default function Organisations() {
  const router = useRouter();
  const [orgs, setOrgs] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isConfigured) {
      setLoading(false);
      return;
    }
    setError(null);
    const { data, error } = await supabase
      .from('organisations')
      .select('*')
      .order('created_at');
    if (error) setError(error.message);
    setOrgs((data as Organisation[] | null) ?? []);
    setLoading(false);
  }, []);

  // Reload on focus so a scan run on the detail screen is reflected on return.
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load]),
  );

  async function signOut() {
    await supabase.auth.signOut();
    router.replace('/login');
  }

  if (!isConfigured) {
    return (
      <View style={styles.container}>
        <Notice>
          Not connected. Set the Supabase env vars in .env and restart Expo.
        </Notice>
      </View>
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={orgs}
      keyExtractor={(o) => o.id}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={load} tintColor={colors.gold} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.lead}>
            Your organisations. Tap one to view its compliance score or run a scan.
          </Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
      }
      ListEmptyComponent={
        !loading ? (
          <Card>
            <Text style={styles.emptyTitle}>No organisations yet</Text>
            <Text style={styles.emptyBody}>
              Create one in the Umsavati OS web dashboard, then pull to refresh here.
            </Text>
          </Card>
        ) : null
      }
      renderItem={({ item }) => (
        <Link href={{ pathname: '/(app)/org/[id]', params: { id: item.id } }} asChild>
          <Pressable>
            <Card style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.orgName}>{item.name}</Text>
                <Text style={styles.orgMeta}>
                  {item.sector}
                  {item.cidb_grade ? ` · CIDB ${item.cidb_grade}` : ''}
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </Card>
          </Pressable>
        </Link>
      )}
      ListFooterComponent={
        <View style={styles.footer}>
          <Button label="Sign out" variant="outline" onPress={signOut} />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.md, gap: spacing.sm },
  header: { gap: spacing.xs, marginBottom: spacing.xs },
  lead: { color: colors.steel, fontSize: 14, lineHeight: 20 },
  error: { color: colors.ohsNonCompliant, fontSize: 14 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  orgName: { color: colors.navy, fontSize: 17, fontWeight: '600', textTransform: 'capitalize' },
  orgMeta: { color: colors.steel, fontSize: 13, marginTop: 2, textTransform: 'capitalize' },
  chevron: { color: colors.steel, fontSize: 28, fontWeight: '300' },
  emptyTitle: { color: colors.navy, fontSize: 16, fontWeight: '600' },
  emptyBody: { color: colors.steel, fontSize: 14, marginTop: spacing.xs, lineHeight: 20 },
  footer: { marginTop: spacing.md },
});
