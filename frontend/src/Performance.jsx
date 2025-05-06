"use client"

import { useEffect, useState, useRef } from "react"
import {
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList
} from 'recharts'

const LineChartComponent = ({ stats }) => {
  if (!stats || stats.endpoints.length === 0) return null

  const mergedData = stats.timeSeriesData[stats.endpoints[0]].map((_, index) => {
    const point = { time: stats.timeSeriesData[stats.endpoints[0]][index].time }
    stats.endpoints.forEach(endpoint => {
      point[endpoint] = stats.timeSeriesData[endpoint][index]?.responseTime ?? 0
    })
    return point
  })

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={mergedData} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        {stats.endpoints.map((endpoint, idx) => (
          <Line
            key={endpoint}
            type="monotone"
            dataKey={endpoint}
            stroke={['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2'][idx % 5]}
            strokeWidth={2}
            dot={{ r: 1 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

const BarChartComponent = ({ stats }) => {
  if (!stats || stats.endpoints.length === 0) return null

  const data = stats.endpoints.map(endpoint => ({
    endpoint: endpoint.split('/').pop(),
    Min: stats.minResponseTimes[endpoint],
    Avg: stats.avgResponseTimes[endpoint],
    Max: stats.maxResponseTimes[endpoint]
  }))

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 40, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="endpoint" />
        <YAxis label={{ value: 'Response Time (ms)', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="Min" fill="#4ECDC4">
          <LabelList dataKey="Min" position="top" fontSize={10} />
        </Bar>
        <Bar dataKey="Avg" fill="#FFD166">
          <LabelList dataKey="Avg" position="top" fontSize={10} />
        </Bar>
        <Bar dataKey="Max" fill="#FF6B6B">
          <LabelList dataKey="Max" position="top" fontSize={10} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}


export default function PerformanceAnalytics() {
  const [apiData, setApiData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    endpoints: [],
    minResponseTimes: {},
    avgResponseTimes: {},
    maxResponseTimes: {},
    dbVsCacheCount: {},
    timeSeriesData: {},
  })

  const lineChartRef = useRef(null)
  const barChartRef = useRef(null)

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${process.env.REACT_APP_BACKENDURL}/performance`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        
        const data = await response.json()
        setApiData(data)
        analyzeData(data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(`Failed to fetch API data: ${err.message}`)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Analyze the data to get statistics
  const analyzeData = (data) => {
    // Group by endpoint
    const endpointGroups = {}
    const endpoints = []

    data.forEach((item) => {
      if (!endpointGroups[item.endpoint]) {
        endpointGroups[item.endpoint] = []
        endpoints.push(item.endpoint)
      }
      endpointGroups[item.endpoint].push(item)
    })

    // Calculate stats for each endpoint
    const minResponseTimes = {}
    const avgResponseTimes = {}
    const maxResponseTimes = {}
    const dbVsCacheCount = {}
    const timeSeriesData = {}

    endpoints.forEach((endpoint) => {
      const endpointData = endpointGroups[endpoint]

      // Min response time
      minResponseTimes[endpoint] = Math.min(...endpointData.map((item) => item.responseTime))
      
      // Max response time
      maxResponseTimes[endpoint] = Math.max(...endpointData.map((item) => item.responseTime))

      // Average response time
      const sum = endpointData.reduce((acc, item) => acc + item.responseTime, 0)
      avgResponseTimes[endpoint] = Math.round(sum / endpointData.length)

      // DB vs Cache count
      const dbCount = endpointData.filter((item) => item.source === "db").length
      const cacheCount = endpointData.filter((item) => item.source === "cache").length
      dbVsCacheCount[endpoint] = { db: dbCount, cache: cacheCount }

      // Time series data for line chart
      timeSeriesData[endpoint] = endpointData
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .map((item) => ({
          time: new Date(item.timestamp).toLocaleTimeString(),
          responseTime: item.responseTime,
          source: item.source
        }))
    })

    setStats({
      endpoints,
      minResponseTimes,
      avgResponseTimes,
      maxResponseTimes,
      dbVsCacheCount,
      timeSeriesData,
    })
  }

  // Draw line chart
  useEffect(() => {
    if (lineChartRef.current && stats.endpoints.length > 0) {
      const canvas = lineChartRef.current
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        // Set dimensions
        const padding = 40
        const chartWidth = canvas.width - padding * 2
        const chartHeight = canvas.height - padding * 2
        
        // Draw axes
        ctx.beginPath()
        ctx.moveTo(padding, padding)
        ctx.lineTo(padding, canvas.height - padding)
        ctx.lineTo(canvas.width - padding, canvas.height - padding)
        ctx.strokeStyle = '#333'
        ctx.stroke()
        
        // Find max response time for scaling
        let maxResponseTime = 0
        Object.values(stats.timeSeriesData).forEach(data => {
          data.forEach(point => {
            if (point.responseTime > maxResponseTime) maxResponseTime = point.responseTime
          })
        })
        maxResponseTime *= 1.2 // Add 20% padding
        
        // Draw lines for each endpoint
        const colors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2']
        
        stats.endpoints.forEach((endpoint, endpointIndex) => {
          const data = stats.timeSeriesData[endpoint]
          const color = colors[endpointIndex % colors.length]
          
          // Draw line
          ctx.beginPath()
          data.forEach((point, index) => {
            const x = padding + (index / (data.length - 1)) * chartWidth
            const y = canvas.height - padding - (point.responseTime / maxResponseTime) * chartHeight
            
            if (index === 0) {
              ctx.moveTo(x, y)
            } else {
              ctx.lineTo(x, y)
            }
          })
          ctx.strokeStyle = color
          ctx.lineWidth = 3
          ctx.stroke()
          
          // Draw points
          data.forEach((point, index) => {
            const x = padding + (index / (data.length - 1)) * chartWidth
            const y = canvas.height - padding - (point.responseTime / maxResponseTime) * chartHeight
            
            ctx.beginPath()
            ctx.arc(x, y, 5, 0, 2 * Math.PI)
            ctx.fillStyle = point.source === 'db' ? '#FF6B6B' : '#4ECDC4'
            ctx.fill()
            ctx.strokeStyle = '#fff'
            ctx.lineWidth = 2
            ctx.stroke()
          })
        })
        
        // Draw Y-axis labels
        ctx.fillStyle = '#666'
        ctx.font = '12px Arial'
        ctx.textAlign = 'right'
        ctx.textBaseline = 'middle'
        
        for (let i = 0; i <= 5; i++) {
          const y = canvas.height - padding - (i / 5) * chartHeight
          const value = Math.round((i / 5) * maxResponseTime)
          ctx.fillText(`${value} ms`, padding - 10, y)
          
          // Grid line
          ctx.beginPath()
          ctx.moveTo(padding, y)
          ctx.lineTo(canvas.width - padding, y)
          ctx.strokeStyle = '#eee'
          ctx.stroke()
        }
        
        // Draw X-axis labels
        if (stats.endpoints.length > 0) {
          const data = stats.timeSeriesData[stats.endpoints[0]]
          ctx.fillStyle = '#666'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'top'
          
          for (let i = 0; i < data.length; i += Math.ceil(data.length / 5)) {
            const x = padding + (i / (data.length - 1)) * chartWidth
            ctx.fillText(data[i].time, x, canvas.height - padding + 10)
          }
        }
        
        // Draw legend
        const legendY = padding / 2
        let legendX = padding
        
        stats.endpoints.forEach((endpoint, index) => {
          const color = colors[index % colors.length]
          
          ctx.fillStyle = color
          ctx.fillRect(legendX, legendY - 6, 20, 12)
          
          ctx.fillStyle = '#333'
          ctx.textAlign = 'left'
          ctx.textBaseline = 'middle'
          ctx.fillText(endpoint, legendX + 25, legendY)
          
          legendX += ctx.measureText(endpoint).width + 50
        })
      }
    }
  }, [stats])

  // Draw bar chart
  useEffect(() => {
    if (barChartRef.current && stats.endpoints.length > 0) {
      const canvas = barChartRef.current
      const ctx = canvas.getContext('2d')
      
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        
        // Set dimensions
        const padding = 40
        const chartWidth = canvas.width - padding * 2
        const chartHeight = canvas.height - padding * 2
        
        // Draw axes
        ctx.beginPath()
        ctx.moveTo(padding, padding)
        ctx.lineTo(padding, canvas.height - padding)
        ctx.lineTo(canvas.width - padding, canvas.height - padding)
        ctx.strokeStyle = '#333'
        ctx.stroke()
        
        // Find max response time for scaling
        let maxResponseTime = 0
        stats.endpoints.forEach(endpoint => {
          const max = stats.maxResponseTimes[endpoint]
          if (max > maxResponseTime) maxResponseTime = max
        })
        maxResponseTime *= 1.2 // Add 20% padding
        
        // Draw bars for each endpoint
        const barWidth = chartWidth / stats.endpoints.length / 4
        const groupWidth = barWidth * 3 + 20
        
        stats.endpoints.forEach((endpoint, index) => {
          const x = padding + index * groupWidth + 10
          
          // Min bar
          const minHeight = (stats.minResponseTimes[endpoint] / maxResponseTime) * chartHeight
          const minY = canvas.height - padding - minHeight
          
          ctx.fillStyle = '#4ECDC4' // Teal
          ctx.fillRect(x, minY, barWidth, minHeight)
          
          // Avg bar
          const avgHeight = (stats.avgResponseTimes[endpoint] / maxResponseTime) * chartHeight
          const avgY = canvas.height - padding - avgHeight
          
          ctx.fillStyle = '#FFD166' // Yellow
          ctx.fillRect(x + barWidth + 5, avgY, barWidth, avgHeight)
          
          // Max bar
          const maxHeight = (stats.maxResponseTimes[endpoint] / maxResponseTime) * chartHeight
          const maxY = canvas.height - padding - maxHeight
          
          ctx.fillStyle = '#FF6B6B' // Red
          ctx.fillRect(x + barWidth * 2 + 10, maxY, barWidth, maxHeight)
          
          // Label
          ctx.fillStyle = '#333'
          ctx.font = '12px Arial'
          ctx.textAlign = 'center'
          ctx.fillText(endpoint.split('/').pop() || '', x + barWidth * 1.5 + 5, canvas.height - padding + 15)
          
          // Values
          ctx.font = '10px Arial'
          ctx.fillStyle = '#4ECDC4'
          ctx.fillText(`${stats.minResponseTimes[endpoint]}`, x + barWidth / 2, minY - 5)
          
          ctx.fillStyle = '#FFD166'
          ctx.fillText(`${stats.avgResponseTimes[endpoint]}`, x + barWidth * 1.5 + 5, avgY - 5)
          
          ctx.fillStyle = '#FF6B6B'
          ctx.fillText(`${stats.maxResponseTimes[endpoint]}`, x + barWidth * 2.5 + 10, maxY - 5)
        })
        
        // Draw Y-axis labels
        ctx.fillStyle = '#666'
        ctx.font = '12px Arial'
        ctx.textAlign = 'right'
        ctx.textBaseline = 'middle'
        
        for (let i = 0; i <= 5; i++) {
          const y = canvas.height - padding - (i / 5) * chartHeight
          const value = Math.round((i / 5) * maxResponseTime)
          ctx.fillText(`${value} ms`, padding - 10, y)
          
          // Grid line
          ctx.beginPath()
          ctx.moveTo(padding, y)
          ctx.lineTo(canvas.width - padding, y)
          ctx.strokeStyle = '#eee'
          ctx.stroke()
        }
        
        // Draw legend
        const legendY = padding / 2
        let legendX = padding
        
        const legendItems = [
          { label: 'Min', color: '#4ECDC4' },
          { label: 'Avg', color: '#FFD166' },
          { label: 'Max', color: '#FF6B6B' }
        ]
        
        legendItems.forEach(item => {
          ctx.fillStyle = item.color
          ctx.fillRect(legendX, legendY - 6, 20, 12)
          
          ctx.fillStyle = '#333'
          ctx.textAlign = 'left'
          ctx.textBaseline = 'middle'
          ctx.fillText(item.label, legendX + 25, legendY)
          
          legendX += ctx.measureText(item.label).width + 50
        })
      }
    }
  }, [stats])


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-purple-500 border-purple-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-purple-500 font-medium">Loading data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <><div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
        <h2 className="text-3xl font-bold mb-2">API Performance Dashboard</h2>
        <p className="opacity-80">Real-time monitoring of API response times and cache efficiency</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Requests */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border-t-4 border-purple-500">
          <div className="p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-full p-3">
                <svg className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm font-medium">Total Requests</h3>
                <p className="text-2xl font-bold text-gray-900">{apiData.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Avg Response Time */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border-t-4 border-indigo-500">
          <div className="p-6">
            <div className="flex items-center">
              <div className="bg-indigo-100 rounded-full p-3">
                <svg className="h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm font-medium">Avg Response Time</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(apiData.reduce((acc, item) => acc + item.responseTime, 0) / apiData.length)} ms
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Cache Hit Rate */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border-t-4 border-teal-500">
          <div className="p-6">
            <div className="flex items-center">
              <div className="bg-teal-100 rounded-full p-3">
                <svg className="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm font-medium">Cache Hit Rate</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((apiData.filter(item => item.source === 'cache').length / apiData.length) * 100)}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Endpoints */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border-t-4 border-pink-500">
          <div className="p-6">
            <div className="flex items-center">
              <div className="bg-pink-100 rounded-full p-3">
                <svg className="h-8 w-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-gray-500 text-sm font-medium">Unique Endpoints</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.endpoints.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LineChartComponent stats={stats} />
        <BarChartComponent stats={stats} />
      </div>

  
    </div><div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.endpoints.map((endpoint) => (
          <div key={endpoint} className="bg-white rounded-xl shadow-md overflow-hidden border-l-4 border-indigo-500">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">{endpoint}</h3>

              <div className="space-y-4">
                {/* Response Time Stats */}
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Min Response Time</p>
                    <p className="text-xl font-bold text-teal-500">{stats.minResponseTimes[endpoint]} ms</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Avg Response Time</p>
                    <p className="text-xl font-bold text-indigo-500">{stats.avgResponseTimes[endpoint]} ms</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Max Response Time</p>
                    <p className="text-xl font-bold text-red-500">{stats.maxResponseTimes[endpoint]} ms</p>
                  </div>
                </div>

                {/* Source Distribution */}
                <div>
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Source Distribution</span>
                    <span>
                      DB: {stats.dbVsCacheCount[endpoint].db} / Cache: {stats.dbVsCacheCount[endpoint].cache}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-teal-500 to-indigo-500 rounded-full"
                      style={{
                        width: `${(stats.dbVsCacheCount[endpoint].cache /
                            (stats.dbVsCacheCount[endpoint].db + stats.dbVsCacheCount[endpoint].cache)) *
                          100}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Cache Hit Rate */}
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-full border-4 border-indigo-500 flex items-center justify-center">
                    <span className="text-lg font-bold text-indigo-500">
                      {Math.round(
                        (stats.dbVsCacheCount[endpoint].cache /
                          (stats.dbVsCacheCount[endpoint].db + stats.dbVsCacheCount[endpoint].cache)) *
                        100
                      )}%
                    </span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Cache Hit Rate</p>
                    <p className="text-lg font-medium">
                      {stats.dbVsCacheCount[endpoint].cache} out of {stats.dbVsCacheCount[endpoint].db + stats.dbVsCacheCount[endpoint].cache} requests
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div><div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Current API Stats</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Endpoint</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Response Time (ms)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Timestamp</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {apiData.slice().reverse().slice(0, 20).map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.endpoint}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.source === 'db'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-teal-100 text-teal-800'}`}>
                        {item.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.responseTime}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div></>
    )
}
