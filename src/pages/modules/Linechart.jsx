import React from "react";
import { useTranslation } from "react-i18next";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

const Linechart = (state) => {

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        Title,
        Tooltip,
        Legend
    );
    
    const { t } = useTranslation();

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
                label: t("Line Chart"),
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
                    "rgba(25, 163, 18)"
                ],
                borderWidth: 3,
                hoverOffset: 8
            },
        ],
    };

    return (
        <div className="col-sm-12" style={{width:"100%",height:"90%"}}>
        <Line
          data={data}
          options={{
            maintainAspectRatio: false,
            responsive: true,
          }}
        />
      </div>
    )
};

export default Linechart;
