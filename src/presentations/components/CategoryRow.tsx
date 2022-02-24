import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TouchableOpacityProps,
} from 'react-native';
import {useTheme, Text, Surface} from 'react-native-paper';
import {Category} from '../../data/models';
import {numberToCurrency, responsiveWidth} from '../../helpers';
import {CurrencyContext} from '../contexts';
import AppColorPicker from './AppColorPicker';

type Props = {
  category: Category;
} & TouchableOpacityProps;

const CategoryRow = ({category, onPress}: Props) => {
  const {currency} = React.useContext(CurrencyContext);
  const {colors, fonts} = useTheme();

  return (
    <TouchableOpacity onPress={onPress}>
      <Surface style={styles.container}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <AppColorPicker
            icon={category.icon}
            color={category.color!}
            size={responsiveWidth(10)}
          />
          <View style={styles.textContainer}>
            {category && (
              <Text
                numberOfLines={2}
                style={{
                  letterSpacing: 1,
                }}>
                {category.name}
              </Text>
            )}
            <Text
              numberOfLines={2}
              style={{...fonts.medium, color: colors.disabled}}>
              {category.count} Transactions
            </Text>
          </View>

          <View style={{alignItems: 'flex-end'}}>
            <Text style={{color: colors.notification}}>
              {numberToCurrency(Number(category.totalExpense), currency)}
            </Text>
            {category.totalIncome > 0 && (
              <Text style={{color: colors.success}}>
                {numberToCurrency(Number(category.totalIncome), currency)}
              </Text>
            )}
          </View>
          {/* <Icon
            name="chevron-right"
            size={16}
            style={{marginLeft: 10}}
            color={colors.text}
          /> */}
        </View>
      </Surface>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingHorizontal: 10,
    padding: 8,
  },
  textContainer: {
    marginRight: 20,
    flex: 1,
  },
  amountContainer: {
    paddingRight: 10,
  },
  line: {
    marginRight: 10,
    width: 2,
    height: 24,
  },
});

export default CategoryRow;
