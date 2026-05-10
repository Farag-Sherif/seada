// helpers/toast.js
import { toast } from "react-toastify";

export const notify = {
  success: (msg, opts) => toast.success(msg, { theme: "light", ...opts }),
  error:   (msg, opts) => toast.error(msg,   { theme: "light", ...opts }),
  info:    (msg, opts) => toast.info(msg,    { theme: "light", ...opts }),
  warn:    (msg, opts) => toast.warn(msg,    { theme: "light", ...opts }),
  promise: (p, messages, opts) =>
    toast.promise(p, messages, { theme: "light", ...opts }),
};
