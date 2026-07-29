import Container from "@/components/shared/container";
import { Bike } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <Container className="py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <Bike className="h-5 w-5" />
              <span>GearUp</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              Rent sports & outdoor gear instantly. Your adventure starts here.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <Link href="/gear" className="hover:text-foreground">Browse Gears</Link>
              <Link href="/login" className="hover:text-foreground">Login</Link>
              <Link href="/register" className="hover:text-foreground">Register</Link>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Contact</h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <span>Email: support@gearup.com</span>
              <span>Phone: +880 1700-000000</span>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} GearUp. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
