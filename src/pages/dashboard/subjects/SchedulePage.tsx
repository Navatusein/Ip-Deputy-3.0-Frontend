import {FC, useEffect, useState} from "react";
import {Button, Card, DatePicker, Form, Input, Select, Space, Checkbox} from "antd";
import {ColumnsType} from "antd/es/table";
import {ICouple} from "../../../models/ICouple.ts";
import {subgroupApi} from "../../../services/SubgroupService.ts";
import {coupleApi} from "../../../services/CoupleService.ts";
import {coupleTimeApi} from "../../../services/CoupleTimeService.ts";
import ScheduleCard from "../../../components/dashboard/ScheduleCard.tsx";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {subjectApi} from "../../../services/SubjectService.ts";
import {subjectTypeApi} from "../../../services/SubjectTypeService.ts";
import {teacherApi} from "../../../services/TeacherService.ts";
import dayjs from 'dayjs';
import DataTable from "../../../components/dashboard/DataTable.tsx";

const {Option} = Select;
const {RangePicker} = DatePicker;
const {TextArea} = Input;

interface IScheduleTable {
  id: string;
  index: number;
  time: string;
  schedules : ICouple[];
  rowSpan: number;
  isColSpan: boolean;
}

interface IScheduleDateForm {
  date: dayjs.Dayjs;
}

interface IScheduleForm {
  id: number;
  subjectId: number;
  subjectTypeId: number;
  dayOfWeekId: number;
  coupleTimeId: number;
  isRolling: boolean;
  subgroupId?: number;
  teacherId: number;
  additionalInformation?: string;
  link?: string;
  startEndDateRange?: dayjs.Dayjs[];
  additionalDates?: IScheduleDateForm[];
  removedDates?: IScheduleDateForm[];
}

