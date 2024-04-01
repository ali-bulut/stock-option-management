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

type LoginFormParams = {
  email: string;
  password: string;
};

const Page: NextPageWithLayout = () => {
  const router = useRouter();
  const { loginMutation, logoutMutation } = useSession();
  const { user, userQuery } = useUser();

  const onLogin = async (formParams: LoginFormParams) => {
    try {
      await toast.promise(loginMutation.mutateAsync({ body: formParams }), {
        error: ErrorHelper.parseApiError,
        loading: "Logging you in",
        success: "Welcome Back",
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
            title="Login"
            className="w-full max-w-xl shadow-sm relative -top-1/2"
            extra={<Link href="/register">Sign Up</Link>}
          >
            <Form
              onChange={loginMutation.reset}
              name="login-form"
              disabled={userQuery.isFetching}
              labelCol={{ span: 4 }}
              initialValues={{ email: "", password: "" }}
              onFinish={onLogin}
            >
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
                rules={[{ required: true, message: "" }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item className="flex justify-end">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loginMutation.isLoading}
                >
                  Login
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
