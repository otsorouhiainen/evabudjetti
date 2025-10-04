// app/spending.tsx (or src/screens/Spending.tsx)
import * as eva from '@eva-design/eva';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  ApplicationProvider,
  Card,
  Icon,
  IconRegistry,
  Layout,
  Text,
  useTheme
} from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { BottomNav } from '../src/components/BottomNav';
import { customTheme } from '../src/theme/eva-theme';

type Row = { id: string; name: string; date: string; amount: number };

const PAST: Row[] = [
  { id: '1', name: 'Takki', date: '26.09.2025', amount: -34 },
  { id: '2', name: 'T-paita', date: '26.09.2025', amount: -12 },
  { id: '3', name: 'Netflix', date: '18.09.2025', amount: -16 },
  { id: '4', name: 'Salijäsenyys', date: '15.09.2025', amount: -25 },
  { id: '5', name: 'Huvipuisto', date: '07.09.2025', amount: -58 },
  { id: '6', name: 'Kahvila', date: '05.09.2025', amount: -10 },
];

const CHART = [
  { label: 'ravintolat', value: 30 },
  { label: 'harrastukset', value: 102 },
  { label: 'suora-\ntoisto-\npalvelut', value: 16 },
  { label: 'vaatteet', value: 46 },
  { label: 'jäljellä', value: 6 },
];

export default function Spending() {
  const theme = useTheme();
  const primary = theme['color-primary-500'];

  const month = 'Lokakuu 2025';
  const monthlyAllowance = 200;
  const spentSoFar = 194;
  const remaining = monthlyAllowance - spentSoFar;
  
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
                  <ScrollView contentContainerStyle={styles.scroll} bounces>
            {/* Title + month selector */}
            <View style={{ marginTop: 6 }}>
              <Text category="h5" style={styles.title}>Käyttörahan kulutus</Text>

              <View style={styles.monthRow}>
                <TouchableOpacity style={styles.monthBtn}>
                  <Icon name="arrow-ios-back-outline" fill="#222" style={styles.monthIcon} />
                </TouchableOpacity>
                <Text style={{ fontWeight: '700' }}>{month}</Text>
                <TouchableOpacity style={styles.monthBtn}>
                  <Icon name="arrow-ios-forward-outline" fill="#222" style={styles.monthIcon} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Chart */}
            <Card disabled style={styles.chartCard}>
              <SimpleBarChart
                data={CHART}
                max={200}
                barColor={primary}
                gridColor="#dfe7e5"
                labelColor="#1c1c1c"
              />
            </Card>

            {/* Summary */}
            <Text style={styles.summaryRow}>Kuukauden käyttövara: <Text category="s1">{monthlyAllowance}€</Text></Text>

            <View style={{ marginTop: 6 }}>
              <Text category="s2" style={{ fontWeight: '800' }}>31.09.2025</Text>
              <Text>Tähän mennessä käytetty: <Text category="s1">{spentSoFar},00€</Text></Text>
              <Text>Jäljellä oleva käyttövara: <Text category="s1">{remaining},00€</Text></Text>
            </View>

            {/* Past events */}
            <Text category="s1" style={styles.sectionTitle}>Menneet tapahtumat:</Text>
            <View style={styles.listWrap}>
              {PAST.map((r) => (
                <View key={r.id} style={styles.pill}>
                  <Text style={styles.pillName}>{r.name}</Text>
                  <Text appearance="hint" style={styles.pillDate}>{r.date}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={styles.pillAmt}>{r.amount},00€</Text>
                    <MaterialCommunityIcons name="pencil-outline" size={16} color="#1c1c1c" />
                  </View>
                </View>
              ))}
            </View>

            <View style={{ height: 96 }} />
          </ScrollView>

          <BottomNav />
      </Layout>
            </View>
          </ApplicationProvider>
    </>
    );
}

/** Very lightweight column chart built from Views (no extra libs). */
function SimpleBarChart({
  data,
  max = 100,
  height = 180,
  barWidth = 34,
  gap = 18,
  barColor = '#2f8f83',
  gridColor = '#e2e8e6',
  labelColor = '#111',
}: {
  data: { label: string; value: number }[];
  max?: number;
  height?: number;
  barWidth?: number;
  gap?: number;
  barColor?: string;
  gridColor?: string;
  labelColor?: string;
}) {
  const ticks = [200, 150, 100, 50, 200].filter((t) => t <= max);
  return (
    <View>
      {/* Grid */}
      <View style={{ height, marginBottom: 8 }}>
        {ticks
          .slice()
          .reverse()
          .map((t, i) => (
            <View
              key={t}
              style={[
                styles.gridLine,
                {
                  top: (i / (ticks.length - 1 || 1)) * (height - 2),
                  backgroundColor: gridColor,
                },
              ]}
            />
          ))}

        {/* Bars */}
        <View style={[styles.barsRow, { height }]}>
          {data.map((d) => {
            const h = Math.max(2, Math.min(1, d.value / max) * height);
            return (
              <View key={d.label} style={{ alignItems: 'center', width: barWidth + gap }}>
                <Text style={[styles.valueLabel]}>{d.value},00€</Text>
                <View
                  style={{
                    width: barWidth,
                    height: h,
                    backgroundColor: barColor,
                    borderTopLeftRadius: 6,
                    borderTopRightRadius: 6,
                  }}
                />
                <Text style={[styles.axisLabel, { color: labelColor }]} numberOfLines={3}>
                  {d.label}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
      {/* Y-axis labels (left) */}
      <View style={styles.yAxisWrap}>
        {ticks.map((t) => (
          <Text key={t} appearance="hint" style={styles.yTick}>{t}</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: {
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 0,
    gap: 10,
  },
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
  monthIcon: { width: 18, height: 18 },
  chartCard: {
    padding: 10,
    borderRadius: 16,
    backgroundColor: '#fff',
    // subtle shadow
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  summaryRow: { marginTop: 4 },
  sectionTitle: { marginTop: 10, fontWeight: '800' },
  listWrap: { gap: 8, marginTop: 4 },
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
  pillDate: { width: 105, textAlign: 'center' },
  pillAmt: { width: 80, textAlign: 'right', fontWeight: '800' },

  // Chart bits
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-evenly',
    paddingLeft: 32, // room for y-axis labels
  },
  gridLine: {
    position: 'absolute',
    left: 32,
    right: 0,
    height: 1,
  },
  yAxisWrap: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 36,
    width: 32,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 4,
    paddingBottom: 8,
  },
  yTick: { fontSize: 12 },
  axisLabel: {
    textAlign: 'center',
    marginTop: 4,
    fontSize: 12,
  },
  valueLabel: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '700',
  },
});
