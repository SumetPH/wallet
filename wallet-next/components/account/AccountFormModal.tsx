"use client";

import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import dayjs from "dayjs";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Select,
  SelectItem,
  DatePicker,
} from "@nextui-org/react";
import { I18nProvider } from "@react-aria/i18n";
import { parseAbsoluteToLocal } from "@internationalized/date";
import useAccountTypeList from "@/services/useAccountTypeList";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosWithToken } from "@/services/axiosWithToken";
import { mutate } from "swr";
import { Account } from "@/services/useAccountList";

const schema = z.object({
  accountName: z.string().min(1, { message: "กรุณากรอกชื่อบัญชี" }),
  accountTypeId: z.string().min(1, { message: "กรุณาเลือกชนิดบัญชี" }),
  balance: z
    .string()
    .min(1, { message: "กรุณากรอกจํานวนเงิน" })
    .regex(/^\d+(\.\d{2})?$/, {
      message: "ใส่จํานวนเงิน",
    }),
  startDate: z.string().datetime(),
});

type FormData = z.infer<typeof schema>;

type Props = {
  account?: Account;
  mode?: "create" | "edit";
};

export type AccountFormModalRef = {
  openModal: () => void;
};

export const AccountFormModal = forwardRef<AccountFormModalRef, Props>(
  ({ account, mode = "create" }, ref) => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const openModal = () => {
      onOpen();
    };

    useImperativeHandle(ref, () => ({
      openModal,
    }));

    const form = useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: {
        accountName: account?.account_name || "",
        accountTypeId: account?.account_type_id || "",
        balance: account?.account_balance || "",
        startDate: account?.account_created_at
          ? new Date(account?.account_created_at).toISOString()
          : new Date().toISOString(),
      },
    });

    const accountTypeList = useAccountTypeList({ enable: true });

    const submit = (data: FormData) => {
      if (mode === "create") {
        createAccount(data);
      } else {
        updateAccount(data);
      }
    };

    const createAccount = async (data: FormData) => {
      try {
        const res = await axiosWithToken({
          url: "/account-create",
          method: "POST",
          data: {
            account_name: data.accountName,
            account_type_id: data.accountTypeId,
            account_balance: data.balance,
            account_start_date: dayjs(data.startDate).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
          },
        });
        if (res.status === 200) {
          form.reset();
          onOpenChange();
          mutate("/account-list");
        }
      } catch (error) {
        console.error(error);
      }
    };

    const updateAccount = async (data: FormData) => {
      try {
        const res = await axiosWithToken({
          url: "/account-update",
          method: "PUT",
          data: {
            account_id: account?.account_id,
            account_name: data.accountName,
            account_type_id: data.accountTypeId,
            account_balance: data.balance,
            account_start_date: dayjs(data.startDate).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
          },
        });
        if (res.status === 200) {
          onOpenChange();
          mutate("/account-list");
        }
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <>
        <Modal
          className="overflow-visible"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          isDismissable={false}
          hideCloseButton
        >
          <ModalContent>
            {(onClose) => (
              <form onSubmit={form.handleSubmit(submit)}>
                <ModalHeader className="flex flex-col gap-1">
                  เพิ่มบัญชีใหม่
                </ModalHeader>
                <ModalBody>
                  <Input
                    {...form.register("accountName")}
                    type="text"
                    label="ชื่อบัญชี"
                    isInvalid={
                      form.formState.errors.accountName?.message ? true : false
                    }
                    errorMessage={form.formState.errors.accountName?.message}
                  />

                  <Select
                    {...form.register("accountTypeId")}
                    label="ชนิดบัญชี"
                    placeholder="เลือก"
                    items={accountTypeList.data ?? []}
                    isLoading={accountTypeList.isLoading}
                    isInvalid={
                      form.formState.errors.accountTypeId?.message
                        ? true
                        : false
                    }
                    errorMessage={form.formState.errors.accountTypeId?.message}
                  >
                    {(item) => (
                      <SelectItem key={item.account_type_id}>
                        {item.account_type_name}
                      </SelectItem>
                    )}
                  </Select>

                  <Input
                    {...form.register("balance")}
                    type="text"
                    label="ยอดเริ่มต้น"
                    isInvalid={
                      form.formState.errors.balance?.message ? true : false
                    }
                    errorMessage={form.formState.errors.balance?.message}
                  />

                  <Controller
                    control={form.control}
                    name="startDate"
                    render={({ field, formState }) => (
                      <I18nProvider locale="en-UK">
                        <DatePicker
                          label="วันเริ่มต้น"
                          hideTimeZone
                          hourCycle={24}
                          value={parseAbsoluteToLocal(field.value)}
                          onChange={(value) =>
                            field.onChange(value.toAbsoluteString())
                          }
                          onKeyDown={(e) => e.preventDefault()}
                        />
                      </I18nProvider>
                    )}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    ยกเลิก
                  </Button>
                  <Button type="submit" color="primary">
                    บันทึก
                  </Button>
                </ModalFooter>
              </form>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }
);

AccountFormModal.displayName = "AccountFormModal";
