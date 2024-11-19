# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```

FOLDER STRUCTURE AND GENERAL INFO

- FOLDER STRUCTURE: types for api call under schemas and general defines for typescript is under types folder. in small component where the types only has to be defined in that componen it will stay in that file. yup validation is located in the component or a own file inside the folder of the component.

- MESSAGE COMPONENT: Using Alert instead of the Message component for all messages that don't require a timer to clear. This simplifies the code where messages are static and don't need to be dismissed automatically.

- GEOCODING: I decided to build the geocoding query using available location details (address, city, country, continent) to get accurate lat/lng. This was necessary because the API has a mix of venues with incomplete and inconsistent location info.
- The CreateVenueModal and EditVenueModal use a button to trigger geocoding manually, reducing unnecessary API calls. In a scenario with free or unlimited geocoding, this button wouldn't be needed, and geocoding could happen automatically.

- API CALLS/ API HOOKS: Is used in specific page, but also accessed directly in modal components

EXPLORE COMPONENT
- i am storing location data in sessionStorage, and when hover it will check locations is the same as in sessionstorage, if not it will make a new api call and change it with the current location. i know this is not the best way, but for client side handling i made this decision.
- Filtering by continent fetches all venues because the API doesn’t support continent-specific filtering. If it did, we wouldn’t need to fetch everything. I chose not to add more client-side filtering logic since the Explore component is already complex and full of code.
- explore component use <Googlemaps> for further implementation on map (see all venues from the api)

VENUE DETAILS COMPONENT

- I kept image-related code (and modal) here for simplicity( and bcs its only used here ), but if the page grows i would move it to a separate component for readability. 
- this file also contain a lot of code, so i could made smaller components inside venueDetails forlder, but i kept it in this file with comments.









General 
- gå igjennom modals de har lik message nå, men lag kommentarer.
- modal for geocoding. fix location og finn ut en måte sånn at geocoding ikke blir triggered hele tiden. 
- sjekk om geocoding fortsatt fungerer på explore og venueDetails



venueDetails 
- meet the owner link to myprofile

