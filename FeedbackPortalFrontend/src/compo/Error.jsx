// src/compo/Error.jsx
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showErrorToast = (message) => {
  toast.error(message);
};
