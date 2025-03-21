"use client"

import { useState } from "react"
import { AlertCircle, ArrowRight, Check, CreditCard, DollarSign, Filter, Laptop, Mail, Phone, Plus, Search, User } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "@/components/ui/use-toast"
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

// Sample transactions data
const transactions = [
  {
    id: "TRX-001",
    date: "2023-03-15",
    amount: 1250.0,
    channel: "Web",
    paymentMode: "Credit Card",
    gatewayBank: "Chase",
    payerEmail: "john.doe@example.com",
    payerMobile: "+1 (555) 123-4567",
    payerCardBrand: "Visa",
    payerDevice: "MacBook Pro",
    payerBrowser: "Chrome",
    payeeId: "P-67890",
    status: "Fraudulent",
    riskScore: 85,
  },
  {
    id: "TRX-002",
    date: "2023-03-15",
    amount: 450.75,
    channel: "Mobile App",
    paymentMode: "Debit Card",
    gatewayBank: "Bank of America",
    payerEmail: "jane.smith@example.com",
    payerMobile: "+1 (555) 987-6543",
    payerCardBrand: "Mastercard",
    payerDevice: "iPhone 13",
    payerBrowser: "Safari",
    payeeId: "P-78901",
    status: "Legitimate",
    riskScore: 15,
  },
  {
    id: "TRX-003",
    date: "2023-03-14",
    amount: 2500.0,
    channel: "Web",
    paymentMode: "Bank Transfer",
    gatewayBank: "Wells Fargo",
    payerEmail: "robert.johnson@example.com",
    payerMobile: "+1 (555) 456-7890",
    payerCardBrand: "N/A",
    payerDevice: "Windows PC",
    payerBrowser: "Firefox",
    payeeId: "P-89012",
    status: "High Risk",
    riskScore: 65,
  },
  {
    id: "TRX-004",
    date: "2023-03-14",
    amount: 175.25,
    channel: "Mobile App",
    paymentMode: "Digital Wallet",
    gatewayBank: "N/A",
    payerEmail: "sarah.williams@example.com",
    payerMobile: "+1 (555) 789-0123",
    payerCardBrand: "N/A",
    payerDevice: "Android Phone",
    payerBrowser: "Chrome Mobile",
    payeeId: "P-90123",
    status: "Legitimate",
    riskScore: 10,
  },
  {
    id: "TRX-005",
    date: "2023-03-13",
    amount: 3200.0,
    channel: "Web",
    paymentMode: "Credit Card",
    gatewayBank: "Citibank",
    payerEmail: "michael.brown@example.com",
    payerMobile: "+1 (555) 234-5678",
    payerCardBrand: "American Express",
    payerDevice: "Windows PC",
    payerBrowser: "Edge",
    payeeId: "P-01234",
    status: "Fraudulent",
    riskScore: 92,
  },
]

const oldPreductionResult = {
  is_fraud: true,
  fraud_score: 0.92,
  fraud_reason: "Payment Amount is High",
  fraud_source: "Fraudulent Transaction",
  transaction_id: "TRX-001",
}

// Form validation schema
const formSchema = z.object({
  transactionAmount: z.string().min(1, { message: "Amount is required" }),
  transactionChannel: z.string().min(1, { message: "Channel is required" }),
  transactionPaymentMode: z.string().min(1, { message: "Payment mode is required" }),
  paymentGatewayBank: z.string().optional(),
  payerEmail: z.string().email({ message: "Invalid email address" }),
  payerMobile: z.string().min(1, { message: "Mobile number is required" }),
  payerCardBrand: z.string().optional(),
  payerDevice: z.string().min(1, { message: "Device information is required" }),
  payerBrowser: z.string().min(1, { message: "Browser information is required" }),
  payeeId: z.string().min(1, { message: "Payee ID is required" }),
})

