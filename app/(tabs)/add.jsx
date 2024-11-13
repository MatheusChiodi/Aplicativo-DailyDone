import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Platform,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Colors } from '@/constants/Colors';
import { Tags } from '@/constants/Tags';
import DaysWeek from '@/constants/DaysWeek';
import { useColorScheme } from '@/hooks/useColorScheme';
import scaleFactor from '@/utils/ScaleFactor';
import uuidv4 from '@/utils/uuidv4';
import { ThemedText } from '@/components/ThemedText';
import MyInput from '@/components/MyInput';
import SubmitButton from '@/components/SubmitButton';
import TagButton from '@/components/TagButton';

// Constantes para animações e timings
const ANIMATION_DURATION = 600;
const FADE_ANIMATION_DURATION = 800;
const FADE_ANIMATION_DELAY = 200;
const FORM_INITIAL_POSITION = 200;

export default function AddScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const formSlideAnim = useRef(
    new Animated.Value(FORM_INITIAL_POSITION)
  ).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const startAnimations = useCallback(() => {
    Animated.timing(formSlideAnim, {
      toValue: 0,
      duration: ANIMATION_DURATION,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: FADE_ANIMATION_DURATION,
      delay: FADE_ANIMATION_DELAY,
      useNativeDriver: true,
    }).start();
  }, [formSlideAnim, fadeAnim]);

  useEffect(() => {
    startAnimations();
  }, [startAnimations]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          backgroundColor: colors.tint,
          alignItems: 'center',
        },
        containerTitle: {
          height: 50 * scaleFactor,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 30 * scaleFactor,
        },
        title: {
          color: colors.title,
          fontSize: 24 * scaleFactor,
        },
        subtitle: {
          color: colors.tint,
          fontSize: 18 * scaleFactor,
          textAlign: 'center',
        },
        form: {
          width: '100%',
          flex: 1,
          padding: 20 * scaleFactor,
          backgroundColor: colors.background,
          borderTopEndRadius: 20 * scaleFactor,
          borderTopStartRadius: 20 * scaleFactor,
          transform: [{ translateY: formSlideAnim }],
        },
        containerTask: {
          width: '100%',
          alignItems: 'center',
        },
        timeTask: {
          width: '100%',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: 'row',
        },
        dateButton: {
          width: '100%',
          flexDirection: 'row',
          backgroundColor: colors.backgroundTwo,
          paddingVertical: 12 * scaleFactor,
          paddingHorizontal: 25 * scaleFactor,
          borderRadius: 10 * scaleFactor,
          marginTop: 10 * scaleFactor,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 2,
          elevation: 5,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        timeButton: {
          width: '48%',
          flexDirection: 'row',
          backgroundColor: colors.backgroundTwo,
          paddingVertical: 12 * scaleFactor,
          paddingHorizontal: 25 * scaleFactor,
          borderRadius: 10 * scaleFactor,
          marginVertical: 10 * scaleFactor,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 2,
          elevation: 5,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        dateButtonText: {
          color: colors.subText,
          fontSize: 18 * scaleFactor,
          textAlign: 'center',
        },
        selectedDateContainer: {
          backgroundColor: colors.backgroundTwo,
          padding: 15 * scaleFactor,
          borderRadius: 10 * scaleFactor,
          alignItems: 'center',
          marginTop: 15 * scaleFactor,
          width: '80%',
        },
        selectedDateText: {
          fontSize: 20 * scaleFactor,
          color: colors.text,
        },
        categoriesTask: {
          width: '100%',
          alignItems: 'center',
          marginTop: 10 * scaleFactor,
          marginBottom: 30 * scaleFactor,
        },
        tagsContainer: {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 10 * scaleFactor,
        },
        button: {
          backgroundColor: colors.backgroundTwo,
          paddingVertical: 15 * scaleFactor,
          paddingHorizontal: 25 * scaleFactor,
          borderRadius: 10 * scaleFactor,
          marginTop: 20 * scaleFactor,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 2,
          elevation: 5,
        },
        textButton: {
          color: colors.subText,
          fontSize: 18 * scaleFactor,
        },
        alertIcon: {
          width: 24 * scaleFactor,
          marginTop: -37 * scaleFactor,
          marginLeft: 15 * scaleFactor,
          marginBottom: 17 * scaleFactor,
        },
        row: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10 * scaleFactor,
        },
      }),
    [colorScheme, fadeAnim, formSlideAnim]
  );

  const [overlay, setOverlay] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [maskDate, setMaskDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedFrequency, setSelectedFrequency] = useState('Unica vez');
  const [daysWeek, setDaysWeek] = useState([]);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const [validedTitle, setValidedTitle] = useState(true);
  const [validedDescription, setValidedDescription] = useState(true);
  const [validedDate, setValidedDate] = useState(true);
  const [validedTag, setValidedTag] = useState(true);
  const [validedFrequency, setValidedFrequency] = useState(true);
  const [validedDaysWeek, setValidedDaysWeek] = useState(true);
  const [valided, setValided] = useState(true);

  const onChangeDate = useCallback(
    (event, selectedDate) => {
      const currentDate = selectedDate || date;
      setShowDatePicker(Platform.OS === 'ios');

      // Obtém a data atual sem a parte de horas, minutos e segundos
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Define a data selecionada sem a parte de horas, minutos e segundos
      const selectedDateNoTime = new Date(currentDate);
      selectedDateNoTime.setHours(0, 0, 0, 0);

      // Valida a data para permitir que o dia seja igual ou maior que a data atual
      if (selectedDateNoTime.getTime() < today.getTime()) {
        return;
      } else {
        setDate(currentDate);
        const formattedDate = currentDate.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
        setMaskDate(formattedDate);
      }
    },
    [date]
  );

  const onChangeStartTime = useCallback(
    (event, selectedTime) => {
      const currentStartTime = selectedTime || startTime;
      setShowStartTimePicker(Platform.OS === 'ios');
      setStartTime(currentStartTime);

      setEndTime(new Date(currentStartTime.getTime() + 3600000));
    },
    [startTime]
  );

  const onChangeEndTime = useCallback(
    (event, selectedTime) => {
      const currentEndTime = selectedTime || endTime;
      setShowEndTimePicker(Platform.OS === 'ios');

      if (currentEndTime.getTime() < startTime.getTime()) {
        return;
      } else {
        setEndTime(currentEndTime);
      }
    },
    [endTime]
  );

  useEffect(() => {
    if (selectedFrequency === 'Unica vez') {
      setDaysWeek([]);
    } else {
      setMaskDate('');
    }
  }, [selectedFrequency]);

  const handleAddTask = () => {
    if (taskTitle === '') {
      setValidedTitle(false);
      return;
    } else {
      setValidedTitle(true);
    }

    if (taskDescription === '') {
      setValidedDescription(false);
      return;
    } else {
      setValidedDescription(true);
    }

    if (selectedFrequency === '') {
      setValidedFrequency(false);
      return;
    } else {
      setValidedFrequency(true);
    }

    if (selectedFrequency === 'Unica vez') {
      if (maskDate === '') {
        setValidedDate(false);
        return;
      } else {
        setValidedDate(true);
      }
    }

    if (selectedFrequency === 'Dia da semana') {
      if (daysWeek.length === 0) {
        setValidedDaysWeek(false);
        return;
      } else {
        setValidedDaysWeek(true);
      }
    }

    if (selectedTag === '') {
      setValidedTag(false);
      return;
    } else {
      setValidedTag(true);
    }

    if (
      validedTitle &&
      validedDescription &&
      validedTag &&
      validedFrequency &&
      validedDate &&
      validedDaysWeek
    ) {
      setValided(true);

      let registerDate = '';
      if(selectedFrequency == 'Dia da semana') {
        registerDate = maskDate;
      }else{
        registerDate = '';
      }

      const task = {
        title: taskTitle,
        description: taskDescription,
        tag: selectedTag,
        frequency: selectedFrequency,
        date: selectedFrequency === 'Unica vez' ? maskDate : '',
        daysWeek: daysWeek,
        startTime: startTime.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        endTime: endTime.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        dateRealized: [],
        status: 'Pendente',
        id: uuidv4(),
      };

      const saveData = async () => {
        const storage = await AsyncStorage.getItem('tasks');
        let tasksData = JSON.parse(storage) || [];

        tasksData.push(task);

        await AsyncStorage.setItem('tasks', JSON.stringify(tasksData));

        setTaskTitle('');
        setTaskDescription('');
        setSelectedTag('');
        setSelectedFrequency('');
        setDaysWeek([]);
        setStartTime(new Date());
        setEndTime(new Date());

        router.push('/');
      };

      saveData();
    } else {
      setValided(false);
    }
  };

  useEffect(() => {
    if (!validedTitle) {
      if (taskTitle != '') {
        setValidedTitle(true);
      } else {
        setValidedTitle(false);
      }
    }

    if (!validedDescription) {
      if (taskDescription != '') {
        setValidedDescription(true);
      } else {
        setValidedDescription(false);
      }
    }

    if (!validedFrequency) {
      if (selectedFrequency != '') {
        setValidedFrequency(true);
      } else {
        setValidedFrequency(false);
      }
    }

    if (!validedTag) {
      if (selectedTag != '') {
        setValidedTag(true);
      } else {
        setValidedTag(false);
      }
    }
  }, [taskTitle, selectedTag, selectedFrequency]);

  return (
    <View style={styles.container}>
      <View style={styles.containerTitle}>
        <ThemedText type="title" style={styles.title}>
          Adicione uma Tarefa
        </ThemedText>
      </View>

      <Animated.View style={styles.form}>
        <ScrollView>
          <MyInput
            placeholder="Título da Tarefa"
            title="Título da Tarefa"
            value={taskTitle}
            onChangeText={setTaskTitle}
            keyboardType="default"
            maxLength={50}
            placeholderTextColor={colors.tabIconDefault}
            overlay={setOverlay}
            backgroundColor={colors.tint}
            backgroundColorTwo={colors.background}
            backgroundInput={colors.backgroundTwo}
            colorTitle={colors.subText}
            type="text"
          />

          {!validedTitle && (
            <View style={styles.alertIcon}>
              <Ionicons
                name="alert-circle-outline"
                size={24 * scaleFactor}
                color={colors.tint}
              />
            </View>
          )}

          <View style={[styles.containerTask, { marginTop: 20 * scaleFactor }]}>
            <View style={styles.row}>
              <ThemedText type="subtitle" style={styles.subtitle}>
                Descreva a tarefa
              </ThemedText>
              {!validedDescription && (
                <Ionicons
                  name="alert-circle-outline"
                  size={24 * scaleFactor}
                  color={colors.tint}
                />
              )}
            </View>
            <MyInput
              placeholder="Descreva a tarefa"
              title="Descreva a tarefa"
              value={taskDescription}
              onChangeText={setTaskDescription}
              keyboardType="default"
              maxLength={150}
              placeholderTextColor={colors.tabIconDefault}
              overlay={setOverlay}
              backgroundColor={colors.tint}
              backgroundColorTwo={colors.background}
              backgroundInput={colors.backgroundTwo}
              colorTitle={colors.subText}
              type="textarea"
            />
            
            <View style={[styles.row, { marginTop: 20 * scaleFactor }]}>
              <ThemedText type="subtitle" style={styles.subtitle}>
                Escolha a frequência da tarefa
              </ThemedText>
              {!validedFrequency && (
                <Ionicons
                  name="alert-circle-outline"
                  size={24 * scaleFactor}
                  color={colors.tint}
                />
              )}
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagsContainer}
            >
              <TagButton
                label="Unica vez"
                isSelected={selectedFrequency === 'Unica vez'}
                onPress={() => setSelectedFrequency('Unica vez')}
                colors={colors}
              />

              <TagButton
                label="Dias da semana"
                isSelected={selectedFrequency === 'Dia da semana'}
                onPress={() => setSelectedFrequency('Dia da semana')}
                colors={colors}
              />
            </ScrollView>
          </View>
          {selectedFrequency === 'Unica vez' && (
            <View
              style={[styles.containerTask, { marginTop: 20 * scaleFactor }]}
            >
              <View style={styles.row}>
                <ThemedText type="subtitle" style={styles.subtitle}>
                  Escolha uma data para a tarefa
                </ThemedText>
                {!validedDate && (
                  <Ionicons
                    name="alert-circle-outline"
                    size={24 * scaleFactor}
                    color={colors.tint}
                  />
                )}
              </View>

              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
                accessibilityLabel="Selecionar data para a tarefa"
              >
                <Text style={styles.dateButtonText}>
                  {maskDate || 'Escolher Data'}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={onChangeDate}
                />
              )}
            </View>
          )}
          {selectedFrequency === 'Dia da semana' && (
            <View
              style={[styles.containerTask, { marginTop: 20 * scaleFactor }]}
            >
              <View style={styles.row}>
                <ThemedText type="subtitle" style={styles.subtitle}>
                  Escolha os dias da semana
                </ThemedText>
                {!validedDaysWeek && (
                  <Ionicons
                    name="alert-circle-outline"
                    size={24 * scaleFactor}
                    color={colors.tint}
                  />
                )}
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tagsContainer}
              >
                {DaysWeek.map((day) => (
                  <TagButton
                    label={day.nome}
                    isSelected={daysWeek.includes(day.id)}
                    onPress={() => {
                      if (daysWeek.includes(day.id)) {
                        setDaysWeek(daysWeek.filter((d) => d !== day.id));
                      } else {
                        setDaysWeek([...daysWeek, day.id]);
                      }
                    }}
                    key={day.id}
                    colors={colors}
                  />
                ))}
              </ScrollView>
            </View>
          )}
          <View style={[styles.containerTask, { marginTop: 20 * scaleFactor }]}>
            <View style={styles.row}>
              <ThemedText type="subtitle" style={styles.subtitle}>
                Escolha o horario para a tarefa
              </ThemedText>
            </View>
            <View style={styles.timeTask}>
              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => setShowStartTimePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {`Início: ${startTime.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`}
                </Text>
              </TouchableOpacity>
              {showStartTimePicker && (
                <DateTimePicker
                  value={startTime}
                  mode="time"
                  display="default"
                  onChange={onChangeStartTime}
                />
              )}

              <TouchableOpacity
                style={styles.timeButton}
                onPress={() => setShowEndTimePicker(true)}
              >
                <Text style={styles.dateButtonText}>
                  {`Fim: ${endTime.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}`}
                </Text>
              </TouchableOpacity>
              {showEndTimePicker && (
                <DateTimePicker
                  value={endTime}
                  mode="time"
                  display="default"
                  onChange={onChangeEndTime}
                />
              )}
            </View>
          </View>

          <View style={styles.categoriesTask}>
            <View style={styles.row}>
              <ThemedText type="subtitle" style={styles.subtitle}>
                Escolha a categoria da tarefa
              </ThemedText>
              {!validedTag && (
                <Ionicons
                  name="alert-circle-outline"
                  size={24 * scaleFactor}
                  color={colors.tint}
                />
              )}
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tagsContainer}
            >
              {Tags.map((tag) => (
                <TagButton
                  label={tag.nome}
                  isSelected={selectedTag === tag.nome}
                  onPress={() => setSelectedTag(tag.nome)}
                  key={tag.id}
                  colors={colors}
                />
              ))}
            </ScrollView>
          </View>
          <SubmitButton
            onPress={() => handleAddTask()}
            Colors={Colors}
            colorScheme={colorScheme}
            title={'Adicionar Tarefa'}
          />
          <View style={{ height: 50 * scaleFactor }}></View>
        </ScrollView>
      </Animated.View>

      {overlay && <View style={styles.overlay}></View>}
    </View>
  );
}
