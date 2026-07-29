import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { PRIORITY_CONFIG } from "@/constants/enums";
import { Priority } from "@/types/task";
import { taskSchema, type TaskFormData } from "@/validation/task.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

interface TaskFormProps {
  defaultValues?: TaskFormData;
  onSubmit: (data: TaskFormData) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

const TaskForm = ({
  defaultValues = { title: "", description: "", priority: Priority.LOW },
  onSubmit,
  submitLabel = "Create Task",
  isSubmitting = false,
  onCancel,
}: TaskFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting: isFormSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues,
  });

  const disabled = isSubmitting || isFormSubmitting;

  return (
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
            <FieldLabel htmlFor="task-description">Description</FieldLabel>
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

      <div className="flex gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={disabled}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={disabled}>
          {disabled ? <Spinner className="mr-2" /> : null}
          {disabled ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
