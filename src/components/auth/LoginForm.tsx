import { loginSchema, type LoginFormData } from "@/schemas/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormField from "./FormField";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router";
import { useAppSelector } from "@/store/typedHooks";
import { toast } from "react-toastify";
import { authService } from "@/services/authServices";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();
  const { error } = useAppSelector((state) => state.auth);

  const onSubmit = async (data: LoginFormData) => {
    const { email, password } = data;
    try {
      await authService.login(email, password);
      navigate("/");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.";
      toast.error(errorMessage);
      console.log(error);
    }
  };
  return (
    <section className="w-full max-w-md space-y-8">
      <div>
        <h2 className="font-poppins text-center text-3xl font-extrabold dark:text-gray-100">
          Login to your account
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-6">
        <div className="space-y-4">
          <FormField
            id="email"
            label="Email"
            type="email"
            placeholder="Enter your email address"
            register={register("email")}
            error={errors.email}
          />
          <FormField
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            register={register("password")}
            error={errors.password}
            showPasswordToggle={true}
          />
        </div>

        <Link to={"/auth/forgot-password"} className="font-poppins">
          Forgot Password?
        </Link>

        {error && (
          <div className="text-center text-sm text-red-500">{error}</div>
        )}

        <Button className="font-poppins w-full cursor-pointer bg-gray-300 text-base font-medium text-gray-800 transition-colors hover:bg-gray-800 hover:text-gray-300 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-100">
          {isSubmitting ? "Logging in..." : "Log in"}
        </Button>
      </form>
      <span className="text-center">Don't have an account? <Link to='/auth/register'>Register</Link></span>
    </section>
  );
}
