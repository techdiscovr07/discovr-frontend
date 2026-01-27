import Link from "next/link"
import {
  Sparkles,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Clock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/95 backdrop-blur supports-[backdrop-filter]:bg-[hsl(var(--background))]/60">
        <div className="container flex h-16 items-center justify-between max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-[hsl(var(--primary))]" />
            <span className="font-bold text-xl">Discovr</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#features"
              className="text-sm font-medium text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))] transition-colors"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))] transition-colors"
            >
              How it Works
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))] transition-colors"
            >
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white">
          <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:20px_20px]" />
          <div className="container relative max-w-7xl mx-auto px-4 py-24 md:py-32 lg:py-40">
            <div className="flex flex-col items-center text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--background))]/50 backdrop-blur-sm">
                <Zap className="h-4 w-4 text-[hsl(var(--primary))]" />
                <span className="text-sm font-medium">
                  AI-Powered Creator Advertising
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-5xl">
                Where the Best Creators & Brands Close Deals in{" "}
                <span className="underline decoration-4 underline-offset-8">
                  Minutes, Not Months
                </span>
              </h1>

              <p className="text-lg md:text-xl text-[hsl(var(--muted-foreground))] max-w-2xl">
                Discovr uses AI to match brands with perfect creators, automate
                negotiations, and launch campaigns 10x faster. No more endless
                emails. Just results.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link href="/signup">
                  <Button size="lg" className="text-base px-8 h-12">
                    Launch a Campaign
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-base px-8 h-12 bg-[hsl(var(--background))]/80 backdrop-blur-sm"
                  >
                    Join as a Creator
                  </Button>
                </Link>
              </div>

              <div className="pt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-[hsl(var(--muted-foreground))]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[hsl(var(--primary))]" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[hsl(var(--primary))]" />
                  <span>Free for creators</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[hsl(var(--primary))]" />
                  <span>Launch in 5 minutes</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="border-y border-[hsl(var(--border))] bg-[hsl(var(--background))]">
          <div className="container max-w-7xl mx-auto px-4 py-12">
            <p className="text-center text-sm font-medium text-[hsl(var(--muted-foreground))] mb-8">
              Trusted by leading brands and creators
            </p>
            <div className="flex flex-wrap items-center justify-center gap-12 opacity-60">
              <div className="text-2xl font-bold">Brand A</div>
              <div className="text-2xl font-bold">Brand B</div>
              <div className="text-2xl font-bold">Brand C</div>
              <div className="text-2xl font-bold">Brand D</div>
              <div className="text-2xl font-bold">Brand E</div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 md:py-32 bg-[hsl(var(--background))]">
          <div className="container max-w-7xl mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                How It Works
              </h2>
              <p className="text-lg text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
                Launch your creator campaign in three simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {/* Step 1 */}
              <div className="relative">
                <Card className="h-full border-2 hover:border-[hsl(var(--primary))] transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] mb-4">
                      <span className="text-xl font-bold">1</span>
                    </div>
                    <CardTitle>Tell Us Your Goals</CardTitle>
                    <CardDescription>
                      Share your campaign objectives, target audience, and
                      budget. Our AI analyzes millions of data points to
                      understand what you need.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                      <Clock className="h-4 w-4" />
                      <span>Takes 2 minutes</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <Card className="h-full border-2 hover:border-[hsl(var(--primary))] transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] mb-4">
                      <span className="text-xl font-bold">2</span>
                    </div>
                    <CardTitle>Get Matched with Creators</CardTitle>
                    <CardDescription>
                      Our AI instantly matches you with the perfect creators
                      based on engagement rates, audience demographics, and
                      past performance.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                      <Zap className="h-4 w-4" />
                      <span>AI-powered matching</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <Card className="h-full border-2 hover:border-[hsl(var(--primary))] transition-colors">
                  <CardHeader>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))] mb-4">
                      <span className="text-xl font-bold">3</span>
                    </div>
                    <CardTitle>Launch & Track Results</CardTitle>
                    <CardDescription>
                      Approve deals with one click. Monitor performance in
                      real-time. Our platform handles contracts, payments, and
                      reporting automatically.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                      <TrendingUp className="h-4 w-4" />
                      <span>Real-time analytics</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-24 md:py-32 bg-[hsl(var(--muted))]"
        >
          <div className="container max-w-7xl mx-auto px-4">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Everything You Need to Succeed
              </h2>
              <p className="text-lg text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto">
                Powerful features designed for modern creator marketing
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Feature 1 */}
              <Card className="bg-[hsl(var(--card))]/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[hsl(var(--primary))]/10 mb-4">
                    <Sparkles className="h-6 w-6 text-[hsl(var(--primary))]" />
                  </div>
                  <CardTitle>AI-Powered Matching</CardTitle>
                  <CardDescription>
                    Smart algorithms find creators who perfectly align with your
                    brand values and target audience.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature 2 */}
              <Card className="bg-[hsl(var(--card))]/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[hsl(var(--primary))]/10 mb-4">
                    <Zap className="h-6 w-6 text-[hsl(var(--primary))]" />
                  </div>
                  <CardTitle>Instant Negotiations</CardTitle>
                  <CardDescription>
                    AI negotiates rates and terms automatically, closing deals
                    in minutes instead of weeks.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature 3 */}
              <Card className="bg-[hsl(var(--card))]/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[hsl(var(--primary))]/10 mb-4">
                    <Target className="h-6 w-6 text-[hsl(var(--primary))]" />
                  </div>
                  <CardTitle>Performance Analytics</CardTitle>
                  <CardDescription>
                    Track ROI, engagement, and conversions in real-time with
                    comprehensive analytics dashboards.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature 4 */}
              <Card className="bg-[hsl(var(--card))]/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[hsl(var(--primary))]/10 mb-4">
                    <Shield className="h-6 w-6 text-[hsl(var(--primary))]" />
                  </div>
                  <CardTitle>Secure Payments</CardTitle>
                  <CardDescription>
                    Automated escrow and payment processing ensures both brands
                    and creators are protected.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature 5 */}
              <Card className="bg-[hsl(var(--card))]/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[hsl(var(--primary))]/10 mb-4">
                    <TrendingUp className="h-6 w-6 text-[hsl(var(--primary))]" />
                  </div>
                  <CardTitle>Campaign Optimization</CardTitle>
                  <CardDescription>
                    AI continuously optimizes your campaigns for maximum ROI
                    based on performance data.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature 6 */}
              <Card className="bg-[hsl(var(--card))]/50 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[hsl(var(--primary))]/10 mb-4">
                    <Clock className="h-6 w-6 text-[hsl(var(--primary))]" />
                  </div>
                  <CardTitle>24/7 Support</CardTitle>
                  <CardDescription>
                    Get help whenever you need it with our AI assistant and
                    dedicated support team.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 md:py-32 bg-black text-white">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Ready to Transform Your Creator Marketing?
            </h2>
            <p className="text-lg md:text-xl opacity-90 mb-10 max-w-2xl mx-auto">
              Join hundreds of brands and thousands of creators already using
              Discovr to close deals faster and drive better results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="text-base px-8 h-12 bg-white text-black hover:bg-gray-100"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 h-12 border-white text-white hover:bg-white/10"
                >
                  Sign In
                </Button>
              </Link>
            </div>
            <p className="text-sm mt-6 opacity-75">
              No credit card required • Free for creators • Launch in 5 minutes
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[hsl(var(--border))] py-12 bg-[hsl(var(--background))]">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-[hsl(var(--muted-foreground))]">
                <li>
                  <Link href="#features" className="hover:text-[hsl(var(--foreground))]">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[hsl(var(--foreground))]">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[hsl(var(--foreground))]">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-[hsl(var(--muted-foreground))]">
                <li>
                  <Link href="#" className="hover:text-[hsl(var(--foreground))]">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[hsl(var(--foreground))]">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[hsl(var(--foreground))]">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-[hsl(var(--muted-foreground))]">
                <li>
                  <Link href="#" className="hover:text-[hsl(var(--foreground))]">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[hsl(var(--foreground))]">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[hsl(var(--foreground))]">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-[hsl(var(--muted-foreground))]">
                <li>
                  <Link href="#" className="hover:text-[hsl(var(--foreground))]">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-[hsl(var(--foreground))]">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[hsl(var(--border))] text-sm text-[hsl(var(--muted-foreground))]">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Sparkles className="h-5 w-5 text-[hsl(var(--primary))]" />
              <span className="font-semibold">Discovr</span>
            </div>
            <p>&copy; 2026 Discovr. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
