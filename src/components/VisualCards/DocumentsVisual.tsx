import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = Math.min(width * 0.82, 310);

const onboarding3Image = require('../../../assets/images/onboarding_3.png');

export const DocumentsVisual: React.FC = () => {
  return (
    <View style={styles.container}>
      <Image
        source={onboarding3Image}
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
