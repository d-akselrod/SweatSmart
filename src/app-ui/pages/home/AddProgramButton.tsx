import {StyleSheet, TouchableOpacity, View} from "react-native";
import React from "react";
import { MaterialIcons } from '@expo/vector-icons';

interface IAddProgramButton {
  onPress: () => void;
}

export const AddProgramButton = (props: IAddProgramButton) => {
  const {onPress} = props;
  return (
    <TouchableOpacity onPress = {onPress}>
      <MaterialIcons name="add-box" size={32} color="#D24A4A" />
    </TouchableOpacity>
  )
}