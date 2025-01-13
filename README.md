# chat-app
This is a full-stack chat application built with React, Node.js, Express, MongoDB, and Socket.io.


## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:

```sh
git clone https://github.com/your-username/chat-app.git
cd chat-app
```

2. Install dependencies for the client:
```sh
cd client
npm install
```

3. Install dependencies for the server:
```sh
cd ../server
npm install
```

4. Install dependencies for the socket server:
```sh
cd ../socket
npm install
```

### Configuration
1. Create a .env file in the server directory with the following content:
```sh
ATLAS_URI = your_mongodb_connection_string
JWT_SECRET_KEY = your_jwt_secret_key
```

### Running the Application
1. Start the client:
```sh
cd client
npm run dev
```

2. Start the server:
```sh
cd ../server
node index.js
```

3. Start the socket server:
```sh
cd ../socket
node index.js
```

### Usage
Open your browser and navigate to http://localhost:5173 to access the chat application.

### Features

- User authentication (register and login)
- Real-time messaging with Socket.io
- Notifications for new messages
- Online status indication

### Technologies Used

- React
- Node.js
- Express
- MongoDB
- Socket.io
- Bootstrap
