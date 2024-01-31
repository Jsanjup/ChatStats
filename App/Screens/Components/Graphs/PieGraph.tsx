import React from 'react';
import {Dimensions, View} from 'react-native';
import {Text} from 'react-native-svg';
import {PieChart} from 'react-native-svg-charts';
import {chatProps, navigableState} from '../../../../App';
import {HitCount} from '../../../Service/Counter';
import {Colors} from '../../../util/Colors';

const deviceWidth = Dimensions.get('window').width;

type PieGraphState = navigableState & {
  selectedSlice: {label: string; value: number};
  labelWidth: number;
};

export class PieGraph extends React.Component<chatProps, PieGraphState> {
  heads: string[];
  dates: string[];
  tableData: Record<string, number>;

  constructor(props: chatProps) {
    super(props);
    this.state = {
      selectedSlice: {
        label: '',
        value: 0,
      },
      labelWidth: 0,
      loading: true,
    };

    this.dates = [];
    this.heads = [];
    this.tableData = {};
  }

  async componentDidMount() {
    const data = HitCount.filterDates(
      this.props.data.stats,
      this.props.beginDate,
      this.props.endDate,
    );
    this.dates = HitCount.getDates(data);
    this.heads = ['Date', ...this.props.data.authors];
    const grouped = HitCount.groupByDay(data, this.heads.length - 1);
    let tdata: Record<string, number>[] = [];
    for (let st of grouped) {
      let d: Record<string, number> = {};
      for (let s of st) {
        d[s.author] = s.total;
      }
      tdata.push(d);
    }
    this.tableData = tdata.reduce(
      (prev: Record<string, number>, current: Record<string, number>) => {
        for (let key of Object.keys(current)) {
          if (typeof prev[key] === 'number') {
            let p: number = prev[key] as number;
            p += current[key] as number;
            prev[key] = p;
          }
        }
        return prev;
      },
    );
    this.setState({loading: false});
  }

  render() {
    if (this.state.loading) {
      return <Text>LOADING...</Text>;
    }

    const {labelWidth, selectedSlice} = this.state;
    const {label, value} = selectedSlice;
    let max = Math.max(...Object.values(this.tableData));
    const data = Object.keys(this.tableData)
      .filter(d => typeof this.tableData[d] === 'number')
      .map((key, index) => {
        return {
          key,
          value: this.tableData[key],
          svg: {fill: Colors[index]},
          arc: {
            outerRadius: 25 + (this.tableData[key] / max) * 25 + '%',
            padAngle: label === key ? 0.1 : 0,
          },
          onPress: () =>
            this.setState({
              selectedSlice: {label: key, value: this.tableData[key] as number},
            }),
        };
      });
    console.log('[PieGraph]', 'Data', data, this.tableData, selectedSlice);

    return (
      <View
        style={{justifyContent: 'center', flex: 0, height: 600, width: 400}}>
        <PieChart
          style={{height: 600, width: 400}}
          outerRadius={'100%'}
          innerRadius={'20%'}
          data={data}
        />
        <Text
          onLayout={(e: any) => {
            this.setState({labelWidth: e.nativeEvent?.layout?.width});
          }}
          style={{
            position: 'absolute',
            left: deviceWidth / 2 - labelWidth / 2,
            textAlign: 'center',
          }}>
          {`${label} \n ${value}`}
        </Text>
      </View>
    );
  }
}
