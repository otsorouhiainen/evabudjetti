import * as eva from '@eva-design/eva';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
    ApplicationProvider,
    Button,
    Card,
    Icon,
    IconRegistry,
    Layout,
    Text,
    useTheme
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { BottomNav } from '../src/components/BottomNav';
import { customTheme } from '../src/theme/eva-theme';

type Period = 'PÄIVÄ' | 'KUUKAUSI' | 'VUOSI';

type Txn = {
  id: string;
  name: string;
  date: string; // dd.mm.yyyy
  amount: number; // + or -5
};

const FUTURE_TX: Txn[] = [
  { id: '1', name: 'Bussikortti', date: '05.10.2025', amount: -50 },
  { id: '2', name: 'Opintotuki', date: '06.10.2025', amount: +280 },
  { id: '3', name: 'Opintolaina', date: '06.10.2025', amount: +300 },
];
const PAST_TX: Txn[] = [
  { id: '4', name: 'Lemmikki', date: '03.10.2025', amount: -60 },
  { id: '5', name: 'Puhelinlasku', date: '01.10.2025', amount: -27 },
];

export default function Budget() {
  const theme = useTheme();
  const [period, setPeriod] = useState<Period>('KUUKAUSI');
  const [month, setMonth] = useState('Lokakuu 2025');
  const [incomesOpen, setIncomesOpen] = useState(true);
  const [expensesOpen, setExpensesOpen] = useState(true);
  const [helpVisible, setHelpVisible] = useState(false);

  const totals = useMemo(
    () => ({
      incomes: 234,
      expenses: 123,
      date: '04.10.2025',
      balance: 111,
      discretionary: 6,
    }),
    []
  );

  return (
    <>
<IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={{ ...eva.light, ...customTheme }}>
        <View
          style={{
            flex: 1,
            inset: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Layout style={styles.screen} level="1">
         {/* Top header */}
        <ScrollView contentContainerStyle={styles.scroll} bounces>
            {/* Period segmented tabs */}
            <View style={styles.segmentWrap}>
              {(['PÄIVÄ', 'KUUKAUSI', 'VUOSI'] as Period[]).map((p) => {
                const active = p === period;
                return (
                  <TouchableOpacity
                    key={p}
                    onPress={() => setPeriod(p)}
                    style={[
                      styles.segmentItem,
                      active && { backgroundColor: theme['color-primary-500'] },
                    ]}
                    activeOpacity={0.9}
                  >
                    <Text
                      category="s1"
                      style={[styles.segmentText, active ? { color: '#fff' } : { color: theme['color-primary-600'] }]}
                    >
                      {p}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Title + month selector */}
            <View style={{ marginTop: 6 }}>
              <Text category="h5" style={styles.title}>Budjetti</Text>
              <View style={styles.monthRow}>
                <TouchableOpacity style={styles.monthBtn}>
                  <Icon name="arrow-ios-back-outline" fill="#222" style={{ width: 18, height: 18 }} />
                </TouchableOpacity>
                <Text style={{ fontWeight: '700' }}>{month}</Text>
                <TouchableOpacity style={styles.monthBtn}>
                  <Icon name="arrow-ios-forward-outline" fill="#222" style={{ width: 18, height: 18 }} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Totals cards */}
            <Card disabled style={styles.totalCard}>
              <TouchableOpacity
                style={styles.totalHeader}
                onPress={() => setIncomesOpen((v) => !v)}
                activeOpacity={0.8}
              >
                <Text category="s1" style={styles.totalTitle}>Tulot</Text>
                <View style={styles.totalRight}>
                  <Text category="s1" style={{ fontWeight: '800' }}>{totals.incomes.toFixed(0)},00€</Text>
                  <Icon
                    name={incomesOpen ? 'chevron-down-outline' : 'chevron-right-outline'}
                    style={styles.chev}
                  />
                </View>
              </TouchableOpacity>
            </Card>

            <Card disabled style={styles.totalCard}>
              <TouchableOpacity
                style={styles.totalHeader}
                onPress={() => setExpensesOpen((v) => !v)}
                activeOpacity={0.8}
              >
                <Text category="s1" style={styles.totalTitle}>Menot</Text>
                <View style={styles.totalRight}>
                  <Text category="s1" style={{ fontWeight: '800' }}>{totals.expenses.toFixed(0)},00€</Text>
                  <Icon
                    name={expensesOpen ? 'chevron-down-outline' : 'chevron-right-outline'}
                    style={styles.chev}
                  />
                </View>
              </TouchableOpacity>
            </Card>

            {/* Snapshot */}
            <View style={{ marginTop: 4 }}>
              <Text category="s2" style={{ fontWeight: '800' }}>{totals.date}</Text>
              <Text>Tilillä rahaa: <Text category="s1">{totals.balance}0€</Text></Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text>Käyttövara: <Text category="s1">{totals.discretionary}0€</Text></Text>
                <MaterialCommunityIcons
                  name="help-circle-outline"
                  size={18}
                  color="#1c1c1c"
                  onPress={() => setHelpVisible(true)}
                  style={{ marginLeft: 2, marginTop: 2, opacity: 0.8, cursor: 'pointer' }}
                />
              </View>
            </View>

            {/* Help Modal */}
            {helpVisible && (
                <View style={styles.modalOverlay}>
                <View style={styles.modalBox}>
                    <Text category="h6" style={{ marginBottom: 8 }}>Ohjeet</Text>
                    <Text style={{ marginBottom: 16 }}>
                    Käyttövara tarkoittaa rahamäärää, joka jää jäljelle tulojen ja menojen jälkeen. Se auttaa sinua ymmärtämään, kuinka paljon rahaa sinulla on käytettävissä muihin menoihin tai säästöihin kuukauden aikana.
                    </Text>
                    <Button onPress={() => setHelpVisible(false)} style={{ alignSelf: 'center' }}>SULJE</Button>
                </View>
                </View>
            )}

            {/* Future events */}
            <Text category="s1" style={styles.sectionTitle}>Tulevat tapahtumat</Text>
            <View style={styles.listWrap}>
              {FUTURE_TX.map((t) => (
                <View key={t.id} style={styles.pill}>
                  <Text style={styles.pillName}>{t.name}</Text>
                  <Text appearance="hint" style={styles.pillDate}>{t.date}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={[styles.pillAmt, { color: t.amount >= 0 ? '#138a5b' : '#1c1c1c' }]}>
                      {t.amount >= 0 ? '+' : ''}{t.amount}€
                    </Text>
                    <MaterialCommunityIcons name="pencil-outline" size={16} color="#1c1c1c" />
                  </View>
                </View>
              ))}
            </View>

            {/* Past events */}
            <Text category="s1" style={styles.sectionTitle}>Menneet tapahtumat</Text>
            <View style={styles.listWrap}>
              {PAST_TX.map((t) => (
                <View key={t.id} style={styles.pill}>
                  <Text style={styles.pillName}>{t.name}</Text>
                  <Text appearance="hint" style={styles.pillDate}>{t.date}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={styles.pillAmt}>{t.amount}€</Text>
                    <MaterialCommunityIcons name="pencil-outline" size={16} color="#1c1c1c" />
                  </View>
                </View>
              ))}
            </View>

            <View style={{ height: 90 }} />
          </ScrollView>

          {/* Bottom nav */}
          <BottomNav />
        </Layout>
        </View>
        </ApplicationProvider>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 20,
    gap: 18,
  },
  safe: { flex: 1 },
  scroll: {
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 0,
    gap: 10,
  },
  segmentWrap: {
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: '#E9F0F1',
    borderRadius: 24,
    padding: 4,
    gap: 6,
  },
  segmentItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  segmentText: { fontWeight: '700' },
  title: { fontWeight: '800' },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  monthBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F4',
  },
  totalCard: {
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#e1f0ea',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },
  totalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalTitle: { fontWeight: '800' },
  totalRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  chev: { width: 18, height: 18, tintColor: '#1c1c1c' },
  sectionTitle: { marginTop: 8, marginBottom: 4, fontWeight: '800' },
  listWrap: { gap: 8 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dff1eb',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 10,
  },
  pillName: { flex: 1, fontWeight: '700' },
  pillDate: { width: 100, textAlign: 'center' },
  pillAmt: { width: 70, textAlign: 'right', fontWeight: '800' },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: 320,
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
  },
});
