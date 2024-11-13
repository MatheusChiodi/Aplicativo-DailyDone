import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import scaleFactor from '@/utils/ScaleFactor';

const MyModalHeader = ({ title, onRequestClose, colorScheme, Colors }) => {
  return (
    <View style={styles.headerContainer}>
      <Text
        style={[
          styles.modalTitle,
          { color: Colors[colorScheme ?? 'light'].tint },
        ]}
      >
        {title}
      </Text>
      <TouchableOpacity
        onPress={onRequestClose}
        accessibilityLabel="Close Modal"
      >
        <AntDesign
          name="closecircle"
          size={24 * scaleFactor}
          color={Colors[colorScheme ?? 'light'].tint}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10 * scaleFactor,
    borderBottomWidth: 1 * scaleFactor,
    borderBottomColor: '#ccc',
    paddingBottom: 10 * scaleFactor,
  },
  modalTitle: {
    fontSize: 24 * scaleFactor,
    fontWeight: 'bold',
  },
});

export default MyModalHeader;
