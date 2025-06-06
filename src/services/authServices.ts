import { ID, AppwriteException } from "appwrite";
import { account } from "../lib/appwrite";
import {
  clearError,
  clearUser,
  setError,
  setLoading,
  setUser,
} from "../store/authSlice";
import { store } from "../store/store";

export const authService = {
  async getCurrentUser() {
    try {
      store.dispatch(setLoading(true));
      const user = await account.get();

      store.dispatch(
        setUser({
          $id: user.$id,
          email: user.email,
          name: user.name,
        }),
      );

      return user;
    } catch (error) {
      if (error instanceof AppwriteException) {
        if (error.code === 401) {
          store.dispatch(clearUser());
          return null;
        }
        store.dispatch(setError(error.message));
      } else {
        store.dispatch(setError("Something went wrong"));
      }

      store.dispatch(clearUser());

      console.log(error);
      return null;
    } finally {
      store.dispatch(setLoading(false));
    }
  },

  async login(email: string, password: string) {
    try {
      store.dispatch(setLoading(true));

      try {
        await account.deleteSession("current");
      } catch (error) {
        console.log(error);
      }

      await account.createEmailPasswordSession(email, password);
      const user = await account.get();

      store.dispatch(
        setUser({
          $id: user.$id,
          email: user.email,
          name: user.name,
        }),
      );

      store.dispatch(clearError());

      return user;
    } catch (error) {
      if (error instanceof AppwriteException)
        store.dispatch(setError(error.message || "Something went wrong"));
      store.dispatch(clearUser());
      throw error;
    } finally {
      store.dispatch(setLoading(false));
    }
  },

  async register(name: string, email: string, password: string) {
    try {
      store.dispatch(setLoading(true));
      try {
        await account.deleteSession("current");
      } catch (error) {
        console.log(error);
      }

      await account.create(ID.unique(), email, password, name);
      store.dispatch(clearError());
      return await this.login(email, password);
    } catch (error) {
      if (error instanceof AppwriteException)
        store.dispatch(setError(error.message || "Something went wrong"));
      store.dispatch(clearUser());
      throw error;
    } finally {
      store.dispatch(setLoading(false));
    }
  },

  async recoverPassword(email: string) {
    try {
      store.dispatch(setLoading(true));
      const recoveryUrl = `${window.location.origin}/auth/reset-password`;
      await account.createRecovery(email, recoveryUrl);

      return {
        success: true,
        message: "Password recovery email sent successfully",
      };
    } catch (error) {
      if (error instanceof AppwriteException) {
        store.dispatch(
          setError(error.message || "Failed to send recovery email"),
        );
      }
      console.log("Password recovery error:", error);

      throw error;
    } finally {
      store.dispatch(setLoading(false));
    }
  },

  async resetPassword(userId: string, secret: string, password: string) {
    try {
      store.dispatch(setLoading(true));

      if (!password.length || password.length < 8) {
        throw new Error("New password must be at least 8 characters long");
      }

      await account.updateRecovery(userId, secret, password);

      return {
        success: true,
        message: "Password updated successfully",
      };
    } catch (error) {
      console.log(error);
      store.dispatch(setError("Failed to reset password!"));

      throw error;
    } finally {
      store.dispatch(setLoading(false));
    }
  },

  async logOut() {
    try {
      await account.deleteSession("current");
      store.dispatch(clearUser());
    } catch (error) {
      if (error instanceof AppwriteException)
        store.dispatch(setError(error.message || "Something went wrong"));
      store.dispatch(clearUser());
      throw error;
    }
  },
};
