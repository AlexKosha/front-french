import {NavigationContainer} from '@react-navigation/native';
import React, {Suspense} from 'react';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import {StyleSheet, Text, View} from 'react-native';
import {persistor, store} from './src/store/store';
import {Home, Profile} from './src/screens';
import {AppNavigator} from './src/components/AppNavigator';
// import {Login, Registration} from './src/components';
import {LocalizationProvider} from './src/locale/LocalizationContext';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Registration} from './src/components/Registration';
import {Login} from './src/components/Login';

export default function App(): JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LocalizationProvider>
          <NavigationContainer>
            <Suspense
              fallback={
                <View style={styles.loadingContainer}>
                  <Text>Loading...</Text>
                </View>
              }>
              {/* <Registration /> */}
              {/* <Login /> */}
              {/* <Home /> */}
              {/* <SafeAreaProvider> */}
              <AppNavigator />
              {/* </SafeAreaProvider> */}
            </Suspense>
          </NavigationContainer>
        </LocalizationProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
