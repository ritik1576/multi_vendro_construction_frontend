import { call, put, takeLatest, select } from 'redux-saga/effects';
import { adminService } from '../services/adminService';
import {
  FETCH_ADMIN_USERS_REQUEST,
  fetchAdminUsersSuccess,
  fetchAdminUsersFailure,
  FETCH_ADMIN_USER_DETAILS_REQUEST,
  fetchAdminUserDetailsSuccess,
  fetchAdminUserDetailsFailure,
  FETCH_ADMIN_VENDORS_REQUEST,
  fetchAdminVendorsSuccess,
  fetchAdminVendorsFailure,
  FETCH_ADMIN_ORDERS_REQUEST,
  fetchAdminOrdersSuccess,
  fetchAdminOrdersFailure,
} from '../redux/adminActions';

function* fetchAdminUsers(action) {
  try {
    const forceRefresh = action?.payload?.forceRefresh;
    const existingUsers = yield select(state => state.admin.users);
    
    if (!forceRefresh && existingUsers && existingUsers.length > 0) {
      yield put(fetchAdminUsersSuccess(existingUsers));
      return;
    }

    const response = yield call(adminService.getUsers);
    if (response.success) {
      // Map data immediately in saga so the reducer only holds UI-ready models
      const mappedUsers = response.data
        .filter(u => u.role && u.role.toLowerCase() === 'customer')
        .map(u => ({
        id: `USR-${u.id}`,
        full_name: u.fullName,
        email: u.email,
        phone: u.phone,
        company: 'N/A',
        role: u.role,
        status: u.status === 'active' ? 'Active' : u.status === 'suspended' ? 'Suspended' : u.status,
        orders: u.noOfOrders || u.orders || u.totalOrders || u.orderCount || 0,
        total_spend: '$0.00',
        registration_date: 'N/A',
        last_login: 'N/A',
        last_order_date: 'N/A',
        complaints: 0,
        addresses: {
          billing: { line: 'N/A', city: 'N/A', state: 'N/A', country: 'N/A', zip: 'N/A' },
          shipping: { line: 'N/A', city: 'N/A', state: 'N/A', country: 'N/A', zip: 'N/A' }
        },
        recent_orders: [],
        recent_activity: []
      }));
      yield put(fetchAdminUsersSuccess(mappedUsers));
    } else {
      yield put(fetchAdminUsersFailure(response.message || 'Failed to fetch users'));
    }
  } catch (error) {
    yield put(fetchAdminUsersFailure(error.message || 'Network error while fetching users'));
  }
}

function* fetchAdminUserDetails(action) {
  try {
    const response = yield call(adminService.getUserDetails, action.payload);
    if (response.success) {
      const u = response.data.user;
      const addrs = response.data.addresses || [];
      const ords = response.data.orders || [];
      
      const mappedUser = {
        id: `USR-${u.id}`,
        full_name: u.fullName || 'Unknown User',
        email: u.email || 'N/A',
        phone: u.phone || 'N/A',
        company: 'N/A',
        role: u.role,
        status: u.status === 'active' ? 'Active' : u.status === 'suspended' ? 'Suspended' : u.status || 'Active',
        orders: u.orderCount || ords.length || 0,
        total_spend: `$${ords.reduce((sum, o) => sum + parseFloat(o.totalAmount || 0), 0).toFixed(2)}`,
        registration_date: 'N/A',
        last_login: 'N/A',
        last_order_date: ords.length > 0 ? new Date(ords[0].placedAt).toLocaleDateString() : 'N/A',
        complaints: 0,
        addresses: {
          billing: addrs[0] ? { line: `${addrs[0].addressLine1 || ''} ${addrs[0].addressLine2 || ''}`.trim(), city: addrs[0].city, state: addrs[0].state, country: addrs[0].country, zip: addrs[0].postalCode } : { line: 'N/A', city: 'N/A', state: 'N/A', country: 'N/A', zip: 'N/A' },
          shipping: addrs[0] ? { line: `${addrs[0].addressLine1 || ''} ${addrs[0].addressLine2 || ''}`.trim(), city: addrs[0].city, state: addrs[0].state, country: addrs[0].country, zip: addrs[0].postalCode } : { line: 'N/A', city: 'N/A', state: 'N/A', country: 'N/A', zip: 'N/A' }
        },
        recent_orders: ords.map(o => ({
          id: o.orderNumber,
          date: new Date(o.placedAt).toLocaleDateString(),
          amount: `$${parseFloat(o.totalAmount || 0).toFixed(2)}`,
          status: o.orderStatus ? (o.orderStatus.charAt(0).toUpperCase() + o.orderStatus.slice(1)) : 'Pending'
        })),
        recent_activity: []
      };
      yield put(fetchAdminUserDetailsSuccess(mappedUser));
    } else {
      yield put(fetchAdminUserDetailsFailure(response.message || 'Failed to fetch user details'));
    }
  } catch (error) {
    yield put(fetchAdminUserDetailsFailure(error.message || 'Network error while fetching user details'));
  }
}

