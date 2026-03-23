import { useEffect, useState, useMemo } from "react";
import DashboardCard from "../../components/UI/DashboardCard";
import { FiCalendar, FiUsers, FiDollarSign, FiStar } from "react-icons/fi";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line
} from "recharts";
//
const MonthlyRevenueChart = ({ data }) => {
  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h4 className="font-medium mb-2">Revenue (last 3 months)</h4>
      <p className="text-xs text-gray-400 mb-10">
        Revenue (Last 3 months) Hover for details.
      </p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 12, right: 16, left: 0, bottom: 8 }}
          >
            <defs>
              <linearGradient id="rev-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.55} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#1f2937" />
            <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 12 }} />
            <YAxis
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              tickFormatter={(v) =>
                v >= 1000 ? `Rs.${Math.round(v / 1000)}k` : `Rs.${v}`
              }
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              wrapperStyle={{ outline: "none" }}
              contentStyle={{
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: 10,
                color: "#e5e7eb",
                padding: "6px 8px",
              }}
              formatter={(v) => [
                `Rs.${Number(v).toLocaleString("en-LK")}`,
                "Revenue",
              ]}
              labelStyle={{ color: "#c7d2fe" }}
            />
            <Bar
              dataKey="revenue"
              name="Revenue"
              fill="url(#rev-grad)"
              radius={[8, 8, 4, 4]}
              barSize={26}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ── Revenue + MoM Growth (dual-axis) ──────────────────────────────────────────
