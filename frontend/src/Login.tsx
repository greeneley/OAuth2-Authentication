import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const Login: React.FC = () => {
	let [searchParams] = useSearchParams();
	const navigate = useNavigate();

	useEffect(() => {
		const accessToken = searchParams.get("access_token");
		const refreshToken = searchParams.get("refresh_token");

		localStorage.setItem("access_token", accessToken);
		localStorage.setItem("refresh_token", refreshToken);
		navigate("/");
	}, [searchParams, navigate]);

	return <div>Login</div>;
};
