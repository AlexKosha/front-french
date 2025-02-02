import {NavigationContainer} from '@react-navigation/native';
import React, {Suspense} from 'react';
import {PersistGate} from 'redux-persist/integration/react';
import {Provider} from 'react-redux';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

import {persistor, store} from './src/store/store';
// import {AppNavigator} from './components/AppNavigator';

export default function App(): JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <NavigationContainer>
          <Suspense
            fallback={
              <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
              </View>
            }>
            <SafeAreaView>
              <Text>Hello</Text>
            </SafeAreaView>
          </Suspense>
        </NavigationContainer>
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
