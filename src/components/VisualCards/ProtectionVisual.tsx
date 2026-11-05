import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = Math.min(width * 0.82, 310);

const onboarding4Image = require('../../../assets/images/onboarding_4.png');

export const ProtectionVisual: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image
        source={onboarding4Image}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
  },
});
