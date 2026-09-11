import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTripById } from '../../src/hooks/useTrips';
import apiService from '../../src/services/apiService';
import colors from '../../src/constants/colors';

// ─── helpers ─────────────────────────────────────────────────────────────────

const getDurationDays = (start, end) => {
  const diff = new Date(end) - new Date(start);
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const formatDateLong = (dateStr) =>
  new Date(dateStr).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

// ─── sub-components ───────────────────────────────────────────────────────────

function InfoCard({ title, children }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

function StatItem({ value, label }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// ─── screen ──────────────────────────────────────────────────────────────────

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { trip, loading, error } = useTripById(id);

  const handleDelete = () => {
    Alert.alert(
      'Supprimer le voyage ?',
      `Le voyage « ${trip.title} » sera définitivement supprimé.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.deleteTrip(id);
              router.replace('/');
            } catch (err) {
              Alert.alert('Erreur', err.message || 'Impossible de supprimer le voyage.');
            }
          },
        },
      ]
    );
  };

  // ── loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Chargement du voyage…</Text>
      </View>
    );
  }

  // ── error / not found ────────────────────────────────────────────────────
  if (error || !trip) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.notFoundEmoji}>😕</Text>
        <Text style={styles.notFoundTitle}>Voyage introuvable</Text>
        <Text style={styles.notFoundSub}>{error}</Text>
        <TouchableOpacity style={styles.backFallbackBtn} onPress={() => router.back()}>
          <Text style={styles.backFallbackText}>← Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const duration = getDurationDays(trip.startDate, trip.endDate);

  // ── render ───────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <LinearGradient
        colors={['#1c1245', '#0e0b2e', '#0A0A1A']}
        style={styles.hero}
      >
        <SafeAreaView>
          {/* Back button */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#fff" />
          </TouchableOpacity>

          {/* Hero content */}
          <View style={styles.heroBody}>
            <Text style={styles.heroEmoji}>✈️</Text>

            <Text style={styles.heroTitle}>{trip.title}</Text>

            <View style={styles.heroLocationRow}>
              <Ionicons name="location-sharp" size={15} color={colors.primary} />
              <Text style={styles.heroLocation}>{trip.destination}</Text>
            </View>

            <View style={styles.heroBadge}>
              <Ionicons name="time-outline" size={13} color={colors.primary} />
              <Text style={styles.heroBadgeText}>
                {duration} jour{duration !== 1 ? 's' : ''} de voyage
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* ── Scrollable content ───────────────────────────────────────────── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Dates card */}
        <InfoCard title="📅  Dates du voyage">
          <View style={styles.datesGrid}>
            <View style={styles.dateBlock}>
              <Text style={styles.dateBlockLabel}>DÉPART</Text>
              <Text style={styles.dateBlockValue} numberOfLines={2}>
                {formatDateLong(trip.startDate)}
              </Text>
            </View>

            <View style={styles.dateDivider}>
              <Ionicons name="airplane" size={20} color={colors.primary} />
            </View>

            <View style={[styles.dateBlock, styles.dateBlockRight]}>
              <Text style={[styles.dateBlockLabel, { textAlign: 'right' }]}>RETOUR</Text>
              <Text style={[styles.dateBlockValue, { textAlign: 'right' }]} numberOfLines={2}>
                {formatDateLong(trip.endDate)}
              </Text>
            </View>
          </View>
        </InfoCard>

        {/* Stats card */}
        <InfoCard title="📊  Statistiques">
          <View style={styles.statsRow}>
            <StatItem value={duration} label="Jours" />
            <View style={styles.statsDivider} />
            <StatItem value={`#${trip.id}`} label="Voyage" />
            <View style={styles.statsDivider} />
            <StatItem
              value={new Date(trip.startDate).getFullYear()}
              label="Année"
            />
          </View>
        </InfoCard>

        {/* Notes card */}
        {trip.notes ? (
          <InfoCard title="📝  Notes & Souvenirs">
            <Text style={styles.notesText}>{trip.notes}</Text>
          </InfoCard>
        ) : (
          <View style={[styles.card, styles.emptyNotesCard]}>
            <Ionicons name="document-text-outline" size={34} color={colors.textMuted} />
            <Text style={styles.emptyNotesText}>Aucune note pour ce voyage.</Text>
          </View>
        )}

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => router.push({ pathname: '/add-trip', params: { id: String(id) } })}
          >
            <Ionicons name="create-outline" size={18} color="#fff" />
            <Text style={styles.actionButtonText}>Modifier</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
          >
            <Ionicons name="trash-outline" size={18} color="#fff" />
            <Text style={styles.actionButtonText}>Supprimer</Text>
          </TouchableOpacity>
        </View>

        {/* Back button at bottom */}
        <TouchableOpacity style={styles.bottomBackBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={16} color={colors.textSecondary} />
          <Text style={styles.bottomBackText}>Retour aux voyages</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// ─── styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 40,
  },

  // loading
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
  },

  // error / not found
  notFoundEmoji: { fontSize: 54 },
  notFoundTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  notFoundSub: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },
  backFallbackBtn: {
    marginTop: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 14,
  },
  backFallbackText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  // hero
  hero: {
    paddingTop: 52,
    paddingBottom: 36,
    paddingHorizontal: 22,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  heroBody: {
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 52,
    marginBottom: 14,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 30,
  },
  heroLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 18,
  },
  heroLocation: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(108,99,255,0.20)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: 'rgba(108,99,255,0.40)',
  },
  heroBadgeText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },

  // scroll
  scroll: { flex: 1 },
  scrollContent: {
    padding: 20,
    paddingBottom: 48,
  },

  // card
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 16,
  },

  // dates
  datesGrid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateBlock: { flex: 1 },
  dateBlockRight: { alignItems: 'flex-end' },
  dateBlockLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.9,
    marginBottom: 5,
  },
  dateBlockValue: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  dateDivider: {
    paddingHorizontal: 14,
    alignItems: 'center',
  },

  // stats
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: { alignItems: 'center', flex: 1 },
  statValue: {
    color: colors.primary,
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
  statsDivider: {
    width: 1,
    height: 44,
    backgroundColor: colors.border,
  },

  // notes
  notesText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 23,
  },
  emptyNotesCard: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 28,
  },
  emptyNotesText: {
    color: colors.textMuted,
    fontSize: 13,
  },

  // actions
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },

  // bottom back
  bottomBackBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 18,
    marginTop: 4,
  },
  bottomBackText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
});
