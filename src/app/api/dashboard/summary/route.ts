import { NextResponse } from 'next/server';
import { getOrdersCollection } from '@/repos/orders/collection';

export async function GET() {
  try {
    const ordersCollection = await getOrdersCollection();
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const overviewStartDate = new Date(
      startOfThisMonth.getFullYear(),
      startOfThisMonth.getMonth() - 11,
      1,
    );

    const overviewAggregation = await ordersCollection
      .aggregate([
        {
          $match: {
            status: { $ne: 'CANCELLED' },
            createdAt: { $gte: overviewStartDate },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            total: { $sum: '$total' },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ])
      .toArray();

    const overviewMap = new Map<string, number>();
    overviewAggregation.forEach((item) => {
      const monthKey = `${item._id.year}-${String(item._id.month).padStart(2, '0')}`;
      overviewMap.set(monthKey, item.total);
    });

    const overview = Array.from({ length: 12 }, (_, index) => {
      const monthDate = new Date(
        overviewStartDate.getFullYear(),
        overviewStartDate.getMonth() + index,
        1,
      );
      const year = monthDate.getFullYear();
      const month = monthDate.getMonth() + 1;
      const monthKey = `${year}-${String(month).padStart(2, '0')}`;

      return {
        key: monthKey,
        year,
        month,
        total: overviewMap.get(monthKey) ?? 0,
      };
    });

    // Stats aggregation
    const totalRevenue = await ordersCollection
      .aggregate([
        { $match: { status: { $ne: 'CANCELLED' } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ])
      .toArray()
      .then((res) => (res.length > 0 ? res[0].total : 0));

    const totalOrders = await ordersCollection.countDocuments();
    const totalCustomersResult = await ordersCollection.distinct('customer');
    const activeOrders = await ordersCollection.countDocuments({
      status: { $in: ['PENDING', 'CONFIRMED', 'DELIVERING'] },
    });

    // Calculate Month-over-Month changes
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-indexed

    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevYear = prevDate.getFullYear();
    const prevMonth = prevDate.getMonth() + 1; // 1-indexed

    // Revenue Change
    const currentMonthRevenue =
      overview.find(
        (item) => item.year === currentYear && item.month === currentMonth,
      )?.total ?? 0;

    const prevMonthRevenue =
      overview.find(
        (item) => item.year === prevYear && item.month === prevMonth,
      )?.total ?? 0;

    const revenueChange =
      prevMonthRevenue === 0
        ? currentMonthRevenue > 0
          ? 100
          : 0
        : Number(
            (
              ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) *
              100
            ).toFixed(1),
          );

    // Dates for MongoDB queries
    const currentMonthStart = new Date(currentYear, currentMonth - 1, 1);
    const prevMonthStart = new Date(prevYear, prevMonth - 1, 1);
    const prevMonthEnd = new Date(
      currentYear,
      currentMonth - 1,
      0,
      23,
      59,
      59,
      999,
    );

    // Orders Change
    const currentMonthOrders = await ordersCollection.countDocuments({
      createdAt: { $gte: currentMonthStart },
    });
    const prevMonthOrders = await ordersCollection.countDocuments({
      createdAt: { $gte: prevMonthStart, $lte: prevMonthEnd },
    });
    const ordersChange =
      prevMonthOrders === 0
        ? currentMonthOrders > 0
          ? 100
          : 0
        : Number(
            (
              ((currentMonthOrders - prevMonthOrders) / prevMonthOrders) *
              100
            ).toFixed(1),
          );

    // Customers Change
    const currentMonthCustomersArr = await ordersCollection.distinct(
      'customer',
      {
        createdAt: { $gte: currentMonthStart },
      },
    );
    const currentMonthCustomers = currentMonthCustomersArr.length;
    const prevMonthCustomersArr = await ordersCollection.distinct('customer', {
      createdAt: { $gte: prevMonthStart, $lte: prevMonthEnd },
    });
    const prevMonthCustomers = prevMonthCustomersArr.length;

    const customersChange =
      prevMonthCustomers === 0
        ? currentMonthCustomers > 0
          ? 100
          : 0
        : Number(
            (
              ((currentMonthCustomers - prevMonthCustomers) /
                prevMonthCustomers) *
              100
            ).toFixed(1),
          );

    const recentOrdersDb = await ordersCollection
      .find()
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    const recentSales = recentOrdersDb.map((d) => {
      let customerName = 'Unknown Customer';
      if (d.address) {
        try {
          // If address is structured like {city=xx, district=yy, name=zz} as requested in AddressField previously
          if (
            typeof d.address === 'string' &&
            d.address.startsWith('{') &&
            d.address.includes('=')
          ) {
            const pairs = d.address.slice(1, -1).split(', ');
            const addressMap: Record<string, string> = {};
            pairs.forEach((pair) => {
              const [k, v] = pair.split('=');
              if (k && v) addressMap[k] = v;
            });
            if (addressMap['name']) {
              customerName = addressMap['name'];
            }
          } else {
            // standard json
            const parsed = JSON.parse(d.address);
            if (parsed?.name) customerName = parsed.name;
          }
        } catch {
          // fallback to standard text or customer prop
        }
      }

      return {
        id: d._id.toString(),
        orderId: d.orderId || '',
        customerName,
        customer: d.customer || 'Unknown Customer',
        total: d.total || 0,
        status: d.status || 'UNKNOWN',
        createdAt: d.createdAt
          ? d.createdAt.toISOString()
          : new Date().toISOString(),
      };
    });

    return NextResponse.json({
      stats: {
        totalRevenue,
        totalOrders,
        totalCustomers: totalCustomersResult.length,
        activeOrders,
        currentMonthRevenue,
        revenueChange,
        currentMonthOrders,
        ordersChange,
        currentMonthCustomers,
        customersChange,
      },
      overview: overview.length ? overview : [],
      recentSales,
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
