/*
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { getCategoryPrices } from '../../services/expenseCategories';


const fetchData = async () => {
  return getCategoryPrices();
  // return { "Food": 40, "Sport": 120, "Others": 161 };
};

const transformData = (data) => {
  return Object.entries(data).map(([label, value], index) => ({
    label,
    value,
    key: `pie-${index}`,
  }));
};

const MonthlyRecap = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchAndTransformData = async () => {
      const fetchedData = await fetchData();
      const transformedData = transformData(fetchedData);
      setChartData(transformedData);
    };

    fetchAndTransformData();
  }, []);

  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#800000', '#008000', '#000080', '#808000', '#800080', '#008080'];

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <PieChart
          style={styles.chart}
          data={chartData.map((item, index) => ({
            value: item.value,
            svg: {
              fill: colors[index % colors.length],
            },
            key: item.key,
          }))}
        />
      </View>
      <View style={styles.legendContainer}>
        {chartData.map((item, index) => (
          <View key={`legend-${index}`} style={styles.legendItem}>
            <View style={[styles.colorIndicator, { backgroundColor: colors[index % colors.length] }]} />
            <Text style={styles.legendText}>{`${item.label}: ${item.value}`}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chart: {
    height: 300,
    width: 300,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
  },
  colorIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 14,
  },
});

export default MonthlyRecap;
*/