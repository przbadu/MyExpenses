import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {IconButton, Surface, Text, useTheme} from 'react-native-paper';
import {Category, Wallet} from '../../database/models';

const ItemRow = ({
  item,
  onEdit,
  onDelete,
}: {
  item: Category | Wallet;
  onEdit: (item: Category | Wallet) => void;
  onDelete: (item: Category | Wallet) => void;
}) => {
  const {colors} = useTheme();

  function onPress() {}

  return (
    <TouchableOpacity onPress={onPress}>
      <Surface style={styles.container}>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              ...styles.line,
              backgroundColor: item.color,
            }}
          />
          <Text
            numberOfLines={2}
            style={{
              letterSpacing: 1,
            }}>
            {item.name}
          </Text>
        </View>

        <View style={{flexDirection: 'row'}}>
          <IconButton
            icon="pencil"
            size={16}
            color={colors.accent}
            onPress={() => onEdit(item)}
          />
          <IconButton
            icon="trash-can-outline"
            size={16}
            color={colors.error}
            onPress={() => onDelete(item)}
          />
        </View>
      </Surface>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginBottom: 5,
  },
  line: {
    height: 24,
    width: 2,
    marginRight: 10,
  },
});

export {ItemRow};
