import Container from "@/components/shared/container";
import FileUpload from "@/components/shared/file-upload";
import Logo from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import useImageUpload from "@/hooks/use-image-upload";
import { signUp, useAuthStore } from "@/stores/auth-store";
import { signUpSchema, type SignUpFormData } from "@/validation/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { upload: uploadImage, isUploading, progress } = useImageUpload();
  const [imageUrl, setImageUrl] = useState<string>("");
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

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

  if (isAuthenticated) {
    navigate("/", { replace: true });
  }

  const handleFileSelect = useCallback(
    async (file: File) => {
      try {
        const url = await uploadImage(file);
        setImageUrl(url);
      } catch {
        toast.error("Image upload failed", {
          description: "Could not upload image. Please try again.",
        });
      }
    },
    [uploadImage],
  );

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await signUp({
        name: data.name,
        email: data.email,
        password: data.password,
        image: imageUrl || data.image || undefined,
      });

      toast.success("Welcome!", {
        description: "Your account has been created successfully.",
      });
      navigate("/dashboard", { replace: true });
    } catch {
      toast.error("Sign up failed", {
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  const isLoading = isSubmitting || isUploading;

  return (
    <section className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-14 md:py-18">
      <Container className="max-w-sm space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center">
            <Logo />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            control={control}
            name="image"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="sign-up-image">
                  Profile Image (optional)
                </FieldLabel>
                <FileUpload
                  value={imageUrl || field.value}
                  onChange={(v) => {
                    setImageUrl("");
                    field.onChange(v ?? "");
                  }}
                  onFileSelect={handleFileSelect}
                  isUploading={isUploading}
                  className="w-full"
                />
                {progress !== null && (
                  <p className="text-xs text-muted-foreground">
                    Uploading: {progress}%
                  </p>
                )}
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Spinner className="mr-2" /> : null}
            {isLoading ? "Creating account..." : "Sign Up"}
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
