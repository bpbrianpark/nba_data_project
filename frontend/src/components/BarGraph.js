import React from 'react';
import { Table } from 'react-bootstrap';
import { Chart as ChartJS} from "chart.js/auto"
import { Bar, Doughnut, Line } from "react-chartjs-2";


const BarGraph = ({}) => {
    return (
        <Bar
            data={{
                labels: ["A", "B", "C"],
                datasets: [
                    {
                        label: "Revenue",
                        data: [200, 300, 400],
                    }
                ],
            }}
        />
    );
};

export default BarGraph
