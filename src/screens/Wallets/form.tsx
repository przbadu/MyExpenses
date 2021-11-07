import React from 'react';
import {ScrollView, View} from 'react-native';
import {
  Button,
  Card,
  Colors,
  IconButton,
  Text,
  useTheme,
} from 'react-native-paper';

import {AppTextInput, AppColorPicker} from '../../components';
import {saveWallet, updateWallet} from '../../database/helpers';
import {Wallet} from '../../database/models';
import {generateColors, responsiveHeight, walletIcons} from '../../lib';

let initialColors: string[] = generateColors();

const Form = ({
  wallet,
  navigation,
}: {
  wallet?: Wallet | undefined;
  navigation: any;
}) => {
  const {colors} = useTheme();
  const [randomColors, setRandomColors] =
    React.useState<string[]>(initialColors);
  const [name, setName] = React.useState<string>('');
  const [balanceAmount, setBalanceAmount] = React.useState(0);
  const [color, setColor] = React.useState<string>(initialColors[0]);
  const [icon, setIcon] = React.useState<string>('cash');
  const [errors, setErrors] =
    React.useState<{name?: string; amount?: string}>();

  React.useEffect(() => {
    if (wallet) {
      setName(wallet.name);
      setColor(wallet.color);
      setIcon(wallet.icon);
      setBalanceAmount(wallet.balanceAmount);
      setRandomColors([...randomColors, wallet.color]);
    }
  }, [wallet]);

  const handleSubmit = async () => {
    if (!name.length) {
      setErrors({...errors, name: 'Name is required'});
    } else {
      if (wallet)
        await updateWallet(wallet, {name, color, icon, balanceAmount});
      else await saveWallet({name, color, icon, balanceAmount});
      setName('');
      setIcon('cash');
      setErrors({name: undefined});
      goBack();
    }
  };

  const goBack = () => navigation.navigate('ListWallets', {id: wallet?.id});

  function resetColor() {
    const _colors = generateColors();
    setRandomColors(_colors);
  }

  return (
    <ScrollView>
      <Card style={{marginBottom: responsiveHeight(10), marginTop: 10}}>
        <Card.Content>
          <AppTextInput
            placeholder="Enter wallet name"
            value={name}
            onChangeText={text => setName(text)}
            error={errors?.name}
          />
          <AppTextInput
            placeholder="Enter opening balance"
            value={balanceAmount.toString()}
            onChangeText={text => setBalanceAmount(Number(text))}
            error={errors?.amount}
          />

          <View style={{marginTop: 20}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text>Choose a color</Text>
              <IconButton
                icon="refresh"
                color={colors.primary}
                onPress={resetColor}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: 10,
                flex: 1,
              }}>
              {randomColors.map(c => (
                <AppColorPicker
                  key={c}
                  selected={color === c}
                  color={c}
                  onPress={() => setColor(c)}
                />
              ))}
            </View>
          </View>

          <View style={{marginTop: 20}}>
            <Text>Choose an icon</Text>
            <View
              style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 10}}>
              {walletIcons.map(i => (
                <AppColorPicker
                  key={i}
                  color={
                    icon === i ? color || colors.background : Colors.grey800
                  }
                  icon={i}
                  onPress={() => setIcon(i)}
                />
              ))}
            </View>
          </View>
        </Card.Content>

        <Card.Actions>
          <Button
            onPress={handleSubmit}
            mode="contained"
            style={{marginRight: 10, marginLeft: 10}}>
            Save
          </Button>
          <Button onPress={goBack} mode="outlined">
            Cancel
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
};

export {Form};
