import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
  label: string;
} & TouchableOpacityProps;

const AppModalHeader = ({label, onPress}: Props) => {
  const {colors} = useTheme();

  return (
    <View style={{...styles.headerContainer}}>
      <Text style={styles.heading}>{label}</Text>
      <TouchableOpacity onPress={onPress}>
        <Icon name="close" color={colors.text} style={{fontSize: 20}} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});

export default AppModalHeader;
