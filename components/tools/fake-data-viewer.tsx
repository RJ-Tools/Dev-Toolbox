"use client"

import * as React from "react"
import { Copy, RefreshCw, User, MapPin, CreditCard, Building2 } from "lucide-react"
import { toast } from "sonner"
import { faker } from "@faker-js/faker"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

export function FakeDataViewer() {
    const [person, setPerson] = React.useState<any>(null)
    const [address, setAddress] = React.useState<any>(null)
    const [finance, setFinance] = React.useState<any>(null)
    const [company, setCompany] = React.useState<any>(null)

    const generatePerson = () => {
        setPerson({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            jobTitle: faker.person.jobTitle(),
            bio: faker.person.bio(),
            username: faker.internet.username(),
        })
    }

    const generateAddress = () => {
        setAddress({
            street: faker.location.streetAddress(),
            city: faker.location.city(),
            state: faker.location.state(),
            zipCode: faker.location.zipCode(),
            country: faker.location.country(),
            latitude: faker.location.latitude(),
            longitude: faker.location.longitude(),
        })
    }

    const generateFinance = () => {
        setFinance({
            accountNumber: faker.finance.accountNumber(),
            routingNumber: faker.finance.routingNumber(),
            iban: faker.finance.iban(),
            currency: faker.finance.currency().name,
            amount: faker.finance.amount(),
            bitcoinAddress: faker.finance.bitcoinAddress(),
        })
    }

    const generateCompany = () => {
        setCompany({
            name: faker.company.name(),
            catchPhrase: faker.company.catchPhrase(),
            buzzPhrase: faker.company.buzzPhrase(),
            buzzNoun: faker.company.buzzNoun(),
        })
    }

    const generateAll = () => {
        generatePerson()
        generateAddress()
        generateFinance()
        generateCompany()
    }

    React.useEffect(() => {
        generateAll()
    }, [])

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("Copied to clipboard")
    }

    const copyJson = (data: any) => {
        copyToClipboard(JSON.stringify(data, null, 2))
    }

    const DataRow = ({ label, value }: { label: string, value: string }) => (
        <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md group">
            <div className="flex flex-col gap-1 overflow-hidden">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
                <span className="font-mono text-sm truncate select-all">{value}</span>
            </div>
            <Button
                size="icon"
                variant="ghost"
                className="opacity-0 group-hover:opacity-100 h-8 w-8"
                onClick={() => copyToClipboard(value)}
            >
                <Copy className="h-4 w-4" />
            </Button>
        </div>
    )

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-end">
                <Button onClick={generateAll}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate All
                </Button>
            </div>

            <Tabs defaultValue="person" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="person"><User className="mr-2 h-4 w-4" /> Person</TabsTrigger>
                    <TabsTrigger value="address"><MapPin className="mr-2 h-4 w-4" /> Address</TabsTrigger>
                    <TabsTrigger value="finance"><CreditCard className="mr-2 h-4 w-4" /> Finance</TabsTrigger>
                    <TabsTrigger value="company"><Building2 className="mr-2 h-4 w-4" /> Company</TabsTrigger>
                </TabsList>

                <TabsContent value="person" className="mt-6">
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b">
                                <h3 className="text-lg font-semibold">Personal Identity</h3>
                                <Button variant="outline" size="sm" onClick={() => copyJson(person)}>Copy JSON</Button>
                            </div>
                            {person && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <DataRow label="Full Name" value={`${person.firstName} ${person.lastName}`} />
                                    <DataRow label="Email" value={person.email} />
                                    <DataRow label="Username" value={person.username} />
                                    <DataRow label="Phone" value={person.phone} />
                                    <DataRow label="Job Title" value={person.jobTitle} />
                                    <DataRow label="Bio" value={person.bio} />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="address" className="mt-6">
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b">
                                <h3 className="text-lg font-semibold">Location Data</h3>
                                <Button variant="outline" size="sm" onClick={() => copyJson(address)}>Copy JSON</Button>
                            </div>
                            {address && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <DataRow label="Street" value={address.street} />
                                    <DataRow label="City" value={address.city} />
                                    <DataRow label="State" value={address.state} />
                                    <DataRow label="Zip Code" value={address.zipCode} />
                                    <DataRow label="Country" value={address.country} />
                                    <DataRow label="Coordinates" value={`${address.latitude}, ${address.longitude}`} />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="finance" className="mt-6">
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b">
                                <h3 className="text-lg font-semibold">Financial Data</h3>
                                <Button variant="outline" size="sm" onClick={() => copyJson(finance)}>Copy JSON</Button>
                            </div>
                            {finance && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <DataRow label="IBAN" value={finance.iban} />
                                    <DataRow label="Account Number" value={finance.accountNumber} />
                                    <DataRow label="Routing Number" value={finance.routingNumber} />
                                    <DataRow label="Currency" value={finance.currency} />
                                    <DataRow label="Amount" value={finance.amount} />
                                    <DataRow label="Bitcoin Address" value={finance.bitcoinAddress} />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="company" className="mt-6">
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-center pb-4 border-b">
                                <h3 className="text-lg font-semibold">Company Data</h3>
                                <Button variant="outline" size="sm" onClick={() => copyJson(company)}>Copy JSON</Button>
                            </div>
                            {company && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <DataRow label="Company Name" value={company.name} />
                                    <DataRow label="Catch Phrase" value={company.catchPhrase} />
                                    <DataRow label="Buzz Noun" value={company.buzzNoun} />
                                    <DataRow label="Buzz Phrase" value={company.buzzPhrase} />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
