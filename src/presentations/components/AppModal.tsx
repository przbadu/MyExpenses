import React from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';

import AppModalHeader from './AppModalHeader';
import {responsiveHeight} from '../../helpers';

const winHeight = Dimensions.get('window').height;

type Props = {
  onClose: () => void;
  visible: boolean;
  heading: string;
  renderContent: () => React.ReactNode;
  transparentAreaHeight?: number | undefined;
} & TouchableWithoutFeedbackProps;

const AppModal = ({
  onClose,
  visible = false,
  heading,
  renderContent,
  transparentAreaHeight = responsiveHeight(20),
}: Props) => {
  const {colors} = useTheme();
  const modalAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const [showModal, setShowModal] = React.useState<boolean>(visible);

  React.useEffect(() => {
    if (showModal) {
      Animated.timing(modalAnimatedValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(modalAnimatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => onClose());
    }
  }, [showModal]);

  const modalY = modalAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [winHeight, transparentAreaHeight],
  });

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={{flex: 1, backgroundColor: colors.disabled}}>
        {/* Transparent Background */}
        <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
          <View style={styles.transparentContainer} />
        </TouchableWithoutFeedback>

        {/* content */}
        <Animated.View
          style={{
            ...styles.contentContainer,
            top: modalY,
            backgroundColor: colors.background,
          }}>
          {/* header */}
          <AppModalHeader label={heading} onPress={() => setShowModal(false)} />

          {/* body */}
          {renderContent()}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  transparentContainer: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
  },
  contentContainer: {
    position: 'absolute',
    left: 0,
    width: '100%',
    height: '100%',
    padding: 10,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default AppModal;
