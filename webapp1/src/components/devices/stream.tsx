import * as React from 'react'
import { DeepstreamClient } from '@deepstream/client'
import { useStyletron } from 'baseui'
import { Button } from 'baseui/button'
import { Settings, Zap, Activity } from 'react-feather'
import moment from 'moment';
//import Moment from 'react-moment';
import axios from 'axios'
import { useParams, Redirect } from "react-router-dom";
import { db } from '../../hooks/use-auth'
import Display from './display'
// import { useAuth } from '../../hooks/use-auth'
// import {
//   ResponsiveContainer,
//   LineChart,
//   CartesianGrid,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Line,
// } from 'recharts'
// import { clear } from 'console'

//import { db } from '../../hooks/use-auth'

// moment.locale('vi')
moment().zone(7)
const StreamDevices: React.FC<{}> = () => {
  const [css, theme] = useStyletron();
  const [data, setData] = React.useState(() => ({ timestamp: "", temperature: 0, humidity: 0 }))
  const { id } = useParams()
  const [history, sethistory] = React.useState(Object)
  const [fields, setfields] = React.useState(Array);


  React.useEffect(() => {

    const client = new DeepstreamClient('localhost:6020')
    client.login()
    const record = client.record.getRecord('news')
    function getds() {
      record.subscribe(`news/${id}`, async (value: any) => {
        //let dataj = JSON.parse(value);
        await setData(value)
        axios({
          method: 'post',
          url: 'http://localhost:8877/api/getdata',
          data: {
            device_id: id,
            timestamp: value.timestamp
          }
        }).then(data => {
          console.log("Postgres", data.data.rows)
          let res = [...data.data.rows]
          let maps = res.map((el) => {
            let first = el['time'].indexOf(' ')
            let last = el['time'].indexOf(',')
            let hour = el['time'].substring(first + 1, last)
            return { ...el, hour }
          })
          console.log(maps)
          // sethistory(data.data.rows)
          sethistory(maps)
        })
          .catch(er => { console.log("hhh", er) })
      })
    }
    getds();

    return () => {
      record.unsubscribe(`news/${id}`, () => console.log('offline'))
    }
  }, [])



  React.useEffect(() => {
    console.log("set fields")
    const getdata = async () => {
      let docs = db.collection('devices').doc(id);

      await docs.get().then(async doc => {
        if (!doc.exists) {
          console.log('No such document!');
        } else {
          console.log('Document data:', doc.get('data_fields'));
          let field = doc.get('data_fields')
          console.log(typeof field)
          setfields(field)
        }
      })
        .catch(err => {
          console.log('Error getting document', err);
        });
    }
    getdata()
  }, [])


  // console.log("data", data)
  // console.log("history", history[0])

  return (
    < div className={css({})} >
      <div
        className={css({
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        })}
      >
        <div className={css({ ...theme.typography.font550 })}>
          Thiết bị XIot {`(${id})`}
        </div>
        <Button
          // onClick={() => setIsOpen(true)}
          kind="secondary"
          startEnhancer={() => (
            <Settings color={theme.colors.mono700} size={18} />
          )}
          overrides={{
            BaseButton: {
              style: {
                borderTopLeftRadius: theme.sizing.scale400,
                borderBottomRightRadius: theme.sizing.scale400,
              },
            },
          }}
        >
          Cài đặt
        </Button>
      </div>

      <div
        className={css({
          marginTop: theme.sizing.scale800,
          marginBottom: theme.sizing.scale800,
          display: 'grid',
          gridTemplateColumns: '0.35fr 1fr',
        })}
      >
        {
          fields!.map((ite: any, i) => { return <Display key={Math.random() * 10 + i} field={ite} data={data} history={history} ></Display> })
        }
        {/* <Display name="temperature" data={data} history={history}></Display>
        <Display name="humidity" data={data} history={history}></Display> */}
        {/* <div
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
                Nhiệt độ
              </div>
              <div
                className={css({
                  color: theme.colors.mono800,
                })}
              >
                {moment(data.timestamp).format("[Lúc] hh:mm:ss a [ngày ] DD [tháng ] MM [năm ] YYYY")}
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
            {data.temperature}
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
                Nhiệt độ
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
                <XAxis dataKey="time" />
                <YAxis
                  // ticks={[0, 20, 40, 60]}
                  axisLine={false}
                  tickFormatter={value => value}
                />

                <Tooltip />
                <Line
                  type="linear"
                  dataKey="temperature"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
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
                Độ ẩm
              </div>
              <div
                className={css({
                  color: theme.colors.mono800,
                })}
              >
                {moment(data.timestamp).format("[Lúc] hh:mm:ss a [ngày ] DD [tháng ] MM [năm ] YYYY")}
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
            {data.humidity}
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
                Nhiệt độ
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
                <XAxis dataKey="time" />
                <YAxis
                  //ticks={[0, 20, 40, 60]}
                  axisLine={false}
                  tickFormatter={value => value}
                />

                <Tooltip />
                <Line
                  type="linear"
                  dataKey="humidity"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div> */}
      </div>
    </div >
  )
}

export default StreamDevices
