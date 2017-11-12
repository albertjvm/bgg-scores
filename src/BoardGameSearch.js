const React = require('react');
const _ = require('lodash');
import './BoardGameSearch.css';
import BGG_API from './BggApiHelper';

const SEARCH_DELAY = 300;
const NUMBER_OF_RESULTS_TO_SHOW = 15;

const BoardGameSearch = React.createClass({
  propTypes: {
    onSelect: React.PropTypes.func
  },

  getInitialState() {
    return {
      value: '',
      results: [],
      timer: null,
      selectedGame: null,
      collapsed: true
    };
  },

  handleKeyPress(e) {
    const { selectedGame } = this.state;
    if (e.key === 'Enter') {
      if (selectedGame) {
        this.handleResultClick(selectedGame);
      }
      else {
        this.doExactSearch();
      }
    }
    else if (e.key.length === 1) {
      this.setState({collapsed: false});
    }
  },

  handleKeyDown(e) {
    if (['ArrowDown', 'ArrowUp'].indexOf(e.key) === -1) return;
    e.stopPropagation();

    const { results, selectedGame } = this.state;
    let nextSelection, currentSelection;

    if (!results || !results.length) return;

    if (selectedGame) {
      currentSelection = _.find(results, g => g.id === selectedGame.id);
    }
    if (e.key === 'ArrowDown') {
      if (currentSelection) {
        let index = (results.indexOf(currentSelection) + 1) % results.length;
        nextSelection = results[index];
      }
      else {
        nextSelection = _.first(results);
      }
    }
    else if (e.key === 'ArrowUp') {
      if (currentSelection) {
        let index = (results.indexOf(currentSelection) + results.length - 1) % results.length;
        nextSelection = results[index];
      }
      else {
        nextSelection = _.last(results);
      }
    }

    this.setState({ selectedGame: nextSelection });
  },

  handleInputFocus(e) {
    e.target.select();
    this.setState({collapsed: false});
  },

  handleInputChange(e) {
    e.stopPropagation();

    let { timer } = this.state;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      this.doSearch();
    }, SEARCH_DELAY);


    this.setState({timer: timer, value: e.target.value});
  },

  handleResultClick(game) {
    const { onSelect } = this.props;

    this.setState({value: game.name, collapsed: true});
    onSelect(game);
  },

  doExactSearch() {
    const { value } = this.state;
    const { onSelect } = this.props;

    if (_.isEmpty(value)) {
      return;
    }

    BGG_API.searchExact(value.replace(/ /g, '+')).then((game) => {
      this.clearResults();
      onSelect(game);
    });
  },

  doSearch() {
    const { value } = this.state;

    if (_.isEmpty(value) || value.length < 3) {
      this.clearResults();
      return;
    }

    BGG_API.search(value.replace(/ /g, '+')).then((response) => {
      response.sort(this.compareGames);

      this.setState({
        results: _.take(
          response,
          NUMBER_OF_RESULTS_TO_SHOW
        )
      });
    });
  },

  compareGames(g1, g2) {
    const { value } = this.state;
    const g1StartsWithQuery = g1.name.toLowerCase().startsWith(value.toLowerCase());
    const g2StartsWithQuery = g2.name.toLowerCase().startsWith(value.toLowerCase());
    const g1ContainsColon = g1.name.indexOf(': ') > -1;
    const g2ContainsColon = g2.name.indexOf(': ') > -1;

    if (g1StartsWithQuery && !g2StartsWithQuery) {
      return -1;
    }
    if (g2StartsWithQuery && !g1StartsWithQuery) {
      return 1;
    }
    if (value.indexOf(':') === -1) {
      if (!g1ContainsColon && g2ContainsColon) {
        return -1;
      }
      if (!g2ContainsColon && g1ContainsColon) {
        return 1;
      }
    }

    if (g1.name.length !== g2.name.length) {
      return g1.name.length > g2.name.length ? 1 : -1;
    }

    return g1.yearPublished < g2.yearPublished ? 1 : -1;
  },

  clearResults() {
    this.setState({results: []});
  },

  renderResult(result) {
    const { selectedGame } = this.state;
    const isSelected = selectedGame && result.id === selectedGame.id;
    return (
      <div key={result.id}
           className={`BoardGameSearch--Result ${isSelected ? 'isSelected' : ''}`}
           onClick={this.handleResultClick.bind(this, result)}>

        { `${result.name} (${result.yearPublished})` }
      </div>
    );
  },

  render() {
    const { value, results, collapsed } = this.state;

    return (
      <div className="BoardGameSearch">
        <input
          className="BoardGameSearch--Input"
          value={value}
          placeholder="Search for a board game"
          onChange={this.handleInputChange}
          onFocus={this.handleInputFocus}
          onKeyPress={this.handleKeyPress}
          onKeyDown={this.handleKeyDown}
        />
        { !collapsed && !_.isEmpty(results) &&
          <div className="BoardGameSearch--Results">
            { results.map(r => this.renderResult(r)) }
          </div>
        }
        <div className="Button" onClick={this.doExactSearch}>GO</div>
      </div>
    );
  }
});

export default BoardGameSearch;
