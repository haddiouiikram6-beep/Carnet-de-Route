import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

// ─── helpers ────────────────────────────────────────────────────────────────

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const getDurationDays = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

// ─── component ──────────────────────────────────────────────────────────────

/**
 * TripCard
 * @param {{ trip: object, index: number, onPress: () => void }} props
 */
export default function TripCard({ trip, index, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const accentColor = colors.cardAccents[index % colors.cardAccents.length];
  const duration = getDurationDays(trip.startDate, trip.endDate);

  // ── micro-animation on press ───────────────────────────────────────────────
  const handlePressIn = () =>
    Animated.spring(scale, {
      toValue: 0.965,
      useNativeDriver: true,
      tension: 400,
      friction: 25,
    }).start();

  const handlePressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      tension: 400,
      friction: 25,
    }).start();

  // ── badge styles derived from accent color ────────────────────────────────
  const badgeBg = `${accentColor}20`;
  const badgeBorder = `${accentColor}50`;

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        {/* Left accent stripe */}
        <View style={[styles.accentStripe, { backgroundColor: accentColor }]} />

        <View style={styles.body}>
          {/* ── Row 1 : Title + Duration badge ── */}
          <View style={styles.rowBetween}>
            <Text style={styles.title} numberOfLines={1}>
              {trip.title}
            </Text>
            <View style={[styles.durationBadge, { backgroundColor: badgeBg, borderColor: badgeBorder }]}>
              <Text style={[styles.durationText, { color: accentColor }]}>
                {duration}j
              </Text>
            </View>
          </View>

          {/* ── Row 2 : Destination ── */}
          <View style={styles.rowInline}>
            <Ionicons name="location-sharp" size={13} color={accentColor} />
            <Text style={styles.destination} numberOfLines={1}>
              {trip.destination}
            </Text>
          </View>

          {/* ── Row 3 : Date range ── */}
          <View style={styles.datesRow}>
            <View style={styles.dateBlock}>
              <Text style={styles.dateLabel}>DÉPART</Text>
              <Text style={styles.dateValue}>{formatDate(trip.startDate)}</Text>
            </View>

            <View style={styles.dateSep}>
              <Ionicons name="airplane" size={13} color={colors.textMuted} />
            </View>

            <View style={[styles.dateBlock, styles.dateBlockRight]}>
              <Text style={[styles.dateLabel, styles.dateLabelRight]}>RETOUR</Text>
              <Text style={[styles.dateValue, styles.dateValueRight]}>
                {formatDate(trip.endDate)}
              </Text>
            </View>
          </View>

          {/* ── Row 4 : Notes preview ── */}
          {trip.notes ? (
            <Text style={styles.notes} numberOfLines={1}>
              {trip.notes}
            </Text>
          ) : null}

          {/* ── Chevron ── */}
          <View style={styles.chevronRow}>
            <Ionicons name="chevron-forward" size={15} color={colors.textMuted} />
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

// ─── styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.cardBg,
    borderRadius: 18,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  accentStripe: {
    width: 4,
    margin: 10,
    marginRight: 0,
    borderRadius: 4,
  },
  body: {
    flex: 1,
    padding: 16,
    paddingLeft: 14,
  },

  // row helpers
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  rowInline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 4,
  },

  // title
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    marginRight: 10,
  },

  // duration badge
  durationBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  durationText: {
    fontSize: 11,
    fontWeight: '800',
  },

  // destination
  destination: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },

  // dates
  datesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateBlock: {
    flex: 1,
  },
  dateBlockRight: {
    alignItems: 'flex-end',
  },
  dateLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  dateLabelRight: {
    textAlign: 'right',
  },
  dateValue: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  dateValueRight: {
    textAlign: 'right',
  },
  dateSep: {
    paddingHorizontal: 10,
  },

  // notes
  notes: {
    color: colors.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 4,
  },

  // chevron
  chevronRow: {
    alignItems: 'flex-end',
    marginTop: 2,
  },
});
