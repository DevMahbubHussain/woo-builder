import { createRoot } from "react-dom/client";
import AuthBlock from "./components/AuthBlock";

document.addEventListener("DOMContentLoaded", () => {
	const containers = document.querySelectorAll(".wp-block-mh-auth-block");
	const isUserLoggedIn = document.body.classList.contains("logged-in");

	containers.forEach((container) => {
		if (isUserLoggedIn) {
			container.innerHTML =
				'<div class="auth-logged-in-msg">You are already logged in. <a href="/my-account">Go to Dashboard</a></div>';
			return;
		}

		const root = createRoot(container);
		root.render(<AuthBlock />);
	});
});

// document.addEventListener('DOMContentLoaded', () => {
//     const containers = document.querySelectorAll('.wp-block-mh-auth-block');

//     containers.forEach((container) => {
//         // Read attributes passed from PHP via data attributes if needed
//         const redirectUrl = container.getAttribute('data-redirect') || '';

//         const root = createRoot(container);
//         root.render(
//             <AuthBlock
//                 redirectUrl={redirectUrl}
//                 onSuccess={(data) => console.log('User Authenticated:', data)}
//             />
//         );
//     });
// });
