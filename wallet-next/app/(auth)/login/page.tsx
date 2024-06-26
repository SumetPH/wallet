"use client";

import { axiosWithToken } from "@/services/axiosWithToken";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
} from "@nextui-org/react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import jsCookie from "js-cookie";
import { useRouter } from "next/navigation";

const schema = z.object({
  username: z.string().min(1, "กรุณากรอกชื่อผู้ใช้งาน"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});

type FormData = z.infer<typeof schema>;

export default function Login() {
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "Test",
      password: "testtest",
    },
  });

  const submit = async (data: FormData) => {
    try {
      const res = await axiosWithToken<{
        token: string;
        user: any;
      }>({
        url: "/auth/login",
        method: "POST",
        data: {
          username: data.username,
          password: data.password,
        },
      });
      if (res.status === 200) {
        jsCookie.set("token", res.data.token, { expires: 7 });
        jsCookie.set("user", JSON.stringify(res.data.user), { expires: 7 });
        router.replace("/transaction");
      }
    } catch (error) {
      console.error(error);
      alert("ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  return (
    <form onSubmit={form.handleSubmit(submit)}>
      <div className="container mx-auto min-h-dvh flex justify-center items-center">
        <Card className="w-full sm:w-2/3 md:w-1/2 lg:w-1/2 xl:w-1/3 p-6">
          <CardHeader className="justify-center font-medium text-xl">
            Wallet
          </CardHeader>
          <CardBody>
            <div className="mb-8">
              <Input
                {...form.register("username")}
                label="ชื่อผู้ใช้งาน"
                fullWidth
                isInvalid={!!form.formState.errors.username?.message}
                errorMessage={form.formState.errors.username?.message}
              />
            </div>
            <div>
              <Input
                {...form.register("password")}
                label="รหัสผ่าน"
                type="password"
                fullWidth
                isInvalid={!!form.formState.errors.password?.message}
                errorMessage={form.formState.errors.password?.message}
              />
            </div>
          </CardBody>
          <CardFooter className="justify-end">
            <Button type="submit" color="primary">
              เข้าสู่ระบบ
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
}
