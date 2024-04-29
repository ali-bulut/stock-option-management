import ErrorHelper from "@/helpers/ErrorHelper";
import useSession from "@/hooks/useSession";
import {
  UserOutlined,
  LogoutOutlined,
  MoonOutlined,
  SunOutlined,
  SettingOutlined,
  BarChartOutlined,
  TransactionOutlined,
} from "@ant-design/icons";
import { useIsFetching } from "@tanstack/react-query";
import {
  Button,
  Dropdown,
  Image,
  Layout,
  Menu,
  MenuProps,
  Switch,
  Typography,
} from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";
import { toast } from "react-hot-toast";
import useDarkModeStore from "@/hooks/useDarkModeStore";
import useUser from "@/hooks/useUser";
import classNames from "classnames";

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

  const menu: MenuProps = {
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
      {
        key: "3",
        className: classNames("md:!hidden", user ? "hidden" : ""),
        icon: (
          <Switch
            className="w-full"
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
            checked={darkMode}
          />
        ),
        onClick: (e) => {
          e.domEvent.preventDefault();
          e.domEvent.stopPropagation();
          toggleDarkMode();
        },
      },
    ],
  };

  const navItems = [
    {
      key: "/",
      className:
        typeof window !== "undefined" && window.innerWidth < 768 ? "w-12" : "",
      label:
        typeof window !== "undefined" && window.innerWidth > 768
          ? "Simulation"
          : "",
      icon: <BarChartOutlined />,
      onClick: () => router.push("/"),
    },
    {
      key: "/trade-plans",
      className:
        typeof window !== "undefined" && window.innerWidth < 768 ? "w-12" : "",
      label:
        typeof window !== "undefined" && window.innerWidth > 768
          ? "Trade Plans"
          : "",
      icon: <TransactionOutlined />,
      onClick: () => router.push("/trade-plans"),
    },
  ];

  return (
    <Layout.Header className="!sticky !top-0 !w-full !flex !items-center !justify-between !px-4 z-10">
      <div className="flex items-center">
        <Link href="/" className="text-white sm:text-xl text-sm uppercase">
          <Image
            src="/icon.png"
            alt="logo"
            className="pb-2 pt-1"
            width={100}
            preview={false}
          />
        </Link>

        {user && (
          <Menu
            theme="dark"
            mode="horizontal"
            items={navItems}
            className="flex-1 min-w-0 ml-4"
            selectedKeys={[router.pathname]}
          />
        )}
      </div>

      <div className="flex items-center space-x-3">
        {user ? (
          <Dropdown
            trigger={["click"]}
            menu={menu}
            className="sm:max-w-fit max-w-28 px-2"
          >
            <Button icon={<UserOutlined />}>
              <Typography.Text ellipsis>{user.name}</Typography.Text>
            </Button>
          </Dropdown>
        ) : null}

        <Switch
          className={classNames("md:inline hidden", !user ? "!inline" : "")}
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
