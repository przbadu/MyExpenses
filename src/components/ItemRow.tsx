import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {IconButton, Surface, Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AppColorPicker} from '.';
import {Category, Wallet} from '../database/models';
import {numberToCurrency, responsiveWidth} from '../lib';
import {CurrencyContext} from '../store/context';
import ConfirmDialog from './ConfirmDialog';

const ItemRow = ({
  item,
  onEdit,
  onDelete,
  isWallet = false,
}: {
  item: Category | Wallet;
  onEdit: (item: Category | Wallet) => void;
  onDelete: (item: Category | Wallet) => void;
  isWallet?: boolean;
}) => {
  const {colors} = useTheme();
  const {currency} = React.useContext(CurrencyContext);
  const [confirm, setConfirm] = React.useState(false);
  const balance = item.balanceAmount;

  return (
    <TouchableOpacity onPress={() => onEdit(item)}>
      <ConfirmDialog
        visible={confirm}
        title="Confirm Delete"
        label="You are deleting selected item which cannot be recovered after deletion. Are you sure to continue?"
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          onDelete(item);
          setConfirm(false);
        }}
      />

      <Surface style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <AppColorPicker icon={item.icon} color={item.color} />
          <View>
            <Text numberOfLines={2} style={{letterSpacing: 1}}>
              {item.name}
            </Text>
            {isWallet && (
              <Text
                style={{
                  color: balance <= 0 ? colors.notification : colors.success,
                  marginRight: 10,
                }}>
                {numberToCurrency(balance, currency)}
              </Text>
            )}
          </View>
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
            onPress={() => setConfirm(true)}
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
