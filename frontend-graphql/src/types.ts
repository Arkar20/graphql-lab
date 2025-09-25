// types.ts
export type Todo = {
    id: string;
    title: string;
    completed: boolean;
};

export type GetTodosData = {
    todos: Todo[];
};

export type AddTodoData = {
    addTodo: Todo;
};
export type AddTodoVars = {
    title: string;
};

export type ToggleTodoData = {
    toggleTodo: Todo;
};
export type ToggleTodoVars = {
    id: string;
};

export type DeleteTodoData = {
    deleteTodo: boolean;
};
export type DeleteTodoVars = {
    id: string;
};
