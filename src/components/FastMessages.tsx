import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as Clipboard from 'expo-clipboard'


export default function FastMessages() {

  const [data] = useState([{section: "Celebração 🎉", message: "Que este dia seja repleto de alegria e sorrisos, [Nome]! 🎈 Feliz aniversário! 🎉"}, {section: "Amor 💖", message: "Feliz aniversário, [Nome]! Que seu dia seja cheio de amor, paz e momentos especiais ao lado de quem você ama. 💝"}, {section: "Inspiração ✨", message: "Neste dia especial, desejo que você continue sendo uma inspiração para todos ao seu redor. Feliz aniversário, [Nome]! ✨"}, {section: "Agradecimento 🙏", message: "Hoje é o seu dia, [Nome]! Quero aproveitar para agradecer por ser uma pessoa incrível e iluminar nossas vidas. Feliz aniversário! 🎁"}, {section: "Diversão 🎈", message: "Parabéns, [Nome]! Que este dia seja cheio de diversão, risadas e momentos inesquecíveis. Aproveite cada segundo! 🎊"}])


  return(
    <>
    <Text style={{fontSize: 16, color: 'white', marginLeft: 16, marginTop:30, fontWeight: 'bold'}}>📋 MENSAGENS DE EXEMPLO:</Text>
    <View style={{marginTop: 35, marginBottom: 20, alignItems: 'center', justifyContent: 'center'}}>

      {data.map((item) => (
        <TouchableOpacity key={item.message} onPress={() => Clipboard.setString(item.message)}>
          <View style={{marginBottom: 15, height: 100, width: 350, borderColor: 'gray', borderWidth: 2, borderRadius: 8}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 16, marginTop: 8}}>
              <Text style={{color: 'gray'}}>{`${item.section}`}</Text>
              <Text style={{color: 'gray', fontSize: 12, alignSelf: 'flex-end'}}><MaterialCommunityIcons name="clipboard-edit-outline" color={'gray'} size={12}/> COPIAR</Text>
            </View>
            <Text style={{marginTop: 8,marginLeft: 12, color: 'white', fontWeight: 'bold'}}>{`${item.message}`}</Text>
          </View>
        </TouchableOpacity>
      ))}

    </View>
    </>
  )
}