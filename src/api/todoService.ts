import { customAxios } from './index';

export type Todo = {
  id: string;
  title: string;
};

export const getTodos = async (): Promise<Todo[]> => {
  const { data } = await customAxios.get<Todo[]>('/todos');
  return data;
};

export const addTodo = async (todo: { title: string }): Promise<Todo> => {
  const { data } = await customAxios.post<Todo>('/todos', todo);
  return data;
};

export const updateTodo = async ({
  id,
  title,
}: {
  id: string;
  title: string;
}): Promise<Todo> => {
  const { data } = await customAxios.put<Todo>(`/todos/${id}`, { title });
  return data;
};

export const deleteTodo = async (id: string): Promise<void> => {
  await customAxios.delete(`/todos/${id}`);
};
