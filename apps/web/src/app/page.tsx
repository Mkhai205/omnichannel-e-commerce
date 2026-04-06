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
} from "@/components/ui";

export default function Home() {
    return (
        <main className="mx-auto grid max-w-5xl gap-6 px-6 py-10">
            <Card>
                <CardHeader>
                    <CardTitle>Shared UI - Web App</CardTitle>
                    <CardDescription>
                        This page validates web-local shadcn components with app-level token
                        overrides.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="web-name">Storefront Name</Label>
                        <Input id="web-name" placeholder="Omnichannel Store" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="web-note">Banner Note</Label>
                        <Textarea id="web-note" placeholder="Free shipping this week" />
                    </div>
                    <div className="grid gap-2">
                        <Label>Channel</Label>
                        <Select defaultValue="web">
                            <SelectTrigger>
                                <SelectValue placeholder="Select channel" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="web">Web</SelectItem>
                                <SelectItem value="social">Social</SelectItem>
                                <SelectItem value="marketplace">Marketplace</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Button>Save Draft</Button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline">Preview Dialog</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Publish update?</DialogTitle>
                                    <DialogDescription>
                                        This modal is rendered from the web app local component set.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button variant="secondary">Cancel</Button>
                                    <Button>Publish</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="secondary">Quick Actions</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>Duplicate section</DropdownMenuItem>
                                <DropdownMenuItem>Archive campaign</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Top Products</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>SKU</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className="text-right">Revenue</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>WEB-001</TableCell>
                                <TableCell>Wireless Earbuds</TableCell>
                                <TableCell className="text-right">$4,220</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>WEB-014</TableCell>
                                <TableCell>Travel Backpack</TableCell>
                                <TableCell className="text-right">$2,980</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </main>
    );
}
