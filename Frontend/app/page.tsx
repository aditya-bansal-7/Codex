"use client"

import type React from "react"

import { useState } from "react"
import {
  AlertCircle,
  Calendar,
  CreditCard,
  DollarSign,
  Download,
  Filter,
  PercentCircle,
  Search,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

// Sample data for the dashboard
const transactions = [
  {
    id: "TRX-001",
    date: "2023-03-15",
    amount: 1250.0,
    payerId: "P-12345",
    payeeId: "P-67890",
    status: "Fraudulent",
    reason: "Unusual location",
  },
  {
    id: "TRX-002",
    date: "2023-03-15",
    amount: 450.75,
    payerId: "P-23456",
    payeeId: "P-78901",
    status: "Legitimate",
    reason: null,
  },
  {
    id: "TRX-003",
    date: "2023-03-14",
    amount: 2500.0,
    payerId: "P-34567",
    payeeId: "P-89012",
    status: "High Risk",
    reason: "Amount threshold",
  },
  {
    id: "TRX-004",
    date: "2023-03-14",
    amount: 175.25,
    payerId: "P-45678",
    payeeId: "P-90123",
    status: "Legitimate",
    reason: null,
  },
  {
    id: "TRX-005",
    date: "2023-03-13",
    amount: 3200.0,
    payerId: "P-56789",
    payeeId: "P-01234",
    status: "Fraudulent",
    reason: "Velocity check",
  },
]

const fraudComparisonData = [
  { name: "Jan", predicted: 45, reported: 38 },
  { name: "Feb", predicted: 52, reported: 43 },
  { name: "Mar", predicted: 49, reported: 45 },
  { name: "Apr", predicted: 63, reported: 57 },
  { name: "May", predicted: 58, reported: 51 },
  { name: "Jun", predicted: 48, reported: 43 },
]

const fraudTrendsData = [
  { date: "Mar 10", fraudCount: 12 },
  { date: "Mar 11", fraudCount: 15 },
  { date: "Mar 12", fraudCount: 18 },
  { date: "Mar 13", fraudCount: 14 },
  { date: "Mar 14", fraudCount: 11 },
  { date: "Mar 15", fraudCount: 16 },
  { date: "Mar 16", fraudCount: 19 },
]

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredTransactions, setFilteredTransactions] = useState(transactions)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilteredTransactions(transactions.filter((tx) => tx.id.toLowerCase().includes(searchQuery.toLowerCase())))
  }

  return (
    <div className="container py-6">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between dashboard-header">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight">Fraud Detection Dashboard</h1>
          <p className="text-muted-foreground">Monitor and analyze fraud patterns in real-time</p>
        </div>
        <div className="flex items-center gap-2 animate-slide-in-right">
          <Button variant="outline" size="sm" className="h-8 gap-1 border-primary/20 text-primary hover:bg-primary/10">
            <Calendar className="h-3.5 w-3.5" />
            <span>Mar 10 - Mar 16, 2023</span>
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1 border-primary/20 text-primary hover:bg-primary/10">
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-stats card-stats-primary shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <ArrowUp className="mr-1 h-3 w-3 text-success" />
              <span className="text-success font-medium">12.5%</span>
              <span className="ml-1">from last week</span>
            </div>
          </CardContent>
        </Card>
        <Card className="card-stats card-stats-destructive shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fraud Percentage</CardTitle>
            <PercentCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2%</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <ArrowDown className="mr-1 h-3 w-3 text-success" />
              <span className="text-success font-medium">0.5%</span>
              <span className="ml-1">from last week</span>
            </div>
          </CardContent>
        </Card>
        <Card className="card-stats card-stats-warning shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Transactions</CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">54</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <ArrowUp className="mr-1 h-3 w-3 text-destructive" />
              <span className="text-destructive font-medium">8.2%</span>
              <span className="ml-1">from last week</span>
            </div>
          </CardContent>
        </Card>
        <Card className="card-stats card-stats-success shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Fraud Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,423</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <ArrowUp className="mr-1 h-3 w-3 text-destructive" />
              <span className="text-destructive font-medium">$215</span>
              <span className="ml-1">from last week</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card className="border shadow-sm overflow-hidden">
          <CardHeader className="pb-0">
            <CardTitle>Fraud Comparison</CardTitle>
            <CardDescription>Predicted vs. reported fraud cases</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="chart-container">
              <ChartContainer
                config={{
                  predicted: {
                    label: "Predicted",
                    color: "hsl(var(--chart-1))",
                  },
                  reported: {
                    label: "Reported",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="aspect-[4/3]"
              >
                <BarChart
                  data={fraudComparisonData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 0,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={{ fill: "var(--tooltip-bg)", opacity: 0.1 }}
                  />
                  <Bar dataKey="predicted" fill="var(--color-predicted)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="reported" fill="var(--color-reported)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="border shadow-sm overflow-hidden">
          <CardHeader className="pb-0">
            <CardTitle>Fraud Trends</CardTitle>
            <CardDescription>Daily fraud cases over time</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="chart-container">
              <ChartContainer
                config={{
                  fraudCount: {
                    label: "Fraud Cases",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="aspect-[4/3]"
              >
                <LineChart
                  data={fraudTrendsData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 0,
                    bottom: 20,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="fraudCount"
                    stroke="var(--color-fraudCount)"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{
                      r: 6,
                      fill: "var(--color-fraudCount)",
                      stroke: "hsl(var(--background))",
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>View and filter recent transaction activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-col gap-4 sm:flex-row">
              <form onSubmit={handleSearch} className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search transaction ID..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="fraudulent">Fraudulent</SelectItem>
                    <SelectItem value="legitimate">Legitimate</SelectItem>
                    <SelectItem value="high-risk">High Risk</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead className="hidden md:table-cell">Payer ID</TableHead>
                    <TableHead className="hidden md:table-cell">Payee ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Reason</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((tx) => (
                    <TableRow key={tx.id} className="table-row-hover">
                      <TableCell className="font-medium">{tx.id}</TableCell>
                      <TableCell>{tx.date}</TableCell>
                      <TableCell>${tx.amount.toFixed(2)}</TableCell>
                      <TableCell className="hidden md:table-cell">{tx.payerId}</TableCell>
                      <TableCell className="hidden md:table-cell">{tx.payeeId}</TableCell>
                      <TableCell>
                        <span
                          className={`badge-status ${
                            tx.status === "Fraudulent"
                              ? "badge-fraudulent"
                              : tx.status === "High Risk"
                                ? "badge-high-risk"
                                : "badge-legitimate"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{tx.reason || "—"}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <span className="sr-only">Open menu</span>
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                              >
                                <path
                                  d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                                  fill="currentColor"
                                  fillRule="evenodd"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Mark as reviewed</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Report as fraud</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing <strong>5</strong> of <strong>25</strong> transactions
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

