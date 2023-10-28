
## To run this app

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

This project was also deployed using netlify.
**/ Live link (https://main--velvety-pegasus-30a60c.netlify.app/) /**

### Approach

* API Calls with Axios: Utilized Axios for API calls to easily interact with external data sources, ensuring the efficient retrieval of the required data. Axios's reliability and ease of use in handling HTTP requests makes it a good choice.

* State Management with Redux: Harnessed Redux, a predictable state container, to ensure data consistency and accessibility throughout the application. This centralized approach simplifies the management of complex state and is particularly valuable when data needs to be shared across different components. The use of Redux ensured that data fetched from API calls could be accessed globally, facilitating easy data sharing between components and eliminating the need to pass data through multiple layers.

* Thunks for Asynchronous Actions: To handle asynchronous operations, employed Redux Thunk middleware, which enabled dispatch actions for asynchronous data fetching while maintaining control over the application's flow. This ensured a smooth and predictable user experience.

* Local State management with useState: Used the useState hook from React for managing variables with limited scope, specific to particular components. This approach enhances code readability and keeps the component's logic self-contained. 

* Using TypeScript: Choosing TypeScript over JavaScript enhanced code quality and type safety. TypeScript's type checking and static analysis capabilities helps catch potential issues during development, leading to more robust and maintainable code. TypeScript ensures that the codebase remains well-documented and less error-prone, contributing to long-term maintainability.