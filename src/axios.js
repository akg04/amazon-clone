import axios from "axios";
//axios for fetch and pulll //request
const instance = axios.create({
  baseURL: "http://localhost:5001/fir-4da43/us-central1/api",
  /// The api{cloud function } Url
});

export default instance;
