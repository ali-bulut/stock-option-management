import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ServerAuthentication } from "@/api/Server/ServerAuthentication";

export default function useSession() {
  const queryClient = useQueryClient();

  const loginMutation = useMutation(ServerAuthentication.login, {
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries();
      queryClient.clear();
    },
  });

  const registerMutation = useMutation(ServerAuthentication.register, {
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries();
      queryClient.clear();
    },
  });

  const logoutMutation = useMutation(ServerAuthentication.logout, {
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries();
      queryClient.clear();
    },
  });

  return {
    loginMutation,
    registerMutation,
    logoutMutation,
  };
}
