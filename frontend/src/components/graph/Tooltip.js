import styles from "./tooltip.module.css";

export const Tooltip = ({ interactionData }) => {
  if (!interactionData) {
    return null;
  }

  const { xPos, yPos, name, color, x, y, xAxisStat, yAxisStat } = interactionData;

  return (
    <div
      className={styles.tooltip}
      style={{
        left: xPos,
        top: yPos+450,
      }}
    >
      <b className={styles.title}>{name}</b>

      <div className={styles.topHalfContainer} style={{ borderColor: color }}>

        <div className={styles.row}>
          <span>
            {xAxisStat.label}: <b>{x}</b>
          </span>
        </div>
        <div className={styles.row}>
          <span>
            {yAxisStat.label}: <b>{y}</b>
          </span>
        </div>
      </div>
    </div>
  );
};
