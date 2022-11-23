import React from "react";
import moment from "moment";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function LineChart(props) {
  let lineChartData = props.lineChartData;
  lineChartData = [...lineChartData].reverse();
  const name = props.name;
  const options = {
    responsive: true,
    plugins: {
      datalabels: {
        display: false,
      },
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `- ${name} - Monthly Number of Posts`,
      },
    },
  };

  const labels = lineChartData.map((item) => moment(item.year).locale("en").format("MMM YYYY"));

  const data = {
    labels,
    datasets: [
      {
        label: "Posts",
        data: lineChartData.map((item) => item.monthlyPost),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        tension: 0.3,

        fill: true,
      },
    ],
  };
  return (
    <div className="lineChart">
      <Line options={options} data={data} />
    </div>
  );
}

export default LineChart;