export default function TransactionPage() {
  const [activeTab, setActiveTab] = useState("view")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredTransactions, setFilteredTransactions] = useState(transactions)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [predictionResult, setPredictionResult] = useState(oldPreductionResult)
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transactionAmount: "",
      transactionChannel: "",
      transactionPaymentMode: "",
      paymentGatewayBank: "",
      payerEmail: "",
      payerMobile: "",
      payerCardBrand: "",
      payerDevice: "",
      payerBrowser: "",
      payeeId: "",
    },
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilteredTransactions(
      transactions.filter(
        (tx) => 
          tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.payerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tx.payeeId.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    
    try {
      console.log(values)

      let data = {
        'transaction_amount': values.transactionAmount,
        'transaction_channel': values.transactionChannel,
        'transaction_payment_mode': values.transactionPaymentMode,
        'payment_gateway_bank': values.paymentGatewayBank,
        // 'payer_email': values.payerEmail,
        // 'payer_mobile': values.payerMobile,
        // 'payer_card_brand': values.payerCardBrand,
        // 'payer_device': values.payerDevice,
        'payer_browser': values.payerBrowser,
        'payee_id': values.payeeId
      }

      console.log(data)
      // Simulate API call
      const res = await fetch(`${process.env.BACKEND_URL}/predict`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({transaction:data}),
        })

      const d = await res.json()
      setPredictionResult(d)
      setShowModal(true)
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem adding the transaction. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-6">
      <div className="mb-8 dashboard-header">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight">Transaction Management</h1>
          <p className="text-muted-foreground">
            View transaction history and add new transactions
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-muted/50 rounded-lg">
          <TabsTrigger value="view" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
            View Transactions
          </TabsTrigger>
          <TabsTrigger value="add" className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
            Add Transaction
          </TabsTrigger>
        </TabsList>

        <TabsContent value="view">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View and search through transaction records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-col gap-4 sm:flex-row">
                <form onSubmit={handleSearch} className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search by ID, email, or payee ID..."
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
                      <TableHead className="hidden md:table-cell">Payment Mode</TableHead>
                      <TableHead className="hidden lg:table-cell">Payer Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Risk Score</TableHead>
                      <TableHead className="text-right">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((tx) => (
                      <TableRow key={tx.id} className="table-row-hover">
                        <TableCell className="font-medium">{tx.id}</TableCell>
                        <TableCell>{tx.date}</TableCell>
                        <TableCell>${tx.amount.toFixed(2)}</TableCell>
                        <TableCell className="hidden md:table-cell">{tx.paymentMode}</TableCell>
                        <TableCell className="hidden lg:table-cell">{tx.payerEmail}</TableCell>
                        <TableCell>
                          <span className={`badge-status ${
                            tx.status === "Fraudulent"
                              ? "badge-fraudulent"
                              : tx.status === "High Risk"
                                ? "badge-high-risk"
                                : "badge-legitimate"
                          }`}>
                            {tx.status}
                          </span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge
                            variant={
                              tx.riskScore >= 70
                                ? "destructive"
                                : tx.riskScore >= 40
                                  ? "outline"
                                  : "secondary"
                            }
                            className={
                              tx.riskScore >= 70
                                ? "bg-destructive/15 text-destructive border border-destructive/20 hover:bg-destructive/20"
                                : tx.riskScore >= 40
                                  ? "bg-warning/15 text-warning border border-warning/20 hover:bg-warning/20"
                                  : "bg-success/15 text-success border border-success/20 hover:bg-success/20"
                            }
                          >
                            {tx.riskScore}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" className="h-8 gap-1 text-primary">
                            View
                            <ArrowRight className="ml-1 h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing <strong>{filteredTransactions.length}</strong> of <strong>{transactions.length}</strong> transactions
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
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add New Transaction</CardTitle>
              <CardDescription>Enter transaction details to add to the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6 bg-info/10 border-info/20 text-info">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription className="text-info/80">
                  All transactions will be automatically analyzed by the fraud detection system.
                </AlertDescription>
              </Alert>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Transaction Details</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="transactionAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Enter amount" className="pl-8" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="transactionChannel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Channel</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select channel" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Web">Web</SelectItem>
                                <SelectItem value="Mobile App">Mobile App</SelectItem>
                                <SelectItem value="In-Store">In-Store</SelectItem>
                                <SelectItem value="Phone">Phone</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="transactionPaymentMode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Mode</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select payment mode" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Credit Card">Credit Card</SelectItem>
                                <SelectItem value="Debit Card">Debit Card</SelectItem>
                                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                <SelectItem value="Digital Wallet">Digital Wallet</SelectItem>
                                <SelectItem value="Cash">Cash</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="paymentGatewayBank"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gateway/Bank</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter gateway or bank" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Payer Information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="payerEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Enter email address" className="pl-8" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="payerMobile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mobile Number</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Enter mobile number" className="pl-8" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="payerCardBrand"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Card Brand</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <CreditCard className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Enter card brand (if applicable)" className="pl-8" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="payeeId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payee ID</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Enter payee ID" className="pl-8" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Device Information</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="payerDevice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Device</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Laptop className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Enter device information" className="pl-8" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="payerBrowser"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Browser</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter browser information" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      className="bg-primary hover:bg-primary/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Transaction
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showModal && predictionResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Prediction Result</h3>
            <div className="space-y-3">
              <p className="flex justify-between">
                <span className="font-medium text-muted-foreground">Fraud Status:</span>
                <span>{predictionResult.is_fraud ? "Fraudulent" : "Legitimate"}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-muted-foreground">Fraud Score:</span>
                <span>{predictionResult.fraud_score.toFixed(4)}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-muted-foreground">Fraud Reason:</span>
                <span>{predictionResult.fraud_reason}</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium text-muted-foreground">Fraud Source:</span>
                <span>{predictionResult.fraud_source}</span>
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setShowModal(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}    </div>  )
}
