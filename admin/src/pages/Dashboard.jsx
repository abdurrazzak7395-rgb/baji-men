import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { 
  FaDollarSign, 
  FaUsers, 
  FaMoneyCheckAlt, 
  FaClock, 
  FaChartLine, 
  FaGamepad,
  FaShoppingBag,
  FaImage,
  FaTags,
  FaUserCheck,
  FaUserTimes,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaFilter,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf
} from 'react-icons/fa';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { FiRefreshCw, FiTrendingUp, FiTrendingDown, FiChevronDown } from "react-icons/fi";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dashboardData, setDashboardData] = useState({});
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date()
  });
  const [filterType, setFilterType] = useState('30days');
  const [showFilters, setShowFilters] = useState(false);
  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const base_url = import.meta.env.VITE_API_KEY_Base_URL;

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      const params = {
        startDate: dateRange.startDate.toISOString().split('T')[0],
        endDate: dateRange.endDate.toISOString().split('T')[0]
      };
      
      const response = await axios.get(`${base_url}/api/admin/dashboard`, { params });
      setDashboardData(response.data || {});
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setDashboardData({});
    }
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    const today = new Date();
    let startDate;
    
    switch(type) {
      case 'today':
        startDate = new Date();
        break;
      case '7days':
        startDate = new Date(today.setDate(today.getDate() - 7));
        break;
      case '30days':
        startDate = new Date(today.setDate(today.getDate() - 30));
        break;
      case '90days':
        startDate = new Date(today.setDate(today.getDate() - 90));
        break;
      case 'custom':
        return;
      default:
        startDate = new Date(today.setDate(today.getDate() - 30));
    }
    
    setDateRange({
      startDate,
      endDate: new Date()
    });
  };

  // Helper function to safely extract data with defaults
  const getData = (path, defaultValue = 0) => {
    if (!dashboardData || Object.keys(dashboardData).length === 0) return defaultValue;
    
    const paths = path.split('.');
    let value = dashboardData;
    
    for (const p of paths) {
      if (value && typeof value === 'object' && p in value) {
        value = value[p];
      } else {
        return defaultValue;
      }
    }
    
    return value !== null && value !== undefined ? value : defaultValue;
  };

  // Prepare data from backend response
  const summary = {
    users: {
      total: getData('summary.users.total', getData('data.users', 0)),
      today: getData('summary.users.today', 0),
      active: getData('summary.users.active', getData('data.activeUsers', 0))
    },
    financial: {
      totalBalance: getData('summary.financial.totalBalance', getData('data.totalBalance', 0)),
      totalDeposit: getData('summary.financial.totalDeposit', getData('data.totalDeposit', getData('data.deposits', 0))),
      totalWithdraw: getData('summary.financial.totalWithdraw', getData('data.totalWithdraw', getData('data.withdrawals', 0))),
      totalBet: getData('summary.financial.totalBet', 0),
      totalBonusBalance: getData('summary.financial.totalBonusBalance', 0)
    },
    deposits: {
      total: getData('summary.deposits.total', getData('data.deposits', 0)),
      todayAmount: getData('summary.deposits.todayAmount', 0)
    },
    withdrawals: {
      total: getData('summary.withdrawals.total', getData('data.withdrawals', 0)),
      todayAmount: getData('summary.withdrawals.todayAmount', 0)
    },
    games: {
      total: getData('summary.games.total', getData('data.games', 0)),
      active: getData('summary.games.active', 0),
      inactive: getData('summary.games.inactive', 0)
    },
    pendingApprovals: {
      deposits: getData('summary.pendingApprovals.deposits', getData('data.pendingDeposits', 0)),
      withdrawals: getData('summary.pendingApprovals.withdrawals', getData('data.pendingWithdrawals', 0))
    }
  };

  // Professional color palette
  const gradientColors = [
    'from-blue-600 to-blue-800',
    'from-green-600 to-green-800',
    'from-orange-600 to-orange-800',
    'from-purple-600 to-purple-800',
    'from-teal-600 to-teal-800',
    'from-red-600 to-red-800',
    'from-indigo-600 to-indigo-800',
    'from-cyan-600 to-cyan-800',
    'from-rose-600 to-rose-800',
    'from-amber-600 to-amber-800',
    'from-emerald-600 to-emerald-800',
    'from-violet-600 to-violet-800',
    'from-fuchsia-600 to-fuchsia-800',
    'from-lime-600 to-lime-800',
    'from-sky-600 to-sky-800'
  ];

  // Status cards data
  const statusCards = [
    {
      title: 'Total Users',
      value: summary.users.total || 0,
      icon: <FaUsers className="text-3xl text-white" />,
      description: `${summary.users.today || 0} new today`,
      trend: 'up'
    },
    {
      title: 'Total Deposits',
      value: `৳${(summary.financial.totalDeposit || 0).toLocaleString()}`,
      icon: <FaMoneyCheckAlt className="text-3xl text-white" />,
      description: `৳${(summary.deposits.todayAmount || 0).toLocaleString()} today`,
      trend: 'up'
    },
    {
      title: 'Total Withdrawals',
      value: `৳${(summary.financial.totalWithdraw || 0).toLocaleString()}`,
      icon: <FaBangladeshiTakaSign className="text-3xl text-white" />,
      description: `৳${(summary.withdrawals.todayAmount || 0).toLocaleString()} today`,
      trend: 'up'
    },
    {
      title: 'Pending Approvals',
      value: (summary.pendingApprovals.deposits || 0) + (summary.pendingApprovals.withdrawals || 0),
      icon: <FaClock className="text-3xl text-white" />,
      description: 'Requires attention',
      trend: 'neutral'
    },
    {
      title: 'Pending Deposits',
      value: summary.pendingApprovals.deposits || 0,
      icon: <FaHourglassHalf className="text-3xl text-white" />,
      description: `৳${0} pending`,
      trend: 'neutral'
    },
    {
      title: 'Pending Withdrawals',
      value: summary.pendingApprovals.withdrawals || 0,
      icon: <FaHourglassHalf className="text-3xl text-white" />,
      description: `৳${0} pending`,
      trend: 'neutral'
    },
    {
      title: 'Active Users',
      value: summary.users.active || 0,
      icon: <FaUserCheck className="text-3xl text-white" />,
      description: `${summary.users.total || 0} total users`,
      trend: 'up'
    },
    {
      title: 'Platform Balance',
      value: `৳${(summary.financial.totalBalance || 0).toLocaleString()}`,
      icon: <FaMoneyBillWave className="text-3xl text-white" />,
      description: 'Total user balances',
      trend: 'up'
    },
    {
      title: 'Total Games',
      value: summary.games.total || 0,
      icon: <FaGamepad className="text-3xl text-white" />,
      description: `${summary.games.active || 0} active games`,
      trend: 'up'
    },
    {
      title: 'Total Bets',
      value: `৳${(summary.financial.totalBet || 0).toLocaleString()}`,
      icon: <FaChartLine className="text-3xl text-white" />,
      description: 'All-time betting volume',
      trend: 'up'
    }
  ].map((card, index) => ({
    ...card,
    gradient: gradientColors[index % gradientColors.length]
  }));

  // Chart data - using real data from backend
  const financialData = [
    { name: 'Deposits', value: summary.financial.totalDeposit || 0 },
    { name: 'Withdrawals', value: summary.financial.totalWithdraw || 0 },
    { name: 'Bets', value: summary.financial.totalBet || 0 },
    { name: 'Balance', value: summary.financial.totalBalance || 0 },
    { name: 'Bonus', value: summary.financial.totalBonusBalance || 0 }
  ];

  const depositWithdrawalData = [
    {
      name: 'Deposits',
      value: summary.financial.totalDeposit || 0
    },
    {
      name: 'Withdrawals',
      value: summary.financial.totalWithdraw || 0
    }
  ];

  // Generate sample user registration data (you can replace with real data from backend)
  const generateUserRegistrationData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, index) => ({
      date: day,
      users: Math.floor(Math.random() * 30) + 10 + index * 5
    }));
  };

  const userRegistrationData = generateUserRegistrationData();

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-100">
          <p className="font-semibold text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'users' ? entry.value : `৳${entry.value.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Colors for charts
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#6EE7B7'];

  return (
    <section className="font-nunito min-h-screen bg-gray-50">
      <Header toggleSidebar={toggleSidebar} />

      <div className="flex pt-[10vh]">
        <Sidebar isOpen={isSidebarOpen} />

        <main className={`transition-all duration-300 flex-1 p-8 overflow-y-auto h-[90vh] ${isSidebarOpen ? 'md:ml-[40%] lg:ml-[28%] xl:ml-[17%]' : 'ml-0'}`}>
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-600 mt-2">Real-time insights and analytics for your platform.</p>
              </div>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={fetchDashboardData}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <FiRefreshCw />
                  Refresh
                </button>
              </div>
            </div>

            {/* Date Filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              {['today', '7days', '30days', '90days'].map((type) => (
                <button
                  key={type}
                  onClick={() => handleFilterChange(type)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    filterType === type
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {type === 'today' && 'Today'}
                  {type === '7days' && 'Last 7 Days'}
                  {type === '30days' && 'Last 30 Days'}
                  {type === '90days' && 'Last 90 Days'}
                </button>
              ))}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                <FaCalendarAlt />
                Custom Range
                <FiChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {showFilters && (
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-4">
                <div className="flex flex-wrap gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <DatePicker
                      selected={dateRange.startDate}
                      onChange={(date) => setDateRange(prev => ({ ...prev, startDate: date }))}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      dateFormat="yyyy-MM-dd"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <DatePicker
                      selected={dateRange.endDate}
                      onChange={(date) => setDateRange(prev => ({ ...prev, endDate: date }))}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      dateFormat="yyyy-MM-dd"
                    />
                  </div>
                  <button
                    onClick={() => handleFilterChange('custom')}
                    className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-10">
            {statusCards.map((card, index) => (
              <div
                key={index}
                className={`relative bg-gradient-to-r ${card.gradient} rounded-lg p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 min-h-[140px] flex flex-col`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-semibold uppercase tracking-wide opacity-90">{card.title}</p>
                    <h2 className="text-2xl font-bold mt-1 truncate">{card.value}</h2>
                  </div>
                  <div className="p-3 border-[1px] border-gray-200 text-gray-700 bg-opacity-20 rounded-full flex-shrink-0">
                    {card.icon}
                  </div>
                </div>
                <div className="flex items-center mt-auto text-sm opacity-90">
                  {card.trend === 'up' ? (
                    <FiTrendingUp className="mr-1 text-green-300" />
                  ) : card.trend === 'down' ? (
                    <FiTrendingDown className="mr-1 text-red-300" />
                  ) : null}
                  <span className="truncate">{card.description}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Financial Overview */}
          <div className="bg-white rounded-xl p-8 border-[1px] border-gray-200 mb-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Financial Overview</h3>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Period:</span>
                <span className="text-sm font-medium text-gray-800">
                  {dateRange.startDate.toLocaleDateString()} - {dateRange.endDate.toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart 
                    data={financialData} 
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <XAxis dataKey="name" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      content={<CustomTooltip />}
                      formatter={(value) => [`৳${value.toLocaleString()}`, 'Amount']}
                    />
                    <Bar dataKey="value" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 border-[1px] border-gray-200">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Financial Summary</h4>
                <div className="space-y-4">
                  {financialData.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{item.name}</span>
                      <span className="text-sm font-semibold text-gray-900">
                        ৳{(item.value).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* User Registration Trend */}
            <div className="bg-white rounded-xl p-8 border-[1px] border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">User Registration Trend (Last 7 Days)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={userRegistrationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Deposit vs Withdrawal */}
            <div className="bg-white rounded-xl p-8 border-[1px] border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Deposits vs Withdrawals</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={depositWithdrawalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    content={<CustomTooltip />}
                    formatter={(value) => [`৳${value.toLocaleString()}`, 'Amount']}
                  />
                  <Bar dataKey="value" fill="#10B981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-xl p-8 border-[1px] border-gray-200 mb-10">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">System Status & Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">User Growth</h4>
                    <p className="text-gray-600 text-sm">Monthly increase</p>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    +12.5%
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Deposit Rate</h4>
                    <p className="text-gray-600 text-sm">Success ratio</p>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    98.2%
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Withdrawal Time</h4>
                    <p className="text-gray-600 text-sm">Average processing</p>
                  </div>
                  <div className="text-2xl font-bold text-orange-600">
                    2.4h
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Platform Health</h4>
                    <p className="text-gray-600 text-sm">Overall status</p>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    Excellent
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity - Only show if data exists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 border-[1px] border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Users</h3>
              <div className="space-y-4">
                {getData('recentActivities.users', []).length > 0 ? (
                  getData('recentActivities.users', []).slice(0, 5).map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <FaUserCheck className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.username || 'Unknown'}</p>
                          <p className="text-sm text-gray-600">{user.player_id || 'N/A'}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No recent user data available
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 border-[1px] border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Deposits</h3>
              <div className="space-y-4">
                {getData('recentActivities.deposits', []).length > 0 ? (
                  getData('recentActivities.deposits', []).slice(0, 5).map((deposit, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900">
                          {deposit.userId?.username || 'Unknown User'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {deposit.method || 'N/A'} • {deposit.status || 'N/A'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">৳{(deposit.amount || 0).toLocaleString()}</p>
                        <p className="text-sm text-gray-500">
                          {deposit.createdAt ? new Date(deposit.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No recent deposit data available
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default Dashboard;