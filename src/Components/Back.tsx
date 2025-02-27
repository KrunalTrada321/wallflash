import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { colors } from '../Styling/colors'
import { scale } from 'react-native-size-matters'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';


const Back = ({ categoryName }: any) => {
     const navigation = useNavigation();

    return (
        <View style={{
            backgroundColor: colors.primary,
            height: scale(60),
            borderBottomLeftRadius: scale(20),
            borderBottomRightRadius: scale(20),
            paddingHorizontal: scale(10),
            alignItems: 'center',
            flexDirection: 'row'
        }}>
        
            <TouchableOpacity activeOpacity={0.5} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={scale(25)} color= {colors.white} />
            </TouchableOpacity>

            <View style={{paddingLeft: scale(10)}}>
            <Text style={{ color: colors.white, textAlign: 'center', fontSize: scale(22) }}>{categoryName}</Text>
            </View>

        </View>
    )
}

export default Back