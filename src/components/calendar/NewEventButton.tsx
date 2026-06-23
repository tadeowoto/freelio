interface NewEventButtonProps {
  onClick?: () => void;
}

export default function NewEventButton({ onClick }: NewEventButtonProps) {
  return (
    <button
      onClick={onClick}
      className="h-10 px-6 flex text-white items-center gap-2 bg-sunset-orange border-none rounded-sm font-sans font-medium text-(--text-body) cursor-pointer hover:opacity-90 transition-opacity"
    >
      <span className="text-xl font-bold">+</span> Nuevo evento
    </button>
  );
}
