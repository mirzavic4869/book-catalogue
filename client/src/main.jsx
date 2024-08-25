import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css"; // Import Tailwind CSS or your styles

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
	<Router>
		<App />
	</Router>
);
