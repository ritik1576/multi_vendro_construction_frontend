import { Package, TrendingUp, AlertTriangle, Plus, LayoutDashboard, ShoppingBag, Eye, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import VendorStatCard from '../../components/vendor/VendorStatCard';

const VendorDashboard = () => {
  // Dummy data for the table
  const recentProducts = [
    { id: 1, sku: 'CEM-UTC-50', name: 'UltraTech Cement 50kg', category: 'Cement', stock: 150, price: '₹400', status: 'In Stock', image: 'https://ui-avatars.com/api/?name=U+T&background=f1f5f9&color=64748b' },
    { id: 2, sku: 'STL-JSW-12', name: 'JSW Steel TMT Bar 12mm', category: 'Steel', stock: 12, price: '₹75/kg', status: 'Low Stock', image: 'https://ui-avatars.com/api/?name=J+S&background=f1f5f9&color=64748b' },
    { id: 3, sku: 'PLY-CEN-18', name: 'Century Ply 18mm', category: 'Plywood', stock: 0, price: '₹1200', status: 'Out of Stock', image: 'https://ui-avatars.com/api/?name=C+P&background=f1f5f9&color=64748b' },
    { id: 4, sku: 'PNT-ASN-20', name: 'Asian Paints Apex 20L', category: 'Paints', stock: 45, price: '₹3500', status: 'In Stock', image: 'https://ui-avatars.com/api/?name=A+P&background=f1f5f9&color=64748b' },
  ];

  const lowStockProducts = recentProducts.filter(p => p.stock <= 15);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-xl bg-[#1E3A8A]/10 text-[#1E3A8A]">
            <LayoutDashboard className="h-8 w-8" />
          </div>
          <div>
            <p className="text-xs font-extrabold tracking-widest text-[#F97316] uppercase mb-1">InfraMart Vendor</p>
            <h1 className="text-2xl font-extrabold text-[#0F172A]">Vendor Dashboard</h1>
            <p className="text-sm font-medium text-slate-500">Manage your products, track inventory, and view sales.</p>
          </div>
        </div>
        <Link 
          to="/vendor/products/add" 
          className="flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#F97316] px-5 py-2 font-extrabold text-white transition-colors hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-500/30 shadow-sm"
        >
          <Plus className="h-5 w-5" />
          Add New Product
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <VendorStatCard title="Total Products" value="124" icon={Package} trend={5} />
        <VendorStatCard title="Total Revenue" value="₹12.4L" icon={TrendingUp} trend={12} />
        <VendorStatCard title="Active Orders" value="38" icon={ShoppingBag} trend={8} />
        <VendorStatCard title="Low Stock Alerts" value="8" icon={AlertTriangle} trend={-2} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Products Table */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-lg font-extrabold text-[#0F172A]">Recent Products Overview</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="h-10 w-10 rounded bg-slate-100 object-cover border border-slate-200" />
                        <div>
                          <p className="font-bold text-slate-900">{product.name}</p>
                          <p className="text-xs text-slate-500">{product.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{product.sku}</td>
                    <td className="px-6 py-4">{product.stock}</td>
                    <td className="px-6 py-4 font-semibold">{product.price}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-bold ring-1 ring-inset ${
                        product.status === 'In Stock' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' :
                        product.status === 'Low Stock' ? 'bg-amber-50 text-amber-700 ring-amber-600/20' :
                        'bg-red-50 text-red-700 ring-red-600/20'
                      }`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-[#1E3A8A] transition-colors rounded-lg hover:bg-slate-100" title="View">
                          <Eye className="h-4 w-4" />
                        </button>
                        <Link 
                          to={`/vendor/products/edit/${product.id}`}
                          className="p-1.5 text-slate-400 hover:text-[#F97316] transition-colors rounded-lg hover:bg-slate-100"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-slate-100" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts Widget */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col">
          <div className="border-b border-slate-200 px-6 py-5 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-[#0F172A]">Low Stock Alerts</h2>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
              {lowStockProducts.length}
            </span>
          </div>
          <div className="p-6 flex-1">
            {lowStockProducts.length > 0 ? (
              <div className="space-y-4">
                {lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                    <img src={product.image} alt={product.name} className="h-12 w-12 rounded bg-slate-100 object-cover border border-slate-200" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 truncate">{product.name}</p>
                      <p className="text-xs text-slate-500 font-mono mt-0.5">{product.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-extrabold ${product.stock === 0 ? 'text-red-600' : 'text-amber-600'}`}>
                        {product.stock} left
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center text-slate-500">
                <AlertTriangle className="h-12 w-12 text-slate-200 mb-3" />
                <p className="text-sm font-medium">All products are adequately stocked.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
