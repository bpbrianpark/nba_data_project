import { useMemo } from "react";

const TICK_LENGTH = 6;

export const AxisBottom = ({ xScale, pixelsPerTick, formatTick }) => {
  const range = xScale.range();

  const ticks = useMemo(() => {
    const width = range[1] - range[0];
    const numberOfTicksTarget = Math.floor(width / pixelsPerTick);

    let ticks = xScale.ticks(numberOfTicksTarget);
    if (formatTick) {
      ticks = ticks.filter((tick) => Number.isInteger(tick));
    }

    return ticks.map((value) => ({
      value,
      xOffset: xScale(value),
    }));
  }, [xScale, range, pixelsPerTick, formatTick]);

  return (
    <>
      <path
        d={`M ${range[0]} 0 L ${range[1]} 0`}
        fill="none"
        stroke="currentColor"
      />

      {ticks.map(({ value, xOffset }) => (
        <g key={value} transform={`translate(${xOffset}, 0)`}>
          <line y2={TICK_LENGTH} stroke="currentColor" />
          <text
            style={{
              fontSize: "10px",
              textAnchor: "middle",
              transform: "translateY(20px)",
            }}
          >
            {value}
          </text>
        </g>
      ))}
    </>
  );
};
