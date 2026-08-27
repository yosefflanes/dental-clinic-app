import { useState } from "react";

export function useAlert() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    type: "info",
    title: "",
    message: "",
    confirmVariant: "primary",
    onConfirm: null,
  });

  const showAlert = (options) => {
    setModalConfig((prevConfig) => ({...prevConfig, ...options}));
    setIsModalOpen(true);
  };

  const closeAlert = () => {
    setIsModalOpen(false);
  };

  return {
    isModalOpen,
    modalConfig,
    showAlert,
    closeAlert,
  };
}
