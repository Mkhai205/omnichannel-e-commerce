import Image from "next/image";
import Link from "next/link";
import { SiteBreadcrumb } from "@/components/layout/site-breadcrumb";
import { Button } from "@/components/ui";

export default function NotFound() {
    return (
        <>
            <SiteBreadcrumb section="Home" current="404 Error Page" />

            <main className="bg-white py-14 sm:py-20">
                <div className="mx-auto flex flex-col items-center px-4 text-center md:px-6">
                    <Image
                        src="/404.svg"
                        alt="Minh họa lỗi 404"
                        width={580}
                        height={440}
                        priority
                    />

                    <h1 className="mt-8 text-3xl font-semibold leading-tight text-gray-900 sm:text-[40px] sm:leading-[1.2]">
                        Oops! page not found
                    </h1>

                    <Button
                        asChild
                        className="mt-8 h-12 rounded-full bg-success px-8 text-sm font-semibold text-success-foreground hover:bg-success-dark"
                    >
                        <Link href="/">Back to Home</Link>
                    </Button>
                </div>
            </main>
        </>
    );
}
