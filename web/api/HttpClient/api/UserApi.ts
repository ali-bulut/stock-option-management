import { Axios } from "axios";
import { IUser } from "@/interfaces/IUser";

const currentUserKey = () => ["currentUser"];

const UserApi = (request: Axios) => ({
  currentUser: {
    fetcher: async () => {
      const response = await request.get<IUser>("/api/v1/users/");
      return response.data;
    },
    key: currentUserKey,
  },
});
export default UserApi;
