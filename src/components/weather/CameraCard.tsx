import { Camera } from 'lucide-react';

interface CameraCardProps {
  streamUrl: string;
  title?: string;
}

export const CameraCard = ({ streamUrl, title = "Webbkamera" }: CameraCardProps) => {
  return (
    <div className="glass-card p-4">
      <div className="flex items-start justify-between mb-4">
        <h3 className="section-title">
          <Camera className="w-[24px] h-[24px] text-primary" />
          {title}
        </h3>
      </div>
      
      <div className="relative aspect-video rounded-lg overflow-hidden bg-black/20">
        <img 
          src={streamUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};
