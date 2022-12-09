import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MONTH_NAME_KEY } from "./Doughnut";

interface YearData {
  childNumber: number;
  description: string;
}

const formatAMPM = (date: Date) => {
  let hours = date.getHours();
  let minutes: any = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";

  hours %= 12;
  hours = hours || 12;
  minutes = minutes < 10 ? `0${minutes}` : minutes;

  const strTime = `${hours}:${minutes} ${ampm}`;

  return strTime;
};

const formatDateOfCreation = (date: Date) => {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  return dd + "/" + mm + "/" + yyyy;
};

export function createYearDataPdf(data: YearData[]) {
  const doc = new jsPDF();

  autoTable(doc, {
    body: [
      [
        {
          content: `This is your story of ${new Date().getFullYear()}!`,
          styles: {
            halign: "center",
            fontSize: 30,
            textColor: "white",
            fontStyle: "bold",
          },
        },
      ],
    ],
    theme: "plain",
    styles: { fillColor: "rgb(233, 206, 97)" },
  });

  data.map((i) => {
    autoTable(doc, {
      body: [
        [
          {
            content: `${MONTH_NAME_KEY[i.childNumber]}:`,
            styles: {
              halign: "center",
              valign: "middle",
              fontSize: 12,
              textColor: "white",
              fontStyle: "bold",
              fillColor: "rgb(82, 203, 255)",
              minCellHeight: 12,
              cellWidth: 30,
            },
          },
          { content: "", styles: { cellWidth: 10 } },
          {
            content: `${i.description}`,
            styles: {
              halign: "left",
              valign: "middle",
              fontSize: 9,
              textColor: "black",
              fontStyle: "italic",
              cellWidth: 125,
            },
          },
        ],
      ],
      theme: "plain",
    });
  });

  autoTable(doc, {
    body: [
      [
        {
          content: `Created uisng Daniel Lee's TimeCount at ${formatAMPM(
            new Date()
          )}, on the ${formatDateOfCreation(new Date())} `,
          styles: { halign: "center" },
        },
      ],
    ],
  });

  return doc.save(
    `YourYear_${new Date().getFullYear()}_${formatDateOfCreation(new Date())}`
  );
}
