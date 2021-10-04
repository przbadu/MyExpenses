import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme, Text, Surface} from 'react-native-paper';
import {numberToCurrency} from '../constants';
import {CurrencyContext} from '../store/context';
import {CategoryProps} from '../database/models';

interface _CategoryProps extends CategoryProps {
  count?: number;
  sum?: number;
}

const CategoryRow = ({
  category,
  onPress,
}: {
  category: _CategoryProps;
  onPress: () => void;
}) => {
  const {currency} = React.useContext(CurrencyContext);
  const {colors, fonts} = useTheme();

  return (
    <TouchableOpacity onPress={onPress}>
      <Surface style={styles.container}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              backgroundColor: category.color,
              ...styles.line,
            }}
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

          <Text>{numberToCurrency(Number(category.sum), currency)}</Text>
          <Icon
            name="chevron-right"
            size={16}
            style={{marginLeft: 10}}
            color={colors.text}
          />
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

export {CategoryRow};