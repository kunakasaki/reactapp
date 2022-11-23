import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = (props) => {
  const pieChart = props.pieData;
  const name = props.name;
  const options = {
    plugins: {
      datalabels: {
        display: false,
      },
      title: {
        display: true,
        text: `- ${name} - Post Types`,
      },
    },
  };
  const data = {
    labels: ["Photo", "Video", "Carousel Album"],
    datasets: [
      {
        label: "# of Votes",
        data: [pieChart.totalPhoto, pieChart.totalVideo, pieChart.totalCarouselAlbum],
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(255, 206, 86, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)"],
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className="pieChart">
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
