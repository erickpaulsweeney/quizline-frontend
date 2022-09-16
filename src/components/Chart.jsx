import { Bar } from "react-chartjs-2";

// from https://blog.logrocket.com/using-chart-js-react/

export default function Chart({ chartData }) {
    return (
        <Bar
            data={chartData}
            options={{ plugins: { title: { display: true, text: "Answers" } } }}
        />
    );
}