const SchedulePage: FC = () => {
  const [form] = Form.useForm();

  const [data, setData] = useState<IScheduleTable[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<ICouple>();
  const [selectedWeekDay, setSelectedWeekDay] = useState<number>(1);

  const subgroupQuery = subgroupApi.useFetchAllQuery();
  const coupleQuery = coupleTimeApi.useFetchAllQuery();
  const subjectQuery = subjectApi.useFetchAllQuery();
  const subjectTypeQuery = subjectTypeApi.useFetchAllQuery();
  const teacherQuery = teacherApi.useFetchAllQuery();
  const scheduleQuery = coupleApi.useFetchAllQuery(selectedWeekDay);

  const [update] =  coupleApi.useUpdateMutation();
  const [add] =  coupleApi.useAddMutation();
  const [remove] = coupleApi.useRemoveMutation();

  const fromPrepareSelected = (fieldValue: ICouple) => {
    return {
      ...fieldValue,
      subgroupId: fieldValue.subgroupId == undefined ? -1 : fieldValue.subgroupId,
      startEndDateRange: fieldValue.startDate == undefined ? undefined : [
        dayjs(fieldValue.startDate, "YYYY-MM-DD"),
        dayjs(fieldValue.endDate, "YYYY-MM-DD")
      ],
      additionalDates: fieldValue.additionalDates.map((scheduleDate) => {
        return {date: dayjs(scheduleDate.date, "YYYY-MM-DD")}
      }),
      removedDates: fieldValue.removedDates.map((scheduleDate) => {
        return {date: dayjs(scheduleDate.date, "YYYY-MM-DD")}
      })
    }
  }

  const columns: ColumnsType<IScheduleTable> = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      width: "25px",
      align: "center",
      rowScope: "row",
      onCell: (record) => {
        return {rowSpan: record.rowSpan};
      },
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "index",
      width: "100px",
      align: "center",
      rowScope: "row",
      onCell: (record) => {
        return {rowSpan: record.rowSpan};
      },
      ellipsis: true
    },
    {
      title: "IP-31",
      dataIndex: "couples",
      children: subgroupQuery.data?.map((subgroup) => {
        return {
          dataIndex: "schedules",
          key: subgroup.id,
          align: "center",
          onCell: (record) => {
            let props = {};

            if (subgroupQuery?.data == undefined)
              return props;

            if (record.isColSpan)
              props = {...props, colSpan: subgroup.id == subgroupQuery?.data[0].id ? subgroupQuery.data?.length : 0};

            return props;
          },
          render: (values: ICouple[]) => {
            return values.filter(x => x.subgroupId == subgroup.id || x.subgroupId == null).map((schedule) => (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                selectedSchedule={selectedSchedule}
                setSelectedSchedule={setSelectedSchedule}
              />
            ));
          },
          title: subgroup.name
        }
      })
    }
  ];

  useEffect(() => {
    if (!coupleQuery.data)
      return;

    let localData: IScheduleTable[] = [];

    coupleQuery.data.forEach((coupleTime) => {
      const schedules = scheduleQuery.data?.filter(x => x.coupleTimeId == coupleTime.id);

      if (schedules === undefined || schedules.length === 0) {
        const row = {
          id: coupleTime.index + "-" + 1,
          index: coupleTime.index,
          time: coupleTime.timeStart.slice(0, -3) + "-" + coupleTime.timeEnd.slice(0, -3),
          schedules: [],
          rowSpan: 1,
          isColSpan: false,
        }
        localData = [...localData, row];
        return;

      }

      let rows: IScheduleTable[] = [];

      schedules.forEach((schedule, index) => {
        let row;

        if (schedule.subgroupId === null) {
          row  = {
            id: coupleTime.index + "-" + index,
            index: coupleTime.index,
            time: coupleTime.timeStart.slice(0, -3) + "-" + coupleTime.timeEnd.slice(0, -3),
            schedules: [schedule],
            rowSpan: 0,
            isColSpan: true,
          }

          rows = [...rows, row];
        }
        else {
          row = rows.find(x =>
            x.schedules.length != subgroupQuery?.data?.length &&
            x.schedules.filter(x => x.subgroupId === schedule.subgroupId).length == 0 &&
            !x.isColSpan);

          if (row === undefined) {
            row  = {
              id: coupleTime.index + "-" + index,
              index: coupleTime.index,
              time: coupleTime.timeStart.slice(0, -3) + "-" + coupleTime.timeEnd.slice(0, -3),
              schedules: [],
              rowSpan: 0,
              isColSpan: false,
            }

            rows = [...rows, row];
          }

          row.schedules = [...row.schedules, schedule];
        }
      });

      rows[0].rowSpan = rows.length;
      localData = [...localData, ...rows];
    })

    setData(localData);
  }, [coupleQuery.data, scheduleQuery.data]);

  const updateHandler = () => {
    subgroupQuery.refetch();
    coupleQuery.refetch();
    scheduleQuery.refetch();
    teacherQuery.refetch();
  };

  const onFormSubmit = (result: IScheduleForm) => {
    return {
      ...result,
      subgroupId: result.subgroupId === -1 ? undefined : result.subgroupId,
      dayOfWeekId: selectedWeekDay,
      startDate: result.startEndDateRange === undefined ? undefined : dayjs(result.startEndDateRange[0]).format("YYYY-MM-DD").toString(),
      endDate: result.startEndDateRange === undefined ? undefined : dayjs(result.startEndDateRange[1]).format("YYYY-MM-DD").toString(),
      additionalDates: result.additionalDates ? result.additionalDates.map((value) => {
        return {id: 0, date: dayjs(value.date).format("YYYY-MM-DD").toString()}
      }) : [],
      removedDates: result.removedDates ? result.removedDates.map((value) => {
        return {id: 0, date: dayjs(value.date).format("YYYY-MM-DD").toString()}
      }) : [],
    }
  };

  return (
    <Card bordered={false}>
      <DataTable
        form={form}
        selectedRow={selectedSchedule}
        setSelectedRow={setSelectedSchedule}
        updateHandler={updateHandler}
        fromPrepareSelected={fromPrepareSelected}
        onFormSubmit={onFormSubmit}
        addMutation={add}
        updateMutation={update}
        removeMutation={remove}
        data={data}
        dataIsLoading={scheduleQuery.isLoading}
        columns={columns}
        isModalRequired={true}
        alertMessage={"Couple selected"}
        deleteMessage={`Are you sure to delete selected schedule?`}
        additionalControls={
          <Select
            placeholder="Select week day"
            value={selectedWeekDay}
            onChange={(value) => setSelectedWeekDay(value)}
            options={[
              {value: 1, label: "Monday"},
              {value: 2, label: "Tuesday"},
              {value: 3, label: "Wednesday"},
              {value: 4, label: "Thursday"},
              {value: 5, label: "Friday"},
              {value: 6, label: "Saturday"},
              {value: 7, label: "Sunday"},
            ]}
            style={{width: "160px"}}
          />
        }
        isCustomSelect={true}
        borderedTable={true}
      >
        <Form.Item name="subjectId" label="Subject" rules={[{required: true}]}>
          <Select
            placeholder="Select subject"
            options={subjectQuery?.data?.map((subject) => {
              return {value: subject.id, label: subject.name}
            })}
          />
        </Form.Item>
        <Form.Item name="subjectTypeId" label="Subject Type" rules={[{required: true}]}>
          <Select
            placeholder="Select subject type"
            options={subjectTypeQuery?.data?.map((value) => {
              return {value: value.id, label: value.name}
            })}
          />
        </Form.Item>
        <Form.Item name="coupleTimeId" label="Couple" rules={[{required: true}]}>
          <Select
            placeholder="Select couple"
            options={coupleQuery?.data?.map((value) => {
              return {value: value.id, label: `[${value.index}] ${value.timeStart.slice(0, -3)}-${value.timeEnd.slice(0, -3)}`}
            })}
          />
        </Form.Item>
        <Form.Item name="subgroupId" label="Fow Who" rules={[{required: true}]}>
          <Select placeholder="Select for who">
            <Option value={-1}>Whole group</Option>
            {subgroupQuery?.data?.map((value) => (
              <Option value={value.id} key={value.id}>{value.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="teacherId" label="Teacher" rules={[{required: true}]}>
          <Select
            placeholder="Select teacher"
            options={teacherQuery?.data?.map((value) => {
              return {value: value.id, label: `${value.surname} ${value.name.substring(0, 1)}. ${value.patronymic.substring(0, 1)}.`}
            })}
          />
        </Form.Item>
        <Form.Item name="cabinet" label="Cabinet">
          <TextArea rows={1}/>
        </Form.Item>
        <Form.Item name="link" label="Link">
          <TextArea rows={1}/>
        </Form.Item>
        <Form.Item name="additionalInformation" label="Additional Info">
          <TextArea rows={1}/>
        </Form.Item>
        <Form.Item name="startEndDateRange" label="Start End Range">
          <RangePicker/>
        </Form.Item>
        <Form.Item name="isRolling" valuePropName="checked">
          <Checkbox>Is Rolling</Checkbox>
        </Form.Item>
        <Form.List name="additionalDates">
          {(fields, {add, remove}) => (
            <>
              <Form.Item>
                <Button onClick={add} block icon={<PlusOutlined />}>
                  Add additional date
                </Button>
              </Form.Item>
              {fields.map((field) => (
                <Space key={field.key} align="baseline">
                  <Form.Item {...field} name={[field.name, "date"]} label={`Additional date ${field.key + 1}`}>
                    <DatePicker/>
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(field.name)}/>
                </Space>
              ))}
            </>
          )}
        </Form.List>
        <Form.List name="removedDates">
          {(fields, {add, remove}) => (
            <>
              <Form.Item>
                <Button onClick={add} block icon={<PlusOutlined />}>
                  Add removed date
                </Button>
              </Form.Item>
              {fields.map((field) => (
                <Space key={field.key} align="baseline">
                  <Form.Item {...field} name={[field.name, "date"]} label={`Removed date ${field.key + 1}`}>
                    <DatePicker/>
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(field.name)}/>
                </Space>
              ))}
            </>
          )}
        </Form.List>
      </DataTable>
    </Card>
  );
};

export default SchedulePage;