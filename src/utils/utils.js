import { toast } from "react-toastify";
import { useLocalStorage } from "./hooks/useLocalStorage";

export const notify = (message, type = "success") => {
  if (type === "success") {
    toast.success(message);
  } else if (type === "warn") {
    toast.warn(message);
  } else if (type === "error") {
    toast.error(message);
  }
};

