import moment from 'moment';
import React, {Component} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {Row, Table} from 'react-native-table-component';
import {StackParamList, navigableState} from '../../App';
import {Stat} from '../Model/Types';
import {HitCount} from '../Service/Counter';
import {styles} from './Styles/TableStyles';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {stats} from '../Model/Stat';

type Props = NativeStackScreenProps<StackParamList, 'ChatTable'>;

export default class TableComponent extends Component<Props, navigableState> {
  heads: string[];
  dates: string[];
  tableData: (number | string)[][];
  widthArr: number[];

  constructor(props: Props) {
    super(props);
    this.state = {loading: true};

    this.dates = [];
    this.heads = [];
    this.tableData = [];
    this.widthArr = [80];
  }

  async componentDidMount() {
    const navData: stats = this.props.route.params.data;
    const beginDate: moment.Moment | undefined =
      this.props.route.params.beginDate;
    const endDate: moment.Moment | undefined = this.props.route.params.endDate;
    const data = HitCount.filterDates(navData.stats, beginDate, endDate);
    this.dates = HitCount.getDates(data);
    this.heads = ['Date', ...navData.authors];
    this.widthArr = [...this.widthArr, ...navData.authors.map(a => 60)];
    this.tableData = HitCount.groupByDay(data, this.heads.length - 1).map(
      (st: Stat[]) => st.map((s: Stat) => s.total),
    );
    this.setState({loading: false});
  }

  render() {
    if (this.state.loading) {
      return <Text>LOADING...</Text>;
    }
    console.log(
      '[Table]',
      'Data',
      this.tableData,
      'Heads',
      this.heads,
      this.heads.length,
      this.tableData[0].length,
      'Dates',
      this.dates,
      this.dates.length,
      this.tableData.length,
    );
    return (
      <View style={styles.container}>
        <ScrollView horizontal={true}>
          <View>
            <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
              <Row
                data={this.heads}
                style={styles.header}
                textStyle={styles.text}
                widthArr={this.widthArr}
              />
            </Table>
            <ScrollView style={styles.dataWrapper}>
              <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
                {this.tableData.map((rowData, index) => {
                  rowData.unshift(this.dates[index]);
                  return (
                    <Row
                      key={index}
                      data={rowData}
                      style={
                        index % 2 === 0
                          ? {
                              ...styles.row,
                              backgroundColor: '#F7F6E7',
                            }
                          : styles.row
                      }
                      textStyle={styles.text}
                      widthArr={this.widthArr}
                    />
                  );
                })}
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    );
  }
}
