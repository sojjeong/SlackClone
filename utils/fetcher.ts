import axios from 'axios';

const fetcher = <Data>(url: string) =>
  axios.get<Data>(url, { withCredentials: true }).then((response) => response.data);

export default fetcher;
