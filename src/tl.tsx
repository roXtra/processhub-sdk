export interface ITLProps {
  text: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function TL(props: ITLProps): JSX.Element {
  return <span>{props.text}</span>;
}

// Variante für Strings, die nicht im JSX eingefügt werden
export function tl(text: string): string {
  return text;
}
