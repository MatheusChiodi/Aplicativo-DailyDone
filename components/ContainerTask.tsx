import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import scaleFactor from '@/utils/ScaleFactor';

interface Task {
  title: string;
  status: string;
  startTime: string;
  endTime: string;
  frequency: string;
  date: string;
  tag: string;
}

interface ContainerTaskProps {
  colorScheme?: string;
  task: Task;
  activeModalTask: (task: Task) => void;
  component: string;
}

const ContainerTask: React.FC<ContainerTaskProps> = ({
  colorScheme = 'light',
  task,
  activeModalTask,
  component,
}) => {
  const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    } as ViewStyle,
    card: {
      width: '100%',
      minHeight: 120 * scaleFactor,
      backgroundColor: 'white',
      borderRadius: 16 * scaleFactor,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: 16,
      padding: 16 * scaleFactor,
      marginBottom: 16 * scaleFactor,
    } as ViewStyle,
    tag: {
      backgroundColor: Colors[colorScheme].backgroundTwo,
      padding: 8 * scaleFactor,
      borderRadius: 8 * scaleFactor,
    } as ViewStyle,
    textTag: {
      color: 'white',
      fontSize: 14 * scaleFactor,
    } as TextStyle,
    title: {
      color: Colors[colorScheme].tint,
      fontSize: 24 * scaleFactor,
    } as TextStyle,
    default: {
      color: Colors[colorScheme].tabIconDefault,
      fontSize: 14 * scaleFactor,
    } as TextStyle,
  });

  return (
    <TouchableOpacity style={styles.card} onPress={() => activeModalTask(task)}>
      <View style={styles.row}>
        <ThemedText type="subtitle" style={styles.title}>
          {task.title}
        </ThemedText>
        {component === 'TaskSection' && (
          <ThemedText type="default" style={styles.default}>
            {task.status}
          </ThemedText>
        )}
      </View>

      <View style={styles.row}>
        <ThemedText
          type="link"
          style={{
            color: Colors[colorScheme].tabIconDefault,
          }}
        >
          {task.startTime} - {task.endTime} -{' '}
          {task.frequency === 'Unica vez' ? task.date : 'Dias da semana'}
        </ThemedText>
        <View style={styles.tag}>
          <Text style={styles.textTag}>{task.tag}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ContainerTask;
