import http from './http';
import _ from 'lodash';

const YQL_URL = 'https://query.yahooapis.com/v1/public/yql?q=select * from xml where url="{url}"&format=json';
const BGG_API_URL = 'http://www.boardgamegeek.com/xmlapi2/';

export default {
  get(path, params) {
    const queryString = _.map(params, (v, k) => `${k}=${v}`).join('&');
    const requestUrl = `${BGG_API_URL}${path}?${queryString}`;

    return http.get(YQL_URL.replace('{url}', encodeURIComponent(requestUrl)));
  },

  search(query) {
    return this.get('search', {
      query: query,
      type: 'boardgame'
    })
    .then(function(response) {
      let items = response.query.results.items.item;

      if (!_.isArray(items)) items = [items];

      return items.map((item) => {
        return {
          id: item.id,
          name: item.name.value,
          yearPublished: item.yearpublished && item.yearpublished.value
        }
      });
    });
  },

  searchExact(query) {
   return this.get('search', {
      query: query,
      type: 'boardgame',
      exact: 1
    })
    .then(function(response) {
      let item = response.query.results.items.item;

      if (_.isArray(item)) item = item[0];

      return {
        id: item.id,
        name: item.name.value
      };
    });
  },

  gameById(id) {
    return this.get('thing', {
      id: id,
      stats: 1
    }).then(function(response) {
      let item = response.query.results.items.item;

      if (_.isArray(item)) item = item[0];
      return item;
    });
  },

  playsById(id, page = 1) {
    return this.get('plays', {
      id: id,
      page: page
    }).then(function(response) {
      return response;
    });
  }
};
