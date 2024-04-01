import { useState } from "react";

export const useModalControls = () => {
  const [open, setOpen] = useState(false);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);
  return { open, setOpen, closeModal, openModal };
};
