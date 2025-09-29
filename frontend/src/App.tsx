import "./App.css";
import { Home } from "./Home.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "./Login.tsx";

function App() {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Home />
		},
		{
			path: "/login/oauth",
			element: <Login />
		}
	]);

	return (
		<>
			<RouterProvider router={router} />
		</>
	);
}

export default App;
