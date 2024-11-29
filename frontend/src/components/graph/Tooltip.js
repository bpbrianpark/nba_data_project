import styles from "./tooltip.module.css";

export const Tooltip = ({ interactionData }) => {
  if (!interactionData) {
    return null;
  }

  const { xPos, yPos, name, color, x, y, size } = interactionData;

  return (
    <div
      className={styles.tooltip}
      style={{
        left: interactionData.xPos,
        top: interactionData.yPos+200,
      }}
    >
      <b className={styles.title}>{name}</b>

      <div className={styles.topHalfContainer} style={{ borderColor: color }}>
        <div className={styles.row}>
          <b>Tyrese Haliburton</b>
        </div>
      </div>

      <div className={styles.separator} />

      <div className={styles.row}>
        <span>
          Assists Per Game:
          <br />
          10.9
        </span>
      </div>
    </div>
  );
};
