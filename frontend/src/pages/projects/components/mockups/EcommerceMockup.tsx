import { ShoppingBag, Package, TrendingUp, AlertTriangle, CheckCircle, ArrowUpRight } from 'lucide-react';

export const EcommerceMockup = () => {
  return (
    <div className="w-full bg-white rounded-2xl border border-border shadow-soft-md overflow-hidden text-left font-sans text-xs select-none">
      {/* Titlebar */}
      <div className="bg-background-alt px-4 py-2.5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-[11px] font-mono text-text-secondary ml-2 font-medium">
            anthix-commerce / inventory-ops
          </span>
        </div>
        <div className="flex items-center gap-2 text-text-secondary">
          <span className="text-[10px] font-mono bg-primary/10 text-primary-deep px-2 py-0.5 rounded-full font-bold">
            Storefront v2.4
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        {/* KPI Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-background-alt border border-border">
            <div className="flex items-center justify-between text-text-secondary mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Today&apos;s Revenue</span>
              <ShoppingBag className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="text-base sm:text-lg font-heading font-extrabold text-text-main">$18,420</div>
            <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>+24% vs yesterday</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-background-alt border border-border">
            <div className="flex items-center justify-between text-text-secondary mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Orders In Flight</span>
              <Package className="w-3.5 h-3.5 text-sky-500" />
            </div>
            <div className="text-base sm:text-lg font-heading font-extrabold text-text-main">142 Orders</div>
            <div className="text-[10px] text-text-secondary font-medium mt-0.5">
              98% on-time dispatch
            </div>
          </div>

          <div className="p-3 rounded-xl bg-background-alt border border-border">
            <div className="flex items-center justify-between text-text-secondary mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Inventory Health</span>
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="text-base sm:text-lg font-heading font-extrabold text-text-main">99.4% In Stock</div>
            <div className="text-[10px] text-amber-600 font-semibold mt-0.5 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              <span>2 SKUs low stock</span>
            </div>
          </div>
        </div>

        {/* Live Orders Stream & Low Stock Alert */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Recent Orders List */}
          <div className="p-3 rounded-xl bg-background-alt/80 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading font-bold text-[11px] text-text-main">
                Live Fulfillment Stream
              </span>
              <span className="text-[9px] font-mono text-emerald-600 font-bold">Auto-Sync</span>
            </div>

            <div className="space-y-1.5">
              <div className="p-2 rounded-lg bg-white border border-border flex items-center justify-between">
                <div>
                  <div className="font-semibold text-text-main text-[11px]">#ORD-9842 • 3 Items</div>
                  <div className="text-[10px] text-text-secondary">Express Delivery • $284.00</div>
                </div>
                <span className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                  Shipped
                </span>
              </div>

              <div className="p-2 rounded-lg bg-white border border-border flex items-center justify-between">
                <div>
                  <div className="font-semibold text-text-main text-[11px]">#ORD-9843 • 1 Item</div>
                  <div className="text-[10px] text-text-secondary">Standard Shipping • $89.50</div>
                </div>
                <span className="text-[9px] font-mono text-sky-700 bg-sky-50 px-2 py-0.5 rounded font-bold border border-sky-200">
                  Processing
                </span>
              </div>
            </div>
          </div>

          {/* Real-time Inventory Alert */}
          <div className="p-3 rounded-xl bg-background-alt/80 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="font-heading font-bold text-[11px] text-text-main">
                Low Stock Thresholds
              </span>
              <span className="text-[9px] font-mono text-text-secondary">Warehouse A</span>
            </div>

            <div className="space-y-1.5">
              <div className="p-2 rounded-lg bg-white border border-amber-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-text-main text-[11px]">Studio Sound Monitor Pro</div>
                  <div className="text-[10px] text-amber-700 font-medium">8 units left (threshold: 15)</div>
                </div>
                <button className="text-[9px] font-mono bg-amber-50 text-amber-800 px-2 py-1 rounded font-bold border border-amber-300 hover:bg-amber-100 flex items-center gap-0.5">
                  <span>Reorder</span>
                  <ArrowUpRight className="w-2.5 h-2.5" />
                </button>
              </div>

              <div className="p-2 rounded-lg bg-white border border-border flex items-center justify-between">
                <div>
                  <div className="font-semibold text-text-main text-[11px]">Ergonomic Desk Hub</div>
                  <div className="text-[10px] text-text-secondary">142 units in stock</div>
                </div>
                <span className="text-[9px] font-mono text-text-secondary bg-background-alt px-1.5 py-0.5 rounded">
                  Healthy
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="px-3 py-2 rounded-xl bg-background-alt border border-border flex items-center justify-between text-[10px] text-text-secondary">
          <span>Stripe / Cloudinary / Webhook integration conduits pre-configured.</span>
          <span className="font-mono font-bold text-primary">Scalable Stack</span>
        </div>
      </div>
    </div>
  );
};
