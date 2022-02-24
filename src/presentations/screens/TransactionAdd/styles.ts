import { StyleSheet } from 'react-native';
import { responsiveHeight } from '../../../helpers';

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

