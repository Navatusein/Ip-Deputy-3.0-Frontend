import {FC, useCallback, useState} from 'react';
import {Outlet} from 'react-router-dom';
import {Button, Layout, Menu, MenuProps, theme} from "antd";
import {Link} from "react-router-dom";
import {
  AppstoreOutlined,
  BookOutlined,
  CheckSquareOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PoweroffOutlined, SolutionOutlined,
  UserOutlined
} from "@ant-design/icons";
import {userSlice} from "../store/slices/UserSlice.ts";
import {useAppDispatch} from "../hooks/useAppDispatch.ts";
import { useMediaQuery } from 'react-responsive'

const { Header, Content, Footer, Sider } = Layout;

const DashboardLayout: FC = () => {
  const dispatcher = useAppDispatch();
  const {logout, } = userSlice.actions;

  const [menuCollapsed, setMenuCollapsed] = useState(false);

  const isBigScreen = useMediaQuery({query: '(min-width: 620px)'})

  const themeToken = theme.useToken().token;

  const items: MenuProps['items'] = [
    {
      label: 'Students',
      key: 'students',
      icon: <UserOutlined/>,
      children: [
        {
          label: <Link to='/students/information'>Information</Link>,
          key: 'students:1'
        },
        {
          label: <Link to='/students/subgroups'>Subgroups</Link>,
          key: 'students:2'
        },
        {
          label: <Link to='/students/telegram-information'>Telegram Info</Link>,
          key: 'students:3'
        },
      ]
    },
    {
      label: 'Teachers',
      key: 'teachers',
      icon: <SolutionOutlined/>,
      children: [
        {
          label: <Link to='/teachers/information'>Information</Link>,
          key: 'teachers:1'
        },
      ]
    },
    {
      label: 'Subjects',
      key: 'subjects',
      icon: <BookOutlined/>,
      children: [
        {
          label: <Link to='/subjects/information'>Information</Link>,
          key: 'subjects:1'
        },
        {
          label: <Link to='/subjects/schedule'>Schedule</Link>,
          key: 'subjects:2'
        },
      ]
    },
    {
      label: 'Submissions',
      key: 'submissions',
      icon: <CheckSquareOutlined/>,
      children: [
        {
          label: <Link to='/submissions/config'>Config</Link>,
          key: 'submissions:1'
        },
        {
          label: <Link to='/submissions/information'>Information</Link>,
          key: 'submissions:2'
        },
      ]
    },
    {
      label: 'Tools',
      key: 'tools',
      icon: <AppstoreOutlined/>,
      children: [
        {
          label: <Link to='/tools/generate-table'>Generate Table</Link>,
          key: 'tools:1'
        },
      ]
    },
  ];

  const calculateMenuMargin = useCallback(() => {
    if (menuCollapsed)
      return isBigScreen ? "64px" : "0px";

    return "200px";
  }, [menuCollapsed, isBigScreen]);

  const logoutHandler = () => {
    dispatcher(logout());
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsedWidth={isBigScreen ? "64px" : "0px"}
        collapsible
        collapsed={menuCollapsed}
        breakpoint="lg"
        style={{overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0}}
      >
        <div style={{height: "32px", margin: "16px", borderRadius: "6px", background: "rgba(255,255,255,.2)"}}/>
        <Menu theme="dark" mode="inline" items={items}/>
      </Sider>
      <Layout style={{marginLeft: calculateMenuMargin(), transition: "all 0.2s"}}>
        <Header style={{padding: 0, background: themeToken.colorBgContainer, display: "flex", justifyContent: "space-between"}}>
          <Button
            type="text"
            icon={menuCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setMenuCollapsed(!menuCollapsed)}
            style={{fontSize: '16px', width: 64, height: 64}}
          />
          <Button
            type="text"
            icon={<PoweroffOutlined/>}
            onClick={logoutHandler}
            style={{fontSize: '16px', height: 64}}
          >
            Logout
          </Button>
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <Outlet/>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ip Deputy ©2023 Created by Navatusein</Footer>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;