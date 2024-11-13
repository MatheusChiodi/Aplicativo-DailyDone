import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import scaleFactor from '@/utils/ScaleFactor';

const MyModalFooter = ({ colorScheme, Colors, functions }) => {
  const deleteFunction = functions.find((func) => func.id === 3);
  const completeFunction = functions.find((func) => func.id === 1);
  const descompleteFunction = functions.find((func) => func.id === 2);

  return (
    <View style={styles.footerContainer}>
      {completeFunction && deleteFunction ? (
        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: Colors[colorScheme ?? 'light'].backgroundTwo },
            ]}
            onPress={deleteFunction.onPress}
          >
            <Text style={styles.buttonText}>Deletar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: Colors[colorScheme ?? 'light'].backgroundTwo },
            ]}
            onPress={completeFunction.onPress}
          >
            <Text style={styles.buttonText}>Concluir</Text>
          </TouchableOpacity>
        </View>
      ) : descompleteFunction ? (
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: Colors[colorScheme ?? 'light'].backgroundTwo },
          ]}
          onPress={descompleteFunction.onPress}
        >
          <Text style={styles.buttonText}>Não concluida</Text>
        </TouchableOpacity>
      ) : deleteFunction ? (
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: Colors[colorScheme ?? 'light'].backgroundTwo },
          ]}
          onPress={deleteFunction.onPress}
        >
          <Text style={styles.buttonText}>Deletar</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10 * scaleFactor,
  },
  button: {
    flex: 1,
    padding: 10 * scaleFactor,
    borderRadius: 10 * scaleFactor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16 * scaleFactor,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10 * scaleFactor,
  },
});

export default MyModalFooter;
