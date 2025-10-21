import { proxy, useSnapshot } from 'valtio';

interface AllFlightsDrawerState {
  open: boolean;
}

const state = proxy<AllFlightsDrawerState>({
  open: false,
});

export const useAllFlightsDrawer = () => {
  const snapshot = useSnapshot(state);

  return {
    open: snapshot.open,
    setOpen: (open: boolean) => {
      state.open = open;
    },
  };
};

// Named export to prevent Next.js from treating this as a page component
export default null;
