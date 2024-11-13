import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Animated, ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import ContainerTask from '@/components/ContainerTask';
import MyModal from '@/components/Modal/MyModal';
import ContainerAlert from '@/components/ContainerAlert';
import { Colors } from '@/constants/Colors';
import scaleFactor from '@/utils/ScaleFactor';
import { Task, MissedTasksProps } from '@/types/types';

const filterAndSortTasks = (tasks: Task[], dateCurrent: string) => {
  const oneTimeTasks = tasks.filter(
    (task) => task.status === 'Concluido' && task.frequency !== 'Dia da semana'
  );
  const weeklyTasks = tasks.filter(
    (task) =>
      task.status === 'Pendente' &&
      task.frequency === 'Dia da semana' &&
      task.dateRealized.includes(dateCurrent)
  );

  const combinedTasks = [...oneTimeTasks, ...weeklyTasks].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return combinedTasks.filter(
    (task, index, self) => index === self.findIndex((t) => t.id === task.id)
  );
};

export default function MissedTasks({
  isVisible,
  onToggle,
  colorScheme,
  tasks,
  setActiveLoadedTasks,
  dateCurrent,
}: MissedTasksProps) {
  const heightAnim = useRef(new Animated.Value(200 * scaleFactor)).current;
  const scrollRef = useRef<ScrollView>(null);
  const gestureRef = useRef(null);

  const [displayTasks, setDisplayTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      backgroundColor: Colors[colorScheme].backgroundTwo,
      padding: 16 * scaleFactor,
      borderTopEndRadius: 26 * scaleFactor,
      borderTopStartRadius: 26 * scaleFactor,
      overflow: 'hidden',
    },
    toggleButton: {
      marginBottom: 30 * scaleFactor,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerText: {
      color: 'white',
    },
    scrollContainer: {
      maxHeight: 300 * scaleFactor,
    },
    scrollSpacer: {
      height: 20 * scaleFactor,
    },
  });

  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: isVisible ? 300 * scaleFactor : 250 * scaleFactor,
      duration: 300 * scaleFactor,
      useNativeDriver: false,
    }).start();
  }, [isVisible]);

  useEffect(() => {
    if (Array.isArray(tasks) && tasks.length > 0) {
      setDisplayTasks(filterAndSortTasks(tasks, dateCurrent));
    } else {
      setDisplayTasks([]);
    }
  }, [tasks, dateCurrent]);

  const openModalForTask = (task: Task) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const markTaskAsIncomplete = async (taskId: number) => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      const parsedTasks = storedTasks ? JSON.parse(storedTasks) : [];

      const updatedTasks = parsedTasks.map((task: Task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.frequency === 'Unica vez' ? 'Pendente' : task.status,
              dateRealized:
                task.frequency === 'Dia da semana'
                  ? task.dateRealized.filter((date) => date !== dateCurrent)
                  : task.dateRealized,
            }
          : task
      );

      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setSelectedTask(null);
      setModalVisible(false);
      setActiveLoadedTasks(true);
    } catch (error) {
      console.error('Erro ao marcar tarefa como incompleta:', error);
    }
  };

  return (
    <Animated.View style={[styles.container, { height: heightAnim }]}>
      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={1}
        style={styles.toggleButton}
      >
        <View style={styles.header}>
          <ThemedText type="subtitle" style={styles.headerText}>
            Tarefas concluídas
          </ThemedText>
          <Ionicons
            name={isVisible ? 'chevron-up' : 'chevron-down'}
            size={24 * scaleFactor}
            color="white"
          />
        </View>
      </TouchableOpacity>

      {displayTasks.length > 0 ? (
        <ScrollView
          ref={scrollRef}
          showsHorizontalScrollIndicator={false}
          style={styles.scrollContainer}
          simultaneousHandlers={gestureRef}
        >
          {displayTasks.map((task) => (
            <ContainerTask
              key={task.id}
              task={task}
              colorScheme={colorScheme}
              activeModalTask={openModalForTask}
              component="MissedTasks"
            />
          ))}
          <View style={styles.scrollSpacer} />
        </ScrollView>
      ) : (
        <ContainerAlert message="Nenhuma tarefa concluída" />
      )}

      {selectedTask && (
        <MyModal
          title="Tarefa Ativa"
          isVisible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          colorScheme={colorScheme}
          Colors={Colors}
          children={selectedTask.description}
          task={selectedTask}
          functions={[
            {
              id: 2,
              label: 'Desconcluir',
              onPress: () => markTaskAsIncomplete(selectedTask.id),
            },
          ]}
        />
      )}
    </Animated.View>
  );
}
