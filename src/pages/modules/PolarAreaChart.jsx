import React from "react";
import { PolarArea } from "react-chartjs-2";
import {
  Chart,
  PolarAreaController,
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js";
import { useTranslation } from "react-i18next";
const PolarAreaChart = (state) => {
  const { t } = useTranslation();
  Chart.register(
    PolarAreaController,
    RadialLinearScale,
    PointElement,
    LineElement,
    ArcElement
  );

  const data = {
    labels: [
      t("Sample Collected"),
      t("Sample Not Collected"),
      t("Sample Received"),
      t("Sample Rejected"),
      t("Sample Approved"),
    ],
    datasets: [
      {
        data: [
          state?.state?.sampleCollectionCount,
          state?.state?.notCollectedCount,
          state?.state?.departmentReceiveCount,
          state?.state?.rejectedCount,
          state?.state?.approvedCount,
        ],
        borderColor: [
          "rgba(252, 186, 3)",
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
      <PolarArea
        data={data}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          scales: {
            r: {
              ticks: {
                stepSize: 1,
                beginAtZero: true,
              },
            },
          },
        }}
      />
    </div>
  );
};
export default PolarAreaChart;
