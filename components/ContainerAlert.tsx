import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import scaleFactor from '@/utils/ScaleFactor';

interface ContainerAlertProps {
  message: string;
}

const ContainerAlert: React.FC<ContainerAlertProps> = ({ message }) => {
  const colorScheme = useColorScheme();
  const styles = StyleSheet.create({
    container: {
      backgroundColor: Colors[colorScheme ?? 'light'].backgroundTwo,
      padding: 10 * scaleFactor,
      borderRadius: 10 * scaleFactor,
    } as ViewStyle,
    text: {
      color: 'white',
      textAlign: 'center',
      fontSize: 17 * scaleFactor,
      fontWeight: 'bold',
      lineHeight: 24 * scaleFactor,
      letterSpacing: -0.25 * scaleFactor,
    } as TextStyle,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

export default ContainerAlert;
