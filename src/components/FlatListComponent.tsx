import { Text, TouchableOpacity, View } from "react-native";
import { formatDate } from "../utils/formatDate";
import { calcularDiasRestantes, ordenarPorData, proximosAniversarios } from "../utils/nextDays";
import { useState } from "react";

type props = {
  name: string
  date: string
  onLongPress: () => void;
}


export default function FlatListComponent({name, date, onLongPress} : props) {

  const dateToday = formatDate(new Date())
  const [selected, setSelected] = useState('')

  return(
    <View>
      <Text style={{marginBottom: 10, fontWeight: 'bold', fontSize: 16, color: 'white', textTransform: 'uppercase'}}>{dateToday === date ? `🎂 Aniversariante de hoje` : `📆 Proximo aniversario de`}</Text>
      <TouchableOpacity onLongPress={onLongPress}>
      <View style={{width: 300, height: 100, backgroundColor: '#2c2c2c', justifyContent: 'center', alignItems: 'center', borderRadius: 6}}>
        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>{name}</Text>
        <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 2}}>
        <Text style={{color: 'white', fontWeight: 'bold'}}>{date}</Text>
          <Text style={{color: 'gray', marginLeft: 8}}>{calcularDiasRestantes(date) === 2 ? "depois de amanha" : calcularDiasRestantes(date) === 1 ? "amanha" : calcularDiasRestantes(date) !== 365 ? `restam ${calcularDiasRestantes(date)} dias` : 'Hoje'}</Text>
        </View>
      </View>
      </TouchableOpacity>
    </View>
  )
}