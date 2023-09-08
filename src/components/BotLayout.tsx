import {FC, useEffect, useState} from 'react';
import {ConfigProvider, Layout, theme} from "antd";
import {useTelegram, WebApp} from "../hooks/useTelegram.ts";
import {Outlet} from "react-router-dom";
import {authenticationApi} from "../services/AuthenticationService.ts";
import {useAppSelector} from "../hooks/useAppSelector.ts";
import {IUser} from "../models/IUser.ts";

export interface IBotLayoutContext
{
  isAuthorized: boolean,
  telegram: WebApp,
  user?: IUser
}

const BotLayout: FC = () => {
  const user = useAppSelector(x => x.userReducer.user);

  const [loginBot] = authenticationApi.useLoginBotUserMutation();

  const {telegram} = useTelegram();

  const {defaultAlgorithm, darkAlgorithm} = theme;

  const themeConfig={
    algorithm: telegram.colorScheme === "dark" ? darkAlgorithm : defaultAlgorithm,
    token: {
      colorPrimary: telegram.themeParams.button_color,
      colorTextBase: telegram.themeParams.text_color,
      colorLink: telegram.themeParams.link_color,
      colorBgLayout: telegram.themeParams.secondary_bg_color,
      colorBgContainer: telegram.themeParams.bg_color,
      colorBgElevated: telegram.themeParams.secondary_bg_color
    },
  };

  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const telegramId = telegram.initDataUnsafe.user?.id;

    if (!telegramId)
      return;

    loginBot(telegramId)
      .unwrap()
      .then(() => {
        setIsAuthorized(true);
      })
      .catch((error) => {
        if (error.response)
          return
      });
  }, []);

  return (
    <Layout style={{ minHeight: "100vh", padding: "12px", backgroundColor: telegram.themeParams.secondary_bg_color}}>
      <ConfigProvider theme={themeConfig}>
        <Outlet context={{isAuthorized, telegram, user}}/>
      </ConfigProvider>
    </Layout>
  );
};

export default BotLayout;