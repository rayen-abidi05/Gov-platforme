
import { ApiInspection } from "@/types/inspection";


interface Props {
  inspection: ApiInspection;
  onClose: () => void;
}

export default function InspectionAssignModal({ inspection, onClose }: Props) {
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      
    </div>
  );
}
