import "./index.css";

import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

import { ApolloProvider } from "@apollo/client/react";
import App from "./App.tsx";
import { createRoot } from "react-dom/client";

const client = new ApolloClient({
    link: new HttpLink({ uri: "http://localhost:4000/graphql" }),
    cache: new InMemoryCache(),
});

createRoot(document.getElementById("root")!).render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
);
