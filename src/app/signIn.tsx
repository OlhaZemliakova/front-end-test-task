import React from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../store/store";
import {
	loginFailure,
	loginStart,
	loginSuccess,
} from "../store/slices/authSlice";

const SignInPage: React.FC = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const isAuthenticated = useAppSelector(
		(state) => state.auth.isAuthenticated,
	);

	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [error, setError] = React.useState("");
	const [loading, setLoading] = React.useState(false);

	React.useEffect(() => {
		if (isAuthenticated) navigate("/");
	}, [isAuthenticated, navigate]);

	const validateEmail = (email: string) => {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(email);
	};

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		dispatch(loginStart());
		setLoading(true);
		setError("");

		await new Promise((r) => setTimeout(r, 1000));

		if (!validateEmail(email)) {
			setError("Invalid email format");
			dispatch(loginFailure("Invalid email format"));
			setLoading(false);
			return;
		}

		if (email === "test@test.test" && password === "password") {
			dispatch(
				loginSuccess({
					email: email,
					name: email.split("@")[0],
					id: Math.random(),
					role: "user",
				}),
			);
		} else {
			setError("User not found");
			dispatch(loginFailure("User not found"));
		}
		setLoading(false);
	}

	return (
		<div className="h-screen flex items-center justify-center bg-gray-50">
			<div className="w-full max-w-md">
				<div className="bg-white shadow-md rounded-xl p-8">
					<h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
						Sign In
					</h1>

					<form onSubmit={handleSubmit}>
						<div className="mb-4">
							<label htmlFor="email" className="block text-sm font-medium mb-2">
								Email address
							</label>
							<input
								type="email"
								id="email"
								name="email"
								className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>

						<div className="mb-6">
							<label
								htmlFor="password"
								className="block text-sm font-medium mb-2">
								Password
							</label>
							<input
								type="password"
								id="password"
								name="password"
								className="py-3 px-4 block w-full border border-gray-300 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>

						{error && <div className="text-red-500 mb-4">{error}</div>}

						<button
							type="submit"
							className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
							disabled={loading}>
							{loading ? (
								<span className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent rounded-full" />
							) : (
								"Sign in"
							)}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default SignInPage;