const tintColorLight = '#283618';
const tintColorDark = '#eb5e28';

interface ColorScheme {
  text: string;
  subText: string;
  background: string;
  backgroundTwo: string;
  backgroundThree: string;
  tint: string;
  title: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
}

interface ColorsType {
  light: ColorScheme;
  dark: ColorScheme;
}

export const Colors: ColorsType = {
  light: {
    text: '#2F3E46',
    subText: '#ECEDEE',
    background: '#ECEDEE',
    backgroundTwo: '#606c38',
    backgroundThree: '#6E794A',
    tint: tintColorLight,
    title: '#ECEDEE',
    icon: '#4F5D75',
    tabIconDefault: '#4F5D75',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    subText: '#ECEDEE',
    background: '#1C1C1A',
    backgroundTwo: '#3A403D',
    backgroundThree: '#1C1C1A',
    tint: tintColorDark,
    title: '#1C1C1A',
    icon: '#8D99AE',
    tabIconDefault: '#8D99AE',
    tabIconSelected: tintColorDark,
  },
};
