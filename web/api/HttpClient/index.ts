import axios from "axios";
import EnvironmentHelper from "@helpers/EnvironmentHelper";
// Adapters
import injectAuthHeadersAdapter from "./injectAuthHeadersAdapter";
// Api Endpoints
import AuthenticationApi from "./api/AuthenticationApi";
import UserApi from "./api/UserApi";

// Defining Server Side Http Client
const serverSideHttpClient = axios.create(
  EnvironmentHelper.defaultAxiosRequestConfiguration()
);
// Defining Client Side Http Client
let browserSideHttpClient = axios.create(
  EnvironmentHelper.defaultAxiosRequestConfiguration()
);

browserSideHttpClient.interceptors.request.use(
  injectAuthHeadersAdapter.onFulfilled,
  injectAuthHeadersAdapter.onRejected
);

// Defining Http Client to be used
const generator = () => {
  return {
    BrowserSide: {
      client: browserSideHttpClient,
      UserApi: UserApi(browserSideHttpClient),
    },
    ServerSide: {
      client: serverSideHttpClient,
      AuthenticationApi: AuthenticationApi(serverSideHttpClient),
      UserApi: UserApi(browserSideHttpClient),
    },
  };
};

export const HttpClient = generator();
