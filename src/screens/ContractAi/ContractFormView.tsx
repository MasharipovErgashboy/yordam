import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { KeyboardTypeOptions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AI_COLORS } from '../../constants/aiChatTheme';
import { getTemplate } from '../../data/contractAiMock';
import type { ContractFormData, ContractTemplateId, ContractTerm } from '../../types/contractAi';
import { ScreenHeader } from '../../components/ContractAi/ScreenHeader';
import { Stepper } from '../../components/ContractAi/Stepper';

const TERMS: ContractTerm[] = ['6 oy', '1 yil', 'Boshqa'];

const formatAmount = (raw: string) =>
  raw.replace(/\D/g, '').slice(0, 12).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

const formatDate = (raw: string) => {
  const d = raw.replace(/\D/g, '').slice(0, 8);
  return [d.slice(0, 2), d.slice(2, 4), d.slice(4)].filter(Boolean).join('.');
};

interface FieldProps {
  label: string;
  optionalHint?: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  suffix?: string;
  rightIcon?: React.ComponentProps<typeof Ionicons>['name'];
  maxLength?: number;
}

const Field: React.FC<FieldProps> = ({
  label,
  optionalHint,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
  suffix,
  rightIcon,
  maxLength,
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}
        {optionalHint ? <Text style={styles.optional}> {optionalHint}</Text> : null}
      </Text>
      <View
        style={[
          styles.inputWrap,
          multiline && styles.inputWrapMultiline,
          focused && styles.inputWrapFocused,
        ]}
      >
        <TextInput
          style={[styles.input, multiline && styles.inputMultiline]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={AI_COLORS.placeholder}
          keyboardType={keyboardType}
          multiline={multiline}
          maxLength={maxLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityLabel={label}
        />
        {suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
        {rightIcon ? <Ionicons name={rightIcon} size={17} color={AI_COLORS.textSecondary} /> : null}
      </View>
    </View>
  );
};

interface Props {
  templateId: ContractTemplateId;
  form: ContractFormData;
  onChange: (form: ContractFormData) => void;
  onSubmit: () => void;
  onBack: () => void;
  topInset: number;
  bottomInset: number;
}

export const ContractFormView: React.FC<Props> = ({
  templateId,
  form,
  onChange,
  onSubmit,
  onBack,
  topInset,
  bottomInset,
}) => {
  const t = getTemplate(templateId);
  const set = <K extends keyof ContractFormData>(key: K, value: ContractFormData[K]) =>
    onChange({ ...form, [key]: value });

  const submit = () => {
    if (!form.partyA.trim() || !form.partyB.trim()) {
      Alert.alert('Ma’lumot yetarli emas', 'Iltimos, ikkala tomonning F.I.Sh.ni kiriting.');
      return;
    }
    onSubmit();
  };

  return (
    <View style={styles.root}>
      <ScreenHeader
        title={t.formTitle}
        onBack={onBack}
        topInset={topInset}
        right={<Text style={styles.stepCount}>2/3</Text>}
      >
        <Stepper current={2} />
      </ScreenHeader>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.infoBanner}>
          <Ionicons name="sparkles" size={16} color={AI_COLORS.primary} style={{ marginTop: 1 }} />
          <Text style={styles.infoText}>
            Maydonlarni to‘ldiring — AI qolgan bandlarni qonunchilikka mos ravishda yozadi.
          </Text>
        </View>

        <Field
          label={t.partyALabel}
          value={form.partyA}
          onChangeText={(v) => set('partyA', v)}
          placeholder="Familiya, ism, otasining ismi"
          maxLength={120}
        />
        <Field
          label={t.partyBLabel}
          value={form.partyB}
          onChangeText={(v) => set('partyB', v)}
          placeholder="Familiya, ism, otasining ismi"
          maxLength={120}
        />
        <Field
          label={t.subjectLabel}
          value={form.subject}
          onChangeText={(v) => set('subject', v)}
          placeholder={t.subjectPlaceholder}
          maxLength={200}
        />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Field
              label={t.amountLabel}
              value={form.amount}
              onChangeText={(v) => set('amount', formatAmount(v))}
              placeholder="0"
              keyboardType="number-pad"
              suffix="so‘m"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Field
              label="Boshlanish sanasi"
              value={form.startDate}
              onChangeText={(v) => set('startDate', formatDate(v))}
              placeholder="KK.OO.YYYY"
              keyboardType="number-pad"
              rightIcon="calendar-outline"
              maxLength={10}
            />
          </View>
        </View>

        <Text style={styles.label}>Muddati</Text>
        <View style={styles.segment}>
          {TERMS.map((term) => {
            const active = form.term === term;
            return (
              <TouchableOpacity
                key={term}
                style={[styles.segmentItem, active && styles.segmentItemActive]}
                onPress={() => set('term', term)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{term}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {form.term === 'Boshqa' && (
          <Field
            label="Muddatni kiriting"
            value={form.customTerm}
            onChangeText={(v) => set('customTerm', v)}
            placeholder="Masalan: 3 oy"
            maxLength={40}
          />
        )}

        <Field
          label="Qo‘shimcha shartlar"
          optionalHint="(ixtiyoriy)"
          value={form.extraTerms}
          onChangeText={(v) => set('extraTerms', v)}
          placeholder="Masalan: uy hayvonlari mumkin emas, kommunal to‘lovlar ijarachida"
          multiline
          maxLength={600}
        />
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(bottomInset, 12) }]}>
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={submit}
          accessibilityRole="button"
        >
          <Ionicons name="sparkles" size={17} color={AI_COLORS.amberText} />
          <Text style={styles.primaryButtonText}>AI bilan yaratish</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AI_COLORS.bg,
  },
  stepCount: {
    fontSize: 13,
    fontWeight: '600',
    color: AI_COLORS.textSecondary,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
  },
  infoBanner: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: AI_COLORS.primarySoft,
    borderWidth: 1,
    borderColor: '#C9D8F5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
    color: '#1E3A72',
  },
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: 12.5,
    fontWeight: '700',
    color: AI_COLORS.navy,
    marginBottom: 6,
  },
  optional: {
    fontWeight: '400',
    color: AI_COLORS.textSecondary,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 46,
    backgroundColor: AI_COLORS.surface,
    borderWidth: 1,
    borderColor: AI_COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  inputWrapMultiline: {
    alignItems: 'flex-start',
    minHeight: 92,
    paddingVertical: 10,
  },
  inputWrapFocused: {
    borderColor: AI_COLORS.primary,
    borderWidth: 1.5,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: AI_COLORS.text,
    paddingVertical: 10,
  },
  inputMultiline: {
    paddingVertical: 0,
    minHeight: 70,
    textAlignVertical: 'top',
  },
  suffix: {
    fontSize: 12.5,
    color: AI_COLORS.textSecondary,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  segment: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  segmentItem: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AI_COLORS.border,
    backgroundColor: AI_COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentItemActive: {
    borderColor: AI_COLORS.primary,
    borderWidth: 1.5,
    backgroundColor: AI_COLORS.primarySoft,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  segmentTextActive: {
    color: AI_COLORS.primary,
  },
  footer: {
    backgroundColor: AI_COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: AI_COLORS.border,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  primaryButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: AI_COLORS.amber,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: AI_COLORS.amberText,
  },
});
