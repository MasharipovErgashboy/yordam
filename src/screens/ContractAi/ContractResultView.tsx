import React, { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AI_COLORS } from '../../constants/aiChatTheme';
import type { ContractClause, GeneratedContract } from '../../types/contractAi';
import { HeaderIconButton } from '../../components/AiChat/HeaderIconButton';
import { ScreenHeader } from '../../components/ContractAi/ScreenHeader';

const SERIF = Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' });

const renderBold = (text: string) =>
  text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <Text key={i} style={{ fontWeight: '700' }}>
          {part.slice(2, -2)}
        </Text>
      ) : (
        <Text key={i}>{part}</Text>
      )
    );

const comingSoon = (title: string) => Alert.alert(title, 'Bu funksiya tez orada ishga tushadi.');

/** Sarlavhali bandlarga tartib raqami beradi (sarlavhasiz band oldingisining davomi) */
const numberClauses = (clauses: ContractClause[]) => {
  let n = 0;
  return clauses.map((c) => {
    if (c.heading) n += 1;
    return { clause: c, number: c.heading ? n : null };
  });
};

const toPlainText = (c: GeneratedContract) =>
  [
    c.title,
    c.cityDate,
    '',
    c.intro.replace(/\*\*/g, ''),
    '',
    ...numberClauses(c.clauses).map(({ clause, number }) =>
      number ? `${number}. ${clause.heading} ${clause.text}` : clause.text
    ),
  ].join('\n');

interface Props {
  contract: GeneratedContract;
  onUpdateClause: (clauseId: string, text: string) => void;
  onSave: () => void;
  onAskAi: () => void;
  onBack: () => void;
  topInset: number;
  bottomInset: number;
}

