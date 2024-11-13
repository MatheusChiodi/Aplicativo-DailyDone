import React from 'react';
import { StyleSheet, TouchableOpacity, Text, GestureResponderEvent, ViewStyle, TextStyle } from 'react-native';
import scaleFactor from '@/utils/ScaleFactor';

interface TagButtonProps {
  label: string;
  isSelected: boolean;
  onPress: (event: GestureResponderEvent) => void;
  colors: {
    backgroundTwo: string;
    subText: string;
    tabIconSelected: string;
  };
  props?: object;
}

const TagButton: React.FC<TagButtonProps> = ({ label, isSelected, onPress, props, colors }) => {
  const styles = StyleSheet.create({
    tagButton: {
      backgroundColor: colors.backgroundTwo,
      paddingVertical: 8 * scaleFactor,
      paddingHorizontal: 25 * scaleFactor,
      borderRadius: 20 * scaleFactor,
      marginHorizontal: 5 * scaleFactor,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 4,
      opacity: 0.9,
    } as ViewStyle,
    tagText: {
      color: colors.subText,
      fontSize: 16 * scaleFactor,
    } as TextStyle,
  });

  return (
    <TouchableOpacity
      style={[
        styles.tagButton,
        {
          backgroundColor: isSelected
            ? colors.tabIconSelected
            : colors.backgroundTwo,
        },
      ]}
      onPress={onPress}
      {...props}
    >
      <Text style={styles.tagText}>{label}</Text>
    </TouchableOpacity>
  );
};

export default TagButton;
