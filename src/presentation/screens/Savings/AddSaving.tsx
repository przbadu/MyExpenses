import dayjs from 'dayjs';
import React, {useRef} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Appbar, Button, Card, Surface, TextInput} from 'react-native-paper';
import {AppTextInput} from '../../components';
import {useForm} from './useForm';

const AddSaving = ({navigation}: {navigation: any}) => {
  const {form, errors, submitting, handleSubmit, handleFormChange, resetForm} =
    useForm(navigation);

  // refs
  const reqAmtRef = useRef(null);
  const savingAmtRef = useRef(null);
  const availableAmtRef = useRef(null);

  const title = form.title ? `(${form.title})` : '';

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={'Saving'.toUpperCase()} />
      </Appbar.Header>

      <ScrollView>
        <Card style={styles.container}>
          <Card.Title title="Add New Saving" />
          <Card.Content style={{marginBottom: 20}}>
            <AppTextInput
              label="I am saving for"
              placeholder="e.g: Laptop"
              value={form?.title}
              onChangeText={text => handleFormChange({...form, title: text})}
              error={errors?.title}
              right={<TextInput.Affix text={`${255 - form.title?.length}`} />}
              returnKeyType="next"
              onSubmitEditing={() => {
                reqAmtRef.current?.focus();
              }}
              blurOnSubmit={false}
            />

            <AppTextInput
              label={`Total required amount ${title}`}
              placeholder="e.g: 10000"
              value={`${form?.requiredAmount}`}
              style={{marginTop: 10}}
              onChangeText={text =>
                handleFormChange({...form, requiredAmount: Number(text)})
              }
              error={errors?.requiredAmount}
              ref={reqAmtRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                savingAmtRef.current?.focus();
              }}
              blurOnSubmit={false}
            />

            <AppTextInput
              label={`Saving target amount for ${title}`}
              placeholder="e.g: 1000"
              value={`${form?.targetAmount}`}
              style={{marginTop: 10}}
              onChangeText={text =>
                handleFormChange({...form, targetAmount: Number(text)})
              }
              error={errors?.targetAmount}
              right={<TextInput.Affix text="/month" />}
              ref={savingAmtRef}
              returnKeyType="next"
              onSubmitEditing={() => {
                availableAmtRef.current?.focus();
              }}
              blurOnSubmit={false}
            />

            <AppTextInput
              label={`Available saving amount for ${title}`}
              value={`${form.availableAmount}`}
              style={{marginTop: 10}}
              onChangeText={text =>
                handleFormChange({...form, availableAmount: Number(text)})
              }
              right={<TextInput.Affix text={`${dayjs().format('MMM')}`} />}
              ref={availableAmtRef}
              onSubmitEditing={handleSubmit}
            />
          </Card.Content>

          <Card.Actions>
            <Button
              onPress={handleSubmit}
              mode="contained"
              loading={submitting}
              style={{marginRight: 10, marginLeft: 10}}>
              Save
            </Button>
            <Button onPress={() => navigation.goBack()} mode="outlined">
              Cancel
            </Button>
          </Card.Actions>
        </Card>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
});

export {AddSaving};
