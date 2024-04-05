import { createStackNavigator } from '@react-navigation/stack';
import AccountsScreen from '../app/(tabs)/Accounts';
import AddExpenseForAccScreen from '../app/(hidden)/addExpenseForAcc'; // make sure to import the screen
import AddFundsScreen from '../app/(hidden)/addFundsScreen';
import AddAccountScreen from '../app/(hidden)/AddAccount';
import AddExpenseScreen from '../app/(hidden)/addExpense';
import Home from '../app/(tabs)/Home';
import Settings from '../app/(tabs)/Settings';
import AddMonthlyPaymentScreen from '../app/(hidden)/AddMonth';

const AccountsStack = createStackNavigator();
const HomeStack = createStackNavigator();
const MonthStack = createStackNavigator();

function AccountsStackNavigator() {
  return (
    <AccountsStack.Navigator screenOptions={{ headerShown: false, animationEnabled: false, }}>
      <AccountsStack.Screen
        name="AccountsMain"
        component={AccountsScreen}
      />
      <AccountsStack.Screen
        name="AddExpenseForAcc"
        component={AddExpenseForAccScreen}
      />
      <AccountsStack.Screen
        name = "addFundsScreen"
        component={AddFundsScreen}
      />
      <AccountsStack.Screen
        name = "AddAcc"
        component={AddAccountScreen}
      />
    </AccountsStack.Navigator>      
  );
}

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false, animationEnabled: false, }}>
      <HomeStack.Screen
        name="HomeMain"
        component={Home}
      />
      <HomeStack.Screen
        name="AddExpenseHome"
        component={AddExpenseScreen}
      />
    </HomeStack.Navigator>      
  );
}

function MonthStackNavigator() {
  return (
    <MonthStack.Navigator screenOptions={{ headerShown: false, animationEnabled: false, }}>
      <MonthStack.Screen
        name="MonthMain"
        component={Settings}
      />
      <MonthStack.Screen
        name="AddMonthExp"
        component={AddMonthlyPaymentScreen}
      />
    </MonthStack.Navigator>      
  );
}

export {AccountsStackNavigator, HomeStackNavigator, MonthStackNavigator}
