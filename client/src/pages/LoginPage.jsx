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
		<div className="flex items-center justify-center h-screen p-4 bg-zinc-100 md:p-0">
			<div className="p-8 bg-white rounded-md shadow-md w-96">
				<h2 className="mb-4 text-2xl font-bold text-zinc-800">Login</h2>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block mb-2 text-zinc-700" htmlFor="email">
							Email
						</label>
						<input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded outline-none appearance-none border-zinc-300" required />
					</div>
					<div className="mb-4">
						<label className="block mb-2 text-zinc-700" htmlFor="password">
							Password
						</label>
						<input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded outline-none appearance-none border-zinc-300" required />
					</div>
					<button type="submit" className="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
						Login
					</button>
				</form>
			</div>
		</div>
	);
};

export default LoginPage;
