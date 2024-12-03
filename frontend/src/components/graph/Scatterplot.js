import * as d3 from 'd3';
import React, { useState, useEffect } from 'react';
import { AxisLeft } from './AxisLeft';
import { AxisBottom } from './AxisBottom';
import { Tooltip } from './Tooltip';
import Legend from './Legend';
import { Row } from 'react-bootstrap';

const MARGIN = { top: 60, right: 60, bottom: 60, left: 60 };
const uniquePositions = ['PG', 'SG', 'SF', 'PF', 'C']; 
const colorScale = d3.scaleOrdinal().domain(uniquePositions).range(d3.schemeCategory10);

export const Scatterplot = ({ width, height, data, xAxisLabel, yAxisLabel, integerTicks = false, showLegend = false}) => {
    const boundsWidth = width - MARGIN.right - MARGIN.left;
    const boundsHeight = height - MARGIN.top - MARGIN.bottom;

    const [hovered, setHovered] = useState(null);
    const [hoveredGroup, setHoveredGroup] = useState(null);
    const [filteredData, setFilteredData] = useState(data);
    const [activeGroups, setActiveGroups] = useState([]);
    const [showRegressionLine, setShowRegressionLine] = useState(false);

    const calculateRegressionLine = (data) => {
        const n = data.length;
        const meanX = d3.mean(data, (d) => d.x);
        const meanY = d3.mean(data, (d) => d.y);
        const numerator = d3.sum(data, (d) => (d.x - meanX) * (d.y - meanY));
        const denominator = d3.sum(data, (d) => Math.pow(d.x - meanX, 2));

        const slope = numerator / denominator;
        const intercept = meanY - slope * meanX;
        return { slope, intercept };
    };

    const regressionLine = (data, slope, intercept) => {
        const xValues = d3.extent(data, (d) => d.x);
        return [
            { x: xValues[0], y: slope * xValues[0] + intercept },
            { x: xValues[1], y: slope * xValues[1] + intercept },
        ];
    };

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

    const allShapes = filteredData.map((d, i) => {
        const isHoveredGroup = hoveredGroup === d.group;
        const isOtherGroup = hoveredGroup && hoveredGroup !== d.group;

        return (
            <circle
                key={i}
                r={8}
                cx={xScale(d.x)}
                cy={yScale(d.y)}
                stroke={isHoveredGroup ? colorScale(d.group) : 'transparent'}
                fill={isHoveredGroup ? colorScale(d.group) : isOtherGroup ? 'grey' : colorScale(d.group)}
                fillOpacity={isHoveredGroup ? 0.7 : isOtherGroup ? 0.3 : 0.7}
                style={{ transition: 'all 0.3s ease' }}
                onMouseEnter={() => {
                    setHovered({
                        xPos: xScale(d.x),
                        yPos: yScale(d.y),
                        color: colorScale(d.group),
                        x: d.x,
                        y: d.y,
                        name: d.name,
                        xAxisStat: { label: xAxisLabel, value: d.x },
                        yAxisStat: { label: yAxisLabel, value: d.y },
                    });
                    setHoveredGroup(d.group);
                }}
                onMouseLeave={() => {
                    setHovered(null);
                    setHoveredGroup(null);
                }}
            />
        );
    });

    const toggleFilter = (group) => {
        const isActive = activeGroups.includes(group);

        if (isActive) {
            setActiveGroups(activeGroups.filter((item) => item !== group));
        } else {
            setActiveGroups([...activeGroups, group]);
        }
    };

    useEffect(() => {
        if (activeGroups.length === 0) {
            setFilteredData(data);
        } else {
            const filtered = data.filter((d) => activeGroups.includes(d.group));
            setFilteredData(filtered);
        }
    }, [activeGroups, data]);

    const { slope, intercept } = calculateRegressionLine(filteredData);
    const linePoints = regressionLine(filteredData, slope, intercept);

    const [inputX, setInputX] = useState('');
    const [predictedY, setPredictedY] = useState(null);

    const handlePredictY = () => {
        if (!isNaN(inputX) && inputX !== '') {
            const y = slope * parseFloat(inputX) + intercept;
            setPredictedY(y);
        }
    };

    return (
        <div>
            <div style={{ marginBottom: '10px' }}>
                <label>
                    <input type="checkbox" checked={showRegressionLine} onChange={() => setShowRegressionLine(!showRegressionLine)}/>
                        Show Regression Line
                    {showRegressionLine && (
                        <row>
                            <h5>Slope = {slope}</h5>
                            <h5>Intercept = {intercept}</h5>
                        </row>
                    )}
                </label>
                <div style={{ marginTop: '10px' }}>
                    <label>
                        Predict Y for X: 
                        <input type="number" value={inputX} onChange={(e) => setInputX(e.target.value)} style={{ marginLeft: '5px', marginRight: '10px' }}/>
                    </label>
                    <button onClick={handlePredictY}>Predict</button>
                    {predictedY !== null && (
                        <span style={{ marginLeft: '10px' }}>
                            Predicted Y: {predictedY.toFixed(2)}
                        </span>
                    )}
                </div>
            </div>

            <Row></Row>
            <svg width={width} height={height}>
                <g width={boundsWidth} height={boundsHeight} transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
                    <AxisLeft yScale={yScale} pixelsPerTick={40} width={boundsWidth} />
                    <g transform={`translate(0, ${boundsHeight})`}>
                        <AxisBottom xScale={xScale} pixelsPerTick={40} height={boundsHeight} formatTick={integerTicks} />
                    </g>
                    {allShapes}
                    {showRegressionLine && (
                        <line
                            x1={xScale(linePoints[0].x)}
                            y1={yScale(linePoints[0].y)}
                            x2={xScale(linePoints[1].x)}
                            y2={yScale(linePoints[1].y)}
                            stroke="grey"
                            strokeWidth="2"
                        />
                    )}
                    <text x={boundsWidth / 2} y={boundsHeight + 40} textAnchor="middle" fontSize="14">
                        {xAxisLabel}
                    </text>
                    <text x={-boundsHeight / 2} y={-40} textAnchor="middle" transform="rotate(-90)" fontSize="14">
                        {yAxisLabel}
                    </text>
                </g>
            </svg>
            {showLegend && (
            <Legend
                positions={uniquePositions}
                colorScale={colorScale}
                hoveredGroup={hoveredGroup}
                setHoveredGroup={setHoveredGroup}
                toggleFilter={toggleFilter}
                activeGroups={activeGroups}
                title={'Positions'}
            />
            )}
            <Tooltip interactionData={hovered} />
            <Row />
        </div>
    );
};

