import React, { useState, useMemo, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './Reporting.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Reporting({ products, transactions }) {
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });
  const [reportType, setReportType] = useState('sales');

  // Safe data handling - provide defaults if props are undefined
  const safeProducts = products || [];
  const safeTransactions = transactions || [];

  // Use useCallback to memoize calculateReportData function
  const calculateReportData = useCallback(() => {
    // Filter transactions by date range
    const filteredTransactions = safeTransactions.filter((transaction) => {
      if (!transaction || !transaction.date) return false;

      const transactionDate = new Date(transaction.date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      return transactionDate >= startDate && transactionDate <= endDate;
    });

    // Calculate sales data
    const salesData = filteredTransactions
      .filter((t) => t && t.type === 'sale')
      .reduce((acc, transaction) => {
        return acc + (transaction.quantity || 0) * (transaction.price || 0);
      }, 0);

    // Calculate stock received data
    const stockReceivedData = filteredTransactions
      .filter((t) => t && t.type === 'restock')
      .reduce((acc, transaction) => {
        return acc + (transaction.quantity || 0) * (transaction.cost || 0);
      }, 0);

    // Find top selling products
    const productSales = {};
    filteredTransactions
      .filter((t) => t && t.type === 'sale')
      .forEach((transaction) => {
        if (!transaction.productId) return;

        if (!productSales[transaction.productId]) {
          productSales[transaction.productId] = {
            quantity: 0,
            revenue: 0,
            product: safeProducts.find((p) => p && p.id === transaction.productId) || { name: 'Unknown Product' },
          };
        }
        productSales[transaction.productId].quantity += transaction.quantity || 0;
        productSales[transaction.productId].revenue += (transaction.quantity || 0) * (transaction.price || 0);
      });

    const topSellingProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Calculate low stock items
    const lowStockItems = safeProducts.filter(
      (product) => product && product.quantity <= product.minStockLevel
    );

    return {
      salesData,
      stockReceivedData,
      topSellingProducts: topSellingProducts || [],
      lowStockItems: lowStockItems || [],
      transactionCount: filteredTransactions.length,
    };
  }, [dateRange, safeProducts, safeTransactions]);

  // Generate chart data for top selling products using useMemo
  const chartData = useMemo(() => {
    const reportData = calculateReportData();

    // Ensure topSellingProducts is an array
    if (!reportData.topSellingProducts || !Array.isArray(reportData.topSellingProducts)) {
      return {
        labels: [],
        datasets: [
          {
            label: 'Quantity Sold',
            data: [],
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
          {
            label: 'Revenue (M)',
            data: [],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            yAxisID: 'y1',
          },
        ],
      };
    }

    return {
      labels: reportData.topSellingProducts.map((item) => item.product.name || 'Unknown'),
      datasets: [
        {
          label: 'Quantity Sold',
          data: reportData.topSellingProducts.map((item) => item.quantity || 0),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'Revenue (M)',
          data: reportData.topSellingProducts.map((item) => item.revenue || 0),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          yAxisID: 'y1',
        },
      ],
    };
  }, [calculateReportData]);

  // Chart options with dual axes
  const chartOptions = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Top Selling Products - Quantity vs Revenue',
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Quantity Sold',
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Revenue (M)',
        },
      },
    },
  }), []);

  const reportData = calculateReportData();

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
  };

  return (
    <div className="reporting">
      <h2>Reporting & Analytics</h2>

      <div className="report-controls">
        <div className="control-group">
          <label>Report Type:</label>
          <select value={reportType} onChange={handleReportTypeChange}>
            <option value="sales">Sales Report</option>
            <option value="inventory">Inventory Report</option>
            <option value="performance">Performance Analytics</option>
          </select>
        </div>

        <div className="control-group">
          <label>Date Range:</label>
          <div className="date-range">
            <input
              type="date"
              name="start"
              value={dateRange.start}
              onChange={handleDateChange}
            />
            <span>to</span>
            <input
              type="date"
              name="end"
              value={dateRange.end}
              onChange={handleDateChange}
            />
          </div>
        </div>
      </div>

      <div className="report-summary">
        <div className="summary-card">
          <h3>Total Sales</h3>
          <p className="summary-value">M{reportData.salesData.toFixed(2)}</p>
          <p className="summary-period">
            {dateRange.start} to {dateRange.end}
          </p>
        </div>

        <div className="summary-card">
          <h3>Stock Received</h3>
          <p className="summary-value">M{reportData.stockReceivedData.toFixed(2)}</p>
          <p className="summary-period">
            {dateRange.start} to {dateRange.end}
          </p>
        </div>

        <div className="summary-card">
          <h3>Transactions</h3>
          <p className="summary-value">{reportData.transactionCount}</p>
          <p className="summary-period">
            {dateRange.start} to {dateRange.end}
          </p>
        </div>

        <div className="summary-card">
          <h3>Low Stock Items</h3>
          <p className="summary-value">{reportData.lowStockItems.length}</p>
          <p className="summary-period">Needs attention</p>
        </div>
      </div>

      {reportType === 'sales' && (
        <div className="report-detail">
          {reportData.topSellingProducts.length > 0 && (
            <div className="chart-container">
              <Bar data={chartData} options={chartOptions} />
            </div>
          )}

          {reportData.topSellingProducts.length > 0 && (
            <table className="report-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity Sold</th>
                  <th>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {reportData.topSellingProducts.map((item, index) => (
                  <tr key={index}>
                    <td>{item.product.name}</td>
                    <td>{item.quantity}</td>
                    <td>M{item.revenue.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {reportType === 'inventory' && (
        <div className="report-detail">
          <h3>Inventory Status</h3>
          {safeProducts.length > 0 ? (
            <table className="report-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Current Stock</th>
                  <th>Minimum Level</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {safeProducts.map((product) => (
                  <tr
                    key={product.id}
                    className={product.quantity <= product.minStockLevel ? 'low-stock' : ''}
                  >
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>{product.minStockLevel}</td>
                    <td>
                      {product.quantity <= product.minStockLevel ? (
                        <span className="status-alert">Low Stock</span>
                      ) : (
                        <span className="status-ok">In Stock</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No products available.</p>
          )}
        </div>
      )}

      {reportType === 'performance' && (
        <div className="report-detail">
          <h3>Performance Analytics</h3>
          <div className="performance-cards">
            <div className="perf-card">
              <h4>Stock Turnover Rate</h4>
              <p>Calculating...</p>
            </div>
            <div className="perf-card">
              <h4>Profit Margin</h4>
              <p>Calculating...</p>
            </div>
            <div className="perf-card">
              <h4>Sales Trends</h4>
              <p>Calculating...</p>
            </div>
          </div>
        </div>
      )}

      <div className="report-actions">
        <button className="btn-print">Print Report</button>
      </div>
    </div>
  );
}

export default Reporting;