import React from 'react';
import {Dimensions, View} from 'react-native';
import {Text} from 'react-native-svg';
import {PieChart} from 'react-native-svg-charts';
import {chatProps, navigableState} from '../../../App';
import {HitCount} from '../../Service/Counter';

const deviceWidth = Dimensions.get('window').width;

type PieGraphState = navigableState & {
  selectedSlice: {label: string; value: number};
  labelWidth: number;
};

export class PieGraph extends React.Component<chatProps, PieGraphState> {
  heads: string[];
  dates: string[];
  tableData: Record<string, string | number>;

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
    let tdata: Record<string, string | number>[] = [];
    for (let st of grouped) {
      let d: Record<string, string | number> = {};
      d.day = st[0].day;
      for (let s of st) {
        d[s.author] = s.total;
      }
      tdata.push(d);
    }
    this.tableData = tdata.reduce(
      (
        prev: Record<string, string | number>,
        current: Record<string, string | number>,
      ) => {
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
    const colors = ['#600080', '#9900cc', '#c61aff', '#d966ff', '#ecb3ff'];
    const data = Object.keys(this.tableData)
      .filter(d => typeof this.tableData[d] === 'number')
      .map((key, index) => {
        return {
          key,
          value: this.tableData[key] as number,
          svg: {fill: colors[index]},
          arc: {
            outerRadius: 70 + (this.tableData[key] as number) + '%',
            padAngle: label === key ? 0.1 : 0,
          },
          onPress: () =>
            this.setState({
              selectedSlice: {label: key, value: this.tableData[key] as number},
            }),
        };
      });
    console.log('[PieGraph]', 'Data', data, selectedSlice);

    return (
      <View style={{justifyContent: 'center', flex: 1}}>
        <PieChart
          style={{height: 200}}
          outerRadius={'80%'}
          innerRadius={'45%'}
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
