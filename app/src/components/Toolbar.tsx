import { EraserIcon, PencilIcon, SquareIcon } from "lucide-react";

const Toolbar = () => {
  return (
    <div className="fixed px-4 py-2 top-4 w-max h-max inset-0 mx-auto rounded-full shadow-md border flex gap-2">
      <button className="p-2 hover:bg-primary/20 text-black rounded-full">
        <PencilIcon className="size-5" />
      </button>
      <button className="p-2 hover:bg-primary/20 text-black rounded-full">
        <EraserIcon className="size-5" />
      </button>
      <button className="p-2 hover:bg-primary/20 text-black rounded-full">
        <SquareIcon className="size-5" />
      </button>
    </div>
  );
};

export default Toolbar;
