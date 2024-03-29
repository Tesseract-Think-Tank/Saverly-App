import { createStackNavigator } from '@react-navigation/stack';
import AccountsScreen from './Accounts';
import AddExpenseForAccScreen from './../(hidden)//addExpenseForAcc'; // make sure to import the screen
import AddFundsScreen from '../(hidden)/addFundsScreen';

const AccountsStack = createStackNavigator();

function AccountsStackNavigator() {
  return (
    <AccountsStack.Navigator screenOptions={{ headerShown: false }}>
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
    </AccountsStack.Navigator>      
  );
}

export default AccountsStackNavigator;
