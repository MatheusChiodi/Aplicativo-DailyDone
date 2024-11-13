import React, { useEffect, useRef, useMemo } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import scaleFactor from '@/utils/ScaleFactor';
import { Colors } from '@/constants/Colors';

interface DatesProps {
  colorScheme: any;
  day: number;
  setDay: (day: number) => void;
  setMaskDay: any;
  setActiveLoadedTasks: (value: boolean) => void;
}

const getDaysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

const Dates: React.FC<DatesProps> = React.memo(
  ({ colorScheme = 'light', day, setDay, setMaskDay, setActiveLoadedTasks }) => {
    const currentDate = useMemo(() => new Date(), []);
    const currentDayOfMonth = useMemo(() => currentDate.getDate(), [currentDate]);
    const daysInCurrentMonth = useMemo(
      () => getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth() + 1),
      [currentDate]
    );

    const dateScrollViewRef = useRef<ScrollView>(null);

    const changeDay = (selectedDay: number) => {
      setDay(selectedDay);

      if (selectedDay < 10) {
        const formattedDay = selectedDay.toString().padStart(2, '0');
        setMaskDay(formattedDay);
      } else {
        setMaskDay(selectedDay);
      }

      setActiveLoadedTasks(true);
    };

    useEffect(() => {
      const xOffset = (50 * scaleFactor + 10 * scaleFactor) * (currentDayOfMonth - 1);

      const timer = setTimeout(() => {
        dateScrollViewRef.current?.scrollTo({ x: xOffset, animated: true });
      }, 0);

      return () => clearTimeout(timer);
    }, [currentDayOfMonth]);

    return (
      <View style={styles.containerDates}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          ref={dateScrollViewRef}
        >
          {Array.from({ length: daysInCurrentMonth }, (_, index) => {
            const isToday = day === index + 1;
            return (
              <TouchableOpacity
                key={index}
                style={styles.containerDate}
                onPress={() => changeDay(index + 1)}
              >
                <LinearGradient
                  colors={
                    isToday
                      ? [
                          Colors[colorScheme].backgroundTwo,
                          Colors[colorScheme].backgroundTwo,
                        ]
                      : ['#dee2e6', '#ced4da']
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradient}
                >
                  <Text
                    style={[
                      styles.dateText,
                      { color: isToday ? '#fff' : '#282A36' },
                    ]}
                  >
                    {index + 1}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  containerDates: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10 * scaleFactor,
  } as ViewStyle,
  containerDate: {
    width: 50 * scaleFactor,
    height: 70 * scaleFactor,
    borderRadius: 20 * scaleFactor,
    marginRight: 10 * scaleFactor,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  } as ViewStyle,
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  dateText: {
    fontSize: 20 * scaleFactor,
    fontWeight: 'bold',
  } as TextStyle,
});

export default Dates;
