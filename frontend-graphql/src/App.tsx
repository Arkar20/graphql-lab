import type {
    AddTodoData,
    AddTodoVars,
    DeleteTodoData,
    DeleteTodoVars,
    GetTodosData,
    Todo,
    ToggleTodoData,
    ToggleTodoVars,
} from "./types";
import { useMutation, useQuery } from "@apollo/client/react";

import { gql } from "@apollo/client";
import { useState } from "react";

const GET_TODOS = gql`
    query GetTodos {
        todos {
            id
            title
            completed
        }
    }
`;

const ADD_TODO = gql`
    mutation AddTodo($title: String!) {
        addTodo(title: $title) {
            id
            title
            completed
        }
    }
`;

const TOGGLE_TODO = gql`
    mutation ToggleTodo($id: ID!) {
        toggleTodo(id: $id) {
            id
            title
            completed
        }
    }
`;

const DELETE_TODO = gql`
    mutation DeleteTodo($id: ID!) {
        deleteTodo(id: $id)
    }
`;

export default function App() {
    // ✅ Typed useQuery
    const { loading, error, data } = useQuery<GetTodosData>(GET_TODOS);

    // ✅ Typed useMutation
    const [addTodo] = useMutation<AddTodoData, AddTodoVars>(ADD_TODO, {
        refetchQueries: [{ query: GET_TODOS }],
    });

    const [toggleTodo] = useMutation<ToggleTodoData, ToggleTodoVars>(
        TOGGLE_TODO,
        {
            refetchQueries: [{ query: GET_TODOS }],
        }
    );

    const [deleteTodo] = useMutation<DeleteTodoData, DeleteTodoVars>(
        DELETE_TODO,
        {
            refetchQueries: [{ query: GET_TODOS }],
        }
    );

    const [title, setTitle] = useState("");

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div style={{ padding: "20px" }}>
            <h1>🚀 GraphQL Todo App (TypeScript)</h1>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (!title.trim()) return;
                    addTodo({ variables: { title } });
                    setTitle("");
                }}
            >
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter todo"
                />
                <button type="submit">Add</button>
            </form>

            <ul>
                {data?.todos.map((todo: Todo) => (
                    <li key={todo.id} style={{ margin: "10px 0" }}>
                        <span
                            style={{
                                textDecoration: todo.completed
                                    ? "line-through"
                                    : "none",
                                cursor: "pointer",
                            }}
                            onClick={() =>
                                toggleTodo({ variables: { id: todo.id } })
                            }
                        >
                            {todo.title}
                        </span>
                        <button
                            style={{ marginLeft: "10px", color: "red" }}
                            onClick={() =>
                                deleteTodo({ variables: { id: todo.id } })
                            }
                        >
                            ❌
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
