import type { ReactNode } from 'react'
import { Modal, Pressable, StyleSheet, View } from 'react-native'
import { colors, radius, spacing } from '@/constants/tokens'

export function ModalSheet({ visible, onClose, children }: { visible: boolean; onClose: () => void; children: ReactNode }) {
  return <Modal visible={visible} transparent animationType="slide" statusBarTranslucent onRequestClose={onClose}><Pressable style={styles.backdrop} onPress={onClose}><Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}><View style={styles.grabber} />{children}</Pressable></Pressable></Modal>
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: '#07192C88' },
  sheet: { paddingHorizontal: spacing.xl, paddingTop: spacing.md, paddingBottom: 30, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl, backgroundColor: colors.surface, gap: spacing.md },
  grabber: { alignSelf: 'center', width: 38, height: 4, borderRadius: 4, backgroundColor: '#D8E0E8', marginBottom: 2 },
})
