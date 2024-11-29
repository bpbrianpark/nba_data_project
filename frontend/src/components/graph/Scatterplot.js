import * as d3 from 'd3';
import { AxisLeft } from './AxisLeft';
import { AxisBottom } from './AxisBottom';
import { useState } from 'react';
import { Tooltip } from './Tooltip';

const MARGIN = { top: 60, right: 60, bottom: 60, left: 60 };

export const Scatterplot = ({ width, height, data }) => {
  // Layout. The div size is set by the given props.
  // The bounds (=area inside the axis) is calculated by subtracting the margins
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const [hovered, setHovered] = useState(null);

  // Scales
  const yScale = d3.scaleLinear().domain([0, 10]).range([boundsHeight, 0]);
  const xScale = d3.scaleLinear().domain([0, 10]).range([0, boundsWidth]);
  const colorScale = d3.scaleOrdinal(d3.schemeCategory10); // Example color scale

  // Build the shapes (circles)
  const allShapes = data.map((d, i) => {
    return (
      <circle
        key={i}
        r={8}
        cx={xScale(d.x)}
        cy={yScale(d.y)}
        stroke={colorScale(d.group)}
        fill={colorScale(d.group)}
        fillOpacity={0.7}
        onMouseEnter={() =>
          setHovered({
            xPos: xScale(d.x),
            yPos: yScale(d.y),
            color: colorScale(d.group), // Added color for demonstration
            x: d.x,
            y: d.y,
          })
        }
        onMouseLeave={() => setHovered(null)}
      />
    );
  });

  return (
    <div>
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${MARGIN.left}, ${MARGIN.top})`}
        >
          {/* Y axis */}
          <AxisLeft yScale={yScale} pixelsPerTick={40} width={boundsWidth} />

          {/* X axis, use an additional translation to appear at the bottom */}
          <g transform={`translate(0, ${boundsHeight})`}>
            <AxisBottom
              xScale={xScale}
              pixelsPerTick={40}
              height={boundsHeight}
            />
          </g>

          {/* Circles */}
          {allShapes}
        </g>
      </svg>

      {/* Tooltip */}
      <Tooltip interactionData={hovered} />
    </div>
  );
};
