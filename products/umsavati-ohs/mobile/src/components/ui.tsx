import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ViewStyle,
} from 'react-native';
import { BAND_META, colors, radius, spacing } from '@/lib/theme';
import type { ComplianceBand } from '@/lib/types';

export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function BandChip({ band }: { band: ComplianceBand }) {
  const meta = BAND_META[band];
  return (
    <View style={[styles.chip, { backgroundColor: meta.color }]}>
      <Text style={styles.chipText}>{meta.label}</Text>
    </View>
  );
}

export function Button({
  label,
  onPress,
  loading,
  disabled,
  variant = 'gold',
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'gold' | 'outline';
}) {
  const isGold = variant === 'gold';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        isGold ? styles.buttonGold : styles.buttonOutline,
        (disabled || loading) && styles.buttonDisabled,
        pressed && styles.buttonPressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isGold ? colors.navy : colors.navy} />
      ) : (
        <Text style={[styles.buttonText, isGold ? styles.buttonTextGold : styles.buttonTextOutline]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

export function Notice({ children }: { children: ReactNode }) {
  return (
    <Card style={{ borderColor: colors.border }}>
      <Text style={styles.notice}>{children}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  chip: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  button: {
    height: 48,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  buttonGold: { backgroundColor: colors.gold },
  buttonOutline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
  buttonDisabled: { opacity: 0.5 },
  buttonPressed: { opacity: 0.85 },
  buttonText: { fontSize: 15, fontWeight: '600' },
  buttonTextGold: { color: colors.navy },
  buttonTextOutline: { color: colors.navy },
  notice: { color: colors.steel, fontSize: 14, lineHeight: 20 },
});
