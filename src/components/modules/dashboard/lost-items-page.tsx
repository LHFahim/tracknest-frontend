const lostItems = [
  {
    id: 'LI-001',
    name: 'Black Backpack',
    category: 'Bags',
    location: 'Library Building',
    date: '12 Apr 2026',
    status: 'Matched',
  },
  {
    id: 'LI-002',
    name: 'Student ID Card',
    category: 'Documents',
    location: 'Block C',
    date: '11 Apr 2026',
    status: 'Pending',
  },
  {
    id: 'LI-003',
    name: 'Silver Water Bottle',
    category: 'Accessories',
    location: 'Reception Desk',
    date: '10 Apr 2026',
    status: 'Open',
  },
  {
    id: 'LI-004',
    name: 'Wireless Earbuds',
    category: 'Electronics',
    location: 'Lab 4',
    date: '09 Apr 2026',
    status: 'Claimed',
  },
  {
    id: 'LI-005',
    name: 'Blue Jacket',
    category: 'Clothing',
    location: 'Student Lounge',
    date: '08 Apr 2026',
    status: 'Open',
  },
];

function getStatusClass(status: string) {
  switch (status) {
    case 'Matched':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400';
    case 'Pending':
      return 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400';
    case 'Claimed':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400';
    default:
      return 'bg-primary/10 text-primary';
  }
}

export default function LostItemsPage() {
  return (
    <section className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Demo Module</p>
            <h1 className="text-3xl font-bold tracking-tight">
              Lost Items Management
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              View, search, and monitor reported lost items in one organized
              interface.
            </p>
          </div>

          <button className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
            Add Lost Report
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <input
            type="text"
            placeholder="Search by item name"
            className="rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none"
          />

          <select className="rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none">
            <option>All Categories</option>
            <option>Bags</option>
            <option>Documents</option>
            <option>Accessories</option>
            <option>Electronics</option>
            <option>Clothing</option>
          </select>

          <select className="rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none">
            <option>All Status</option>
            <option>Open</option>
            <option>Pending</option>
            <option>Matched</option>
            <option>Claimed</option>
          </select>

          <select className="rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none">
            <option>Newest First</option>
            <option>Oldest First</option>
            <option>Status</option>
            <option>Category</option>
          </select>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="hidden grid-cols-6 border-b border-border bg-muted/40 px-6 py-4 text-sm font-semibold md:grid">
            <p>ID</p>
            <p>Item</p>
            <p>Category</p>
            <p>Location</p>
            <p>Date</p>
            <p>Status</p>
          </div>

          <div className="divide-y divide-border">
            {lostItems.map((item) => (
              <div
                key={item.id}
                className="grid gap-3 px-6 py-4 text-sm md:grid-cols-6 md:items-center"
              >
                <p className="font-medium">{item.id}</p>
                <p>{item.name}</p>
                <p className="text-muted-foreground">{item.category}</p>
                <p className="text-muted-foreground">{item.location}</p>
                <p className="text-muted-foreground">{item.date}</p>
                <p>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(item.status)}`}
                  >
                    {item.status}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Open Reports</p>
            <p className="mt-2 text-3xl font-bold">2</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Matched Items</p>
            <p className="mt-2 text-3xl font-bold">1</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">Claimed Items</p>
            <p className="mt-2 text-3xl font-bold">1</p>
          </div>
        </div>
      </div>
    </section>
  );
}