'use client';

import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

const ModalBox = ({ children }: { children: ReactNode }) => {
  const modalRoot = document.getElementById('modal-root');

  if (!modalRoot) {
    const rootElement = document.createElement('div');
    rootElement.id = 'modal-root';
    document.body.appendChild(rootElement);
    return createPortal(<div className="modal">{children}</div>, rootElement);
  }

  return createPortal(<div className="modal">{children}</div>, modalRoot);
};

export default ModalBox;
