import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminVendorsRequest, fetchAdminUsersRequest, fetchAdminOrdersRequest } from '../../redux/adminActions';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  Download, Calendar, BarChart3, ChevronDown 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

const AdminReports = () => {
  const [dateFilter, setDateFilter] = useState('Last 30 Days');

  const dispatch = useDispatch();
  const { vendors = [], users = [], orders = [], vendorsLoading, loading: usersLoading, ordersLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminVendorsRequest());
    dispatch(fetchAdminUsersRequest());
    dispatch(fetchAdminOrdersRequest());
  }, [dispatch]);

  const isLoading = vendorsLoading || usersLoading || ordersLoading;

  // Master Date Filter
  const getFilteredData = (dataArray, dateField) => {
    const now = new Date();
    let limitDate = new Date(0);
    
    if (dateFilter === 'Last 7 Days') {
      limitDate = new Date();
      limitDate.setDate(now.getDate() - 7);
    } else if (dateFilter === 'Last 30 Days') {
      limitDate = new Date();
      limitDate.setDate(now.getDate() - 30);
    } else if (dateFilter === 'Last 90 Days') {
      limitDate = new Date();
      limitDate.setDate(now.getDate() - 90);
    }

    return dataArray.filter(item => {
      const d = new Date(item[dateField] || item.joined || item.created_at || item.date || Date.now());
      return d >= limitDate;
    });
  };

  const filteredUsers = getFilteredData(users, 'created_at');
  const filteredVendors = getFilteredData(vendors, 'joined');
  const filteredOrders = getFilteredData(orders, 'date');

  // Time Scale generator for the bar chart
  const generateTimeScale = (filter) => {
    const scales = [];
    
    if (filter === 'Last 7 Days') {
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        scales.push({
          label: d.toLocaleDateString('en-US', { weekday: 'short' }),
          start: new Date(d.setHours(0,0,0,0)),
          end: new Date(d.setHours(23,59,59,999))
        });
      }
    } else if (filter === 'Last 30 Days') {
      for (let i = 3; i >= 0; i--) {
        const end = new Date();
        end.setDate(end.getDate() - (i * 7));
        const start = new Date(end);
        start.setDate(start.getDate() - 6);
        scales.push({
          label: `Week ${4-i}`,
          start: new Date(start.setHours(0,0,0,0)),
          end: new Date(end.setHours(23,59,59,999))
        });
      }
    } else if (filter === 'Last 90 Days') {
      for (let i = 2; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        scales.push({
          label: d.toLocaleDateString('en-US', { month: 'short' }),
          monthNum: d.getMonth(),
          year: d.getFullYear()
        });
      }
    } else {
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        scales.push({
          label: d.toLocaleDateString('en-US', { month: 'short' }),
          monthNum: d.getMonth(),
          year: d.getFullYear()
        });
      }
    }
    return scales;
  };

  const timeScale = generateTimeScale(dateFilter);

  const orderVolumeData = timeScale.map(scale => {
    const oCount = filteredOrders.filter(o => {
      const d = new Date(o.date || Date.now());
      if (scale.start && scale.end) {
        return d >= scale.start && d <= scale.end;
      } else {
        return d.getMonth() === scale.monthNum && d.getFullYear() === scale.year;
      }
    }).length;
    return { month: scale.label, orders: oCount };
  });

  const activeUsers = filteredUsers.filter(u => u.is_active !== false && u.status !== 'Blocked').length;
  const suspendedUsers = filteredUsers.filter(u => u.is_active === false || u.status === 'Blocked').length;

  let userDistributionData = [
    { name: 'Active', value: activeUsers, color: '#3B82F6' },
    { name: 'Suspended', value: suspendedUsers, color: '#EF4444' },
  ].filter(d => d.value > 0);
  if (userDistributionData.length === 0) userDistributionData = [{ name: 'No Data', value: 1, color: '#E2E8F0' }];

  const activeVendors = filteredVendors.filter(v => v.approval_status === 'Approved').length;
  const pendingVendors = filteredVendors.filter(v => v.approval_status === 'Pending Approval').length;
  const rejectedVendors = filteredVendors.filter(v => v.approval_status === 'Rejected').length;

  let vendorDistributionData = [
    { name: 'Approved', value: activeVendors, color: '#3B82F6' },
    { name: 'Pending', value: pendingVendors, color: '#F59E0B' },
    { name: 'Rejected', value: rejectedVendors, color: '#EF4444' },
  ].filter(d => d.value > 0);
  if (vendorDistributionData.length === 0) vendorDistributionData = [{ name: 'No Data', value: 1, color: '#E2E8F0' }];

  // Custom Tooltip components for enterprise look
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-slate-200 shadow-lg rounded-lg p-3">
          <p className="text-sm font-bold text-slate-700 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-xs font-extrabold flex items-center gap-2" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 pb-10">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Reports</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Analyze platform growth, user activity, vendor trends, and marketplace performance.</p>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Date Filters */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg overflow-x-auto w-full md:w-auto">
            {['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Custom Range'].map(filter => (
              <button
                key={filter}
                onClick={() => setDateFilter(filter)}
                className={`px-4 py-1.5 text-xs font-extrabold rounded-md transition-all whitespace-nowrap flex-1 md:flex-none ${
                  dateFilter === filter 
                    ? 'bg-white text-[#0F172A] shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'
                }`}
              >
                {filter === 'Custom Range' ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Custom
                  </span>
                ) : filter}
              </button>
            ))}
          </div>
        </div>

        {/* Charts Layout */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C2410C]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* User Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-6 text-center">User Distribution</h2>
            <div className="h-[240px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userDistributionData}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {userDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Custom Legend */}
            <div className="grid grid-cols-2 gap-3 mt-2">
              {userDistributionData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs font-bold text-slate-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Vendor Distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-6 text-center">Vendor Distribution</h2>
            <div className="h-[240px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vendorDistributionData}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {vendorDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Custom Legend */}
            <div className="grid grid-cols-2 gap-3 mt-2">
              {vendorDistributionData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-xs font-bold text-slate-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Orders Over Time */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col lg:col-span-1 md:col-span-2">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-6 text-center lg:text-left">Orders Over Time</h2>
            <div className="flex-1 h-[240px] md:h-[300px] lg:h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orderVolumeData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11, fontWeight: 700 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 11, fontWeight: 700 }} />
                  <RechartsTooltip cursor={{ fill: '#F1F5F9' }} content={<CustomTooltip />} />
                  <Bar dataKey="orders" fill="#C2410C" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
