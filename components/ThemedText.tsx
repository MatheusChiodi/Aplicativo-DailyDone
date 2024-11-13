import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import scaleFactor from '@/utils/ScaleFactor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16 * scaleFactor,
    lineHeight: 24 * scaleFactor,
  },
  defaultSemiBold: {
    fontSize: 16 * scaleFactor,
    lineHeight: 24 * scaleFactor,
    fontWeight: '600',
  },
  title: {
    fontSize: 32 * scaleFactor,
    fontWeight: 'bold',
    lineHeight: 32 * scaleFactor,
  },
  subtitle: {
    fontSize: 20 * scaleFactor,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30 * scaleFactor,
    fontSize: 16 * scaleFactor,
    color: '#0a7ea4',
  },
});
