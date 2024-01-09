import { ReactNode } from "react";
import MenuList from "./MenuList";

interface LayoutProps {
  children: ReactNode;
}

const Latyout = ({ children }: LayoutProps) => {
  return (
    <div className="layout">
      {children}
      <MenuList />
    </div>
  );
};

export default Latyout;
