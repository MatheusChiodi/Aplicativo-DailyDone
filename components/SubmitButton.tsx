import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import scaleFactor from '@/utils/ScaleFactor';

interface SubmitButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  Colors: { [key: string]: { tint: string } };
  colorScheme?: string;
  title: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  onPress,
  Colors,
  colorScheme = 'light',
  title,
}) => {
  const styles = StyleSheet.create({
    submitButton: {
      width: '100%',
      backgroundColor: Colors[colorScheme].tint,
      padding: 10 * scaleFactor,
      borderRadius: 5 * scaleFactor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    submitButtonText: {
      color: '#FFFFFF',
      fontSize: 20 * scaleFactor,
      fontWeight: 'bold',
    },
  });

  return (
    <TouchableOpacity style={styles.submitButton} onPress={onPress}>
      <Text style={styles.submitButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default SubmitButton;
