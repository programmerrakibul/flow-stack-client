import Container from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { signIn } from "@/stores/auth-store";
import { getErrorMessage } from "@/utils/get-error-message";
import { signInSchema, type SignInFormData } from "@/validation/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Zap } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";

const SignInPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

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

  const onSubmit = async (data: SignInFormData) => {
    try {
      await signIn(data);
      navigate("/dashboard/overview", { replace: true });

      toast.create({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
        type: "success",
      });
    } catch (err: unknown) {
      const errMsg = getErrorMessage(err);

      toast.create({
        title: "Sign in failed",
        description: errMsg || "Invalid credentials.",
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
                <div className="relative">
                  <Input
                    {...field}
                    id="sign-in-password"
                    type={showPassword ? "text" : "password"}
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
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
