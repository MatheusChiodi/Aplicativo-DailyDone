import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome5, AntDesign } from '@expo/vector-icons';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import scaleFactor from '@/utils/ScaleFactor';

import ContainerTask from '@/components/ContainerTask';
import MyModal from '@/components/Modal/MyModal';
import ContainerAlert from '@/components/ContainerAlert';
import ModalSelector from '@/components/ModalSelector';
import SubmitButton from '@/components/SubmitButton';

import dataDays from '@/constants/dataDays.js';
import dataMonths from '@/constants/dataMonths.js';
import dataYears from '@/constants/dataYears.js';

export default function AllTasksScreen() {
  const colorScheme = useColorScheme();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [activeLoadedTasks, setActiveLoadedTasks] = useState(false);

  useEffect(() => {
    const storeTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');

        if (!storedTasks) {
          setTasks([]);
        } else {
          // Converte o storedTasks para um array e organiza do mais novo para o mais antigo
          const parsedTasks = JSON.parse(storedTasks);
          const sortedTasks = parsedTasks.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );

          setTasks(sortedTasks);
        }
      } catch (error) {
        console.error('Erro ao carregar os dados', error);
      }
    };

    storeTasks();
  }, []);

  const loadTasks = useCallback(async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      const tasks = storedTasks ? JSON.parse(storedTasks) : [];
      setTasks(tasks);
    } catch (error) {
      console.error('Erro ao carregar os dados', error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks])
  );

  useEffect(() => {
    const monitorAsyncStorage = async () => {
      const initialTasks = await AsyncStorage.getItem('tasks');

      const interval = setInterval(async () => {
        const currentTasks = await AsyncStorage.getItem('tasks');

        if (initialTasks !== currentTasks) {
          loadTasks();
        }
      }, 2000);

      return () => clearInterval(interval);
    };

    monitorAsyncStorage();
  }, [loadTasks]);

  useEffect(() => {
    if (activeLoadedTasks) {
      loadTasks();
      setActiveLoadedTasks(false);
      setConfigFilterVisible(false);
    }
  }, [activeLoadedTasks]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[colorScheme ?? 'light'].tint,
    },
    taskContainer: {
      display: 'flex',
      alignItems: 'center',
      flexGrow: 1,
      backgroundColor: Colors[colorScheme ?? 'light'].background,
      borderTopEndRadius: 26 * scaleFactor,
      borderTopStartRadius: 26 * scaleFactor,
      padding: 7 * scaleFactor,
    },
    containerFilter: {
      width: '100%',
      height: 70 * scaleFactor,
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10 * scaleFactor,
      borderBottomColor: '#ccc',
      borderBottomWidth: 1,
      padding: 10 * scaleFactor,
      paddingBottom: 20 * scaleFactor,
    },
    icon: {
      width: 50 * scaleFactor,
      height: 50 * scaleFactor,
      borderRadius: 10 * scaleFactor,
      marginRight: 10 * scaleFactor,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      elevation: 5 * scaleFactor,
    },
    title: {
      fontSize: 28 * scaleFactor,
      fontWeight: 'bold',
      color: Colors[colorScheme ?? 'light'].text,
    },
    iconFilter: {
      width: 50 * scaleFactor,
      height: 50 * scaleFactor,
      borderRadius: 10 * scaleFactor,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: Colors[colorScheme ?? 'light'].backgroundTwo,
    },
    buttonFilter: {
      width: '100%',
      height: 50 * scaleFactor,
      borderRadius: 10 * scaleFactor,
      backgroundColor: Colors[colorScheme ?? 'light'].backgroundTwo,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10 * scaleFactor,
    },
    subtitle: {
      fontSize: 20 * scaleFactor,
      fontWeight: 'bold',
      color: Colors[colorScheme ?? 'light'].subText,
    },
    itemDisplay: {
      width: '100%',
      height: 50 * scaleFactor,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
    },
  });

  const [modalVisible, setModalVisible] = React.useState(false);
  const [activeTask, setActiveTask] = React.useState(null);

  const activeModalTask = (task) => {
    setActiveTask(task);
    setModalVisible(true);
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const tasks = await AsyncStorage.getItem('tasks');
      const parsedTasks = JSON.parse(tasks);
      const updatedTasks = parsedTasks.filter((task) => task.id !== taskId);
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setActiveTask(null);
      setModalVisible(false);
      setActiveLoadedTasks(true);
    } catch (error) {
      console.error('Erro ao concluir a tarefa:', error);
    }
  };

  const [configFilterVisible, setConfigFilterVisible] = useState(false);
  const [modalVisibleDay, setModalVisibleDay] = useState(false);
  const [modalVisibleMonth, setModalVisibleMonth] = useState(false);
  const [modalVisibleYear, setModalVisibleYear] = useState(false);

  const [dayFilter, setDayFilter] = useState(null);
  const [monthFilter, setMonthFilter] = useState(null);
  const [yearFilter, setYearFilter] = useState(null);
  const [existFilter, setExistFilter] = useState(false);

  const renderDay = ({ item }) => (
    <TouchableOpacity
      style={styles.itemDisplay}
      onPress={() => {
        setDayFilter(item.name);
        setModalVisibleDay(false);
      }}
    >
      <Text style={{ fontSize: 18 * scaleFactor, fontWeight: 'bold' }}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderMonth = ({ item }) => (
    <TouchableOpacity
      style={styles.itemDisplay}
      onPress={() => {
        setMonthFilter(item.name);
        setModalVisibleMonth(false);
      }}
    >
      <Text style={{ fontSize: 18 * scaleFactor, fontWeight: 'bold' }}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderYear = ({ item }) => (
    <TouchableOpacity
      style={styles.itemDisplay}
      onPress={() => {
        setYearFilter(item.name);
        setModalVisibleYear(false);
      }}
    >
      <Text style={{ fontSize: 18 * scaleFactor, fontWeight: 'bold' }}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const activeFilter = (type) => {
    if (type === 'day') {
      setModalVisibleDay(true);
    } else if (type === 'month') {
      setModalVisibleMonth(true);
    } else if (type === 'year') {
      setModalVisibleYear(true);
    }
  };

  const filter = () => {
    let result = tasks;
    let formattedDay = '';
    let formattedMonth = '';
    if (dayFilter) {
      if (dayFilter < 10) {
        formattedDay = dayFilter.toString().padStart(2, '0');
      } else {
        formattedDay = dayFilter;
      }

      result = result.filter((task) => {
        const taskDay = task.date.split('/')[0];
        return taskDay === formattedDay;
      });
    }
    if (monthFilter) {
      if (monthFilter < 10) {
        formattedMonth = monthFilter.toString().padStart(2, '0');
      } else {
        formattedMonth = monthFilter;
      }

      result = result.filter((task) => {
        const taskMonth = task.date.split('/')[1];
        return taskMonth === formattedMonth;
      });
    }
    if (yearFilter) {
      result = result.filter((task) => {
        const taskYear = task.date.split('/')[2];
        const filterYear = yearFilter.split('/')[2];

        return taskYear === filterYear;
      });
    }

    setFilteredTasks(result);
    setExistFilter(true);
    setConfigFilterVisible(false);
  };

  const resetFilter = () => {
    setDayFilter(null);
    setMonthFilter(null);
    setYearFilter(null);
    setExistFilter(false);
    setConfigFilterVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.taskContainer}>
        <View style={styles.containerFilter}>
          <Text style={styles.title}>
            {configFilterVisible ? 'Filtrar por' : 'Todas as tarefas'}
          </Text>
          <TouchableOpacity
            style={styles.icon}
            onPress={() => {
              setConfigFilterVisible(!configFilterVisible);
            }}
          >
            <View style={styles.iconFilter}>
              <FontAwesome5
                name="filter"
                size={24 * scaleFactor}
                color={'#ECEDEE'}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ width: '100%', padding: 10 * scaleFactor }}>
          {!configFilterVisible ? (
            existFilter ? (
              filteredTasks.length > 0 ? (
                <ScrollView
                  style={{
                    width: '100%',
                    height: '100%',
                    padding: 10 * scaleFactor,
                  }}
                >
                  {filteredTasks.map((task) => (
                    <ContainerTask
                      colorScheme={colorScheme}
                      task={task}
                      key={task.id}
                      activeModalTask={activeModalTask}
                      component="allTasks"
                    />
                  ))}
                </ScrollView>
              ) : (
                <ContainerAlert message="Nenhuma tarefa encontrada" />
              )
            ) : tasks.length > 0 ? (
              <ScrollView
                style={{
                  width: '100%',
                  height: '100%',
                  padding: 10 * scaleFactor,
                }}
              >
                {tasks.map((task) => (
                  <ContainerTask
                    colorScheme={colorScheme}
                    task={task}
                    key={task.id}
                    activeModalTask={activeModalTask}
                    component="allTasks"
                  />
                ))}
              </ScrollView>
            ) : (
              <ContainerAlert message="Nenhuma tarefa cadastrada até o momento" />
            )
          ) : (
            <>
              <TouchableOpacity
                onPress={() => {
                  activeFilter('day');
                }}
                style={[
                  styles.buttonFilter,
                  { marginBottom: 20 * scaleFactor },
                ]}
              >
                <Text style={styles.subtitle}>
                  {dayFilter == null ? 'DIA' : 'Dia: ' + dayFilter}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  activeFilter('month');
                }}
                style={[
                  styles.buttonFilter,
                  { marginBottom: 20 * scaleFactor },
                ]}
              >
                <Text style={styles.subtitle}>
                  {monthFilter == null ? 'MÊS' : 'Mês: ' + monthFilter}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  activeFilter('year');
                }}
                style={styles.buttonFilter}
              >
                <Text style={styles.subtitle}>
                  {yearFilter == null ? 'ANO' : 'Ano: ' + yearFilter}
                </Text>
              </TouchableOpacity>

              <ModalSelector
                isVisible={modalVisibleDay}
                onRequestClose={() => setModalVisibleDay(false)}
                data={dataDays}
                renderItem={renderDay}
                title="Dia"
              />
              <ModalSelector
                isVisible={modalVisibleMonth}
                onRequestClose={() => setModalVisibleMonth(false)}
                data={dataMonths}
                renderItem={renderMonth}
                title="Mês"
              />
              <ModalSelector
                isVisible={modalVisibleYear}
                onRequestClose={() => setModalVisibleYear(false)}
                data={dataYears}
                renderItem={renderYear}
                title="Ano"
              />
              <View style={{ height: 50 * scaleFactor }}></View>

              {(dayFilter > 0 || monthFilter > 0 || yearFilter > 0) &&
              existFilter == true ? (
                <>
                  <SubmitButton
                    onPress={() => resetFilter()}
                    Colors={Colors}
                    colorScheme={colorScheme}
                    title="Resetar Filtro"
                  />
                  <View style={{ height: 20 * scaleFactor }}></View>
                  <SubmitButton
                    onPress={() => filter()}
                    Colors={Colors}
                    colorScheme={colorScheme}
                    title="Filtrar novamente..."
                  />
                </>
              ) : (
                <SubmitButton
                  onPress={() => filter()}
                  Colors={Colors}
                  colorScheme={colorScheme}
                  title="Filtrar Tarefa"
                />
              )}
            </>
          )}
        </View>
      </View>

      {activeTask && (
        <MyModal
          title="Tarefa Ativa"
          isVisible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          colorScheme={colorScheme}
          Colors={Colors}
          children={activeTask.title}
          task={activeTask}
          functions={[
            {
              id: 3,
              label: 'Deletar',
              onPress: () => handleDeleteTask(activeTask.id),
            },
          ]}
        />
      )}
    </View>
  );
}
