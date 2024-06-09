import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import PieChart from 'react-native-pie-chart';
import RNPickerSelect from 'react-native-picker-select';
import { getCategoryPrices } from '../../services/expenseCategories';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Function to fetch data for the selected month
const fetchData = async (monthName) => {
  try {
    const data = await getCategoryPrices(monthName);
    if (Object.keys(data).length === 0) {
      return { "There are no expenses available for the current month": 1 };
    }
    return data;
  } catch (error) {
    console.error('Failed to fetch category prices:', error);
    throw error;
  }
};

// Styles for the picker component
const customPickerStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    width: width * 0.1,
    borderWidth: 1,
    borderColor: '#6AD4DD',
    borderRadius: 10,
    backgroundColor: '#2B2D31',
    color: '#fff',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    width: width * 0.45,
    paddingVertical: 8,
    backgroundColor: '#131416',
    color: '#fff',
    borderRadius: 10,
  },
  iconContainer: {
    top: 10,
    right: 10,
  },
});

// Function to prepare chart data for rendering
const prepareChartData = (data) => {
  const colors = ['#6AD4DD', '#9b5fe0', '#16a4d8', '#8bd346', '#f9a52c', '#d64e12', '#F7418F', '#4CCD99'];
  const legends = Object.keys(data);
  const series = Object.values(data);
  const sliceColor = colors.slice(0, series.length);

  return { series, legends, sliceColor };
};

const MonthlyRecap = () => {
  const [data, setChartData] = useState<{} | null>(null);
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    const fetchDataAndUpdateChart = async () => {
      try {
        const _data = await fetchData(selectedMonth);
        setChartData(_data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchDataAndUpdateChart();
  }, [selectedMonth]);

  useEffect(() => {
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];

    setSelectedMonth(monthNames[currentMonthIndex]);

    const descendingMonths = [];
    for (let i = currentMonthIndex; i >= 0; i--) {
      descendingMonths.push({ label: monthNames[i], value: monthNames[i] });
    }
    for (let i = 11; i > currentMonthIndex; i--) {
      descendingMonths.push({ label: monthNames[i], value: monthNames[i] });
    }

    setMonths(descendingMonths);
  }, []);

  if (!data || months.length === 0) {
    return <Text>Loading...</Text>;
  }

  const chartData = prepareChartData(data);
  const series = chartData.series;
  const legends = chartData.legends;
  const sliceColor = chartData.sliceColor;
  const chart_wh = 250;
  const holeRadius = 0.2;

  return (
    <View style={styles.container}>
      <PieChart
        style={{ marginTop: 50 }}
        widthAndHeight={chart_wh}
        series={series as number[]}
        sliceColor={sliceColor}
        coverRadius={holeRadius}
      />
      <View style={styles.legendContainer}>
        {legends.map((legend, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: sliceColor[index] }]} />
            <Text style={styles.text}>{legend}</Text>
          </View>
        ))}
      </View>
      <View style={{ top: 30 }}>
        <RNPickerSelect
          style={customPickerStyles}
          value={selectedMonth}
          onValueChange={(value) => {
            setSelectedMonth(value);
          }}
          items={months}
          useNativeAndroidPickerStyle={false}
          Icon={() => {
            return <Ionicons name="chevron-down" size={25} color='#fff' />;
          }}
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
    paddingTop: 20,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    margin: 4,
    backgroundColor: '#131416',
    borderRadius: 15,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  text: {
    color: '#fff',
  },
});

export default MonthlyRecap;