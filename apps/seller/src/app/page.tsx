import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    Textarea,
} from "@repo/ui";

export default function Home() {
    return (
        <main className="mx-auto grid max-w-5xl gap-6 px-6 py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Shared UI - Seller App</CardTitle>
                    <CardDescription>
                        Shared components and seller specific color override are active.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="seller-name">Seller Display Name</Label>
                        <Input id="seller-name" placeholder="Northern Supply Co." />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="seller-note">Operational Note</Label>
                        <Textarea id="seller-note" placeholder="Cut-off time is 4PM" />
                    </div>
                    <div className="grid gap-2">
                        <Label>Fulfillment Type</Label>
                        <Select defaultValue="warehouse">
                            <SelectTrigger>
                                <SelectValue placeholder="Select fulfillment" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="warehouse">Warehouse</SelectItem>
                                <SelectItem value="dropship">Dropship</SelectItem>
                                <SelectItem value="crossdock">Cross-dock</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Button>Save Profile</Button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline">Open Dialog</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Apply changes now?</DialogTitle>
                                    <DialogDescription>
                                        Seller settings updates will sync to all channels.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button variant="secondary">Review</Button>
                                    <Button>Apply</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary">Bulk Actions</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>Export inventory</DropdownMenuItem>
                                <DropdownMenuItem>Pause all listings</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Inventory Snapshot</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>SKU</TableHead>
                                <TableHead>Warehouse</TableHead>
                                <TableHead className="text-right">Available</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>SELL-120</TableCell>
                                <TableCell>HCM-01</TableCell>
                                <TableCell className="text-right">184</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>SELL-332</TableCell>
                                <TableCell>HN-02</TableCell>
                                <TableCell className="text-right">71</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </main>
    );
}
