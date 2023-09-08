import {FC, useState} from "react";
import {Button, Card, Form, Input, Select, Space, Tag} from "antd";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {ColumnsType} from "antd/es/table";
import {submissionsConfigApi} from "../../../services/SubmissionsConfigsService.ts";
import {ISubmissionsConfig} from "../../../models/ISubmissionsConfig.ts";
import {subgroupApi} from "../../../services/SubgroupService.ts";
import DataTable from "../../../components/dashboard/DataTable.tsx";
import {subjectTypeApi} from "../../../services/SubjectTypeService.ts";
import {subjectApi} from "../../../services/SubjectService.ts";

const {Option} = Select;

const StudentsInformationPage: FC = () => {
  const [form] = Form.useForm();

  const [selectedRow, setSelectedRow] = useState<ISubmissionsConfig>();

  const submissionsConfigsQuery = submissionsConfigApi.useFetchAllQuery();
  const subgroupQuery = subgroupApi.useFetchAllQuery();
  const subjectQuery = subjectApi.useFetchAllQuery();
  const subjectTypeQuery = subjectTypeApi.useFetchAllQuery();


  const [update] =  submissionsConfigApi.useUpdateMutation();
  const [add] =  submissionsConfigApi.useAddMutation();
  const [remove] = submissionsConfigApi.useRemoveMutation();

  const columns: ColumnsType<ISubmissionsConfig> = [
    {
      title: "Subject",
      dataIndex: "subjectId",
      key: "subjectId",
      render: (_, row) => {
        const subject = subjectQuery.data?.find(x => x.id === row.subjectId);
        return subject?.name;
      }
    },
    {
      title: "Subject Type",
      dataIndex: "subjectTypeId",
      key: "subjectTypeId",
      render: (_, row) => {
        const subjectType = subjectTypeQuery.data?.find(x => x.id === row.subjectTypeId);
        return subjectType?.name;
      }
    },
    {
      title: "Custom Name",
      dataIndex: "customName",
      key: "customName",
    },
    {
      title: "Custom Type",
      dataIndex: "customType",
      key: "customType",
    },
    {
      title: "For who",
      dataIndex: "subgroupId",
      key: "subgroupId",
      render: (_, row) => {
        const subgroup = subgroupQuery.data?.find(x => x.id === row.subgroupId);

        return (
          <Tag color="blue">
            {subgroup === undefined ? "Whole group" : subgroup.name}
          </Tag>
        );
      }
    },
    {
      title: "Submission Works",
      dataIndex: "submissionWorks",
      key: "submissionWorks",
      render: (_, row) => {
        return row.submissionWorks.map((value) => (
          <Tag color="blue" key={value.id}>{value.name}</Tag>
        ));
      }
    }
  ];

  const updateHandler = () => {
    submissionsConfigsQuery.refetch();
  };

  const onFormSubmit = (result: ISubmissionsConfig) => {
    return {...result, submissionWorks: result.submissionWorks.map(x => {return { id: x.id, name: x.name}})};
  };

  return (
    <Card bordered={false}>
      <DataTable
        form={form}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        updateHandler={updateHandler}
        onFormSubmit={onFormSubmit}
        addMutation={add}
        updateMutation={update}
        removeMutation={remove}
        data={submissionsConfigsQuery.data}
        dataIsLoading={submissionsConfigsQuery.isLoading || subgroupQuery.isLoading || subjectQuery.isLoading || subjectTypeQuery.isLoading}
        columns={columns}
        isModalRequired={true}
        alertMessage={"Submission config selected"}
        deleteMessage={`Are you sure to delete ?`}
      >
        <Form.Item name="subjectId" label="Subject">
          <Select placeholder="Select subject">
            {subjectQuery?.data?.map((value) => (
              <Option value={value.id} key={value.id}>{value.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="subjectTypeId" label="SubjectType">
          <Select placeholder="Select subject type">
            {subjectTypeQuery?.data?.map((value) => (
              <Option value={value.id} key={value.id}>{value.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="customName" label="Custom Name">
          <Input/>
        </Form.Item>
        <Form.Item name="customType" label="Custom Type">
          <Input/>
        </Form.Item>
        <Form.Item name="subgroupId" label="Fow Who">
          <Select placeholder="Select for who">
            <Option value={null}>Whole group</Option>
            {subgroupQuery?.data?.map((value) => (
              <Option value={value.id} key={value.id}>{value.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.List name="submissionWorks">
          {(fields, {add, remove}) => (
            <>
              <Form.Item>
                <Button onClick={add} block icon={<PlusOutlined/>}>
                  Add work
                </Button>
              </Form.Item>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} align="baseline">
                  <Form.Item {...restField} name={[name, "name"]} label={`Work ${key + 1}`}>
                    <Input/>
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)}/>
                </Space>
              ))}
            </>
          )}
        </Form.List>
      </DataTable>
    </Card>
  );
};

export default StudentsInformationPage;