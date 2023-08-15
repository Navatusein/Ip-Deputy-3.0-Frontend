import {FC, useState} from "react";
import {Card, Form, Input, InputNumber} from "antd";
import {ColumnsType} from "antd/es/table";
import {subgroupApi} from "../../../services/SubgroupService.ts";
import {ISubgroup} from "../../../models/ISubgroup.ts";
import DataTable from "../../../components/dashboard/DataTable.tsx";

const StudentsInformationPage: FC = () => {
  const [form] = Form.useForm();

  const [selectedRow, setSelectedRow] = useState<ISubgroup>();

  const subgroupQuery = subgroupApi.useFetchAllQuery();

  const [update] =  subgroupApi.useUpdateMutation();
  const [add] =  subgroupApi.useAddMutation();
  const [remove] = subgroupApi.useRemoveMutation();

  const columns: ColumnsType<ISubgroup> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Index",
      dataIndex: "index",
      key: "index",
    }
  ];

  const updateHandler = () => {
    subgroupQuery.refetch();
  };

  return (
    <Card bordered={false}>
      <DataTable
        form={form}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        updateHandler={updateHandler}
        addMutation={add}
        updateMutation={update}
        removeMutation={remove}
        data={subgroupQuery.data}
        dataIsLoading={subgroupQuery.isLoading}
        columns={columns}
        isModalRequired={true}
        alertMessage={"Subgroup selected"}
        deleteMessage={`Are you sure to delete ${selectedRow?.name} ?`}
      >
        <Form.Item name="name" label="Name" rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.Item name="index" label="Index" rules={[{required: true}]}>
          <InputNumber/>
        </Form.Item>
      </DataTable>
    </Card>
  );
};

export default StudentsInformationPage;