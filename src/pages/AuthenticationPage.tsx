import {FC, useState} from "react";
import {Form, Input, Button, Card, Layout, Col, Alert} from "antd";
import {Typography} from "antd";
import {LockOutlined, UserOutlined} from "@ant-design/icons";
import {ILoginData} from "../models/ILoginData.ts";
import {authenticationApi} from "../services/AuthenticationService.ts";

const {Title} = Typography;
const {Content} = Layout;

const AuthenticationPage: FC = () => {

  const [login] = authenticationApi.useLoginUserMutation();

  const [alertText, setAlertText] = useState("");

  const onFinish = (loginData: ILoginData) => {
    login(loginData)
      .unwrap()
      .catch((error) => {
        if (error.response) {
          setAlertText(error.response.data);
        }
      });
  };

  return (
    <Layout style={{minHeight: "100vh"}}>
      <Content>
        <Col
          xxl={{span: 6, offset: 9}}
          xl={{span: 8, offset: 8}}
          lg={{span: 12, offset:6}}
          md={{span: 14, offset:5}}
          sm={{span: 20, offset:2}}
          style={{minHeight: "100vh", display: "flex", alignItems:"center"}}
        >
          <Card style={{flex:"1", margin: "0 20px 0 20px"}}>
            <div style={{display: "flex", justifyContent: "center", alignContent: "center"}}>
              <Title level={2} style={{marginTop: "0px"}}>Ip Deputy</Title>
            </div>
            <Form onFinish={onFinish} style={{marginTop: "25px"}}>
              <Form.Item name="login" rules={[{required: true, message: "Please input your username!"}]}>
                <Input prefix={<UserOutlined/>} placeholder="Login"/>
              </Form.Item>

              <Form.Item name="password" rules={[{required: true, message: "Please input your password!"}]}>
                <Input.Password placeholder="Password" prefix={<LockOutlined/>}/>
              </Form.Item>

              {alertText != "" && (
                <Alert message={alertText} type="error" closable afterClose={() => setAlertText("")}/>
              )}

              <Form.Item>
                <Button type="primary" htmlType="submit" block style={{marginTop: "25px"}}>
                  Login
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Content>
    </Layout>
  );
};

export default AuthenticationPage;