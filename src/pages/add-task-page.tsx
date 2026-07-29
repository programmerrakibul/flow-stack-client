import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { PRIORITY_CONFIG } from "@/constants/enums";
import { useCreateTask } from "@/hooks/use-task";
import { Priority } from "@/types/task";
import { taskSchema, type TaskFormData } from "@/validation/task.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

const AddTaskPage = () => {
  const createTask = useCreateTask();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: Priority.LOW,
    },
  });

  const onSubmit = (data: TaskFormData) => {
    createTask.mutate(data);
    if (createTask.isSuccess) {
      reset();
    }
  };

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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              control={control}
              name="title"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="task-title">Title</FieldLabel>
                  <Input
                    {...field}
                    id="task-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="Bug: Login button not working on mobile"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={control}
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="task-description">
                    Description
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="task-description"
                    aria-invalid={fieldState.invalid}
                    placeholder="Describe the task in detail..."
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={control}
              name="priority"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Priority</FieldLabel>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex gap-4"
                  >
                    {Object.entries(PRIORITY_CONFIG).map(([value, config]) => {
                      const Icon = config.icon;
                      return (
                        <label
                          key={value}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <RadioGroupItem value={value} />
                          <Icon className={`size-4 ${config.color}`} />
                          <span className="text-sm">{config.label}</span>
                        </label>
                      );
                    })}
                  </RadioGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner className="mr-2" /> : null}
              {isSubmitting ? "Creating..." : "Create Task"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTaskPage;
