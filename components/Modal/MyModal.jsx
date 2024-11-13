// MyModal.js
import React, { useMemo, useCallback } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import scaleFactor from '@/utils/ScaleFactor';
import MyModalHeader from './MyModalHeader';
import MyModalContent from './MyModalContent';
import MyModalFooter from './MyModalFooter';

const MyModal = ({
  isVisible,
  onRequestClose,
  title,
  children,
  whatHeight = 300 * scaleFactor,
  colorScheme,
  Colors,
  task,
  functions,
}) => {
  const styles = useMemo(
    () =>
      StyleSheet.create({
        centeredView: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        modalView: {
          width: '80%',
          height: whatHeight,
          backgroundColor: Colors[colorScheme ?? 'light'].background,
          borderRadius: 20 * scaleFactor,
          padding: 15 * scaleFactor,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2 * scaleFactor,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4 * scaleFactor,
          elevation: 5,
        },
      }),
    [whatHeight, colorScheme, Colors]
  );

  const handleClose = useCallback(() => {
    if (onRequestClose) onRequestClose();
  }, [onRequestClose]);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleClose}
      accessibilityLabel="Modal Dialog"
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <MyModalHeader
            title={title}
            onRequestClose={handleClose}
            colorScheme={colorScheme}
            Colors={Colors}
          />
          <MyModalContent
            children={children}
            colorScheme={colorScheme}
            Colors={Colors}
          />
          <MyModalFooter
            colorScheme={colorScheme}
            Colors={Colors}
            functions={functions}
            taskStatus={task.status}
          />
        </View>
      </View>
    </Modal>
  );
};

export default MyModal;
