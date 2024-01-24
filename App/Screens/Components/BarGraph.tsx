import React from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-svg';
import {BarChart, Grid} from 'react-native-svg-charts';
import {chatProps, navigableState} from '../../../App';
import {HitCount} from '../../Service/Counter';

const CUT_OFF = 20;

export class BarGraph extends React.Component<chatProps, navigableState> {
  heads: string[];
  dates: string[];
  tableData: Record<string, string | number>[];

  constructor(props: chatProps) {
    super(props);
    this.state = {loading: true};

    this.dates = [];
    this.heads = [];
    this.tableData = [];
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
    for (let st of grouped) {
      let d: Record<string, string | number> = {};
      d.day = st[0].day;
      for (let s of st) {
        d[s.author] = s.total;
      }
      this.tableData.push(d);
    }
    this.setState({loading: false});
  }

  render() {
    if (this.state.loading) {
      return <Text>LOADING...</Text>;
    }
    const keys = Object.keys(this.tableData[0]);
    keys.shift();
    const colors = [
      '#6600aa',
      '#7700bb',
      '#8800cc',
      '#9911dd',
      '#aa22ff',
      '#bb44ff',
      '#cc66ff',
      '#dd88ff',
      '#eeaaff',
      '#ffeeff',
    ].slice(0, keys.length);

    const Labels = ({x, y, bandwidth, data}: any) =>
      data.map((value: number, index: number) => (
        <Text
          key={index}
          x={x(index) + bandwidth / 2}
          y={value < CUT_OFF ? y(value) - 10 : y(value) + 15}
          fontSize={14}
          fill={value >= CUT_OFF ? 'white' : 'black'}
          alignmentBaseline={'middle'}
          textAnchor={'middle'}>
          {value}
        </Text>
      ));

    return (
      <View style={{flexDirection: 'row', height: 200, paddingVertical: 16}}>
        <BarChart
          style={{flex: 1}}
          data={this.tableData}
          svg={{fill: 'rgba(134, 65, 244, 0.8)'}}
          contentInset={{top: 10, bottom: 10}}
          gridMin={0}>
          <Grid direction={Grid.Direction.HORIZONTAL} />
          {/* <Labels /> */}
        </BarChart>
      </View>
    );
  }
}
