import {StyleSheet} from 'react-native';

export const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  btnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 18,
    marginBottom: 4,
    borderRadius: 100,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: 343,
    height: 51,
    alignSelf: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  btnText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  labelText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  boxInput: {
    width: '100 %',
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 22,
  },

  boxForm: {
    marginBottom: 12,
    padding: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  linkText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  linkBox: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
