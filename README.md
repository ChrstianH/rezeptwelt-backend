# rezeptwelt-backend

Backend server for the Rezeptwelt recipe management application.

## Overview

This project provides a RESTful API for managing and retrieving recipe data, including popular and recent recipes, detailed recipe information, instructions, and ingredients. It is built with Node.js, Express, and MySQL.

## Features

- **Get Most Popular Recipes** 
- **Get Most Recent Recipes**  
- **Get Recipe Details**  
- **Get Recipe Instructions**  
- **Get Recipe Ingredients**  

## Technology Stack

- Node.js
- Express.js
- MySQL
- CORS
- dotenv

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm
- MySQL database

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ChrstianH/rezeptwelt-backend.git
   cd rezeptwelt-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**  
   Create a `.env` file in the project root with the following:
   ```
   DB_HOST=your_db_host
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_DATABASE=your_db_name
   DB_PORT=your_db_port
   ```

4. **Start the server:**
   ```bash
   node index.js
   ```
   The server listens on port `8080` by default.

## API Endpoints

| Method | Endpoint                     | Description                                  |
|--------|------------------------------|----------------------------------------------|
| GET    | `/getMostPopular`            | Get top 3 highest-rated recipes              |
| GET    | `/getMostRecent`             | Get 3 most recently added recipes            |
| GET    | `/recipe?recipe_id=<id>`     | Get details for a specific recipe            |
| GET    | `/getInstructions?recipe_id=<id>` | Get instructions for a specific recipe      |
| GET    | `/getIngredients?recipe_id=<id>`  | Get ingredients for a specific recipe       |

## Contributing

Contributions are welcome! Please create an issue or open a pull request for suggestions and improvements.

## License

This project is currently unlicensed.
