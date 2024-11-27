# weather-forecast-application

A simple weather forecast web application that displays current weather and a 5-day forecast using data from the OpenWeather API. This project is built with pure HTML, CSS, and JavaScript.

### Features ✨

- **Current Weather by City:** Search and display current weather details for any specific city.  
- **Weather Based on Your Location:** Automatically fetch and display current weather based on the user's location (with permission).  
- **5-Day Weather Forecast:** View an extended 5-day forecast, including details like temperature, humidity, wind speed, and weather icons for better visualization.  
- **Responsive Design:** Fully optimized layout to ensure compatibility and usability on devices of all screen sizes.  
- **Real-Time Data:** Utilizes the OpenWeather API to fetch accurate and up-to-date weather information.  

## Installation 📦

Follow these steps to run the project locally:

1. Clone the repository:
   ```bash
    git clone https://github.com/your-username/weather-forecast-application.git
   ```
2. Navigate to the project directory:
   ```bash
    cd weather-forecast-application
   ```
3. Open the `index.html` file in your browser or use a local server for best results:
   ```bash
    Use VS Code Live Server extension.
   ```

## Configuration ⚙️

To use the application, you need an API key from OpenWeather.  

1. In a `config.js` file in the root directory add your API Key:
   ```javascript
   export const API_KEY = "your_openweather_api_key";
   export const API = "https://api.openweathermap.org/data/2.5";
   export const GEO_API = "https://api.openweathermap.org/geo/1.0";
   export const ICON_URL = "https://openweathermap.org/img/wn/";
   ```

## Usage 🛠️

1. Enter a city name or allow location permissions to get weather data for your current location.
2. View the current weather conditions and the 5-day forecast.

## File Structure 📂

```plaintext
.
├── index.html         # Main HTML file
├── style.css          # CSS styles
├── index.js           # Main JavaScript logic
├── config.js          # API configurations (ignored in .gitignore)
├── .gitignore         # Files to ignore in Git
└── README.md          # Project documentation
```

## Technologies Used 🖥️

- **HTML5**
- **Tailwind CSS**
- **JavaScript (ES6)**
- **OpenWeather API**

## Contributing 🤝  

Contributions are welcome! Follow these steps to contribute to this project:  

1. Fork the Repository:
   Click the "Fork" button at the top-right corner of the repository page to create a copy in your GitHub account.  

2. **Create a Feature Branch:**  
    Create a new branch to work on your feature or fix:  
   ```bash
   git checkout -b feature-name
   ```  

3. **Commit Your Changes:**  
   Make your changes and commit them with a descriptive message:  
   ```bash
   git commit -m "Add: Description of the feature or fix"
   ```  

4. **Push to Your Branch:**  
   Push your changes to the feature branch in your forked repository:  
   ```bash
   git push origin feature-name
   ```  
## Acknowledgements 🙌

- [OpenWeather API](https://openweathermap.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## Author ✍️

- **Monika Dangar**  
  GitHub: [Monika-Dangar](https://github.com/monika-dangar)  
  LinkedIn: [Monika Dangar](https://www.linkedin.com/in/monika-dangar/)  
  Twitter: [@dangar_monika](https://x.com/dangar_monika)
