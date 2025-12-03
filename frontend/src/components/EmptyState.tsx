import { Search, BookOpen } from 'lucide-react';

interface EmptyStateProps {
  icon?: 'search' | 'book';
  title: string;
  message: string;
}

export default function EmptyState({ icon = 'book', title, message }: EmptyStateProps) {
  const IconComponent = icon === 'search' ? Search : BookOpen;

  return (
    <div className="text-center py-12">
      <IconComponent className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
    </div>
  );
}
