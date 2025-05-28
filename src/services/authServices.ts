import { ID } from "appwrite";
import { account } from "../lib/appwrite";
import { clearUser, setLoading, setUser } from "../store/authSlice";
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
        })
      );

      return user;
    } catch (error) {
      store.dispatch(clearUser());
      console.log(error);
      return null;
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
        })
      );

      return user;
    } catch (error) {
      store.dispatch(clearUser());
      throw error;
    }
  },

  async register(name: string, email: string, password: string) {
    try {
      store.dispatch(setLoading(true));
      await account.create(ID.unique(), email, password, name);
      return await this.login(email, password);
    } catch (error) {
      store.dispatch(clearUser());
      throw error;
    }
  },
  async logOut() {
    try {
      await account.deleteSession("current");
    } catch (error) {
      store.dispatch(clearUser());
      throw error;
    }
  },
};