export const ContractResultView: React.FC<Props> = ({
  contract,
  onUpdateClause,
  onSave,
  onAskAi,
  onBack,
  topInset,
  bottomInset,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<ContractClause | null>(null);
  const [draft, setDraft] = useState('');

  const numbered = useMemo(() => numberClauses(contract.clauses), [contract.clauses]);
  const clauseCount = numbered.filter((n) => n.number !== null).length;

  const startEdit = (clause: ContractClause) => {
    setEditing(clause);
    setDraft(clause.text);
  };

  const saveEdit = () => {
    if (editing && draft.trim()) onUpdateClause(editing.id, draft.trim());
    setEditing(null);
  };

  const share = () => {
    Share.share({ title: contract.title, message: toPlainText(contract) }).catch(() => undefined);
  };

  return (
    <View style={styles.root}>
      <ScreenHeader
        title="Shartnoma tayyor"
        onBack={onBack}
        topInset={topInset}
        right={
          <HeaderIconButton onPress={share} accessibilityLabel="Ulashish">
            <Ionicons name="share-social-outline" size={19} color={AI_COLORS.text} />
          </HeaderIconButton>
        }
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.successBanner}>
          <Ionicons name="checkmark-circle" size={24} color="#16A34A" />
          <View style={{ flex: 1 }}>
            <Text style={styles.successTitle}>Shartnoma yaratildi</Text>
            <Text style={styles.successSub}>
              {clauseCount} band · {contract.complianceNote}
            </Text>
          </View>
        </View>

        {/* Hujjat ko‘rinishi */}
        <View style={styles.paper}>
          <Text style={styles.docTitle}>{contract.title}</Text>
          <Text style={styles.docMeta}>{contract.cityDate}</Text>
          <Text style={styles.docText}>{renderBold(contract.intro)}</Text>

          {numbered.map(({ clause, number }) => {
            const selected = selectedId === clause.id;
            return (
              <View key={clause.id}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setSelectedId(selected ? null : clause.id)}
                  style={[
                    styles.clause,
                    clause.aiProtected && styles.clauseProtected,
                    selected && styles.clauseSelected,
                  ]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  accessibilityHint="Bandni tahrirlash uchun tanlang"
                >
                  <Text style={styles.docText}>
                    {number ? <Text style={{ fontWeight: '700' }}>{`${number}. ${clause.heading} `}</Text> : null}
                    {clause.text}
                  </Text>
                </TouchableOpacity>

                {selected && (
                  <View style={styles.clauseToolbar}>
                    <TouchableOpacity
                      style={styles.toolbarButton}
                      onPress={() => startEdit(clause)}
                      accessibilityRole="button"
                    >
                      <Ionicons name="create-outline" size={14} color="#FFFFFF" />
                      <Text style={styles.toolbarText}>Tahrirlash</Text>
                    </TouchableOpacity>
                    {clause.note ? (
                      <TouchableOpacity
                        style={styles.toolbarButton}
                        onPress={() => Alert.alert('AI izohi', clause.note)}
                        accessibilityRole="button"
                      >
                        <Ionicons name="sparkles-outline" size={14} color="#FFFFFF" />
                        <Text style={styles.toolbarText}>Izoh</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.infoBanner}>
          <Ionicons name="sparkles" size={16} color={AI_COLORS.primary} style={{ marginTop: 1 }} />
          <Text style={styles.infoText}>
            <Text style={{ fontWeight: '700' }}>Ajratilgan bandlar</Text> sizning manfaatingizni
            himoya qiladi. Ustiga bosib AI’dan izoh so‘rashingiz mumkin.
          </Text>
        </View>

        <View style={styles.tilesRow}>
          <TouchableOpacity
            style={styles.tile}
            onPress={() =>
              selectedId
                ? startEdit(contract.clauses.find((c) => c.id === selectedId)!)
                : Alert.alert('Tahrirlash', 'Tahrirlamoqchi bo‘lgan bandni hujjatdan tanlang.')
            }
            accessibilityRole="button"
          >
            <Ionicons name="create-outline" size={20} color={AI_COLORS.primary} />
            <Text style={styles.tileText}>Tahrirlash</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tile}
            onPress={() => comingSoon('PDF yuklab olish')}
            accessibilityRole="button"
          >
            <Ionicons name="download-outline" size={20} color={AI_COLORS.primary} />
            <Text style={styles.tileText}>PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tile}
            onPress={() => comingSoon('E-imzo')}
            accessibilityRole="button"
          >
            <MaterialCommunityIcons name="draw-pen" size={20} color={AI_COLORS.primary} />
            <Text style={styles.tileText}>E-imzo</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(bottomInset, 12) }]}>
        <TouchableOpacity
          style={styles.outlineButton}
          activeOpacity={0.8}
          onPress={onAskAi}
          accessibilityRole="button"
        >
          <Text style={styles.outlineButtonText}>AI ga savol</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={onSave}
          accessibilityRole="button"
        >
          <Text style={styles.primaryButtonText}>Saqlash</Text>
        </TouchableOpacity>
      </View>

      {/* Bandni tahrirlash oynasi */}
      <Modal
        visible={!!editing}
        transparent
        animationType="fade"
        onRequestClose={() => setEditing(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Bandni tahrirlash</Text>
            <TextInput
              style={styles.modalInput}
              value={draft}
              onChangeText={setDraft}
              multiline
              autoFocus
              accessibilityLabel="Band matni"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setEditing(null)}
                accessibilityRole="button"
              >
                <Text style={styles.modalCancelText}>Bekor qilish</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSave}
                onPress={saveEdit}
                accessibilityRole="button"
              >
                <Text style={styles.modalSaveText}>Saqlash</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AI_COLORS.bg,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#E7F7EE',
    borderWidth: 1,
    borderColor: '#BBE5CB',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  successTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#14532D',
  },
  successSub: {
    fontSize: 12,
    color: '#166534',
    marginTop: 1,
  },
  paper: {
    backgroundColor: AI_COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AI_COLORS.border,
    paddingHorizontal: 18,
    paddingVertical: 20,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  docTitle: {
    fontFamily: SERIF,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: AI_COLORS.text,
    textAlign: 'center',
  },
  docMeta: {
    fontFamily: SERIF,
    fontSize: 11.5,
    color: AI_COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  docText: {
    fontFamily: SERIF,
    fontSize: 13,
    lineHeight: 20,
    color: '#1E293B',
  },
  clause: {
    marginTop: 8,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: 'transparent',
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginHorizontal: -4,
  },
  clauseProtected: {
    backgroundColor: '#FEF3C7',
  },
  clauseSelected: {
    borderColor: AI_COLORS.primary,
  },
  clauseToolbar: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    gap: 2,
    backgroundColor: AI_COLORS.navy,
    borderRadius: 10,
    padding: 3,
    marginTop: 6,
  },
  toolbarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  toolbarText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  infoBanner: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: AI_COLORS.primarySoft,
    borderWidth: 1,
    borderColor: '#C9D8F5',
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
  },
  infoText: {
    flex: 1,
    fontSize: 12.5,
    lineHeight: 18,
    color: '#1E3A72',
  },
  tilesRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  tile: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    backgroundColor: AI_COLORS.surface,
    borderWidth: 1,
    borderColor: AI_COLORS.border,
    borderRadius: 14,
    paddingVertical: 14,
  },
  tileText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: AI_COLORS.navy,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: AI_COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: AI_COLORS.border,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  outlineButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: AI_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: AI_COLORS.primary,
  },
  primaryButton: {
    flex: 1,
    height: 52,
    borderRadius: 16,
    backgroundColor: AI_COLORS.amber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: AI_COLORS.amberText,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: AI_COLORS.surface,
    borderRadius: 20,
    padding: 18,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AI_COLORS.navy,
    marginBottom: 12,
  },
  modalInput: {
    minHeight: 120,
    maxHeight: 260,
    borderWidth: 1,
    borderColor: AI_COLORS.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    lineHeight: 20,
    color: AI_COLORS.text,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  modalCancel: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: AI_COLORS.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  modalSave: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: AI_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSaveText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
