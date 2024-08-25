import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import BookPage from "./pages/BookPage";
import CategoryPage from "./pages/CategoryPage";

function App() {
	return (
		<Routes>
			<Route path="/login" element={<LoginPage />} />
			<Route path="/books" element={<BookPage />} />
			<Route path="/categories" element={<CategoryPage />} />
		</Routes>
	);
}

export default App;
