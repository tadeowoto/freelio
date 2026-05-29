import { useState } from "react";
import NewClientFormModal from "./NewClientFormModal";

export default function NewClientButton() {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const handleClick = () => {
    setIsOpenModal(!isOpenModal);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="h-10 px-6 flex items-center gap-2 bg-sunset-orange border-none rounded-sm font-sans font-medium text-(--text-body) cursor-pointer hover:opacity-90 transition-opacity"
      >
        <span className="text-xl font-bold">+</span> Nuevo cliente
      </button>
      <NewClientFormModal
        onClose={() => setIsOpenModal(false)}
        isOpenModal={isOpenModal}
      />
    </>
  );
}
