import dayjs from "dayjs";

export const htmlLegendPlugin = {
  id: "htmlLegend",
  afterUpdate(chart, args, options) {
    const legendContainer = document.getElementById(options.containerID);
    const ul = legendContainer.querySelector("ul");

    // Remove old legend items
    while (ul.firstChild) {
      ul.firstChild.remove();
    }

    // Reuse the built-in legendItems generator
    const items = chart.options.plugins.legend.labels.generateLabels(chart);

    items.forEach((item) => {
      const li = document.createElement("li");
      li.className = "flex mr-6 cursor-pointer items-center";

      li.onclick = () => {
        const { type } = chart.config;
        if (type === "pie" || type === "doughnut") {
          // Pie and doughnut charts only have a single dataset and visibility is per item
          chart.toggleDataVisibility(item.index);
        } else {
          chart.setDatasetVisibility(
            item.datasetIndex,
            !chart.isDatasetVisible(item.datasetIndex)
          );
        }
        chart.update();
      };

      // Color box
      const boxSpan = document.createElement("span");
      boxSpan.style.background = item.fillStyle;
      boxSpan.style.borderColor = item.strokeStyle;
      boxSpan.style.borderWidth = item.lineWidth + "px";
      boxSpan.style.display = "inline-block";
      boxSpan.style.height = "2px";
      boxSpan.style.marginLeft = "16px";
      boxSpan.style.width = "100px";

      // Text
      const textContainer = document.createElement("p");
      textContainer.className = "text-[#333] m-0 p-0";
      textContainer.style.textDecoration = item.hidden ? "line-through" : "";

      const text = document.createTextNode(item.text);
      textContainer.appendChild(text);

      li.appendChild(textContainer);
      li.appendChild(boxSpan);
      ul.appendChild(li);
    });
  },
};

export const lineChartDefaultOptions = (min, max, legendContainerId) => {
  return {
    plugins: {
      htmlLegend: {
        containerID: legendContainerId,
      },
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: function (context) {
            return context[0].label.replace(", 12:00:00 am", "");
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        border: { display: false },
        ticks: {
          color: "#333",
          padding: 8,
          font: { family: "Poppins", size: 14, weight: 400 },
        },
      },
      x: {
        type: "time",
        time: {
          displayFormats: {
            quarter: "YYYY-MM-DD",
          },
          min,
          max,
          minUnit: "day",
        },
        grid: { display: false },
        ticks: {
          color: "#333",
          font: { family: "Poppins", size: 14, weight: 400 },
        },
      },
    },
    datasets: {
      line: {
        pointRadius: 0,
      },
    },
    layout: {
      padding: 20,
    },
  };
};

const datasetsMap = ({ impressions, participants, completed }) => {
  const datasets = [
    {
      label: "Impressions",
      data: impressions,
      borderWidth: 1,
      borderColor: "#7C93ED",
      backgroundColor: "#7C93ED",
    },
    {
      label: "Participants",
      data: participants,
      borderWidth: 1,
      borderColor: "#6DC1DF",
      backgroundColor: "#6DC1DF",
    },
    {
      label: "Completed",
      data: completed,
      borderWidth: 1,
      borderColor: "#FFC633",
      backgroundColor: "#FFC633",
    },
  ].filter((v) => v.data);

  return datasets;
};

export const lineDefaultDataStructures = (data, min, max, structures) => {
  const day = dayjs.duration(dayjs(max).diff(dayjs(min))).as("day") + 1;
  const xArray = new Array(day).fill(null);

  const pointSets = xArray.reduce(
    ({ impressions, participants, completed }, _, i) => {
      const label = dayjs(min).add(i, "day").format("YYYY-MM-DD");
      const item = data.find((v) => v.date === label);

      const concat = (accumulate, key) =>
        accumulate
          ? accumulate.concat({ x: label, y: item ? item[key] : 0 })
          : null;

      return {
        impressions: concat(impressions, "impressions"),
        participants: concat(participants, "participants"),
        completed: concat(completed, "completed"),
      };
    },
    structures
  );

  const datasets = datasetsMap(pointSets);

  return { datasets };
};
