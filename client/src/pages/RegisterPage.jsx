import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const navigate = useNavigate();

	const handleRegister = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post("http://localhost:5000/api/users/register", {
				email,
				password,
			});
			setMessage(res.data.message);
			// Redirect to login page after successful registration
			navigate("/login");
		} catch (err) {
			setMessage("Registration failed");
			console.error(err);
		}
	};

	return (
		<div className="flex items-center justify-center h-screen p-4 bg-zinc-100 md:p-0">
			<div className="p-8 bg-white rounded-md shadow-md w-96">
				<h2 className="mb-8 text-3xl font-bold text-center text-zinc-800">Register</h2>
				<form onSubmit={handleRegister} className="max-w-md mx-auto">
					<div className="mb-4">
						<label htmlFor="email" className="block mb-2 font-medium text-zinc-700">
							Email
						</label>
						<input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border border-gray-300 rounded" required />
					</div>
					<div className="mb-4">
						<label htmlFor="password" className="block mb-2 font-medium text-zinc-700">
							Password
						</label>
						<input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border border-gray-300 rounded" required />
					</div>
					<button type="submit" className="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
						Register
					</button>
				</form>
				{message && <p className="mt-4 text-center text-red-500">{message}</p>}
			</div>
		</div>
	);
};

export default RegisterPage;
