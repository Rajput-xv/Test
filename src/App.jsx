import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ConfigProvider, Layout, message } from 'antd';
import { fetchTodos, addTodo, updateTodo, deleteTodo } from './api.js';
import TodoList from './components/TodoList';

const { Header, Content, Footer } = Layout;

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={{
        token: {
          colorPrimary: '#1890ff',
        },
      }}>
        <Layout style={{ minHeight: '100vh' }}>
          <Header style={{ background: '#fff', padding: '0 20px' }}>
            <h1>Todo Application</h1>
          </Header>
          <Content style={{ padding: '0 50px' }}>
            <TodoApp />
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Todo App ©{new Date().getFullYear()}
          </Footer>
        </Layout>
      </ConfigProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

function TodoApp() {
  // Access the client
  const queryClient = useQueryClient();

  // Query: Fetch all todos
  const { data: todos = [], isLoading } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
  });

  // Mutation: Add a new todo
  const addMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      message.success('Todo added successfully!');
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError: (error) => {
      message.error('Failed to add todo: ' + error.message);
    },
  });

  // Mutation: Update an existing todo
  const updateMutation = useMutation({
    mutationFn: ({ id, todo }) => updateTodo(id, todo),
    onSuccess: () => {
      message.success('Todo updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError: (error) => {
      message.error('Failed to update todo: ' + error.message);
    },
  });

  // Mutation: Delete a todo
  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      message.success('Todo deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onError: (error) => {
      message.error('Failed to delete todo: ' + error.message);
    },
  });

  // Handlers for CRUD operations
  const handleAddTodo = (todo) => {
    addMutation.mutate(todo);
  };

  const handleUpdateTodo = (id, todo) => {
    updateMutation.mutate({ id, todo });
  };

  const handleDeleteTodo = (id) => {
    deleteMutation.mutate(id);
  };

  return (
    <TodoList
      todos={todos}
      isLoading={isLoading}
      onAdd={handleAddTodo}
      onUpdate={handleUpdateTodo}
      onDelete={handleDeleteTodo}
    />
  );
}

export default App;