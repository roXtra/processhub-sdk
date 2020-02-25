import React from "react";

export interface ITLProps {
  text: string;
}

export function TL(props: ITLProps): JSX.Element {
  return <span>{ props.text }</span>;
}

// Variante für Strings, die nicht im JSX eingefügt werden
export function tl(text: string): string {
  return text;
}