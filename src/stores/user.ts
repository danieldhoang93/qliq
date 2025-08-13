import { proxy } from 'valtio';

export const useUser = proxy<{
  user?: any;
}>({
  user: undefined,
});

export function updateUser(user: any) {
  useUser.user = user;
}
