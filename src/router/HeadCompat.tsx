import React from "react";
import { Helmet } from "react-helmet-async";

export default function HeadCompat({ children }: { children: React.ReactNode }) {
  return <Helmet>{children}</Helmet>;
}
