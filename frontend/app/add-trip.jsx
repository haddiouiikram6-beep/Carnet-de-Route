import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import apiService from '../src/services/apiService';
import colors from '../src/constants/colors';

// ─── InputField Component ────────────────────────────────────────────────────

function InputField({ label, icon, placeholder, value, onChangeText, multiline, keyboardType }) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.fieldWrapper} pointerEvents="auto">
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputRow,
          focused && styles.inputRowFocused,
          multiline && styles.inputRowMultiline,
        ]}
      >
        <Ionicons
          name={icon}
          size={17}
          color={focused ? colors.primary : colors.textMuted}
          style={styles.inputIcon}
        />
        <TextInput
          style={[
            styles.input,
            multiline && styles.inputMultiline,
            { color: '#FFFFFF' } // يضمن ظهور الخط بالأبيض
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={onChangeText} // ربط مباشر ومبسط
          multiline={multiline}
          numberOfLines={multiline ? 4 : 1}
          textAlignVertical={multiline ? 'top' : 'center'}
          keyboardType={keyboardType || 'default'}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          editable={true}
        />
      </View>
    </View>
  );
}

// ─── Screen Component ────────────────────────────────────────────────────────

export default function AddTripScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    title: '',
    destination: '',
    startDate: '',
    endDate: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadTrip = async () => {
      try {
        setLoading(true);
        const trip = await apiService.getTripById(id);
        setForm({
          title: trip.title,
          destination: trip.destination,
          startDate: trip.startDate,
          endDate: trip.endDate,
          notes: trip.notes || '',
        });
      } catch (err) {
        Alert.alert('Erreur', err.message || 'Impossible de charger le voyage.');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    loadTrip();
  }, [id, router]);

  // تحديث القيم بشكل مباشر وبسيط
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const newErrors = {};

    if (!form.title.trim()) newErrors.title = 'Le titre est requis';
    if (!form.destination.trim()) newErrors.destination = 'La destination est requise';

    if (!form.startDate.trim()) {
      newErrors.startDate = 'La date de départ est requise';
    } else if (!dateRegex.test(form.startDate)) {
      newErrors.startDate = 'Format attendu : AAAA-MM-JJ';
    }

    if (!form.endDate.trim()) {
      newErrors.endDate = 'La date de retour est requise';
    } else if (!dateRegex.test(form.endDate)) {
      newErrors.endDate = 'Format attendu : AAAA-MM-JJ';
    }

    if (
      form.startDate &&
      form.endDate &&
      dateRegex.test(form.startDate) &&
      dateRegex.test(form.endDate) &&
      new Date(form.endDate) < new Date(form.startDate)
    ) {
      newErrors.endDate = 'La date de retour doit être après le départ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setLoading(true);
      if (isEditing) {
        await apiService.updateTrip(id, form);
      } else {
        await apiService.createTrip(form);
      }
      Alert.alert(
        isEditing ? 'Voyage modifié !' : '🎉 Voyage ajouté !',
        isEditing
          ? `"${form.title}" a été modifié.`
          : `"${form.title}" a été ajouté à votre carnet de route.`,
        [{ text: 'Super !', onPress: () => router.back() }]
      );
    } catch (err) {
      Alert.alert('Erreur', err.message || "Impossible d'ajouter le voyage.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        {/* Banner */}
        <View style={styles.banner}>
          <Ionicons name="compass-outline" size={22} color={colors.primary} />
          <Text style={styles.bannerText}>
            {isEditing
              ? 'Modifiez les informations de votre voyage.'
              : 'Remplissez les informations pour ajouter votre voyage au carnet.'}
          </Text>
        </View>

        {/* Title */}
        <InputField
          label="Titre du voyage *"
          icon="bookmark-outline"
          placeholder="Ex : Week-end à Rome"
          value={form.title}
          onChangeText={(text) => handleChange('title', text)}
        />
        {errors.title ? <Text style={styles.errorMsg}>{errors.title}</Text> : null}

        {/* Destination */}
        <InputField
          label="Destination *"
          icon="location-outline"
          placeholder="Ex : Rome, Italie"
          value={form.destination}
          onChangeText={(text) => handleChange('destination', text)}
        />
        {errors.destination ? <Text style={styles.errorMsg}>{errors.destination}</Text> : null}

        {/* Dates */}
        <View style={styles.twoColumns}>
          <View style={styles.column}>
            <InputField
              label="Date de départ *"
              icon="calendar-outline"
              placeholder="AAAA-MM-JJ"
              value={form.startDate}
              onChangeText={(text) => handleChange('startDate', text)}
              keyboardType="numbers-and-punctuation"
            />
            {errors.startDate ? <Text style={styles.errorMsg}>{errors.startDate}</Text> : null}
          </View>

          <View style={styles.column}>
            <InputField
              label="Date de retour *"
              icon="calendar-outline"
              placeholder="AAAA-MM-JJ"
              value={form.endDate}
              onChangeText={(text) => handleChange('endDate', text)}
              keyboardType="numbers-and-punctuation"
            />
            {errors.endDate ? <Text style={styles.errorMsg}>{errors.endDate}</Text> : null}
          </View>
        </View>

        {/* Notes */}
        <InputField
          label="Notes & souvenirs"
          icon="document-text-outline"
          placeholder="Décrivez votre voyage, vos découvertes, vos coups de cœur…"
          value={form.notes}
          onChangeText={(text) => handleChange('notes', text)}
          multiline
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            style={styles.submitGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="airplane" size={19} color="#fff" />
                <Text style={styles.submitText}>
                  {isEditing ? 'Enregistrer les modifications' : 'Ajouter le voyage'}
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Cancel Button */}
        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Annuler</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: 20,
    paddingBottom: 48,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(108,99,255,0.10)',
    borderRadius: 14,
    padding: 14,
    marginBottom: 26,
    borderWidth: 1,
    borderColor: 'rgba(108,99,255,0.25)',
    gap: 12,
  },
  bannerText: {
    color: colors.textSecondary,
    fontSize: 13,
    flex: 1,
    lineHeight: 19,
  },
  fieldWrapper: {
    marginBottom: 14,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    paddingHorizontal: 14,
  },
  inputRowFocused: {
    borderColor: colors.primary,
  },
  inputRowMultiline: {
    alignItems: 'flex-start',
    paddingTop: 4,
  },
  inputIcon: {
    marginRight: 10,
    marginTop: 14,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
    paddingVertical: 14,
  },
  inputMultiline: {
    paddingTop: 14,
    paddingBottom: 14,
    minHeight: 100,
  },
  twoColumns: {
    flexDirection: 'row',
    gap: 12,
  },
  column: {
    flex: 1,
  },
  errorMsg: {
    color: colors.error,
    fontSize: 11,
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 4,
  },
  submitBtn: {
    marginTop: 10,
    borderRadius: 16,
    overflow: 'hidden',
  },
  submitGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelBtn: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 14,
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: 15,
  },
});