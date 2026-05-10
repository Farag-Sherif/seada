import React from "react";

export default function StyleTag({ css, global }: { css: string; global?: boolean }) {
  return <style data-global={global ? "true" : "false"} dangerouslySetInnerHTML={{ __html: css }} />;
}
