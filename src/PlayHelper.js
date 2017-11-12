import ApiHelper from './BggApiHelper';
import _ from 'lodash';

const MAX_PLAY_PAGES = 10;

const PlayHelper = {
  allPlayDataAsync(gameId) {
    return new Promise(function(resolve, reject) {
      let pagesCompleted = 0;
      let plays = [];
      for (let p = 1; p <= MAX_PLAY_PAGES; p++) {
        ApiHelper.playsById(gameId, p).then((r) => {
          const result = r.query.results;
          if (result && result.plays) {
            const page = result.plays;
            plays = _.concat(plays, page.play);
          }

          if (++pagesCompleted === MAX_PLAY_PAGES) {
            resolve(PlayHelper.agregatePlayData(plays));
          }
        });
      }
    });
  },

  allPlayData(gameId) {
    return new Promise(function(resolve, reject) {
      PlayHelper.collectPlays([], Number.MAX_VALUE, gameId, 1, MAX_PLAY_PAGES, (plays) => {
        let data = PlayHelper.agregatePlayData(plays);

        resolve(data);
      });
    });
  },

  collectPlays(plays, total, gameId, pageNum, maxPages, callback) {
    ApiHelper.playsById(gameId, pageNum).then((r) => {
      const result = r.query.results;
      if (result && result.plays) {
        const page = result.plays;
        total = page.total;
        plays = _.concat(plays, page.play);
      }

      if (plays.length === total || pageNum === maxPages) {
        callback(plays);
      } else {
        this.collectPlays(plays, total, gameId, pageNum + 1, maxPages, callback);
      }
    });
  },

  agregatePlayData(plays) {
    const scores = {
      total: {
        all: [],
        win: []
      }
    };

    const createScoreArrays = function(scores, key) {
      if (!scores[key]) {
        scores[key] = {
          all: [],
          win: []
        };
      }
    };

    _.each(plays, (play) => {
      if (play && play.players) {
        const players = play.players.player;
        _.each(players, (player) => {
          const score = parseInt(player.score, 10);
          if(!!score) {
            const key = players.length.toString();
            createScoreArrays(scores, key);
            scores.total.all.push(score);
            scores[key].all.push(score);
            if (player.win === "1") {
              scores.total.win.push(score);
              scores[key].win.push(score);
            }
          }
        });
      }
    });

    return {
      scores: scores
    };
  }
};

export default PlayHelper;
