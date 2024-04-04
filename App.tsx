import { StatusBar } from 'expo-status-bar';
import {ScrollView, View } from 'react-native';
import Logo from './src/components/Logo';
import CreateAndList from './src/components/CreateAndList';
import { LocaleConfig } from 'react-native-calendars';
import FastMessages from './src/components/FastMessages';

export default function App() {

  LocaleConfig.locales['pt-br'] = {
    monthNames: [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro'
    ],
    monthNamesShort: [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez'
    ],
    dayNames: [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado'
    ],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    today: "Hoje"
  };
  
  LocaleConfig.defaultLocale = 'pt-br';

  return (
    <View style={{backgroundColor: '#181818', flex: 1}}>
      <ScrollView>
        <>
        <StatusBar style="light" translucent backgroundColor='transparent'/>
        <Logo/>
    
        <CreateAndList/>
        
        <FastMessages/>
        </>
      </ScrollView>
    </View>
  );
}
