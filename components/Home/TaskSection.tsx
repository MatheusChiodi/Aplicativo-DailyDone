import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import MyModal from '@/components/Modal/MyModal';
import { Colors } from '@/constants/Colors';
import scaleFactor from '@/utils/ScaleFactor';
import ContainerTask from '@/components/ContainerTask';
import ContainerAlert from '@/components/ContainerAlert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Task, TaskSectionProps } from '@/types/types';

const filterAndSortTasks = (tasks: Task[], dateCurrent: string) => {
  const uniquePendingTasks = tasks.filter(
    (task) => task.status === 'Pendente' && task.frequency !== 'Dia da semana'
  );

  const weeklyPendingTasks = tasks.filter(
    (task) =>
      task.status === 'Pendente' &&
      task.frequency === 'Dia da semana' &&
      !task.dateRealized.includes(dateCurrent)
  );

  const combinedTasks = [...uniquePendingTasks, ...weeklyPendingTasks].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  return combinedTasks.filter(
    (task, index, self) => index === self.findIndex((t) => t.id === task.id)
  );
};

export default function TaskSection({
  mtActiveTasks,
  colorScheme,
  tasks,
  setActiveLoadedTasks,
  dateCurrent,
}: TaskSectionProps) {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [displayTasks, setDisplayTasks] = useState<Task[]>([]);

  const openTaskModal = (task: Task) => {
    setActiveTask(task);
    setModalVisible(true);
  };

  useEffect(() => {
    if (Array.isArray(tasks) && tasks.length > 0) {
      setDisplayTasks(filterAndSortTasks(tasks, dateCurrent));
    } else {
      setDisplayTasks([]);
    }
  }, [tasks, dateCurrent]);

  const updateTaskStatus = async (
    taskId: number,
    status: string,
    frequency: string
  ) => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      const parsedTasks = storedTasks ? JSON.parse(storedTasks) : [];

      const updatedTasks = parsedTasks.map((task: Task) =>
        task.id === taskId
          ? {
              ...task,
              status: frequency === 'Unica vez' ? status : task.status,
              dateRealized:
                frequency === 'Dia da semana'
                  ? [...task.dateRealized, dateCurrent]
                  : task.dateRealized,
            }
          : task
      );

      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setModalVisible(false);
      setActiveLoadedTasks(true);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      const parsedTasks = storedTasks ? JSON.parse(storedTasks) : [];
      const updatedTasks = parsedTasks.filter(
        (task: Task) => task.id !== taskId
      );

      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setModalVisible(false);
      setActiveLoadedTasks(true);
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  };

  const navigateToAllTasks = () => router.push({ pathname: './allTasks' });

  const styles = StyleSheet.create({
    taskContainer: {
      flex: 1,
      backgroundColor: Colors[colorScheme].background,
      padding: 16 * scaleFactor,
      borderTopEndRadius: 26 * scaleFactor,
      borderTopStartRadius: 26 * scaleFactor,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    textColor: {
      color: Colors[colorScheme].text,
    },
  });

  return (
    <View style={[styles.taskContainer, { marginTop: mtActiveTasks }]}>
      <View style={[styles.header, { marginBottom: 20 * scaleFactor }]}>
        <ThemedText type="subtitle" style={styles.textColor}>
          Tarefas Ativas
        </ThemedText>
        <TouchableOpacity onPress={navigateToAllTasks}>
          <ThemedText type="default" style={styles.textColor}>
            Ver todas
          </ThemedText>
        </TouchableOpacity>
      </View>

      {displayTasks.length > 0 ? (
        <ScrollView showsHorizontalScrollIndicator={false}>
          {displayTasks.map((task) => (
            <ContainerTask
              key={task.id}
              task={task}
              colorScheme={colorScheme}
              activeModalTask={openTaskModal}
              component="TaskSection"
            />
          ))}
        </ScrollView>
      ) : (
        <ContainerAlert message="Nenhuma tarefa pendente para concluir" />
      )}

      {activeTask && (
        <MyModal
          title="Tarefa Ativa"
          isVisible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          colorScheme={colorScheme}
          Colors={Colors}
          children={activeTask.description}
          task={activeTask}
          functions={[
            {
              id: 1,
              label: 'Concluir',
              onPress: () =>
                updateTaskStatus(
                  activeTask.id,
                  'Concluido',
                  activeTask.frequency
                ),
            },
            {
              id: 3,
              label: 'Deletar',
              onPress: () => deleteTask(activeTask.id),
            },
          ]}
        />
      )}
    </View>
  );
}
