import * as d3 from 'd3';
import { useState } from 'react';
import { AxisLeft } from './AxisLeft';
import { AxisBottom } from './AxisBottom';
import { Tooltip } from './Tooltip';

const MARGIN = { top: 60, right: 60, bottom: 60, left: 60 };

export const Scatterplot = ({ width, height, data, xAxisLabel, yAxisLabel}) => {
    const boundsWidth = width - MARGIN.right - MARGIN.left;
    const boundsHeight = height - MARGIN.top - MARGIN.bottom;

    const [hovered, setHovered] = useState(null);

    const xExtent = d3.extent(data, (d) => d.x);
    const yExtent = d3.extent(data, (d) => d.y);
    const xPadding = (xExtent[1] - xExtent[0]) * 0.1;
    const yPadding = (yExtent[1] - yExtent[0]) * 0.1;

    const xScale = d3
        .scaleLinear()
        .domain([xExtent[0] - xPadding, xExtent[1] + xPadding])
        .range([0, boundsWidth]);

    const yScale = d3
        .scaleLinear()
        .domain([yExtent[0] - yPadding, yExtent[1] + yPadding])
        .range([boundsHeight, 0]);
        
    const uniquePositions = Array.from(new Set(data.map((d) => d.group)));
    const colorScale = d3.scaleOrdinal().domain(uniquePositions).range(d3.schemeCategory10);

    const allShapes = data.map((d, i) => (
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
                  color: colorScale(d.group),
                  x: d.x,
                  y: d.y,
                  name: d.name, 
                  xAxisStat: { label: xAxisLabel, value: d.x }, 
                  yAxisStat: { label: yAxisLabel, value: d.y }, 
              })
          }
          onMouseLeave={() => setHovered(null)}
      />
      ));
  

    return (
        <div>
            <svg width={width} height={height}>
                <g
                    width={boundsWidth}
                    height={boundsHeight}
                    transform={`translate(${MARGIN.left}, ${MARGIN.top})`}
                >
                    <AxisLeft yScale={yScale} pixelsPerTick={40} width={boundsWidth} />
                    <g transform={`translate(0, ${boundsHeight})`}>
                        <AxisBottom xScale={xScale} pixelsPerTick={40} height={boundsHeight} />
                    </g>
                    {allShapes}
                </g>
            </svg>
            <Tooltip interactionData={hovered} />
        </div>
    );
};
