import {FC} from "react";
import {Card, Typography} from "antd";

const {Title} = Typography;

const HomePage: FC = () => {
  return (
    <Card bordered={false}>
      <Title level={2}>
        HomePage
      </Title>
    </Card>
  );
};

export default HomePage;