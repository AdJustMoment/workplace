import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/services/auth.service";

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });
}
