import { StyleSheet } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import { type ComponentProps } from 'react';

import scaleFactor from '@/utils/ScaleFactor';

export function TabBarButton({
  style,
  color,
  ...rest
}: IconProps<ComponentProps<typeof Ionicons>['name']>) {
  const styles = StyleSheet.create({
    button: {
      borderRadius: 100 * scaleFactor,
      backgroundColor: color,
      width: 60 * scaleFactor,
      height: 60 * scaleFactor,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 40 * scaleFactor,
      padding: 15 * scaleFactor,
    },
  });

  return (
    <Ionicons
      size={28 * scaleFactor}
      {...rest}
      color={'white'}
      style={styles.button}
    />
  );
}
