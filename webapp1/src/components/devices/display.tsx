import * as React from 'react'
import { useStyletron } from 'baseui'
import { Zap, Activity } from 'react-feather'
import moment from 'moment';

import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from 'recharts'
import { type } from 'os';

moment().zone(7)

// type Data = {
//   deviceId?: string,
//   timestamp?: string,
//   temperature?: number,
//   humidity?: number,
//   batery?: number
// }

// type item = {
//   hour?: string,
//   timme?: string,
//   temperature?: number,
//   humidity?: number
// }

// type Props = {
//   name: any,
//   data: Data,
//   history: Array<item>
// }


const Display = ({ field, data, history }: any) => {
  const [css, theme] = useStyletron()
  return (
    <>
      <div
        className={css({
          backgroundColor: theme.colors.mono100,
          ...theme.borders.border200,
          borderTopLeftRadius: theme.sizing.scale400,
          borderBottomRightRadius: theme.sizing.scale400,
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          marginRight: theme.sizing.scale600,
        })}
      >
        <div
          className={css({
            display: 'flex',
            alignItems: 'center',
            paddingTop: theme.sizing.scale600,
            paddingLeft: theme.sizing.scale800,
            paddingRight: theme.sizing.scale800,
          })}
        >
          <div className={css({ marginRight: theme.sizing.scale500 })}>
            <Zap color={theme.colors.accent200} size={24} />
          </div>
          <div>
            <div className={css({ ...theme.typography.font400 })}>
              {`${field.field_display} (${field.field_unit})`}
            </div>
            <div
              className={css({
                color: theme.colors.mono800,
              })}
            >
              {moment(data['timestamp']).format("[Lúc] hh:mm:ss a [ngày ] DD [tháng ] MM [năm ] YYYY")}
            </div>
          </div>
        </div>
        <div
          className={css({
            ...theme.typography.font1050,
            fontWeight: 'normal',
            fontSize: '46px',
            paddingTop: theme.sizing.scale1000,
            paddingBottom: theme.sizing.scale800,
            paddingLeft: theme.sizing.scale800,
            paddingRight: theme.sizing.scale800,
            borderBottom: theme.colors.mono300,
            textAlign: 'center',
          })}
        >
          {data[field.field_name]}
        </div>
      </div>
      <div
        className={css({
          backgroundColor: theme.colors.mono100,
          ...theme.borders.border200,
          borderTopLeftRadius: theme.sizing.scale400,
          borderBottomRightRadius: theme.sizing.scale400,
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        })}
      >
        <div
          className={css({
            display: 'flex',
            alignItems: 'center',
            paddingTop: theme.sizing.scale600,
            paddingBottom: theme.sizing.scale600,
            paddingLeft: theme.sizing.scale800,
            paddingRight: theme.sizing.scale800,
          })}
        >
          <div className={css({ marginRight: theme.sizing.scale500 })}>
            <Activity color={theme.colors.accent200} size={24} />
          </div>
          <div>
            <div className={css({ ...theme.typography.font400 })}>
              {field.field_display}
            </div>
          </div>
        </div>
        <div
          className={css({
            width: '100%',
            height: '150px',
          })}
        >
          <ResponsiveContainer>
            <LineChart
              data={history}
              //syncId="imp"
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis dataKey="hour" />
              <YAxis
                //ticks={[0, 20, 40, 60, 80, 100]}
                axisLine={false}
                tickFormatter={value => value}
              />

              <Tooltip />
              <Line
                type="linear"
                dataKey={field.field_name}
                stroke="#8884d8"
                fill="#8884d8"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}

export default Display