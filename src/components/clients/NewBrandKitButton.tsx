import { useState } from "react";
import NewBrandKitFormModal from "./NewBrandKitFormModal";

export default function NewBrandKitButton() {
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
        <span className="text-xl font-bold">+</span> Nuevo BrandKit
      </button>
      <NewBrandKitFormModal
        isOpenModal={isOpenModal}
        onClose={() => setIsOpenModal(false)}
      />
    </>
  );
}
