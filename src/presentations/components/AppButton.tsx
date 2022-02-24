import React from 'react';
import {Button} from 'react-native-paper';

type Props = {
  submitting?: boolean;
} & React.ComponentProps<typeof Button>;

export default ({submitting = false, ...props}: Props) => {
  return (
    <Button disabled={submitting} {...props}>
      {submitting ? 'processing...' : props.children}
    </Button>
  );
};
