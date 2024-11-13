import React from 'react';
import {
  Modal,
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  FlatListProps,
} from 'react-native';

import { AntDesign } from '@expo/vector-icons';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import scaleFactor from '@/utils/ScaleFactor';

interface ModalSelectorProps {
  isVisible: boolean;
  onRequestClose: () => void;
  data: Array<{ id: number; [key: string]: any }>; // ajuste conforme a estrutura dos dados
  renderItem: FlatListProps<any>['renderItem'];
  title: string;
  whatHeight?: string;
}

const ModalSelector: React.FC<ModalSelectorProps> = ({
  isVisible,
  onRequestClose,
  data,
  renderItem,
  title,
  whatHeight = '50%',
}) => {
  const colorScheme = useColorScheme();
  const styles = StyleSheet.create({
    centeredView: {
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    } as ViewStyle,
    modalView: {
      width: '80%',
      height: whatHeight,
      backgroundColor: 'white',
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
      elevation: 5 * scaleFactor,
    } as ViewStyle,
    modalTitle: {
      fontSize: 24 * scaleFactor,
      color: '#282A36',
      fontWeight: 'bold',
    } as TextStyle,
    closeCircle: {
      color: Colors[colorScheme].tint,
    },
  });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onRequestClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10 * scaleFactor,
            }}
          >
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={onRequestClose}>
              <AntDesign
                name="closecircle"
                size={24 * scaleFactor}
                style={styles.closeCircle}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            style={{ width: '100%' }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default React.memo(ModalSelector);
