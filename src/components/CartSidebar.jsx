import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCartItems,
  selectCartTotalCount,
  selectCartTotalPrice,
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../store/slices/cartSlice";

const CartSidebar = memo(function CartSidebar() {
  const dispatch = useDispatch();

  // 🎯 Subscriptions are isolated here!
  const cartItems = useSelector(selectCartItems);
  const totalQuantity = useSelector(selectCartTotalCount);
  const totalPrice = useSelector(selectCartTotalPrice);

  return (
    <aside className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
          🛒 Shopping Cart
        </h3>
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
          {totalQuantity} items
        </span>
      </div>

      {cartItems.length === 0 ? (
        <p className="text-xs text-neutral-400 text-center py-8 italic">
          Your cart is empty. Add products to test cart flow.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3 max-h-80 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="pt-2 flex items-center justify-between gap-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                    {item.title}
                  </p>
                  <span className="text-[11px] text-neutral-400">
                    ${Number(item.price).toFixed(2)} each
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    className="w-6 h-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold text-xs flex items-center justify-center hover:bg-neutral-200"
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          id: item.id,
                          quantity: item.quantity - 1,
                        }),
                      )
                    }
                  >
                    -
                  </button>
                  <span className="text-xs font-bold w-5 text-center">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    className="w-6 h-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold text-xs flex items-center justify-center hover:bg-neutral-200"
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          id: item.id,
                          quantity: item.quantity + 1,
                        }),
                      )
                    }
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="text-rose-500 hover:text-rose-700 p-1 text-xs"
                    title="Remove"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
            <div className="flex justify-between items-center text-sm font-bold text-neutral-900 dark:text-white">
              <span>Grand Total:</span>
              <span className="text-emerald-600 dark:text-emerald-400">
                ${Number(totalPrice).toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              className="w-full py-2 text-xs font-semibold rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 transition-colors"
              onClick={() => dispatch(clearCart())}
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </aside>
  );
});

export default CartSidebar;
