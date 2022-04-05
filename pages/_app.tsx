import type { AppProps } from 'next/app';
import { CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import store from '../app/store';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <CssBaseline />
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
