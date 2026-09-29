import LoadingSpinner from '@/components/LoadingSpinner';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <LoadingSpinner />
    </div>
  );
}