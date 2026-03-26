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
                    <CardTitle>Shared UI - Admin App</CardTitle>
                    <CardDescription>
                        Governance console using common shadcn components from @repo/ui.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="admin-policy">Policy Name</Label>
                        <Input id="admin-policy" placeholder="Fraud hold threshold" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="admin-note">Policy Note</Label>
                        <Textarea id="admin-note" placeholder="Escalate above 20M VND" />
                    </div>
                    <div className="grid gap-2">
                        <Label>Severity</Label>
                        <Select defaultValue="medium">
                            <SelectTrigger>
                                <SelectValue placeholder="Select severity" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Button>Save Policy</Button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline">Open Confirm</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Enforce policy globally?</DialogTitle>
                                    <DialogDescription>
                                        This action affects all tenant channels immediately.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button variant="secondary">Cancel</Button>
                                    <Button>Enforce</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary">Policy Actions</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>Duplicate policy</DropdownMenuItem>
                                <DropdownMenuItem>Disable policy</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Audit Trail</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead className="text-right">Actor</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>AUD-4491</TableCell>
                                <TableCell>Updated payout policy</TableCell>
                                <TableCell className="text-right">ops-admin</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>AUD-4492</TableCell>
                                <TableCell>Disabled seller listing</TableCell>
                                <TableCell className="text-right">risk-team</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </main>
    );
}
