import { ThemeSwitcher } from "@/components/theme-switcher"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="container mx-auto py-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Theme Switcher</h1>
        <ThemeSwitcher />
      </header>

      <main className="container mx-auto py-6 space-y-8">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Theme Preview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow">
              <CardHeader>
                <CardTitle>Card Component</CardTitle>
                <CardDescription>This is a card component with a description.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This card demonstrates the theme's card styling.</p>
                <p className="font-serif mt-2">This text uses the serif font.</p>
                <p className="font-mono mt-2">This text uses the monospace font.</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Submit</Button>
              </CardFooter>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Form Elements</CardTitle>
                <CardDescription>Various form elements with the current theme.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
                <div className="flex gap-2">
                  <Button variant="default">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Shadow Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-card text-card-foreground rounded-md shadow-xs">shadow-xs</div>
            <div className="p-4 bg-card text-card-foreground rounded-md shadow-sm">shadow-sm</div>
            <div className="p-4 bg-card text-card-foreground rounded-md shadow">shadow</div>
            <div className="p-4 bg-card text-card-foreground rounded-md shadow-md">shadow-md</div>
            <div className="p-4 bg-card text-card-foreground rounded-md shadow-lg">shadow-lg</div>
            <div className="p-4 bg-card text-card-foreground rounded-md shadow-xl">shadow-xl</div>
            <div className="p-4 bg-card text-card-foreground rounded-md shadow-2xl">shadow-2xl</div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Font Examples</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-card text-card-foreground rounded-md shadow">
              <h3 className="font-bold mb-2">Sans-serif Font</h3>
              <p className="font-sans">The quick brown fox jumps over the lazy dog.</p>
            </div>
            <div className="p-4 bg-card text-card-foreground rounded-md shadow">
              <h3 className="font-bold mb-2">Serif Font</h3>
              <p className="font-serif">The quick brown fox jumps over the lazy dog.</p>
            </div>
            <div className="p-4 bg-card text-card-foreground rounded-md shadow">
              <h3 className="font-bold mb-2">Monospace Font</h3>
              <p className="font-mono">The quick brown fox jumps over the lazy dog.</p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">More Components</h2>
          <Tabs defaultValue="tab1">
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
              <TabsTrigger value="tab3">Tab 3</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1" className="p-4 border rounded-md mt-2">
              <p>This is the content for Tab 1.</p>
            </TabsContent>
            <TabsContent value="tab2" className="p-4 border rounded-md mt-2">
              <p>This is the content for Tab 2.</p>
            </TabsContent>
            <TabsContent value="tab3" className="p-4 border rounded-md mt-2">
              <p>This is the content for Tab 3.</p>
            </TabsContent>
          </Tabs>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-primary text-primary-foreground rounded-md">Primary</div>
          <div className="p-4 bg-secondary text-secondary-foreground rounded-md">Secondary</div>
          <div className="p-4 bg-accent text-accent-foreground rounded-md">Accent</div>
          <div className="p-4 bg-muted text-muted-foreground rounded-md">Muted</div>
          <div className="p-4 bg-card text-card-foreground rounded-md border">Card</div>
          <div className="p-4 bg-destructive text-destructive-foreground rounded-md">Destructive</div>
        </section>
      </main>
    </div>
  )
}
