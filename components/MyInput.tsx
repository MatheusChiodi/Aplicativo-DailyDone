import React, { createRef, useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  Modal,
  SafeAreaView,
  View,
  Platform,
  KeyboardAvoidingView,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import scaleFactor from '@/utils/ScaleFactor';

interface MyInputProps extends TextInputProps {
  overlay: (value: boolean) => void;
  backgroundInput: string;
  colorTitle: string;
  backgroundColor: string;
  backgroundColorTwo: string;
  colorText: string;
  title: string;
  type?: 'text' | 'multiline';
}

const MyInput: React.FC<MyInputProps> = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const inputRef = createRef<TextInput>();

  function setFocus() {
    if (Platform.OS === 'android') {
      inputRef.current?.focus();
    }
  }

  function setVisibility(value: boolean) {
    setModalVisible(value);
    props.overlay(value);
  }

  const styles = StyleSheet.create({
    item: {
      width: '100%',
      height: props.type === 'text' ? 50 * scaleFactor : 150 * scaleFactor,
      borderRadius: 10 * scaleFactor,
      paddingHorizontal: 10 * scaleFactor,
      fontSize: 18 * scaleFactor,
      backgroundColor: props.backgroundInput,
      textAlign: 'center',
      marginTop: 10 * scaleFactor,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: props.colorTitle,
    } as TextStyle,
    textInput: {
      fontSize: 17 * scaleFactor,
      fontWeight: '500',
      textAlign: 'center',
      width: '100%',
      color: props.colorTitle,
    } as TextStyle,
    outside: {
      flex: 1,
      backgroundColor: props.backgroundColor,
    } as ViewStyle,
    inputWrapper: {
      flex: 1,
      backgroundColor: props.backgroundColorTwo,
      paddingTop: 20 * scaleFactor,
      borderTopRightRadius: 20 * scaleFactor,
      borderTopLeftRadius: 20 * scaleFactor,
      elevation: 5 * scaleFactor,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20 * scaleFactor,
    } as ViewStyle,
    iosInput: {
      height: 50 * scaleFactor,
      color: props.colorText,
    } as TextStyle,
  });

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.item}
      onPress={() => setVisibility(true)}
    >
      <Text style={styles.textInput}>{props.value || props.placeholder}</Text>
      <Modal
        visible={modalVisible}
        onRequestClose={() => {
          setVisibility(false);
        }}
        onShow={setFocus}
        animationType="slide"
      >
        <SafeAreaView style={styles.outside}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <TouchableOpacity
              style={styles.outside}
              onPress={() => {
                setVisibility(false);
              }}
            />
            <View style={styles.inputWrapper}>
              <Text
                style={{
                  fontSize: 18 * scaleFactor,
                  fontWeight: 'bold',
                  color: props.colorTitle,
                }}
              >
                {props.title}
              </Text>
              <TextInput
                {...props}
                ref={inputRef}
                style={[
                  styles.item,
                  Platform.OS === 'ios' ? styles.iosInput : {},
                ]}
                autoFocus={Platform.OS === 'ios'}
                onBlur={() => setVisibility(false)}
                onSubmitEditing={() => setVisibility(false)}
                multiline={props.type !== 'text'}
              />
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </TouchableOpacity>
  );
};

export default MyInput;
