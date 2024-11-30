import React from 'react';

const Legend = ({ positions, colorScale, hoveredGroup, setHoveredGroup, toggleFilter, activeGroups, title }) => {
    const legendSpacing = 25;
    const legendWidth = 100;
    const legendHeight = legendSpacing * positions.length;

    return (
        <svg width={legendWidth} height={legendHeight + 120} style={{ position: 'relative', top: legendHeight - 200, left: 0 }}>
            <text x={legendWidth / 2} y={20} fontSize="14" fill="black" textAnchor="middle">
                {title}
            </text>

            <rect
                x={0}
                y={40}
                width={legendWidth}
                height={legendHeight + 10}
                fill="none"
                stroke="black"
                strokeWidth={1}
                rx={5}
                ry={5}
            />

            <g transform={'translate(0,55)'}>
                {positions.map((group, i) => (
                    <g
                        key={i}
                        transform={`translate(10, ${i * legendSpacing})`}
                        onMouseEnter={() => setHoveredGroup(group)}
                        onMouseLeave={() => setHoveredGroup(null)}
                        onClick={() => toggleFilter(group)}
                    >
                        <circle r={8} fill={colorScale(group)} />
                        <text x={20} y={5} fontSize="12" fill="black">
                            {group}
                        </text>
                    </g>
                ))}
            </g>
        </svg>
    );
};

export default Legend;
