import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);

interface ProgressChartProps{
  data: number[]
}

const ProgressChart = (props:ProgressChartProps) => {

  const getData = () => {
    return {
      labels:['Complete', 'Remaining'],
      datasets: [
        {
          label: 'Progress %',
          data: props.data,
          backgroundColor: [
            'orange',
            'white',
           
          ],
          borderColor: [
            'lightgray',
            'lightgray',         
          ],
          borderWidth: 1,
        },
      ],
    }
  };

  return (
      <Pie data={getData()}/>
  )
}

export default ProgressChart
