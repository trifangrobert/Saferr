import Routes from "./Routes";
import { NativeBaseProvider } from "native-base";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store } from "./store/store";
import { theme } from "./Theme";

const App = () => {
  return (
      <Provider store={store}>
        {/* <PersistGate loading={null} persistor={persistor}> */}
          <NativeBaseProvider theme={theme} colorModeManager={theme.colorModeManager}>
            <Routes />
          </NativeBaseProvider>
        {/* </PersistGate> */}
      </Provider>
  );
};

export default App;
