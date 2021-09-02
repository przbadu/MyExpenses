import React from 'react';
import {
  Modal,
  View,
  Animated,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  GestureResponderEvent,
  TouchableOpacity,
} from 'react-native';
import {Text, useTheme, Portal, Modal as PaperModal} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {darkTheme, lightTheme} from '../constants';

const winHeight = Dimensions.get('window').height;

// modal header
interface ModalHeader {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
}
const ModalHeader: React.FC<ModalHeader> = ({label, onPress}) => {
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

interface AppModalProps {
  onClose: () => void;
  visible: boolean;
  heading: string;
  renderContent: () => React.ReactNode;
  transparentAreaHeight?: number | undefined;
}
const AppModal: React.FC<AppModalProps> = ({
  onClose,
  visible = false,
  heading,
  renderContent,
  transparentAreaHeight = 680,
}) => {
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
    outputRange: [winHeight, winHeight - transparentAreaHeight],
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
          <ModalHeader label={heading} onPress={() => setShowModal(false)} />

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
    paddingBottom: 150,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
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

export {AppModal};
