import { proxy, useSnapshot } from 'valtio';

interface FeedbackModalState {
  open: boolean;
}

const state = proxy<FeedbackModalState>({
  open: false,
});

export const useFeedbackModal = () => {
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
