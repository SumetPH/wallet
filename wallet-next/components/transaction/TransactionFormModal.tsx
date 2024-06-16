"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
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
  Selection,
  SelectSection,
} from "@nextui-org/react";
import { I18nProvider } from "@react-aria/i18n";
import { parseAbsoluteToLocal } from "@internationalized/date";
import useAccountTypeList from "@/services/useAccountTypeList";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosWithToken } from "@/services/axiosWithToken";
import { mutate } from "swr";
import useAccountList, {
  Account,
  AccountType,
} from "@/services/useAccountList";
import { Transaction } from "@/services/useTransactionList";
import useCategoryList, { CategoryType } from "@/services/useCategoryList";

const schema = z.object({
  transactionAmount: z
    .string()
    .min(1, { message: "กรุณากรอกจํานวนเงิน" })
    .regex(/^\d+(\.\d{2})?$/, {
      message: "ใส่จํานวนเงิน",
    }),
  accountId: z.set(z.string()).min(1, { message: "กรุณาเลือกบัญชี" }),
  categoryId: z.set(z.string()).min(1, { message: "กรุณาเลือกประเภทบัญชี" }),
  transactionNote: z.string().optional(),
  createdAt: z.string().datetime(),
});

type FormData = z.infer<typeof schema>;

type Props = {
  transaction?: Transaction;
  mode: "create" | "edit";
  categoryType: CategoryType;
  onCreateOrUpdate: () => void;
};

export type TransactionFormModalRef = {
  openModal: () => void;
};

export const TransactionFormModal = forwardRef<TransactionFormModalRef, Props>(
  ({ transaction, mode = "create", categoryType, onCreateOrUpdate }, ref) => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const openModal = () => {
      form.reset({
        accountId: transaction?.account_id
          ? new Set([transaction?.account_id])
          : new Set([]),
        categoryId: transaction?.category_id
          ? new Set([transaction?.category_id])
          : new Set([]),
        transactionAmount: transaction?.transaction_amount || "",
        transactionNote: transaction?.transaction_note || "",
        createdAt: transaction?.transaction_created_at
          ? new Date(transaction?.transaction_created_at).toISOString()
          : new Date().toISOString(),
      });
      onOpen();
    };

    useImperativeHandle(ref, () => ({
      openModal,
    }));

    const form = useForm<FormData>({
      resolver: zodResolver(schema),
    });

    const accountList = useAccountList({
      enable: isOpen,
    });

    const categoryList = useCategoryList({
      enable: isOpen,
      categoryType: categoryType,
    });

    const submit = (data: FormData) => {
      if (mode === "create") {
        createTransaction(data);
      } else {
        updateAccount(data);
      }
    };

    const createTransaction = async (data: FormData) => {
      try {
        const res = await axiosWithToken({
          url: "/transaction-create",
          method: "POST",
          data: {
            account_id: [...data.accountId][0],
            category_id: [...data.categoryId][0],
            transaction_amount: data.transactionAmount,
            transaction_note: data.transactionNote,
            transaction_created_at: dayjs(data.createdAt).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
          },
        });
        if (res.status === 200) {
          onOpenChange();
        }
      } catch (error) {
        console.error(error);
      } finally {
        onCreateOrUpdate();
      }
    };

    const updateAccount = async (data: FormData) => {
      try {
        const res = await axiosWithToken({
          url: "/transaction-update",
          method: "PUT",
          data: {
            transaction_id: transaction?.transaction_id,
            account_id: [...data.accountId][0],
            category_id: [...data.categoryId][0],
            transaction_amount: data.transactionAmount,
            transaction_note: data.transactionNote,
            transaction_created_at: dayjs(data.createdAt).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
          },
        });
        if (res.status === 200) {
          onOpenChange();
        }
      } catch (error) {
        console.error(error);
      } finally {
        onCreateOrUpdate();
      }
    };

    const [acc, setAcc] = useState<Selection>(
      new Set(["2745d065-5dcd-4bb9-8c69-2ae1e8bd00d5"])
    );

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
                  {categoryType === CategoryType.expense && (
                    <span className="text-red-600">รายจ่าย</span>
                  )}
                  {categoryType === CategoryType.income && (
                    <span className="text-green-600">รายรับ</span>
                  )}
                </ModalHeader>
                <ModalBody>
                  <Input
                    {...form.register("transactionAmount")}
                    type="text"
                    label="จํานวนเงิน"
                    isInvalid={
                      form.formState.errors.transactionAmount?.message
                        ? true
                        : false
                    }
                    errorMessage={
                      form.formState.errors.transactionAmount?.message
                    }
                  />

                  <Controller
                    control={form.control}
                    name="accountId"
                    render={({ field, fieldState }) => {
                      return (
                        <Select
                          label="บัญชี"
                          placeholder="เลือก"
                          selectionMode="single"
                          items={accountList.data || []}
                          selectedKeys={field.value}
                          onSelectionChange={field.onChange}
                          isLoading={accountList.isLoading}
                          isInvalid={fieldState.error?.message ? true : false}
                          errorMessage={fieldState.error?.message}
                        >
                          {(item) => (
                            <SelectSection
                              key={item.account_type_id}
                              title={item.account_type_name}
                            >
                              {item.accounts.map((account) => (
                                <SelectItem key={account.account_id}>
                                  {account.account_name}
                                </SelectItem>
                              ))}
                            </SelectSection>
                          )}
                        </Select>
                      );
                    }}
                  />

                  <Controller
                    control={form.control}
                    name="categoryId"
                    render={({ field, fieldState }) => (
                      <Select
                        label="หมวดหมู่"
                        placeholder="เลือก"
                        items={categoryList.data || []}
                        isLoading={categoryList.isLoading}
                        selectionMode="single"
                        selectedKeys={field.value}
                        onSelectionChange={field.onChange}
                        isInvalid={fieldState.error?.message ? true : false}
                        errorMessage={fieldState.error?.message}
                      >
                        {(item) => (
                          <SelectItem key={item.category_id}>
                            {item.category_name}
                          </SelectItem>
                        )}
                      </Select>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="createdAt"
                    render={({ field }) => (
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

TransactionFormModal.displayName = "TransactionFormModal";