const RevenueMoMChart = ({ data }) => {
  // Show bars for % change (right axis) + line for revenue (left axis)
  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h4 className="font-medium mb-2">Revenue vs MoM Growth</h4>
      <p className="text-xs text-gray-400 mb-10">
        Monthly revenue (line) with month-over-month change (bars).
      </p>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 12, right: 16, left: 0, bottom: 8 }}
          >
            <defs>
              <linearGradient id="momo-bar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#22c55e" stopOpacity={0.55} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} stroke="#1f2937" />
            <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 12 }} />

            {/* Left axis: revenue (Rs) */}
            <YAxis
              yAxisId="left"
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              tickFormatter={(v) =>
                v >= 1000 ? `Rs.${Math.round(v / 1000)}k` : `Rs.${v}`
              }
            />

            {/* Right axis: growth % (can be negative) */}
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              tickFormatter={(v) => `${v}%`}
              domain={[-100, 100]}
            />

            <Tooltip
              cursor={{ fill: "transparent" }}
              wrapperStyle={{ outline: "none" }}
              contentStyle={{
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: 10,
                color: "#e5e7eb",
                padding: "6px 8px",
              }}
              formatter={(value, name) => {
                if (name === "MoM") {
                  return [`${Number(value).toFixed(1)}%`, "MoM"];
                }
                return [`Rs.${Number(value).toLocaleString("en-LK")}`, "Revenue"];
              }}
              labelStyle={{ color: "#c7d2fe" }}
            />

            {/* Bars: MoM % on right axis */}
            <Bar
              yAxisId="right"
              dataKey="growthPct"
              name="MoM"
              fill="url(#momo-bar)"
              barSize={18}
              radius={[6, 6, 4, 4]}
            />

            {/* Line: revenue on left axis */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#60a5fa"
              strokeWidth={3}
              dot={{ r: 3, stroke: "#0b1220", strokeWidth: 2 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const RevenueMoMPie = ({ data }) => {
  const prev = data?.[0];
  const curr = data?.[1];

  const prevVal = Math.max(0, Number(prev?.revenue || 0));
  const currVal = Math.max(0, Number(curr?.revenue || 0));
  const total = prevVal + currVal;

  const slices = total
    ? [
        { name: prev?.month || "Previous", value: prevVal },
        { name: curr?.month || "Current", value: currVal },
      ]
    : [];

  const growthPct =
    prevVal > 0 ? Number((((currVal - prevVal) / prevVal) * 100).toFixed(1)) : null;

  const COLORS = ["#facc15","#DC143C"]; 

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const { name, value } = payload[0].payload;
    const pct = total ? ((value / total) * 100).toFixed(1) : "0.0";
    return (
      <div
        style={{
          background: "#0f172a",
          border: "1px solid #334155",
          borderRadius: 10,
          color: "#e5e7eb",
          padding: "6px 8px",
        }}
      >
        <div style={{ fontWeight: 600, color: "#c7d2fe" }}>{name}</div>
        <div>Revenue: Rs.{Number(value).toLocaleString("en-LK")}</div>
        <div>Share: {pct}%</div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 rounded-lg p-4">
      <h4 className="font-medium mb-2">MoM Revenue Comparison</h4>
      <p className="text-xs text-gray-400 mb-3">
        Current vs previous month as percentage of total revenue.
      </p>

      <div className="h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              paddingAngle={0}
              stroke="rgba(17,24,39,0.9)"
              strokeWidth={1}
              labelLine={false}
              label={({ name, value }) =>
                total ? `${name} • ${((value / total) * 100).toFixed(1)}%` : ""
              }
            >
              {slices.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "transparent" }}
              wrapperStyle={{ outline: "none" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-center">
        <div className="text-xs text-gray-400">Month-over-Month Change</div>
        <div
          className={`text-2xl font-semibold ${
            growthPct == null
              ? "text-indigo-200"
              : growthPct >= 0
              ? "text-green-300"
              : "text-red-300"
          }`}
        >
          {growthPct == null ? "—" : `${growthPct}%`}
        </div>
      </div>

      <div className="mt-3 flex justify-center gap-3">
        {slices.map((s, i) => (
          <span
            key={s.name + i}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-900/50 bg-indigo-950/40 px-2.5 py-1 text-xs text-indigo-100"
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: COLORS[i % COLORS.length] }}
            />
            {s.name}
          </span>
        ))}
      </div>
    </div>
  );
};


// const TopServicesPie = ({ data }) => {
//   // Curated, harmonious palette
//   const COLORS = ["#8b5cf6","#22c55e","#f59e0b","#ef4444","#38bdf8","#a78bfa","#34d399","#f472b6"];

//   // Build top N + Others
//   const TOP_N = 6;
//   const sorted = [...data]
//     .map(d => ({ name: d.service || "Unknown", value: Number(d.count || 0) }))
//     .filter(d => d.value > 0)
//     .sort((a, b) => b.value - a.value);

//   const top = sorted.slice(0, TOP_N);
//   const othersCount = sorted.slice(TOP_N).reduce((s, d) => s + d.value, 0);
//   const pieData = othersCount > 0 ? [...top, { name: "Others", value: othersCount }] : top;

//   const total = pieData.reduce((s, d) => s + d.value, 0) || 0;
//   const pct = (v) => (total ? ((v / total) * 100).toFixed(1) : "0.0");

//   const CustomTooltip = ({ active, payload }) => {
//     if (!active || !payload || !payload.length) return null;
//     const { name, value } = payload[0].payload;
//     return (
//       <div
//         style={{
//           background: "#0f172a",
//           border: "1px solid #334155",
//           borderRadius: 10,
//           color: "#e5e7eb",
//           padding: "6px 8px",
//         }}
//       >
//         <div style={{ fontWeight: 600, color: "#c7d2fe" }}>{name}</div>
//         <div>Count: {value.toLocaleString("en-LK")}</div>
//         <div>Share: {pct(value)}%</div>
//       </div>
//     );
//   };

//   return (
//     <div className="bg-gray-900 rounded-lg p-4">
//       <h4 className="font-medium mb-2">Top services (by count)</h4>
//       <p className="text-xs text-gray-400 mb-3">
//         Distribution of recent service usage. Hover for details.
//       </p>

//       <div className="h-64 relative">
//         <ResponsiveContainer width="100%" height="100%">
//           <PieChart>
//             <defs>
//               {COLORS.map((c, i) => (
//                 <linearGradient id={`svc-grad-${i}`} key={i} x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="0%" stopColor={c} stopOpacity={0.95} />
//                   <stop offset="100%" stopColor={c} stopOpacity={0.55} />
//                 </linearGradient>
//               ))}
//             </defs>

//             <Pie
//               data={pieData}
//               dataKey="value"
//               nameKey="name"
//               cx="50%"
//               cy="50%"
//               innerRadius={50}
//               outerRadius={92}
//               paddingAngle={2}
//               stroke="rgba(17,24,39,0.9)"
//               strokeWidth={2}
//               isAnimationActive
//               labelLine={false}
//               label={({ name, value }) => `${name} • ${pct(value)}%`}
//             >
//               {pieData.map((_, idx) => (
//              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />

//               ))}
//             </Pie>

//             <Tooltip content={<CustomTooltip />} cursor={{fill:"transparent"}} wrapperStyle={{ outline: "none" }} />
//           </PieChart>
//         </ResponsiveContainer>

//         {/* Center total */}
//         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//           <div className="text-center">
//             <div className="text-xs text-gray-400">Total services</div>
//             <div className="text-2xl font-semibold text-indigo-200">
//               {total.toLocaleString("en-LK")}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Chip legend with color + count + % */}
//       <div className="mt-3 flex flex-wrap gap-2">
//         {pieData.map((d, i) => (
//           <span
//             key={d.name + i}
//             className="inline-flex items-center gap-2 rounded-full border border-indigo-900/50 bg-indigo-950/40 px-2.5 py-1 text-xs text-indigo-100"
//           >
//             <span
//               className="inline-block h-2 w-2 rounded-full"
//               style={{ background: COLORS[i % COLORS.length] }}
//             />
//             {d.name}: {d.value.toLocaleString("en-LK")} ({pct(d.value)}%)
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// }
// https://localhost:7014/api
// https://nvsalonbackend.dockyardsoftware.com/api
const API_BASE_URL = "https://nvsalonbackend.dockyardsoftware.com/api";

const buildLast3Months = () => {
  const now = new Date();
  return [1, 2, 3].map((off) => {
    const d = new Date(now.getFullYear(), now.getMonth() - off, 1);
    return {
      Year: d.getFullYear(),
      Month: d.getMonth() + 1,
      label: d.toLocaleString("en-US", { month: "short" }), // Sep, Oct, Nov
    };
  });
};

const currentMonthLabel = () =>
  new Date().toLocaleString("en-US", { month: "short" });

const AdminDashboard = () => {
  const [todayAppointments, setTodayAppointments] = useState(0);
  const [staffCount, setStaffCount] = useState(0);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const [revenue, setRevenue] = useState(null);
  const [loadingRevenue, setLoadingRevenue] = useState(false);

  const [revenueSeries, setRevenueSeries] = useState([]); // [{ month: 'Sep', revenue: 12345 }, ...]

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Authentication token missing");
      setLoadingAppointments(false);
      setLoadingStaff(false);
      setLoadingRecent(false);
      setLoadingRevenue(false);
      return;
    }

    const fetchTodayAppointments = async () => {
      try {
        setLoadingAppointments(true);
        const response = await fetch(
          `${API_BASE_URL}/Appointment/count-today`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok)
          throw new Error(`Failed to fetch: ${response.statusText}`);
        const data = await response.json();
        setTodayAppointments(data.TodayCount ?? 0);
      } catch (error) {
        console.error("Error fetching today's appointments:", error);
        setTodayAppointments(0);
      } finally {
        setLoadingAppointments(false);
      }
    };

    const fetchStaffCount = async () => {
      try {
        setLoadingStaff(true);
        const response = await fetch(`${API_BASE_URL}/AdminAuth/staffcount`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok)
          throw new Error(
            `Failed to fetch staff count: ${response.statusText}`
          );
        const data = await response.json();
        setStaffCount(data.StaffCount ?? 0);
      } catch (error) {
        console.error("Error fetching staff count:", error);
        setStaffCount(0);
      } finally {
        setLoadingStaff(false);
      }
    };

    const fetchRecentAppointments = async () => {
      try {
        setLoadingRecent(true);
        const response = await fetch(
          `${API_BASE_URL}/Appointment/recent?count=5`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok)
          throw new Error(
            `Failed to fetch recent appointments: ${response.statusText}`
          );
        const data = await response.json();
        setRecentAppointments(data);
      } catch (error) {
        console.error("Error fetching recent appointments:", error);
        setRecentAppointments([]);
      } finally {
        setLoadingRecent(false);
      }
    };

    const fetchRevenue = async () => {
      try {
        setLoadingRevenue(true);
        const response = await fetch(
          `${API_BASE_URL}/AdminAuth/monthly-revenue`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              Year: new Date().getFullYear(),
              Month: new Date().getMonth() + 1,
            }),
          }
        );

        if (!response.ok)
          throw new Error(`Failed to fetch revenue: ${response.statusText}`);
        const data = await response.json();
        setRevenue(data.Revenue ?? 0);
      } catch (error) {
        console.error("Error fetching revenue:", error);
        setRevenue(0);
      } finally {
        setLoadingRevenue(false);
      }
    };

    const fetchRevenueSeries = async (token) => {
      const months = buildLast3Months();
      try {
        const results = await Promise.all(
          months.map(async ({ Year, Month, label }) => {
            const res = await fetch(
              `${API_BASE_URL}/AdminAuth/monthly-revenue`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ Year, Month }),
              }
            );
            if (!res.ok) return { month: label, revenue: 0 };
            const data = await res.json();
            return { month: label, revenue: data.Revenue ?? 0 };
          })
        );
        setRevenueSeries(results.reverse()); // oldest → newest
      } catch {
        setRevenueSeries([]);
      }
    };

    fetchTodayAppointments();
    fetchStaffCount();
    fetchRecentAppointments();
    fetchRevenue();
    fetchRevenueSeries(token);
  }, []);

  const stats = {
    appointments: todayAppointments,
    staffMembers: staffCount,
    revenue: revenue,
    rating: 4.8,
  };


  const momoSeries = useMemo(() => {
  return revenueSeries.map((d, i, arr) => {
    const prev = i > 0 ? arr[i - 1].revenue : null;
    const growthPct =
      prev && prev !== 0 ? ((d.revenue - prev) / prev) * 100 : null;
    return { ...d, growthPct: growthPct !== null ? Number(growthPct.toFixed(1)) : null };
  });
}, [revenueSeries]);

  const statusData = useMemo(() => {
    const counts = recentAppointments.reduce((acc, a) => {
      const s = (a.Status || a.status || "Unknown").toString();
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [recentAppointments]);

  // Build service frequency for a bar chart
  const serviceData = useMemo(() => {
    const counts = recentAppointments.reduce((acc, a) => {
      const raw = (a.ServiceName || a.serviceName || "").trim();
      // split on comma/semicolon if multiple services are returned as a single string
      const parts = raw
        ? raw
            .split(/[;,]/)
            .map((s) => s.trim())
            .filter(Boolean)
        : ["Unknown"];
      parts.forEach((p) => {
        acc[p] = (acc[p] || 0) + 1;
      });
      return acc;
    }, {});
    return Object.entries(counts).map(([service, count]) => ({
      service,
      count,
    }));
  }, [recentAppointments]);



  const momoTwoSeries = useMemo(() => {

  const prev = revenueSeries.length ? revenueSeries[revenueSeries.length - 1] : null;

 
  if (!prev || revenue == null) return [];

  const growthPct =
    prev.revenue && prev.revenue !== 0
      ? Number((((revenue - prev.revenue) / prev.revenue) * 100).toFixed(1))
      : null;

  return [
    { month: prev.month, revenue: prev.revenue, growthPct: null }, 
    { month: currentMonthLabel(), revenue, growthPct },
  ];
}, [revenueSeries, revenue]);

  
  // const PIE_COLORS = [
  //   "#8884d8",
  //   "#82ca9d",
  //   "#ffc658",
  //   "#ff8042",
  //   "#8dd1e1",
  //   "#a4de6c",
  //   "#d0ed57",
  // ];

  // Helper to format datetime from separate date and time strings
  const formatDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return "Invalid Date";
    // Combine to ISO 8601 format for Date parsing
    const isoString = dateStr.split("T")[0] + "T" + timeStr;
    const dateObj = new Date(isoString);
    return isNaN(dateObj) ? "Invalid Date" : dateObj.toLocaleString();
  };

  // Helper to render appointment status with color badges
  const renderStatus = (status) => {
    let bgColor = "bg-purple-900 text-purple-200"; // default
    if (!status)
      return (
        <span className={`px-2 py-1 text-xs rounded-full ${bgColor}`}>
          Unknown
        </span>
      );

    switch (status.toLowerCase()) {
      case "completed":
        bgColor = "bg-green-900 text-green-200";
        break;
      case "scheduled":
        bgColor = "bg-yellow-900 text-yellow-200";
        break;
      case "cancelled":
      case "canceled":
        bgColor = "bg-red-900 text-red-200";
        break;
      // add more statuses as needed
      default:
        bgColor = "bg-purple-900 text-purple-200";
    }

    return (
      <span className={`px-2 py-1 text-xs rounded-full ${bgColor}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-8">Admin Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            icon={<FiCalendar size={24} />}
            title="Today's Appointments"
            value={loadingAppointments ? "Loading..." : stats.appointments}
            change=""
            color="purple"
          />
          <DashboardCard
            icon={<FiUsers size={24} />}
            title="Staff Members"
            value={loadingStaff ? "Loading..." : stats.staffMembers}
            change=""
            color="blue"
          />
          <DashboardCard
            icon={<FiDollarSign size={24} />}
            title="Monthly Revenue"
            value={`Rs.${stats.revenue}`}
            change="12% from last month"
            color="green"
          />
          <DashboardCard
            icon={<FiStar size={24} />}
            title="Average Rating"
            value={stats.rating}
            change="+0.2 this month"
            color="yellow"
          />
        </div>

        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">
            Elegance Salon — Insights
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MonthlyRevenueChart data={revenueSeries} />
            {/* <RevenueMoMChart data={momoTwoSeries} /> */}
            <RevenueMoMPie data={momoTwoSeries} />

            {/* <TopServicesPie data={serviceData} /> */}
          </div>
        </div>

        {/* <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Recent Appointments</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Services</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loadingRecent ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-center text-gray-400">Loading...</td>
                  </tr>
                ) : recentAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-3 text-center text-gray-400">No recent appointments found.</td>
                  </tr>
                ) : (
                  recentAppointments.map((appointment) => (
                    <tr key={appointment.Id || appointment.id} className="hover:bg-gray-700 transition">
                      <td className="px-4 py-3 whitespace-nowrap">{appointment.UserName || appointment.userName || 'N/A'}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {appointment.ServiceName || 'N/A'}

                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {formatDateTime(appointment.AppointmentDate || appointment.appointmentDate, appointment.AppointmentTime || appointment.appointmentTime)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {renderStatus(appointment.Status || appointment.status || 'Upcoming')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default AdminDashboard;
