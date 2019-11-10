import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../services/api';

import Container from '../../components/container';
import { Loading, Owner, IssuesList, ListBox, Page } from './styles';

export default class Repository extends Component {
  PropTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        repository: PropTypes.string,
      }),
    }).isRequired,
  };

  state = {
    repository: {},
    issues: [],
    loading: true,
    issuesState: 'all',
  };

  async componentDidMount() {
    const { match } = this.props;
    const { issuesState } = this.state;
    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: issuesState,
          per_page: 30,
        },
      }),
    ]);

    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  }

  handleChecked = async e => {
    if (e.target.value === 'Todos') {
      this.setState({ issuesState: 'all' });
    } else if (e.target.value === 'Abertos') {
      this.setState({ issuesState: 'open' });
    } else if (e.target.value === 'Fechados') {
      this.setState({ issuesState: 'closed' });
    }
    const { match } = this.props;
    const { issuesState } = this.state;
    const repoName = decodeURIComponent(match.params.repository);

    const [repository, issues] = await Promise.all([
      api.get(`/repos/${repoName}`),
      api.get(`/repos/${repoName}/issues`, {
        params: {
          state: issuesState,
          per_page: 30,
          page: 2,
        },
      }),
    ]);
    this.setState({
      repository: repository.data,
      issues: issues.data,
      loading: false,
    });
  };

  render() {
    const { repository, issues, loading } = this.state;
    const arrayOptions = ['Todos', 'Abertos', 'Fechados'];

    if (loading) {
      return <Loading>Carregando</Loading>;
    }

    return (
      <Container>
        <Owner>
          <Link to="/">Voltar aos repositórios</Link>
          <img src={repository.owner.avatar_url} alt={repository.owner.login} />
          <h1>{repository.name}</h1>
          <p>{repository.description}</p>
        </Owner>
        <ListBox>
          <h2>Listar repositórios:</h2>
          {arrayOptions.map(arrayOption => (
            <div>
              <input
                type="radio"
                name="issue"
                id={arrayOption}
                value={arrayOption}
                onChange={this.handleChecked}
              />
              <label htmlFor={arrayOption}>{arrayOption}</label>
            </div>
          ))}
        </ListBox>
        <Page>
          <button onSubmit={this.handle}>Voltar página</button>
          <button>Pŕoxima Página</button>
        </Page>
        <IssuesList>
          {issues.map(issue => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>
                  {issue.labels.map(label => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssuesList>
      </Container>
    );
  }
}
