const React = require('react');
const _ = require('lodash');
import './ScoreView.css';
import BGG_API from './BggApiHelper';
import PlayUtil from './PlayHelper';
import Loader from './Loader';
import ScoreDistributionChart from './ScoreDistributionChart';
import BoardGameSearch from './BoardGameSearch';

const ScoreView = React.createClass({

  getInitialState() {
    return {
      query: '',
      imgSrc: undefined,
      scores: undefined,
      imageLoading: false,
      statsLoading: false
    };
  },

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleGo();
    }
  },

  handleInputFocus(e) {
    e.target.select();
  },

  handleInputChange(e) {
    e.stopPropagation();

    this.setState({query: e.target.value});
  },

  handleGameSelect(game) {
    this.setState({
      imageLoading: true,
      imgUrl: null,
      scores: null
    });

    // BGG_API.searchExact(query.replace(/ /g, '+')).then((response) => {
      BGG_API.gameById(game.id).then((r) => {
        const url = `http:${r.image}`;
        this.setState({
          imgSrc: url,
          imageLoading: false,
          statsLoading: true
        });

        PlayUtil.allPlayDataAsync(game.id).then((data) => {
          this.setState({
            scores: data.scores,
            statsLoading: false
          });
          this.forceUpdate();
        });
      });
    // });
  },

  renderCharts() {
    const { scores } = this.state;

    return (
      <div>
        <div key="total">
          <ScoreDistributionChart
            id='total-win'
            title='All Games - Winning Scores'
            scores={scores.total.win}
          />
          <ScoreDistributionChart
            id='total-all'
            title='All Games - All Scores'
            scores={scores.total.all}
          />
        </div>

        { _.map(scores, (v, k) => {
          if (k === 'total') return null;
          return (
            <div key={k}>
              <ScoreDistributionChart
                id={`${k}-win`}
                title={`${k} Player Games - Winning Scores`}
                scores={v.win}
              />
              <ScoreDistributionChart
                id={`${k}-all`}
                title={`${k} Player Games - All Scores`}
                scores={v.all}
              />
            </div>
          );
        }) }
      </div>
    );
  },

  render() {
    const { imgSrc, imageLoading, statsLoading, scores } = this.state;

    return (
      <div className="ScoreView">
        <BoardGameSearch onSelect={this.handleGameSelect}/>

        <div className="ScoreView--Body">
          { imageLoading && <Loader type="Image" busy={true} /> }
          { imgSrc && <img src={imgSrc} alt="" /> }

          { statsLoading && <Loader type="Stats" busy={true} /> }
          { scores && this.renderCharts() }
        </div>
      </div>
    );
  }
});

export default ScoreView;
