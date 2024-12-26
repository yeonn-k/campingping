'use client';

import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

const ModalBox = ({ children }: { children: ReactNode }) => {
  const modalRoot = document.getElementById('modal-root');

  if (!modalRoot) return null;

  return createPortal(<div className="modal">{children}</div>, modalRoot);
};

export default ModalBox;
