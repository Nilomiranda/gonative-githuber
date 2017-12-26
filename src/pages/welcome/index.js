import React, { Component } from 'react';
import { View,
  Text,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  ActivityIndicator } from 'react-native';
import { NavigationActions } from 'react-navigation';
import PropTypes from 'prop-types';
import api from 'services/api';

import styles from './styles';

export default class Welcome extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      dispatch: PropTypes.func,
    }).isRequired,
  };

  static navigationOptions = {
    header: null,
  };

  state = {
    username: '',
    error: false,
    loading: false,
  };

  // checar se o usuario existe
  checkAndSaveUser = async () => {
    const response = await api.get(`/users/${this.state.username}`);

    if (!response.ok) throw Error();

    // se existir salvamos o usuario salva no storage
    await AsyncStorage.setItem('@Githuber:username', this.state.username);
  };

  navigateToUser = () => {
    // e entao redirecionamos

    if (this.state.username.length === 0) return;

    this.setState({ loading: true, error: false });

    this.checkAndSaveUser()
      .then(() => {
        const { dispatch } = this.props.navigation;

        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'User' }),
          ],
        });

        dispatch(resetAction);
      })
      .catch(() => {
        this.setState({ error: true, loading: false });
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcomeTitle}>Bem-vindo</Text>
        <Text style={styles.welcomeDescription}>
          Para continuar, é necessário que você informe seu usuário no GitHub
        </Text>

        { this.state.error && <Text style={styles.error}>Esse usuário não existe</Text> }

        <TextInput
          autoCapitalize="none"
          autoCorrect={false}
          style={styles.input}
          placeholder="Digite seu usuário"
          onChangeText={(username) => { this.setState({ username }); }}
        />

        <TouchableOpacity style={styles.button} onPress={this.navigateToUser}>
          { this.state.loading
            ? <ActivityIndicator size="small" color="#FFF" />
            : <Text style={styles.buttonText}>Prosseguir</Text>
          }
        </TouchableOpacity>
      </View>
    );
  }
}
