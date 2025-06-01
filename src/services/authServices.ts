import { ID } from "appwrite";
import { account } from "../lib/appwrite";
import { clearUser, setError, setLoading, setUser } from "../store/authSlice";
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
    } catch (error: any) {
      store.dispatch(clearUser());
      store.dispatch(setError(error.message || "Something went wrong"));
      console.log(error);
      return null;
    } finally {
      store.dispatch(setLoading(false));
    }
  },

  async login(email: string, password: string) {
    try {
      store.dispatch(setLoading(true));
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();

      store.dispatch(
        setUser({
          $id: user.$id,
          email: user.email,
          name: user.name,
        }),
      );

      return user;
    } catch (error: any) {
      store.dispatch(clearUser());
      store.dispatch(setError(error.message || "Something went wrong"));
      throw error;
    } finally {
      store.dispatch(setLoading(false));
    }
  },

  async register(name: string, email: string, password: string) {
    try {
      store.dispatch(setLoading(true));
      await account.create(ID.unique(), email, password, name);
      return await this.login(email, password);
    } catch (error: any) {
      store.dispatch(clearUser());
      store.dispatch(setError(error.message || "Something went wrong"));
      throw error;
    } finally {
      store.dispatch(setLoading(false));
    }
  },
  async logOut() {
    try {
      await account.deleteSession("current");
      store.dispatch(clearUser());
    } catch (error: any) {
      store.dispatch(clearUser());
      store.dispatch(setError(error.message || "Something went wrong"));
      throw error;
    }
  },
};
