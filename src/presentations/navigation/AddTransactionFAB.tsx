import {
  NavigationProp,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import React from 'react';
import {Portal, FAB, useTheme, Colors} from 'react-native-paper';
import {TransactionTypeEnum} from '../../data/models';
import {RootStackParamList} from './types';

const AddTransactionFAB = () => {
  const isFocused = useIsFocused();
  const {colors} = useTheme();
  const [open, setOpen] = React.useState(false);
  const {navigate} = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <Portal>
      <FAB.Group
        visible={isFocused}
        color={Colors.white}
        open={open}
        icon={open ? 'close' : 'plus'}
        style={{position: 'absolute', bottom: 80}}
        actions={[
          {
            icon: 'plus',
            label: 'Add Income',
            style: {backgroundColor: colors.success},
            onPress: () =>
              navigate('AddTransaction', {type: TransactionTypeEnum.income}),
          },
          {
            icon: 'minus',
            label: 'Add Expense',
            style: {backgroundColor: colors.error},
            onPress: () =>
              navigate('AddTransaction', {type: TransactionTypeEnum.expense}),
          },
        ]}
        onStateChange={({open}) => setOpen(open)}
      />
    </Portal>
  );
};

export default AddTransactionFAB;