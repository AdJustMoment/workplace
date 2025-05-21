import { useMutation } from "@tanstack/react-query";
import { logout } from "@/services/auth.service";

export function useLogout() {
  return useMutation({ mutationFn: logout });
}
