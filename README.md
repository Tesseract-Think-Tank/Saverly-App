## Team Tesseract - Raiffeisen's Think Tank Lab - 2<sup>nd</sup> place

### Overview
The app is designed to assist users in managing their finances efficiently. It allows users to:
- Create and manage multiple accounts with different types and currencies.
- Add and track expenses, ensuring accurate conversion and categorization.
- View summary statistics for different expense categories.
- Receive notifications for upcoming payments.
- Interact with a chatbot for financial advice and information.

### Key Features

#### User Authentication
- **Sign Up**: Users can register using their email and password.
- **Log In**: Secure authentication via Firebase Authentication.
- **User Data Initialization**: Upon successful sign-up, the app initializes user details in Firestore.

#### Account Management
- **Create Accounts**: Users can create accounts specifying the type (e.g., cash, bank) and currency (e.g., RON, USD, EUR).
- **View Accounts**: Users can view a list of all their accounts.
- **Update Balances**: Balances are updated when funds are added or expenses are recorded.
- **Currency Conversion**: Handles conversion between different currencies using predefined exchange rates.

#### Expense Management
- **Add Expenses**: Users can add expenses to specific accounts, with details like category, amount, and description.
- **Categorize Expenses**: Expenses are categorized for better tracking and analysis.
- **Convert Expenses**: Ensures all expenses are recorded in a standard currency (RON) for consistency.

#### Expense Summarization
- **Monthly Summary**: Provides a summary of expenses by category for each month.
- **Currency Conversion**: Converts all expenses to RON to provide a consistent view of spending.

#### Notifications
- **Monthly Payment Reminders**: Users receive notifications about upcoming monthly payments, helping them stay on top of their finances.

#### Chatbot Integration
- **Financial Advice**: Users can interact with a chatbot to get financial advice and information.
- **Expense and Budget Queries**: Users can ask the chatbot questions about budgeting, expenses, and cost-saving tips.
- **Predefined Questions**: The chatbot can answer specific predefined questions related to rent, food, and travel expenses.
- **Dynamic Responses**: The chatbot uses conversation history to provide relevant and personalized responses.

### Detailed Components

#### User Authentication
- **Firebase Authentication**: Manages user sessions securely, allowing users to sign up and log in.
- **User Data Initialization**: Ensures that user data is correctly initialized in Firestore upon registration.

#### Account Management
- **Add Account**: Users can specify the type, initial balance, and currency of new accounts. The app updates the user's total income based on the initial balance.
- **Fetch Accounts**: Retrieves all accounts associated with the logged-in user, displaying them for easy management.

#### Expense Management
- **Add Expense**: Records expenses to a selected account, ensuring that the amount is correctly converted to the account's currency.
- **Fetch Expenses**: Retrieves and categorizes expenses for the logged-in user, facilitating detailed financial tracking.
- **Remove Expense**: Allows users to remove specific expenses, updating account balances and total expenses accordingly.

#### Expense Summarization
- **Category Prices**: Provides a breakdown of expenses by category for a selected month, helping users understand their spending patterns.
- **Currency Conversion**: Uses predefined exchange rates to ensure that all expenses are converted to a standard currency for consistent tracking.

#### Notifications
- **Monthly Payment Notifications**: Alerts users about upcoming payments, helping them avoid missed payments and manage their budget effectively.

#### Chatbot Integration
- **Chatbot Interface**: Users can interact with the chatbot via a simple and intuitive interface.
- **Predefined and Dynamic Questions**: The chatbot can handle both predefined questions and dynamic user queries, providing tailored financial advice.
- **Conversation History**: The chatbot maintains a history of conversations to provide contextually relevant responses.

By integrating these features, the app provides a comprehensive financial management tool that helps users track their expenses, manage their accounts, and receive helpful financial advice through an intuitive chatbot interface.
