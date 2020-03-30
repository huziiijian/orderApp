import axios from 'axios';

export default function Request(url, params) {
  return axios({
    baseURL: 'https://orderapp1-679d2.firebaseio.com/',
    url: url,
    method: 'get',
    ...params
  });
}