function* fetchAdminVendors(action) {
  try {
    const forceRefresh = action?.payload?.forceRefresh;
    const existingVendors = yield select(state => state.admin.vendors);
    
    if (!forceRefresh && existingVendors && existingVendors.length > 0) {
      yield put(fetchAdminVendorsSuccess(existingVendors));
      return;
    }

    const response = yield call(adminService.getVendors);
    if (response.success) {
      // Map data immediately in saga so the reducer only holds UI-ready models
      const mappedVendors = response.data.map(v => ({
        id: v.vendorId, // Using raw vendorId for routing
        business_name: v.shopName || 'Unknown Business',
        name: v.shopName || 'Vendor',
        business_email: v.email,
        business_phone: v.phone,
        category: 'General', // Not provided by API yet
        gst_number: v.gstNumber || 'N/A',
        approval_status: v.status === 'approved' ? 'Approved' : v.status === 'pending' ? 'Pending Approval' : v.status === 'rejected' ? 'Rejected' : v.status,
        registration_date: v.createdAt ? new Date(v.createdAt).toLocaleDateString() : 'N/A',
        total_products: 0,
        total_sales: '$0.00',
        logo: v.logo,
        banner: v.banner,
        commission_rate: v.commissionRate,
        description: v.description,
      }));
      yield put(fetchAdminVendorsSuccess(mappedVendors));
    } else {
      yield put(fetchAdminVendorsFailure(response.message || 'Failed to fetch vendors'));
    }
  } catch (error) {
    yield put(fetchAdminVendorsFailure(error.message || 'Network error while fetching vendors'));
  }
}

function* fetchAdminOrders(action) {
  try {
    const forceRefresh = action?.payload?.forceRefresh;
    const existingOrders = yield select(state => state.admin.orders);
    
    if (!forceRefresh && existingOrders && existingOrders.length > 0) {
      yield put(fetchAdminOrdersSuccess(existingOrders));
      return;
    }

    const response = yield call(adminService.getAllOrders);
    if (response.success) {
      // Map API schema to UI expected schema
      const mappedOrders = response.data.map(o => {
        
        // Try to get a valid vendor from items, or fallback
        const vendors = [...new Set(o.orderItems.map(i => i.vendorName).filter(Boolean))];
        let vendorName = 'Unknown Vendor';
        let vendorId = 'N/A';
        
        if (vendors.length === 1) {
          vendorName = vendors[0];
          vendorId = `VND-${o.orderItems.find(i => i.vendorName === vendorName)?.vendorId || 'N/A'}`;
        } else if (vendors.length > 1) {
          vendorName = 'Multiple Vendors';
          vendorId = 'MULTI';
        }

        // Format Date
        const dateObj = new Date(o.placedAt || o.createdAt || Date.now());
        const formattedDate = dateObj.toLocaleDateString('en-US', { 
          month: 'short', day: 'numeric', year: 'numeric', 
          hour: '2-digit', minute: '2-digit', timeZoneName: 'short' 
        });

        // Format Status
        const status = o.orderStatus ? o.orderStatus.charAt(0).toUpperCase() + o.orderStatus.slice(1) : 'Pending';

        return {
          id: o.orderNumber.replace('INFR-LOCAL-', ''), // or just o.orderId.toString()
          date: formattedDate,
          customerName: o.customerName || 'Unknown Customer',
          customerEmail: o.customerEmail || 'N/A',
          customerPhone: o.customerPhone || 'N/A',
          vendorName: vendorName,
          vendorId: vendorId,
          status: status,
          items: o.orderItems.map(item => ({
            id: item.id,
            name: item.productName,
            sku: `SKU-${item.productId}`,
            price: item.price,
            qty: item.quantity,
            thumbnail: 'https://placehold.co/150x150/e2e8f0/94a3b8?text=Item'
          })),
          freight: parseFloat(o.shippingCharge) || 0,
          tax: 0, // Placeholder
          total: parseFloat(o.totalAmount) || 0
        };
      });
      yield put(fetchAdminOrdersSuccess(mappedOrders));
    } else {
      yield put(fetchAdminOrdersFailure(response.message || 'Failed to fetch orders'));
    }
  } catch (error) {
    yield put(fetchAdminOrdersFailure(error.message || 'Network error while fetching orders'));
  }
}

export default function* adminSaga() {
  yield takeLatest(FETCH_ADMIN_USERS_REQUEST, fetchAdminUsers);
  yield takeLatest(FETCH_ADMIN_USER_DETAILS_REQUEST, fetchAdminUserDetails);
  yield takeLatest(FETCH_ADMIN_VENDORS_REQUEST, fetchAdminVendors);
  yield takeLatest(FETCH_ADMIN_ORDERS_REQUEST, fetchAdminOrders);
}
