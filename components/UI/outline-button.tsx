"use client";

type ButtonProps = {
  onClickHandler: () => void;
  isLoading?: boolean;
};

export default function OutlineButton({
  onClickHandler,
  isLoading,
}: ButtonProps) {
  return (
    <button
      onClick={onClickHandler || (() => {})}
      disabled={isLoading || !onClickHandler }
      className="px-4 py-2 border rounded-lg text-sm
                 hover:bg-gray-50 disabled:opacity-50 transition-colors"
    >
      {isLoading ? "Keluar..." : "Keluar"}
    </button>
  );
}
