import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";

import { createHandler } from "graphql-http/lib/use/express";
import express from "express";
import { ruruHTML } from "ruru/server";

// In-memory Todo storage
let todos: { id: string; title: string; completed: boolean }[] = [];
let idCounter = 1;

// Define Todo type
const TodoType = new GraphQLObjectType({
  name: "Todo",
  fields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    completed: { type: new GraphQLNonNull(GraphQLBoolean) },
  },
});

// Root Query
const QueryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    todos: {
      type: new GraphQLList(TodoType),
      resolve: () => todos,
    },
  },
});

// Root Mutation
const MutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addTodo: {
      type: TodoType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (_, { title }) => {
        const todo = { id: String(idCounter++), title, completed: false };
        todos.push(todo);
        return todo;
      },
    },
    toggleTodo: {
      type: TodoType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (_, { id }) => {
        const todo = todos.find((t) => t.id === id);
        if (!todo) throw new Error("Todo not found");
        todo.completed = !todo.completed;
        return todo;
      },
    },
    deleteTodo: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (_, { id }) => {
        const index = todos.findIndex((t) => t.id === id);
        if (index === -1) return false;
        todos.splice(index, 1);
        return true;
      },
    },
  },
});

// Construct schema
const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});

// Express App
const app = express();

// GraphiQL Playground
app.get("/", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});

// GraphQL endpoint
app.all(
  "/graphql",
  createHandler({
    schema,
  })
);

app.listen(4000, () => {
  console.log("🚀 GraphQL Todo API running at http://localhost:4000/graphql");
});
