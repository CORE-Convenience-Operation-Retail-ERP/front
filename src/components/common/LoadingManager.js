let setIsLoading = null;

export const loadingManager = {
  register(fn) {
    setIsLoading = fn;
  },
  show() {
    if (setIsLoading) setIsLoading(true);
  },
  hide() {
    if (setIsLoading) setIsLoading(false);
  }
}; 