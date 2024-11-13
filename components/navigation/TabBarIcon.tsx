import Ionicons from '@expo/vector-icons/Ionicons';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import { type ComponentProps } from 'react';
import scaleFactor from '@/utils/ScaleFactor';
import { StyleSheet, View } from 'react-native';

export function TabBarIcon({
  style,
  ...rest
}: IconProps<ComponentProps<typeof Ionicons>['name']>) {
  return (
    <View style={styles.icon}>
      <Ionicons size={32 * scaleFactor} {...rest} />
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 60 * scaleFactor,
    height: 60 * scaleFactor,
    padding: 10 * scaleFactor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
