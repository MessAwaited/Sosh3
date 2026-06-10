import styles from './LoginLogo.module.css';

/** Логотип в стиле Точка роста + Национальные проекты России (Образование) */
export function LoginLogo() {
  return (
    <div className={styles.wrap}>
      <div className={styles.tochkaRosta}>
        <img
          src="/tochka-rosta-full-logo.png"
          alt="Точка роста"
          className={styles.fullLogo}
        />
      </div>
      <p className={styles.course}>Спортивное программирование · Python · МБОУ СОШ №3 им. Страховой З.Х.</p>
    </div>
  );
}
