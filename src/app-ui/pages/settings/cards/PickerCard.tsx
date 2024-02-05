import React, { useState } from 'react';
import { Picker, PickerProps } from '@react-native-picker/picker';
import {
  StyleSheet,
  Text,
  Switch,
  View,
  TextInput,
  TextInputProps,
} from 'react-native';

interface IPickerItemProps {
  label: string;
  value: string;
}

interface IPickerCardProps extends PickerProps {
  label: string;
  description?: string;
  placeholder?: string;
  items: IPickerItemProps[];
}

export const PickerCard = (props: IPickerCardProps) => {
  const {
    label,
    description,
    placeholder,
    items,
    selectedValue,
    onValueChange,
  } = props;

  console.log(items.length);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>{label}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      <Picker
        style={styles.picker}
        selectedValue={selectedValue}
        onValueChange={onValueChange}
      >
        {items.map((item, index) => {
          return (
            <Picker.Item
              key={index}
              label={item.label}
              value={item.value}
              style={styles.pickerItem}
            />
          );
        })}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '90%',
    height: 40,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignContent: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  label: {
    fontSize: 18,
  },
  description: {
    color: 'grey',
    fontSize: 12,
  },
  picker: {
    width: 200,
  },
  pickerItem: {
    color: 'blue',
  },
});
