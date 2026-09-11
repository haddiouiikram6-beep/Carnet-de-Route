import React, { useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTrips } from '../src/hooks/useTrips';
import TripCard from '../src/components/TripCard';
import colors from '../src/constants/colors';

// ─────────────────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const { trips, loading, error, refetch } = useTrips();
  const scrollY = useRef(new Animated.Value(0)).current;

  // Subtle header parallax
  const headerTranslate = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, -8],
    extrapolate: 'clamp',
  });

  // ── empty state ───────────────────────────────────────────────────────────
  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>🌍</Text>
      <Text style={styles.emptyTitle}>Aucun voyage pour l'instant</Text>
      <Text style={styles.emptySubtitle}>
        Appuyez sur le bouton{' '}
        <Text style={{ color: colors.primary, fontWeight: '700' }}>+</Text>{' '}
        pour ajouter votre premier voyage !
      </Text>
    </View>
  );

  // ── error state ───────────────────────────────────────────────────────────
  const ErrorState = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorEmoji}>📡</Text>
      <Text style={styles.errorTitle}>Connexion impossible</Text>
      <Text style={styles.errorSub}>
        {error}
        {'\n'}Vérifiez que le serveur tourne sur le port 3000.
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={refetch}>
        <Text style={styles.retryText}>Réessayer</Text>
      </TouchableOpacity>
    </View>
  );

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      {/* ── Hero Header ─────────────────────────────────────────────────── */}
      <Animated.View style={{ transform: [{ translateY: headerTranslate }] }}>
        <LinearGradient
          colors={['#1a1a40', '#11112e', '#0A0A1A']}
          style={styles.header}
        >
          <SafeAreaView>
            <View style={styles.headerInner}>
              {/* Left: brand */}
              <View>
                <Text style={styles.headerEyebrow}>✈  MES AVENTURES</Text>
                <Text style={styles.headerTitle}>Carnet de Route</Text>
                <Text style={styles.headerSub}>Vos voyages, vos souvenirs</Text>
              </View>

              {/* Right: trip count */}
              <View style={styles.statsBubble}>
                <Text style={styles.statsCount}>{trips.length}</Text>
                <Text style={styles.statsLabel}>voyage{trips.length !== 1 ? 's' : ''}</Text>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </Animated.View>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Chargement de vos voyages…</Text>
        </View>
      ) : error ? (
        <ErrorState />
      ) : (
        <Animated.FlatList
          data={trips}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <TripCard
              trip={item}
              index={index}
              onPress={() => router.push(`/trip/${item.id}`)}
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            trips.length === 0 && styles.listContentEmpty,
          ]}
          ListEmptyComponent={<EmptyState />}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={refetch}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        />
      )}

      {/* ── FAB ─────────────────────────────────────────────────────────── */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/add-trip')}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={[colors.primary, colors.primaryDark]}
          style={styles.fabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

// ─── styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // header
  header: {
    paddingTop: 54,
    paddingBottom: 28,
    paddingHorizontal: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerEyebrow: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 6,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  headerSub: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  statsBubble: {
    backgroundColor: 'rgba(108, 99, 255, 0.15)',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.35)',
  },
  statsCount: {
    color: colors.primary,
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 28,
  },
  statsLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },

  // loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
  },

  // error
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  errorEmoji: { fontSize: 52 },
  errorTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorSub: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 13,
    borderRadius: 14,
  },
  retryText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  // list
  listContent: {
    padding: 18,
    paddingTop: 14,
    paddingBottom: 110,
  },
  listContentEmpty: {
    flex: 1,
  },

  // empty
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyEmoji: { fontSize: 68, marginBottom: 4 },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: 36,
    right: 24,
    borderRadius: 30,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 14,
  },
  fabGradient: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
