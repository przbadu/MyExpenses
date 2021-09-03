import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTheme, Text} from 'react-native-paper';

interface AppCalendarPickerInputProps {
  onChange: (event: GestureResponderEvent) => void;
  date?: string;
  time?: string;
  icon?: string;
}
const AppCalendarPickerInput: React.FC<AppCalendarPickerInputProps> = ({
  onChange,
  icon,
  date,
  time,
}) => {
  const {colors} = useTheme();

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: colors.background,
        borderColor: colors.disabled,
      }}>
      {icon && (
        <Icon
          name={icon}
          color={colors.text}
          style={{fontSize: 24, marginRight: 10}}
        />
      )}

      <View style={styles.inputWrapper}>
        <View style={styles.dateTimeWrapper}>
          <TouchableOpacity>
            <Text style={{fontSize: date ? 12 : 20, color: colors.placeholder}}>
              Date
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={{fontSize: date ? 12 : 20, color: colors.placeholder}}>
              Time
            </Text>
          </TouchableOpacity>
        </View>

        {date && (
          <View style={styles.dateTimeWrapper}>
            <TouchableOpacity>
              <Text style={{...styles.text, color: colors.text}}>{date}</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={{...styles.text, color: colors.text}}>{time}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 15,
    padding: 15,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 6,
    borderTopEndRadius: 6,
    borderBottomWidth: 1,
  },
  inputWrapper: {
    flexGrow: 1,
    marginRight: 10,
  },
  text: {
    fontSize: 18,
  },
  icon: {
    fontSize: 24,
  },
  dateTimeWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export {AppCalendarPickerInput};
