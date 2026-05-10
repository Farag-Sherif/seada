import React from "react";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean;
  priority?: boolean;
};

export default function AppImage({ src = "", alt = "", loading, fill, style, priority, ...rest }: Props) {
  return (
    <img
      src={String(src)}
      alt={alt}
      loading={priority ? "eager" : loading || "lazy"}
      style={fill ? { width: "100%", height: "100%", objectFit: "cover", ...style } : style}
      {...rest}
    />
  );
}
