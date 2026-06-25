import { useState } from "react";
import { AnimatePresence } from "motion/react";
import NewBrandKitFormModal from "./NewBrandKitFormModal";
import type { BrandKit } from "../../types/types";

type NewBrandKitButtonProps = {
  clientId: string;
  clientName: string;
  brandKit?: BrandKit;
  isEdit: boolean;
  text: string;
  onSuccess?: (data: BrandKit) => void;
};

export default function NewBrandKitButton({
  clientId,
  clientName,
  brandKit,
  isEdit,
  text,
  onSuccess,
}: NewBrandKitButtonProps) {
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
        <span className="text-xl font-bold">+</span> {text}
      </button>
      <AnimatePresence>
        {isOpenModal && (
          <NewBrandKitFormModal
            isOpenModal={isOpenModal}
            onClose={() => setIsOpenModal(false)}
            clientId={clientId}
            clientName={clientName}
            brandKit={brandKit}
            isEdit={isEdit}
            onSuccess={onSuccess}
          />
        )}
      </AnimatePresence>
    </>
  );
}
