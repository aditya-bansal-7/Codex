"use client"

import { useEffect, useState } from "react"
import { AlertCircle, DollarSign, Globe, Info, Plus, Save, Trash, User } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import prisma from "@/lib/prisma"
// Sample rules data

const existingRules = [
  {
    id: "rule-001",
    name: "High Amount Threshold",
    description: "Flag transactions above a certain amount",
    type: "amount",
    condition: "above",
    value: 1000,
    enabled: true,
    riskScore: 80,
  },
  {
    id: "rule-002",
    name: "Unusual Location",
    description: "Flag transactions from unusual locations",
    type: "location",
    condition: "not-in",
    value: "US,CA,UK",
    enabled: true,
    riskScore: 70,
  },
  {
    id: "rule-003",
    name: "Velocity Check",
    description: "Flag multiple transactions in short time period",
    type: "velocity",
    condition: "above",
    value: "5 per hour",
    enabled: false,
    riskScore: 65,
  },
  {
    id: "rule-004",
    name: "New Payee",
    description: "Flag transactions to new payees",
    type: "payee",
    condition: "is-new",
    value: "7 days",
    enabled: true,
    riskScore: 50,
  },
]

export default function RulesConfiguration() {
  const [rules, setRules] = useState(existingRules)
  const [activeTab, setActiveTab] = useState("existing")

  useEffect(() => {
    const fetchRules = async () => {
      const oldRules = await prisma.fraudRule.findMany();
      
      const transformedRules = oldRules.map((rule) => ({
        id: rule.id,
        name: rule.name,
        description: rule.description,
        type: rule.type,
        condition: rule.condition,
        riskScore: rule.riskScore,
        enabled: rule.status,
        createdAt: rule.createdAt,
        value: rule.condition.split(" ")[1],
      }));
      
      setRules(transformedRules);
    };

    fetchRules();
  }, [])
  const [newRule, setNewRule] = useState({
    name: "",
    description: "",
    type: "amount",
    condition: "above",
    value: "",
    riskScore: 50,
  })

  const handleAddRule = () => {
    const ruleId = `rule-${(rules.length + 1).toString().padStart(3, "0")}`
    setRules([
      ...rules,
      {
        id: ruleId,
        ...newRule,
        enabled: true,
      },
    ])

    // Reset form
    setNewRule({
      name: "",
      description: "",
      type: "amount",
      condition: "above",
      value: "",
      riskScore: 50,
    })

    // Switch to existing rules tab
    setActiveTab("existing")
  }

  const toggleRuleStatus = (id: string) => {
    setRules(rules.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)))
  }

  const deleteRule = (id: string) => {
    setRules(rules.filter((rule) => rule.id !== id))
  }

  return (
    <div className="container py-6">
      <div className="mb-8 dashboard-header">
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight">Rules Configuration</h1>
          <p className="text-muted-foreground">Configure and manage fraud detection rules</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-muted/50 rounded-lg">
          <TabsTrigger
            value="existing"
            className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Existing Rules
          </TabsTrigger>
          <TabsTrigger
            value="new"
            className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            Create New Rule
          </TabsTrigger>
        </TabsList>

        <TabsContent value="existing">
          <Card>
            <CardHeader>
              <CardTitle>Fraud Detection Rules</CardTitle>
              <CardDescription>Manage your existing fraud detection rules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="hidden lg:table-cell">Condition</TableHead>
                      <TableHead className="hidden lg:table-cell">Risk Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell className="font-medium">{rule.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{rule.description}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{rule.type.charAt(0).toUpperCase() + rule.type.slice(1)}</Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {rule.condition === "above" ? ">" : rule.condition === "below" ? "<" : rule.condition}{" "}
                          {rule.value}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              rule.riskScore >= 70 ? "destructive" : rule.riskScore >= 40 ? "outline" : "secondary"
                            }
                            className={
                              rule.riskScore >= 70
                                ? "bg-destructive/15 text-destructive border border-destructive/20 hover:bg-destructive/20"
                                : rule.riskScore >= 40
                                  ? "bg-warning/15 text-warning border border-warning/20 hover:bg-warning/20"
                                  : "bg-success/15 text-success border border-success/20 hover:bg-success/20"
                            }
                          >
                            {rule.riskScore}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={rule.enabled}
                            onCheckedChange={() => toggleRuleStatus(rule.id)}
                            className="data-[state=checked]:bg-success"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="text-info hover:text-info hover:bg-info/10">
                              <Info className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteRule(rule.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setActiveTab("new")}>
                <Plus className="mr-2 h-4 w-4" />
                Add New Rule
              </Button>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>Create New Rule</CardTitle>
              <CardDescription>Configure a new fraud detection rule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <Alert className="bg-info/10 border-info/20 text-info">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription className="text-info/80">
                    Rules are evaluated in order of risk score. Higher risk scores are evaluated first.
                  </AlertDescription>
                </Alert>

                <div className="grid gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="rule-name">Rule Name</Label>
                    <Input
                      id="rule-name"
                      placeholder="e.g., High Amount Threshold"
                      value={newRule.name}
                      onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="rule-description">Description</Label>
                    <Textarea
                      id="rule-description"
                      placeholder="Describe what this rule detects"
                      value={newRule.description}
                      onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Rule Type</Label>
                    <Select value={newRule.type} onValueChange={(value) => setNewRule({ ...newRule, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rule type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="amount">
                          <div className="flex items-center">
                            <DollarSign className="mr-2 h-4 w-4" />
                            <span>Amount</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="location">
                          <div className="flex items-center">
                            <Globe className="mr-2 h-4 w-4" />
                            <span>Location</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="velocity">
                          <div className="flex items-center">
                            <AlertCircle className="mr-2 h-4 w-4" />
                            <span>Velocity</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="payee">
                          <div className="flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            <span>Payee</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label>Condition</Label>
                      <Select
                        value={newRule.condition}
                        onValueChange={(value) => setNewRule({ ...newRule, condition: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          {newRule.type === "amount" && (
                            <>
                              <SelectItem value="above">Above</SelectItem>
                              <SelectItem value="below">Below</SelectItem>
                              <SelectItem value="between">Between</SelectItem>
                            </>
                          )}
                          {newRule.type === "location" && (
                            <>
                              <SelectItem value="in">In</SelectItem>
                              <SelectItem value="not-in">Not In</SelectItem>
                            </>
                          )}
                          {newRule.type === "velocity" && (
                            <>
                              <SelectItem value="above">Above</SelectItem>
                            </>
                          )}
                          {newRule.type === "payee" && (
                            <>
                              <SelectItem value="is-new">Is New</SelectItem>
                              <SelectItem value="blacklisted">Blacklisted</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="rule-value">Value</Label>
                      <Input
                        id="rule-value"
                        placeholder={
                          newRule.type === "amount"
                            ? "e.g., 1000"
                            : newRule.type === "location"
                              ? "e.g., US,CA,UK"
                              : newRule.type === "velocity"
                                ? "e.g., 5 per hour"
                                : "e.g., 7 days"
                        }
                        value={newRule.value}
                        onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid gap-2 pt-2">
                    <div className="flex justify-between">
                      <Label>Risk Score: {newRule.riskScore}</Label>
                      <span
                        className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                          newRule.riskScore >= 70
                            ? "bg-destructive/15 text-destructive"
                            : newRule.riskScore >= 40
                              ? "bg-warning/15 text-warning"
                              : "bg-success/15 text-success"
                        }`}
                      >
                        {newRule.riskScore >= 70 ? "High" : newRule.riskScore >= 40 ? "Medium" : "Low"}
                      </span>
                    </div>
                    <Slider
                      value={[newRule.riskScore]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => setNewRule({ ...newRule, riskScore: value[0] })}
                      className={`${
                        newRule.riskScore >= 70
                          ? "[&_[role=slider]]:bg-destructive [&_[role=slider]]:border-destructive"
                          : newRule.riskScore >= 40
                            ? "[&_[role=slider]]:bg-warning [&_[role=slider]]:border-warning"
                            : "[&_[role=slider]]:bg-success [&_[role=slider]]:border-success"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setActiveTab("existing")}
                className="border-muted-foreground/20 hover:bg-background"
              >
                Cancel
              </Button>
              <Button onClick={handleAddRule} className="bg-success hover:bg-success/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Rule
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Rule Types Documentation</AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-4">
                    <div>
                      <h3 className="text-lg font-medium">Amount Rules</h3>
                      <p className="text-sm text-muted-foreground">
                        Flag transactions based on the transaction amount. Useful for detecting unusually large
                        transactions.
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-medium">Location Rules</h3>
                      <p className="text-sm text-muted-foreground">
                        Flag transactions based on the geographic location. Useful for detecting transactions from
                        high-risk countries.
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-medium">Velocity Rules</h3>
                      <p className="text-sm text-muted-foreground">
                        Flag transactions based on the frequency of transactions. Useful for detecting account
                        takeovers.
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-medium">Payee Rules</h3>
                      <p className="text-sm text-muted-foreground">
                        Flag transactions based on the payee information. Useful for detecting transactions to new or
                        suspicious payees.
                      </p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Best Practices</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    <li>Start with a small set of rules and expand gradually</li>
                    <li>Monitor false positives and adjust rule thresholds accordingly</li>
                    <li>Use a combination of rule types for better coverage</li>
                    <li>Regularly review and update rules based on new fraud patterns</li>
                    <li>Test rules with historical data before enabling them</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

