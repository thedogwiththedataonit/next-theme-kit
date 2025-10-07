import { ThemeSwitcher } from "@/components/theme-switcher"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-between items-center border-b-2">
        <h1 className="text-3xl font-bold tracking-tight">Theme Switcher</h1>
        <ThemeSwitcher />
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 max-w-7xl">
        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Theme Preview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Card Component</CardTitle>
                <CardDescription>This is a card component with a description.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="leading-relaxed">This card demonstrates the theme's card styling.</p>
                <p className="font-serif leading-relaxed">This text uses the serif font.</p>
                <p className="font-mono text-sm leading-relaxed">This text uses the monospace font.</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Submit</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Form Elements</CardTitle>
                <CardDescription>Various form elements with the current theme.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-medium">Name</Label>
                  <Input id="name" placeholder="Enter your name" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-medium">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" className="h-11" />
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="default">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Shadow Examples</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-card text-card-foreground rounded-xl shadow-xs border-2 font-medium text-center">shadow-xs</div>
            <div className="p-6 bg-card text-card-foreground rounded-xl shadow-sm border-2 font-medium text-center">shadow-sm</div>
            <div className="p-6 bg-card text-card-foreground rounded-xl shadow border-2 font-medium text-center">shadow</div>
            <div className="p-6 bg-card text-card-foreground rounded-xl shadow-md border-2 font-medium text-center">shadow-md</div>
            <div className="p-6 bg-card text-card-foreground rounded-xl shadow-lg border-2 font-medium text-center">shadow-lg</div>
            <div className="p-6 bg-card text-card-foreground rounded-xl shadow-xl border-2 font-medium text-center">shadow-xl</div>
            <div className="p-6 bg-card text-card-foreground rounded-xl shadow-2xl border-2 font-medium text-center">shadow-2xl</div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Font Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 bg-card text-card-foreground rounded-xl shadow-lg border-2">
              <h3 className="font-bold text-lg mb-3">Sans-serif Font</h3>
              <p className="font-sans leading-relaxed">The quick brown fox jumps over the lazy dog.</p>
            </div>
            <div className="p-8 bg-card text-card-foreground rounded-xl shadow-lg border-2">
              <h3 className="font-bold text-lg mb-3">Serif Font</h3>
              <p className="font-serif leading-relaxed">The quick brown fox jumps over the lazy dog.</p>
            </div>
            <div className="p-8 bg-card text-card-foreground rounded-xl shadow-lg border-2">
              <h3 className="font-bold text-lg mb-3">Monospace Font</h3>
              <p className="font-mono leading-relaxed text-sm">The quick brown fox jumps over the lazy dog.</p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">More Components</h2>
          <Tabs defaultValue="tab1">
            <TabsList className="h-12">
              <TabsTrigger value="tab1" className="text-sm font-medium">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2" className="text-sm font-medium">Tab 2</TabsTrigger>
              <TabsTrigger value="tab3" className="text-sm font-medium">Tab 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="p-8 border-2 rounded-xl mt-4 shadow-md">
              <p className="leading-relaxed">This is the content for Tab 1.</p>
            </TabsContent>
            <TabsContent value="tab2" className="p-8 border-2 rounded-xl mt-4 shadow-md">
              <p className="leading-relaxed">This is the content for Tab 2.</p>
            </TabsContent>
            <TabsContent value="tab3" className="p-8 border-2 rounded-xl mt-4 shadow-md">
              <p className="leading-relaxed">This is the content for Tab 3.</p>
            </TabsContent>
          </Tabs>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Color Palette</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-8 bg-primary text-primary-foreground rounded-xl shadow-lg font-medium text-center">Primary</div>
            <div className="p-8 bg-secondary text-secondary-foreground rounded-xl shadow-lg font-medium text-center">Secondary</div>
            <div className="p-8 bg-accent text-accent-foreground rounded-xl shadow-lg font-medium text-center">Accent</div>
            <div className="p-8 bg-muted text-muted-foreground rounded-xl shadow-lg font-medium text-center">Muted</div>
            <div className="p-8 bg-card text-card-foreground rounded-xl shadow-lg border-2 font-medium text-center">Card</div>
            <div className="p-8 bg-destructive text-destructive-foreground rounded-xl shadow-lg font-medium text-center">Destructive</div>
          </div>
        </section>
      </main>
    </div>
  )
}
