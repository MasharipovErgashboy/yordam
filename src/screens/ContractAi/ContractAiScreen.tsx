import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AI_COLORS } from '../../constants/aiChatTheme';
import { EMPTY_FORM, SEED_SAVED_CONTRACTS, getTemplate } from '../../data/contractAiMock';
import { analyzeContract, generateContract } from '../../services/contractAiService';
import type {
  ContractFormData,
  ContractReview,
  ContractTemplateId,
  GeneratedContract,
  SavedContract,
} from '../../types/contractAi';
import { ContractHomeView } from './ContractHomeView';
import { ContractTypeView } from './ContractTypeView';
import { ContractFormView } from './ContractFormView';
import { ContractResultView } from './ContractResultView';
import { ContractReviewView } from './ContractReviewView';

type ContractView = 'home' | 'type' | 'form' | 'result' | 'review';

interface Props {
  onBack: () => void;
  /** "AI ga savol" — AI yordamchi suhbatini ochadi */
  onAskAi: () => void;
}

export const ContractAiScreen: React.FC<Props> = ({ onBack, onAskAi }) => {
  const insets = useSafeAreaInsets();
  const [stack, setStack] = useState<ContractView[]>(['home']);
  const [templateId, setTemplateId] = useState<ContractTemplateId>('ijara');
  const [form, setForm] = useState<ContractFormData>(EMPTY_FORM);
  const [contract, setContract] = useState<GeneratedContract | null>(null);
  const [review, setReview] = useState<ContractReview | null>(null);
  const [saved, setSaved] = useState<SavedContract[]>(SEED_SAVED_CONTRACTS);
  const [busy, setBusy] = useState<string | null>(null);

  const view = stack[stack.length - 1];
  const push = (next: ContractView) => setStack((s) => [...s, next]);

  const goBack = useCallback(() => {
    if (busy) return;
    if (stack.length > 1) setStack((s) => s.slice(0, -1));
    else onBack();
  }, [busy, stack.length, onBack]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      goBack();
      return true;
    });
    return () => sub.remove();
  }, [goBack]);

  const openTemplate = (id: ContractTemplateId) => {
    setTemplateId(id);
    setForm(EMPTY_FORM);
    push('form');
  };

  const createContract = async () => {
    setBusy('AI shartnoma tuzmoqda...');
    try {
      const result = await generateContract(templateId, form);
      setContract(result);
      push('result');
    } catch {
      Alert.alert('Xatolik', 'Shartnoma yaratilmadi. Iltimos, qayta urinib ko‘ring.');
    } finally {
      setBusy(null);
    }
  };

  const startReview = async () => {
    setReview(null);
    push('review');
    try {
      setReview(await analyzeContract());
    } catch {
      Alert.alert('Xatolik', 'Shartnomani tahlil qilib bo‘lmadi.');
      setStack((s) => (s[s.length - 1] === 'review' ? s.slice(0, -1) : s));
    }
  };

  const updateClause = (clauseId: string, text: string) =>
    setContract((c) =>
      c ? { ...c, clauses: c.clauses.map((cl) => (cl.id === clauseId ? { ...cl, text } : cl)) } : c
    );

  const saveContract = () => {
    if (!contract) return;
    setSaved((list) => {
      const existing = list.find((s) => s.contract?.id === contract.id);
      if (existing) {
        return list.map((s) => (s.id === existing.id ? { ...s, contract } : s));
      }
      const item: SavedContract = {
        id: `saved-${contract.id}`,
        title: getTemplate(contract.templateId).formTitle,
        fileType: 'DOC',
        meta: 'Bugun · AI tuzgan',
        status: { kind: 'ready' },
        contract,
      };
      return [item, ...list];
    });
    setStack(['home']);
    Alert.alert('Saqlandi', 'Shartnoma "Mening shartnomalarim" bo‘limiga qo‘shildi.');
  };

  const openSaved = (item: SavedContract) => {
    if (item.contract) {
      setContract(item.contract);
      push('result');
    } else if (item.review) {
      setReview(item.review);
      push('review');
    }
  };

  const viewProps = { topInset: insets.top, bottomInset: insets.bottom, onBack: goBack };

  return (
    <KeyboardAvoidingView style={styles.root} behavior="padding">
      <StatusBar style="dark" />

      {view === 'home' && (
        <ContractHomeView
          {...viewProps}
          saved={saved}
          onCreate={() => push('type')}
          onReview={startReview}
          onOpenTemplate={openTemplate}
          onSeeAllTemplates={() => push('type')}
          onOpenSaved={openSaved}
          onHelp={() =>
            Alert.alert(
              'Shartnoma AI',
              'Shablon tanlab yangi shartnoma tuzing yoki tayyor shartnomani yuklab, xavfli bandlarini tekshiring.'
            )
          }
        />
      )}

      {view === 'type' && <ContractTypeView {...viewProps} onSelect={openTemplate} />}

      {view === 'form' && (
        <ContractFormView
          {...viewProps}
          templateId={templateId}
          form={form}
          onChange={setForm}
          onSubmit={createContract}
        />
      )}

      {view === 'result' && contract && (
        <ContractResultView
          {...viewProps}
          contract={contract}
          onUpdateClause={updateClause}
          onSave={saveContract}
          onAskAi={onAskAi}
        />
      )}

      {view === 'review' && <ContractReviewView {...viewProps} review={review} onAskAi={onAskAi} />}

      {busy && (
        <View style={styles.busyOverlay}>
          <View style={styles.busyCard}>
            <ActivityIndicator size="large" color={AI_COLORS.primary} />
            <Text style={styles.busyText}>{busy}</Text>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: AI_COLORS.bg,
  },
  busyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  busyCard: {
    backgroundColor: AI_COLORS.surface,
    borderRadius: 18,
    paddingHorizontal: 28,
    paddingVertical: 24,
    alignItems: 'center',
    gap: 12,
  },
  busyText: {
    fontSize: 14,
    fontWeight: '600',
    color: AI_COLORS.navy,
  },
});
