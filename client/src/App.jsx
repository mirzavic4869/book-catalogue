import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import BookPage from "./pages/BookPage";
import CategoryPage from "./pages/CategoryPage";

function App() {
	return (
		<>
			<Header />
			<main className="container mx-auto">
				<Routes>
					<Route path="/register" element={<RegisterPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/books" element={<BookPage />} />
					<Route path="/categories" element={<CategoryPage />} />
					{/* Add other routes here */}
				</Routes>
			</main>
		</>
	);
}

export default App;
