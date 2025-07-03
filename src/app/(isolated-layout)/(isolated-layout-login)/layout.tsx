import {ReactNode} from "react";
/**
 * Buraya 'auth-layout' bileşeni eklememin nedeni,
 * paralel rotada 'main-layout' bileşenini override etmek.
 */

type Props = {
  children: ReactNode
}

export default function Layout({ children }: Props) {
  return children
}
