import {NavigationContainer} from '@react-navigation/native';
import React, {Suspense} from 'react';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import {StyleSheet, Text, View} from 'react-native';
import {persistor, store} from './src/store/store';
import {AppNavigator} from './src/components/AppNavigator';
import {LocalizationProvider} from './src/locale/LocalizationContext';
import {AutoProgressUpdater} from './src/helpers/updateProgressInterval';

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
              <AppNavigator />
              <AutoProgressUpdater />
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
