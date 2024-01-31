import React, {useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  Animated,
  Modal,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const AnimatedLoadingModal = ({
  visible,
  text,
}: {
  visible: boolean;
  text: string;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.modalBackground}>
        <Animated.View style={[styles.modalContainer, {opacity: fadeAnim}]}>
          <ActivityIndicator size="large" color="#3498db" />
          {text ? <Text style={styles.loadingText}>{text}</Text> : null}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});

export default AnimatedLoadingModal;
