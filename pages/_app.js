import { Provider } from 'react-redux';
import store from '../redux/store';
import NProgress from "nprogress";
import Router from "next/router";
import '../styles/main.scss';

Router.onRouteChangeStart = url => {
  NProgress.start();
};

Router.onRouteChangeComplete = () => NProgress.done();

Router.onRouteChangeError = () => NProgress.done();

const MyApp = ({ Component, pageProps }) => {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
};

export default MyApp;
