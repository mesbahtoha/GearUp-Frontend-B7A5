import Container from "@/components/shared/container";

export default function HomePage() {
  return (
    <main>
      <Container className="py-20">
        <h1 className="text-4xl font-bold">
          Welcome to GearUp
        </h1>

        <p className="mt-4 text-muted-foreground">
          Sports & Outdoor Equipment Rental Platform
        </p>
      </Container>
    </main>
  );
}