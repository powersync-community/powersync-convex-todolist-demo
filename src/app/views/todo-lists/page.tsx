import { NavigationPage } from '@/components/navigation/NavigationPage';
import { TodoListsWidget } from '@/components/widgets/TodoListsWidget';
import { Box } from '@mui/material';

/** Main todo-list board route showing active lists grouped by task status. */
export default function TodoListsPage() {
  return (
    <NavigationPage title="Todo Lists">
      <Box>
        <TodoListsWidget />
      </Box>
    </NavigationPage>
  );
}
