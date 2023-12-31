/* eslint-disable prettier/prettier */
import React from 'react';
import { Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import { moderateScale } from '../../helpers/ResponsiveFonts';

const ButtonComponent = props => {
  const { buttonText, onButtonPress, buttonDisable, shadowEffect } = props;
  const buttonColor =
    buttonDisable === true
      ? shadowEffect === true
        ? colors.purpal
        : colors.LightBlue
      : colors.purpal;
  return (
    <TouchableOpacity
      disabled={buttonDisable}
      onPress={onButtonPress}
      style={[styles.buttonView, { backgroundColor: buttonColor }]}>
      <Text style={styles.buttonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

export default ButtonComponent;

const styles = StyleSheet.create({
  buttonView: {
    borderRadius: 12,
  },
  buttonText: {
    color: colors.White,

    fontSize: moderateScale(16),
    fontWeight: '700',
    lineHeight: 18,
    paddingVertical: moderateScale(17.5),
    textAlign: 'center',
  },
});
