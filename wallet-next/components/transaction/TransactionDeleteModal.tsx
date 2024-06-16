import { axiosWithToken } from "@/services/axiosWithToken";
import { Transaction } from "@/services/useTransactionList";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React, { forwardRef, useImperativeHandle } from "react";
import { mutate } from "swr";

export type TransactionDeleteModalRef = {
  openModal: () => void;
};

type Props = {
  transaction: Transaction;
  onDelete: () => void;
};

export const TransactionDeleteModal = forwardRef<
  TransactionDeleteModalRef,
  Props
>((props, ref) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const openModal = () => {
    onOpen();
  };

  useImperativeHandle(ref, () => ({
    openModal,
  }));

  const deleteAccount = async () => {
    try {
      await axiosWithToken({
        url: "/transaction-delete",
        method: "DELETE",
        data: {
          transaction_id: props.transaction.transaction_id,
        },
      });
    } catch (error) {
      console.error(error);
    } finally {
      props.onDelete();
      onClose();
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton>
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalBody>
            <section className="text-center text-lg font-medium mt-3">
              ลบรายการ : {props.transaction.transaction_amount}
            </section>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" variant="light" onClick={onClose}>
              ยกเลิก
            </Button>
            <Button color="danger" onClick={deleteAccount}>
              ยืนยัน
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
});

TransactionDeleteModal.displayName = "TransactionDeleteModal";
