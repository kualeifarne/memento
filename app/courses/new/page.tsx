import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createCourse } from "@/lib/actions/courses";

export default function NewCoursePage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-12">
      <div className="flex flex-col gap-2">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to courses
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">New course</h1>
      </div>

      <form action={createCourse} className="flex max-w-lg flex-col gap-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" required autoFocus />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" rows={4} />
        </div>

        <div className="flex gap-3">
          <Button type="submit">Create course</Button>
          <Button variant="outline" render={<Link href="/" />}>
            Cancel
          </Button>
        </div>
      </form>
    </main>
  );
}
