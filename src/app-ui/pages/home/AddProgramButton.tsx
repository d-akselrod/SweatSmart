import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface IAddProgramButton {
  onPress: () => void;
}

export const AddProgramButton = (props: IAddProgramButton) => {
  const { onPress } = props;
  return (
    <TouchableOpacity onPress={onPress}>
      <MaterialIcons name='add-box' size={25} color='#D24A4A' />
    </TouchableOpacity>
  );
};
