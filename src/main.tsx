import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { App } from "./App";
import theme from "./theme";
import { StoreProvider } from "./store";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<StoreProvider>
			<ChakraProvider theme={theme}>
				<ColorModeScript initialColorMode={theme.config.initialColorMode} />
				<App />
			</ChakraProvider>
		</StoreProvider>
	</React.StrictMode>
);
