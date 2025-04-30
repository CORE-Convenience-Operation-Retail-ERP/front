export default function useLogout() {
    return () => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    };
  }