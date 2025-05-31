
export function AppFooter() {
  return (
    <footer className="bg-card/30 py-6 text-center">
      <div className="container mx-auto px-4">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Jerk Green Egg. Embrace the jerk.
        </p>
      </div>
    </footer>
  );
}
