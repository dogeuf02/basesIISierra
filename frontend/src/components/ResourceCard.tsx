import { Link } from 'react-router-dom';
import { Calendar, BookOpen, Globe } from 'lucide-react';
import type { Resource } from '../types';

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const getResourceTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      book: 'bg-blue-100 text-blue-800',
      article: 'bg-green-100 text-green-800',
      thesis: 'bg-purple-100 text-purple-800',
      journal: 'bg-orange-100 text-orange-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Link
      to={`/resources/${resource.resource_id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getResourceTypeColor(
              resource.resource_type
            )}`}
          >
            <BookOpen className="h-3 w-3 mr-1" />
            {resource.resource_type}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
          {resource.title}
        </h3>

        {resource.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{resource.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          {resource.publication_year && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{resource.publication_year}</span>
            </div>
          )}
          {resource.language && (
            <div className="flex items-center">
              <Globe className="h-4 w-4 mr-1" />
              <span>{resource.language}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
