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

FOLDER STRUCTURE

- types for api call and yup is under schemas and general defines for typescript is under types folder. in small component where the types only has to be defined in that componen it will stay in that file.

EXPLORE COMPONENT

- filter by continent fetches all venues (if the api allowed a continent filter i wouldnt have to fetch all venues when change filter by continent, and i decided to not write more code on the client side as the explore component is already filled with code.)
- explore component use <Googlemaps> for further implementation on map (see all venues)

VENUE DETAILS COMPONENT

- I kept image-related code here for simplicity( and bcs its only used here ), but if the page grows i would move it to a separate component for readability. 







venuedetials
- go thourgh code in venuedetails and calander component
- details page align meet the owner and venueFeatures?

overall
- loading and error component for all pages? venuedetails and explore? 

Explore 
- check location sessionstorage when update a venue. will it fetch the old sessionstroage lat. lng. or fetch new. if not fetch new, fix it. 