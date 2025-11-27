import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface LoaderDialogProps {
  open: boolean;
}

export function LoaderDialog({ open }: LoaderDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md bg-transparent border-none shadow-none flex items-center justify-center" showCloseButton={false}>
        <VisuallyHidden>
          <DialogTitle>Loading</DialogTitle>
        </VisuallyHidden>
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-16 h-16">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-6 bg-white rounded-sm opacity-75 animate-loader-fade"
                style={{
                  left: "50%",
                  top: "50%",
                  transform: `rotate(${i * 30}deg) translateY(-150%)`,
                  transformOrigin: "center",
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
