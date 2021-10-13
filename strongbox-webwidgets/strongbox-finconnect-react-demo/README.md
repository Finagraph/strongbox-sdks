# FinConnect Widget - Demo App

  

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and contains some simple modifications to help you understand how to use the **FinConnect Widget**.

  

# IMPORTANT

  

The sample contained in this project illustrates making calls to the Strongbox service to generate secure access tokens. DO NOT EXPOSE THOSE CREDENTIALS AS IS DONE IN THIS DEMONSTRATION APP. THOSE CREDENTIALS SECURE YOUR ACCESS TO STRONGBOX AND ANYONE WHO POSSESSES THEM CAN ACCESS STRONGBOX ON YOUR BEHALF. THE CODE SHOWN BELOW FOR CREATING SECURITY TOKENS SHOULD BE EXECUTED ON A SERVER OWNED BY THE PARTNER WHERE SECURE ACCESS TO CREDENTIALS CAN BE PROVIDED SUCH AS THROUGH MICROSOFT AZURE KEYVAULT OR SIMILAR SERVICES.

  

# Overview
 

This sample code demonstrates how to use the **FinConnect Widget** component that guides a user through the process of connecting Strongbox to their accounting system such that it can gather their financial information from the accounting system and provide analysis of that data to a financial institution partnered with Finagraph.

**IMPORTANT:** The code comes in 2 subdirectories. The first subdirectory (finconnect-react) contains the actual code for the Strongbox widget. The second (finconnect-react-demo) is the code that presents a sample application using the widget. By default the demo application is configured to use a version of the widget accessible through npm.  There is a '.npmrc' file checked into the demo directory that allows for loading this package from its current location.

The model above facilitates deploying the widget to a publicly available site. You can also use the locally built version of the widget included in the finconnect-react subdirectory which is likely easier if you are trying to step through the widget and observe what it's doing locally.   To do that, load finconnect-react-demo/package.json and replace the following:

    "@finagraph/strongbox-react": "^0.1.90",
   
with:

    "@finagraph/finconnect-react": "file:../finconnect-react",

After this you can run `npm run build` in each of the subdirectories starting with finconnect-react.   After that `npm start` in the finconnect-react-demo should launch the demo application running locally.

Using the widget is straight-forward and divided in to two parts. The first step is to generate an access token. This token is generated for an organization that has partnered with Finagraph and has received a carefully guarded clientId and clientSecret that identifies the partner to Strongbox.
 
In the code below `componentDidMount` is devoted exclusively to this first step. Once you add your partner credentials, it uses those to generate an access token and once generated stores it in state for the App component. That code has a number of 'console.log' messages sprinkled throughout so you can follow the progress in the browser developer tools.

  

The second step is to simply include the React component in your code. The render method is devoted to showing what a simple credit application with the react component might look like. When the user presses the button to connect their financial records they are allowed to choose from the supported accounting packages and connect Strongbox to their financial records.

  

The majority of the code in render is devoted to showing a sample application. The `StrongboxFinConnect` component is imported from the component module and completely contained within `<StrongboxFinConnect...` in render.

  

In this sample application the component is not displayed until a delegated access token has been created and is simply not present. An actual consumer is of course free to do this as well or show something that indicates it's loading, etc.

  

There are additional comments about how the component can be branded as well as some samples of how to do that in src\App.js

  

## Available Scripts

  

In the project directory, you can run:

  

### `npm start`

  

Runs the app in the development mode.\

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

  

The page will reload if you make edits.\

You will also see any lint errors in the console.

  

### `npm test`

  

Launches the test runner in the interactive watch mode.\

See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

  

### `npm run build`

  

Builds the app for production to the `build` folder.\

It correctly bundles React in production mode and optimizes the build for the best performance.

  

The build is minified and the filenames include the hashes.\

Your app is ready to be deployed!

  

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.