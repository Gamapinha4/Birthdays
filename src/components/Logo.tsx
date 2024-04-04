import { Text, View } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons'

export default function Logo() {

  return(
    <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 60}}>
      <MaterialCommunityIcons name="cake-variant-outline" size={98} color={'white'}/>
      <Text style={{fontWeight: 'bold', color: 'white', fontSize: 24}}>BIRTHDAYS</Text>
    </View>
  )
}