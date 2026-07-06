"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { api } from "@/lib/api";
import { FiCheck, FiRefreshCw, FiClock, FiAlertCircle } from "react-icons/fi";
import Skeleton from "@/components/Skeleton";
import useAuthStore from "@/hooks/useAuthStore";
import { socket } from "@/lib/socket";

export default function OrdersPage() {
  const [ordersEnabled, setOrdersEnabled] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const { data: orders, error, isLoading, mutate } = useSWR(
    "/api/orders/restaurant/today",
    api.getTodaysOrders
  );

  // Use a ref or state for initial load of ordersEnabled
  useEffect(() => {
    // Fetch profile to get ordersEnabled state initially
    api.getProfile().then(res => {
      if (res && res.data) {
        setOrdersEnabled(!!res.data.orders_enabled);
        
        // Connect to socket and join restaurant room
        socket.connect();
        socket.emit("join_restaurant_room", res.data.restaurant_id);
      }
    }).catch(console.error);

    const onNewOrder = (order) => {
      // Re-fetch the orders list when a new order arrives
      mutate();
    };

    socket.on("new_order", onNewOrder);

    return () => {
      socket.off("new_order", onNewOrder);
      socket.disconnect();
    };
  }, [mutate]);

  const handleToggleOrders = async () => {
    setIsToggling(true);
    const newState = !ordersEnabled;
    try {
      await api.updateProfile({ orders_enabled: newState });
      setOrdersEnabled(newState);
      // We also update the auth store or we could just leave it local to this page.
    } catch (err) {
      console.error("Failed to toggle orders", err);
      alert("Failed to toggle orders: " + err.message);
    } finally {
      setIsToggling(false);
    }
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      await api.updateOrderStatus(orderId, 'confirmed');
      mutate(); // Refresh the list
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to confirm order.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Toggle Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-surface-alt rounded-2xl border border-border shadow-sm gap-4">
        <div>
          <h2 className="text-xl font-bold text-text">Accept Orders</h2>
          <p className="text-sm text-text-muted mt-1">Enable or disable digital ordering for your customers.</p>
        </div>
        <button
          onClick={handleToggleOrders}
          disabled={isToggling}
          className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${ordersEnabled ? 'bg-primary-500' : 'bg-surface-elevated'}`}
        >
          <span className="sr-only">Toggle Orders</span>
          <span
            className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${ordersEnabled ? 'translate-x-6' : 'translate-x-0'}`}
          />
        </button>
      </div>

      <div className="flex justify-between items-center mt-4">
        <h3 className="text-2xl font-bold text-text">Today's Orders</h3>
        <button 
          onClick={() => mutate()} 
          className="flex items-center gap-2 text-sm font-semibold text-primary-500 hover:text-primary-600 bg-primary-500/10 px-3 py-1.5 rounded-lg"
        >
          <FiRefreshCw size={14} /> Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      ) : error ? (
        <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 flex items-center gap-3">
          <FiAlertCircle size={24} />
          <p className="font-medium">Failed to load today's orders.</p>
        </div>
      ) : !orders || orders.data.length === 0 ? (
        <div className="p-12 text-center bg-surface-alt rounded-2xl border border-border border-dashed">
          <p className="text-text-muted text-lg font-medium">No orders yet today.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orders.data.map(order => (
            <div key={order.id} className="bg-surface rounded-2xl border border-border p-5 flex flex-col shadow-sm">
              <div className="flex justify-between items-start mb-4 border-b border-border pb-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Table</span>
                  <p className="text-lg font-extrabold text-primary-500">{order.table_number}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-text-muted block">{new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  <span className={`inline-block mt-1 text-xs font-bold px-2 py-1 rounded-md ${order.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-green-500/10 text-green-500'}`}>
                    {order.status === 'pending' ? 'PENDING' : 'CONFIRMED'}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto mb-4">
                <ul className="flex flex-col gap-2">
                  {order.items?.map((item, idx) => (
                    <li key={idx} className="text-sm">
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-text">{item.quantity}x</span>
                        <div>
                          <p className="text-text font-medium">{item.food_name}</p>
                          {item.special_instructions && (
                            <p className="text-xs text-text-muted italic block">Note: {item.special_instructions}</p>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {order.status === 'pending' && (
                <button
                  onClick={() => handleConfirmOrder(order.id)}
                  className="w-full mt-auto bg-primary-500 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 hover:bg-primary-600 active:scale-95 transition-all shadow-md shadow-primary-500/20"
                >
                  <FiCheck size={18} /> Confirm Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
