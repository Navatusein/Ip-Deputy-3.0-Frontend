import {FC, useCallback} from 'react';
import {ICouple} from "../../models/ICouple.ts";
import {subjectApi} from "../../services/SubjectService.ts";
import {Radio, Space, Tag, Typography} from "antd";
import {subjectTypeApi} from "../../services/SubjectTypeService.ts";
import {teacherApi} from "../../services/TeacherService.ts";

const {Text} = Typography;

interface  ScheduleCardProps {
  schedule: ICouple;
  selectedSchedule?: ICouple;
  setSelectedSchedule: (schedule: ICouple) => void;
}

const ScheduleCard: FC<ScheduleCardProps> = (props) => {
  const subjectQuery = subjectApi.useFetchAllQuery();
  const subjectTypeQuery = subjectTypeApi.useFetchAllQuery();
  const teacherQuery = teacherApi.useFetchAllQuery();

  const selectSchedule = () => {
    props.setSelectedSchedule(props.schedule)
  }

  const isSelected = useCallback(() : boolean => {
    return props.schedule == props.selectedSchedule;
  }, [props.schedule, props.selectedSchedule]);

  return (
    <div style={{
      textAlign: "start",
      whiteSpace: "nowrap",
      margin: "-8px", padding: "8px",
      backgroundColor: isSelected() ? "#111a2c" : ""
    }}>
      <div>
        <div>
          <Space>
            <Radio onClick={selectSchedule} checked={isSelected()} style={{margin: "0px"}}/>
            <Text strong={true}>
              {subjectQuery.data?.find(x => x.id == props.schedule.subjectId)?.shortName}
            </Text>
            <Tag color={"blue"}>
              {subjectTypeQuery.data?.find(x => x.id == props.schedule.subjectTypeId)?.shortName}
            </Tag>
          </Space>
        </div>
        <div>
          <Space>
            {props.schedule.startDate &&
              <div>
                {props.schedule.startDate?.substring(5).split("-").reverse().join(".")}
                -
                {props.schedule.endDate?.substring(5).split("-").reverse().join(".")}
              </div>
            }
            {props.schedule.isRolling &&
              <Tag style={{marginRight: "0px"}}>
                Ч/Т
              </Tag>
            }
            {props.schedule.additionalDates.length !== 0 &&
              <div>
                та [
                {props.schedule.additionalDates.map((date) =>
                  <span key={date.date}>
                    {date.date.substring(5).split("-").reverse().join(".")}
                  </span>
                )}
                ]
              </div>
            }
            {props.schedule.removedDates.length !== 0 &&
              <div>
                крім [
                {props.schedule.removedDates.map((date) =>
                  <span key={date.date}>
                    {date.date.substring(5).split("-").reverse().join(".")}
                 </span>
                )}
                ]
              </div>
            }
          </Space>
        </div>
        <div>
          <Space>
            <div>
              {teacherQuery.data?.find(x => x.id == props.schedule.teacherId)?.surname + ' '}
              {teacherQuery.data?.find(x => x.id == props.schedule.teacherId)?.name.substring(0, 1)}.
              {" " + teacherQuery.data?.find(x => x.id == props.schedule.teacherId)?.patronymic.substring(0, 1)}.
            </div>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;