import styles from "./Button.module.css";
export default function Buttom({children,type,onClick}) {
  return <button onClick={onClick}className={`${styles.btn} ${styles[type]}`}>{children}</button>;
}
