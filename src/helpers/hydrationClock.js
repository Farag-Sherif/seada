// HydrationCloak.jsx
import { useEffect, useState } from "react";
export default function HydrationCloak({ children }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return <div data-cloak={!ready ? "" : undefined}>{children}</div>;
}

// // global css
// [data-cloak]{visibility:hidden}
