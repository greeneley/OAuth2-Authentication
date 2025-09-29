import React from "react";
import { Link } from "react-router-dom";

const getOauthGoogleUrl = () => {
	const { VITE_GOOGLE_CLIENT_ID, VITE_GOOGLE_AUTHORIZED_REDIRECT_URI } = import.meta.env;

	const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
	const options = {
		redirect_uri: VITE_GOOGLE_AUTHORIZED_REDIRECT_URI,
		client_id: VITE_GOOGLE_CLIENT_ID,
		response_type: "code",
		access_type: "offline",
		prompt: "consent",
		scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"].join(
			" "
		)
	};

	const qs = new URLSearchParams(options);
	return `${rootUrl}?${qs}`;
};
export const Home: React.FC = () => {
	const oauthURL = getOauthGoogleUrl();
	return (
		<>
			<h1>Login Google</h1>
			<Link to={oauthURL}>Login with Google</Link>
		</>
	);
};
