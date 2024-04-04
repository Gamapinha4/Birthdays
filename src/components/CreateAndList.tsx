import { Alert, Button, FlatList, Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FlatListComponent from "./FlatListComponent";
import { proximosAniversarios } from "../utils/nextDays";
import { useEffect, useRef, useState } from "react";
import { Calendar } from "react-native-calendars";
import { encontrarIndicePorData } from "../utils";
import { adicionarAniversariante, exportarAniversarios, getListaDeAniversarios, importarAniversarios, removerAniversariante } from "../storage/AsyncStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Clipboard from 'expo-clipboard'

export default function CreateAndList() {

  const [selected, setSelected] = useState('')
  const [listSelected, setListSelected] = useState<any[]>([])
  const [listaDeAniversarios, setListaDeAniversarios] = useState([])

  const [modalVisible, setModalVisible] = useState(false);
  const [nomeAnv, setNomeAnv] = useState('')
  const [dataAnv, setDataAnv] = useState('')

  const flatListRef = useRef<any>(null);

  const [atualizar, setAtualizar] = useState(false)
  const [modalImport, setModalImport] = useState(false)
  const [modalExport, setModalExport] = useState(false)

  const [textImport, setTextImport] = useState('')
  const [textExport, setTextExport] = useState<string | null>('')

  async function handleImport() {
    try {
      const jsonData = JSON.parse(textImport);
      if (Array.isArray(jsonData)) {
        const isValidJSON = jsonData.every(item => (
          typeof item === 'object' && item.hasOwnProperty('nome') && item.hasOwnProperty('data')
        ));
        if (isValidJSON) {
          await importarAniversarios(textImport)
          await loadAniversarios()
        } else {
          Alert.alert('Por favor, insira um JSON com o formato correto.');
        }
      } else {
        Alert.alert('Por favor, insira um JSON de array válido.');
      }
    } catch (error) {
      Alert.alert('Por favor, insira um JSON válido.');
    } finally {
      setModalImport(false)
    }
  }

  async function handleExport() {
    const resp = await exportarAniversarios()
    if (resp) {
      Clipboard.setString(resp)
    }
  }

  const scrollToIndex = (index: any) => {

    if (index.length === 1) {
      flatListRef.current.scrollToIndex({ animated: true, index });
    }else {
      flatListRef.current.scrollToIndex({ animated: true, index: index[0] });
    }
  };

  const markedDates = {} as any;
  const datatoday = new Date()
  listaDeAniversarios.forEach((date : any) => {
    const ano = datatoday.getFullYear().toString()
    const mes = date.data.split('/')[1]
    const dia = date.data.split('/')[0]
    markedDates[`${ano}-${mes}-${dia}`] = { marked: true, dotColor: selected === `${ano}-${mes}-${dia}` ? 'orange' : 'gray' };
  });

  async function handleAdicionar() {
    if (nomeAnv.trim().length > 0 && dataAnv.trim().length > 0 && dataAnv.trim().length === 5) {
      
      const regex = /^\d{2}\/\d{2}$/;
      if (regex.test(dataAnv)) {
        try {
          await adicionarAniversariante(nomeAnv ,dataAnv)
          await loadAniversarios()
        }catch(error) {
          throw error
        }finally {
          setModalVisible(false)
        }
      }
    };
  }

  const mostrarAlerta = (item : string) => {
    Alert.alert(
      'Apagar aniversario',
      'tem certeza que deseja apagar?',
      [
        {
          text: 'Apagar',
          onPress: async () => removeAniversarios(item),
          style: 'cancel',
        },
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  }

  async function removeAniversarios(nome: string) {
    try {
      await removerAniversariante(nome);
      await loadAniversarios()
    }catch(error) {
      throw error
    }
  }

  async function loadAniversarios() {
    const resp = await getListaDeAniversarios();
    setListaDeAniversarios(resp);
    //await AsyncStorage.clear()
  }

  useEffect(() => {
    const mesSelect = selected.split('-')[1]
    const diaSelect = selected.split('-')[2]
  
    const listaSelecionada = listaDeAniversarios.filter((item : any) => {
      const [dia, mes] = item.data.split('/')
      return dia === diaSelect && mes === mesSelect;
    });
    setListSelected(listaSelecionada);

    const response = encontrarIndicePorData(listaDeAniversarios, `${diaSelect}/${mesSelect}`)
    if (response !== -1) {
      scrollToIndex(response)
    }
  }, [selected]);

  useEffect(() => {
    loadAniversarios();
  }, []);

  useEffect(() => {
    setTimeout(() => {
    const scrollAteProximoAniversario = async () => {
      try {
        const listaDeAniversarios = await getListaDeAniversarios();
        
        if (listaDeAniversarios.length === 0) {
          return;
        }
  
        const hoje = new Date();
        let proximoAniversario = null;
  
        for (const aniversario of listaDeAniversarios) {
          const [dia, mes] = aniversario.data.split('/').map(Number);
          const dataAniversario = new Date(hoje.getFullYear(), mes - 1, dia);
          
          if (dataAniversario.toDateString() === hoje.toDateString()) {
            proximoAniversario = aniversario;
            break;
          }
        }
  
        if (!proximoAniversario) {
          proximoAniversario = listaDeAniversarios.find((aniversario: any) => {
            const [dia, mes] = aniversario.data.split('/').map(Number);
            const dataAniversario = new Date(hoje.getFullYear(), mes - 1, dia);
            return dataAniversario >= hoje;
          });
        }
  
        if (proximoAniversario) {
          const index = listaDeAniversarios.indexOf(proximoAniversario);
          flatListRef.current.scrollToIndex({ index, animated: true });
        }
      } catch (error) {
        console.error('Erro ao rolar até o próximo aniversário:', error);
      }
    };
  
    scrollAteProximoAniversario();
  }, 1000);
  }, []);

  return(
    <>
    <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 25}}>
      <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}><View style={{width: 50, height: 130, backgroundColor: 'white', marginLeft: 16, marginRight: 8, borderRadius: 8, alignItems: 'center', justifyContent: 'center'}}><MaterialCommunityIcons name="plus" color={'black'} size={32}/></View></TouchableOpacity>
      
      <FlatList
      ref={flatListRef}
      data={proximosAniversarios(listaDeAniversarios, 365)}
      renderItem={({item} : any) => (
        <FlatListComponent name={item.nome} date={item.data} onLongPress={() => mostrarAlerta(item.nome)}/>
      )}
      showsHorizontalScrollIndicator={false}
      ItemSeparatorComponent={() => (
        <View style={{width: 10}}></View>
      )}
      ListFooterComponent={() => (
        <View style={{width: 20, height: 100}}/>
      )}
      ListEmptyComponent={() => (
        <Text style={{color: 'gray', alignSelf: 'center', marginLeft: 8}}>Não possui nenhum aniversario registrado.</Text>
      )}
      horizontal
      bounces
      pagingEnabled
      />
    </View>

    <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <View style={{ backgroundColor: 'white', width: 350, height: 400, borderRadius: 10 }}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginHorizontal: 16}}>
              <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}><MaterialCommunityIcons name="close" size={20} color={'black'}/></TouchableOpacity>
              <Text style={{textTransform: 'uppercase', fontWeight: 'bold', fontSize: 16}}>Adicionar aniversario</Text>
              <MaterialCommunityIcons name="close" size={20} color={'white'}/>
            </View>
            <View style={{marginTop: 40,marginHorizontal: 16}}>
              <Text style={{fontWeight: 'bold'}}>NOME DO ANIVERSARIANTE:</Text>
              <TextInput onChangeText={setNomeAnv} style={{borderWidth: 2, borderColor: 'gray', padding: 12, marginTop: 6, borderRadius: 8, color: 'gray'}}/>
            </View>
            <View style={{marginTop: 20,marginHorizontal: 16}}>
              <Text style={{fontWeight: 'bold', textAlign: 'center'}}>DATA DO ANIVERSARIO:</Text>
              <TextInput onChangeText={setDataAnv} textAlign="center" placeholder="01/01" placeholderTextColor={'#cfcfcf'} maxLength={5} style={{borderWidth: 2, borderColor: 'gray', padding: 12, marginTop: 6, borderRadius: 8, fontSize: 32, fontWeight: 'bold', marginHorizontal: 64}}/>
            </View>
            <View style={{justifyContent: 'center', alignItems: 'center', marginTop: 40}}>
              <TouchableOpacity onPress={handleAdicionar}><View style={{borderColor: 'black', borderWidth: 2, borderRadius: 6, width: 200, height: 50, justifyContent: 'center', alignItems: 'center'}}><Text style={{fontSize: 16, fontWeight: 'bold', color: 'black'}}>ADICIONAR</Text></View></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    <View>
      <Calendar
        style={{marginTop: 25, borderRadius: 8, marginLeft: 16, marginRight: 16}}
        onDayPress={(day: any) => {
          setSelected(`${day.year.toString()}-${day.month < 10 ? `0${day.month.toString()}` : `${day.month.toString()}`}-${day.day < 10 ? `0${day.day.toString()}` : `${day.day.toString()}`}`);
        }}
        theme={{
          backgroundColor: '#181818',
          calendarBackground: '#2c2c2c',
          textSectionTitleColor: '#FFF',
          selectedDayBackgroundColor: '#FFF',
          selectedDayTextColor: '#FFF',
          todayTextColor: 'orange',
          dayTextColor: 'gray',
          textDisabledColor: 'gray',
          monthTextColor: '#FFF',
          arrowColor: '#FFF',
        }}
        markedDates={markedDates}
      />
                <View style ={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 16, marginTop: 8, marginRight: 250}}>
            <TouchableOpacity onPress={() => setModalImport(true)}><Text style={{color: 'gray', marginRight: 24}}><MaterialCommunityIcons name='download'/> Importar</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => handleExport()}><Text style={{color: 'gray'}}><MaterialCommunityIcons name='share'/> Exportar</Text></TouchableOpacity>
          </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalImport}
          onRequestClose={() => {
            setModalImport(!modalImport);
          }}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ backgroundColor: 'white', width: 350, height: 350, borderRadius: 10 }}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginHorizontal: 16}}>
                <TouchableOpacity onPress={() => setModalImport(!modalImport)}><MaterialCommunityIcons name="close" size={20} color={'black'}/></TouchableOpacity>
                <Text style={{textTransform: 'uppercase', fontWeight: 'bold', fontSize: 16}}>Importar</Text>
                <MaterialCommunityIcons name="close" size={20} color={'white'}/>
              </View>
              <View>
                <TextInput multiline onChangeText={setTextImport} style={{borderWidth: 2, borderColor: 'gray', marginTop: 16, borderRadius: 8, color: 'gray', height: 200, marginHorizontal: 16, textAlign: 'left', textAlignVertical: 'top', padding: 12}}/>
                <TouchableOpacity onPress={handleImport}><View style={{borderWidth: 2, borderColor: 'gray', padding: 12, alignItems: 'center', justifyContent: 'center', marginHorizontal: 84, marginTop: 20, borderRadius: 8}}><Text style={{fontWeight: 'bold', color: 'gray'}}><MaterialCommunityIcons name='download' color={'gray'}/> IMPORTAR</Text></View></TouchableOpacity>
              </View>
            </View>
          </View>

        </Modal>
    </View>
    </>
  )
}