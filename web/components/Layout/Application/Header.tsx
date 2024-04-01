import ErrorHelper from "@/helpers/ErrorHelper";
import useSession from "@/hooks/useSession";
import {
  UserOutlined,
  LogoutOutlined,
  MoonOutlined,
  SunOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useIsFetching } from "@tanstack/react-query";
import { Button, Dropdown, Layout, Spin, Switch } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";
import { toast } from "react-hot-toast";
import useDarkModeStore from "@/hooks/useDarkModeStore";
import useUser from "@/hooks/useUser";

export const NOTIFY_ASSIGNED_ROUTES_ONLY_KEY = "notifyAssignedRoutesOnly";

interface HeaderProps {}

const Header: FC<HeaderProps> = (props) => {
  const { user } = useUser();
  const router = useRouter();
  const reactQueryActivity = useIsFetching();
  const { logoutMutation } = useSession();
  const { toggleDarkMode, darkMode } = useDarkModeStore();

  const onLogout = async () => {
    router.push("/login");
    await toast.promise(logoutMutation.mutateAsync(), {
      error: ErrorHelper.parseApiError,
      loading: "Logging out",
      success: "Logged out",
    });
  };

  const onProfile = async () => {
    router.push("/profile");
  };

  const menu = {
    items: [
      {
        key: "1",
        icon: <SettingOutlined />,
        onClick: onProfile,
        label: "Profile",
      },
      {
        key: "2",
        icon: <LogoutOutlined />,
        onClick: onLogout,
        label: "Logout",
      },
    ],
  };

  return (
    <Layout.Header className="!sticky !top-0 !w-full !flex !items-center !justify-between !px-4 z-10">
      <div className="flex items-center">
        <Link href="/" className="text-white sm:text-xl text-sm uppercase">
          stock management
        </Link>

        <div className="grow flex items-center px-2">
          <div className="w-10">{reactQueryActivity ? <Spin /> : null}</div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {user ? (
          <Dropdown trigger={["click"]} menu={menu}>
            <Button icon={<UserOutlined />}>{user.name}</Button>
          </Dropdown>
        ) : null}

        <Switch
          checkedChildren={<MoonOutlined />}
          unCheckedChildren={<SunOutlined />}
          checked={darkMode}
          onChange={toggleDarkMode}
        />
      </div>
    </Layout.Header>
  );
};

export default Header;
