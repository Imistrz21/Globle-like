# globle-like

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

`globle-like` is an interactive web-based globe visualization project inspired by [globle](https://globle-game.com/). It allows users to explore a 3D globe with interactive features and data visualization. The project uses the powerful [Globe.GL](https://github.com/vasturiano/globe.gl) library to render the globe and provide interactive capabilities.

## Features

- Interactive 3D globe visualization
- Country highlighting on hover
- Clickable countries to display additional information
- Zoom and rotate controls
- Customizable data layers and visualizations

## Demo

[Live Demo](#) (Link to your live demo if available)

## Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/imistrz21/globle-like.git
    cd globle-like
    ```

2. **Install dependencies:**

    ```sh
    npm install
    ```

3. **Run the development server:**

    ```sh
    npm start
    ```

4. Open your browser and navigate to `http://localhost:3000` to see the application in action.

## Usage

To customize the globe or add new features, you can modify the source files in the `src` directory. The main configuration and setup files are:

- `src/index.js`: Entry point for the application.
- `src/App.js`: Main React component that sets up the Globe.
- `src/config.js`: Configuration file for customizing globe settings and data sources.

## Dependencies

- [Globe.GL](https://github.com/vasturiano/globe.gl): The core library used for rendering the 3D globe.
- [React](https://reactjs.org/): JavaScript library for building user interfaces.
- [Three.js](https://threejs.org/): Library for 3D graphics.

## Development Status

⚠️ **Development Dropped**: As of 30.06.2024, active development on `globle-like` has been discontinued. The repository remains available for anyone interested in using or modifying the code. Contributions and forks are welcome, but the original author will not be providing updates or support.

## Contributing

Contributions are welcome! If you have ideas for improvements or new features, please open an issue or submit a pull request. 

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

Special thanks to [Globe.GL](https://github.com/vasturiano/globe.gl) for providing the tools to create this project.
