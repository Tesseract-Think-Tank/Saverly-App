import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import PieChart from 'react-native-pie-chart';
import { getCategoryPrices } from '../../services/expenseCategories';

const fetchData = async () => {
  try {
    const data = await getCategoryPrices();
    return data;
  } catch (error) {
    console.error('Failed to fetch category prices:', error);
    throw error;
  }
};

const transformDataToSeriesAndColors = (data, colors) => {
  const series = [];
  const sliceColors = [];
  Object.entries(data).forEach(([label, value], index) => {
    series.push(value);
    sliceColors.push(colors[index % colors.length]);
  });
  return { series, sliceColors };
};

const MonthlyRecap = () => {
  const [series, setSeries] = useState([]);
  const [sliceColors, setSliceColors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData()
      .then(data => {
        const { series, sliceColors } = transformDataToSeriesAndColors(data, colors);
        setSeries(series);
        setSliceColors(sliceColors);
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#800000', '#008000', '#000080', '#808000', '#800080', '#008080'];

  if (isLoading) {
    return <View style={styles.container}><ActivityIndicator size="large" /></View>;
  }

  if (error) {
    return <View style={styles.container}><Text>Error loading data</Text></View>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <PieChart
          widthAndHeight={300}
          coverRadius={0.5}
          style={styles.chart}
          series={series}
          sliceColor={sliceColors}
        />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  chart: {
    height: 200,
    width: 200,
  }
});

export default MonthlyRecap;
