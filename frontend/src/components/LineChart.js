import React from 'react'
import PropTypes from 'prop-types'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function LineChart ({ label, points, fieldX, fieldY }) {
  const data = {
    labels: points.map(({ [fieldX]: x }) => x),
    datasets: [
      {
        label,
        data: points.map(({ [fieldY]: y }) => y),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      }
    ]
  }

  return <Line data={data} />
}

LineChart.propTypes = {
  label: PropTypes.string,
  points: PropTypes.array,
  fieldX: PropTypes.string,
  fieldY: PropTypes.string
}
