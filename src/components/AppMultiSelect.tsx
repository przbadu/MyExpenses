import React from 'react';
import {View} from 'react-native';
import {Button, TextInput} from 'react-native-paper';
import {AppChip} from './AppChip';
import {AppTextInput} from './index';

interface itemProps {
  id: number;
  name: string;
}

const AppMultiSelect = (props: React.ComponentProps<typeof AppTextInput>) => {
  const {options, onSelected, selectedValues} = props;

  const [placeholder, setPlaceholder] = React.useState<string | undefined>();

  const [open, setOpen] = React.useState(false);
  const [keyword, setKeyword] = React.useState<string>('');
  const [value, setValue] = React.useState<string>('');
  const [selected, setSelected] = React.useState<itemProps[]>([]);
  const [data, setData] = React.useState<itemProps[]>([]);

  // Initial page load
  React.useEffect(() => {
    setData(options);

    if (selectedValues) {
      const _selected = options.filter((o: {id: string}) =>
        selectedValues.includes(o.id),
      );
      setSelected(_selected);
    }
  }, []);

  // Filter list of result, if keyword present
  React.useEffect(() => {
    const result = keyword.length > 0 ? filterByNames(keyword) : options;
    setData(result);
  }, [keyword]);

  // selected texts
  React.useEffect(() => {
    updateLabelText();
  }, [selected, selectedValues]);

  function checkedStatus(item: itemProps) {
    const ids = selected.map(i => i.id);
    return ids.includes(item.id);
  }

  function handleItemSelection(item: itemProps) {
    const newItems = selected.includes(item)
      ? selected.filter(i => i.id !== item.id)
      : [...selected, item];

    setSelected(newItems);
  }

  function filterByNames(q: string = '') {
    return options.filter((i: itemProps) =>
      i.name.toLowerCase().includes(q.toLowerCase()),
    );
  }

  function onClose() {
    setOpen(false);
    setKeyword('');
    onSelected(selected);
  }

  function onFocus() {
    setValue('');
    setOpen(true);
  }

  function onBlur() {
    updateLabelText();
  }

  function updateLabelText() {
    if (selected.length === 1 || selected.length === 2) {
      const names = selected.map(i => i.name).join(', ');
      setPlaceholder(names);
      setValue(names);
    } else if (selected.length > 2) {
      const name = selected[0].name;
      const length = selected.length - 1;
      setPlaceholder(`${name} and ${length} others`);
      setValue(`${name} and ${length} others`);
    } else {
      setPlaceholder(props.label);
      setValue('');
    }
  }

  return (
    <>
      <AppTextInput
        underlineColor="transparent"
        showSoftInputOnFocus={false}
        right={<TextInput.Icon name={open ? 'menu-up' : 'menu-down'} />}
        value={keyword.length ? keyword : value}
        onFocus={onFocus}
        onBlur={onBlur}
        onChangeText={text => setKeyword(text)}
        {...props}
        placeholder={placeholder}
      />

      {open && (
        <>
          {/* <Checkbox.Item
            label="Select All"
            status={selectAll ? 'checked' : 'unchecked'}
            onPress={() => setSelectAll(!selectAll)}
          /> */}
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            {data.map((item: itemProps) => (
              <AppChip
                key={`${props.label}-item-${item.id}`}
                selected={checkedStatus(item)}
                style={{margin: 5}}
                onPress={() => handleItemSelection(item)}>
                {item.name}
              </AppChip>
            ))}
          </View>

          <Button onPress={onClose}>Done</Button>
        </>
      )}
    </>
  );
};

export {AppMultiSelect};
