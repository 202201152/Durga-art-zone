// Toast utility to avoid importing in contexts
// This allows toast to work even if react-hot-toast isn't imported in context files

export const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  if (typeof window !== 'undefined') {
    // Dynamic import to avoid SSR issues
    import('react-hot-toast').then(({ default: toast }) => {
      if (type === 'success') {
        toast.success(message);
      } else {
        toast.error(message);
      }
    });
  }
};

