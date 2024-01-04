import Lottie from 'lottie-react';
import emptyAnimation from './empty.json';

export default function Empty({ text }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-4 h-full w-full">
      <Lottie className="w-1/2 max-w-[250px]" animationData={emptyAnimation} loop={true} />
      <small className="text-muted-foreground">{text ?? 'No data.'}</small>
    </div>
  );
}
