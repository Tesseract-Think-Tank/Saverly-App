import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PieChart from 'react-native-pie-chart';
import RNPickerSelect from 'react-native-picker-select';
import { getCategoryPrices } from '../../services/expenseCategories';

const fetchData = async (monthName) => {
  try {
    const data = await getCategoryPrices(monthName);
    if (Object.keys(data).length === 0)
    {
      return {"There are no expenses available for the current month": 1}
    }
    return data;
  } catch (error) {
    console.error('Failed to fetch category prices:', error);
    throw error;
  }
};

const prepareChartData = (data) => {
  const colors = ['#9CA3AF','#008F75','#7E9AC8', '#5C6973', '#F2F2F2', '#A6D3E0', '#2E4C5A', '#D1D5DB'];
  const legends = Object.keys(data);
  const series = Object.values(data);
  const sliceColor = colors.slice(0, series.length);

  return { "series": series, "legends": legends, "sliceColor": sliceColor };
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

    fetchDataAndUpdateChart(); // Call the async function
  }, [fetchData, selectedMonth]); // Depend on fetchData to re-run effect when it changes
  
  useEffect(() => {
    const currentDate = new Date();
    const currentMonthIndex = currentDate.getMonth();
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];

    setSelectedMonth(monthNames[currentMonthIndex]);
    
    // Create an array of month names in descending order from the current month
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
    // Render loading state or placeholder if data is not yet fetched
    return <Text>Loading...</Text>;
  }

  const chartData = prepareChartData(data);
  const series = chartData["series"];
  const legends = chartData["legends"];
  const sliceColor = chartData["sliceColor"];
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
            <Text>{legend}</Text>
          </View>
        ))}
      </View>
      <View>
        <Text style={styles.monthDisplayedText}>{selectedMonth}</Text>
        <RNPickerSelect
          // style={pickerSelectStyles}
          value={selectedMonth} // Default selected value to the current month
          onValueChange={(value) => {
            setSelectedMonth(value);
          }}
          items={months}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Change this line
    alignItems: 'center',
    backgroundColor: '#33404F', // Add this line or adjust the value as needed
    position:'relative'
  },
  legendContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom:10,
  },
  legendColor: {
    width: 15,
    height: 15,
    borderRadius: 8,
    marginRight: 5,
  },
  monthDisplayedText: {
    fontSize: 20,
  },
});
export default MonthlyRecap;
