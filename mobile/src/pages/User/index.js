import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WebView } from 'react-native-webview';
import { ActivityIndicator } from 'react-native';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Loading,
  SubmitWebview,
  TextSubmit,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static PropTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    loading: false,
    page: 2,
    refreshing: false,
    hidden: false,
  };

  async componentDidMount() {
    this.setState({ loading: true });
    const { navigation } = this.props;

    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred`);
    this.setState({ stars: response.data });
  }

  loadMore = async () => {
    const { stars, page } = this.state;
    const { navigation } = this.props;

    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred?page=${page}`);

    if (response.data == '') {
      this.setState({ loading: false });
      return null;
    }
    this.setState({ stars: [...stars, ...response.data], page: page + 1 });
  };

  renderLoading = () => {
    const { loading } = this.state;
    if (!loading) {
      return null;
    }
    return (
      <Loading>
        <ActivityIndicator />
      </Loading>
    );
  };

  refreshList = async () => {
    this.setState({ refreshing: true });
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred`);
    this.setState({ stars: response.data });
    this.setState({ refreshing: false });
  };

  renderWebview = () => {
    const { navigation } = this.props;
    const user = navigation.getParam('user');
    this.setState({ hidden: true });
  };

  render() {
    const { navigation } = this.props;
    const { stars, refreshing, hidden } = this.state;
    const user = navigation.getParam('user');

    if (hidden) {
      return (
        <WebView
          style={{
            margin: 20,
            flex: 1,
          }}
          source={{ uri: user.html }}
        />
      );
    }
    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
          <SubmitWebview onPress={this.renderWebview}>
            <TextSubmit>Visualizar Perfil</TextSubmit>
          </SubmitWebview>
        </Header>
        <Stars
          data={stars}
          keyExtractor={star => String(star.id)}
          onEndReachedThreshold={0.2}
          onEndReached={this.loadMore}
          ListFooterComponent={this.renderLoading}
          onRefresh={this.refreshList}
          refreshing={refreshing}
          renderItem={({ item }) => (
            <Starred>
              <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
              <Info>
                <Title>{item.name}</Title>
                <Author>{item.owner.login}</Author>
              </Info>
            </Starred>
          )}
        />
      </Container>
    );
  }
}
