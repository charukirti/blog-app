import { useForm } from "react-hook-form";
import FormField from "./FormField";
import {
  forgotPasswordSchema,
  type ForgotPasswordData,
} from "@/schemas/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { authService } from "@/services/authServices";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

export default function ForgotPassword() {
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data: ForgotPasswordData) => {
    try {
      await authService.recoverPassword(data.email);
      toast.success("Check your email for the reset link");
      navigate("/auth/login");
    } catch (error) {
      toast.error("There was a problem while sending email");
      console.log(error);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormField
        id="email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        register={register("email")}
        error={errors.email}
      />

      <Button className="font-poppins mt-5 w-full cursor-pointer bg-gray-300 text-base font-medium text-gray-800 transition-colors hover:bg-gray-800 hover:text-gray-300 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-gray-100">
        {isSubmitting ? "Sending..." : "Send reset link"}
      </Button>
    </form>
  );
}
