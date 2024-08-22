# FlatPay

FlatPay is a full-stack web application that allows users to add other users, send and request money, and manage transactions on a social platform. The application includes a Python Flask backend with a SQLAlchemy ORM for managing the database and a React frontend for user interaction.

## Features

- **User Management**: Add other users, manage your account, and interact with friends.
- **Transactions**: Send and request money, view transaction history, and manage payments.
- **Authentication & Authorization**: Secure user sessions with integrated authentication and authorization.

## Technologies Used

- **Backend**: Python, Flask, SQLAlchemy ORM
- **Frontend**: React
- **Database**: SQLite (or your preferred database)
- **Package Manager**: pipenv (for Python dependencies), npm (for Node.js dependencies)

## Getting Started

### Prerequisites

- Python 3.x
- Node.js and npm
- pipenv

### Backend Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/FlatPay.git
   cd FlatPay
   ```

2. **Install Python dependencies**:
   ```bash
   pipenv install
   ```

3. **Activate the pipenv shell**:
   ```bash
   pipenv shell
   ```

4. **Initialize the database**:
   ```bash
   cd server
   flask db init
   flask db migrate
   flask db upgrade
   ```

### Frontend Setup

1. **Navigate to the client directory**:
   ```bash
   cd ../client
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   ```

3. **Start the React application**:
   ```bash
   npm start
   ```

   The application will run on `http://localhost:3000`.

## Usage

- **Accessing the Application**: Open your browser and go to `http://localhost:3000`.
- **Authentication**: Sign up or log in to start using FlatPay.
- **Managing Transactions**: Add friends, send money, request payments, and view your transaction history.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the open-source community for their amazing tools and libraries.
- Special thanks to everyone who contributed to the development of FlatPay.
