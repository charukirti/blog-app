import {
  resetPasswordSchema,
  type ResetPasswordData,
} from "@/schemas/authSchemas";
import { authService } from "@/services/authServices";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import FormField from "./FormField";
import { Button } from "../ui/button";

export default function ResetPassword() {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const [searchParams] = useSearchParams();

  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId || !secret) {
      toast.error("Invalid reset link. Please request a new one");
      navigate("/auth/forgot-password");
    }
  }, [userId, secret, navigate]);

  const onSubmit = async (data: ResetPasswordData) => {
    try {
      const result = await authService.resetPassword(
        userId!,
        secret!,
        data.password,
      );

      if (result.success) {
        navigate("/auth/login");
        toast.success("Password resetted successfully!");
      }
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
      console.log(error);
    }
  };
  return (
    <section className="w-full max-w-md space-y-8">
      <div>
        <h2 className="font-poppins text-center text-3xl font-extrabold dark:text-gray-100">
          Reset your password
        </h2>
      </div>
      <form onClick={handleSubmit(onSubmit)}>
        <FormField
          label="Enter your password"
          type="password"
          showPasswordToggle
          id="reset"
          register={register("password")}
          error={errors.password}
        />
        <Button className="font-poppins w-full cursor-pointer bg-gray-300 text-base font-medium text-gray-800 transition-colors hover:bg-gray-800 hover:text-gray-300 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-100">
          {isSubmitting ? "Reseting..." : "Reset password"}
        </Button>
      </form>
    </section>
  );
}
