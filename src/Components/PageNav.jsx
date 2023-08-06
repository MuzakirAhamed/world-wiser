import { NavLink } from "react-router-dom";
import Styles from "./PageNav.module.css";
import Logo from "./Logo"
export default function PageNav() {
  return (
    <nav className={Styles.nav}>
        <Logo/>
      <ul>
        <li>
          <NavLink to="/pricing">Pricing</NavLink>
        </li>
        <li>
          <NavLink to="/products">Products</NavLink>
        </li>
        <li>
          <NavLink to="/login" className={Styles.ctaLink}>Login</NavLink>
        </li>
      </ul>
    </nav>
  );
}
