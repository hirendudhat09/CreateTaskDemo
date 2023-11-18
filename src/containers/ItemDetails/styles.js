import {StyleSheet} from 'react-native';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import {moderateScale, verticalScale} from '../../helpers/ResponsiveFonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  buttonView: {
    marginTop: moderateScale(30),
    marginHorizontal: '30%',
    justifyContent: 'center',
  },
});

export default styles;
