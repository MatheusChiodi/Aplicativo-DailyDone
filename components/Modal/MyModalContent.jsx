import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import scaleFactor from '@/utils/ScaleFactor';

const MyModalContent = ({ children, colorScheme, Colors }) => {
  const styles = StyleSheet.create({
    context: {
      width: '100%',
      flex: 1,
      marginTop: 10 * scaleFactor,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    children: {
      fontSize: 18 * scaleFactor,
      color: Colors[colorScheme ?? 'light'].tabIconDefault,
    },
  });

  return (
    <View style={styles.context}>
      <Text style={styles.children}>{children}</Text>
    </View>
  );
};

export default MyModalContent;
