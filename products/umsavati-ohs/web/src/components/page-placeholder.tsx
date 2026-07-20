import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function PagePlaceholder({
  title,
  description,
  sprint,
}: {
  title: string;
  description: string;
  sprint: string;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-navy">{title}</h1>
        <p className="mt-1 text-steel">{description}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Module scaffolded</CardTitle>
          <CardDescription>
            The route, navigation, and data contract exist; the working screens land with{' '}
            {sprint}. Build order is governed by the PRS gate in{' '}
            <code className="font-mono text-xs">memory/roadmap.md</code>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="steel">SHELL — awaiting module build</Badge>
        </CardContent>
      </Card>
    </div>
  );
}
