import { atom, useAtom } from 'jotai';

interface InitialState {
  accessToken?: string;
  isLoggedIn: boolean;
}

const authState = atom<InitialState>({
  accessToken: undefined,
  isLoggedIn: false,
});

export const useAuthStore = () => useAtom(authState);
