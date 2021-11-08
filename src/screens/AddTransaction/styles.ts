import {StyleSheet} from 'react-native';
import {responsiveHeight} from '../../lib';

export const styles = StyleSheet.create({
  container: {
    marginBottom: responsiveHeight(10),
  },
  input: {
    marginBottom: 15,
  },
  incomeExpenseContainer: {
    flexDirection: 'row',
  },
});
