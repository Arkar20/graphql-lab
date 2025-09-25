import "./App.css";

import { gql } from "@apollo/client";
import reactLogo from "./assets/react.svg";
import { useQuery } from "@apollo/client/react";
import viteLogo from "/vite.svg";

type Location = {
    id: string;
    name: string;
    description: string;
    photo: string;
};

type GetLocationsData = {
    locations: Location[];
};

const GET_LOCATIONS = gql`
    query GetLocations {
        locations {
            id
            name
            description
            photo
        }
    }
`;
function App() {
    const { loading, error, data } = useQuery<GetLocationsData>(GET_LOCATIONS);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message}</p>;

    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img
                        src={reactLogo}
                        className="logo react"
                        alt="React logo"
                    />
                </a>
            </div>
            <h1>Graphql Tutorial</h1>
            <div className="card">
                {data &&
                    data.locations.map(({ id, name, description, photo }) => (
                        <div key={id}>
                            <h3>{name}</h3>
                            <img
                                width="400"
                                height="250"
                                alt="location-reference"
                                src={`${photo}`}
                            />
                            <br />
                            <b>About this location:</b>
                            <p>{description}</p>
                            <br />
                        </div>
                    ))}
            </div>
        </>
    );
}

export default App;
