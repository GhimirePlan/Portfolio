import OscilloscopeLoader from './components/OscilloscopeLoader';

export default function Loading() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <OscilloscopeLoader />
      </div>
    </div>
  );
} 