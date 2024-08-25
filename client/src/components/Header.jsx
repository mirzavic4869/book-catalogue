import { Link, useNavigate } from "react-router-dom";

const Header = () => {
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/login"); // Redirect to login page
	};

	return (
		<header className="p-4 text-white bg-zinc-800">
			<div className="container flex items-center justify-between mx-auto">
				<h1 className="text-xl font-bold">
					<Link to="/">MaktaBook</Link>
				</h1>
				<nav className="hidden md:flex md:items-center">
					<Link to="/books" className="px-4 hover:underline">
						Books
					</Link>
					<Link to="/categories" className="px-4 hover:underline">
						Categories
					</Link>
					{localStorage.getItem("token") ? (
						<button onClick={handleLogout} className="px-4 py-1.5 bg-red-500 rounded hover:bg-red-600">
							Logout
						</button>
					) : (
						<>
							<Link to="/login" className="px-4 hover:underline">
								Login
							</Link>
							<Link to="/register" className="px-4 hover:underline">
								Register
							</Link>
						</>
					)}
				</nav>
			</div>
		</header>
	);
};

export default Header;
