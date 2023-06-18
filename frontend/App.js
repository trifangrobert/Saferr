import Routes from "./Routes";
import { NativeBaseProvider } from "native-base";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { theme } from "./Theme";

const App = () => {
	return (
		<Provider store={store}>
			<NativeBaseProvider theme={theme} colorModeManager={theme.colorModeManager}>
				<Routes />
			</NativeBaseProvider>
		</Provider>
	);
};

export default App;
