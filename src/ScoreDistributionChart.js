const React = require('react');
const _ = require('lodash');
const HighCharts = require('highcharts');
import './ScoreDistributionChart.css';
import ChartHelper from './ChartHelper';

const ScoreDistributionChart = React.createClass({
  propType: {
    id: React.PropTypes.string,
    title: React.PropTypes.string,
    scores: React.PropTypes.array
  },

  componentDidMount() {
    const { id, title, scores } = this.props;

    const cleanedScores = ChartHelper.cleanData(scores);
    const data = ChartHelper.distributionOf(cleanedScores);
    const normalData = ChartHelper.normalDistributionData(cleanedScores);
    const plotOptions = ChartHelper.stdDevBarsForData(cleanedScores);
    const keys = data.map(d => parseInt(d[0], 10));

    HighCharts.chart(id, {
      chart: {
        type: 'column'
      },
      credits: {enabled:false},
      legend: {enabled:false},
      plotOptions: {
        series: {
            minPointLength: 1,
            shadow: false,
            marker: {
                enabled: false
            }
        },
        column: {
          pointPadding: 0,
          borderWidth: 0,
          groupPadding: 0,
          shadow: false
        }
      },
      title: {
        text: title
      },
      xAxis: {
        categories: keys,
        plotLines: plotOptions.plotLines,
        plotBands: plotOptions.plotBands
      },
      yAxis: {
        title: {
          text: null
        },
        labels: {
          enabled: false
        }
      },
      series: [
        {
          name: 'Count',
          data: data
        },
        {
          name: 'Normal Distribution',
          type: 'spline',
          lineWidth: 1,
          color: 'red',
          data: normalData
        }
      ]
    });
  },

  render() {
    const { id } = this.props;

    return (
      <div id={id} className="ScoreDistributionChart"></div>
    );
  }
});

export default ScoreDistributionChart;
