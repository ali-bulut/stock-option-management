import MainLayout from "@/components/Layout/MainLayout";
import useDomLoaded from "@/hooks/useDomLoaded";
import useSession from "@/hooks/useSession";
import { Button, Card, Form, Input, Layout } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import toast from "react-hot-toast";
import { NextPageWithLayout } from "../_app";
import useUser from "@/hooks/useUser";
import ErrorHelper from "@/helpers/ErrorHelper";
import Application from "@/components/Layout/Application";

type RegisterFormParams = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { registerMutation, logoutMutation } = useSession();
  const { user, userQuery } = useUser();

  const onRegister = async (formParams: RegisterFormParams) => {
    try {
      await toast.promise(registerMutation.mutateAsync({ body: formParams }), {
        error: ErrorHelper.parseApiError,
        loading: "Signing you up",
        success: "Welcome",
      });

      router.push("/");
    } catch (error) {}
  };

  const onLogout = () =>
    toast.promise(logoutMutation.mutateAsync(), {
      error: ErrorHelper.parseApiError,
      loading: "Logging out",
      success: "Logged out",
    });

  const { domLoaded } = useDomLoaded();
  if (!domLoaded) return null;

  return (
    <Layout>
      <div className="flex justify-center items-center min-h-[88vh] w-full px-4">
        {userQuery.isSuccess ? (
          <Card className="w-full max-w-2xl shadow-sm relative">
            <div className="flex justify-between items-center">
              <p>Signed in as {user.name}</p>
              <div className="flex space-x-3">
                <Link href="/" passHref>
                  <Button>Continue</Button>
                </Link>
                <Button onClick={onLogout}>Logout</Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card
            title="Register"
            className="w-full max-w-xl shadow-sm relative -top-1/2"
            extra={<Link href="/login">Log In</Link>}
          >
            <Form
              onChange={registerMutation.reset}
              name="register-form"
              disabled={userQuery.isFetching}
              labelCol={{ span: 7 }}
              initialValues={{
                name: "",
                email: "",
                password: "",
                password_confirmation: "",
              }}
              onFinish={onRegister}
            >
              <Form.Item
                label="Full Name"
                name="name"
                rules={[{ required: true, message: "Please enter your name" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please enter a valid email",
                    type: "email",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    min: 8,
                    message: "Password must be minimum 8 characters",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="password_confirmation"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Passwords must match",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error("Passwords must match"));
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item className="flex justify-end">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={registerMutation.isLoading}
                >
                  Register
                </Button>
              </Form.Item>
            </Form>
          </Card>
        )}
      </div>
    </Layout>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      <Application>{page}</Application>
    </MainLayout>
  );
};

export default Page;
