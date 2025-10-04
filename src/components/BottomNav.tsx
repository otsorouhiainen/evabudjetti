import { Button, Icon, Layout } from '@ui-kitten/components';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { customTheme } from '../../src/theme/eva-theme';

interface NavIconProps {
  name: string;
  iconColor?: string;
  btnColor?: string;
  borderColor?: string;
}

const NavIcon = ({ name, iconColor, btnColor, borderColor, onPress }: NavIconProps & { onPress?: () => void }) => (
  <Button
    appearance="ghost"
    accessoryLeft={(props) => <Icon {...props} name={name} fill={iconColor} />}
    style={[
      styles.navBtn,
      btnColor ? { backgroundColor: btnColor } : null,
      borderColor ? { borderWidth: 2, borderColor } : null,
    ]}
    onPress={onPress}
  />
);

export const BottomNav = () => {
  const router = useRouter();
  return (
    <Layout style={[styles.bottomBar, { backgroundColor: customTheme['color-primary-100'] }]} level="2">
      <NavIcon
        name="home-outline"
        iconColor={customTheme['color-white']}
        btnColor={customTheme['color-primary-100']}
        borderColor={customTheme['color-primary-200']}
        onPress={() => router.push('/landing')}
      />
      <NavIcon
        name="plus-circle-outline"
        iconColor={customTheme['color-white']}
        btnColor={customTheme['color-primary-100']}
        borderColor={customTheme['color-primary-200']}
        onPress={() => router.push('/add_transaction')}
      />
      <NavIcon
        name="grid-outline"
        iconColor={customTheme['color-white']}
        btnColor={customTheme['color-primary-100']}
        borderColor={customTheme['color-primary-200']}
        onPress={() => router.push('/budget')}
      />
      <NavIcon
        name="pie-chart-outline"
        iconColor={customTheme['color-white']}
        btnColor={customTheme['color-primary-100']}
        borderColor={customTheme['color-primary-200']}
        onPress={() => router.push('/spending')}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 18,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  navBtn: {
    borderRadius: 16,
  },
});
