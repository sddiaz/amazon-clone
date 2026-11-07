# Amazon Clone

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is a full-stack Amazon clone built using modern web technologies. It aims to replicate core Amazon functionalities such as user login/authenticaiton, payments, checkout, order history, some core settings, and more. 

## Demo & Design

*   Here is the [**Live Demo**](https://amazon-clone-lake-pi.vercel.app/)
*   .. And the [**System Design**](https://github.com/user-attachments/assets/55694ab4-1d8f-4674-b6a3-12901a25f222)

*   <img width="1194" height="744" alt="image" src="https://github.com/user-attachments/assets/5736d62e-74a4-4b69-8e7b-aff18ca11e08" />


## Tech Stack

*   **Frontend:** [Next.js](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/), [MUI](https://mui.com/) (rating and select), [Lucide](https://lucide.dev/) icons.
*   **State:** [Redux Toolkit](https://redux-toolkit.js.org/) for auth, user and location state.
*   **Backend:** [Firebase](https://firebase.google.com/) Authentication (email/password and Google) and Firestore. Firestore security rules live in `amazon-clone/firestore.rules`.
*   **Product data:** the public [DummyJSON](https://dummyjson.com/) API (read-only).
*   **Optional:** [Geoapify](https://www.geoapify.com/) reverse geocoding for the delivery location in the navbar.
*   **CI:** GitHub Actions builds, lints and type-checks every push and PR.

## Features

*   Product browsing by category, with search suggestions and recent searches (local storage).
*   Product pages with images, details and reviews. Signed-in users can write reviews.
*   Cart and wishlist management.
*   Demo checkout: places an order and empties the cart. **No payment is taken.**
*   Order history, and an account page with sign out and delete account.
*   Sign up, sign in (email/password or Google) and password reset.
*   Responsive layout from phone to desktop.

Not built yet: category pages (the "See more" links) and a search results page.

## Getting Started

The app lives in the `amazon-clone/` folder.

```bash
git clone https://github.com/sddiaz/amazon-clone
cd amazon-clone/amazon-clone
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No environment variables are required. The Firebase web config is in `src/lib/firebase/config.js` (web API keys are not secrets). Optionally set `GEOAPIFY_APIKEY` in `.env.local` (or in your hosting provider's settings) to show the delivery location.

### Firebase setup (only if you use your own project)

1.  Create a Firebase project and enable Email/Password and Google sign-in, plus Firestore.
2.  Replace the config in `src/lib/firebase/config.js` and the project id in `amazon-clone/.firebaserc`.
3.  Deploy the security rules: `npx firebase login`, then `npx firebase deploy --only firestore:rules`.

### Scripts

*   `npm run dev`: start the dev server. Do not run `npm run build` while it is running, since both write to `.next`.
*   `npm run build`: production build (includes lint and type checks).

## Further Improvements (Things to impress potential employers)

*   **Unit and Integration Tests:** Implement testing with Jest and React Testing Library to ensure code quality and prevent regressions.
*   **E2E Testing:** Add end-to-end tests with Cypress or Playwright for comprehensive testing of user flows.
*   **Advanced State Management:** Consider using Redux, Zustand, or Recoil for more complex state management needs.
*   **Image Optimization:** Implement image optimization techniques for better performance.
*   **Search Functionality with Algolia or ElasticSearch:** Integrate a dedicated search service for improved search relevance and speed.
*   **Product Reviews and Ratings:** Implement a system for users to leave reviews and ratings for products.
*   **Deployment Pipeline (CI/CD):** Set up a CI/CD pipeline with GitHub Actions or similar to automate builds and deployments.
*   **Accessibility (A11y):** Ensure the application is accessible to users with disabilities by following accessibility best practices.
*   **Payment Security Best Practices:** Emphasize secure storage of sensitive information and adherence to PCI DSS standards.
*   **Detailed Documentation:** Provide comprehensive documentation for the codebase, including API documentation.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
