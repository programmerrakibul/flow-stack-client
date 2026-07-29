import Container from "@/components/shared/container";
import Logo from "@/components/shared/logo";
import PasswordInput from "@/components/shared/password-input";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { signIn, useAuthStore } from "@/stores/auth-store";
import { getErrorMessage } from "@/utils/get-error-message";
import { signInSchema, type SignInFormData } from "@/validation/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

const SignInPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (isAuthenticated) {
    navigate("/", { replace: true });
  }

  const onSubmit = async (data: SignInFormData) => {
    try {
      await signIn(data);
      navigate("/dashboard", { replace: true });

      toast.success("Welcome back!", {
        description: "You have been signed in successfully.",
      });
    } catch (err: unknown) {
      const errMsg = getErrorMessage(err);

      toast.error("Sign in failed", {
        description: errMsg || "Invalid credentials.",
      });
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-14 md:py-18">
      <Container className="max-w-sm space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center">
            <Logo />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="sign-in-email">Email</FieldLabel>
                <Input
                  {...field}
                  id="sign-in-email"
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
                <FieldLabel htmlFor="sign-in-password">Password</FieldLabel>
                <PasswordInput
                  {...field}
                  id="sign-in-password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <Spinner className="mr-2" /> : null}
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            to="/sign-up"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </Container>
    </section>
  );
};

export default SignInPage;
