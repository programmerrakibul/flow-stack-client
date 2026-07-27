import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { uploadImage } from "@/lib/upload-image";
import { signUp } from "@/stores/auth-store";
import { signUpSchema, type SignUpFormData } from "@/validation/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Zap } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      image: "",
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      let imageUrl = data.image || undefined;

      if (data.image && data.image.startsWith("blob:")) {
        toast.create({
          title: "Uploading image...",
          type: "loading",
        });
        const response = await fetch(data.image);
        const blob = await response.blob();
        const file = new File([blob], "profile.jpg", { type: blob.type });
        imageUrl = await uploadImage(file, setUploadProgress);
        setUploadProgress(null);
      }

      await signUp({
        name: data.name,
        email: data.email,
        password: data.password,
        image: imageUrl,
      });

      navigate("/dashboard/overview", { replace: true });

      toast.create({
        title: "Welcome!",
        description: "Your account has been created successfully.",
        type: "success",
      });
    } catch {
      setUploadProgress(null);
      toast.create({
        title: "Sign up failed",
        description: "An unexpected error occurred. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
      <Container className="max-w-sm space-y-6">
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-heading text-2xl font-bold"
          >
            <Zap className="size-6 text-primary" />
            Flow Stack
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="sign-up-name">Name</FieldLabel>
                <Input
                  {...field}
                  id="sign-up-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="John Doe"
                  autoComplete="name"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="sign-up-email">Email</FieldLabel>
                <Input
                  {...field}
                  id="sign-up-email"
                  type="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="sign-up-password">Password</FieldLabel>
                <Input
                  {...field}
                  id="sign-up-password"
                  type="password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Min 8 chars, upper, lower, number, symbol"
                  autoComplete="new-password"
                />

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="sign-up-confirm">
                  Confirm Password
                </FieldLabel>
                <Input
                  {...field}
                  id="sign-up-confirm"
                  type="password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Re-enter your password"
                  autoComplete="new-password"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            control={control}
            name="image"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="sign-up-image">
                  Profile Image (optional)
                </FieldLabel>
                <Input
                  {...field}
                  id="sign-up-image"
                  type="file"
                  accept="image/*"
                  aria-invalid={fieldState.invalid}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      field.onChange(url);
                    }
                  }}
                  value={undefined}
                />
                {uploadProgress !== null && (
                  <p className="text-xs text-muted-foreground">
                    Uploading: {uploadProgress}%
                  </p>
                )}
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Spinner className="mr-2" /> : null}
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/sign-in"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </Container>
    </section>
  );
};

export default SignUpPage;
