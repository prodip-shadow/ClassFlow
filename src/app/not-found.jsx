import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 text-center px-6">
      <div>
        <p className="text-primary font-heading text-sm tracking-widest uppercase">
          404
        </p>
        <h1 className="font-heading text-4xl mt-2">Page not found</h1>
        <p className="text-muted mt-2">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link href="/" className="btn btn-primary mt-6">
          Back to ClassFlow
        </Link>
      </div>
    </div>
  );
}
