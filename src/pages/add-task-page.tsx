import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TaskForm from "@/components/shared/task-form";
import { useCreateTask } from "@/hooks/use-task";

const AddTaskPage = () => {
  const createTask = useCreateTask();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Add Task</h1>
        <p className="text-sm text-muted-foreground">
          Create a new task to track your work.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <TaskForm
            onSubmit={(data) => createTask.mutate(data)}
            submitLabel="Create Task"
            isSubmitting={createTask.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTaskPage;
