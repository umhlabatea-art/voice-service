import { useCallback, useState } from 'react';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { BandChip, Button, Card, Notice } from '@/components/ui';
import { supabase, isConfigured } from '@/lib/supabase';
import { colors, spacing } from '@/lib/theme';
import { DIMENSIONS, type ComplianceScore, type Organisation } from '@/lib/types';

export default function OrgDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [org, setOrg] = useState<Organisation | null>(null);
  const [score, setScore] = useState<ComplianceScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!isConfigured || !id) {
      setLoading(false);
      return;
    }
    setError(null);
    const [{ data: o }, { data: s }] = await Promise.all([
      supabase.from('organisations').select('*').eq('id', id).maybeSingle(),
      supabase
        .from('compliance_scores')
        .select('*')
        .eq('organisation_id', id)
        .order('scored_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);
    setOrg((o as Organisation | null) ?? null);
    setScore((s as ComplianceScore | null) ?? null);
    setLoading(false);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load]),
  );

  async function runScan() {
    setError(null);
    setScanning(true);
    try {
      // Same engine as the web app — the score-organisation Edge Function is the
      // only write path; total/band come back DB-generated.
      const { error } = await supabase.functions.invoke('score-organisation', {
        body: { organisation_id: id },
      });
      if (error) throw error;
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Scan failed.');
    } finally {
      setScanning(false);
    }
  }

  if (!isConfigured) {
    return (
      <View style={styles.container}>
        <Notice>Not connected. Set the Supabase env vars and restart Expo.</Notice>
      </View>
    );
  }

  if (!loading && !org) {
    return (
      <View style={styles.container}>
        <Notice>Organisation not found, or you do not have access to it.</Notice>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.name}>{org?.name ?? '…'}</Text>
      {org ? (
        <Text style={styles.meta}>
          {org.sector}
          {org.cidb_grade ? ` · CIDB grade ${org.cidb_grade}` : ''}
          {org.coid_registration ? ` · COID ${org.coid_registration}` : ''}
        </Text>
      ) : null}

      <Card style={styles.scoreCard}>
        {score ? (
          <>
            <View style={styles.scoreRow}>
              <Text style={styles.scoreValue}>{Number(score.total).toFixed(1)}</Text>
              <BandChip band={score.band} />
            </View>
            <Text style={styles.scoredAt}>
              Scored {new Date(score.scored_at).toLocaleString('en-ZA')}
            </Text>
          </>
        ) : (
          <Text style={styles.noScore}>
            {loading ? 'Loading…' : 'No scan on record yet. Run one below.'}
          </Text>
        )}
      </Card>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        label={score ? 'Re-run compliance scan' : 'Run compliance scan'}
        onPress={runScan}
        loading={scanning}
        disabled={loading}
      />

      {score ? (
        <View style={styles.dims}>
          <Text style={styles.dimsTitle}>Dimension breakdown</Text>
          {DIMENSIONS.map((d) => (
            <View key={d.key} style={styles.dimRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.dimLabel}>{d.label}</Text>
                <Text style={styles.dimWeight}>{d.weight}% weight</Text>
              </View>
              <Text style={styles.dimValue}>{Number(score[d.key]).toFixed(1)}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: spacing.md, gap: spacing.sm },
  name: { color: colors.navy, fontSize: 26, fontWeight: '700', textTransform: 'capitalize' },
  meta: { color: colors.steel, fontSize: 14, textTransform: 'capitalize' },
  scoreCard: { marginTop: spacing.sm },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  scoreValue: { color: colors.navy, fontSize: 48, fontWeight: '700' },
  scoredAt: { color: colors.steel, fontSize: 12, marginTop: spacing.xs },
  noScore: { color: colors.steel, fontSize: 15 },
  error: { color: colors.ohsNonCompliant, fontSize: 14 },
  dims: { marginTop: spacing.md, gap: spacing.xs },
  dimsTitle: { color: colors.navy, fontSize: 16, fontWeight: '600', marginBottom: spacing.xs },
  dimRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dimLabel: { color: colors.navy, fontSize: 15 },
  dimWeight: { color: colors.steel, fontSize: 12, marginTop: 2 },
  dimValue: { color: colors.navy, fontSize: 18, fontWeight: '600' },
});
