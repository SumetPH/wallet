import { axiosWithToken } from "@/services/axiosWithToken";
import { Account } from "@/services/useAccountList";
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

export type AccountDeleteModalRef = {
  openModal: () => void;
};

type Props = {
  account: Account;
};

export const AccountDeleteModal = forwardRef<AccountDeleteModalRef, Props>(
  (props, ref) => {
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
          url: "/account-delete",
          method: "DELETE",
          data: {
            account_id: props.account.account_id,
          },
        });
      } catch (error) {
        console.error(error);
      } finally {
        onClose();
        mutate("/account-list");
      }
    };

    return (
      <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton>
          <ModalContent>
            <ModalHeader></ModalHeader>
            <ModalBody>
              <section className="text-center text-lg font-medium mt-3">
                ลบบัญชี : {props.account.account_name}
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
  }
);

AccountDeleteModal.displayName = "AccountDeleteModal";
