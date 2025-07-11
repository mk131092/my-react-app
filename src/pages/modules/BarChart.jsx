import React from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  BarElement,
  Tooltip,
} from "chart.js";
import { useTranslation } from "react-i18next";
const BarChart = (state) => {
  const { t } = useTranslation();

  ChartJS.register(CategoryScale, LinearScale, Title, BarElement, Tooltip);

  const data = {
    labels: [
      t("Collected"),
      t("Not Collected"),
      t("Received"),
      t("Rejected"),
      t("Approved"),
    ],

    datasets: [
      {
        label: t("Bar Chart")
        ,
        borderRadius: 10,
        data: [
          state?.state?.sampleCollectionCount,
          state?.state?.notCollectedCount,
          state?.state?.departmentReceiveCount,
          state?.state?.rejectedCount,
          state?.state?.approvedCount,
        ],
        borderColor: [
          "rgba(252, 186,3)",
          "rgba(99,104,116,0.8)",
          "rgba(51, 122, 183)",
          "rgba(237, 21, 21)",
          "rgba(25, 163, 18)",
        ],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  return (
    <div style={{ width: "100%", height: "90%" }}>
      <Bar
        data={data}
        options={{
          maintainAspectRatio: false,
          responsive: true,
        }}
      />
    </div>
  );
};
export default BarChart;
