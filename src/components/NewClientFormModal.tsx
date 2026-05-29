type NewClientFormModalProps = {
  isOpenModal: boolean;
};

export default function NewClientFormModal({
  isOpenModal,
}: NewClientFormModalProps) {
  return (
    <form
      action=""
      className={`${isOpenModal ? "flex" : "hidden"} text-graphite `}
    >
      <input type="text" placeholder="Nombre" />
      <input type="text" placeholder="Empresa" />
      <input type="text" placeholder="Email" />
      <input type="text" placeholder="Telefono" />
      <button>Guardar</button>
    </form>
  );
}
