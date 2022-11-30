import React, { useRef } from "react";
import videoIcon from "../play_video.png";
import albumIcom from "../album_icon.jpg";
import moment from "moment";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, SubTitle, Tooltip, Legend } from "chart.js";
import { Bar, getElementAtEvent } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ChartDataLabels, CategoryScale, LinearScale, BarElement, Title, SubTitle, Tooltip, Legend);
const BarChart = (props) => {
  const chartRef = useRef();
  let { barData, name } = props.barData;

  let offsetDataLebels = Math.max(...barData.map((el, i) => (i > 5 ? 0 : el.like_count))) + 10;

  let offsetDataLebels2 = Math.max(...barData.map((el, i) => (i > 5 ? 0 : el.comments_count))) + 10;
  if (offsetDataLebels2 > offsetDataLebels) offsetDataLebels = offsetDataLebels2;

  let pad = props.width / 6;
  console.log("qwerqwerqwrqwerqwerqwerqwerqwerqwer");
  console.log(pad);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    //aspectRatio: 2,
    scales: {
      x: {
        ticks: {
          display: false,
        },
      },
    },

    layout: {
      // autoPadding: true,
      padding: {
        bottom: 60,
      },
    },

    plugins: {
      subtitle: {
        display: true,
        text: "*Click bar to open post",
        position: "top",
      },
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `- ${name} - Latest Posts Interactions`,
      },
    },
  };

  let likesDataPoints = barData.map((item) => item.like_count);
  let commentsDataPoints = barData.map((item) => item.comments_count);
  const labels = barData.map((item) => moment(item.timestamp).locale("en").format("DD MMM YYYY"));

  //--adding image bottom of the bar
  const barImage = {
    id: "barImage",

    afterDatasetsDraw(chart) {
      const {
        ctx,
        scales: { x, y },
      } = chart;

      // //var meta = chart.BarChart.picHeight;
      // console.log("qwerqwerqwrqwerqwerqwerqwerqwerqwer");
      // console.log(x.chart.width);

      let picWidth = x.chart.width / 7;
      let picHeight = x.chart.width / 6;

      x.ticks.forEach((value, index) => {
        let xTop = x.getPixelForTick(index);
        let image = new Image();

        if (barData[index].media_type === "VIDEO") {
          image.src = videoIcon;
        } else if (barData[index].media_type === "CAROUSEL_ALBUM") {
          image.src = albumIcom;
        } else {
          image.src = barData[index].media_url;
        }

        if (image.complete) {
          ctx.drawImage(image, xTop - picWidth / 2, y.bottom, picWidth, picHeight);
        } else {
          image.onload = () => ctx.drawImage(image, xTop - picWidth / 2, y.bottom, picWidth, picHeight);
        }
      });
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Likes",
        data: likesDataPoints,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        datalabels: {
          color: "red",
          anchor: "end",
          align: "top",

          backgroundColor: "rgba(255, 99, 132, 0.7)",
        },
        minBarLength: 5,
      },
      {
        label: "comments",
        data: commentsDataPoints,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        datalabels: {
          color: "red",
          anchor: "end",
          align: "top",
          backgroundColor: "rgba(53, 162, 235, 0.7)",
        },
        minBarLength: 5,
      },
    ],
  };

  const onClick = (event) => {
    if (getElementAtEvent(chartRef.current, event)[0] !== undefined) {
      window.open(barData[getElementAtEvent(chartRef.current, event)[0].index].permalink);
    }
  };

  return (
    <div className="barChart">
      <Bar id={"myCanvas" + name} options={options} plugins={[ChartDataLabels, barImage]} onClick={onClick} ref={chartRef} data={data} />
    </div>
  );
};

export default BarChart;
