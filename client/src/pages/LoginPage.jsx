import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
			localStorage.setItem("token", res.data.token);
			navigate("/books");
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="flex justify-center items-center h-screen bg-zinc-100 p-4 md:p-0">
			<div className="bg-white p-8 rounded-md shadow-md w-96">
				<h2 className="text-2xl font-bold mb-4 text-zinc-800">Login</h2>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block text-zinc-700 mb-2" htmlFor="email">
							Email
						</label>
						<input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border border-zinc-300 rounded appearance-none outline-none" required />
					</div>
					<div className="mb-4">
						<label className="block text-zinc-700 mb-2" htmlFor="password">
							Password
						</label>
						<input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border border-zinc-300 rounded appearance-none outline-none" required />
					</div>
					<button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
						Login
					</button>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;
