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


const CustomizedAxisTick = ({ x, y, stroke, payload }: any) => {

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dx={20} dy={16} textAnchor="end" fill="#000000" fontWeight='bold' fontSize={10} transform="rotate(-20)">{payload.value}</text>
    </g>
  );
}


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
                bottom: 30,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis dataKey="hour" tickFormatter={value => value} tick={<CustomizedAxisTick />} />
              <YAxis
                axisLine={false}
                tickFormatter={value => value}
              />

              <Tooltip />
              <Line
                type="linear"
                dataKey={field.field_name}
                stroke="#ec157a"
                fill="#ec157a"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  )
}

export default Display