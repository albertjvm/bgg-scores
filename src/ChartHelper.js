import _ from 'lodash';

const CharHelper = {
  cleanData(values) {
    return this.pruneOutliers(values);
  },

  scaleScores(values) {

  },

  pruneOutliers(values) {
    const mean = this.average(values);
    const stdDev = this.standardDeviation(values);

    return _.reject(values, (v) => {
      return v < (mean - stdDev * 3) || v > (mean + stdDev * 3);
    });
  },

  distributionOf(values) {
    let result = {};
    let maxScore = Number.MAX_VALUE * -1;

    _.each(values, (v) => {
      if (result.hasOwnProperty(v)) {
        result[v]++;
      }
      else {
        result[v] = 1;
        maxScore = Math.max(maxScore, v);
      }
    });

    for (let i = 1; i < maxScore; i++) {
      if (!result.hasOwnProperty(i)) {
        result[i] = 0;
      }
    }

    return _.toPairs(result);
  },

  normalDistributionData(values) {
    const mean = this.average(values);
    const stdDev = this.standardDeviation(values);

    let result = {};

    for(let i = 0; i <= this.max(values); i++) {
      result[i] = this.normalDistributionValue(i, mean, stdDev, values.length);
    }

    return _.toPairs(result);
  },

  stdDevBarsForData(values) {
    const mean = this.average(values);
    const stdDev = this.standardDeviation(values);
    const lineConfig = function(value) {
      return {
        value: value,
        width: 1,
        color: '#666',
        zIndex: 10,
        dashStyle: 'Dash',
        label: {
          text: Math.round(value),
          rotation: 0,
          x: -10,
          y: -5,
          style: {fontSize: '10px'}
        }
      };
    };

    const plotLines = [
      lineConfig(mean),
      lineConfig(mean + stdDev),
      lineConfig(mean - stdDev),
      lineConfig(mean + 2 * stdDev),
      lineConfig(mean - 2 * stdDev),
      lineConfig(mean + 3 * stdDev),
      lineConfig(mean - 3 * stdDev)
    ];
    const plotBands = [
      {
        from: mean - stdDev,
        to: mean + stdDev,
        color: 'rgba(184, 210, 236, 0.2)',
        zIndex: 0
      },
      {
        from: mean - 2 * stdDev,
        to: mean + 2 * stdDev,
        color: 'rgba(184, 210, 236, 0.2)',
        zIndex: 0
      },
      {
        from: mean - 3 * stdDev,
        to: mean + 3 * stdDev,
        color: 'rgba(184, 210, 236, 0.2)',
        zIndex: 0
      }
    ];

    return {
      plotLines: plotLines,
      plotBands: plotBands
    }
  },

  // m = mean, s = standard deviation
  normalDistributionValue(x, m, s, scale) {
    const n = Math.exp(-1 * (Math.pow(x - m, 2) / (2 * Math.pow(s, 2))));
    const p = 1 / (s * Math.sqrt(2 * Math.PI));
    return n * p * scale;
  },

  max(values) {
    return values.reduce((x, y) => {
      return Math.max(x,y);
    }, -1 * Number.MAX_VALUE);
  },

  min(values) {
    return values.reduce((x, y) => {
      return Math.min(x,y);
    }, Number.MAX_VALUE);
  },

  sum(values) {
    return values.reduce((x,y) => {
      return x + y;
    }, 0);
  },

  average(values) {
    return this.sum(values) / values.length;
  },

  standardDeviation(values) {
    const mean = this.average(values);

    return Math.sqrt(
      this.average(
        values.map((v) => {
          return Math.pow(v - mean, 2);
        })
      )
    );
  }
};

export default CharHelper;
