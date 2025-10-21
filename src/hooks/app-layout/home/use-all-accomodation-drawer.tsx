import { proxy, useSnapshot } from 'valtio';

interface AllAccomodationDrawerState {
  open: boolean;
}

const state = proxy<AllAccomodationDrawerState>({
  open: false,
});

export const useAllAccomodationDrawer = () => {
  const snapshot = useSnapshot(state);

  return {
    open: snapshot.open,
    setOpen: (open: boolean) => {
      state.open = open;
    },
  };
};

// Default export to prevent Next.js from treating this as a page component
export default null;
