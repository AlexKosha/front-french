import {Image, View, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {selectTheme} from '../store/auth/selector';

export const Logo = ({isThemePage = false}) => {
  const isDarkTheme = useSelector(selectTheme);

  return (
    <View style={styles.container}>
      <Image
        source={
          isThemePage
            ? require('../images/logo.jpg') // Завжди світле лого на сторінці реєстрації
            : isDarkTheme
            ? require('../images/logo-dark.jpg') 
            : require('../images/logo.jpg') 
        }
        style={styles.logo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute', // Це дозволяє зафіксувати елемент внизу екрану
    bottom: 0, // Закріплюємо по нижньому краю
    left: 0, // Для повної ширини екрану
    right: 0, // Це потрібно, щоб компонент займав всю ширину
    alignItems: 'center', // Вирівнюємо логотип по горизонталі
    justifyContent: 'flex-end', // Вирівнюємо по вертикалі до нижнього краю
    paddingBottom: 10, // Можна додати відступ знизу, якщо потрібно
  },
  logo: {
    width: 140, // Ширина логотипу
    height: 60, // Висота логотипу
    resizeMode: 'contain', // Логотип не буде спотворюватись
  },
});
