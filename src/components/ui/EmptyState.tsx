import { Inbox } from 'lucide-react';
export function EmptyState({ title = 'Nothing here yet', description = 'Records will appear here when they are created.' }: { title?: string; description?: string }) {
  return <div className="rounded-3xl border border-dashed border-soft p-10 text-center"><Inbox className="mx-auto mb-4 h-8 w-8 text-muted"/><h3 className="font-bold">{title}</h3><p className="mt-2 text-sm text-muted">{description}</p></div>;
}
