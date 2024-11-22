import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTodos, addTodo, updateTodo, deleteTodo, Todo } from '@/api/todoService';
import styles from '../style/TodoList.module.scss';

export const TodoList: React.FC = () => {
  const [newTask, setNewTask] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditTask, setCurrentEditTask] = useState<Todo | null>(null);
  const queryClient = useQueryClient();

  const { data: todos = [], isLoading } = useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: getTodos,
  });

  const addTodoMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      setNewTask('');
    },
  });

  const updateTodoMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });

  const handleAddTodo = () => {
    if (newTask.trim()) {
      addTodoMutation.mutate({ title: newTask });
    }
  };

  const openEditModal = (task: Todo) => {
    setCurrentEditTask(task);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentEditTask(null);
  };

  const handleEditSave = () => {
    if (currentEditTask) {
      updateTodoMutation.mutate({
        id: currentEditTask.id,
        title: currentEditTask.title,
      });
      closeEditModal();
    }
  };

  if (isLoading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1>Let’s Get Things Done!</h1>
      <p>One Step Closer to Your Goals</p>
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Create new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={handleAddTodo} className={styles.addButton}>
          Add
        </button>
      </div>
      <ul className={styles.todoList}>
        {todos.map((todo) => (
          <li key={todo.id} className={styles.todoItem}>
            <label>
              <input
                type="checkbox"
                defaultChecked={false}
                onChange={() =>
                  updateTodoMutation.mutate({ id: todo.id, title: todo.title })
                }
              />
              {todo.title}
            </label>
            <div>
              <button onClick={() => openEditModal(todo)} className={styles.editButton}>
                ✏️
              </button>
              <button
                onClick={() => deleteTodoMutation.mutate(todo.id)}
                className={styles.deleteButton}
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>

      {isEditModalOpen && currentEditTask && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <h2>Edit Task</h2>
            <input
              type="text"
              value={currentEditTask.title}
              onChange={(e) =>
                setCurrentEditTask({ ...currentEditTask, title: e.target.value })
              }
            />
            <div className={styles.modalActions}>
              <button onClick={handleEditSave} className={styles.saveButton}>
                Save
              </button>
              <button onClick={closeEditModal} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};