import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '@/constants/Colors';
import MissedTasks from '@/components/Home/MissedTasks';
import TaskSection from '@/components/Home/TaskSection';
import Dates from '@/components/Home/Dates';
import scaleFactor from '@/utils/ScaleFactor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { monthNames } from '@/constants/MonthNames';
import Holidays from '@/constants/Holidays';
import { Task } from '@/types/types';

export default function HomeScreen() {
  const [maskDay, setMaskDay] = useState(
    String(new Date().getDate()).padStart(2, '0')
  );
  const [day, setDay] = useState(new Date().getDate());
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const dateCurrent = `${maskDay}/${month + 1}/${year}`;
  const dayMonth = `${maskDay}/${month + 1}`;

  const colorScheme = useColorScheme();
  const [tasksCurrentDay, setTasksCurrentDay] = useState<Task[]>([]);
  const [viewMissedTasks, setViewMissedTasks] = useState(false);
  const [mtActiveTasks, setMtActiveTasks] = useState(-190 * scaleFactor);
  const [activeLoadedTasks, setActiveLoadedTasks] = useState(false);
  const currentMonth = useMemo(() => monthNames[month], [month]);

  const handleMissedTasksToggle = () => {
    setViewMissedTasks((prev) => !prev);
    setMtActiveTasks((prev) =>
      prev === -190 * scaleFactor ? -20 * scaleFactor : -190 * scaleFactor
    );
  };

  const loadTasks = useCallback(async () => {
    const currentDayOfWeek = new Date(year, month, day).getDay();
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      const tasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];

      const tasksCurrentDay = tasks.filter((task) => {
        const isSameDate = task.date === dateCurrent;
        const isRecurringToday =
          task.daysWeek && task.daysWeek.includes(currentDayOfWeek);
        return isSameDate || isRecurringToday;
      });
      setTasksCurrentDay(tasksCurrentDay);
    } catch (error) {
      console.error('Erro ao carregar os dados', error);
    }
  }, [dateCurrent, day, month, year]);

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [loadTasks])
  );

  useEffect(() => {
    if (activeLoadedTasks) {
      loadTasks();
      setActiveLoadedTasks(false);
    }
  }, [activeLoadedTasks, loadTasks]);

  const styles = getStyles(colorScheme);

  return (
    <View style={styles.container}>
      <View style={styles.calendar}>
        <ThemedText type="title" style={styles.title}>
          {currentMonth}
        </ThemedText>
        <Dates
          colorScheme={colorScheme}
          day={day}
          setDay={setDay}
          setMaskDay={setMaskDay}
          setActiveLoadedTasks={setActiveLoadedTasks}
        />
      </View>
      {Holidays.map((holiday) => {
        if (holiday.date === dayMonth) {
          return (
            <View style={styles.holiday} key={holiday.id}>
              <ThemedText type="title" style={styles.titleHoliday}>
                {holiday.text}
              </ThemedText>
            </View>
          );
        }
        return null;
      })}
      <MissedTasks
        isVisible={viewMissedTasks}
        onToggle={handleMissedTasksToggle}
        colorScheme={colorScheme}
        tasks={tasksCurrentDay}
        setActiveLoadedTasks={setActiveLoadedTasks}
        dateCurrent={dateCurrent}
      />
      <TaskSection
        mtActiveTasks={mtActiveTasks}
        colorScheme={colorScheme}
        tasks={tasksCurrentDay}
        setActiveLoadedTasks={setActiveLoadedTasks}
        dateCurrent={dateCurrent}
      />
    </View>
  );
}

const getStyles = (colorScheme: 'light' | 'dark') =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[colorScheme].tint,
    } as ViewStyle,
    calendar: {
      width: '100%',
      height: 140 * scaleFactor,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20 * scaleFactor,
      marginTop: 30 * scaleFactor,
    },
    title: {
      color: Colors[colorScheme].title,
    } as TextStyle,
    holiday: {
      width: '100%',
      height: 110 * scaleFactor,
      backgroundColor: Colors[colorScheme].backgroundThree,
      display: 'flex',
      alignItems: 'center',
      padding: 10 * scaleFactor,
      borderTopEndRadius: 26 * scaleFactor,
      borderTopStartRadius: 26 * scaleFactor,
      overflow: 'hidden',
      marginBottom: -30 * scaleFactor,
      paddingHorizontal: 30 * scaleFactor,
    } as ViewStyle,
    titleHoliday: {
      color: Colors[colorScheme].text,
      fontSize: 18 * scaleFactor,
      textAlign: 'center',
    } as TextStyle,
  });
