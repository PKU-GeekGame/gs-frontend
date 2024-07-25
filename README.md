# Project Guiding Star: The Frontend

It is a part of the Guiding Star project.
[Learn more about the overall architecture here.](https://github.com/pku-GeekGame/guiding-star)

## Usage

Since this is a frontend project, you don't need to install requirements on the deployment server.

Install requirements on the developer's machine (or a CI worker) and copy the built files to the deployment server is okay.

**Setup:**

- Install a recent version of Node.JS and NPM
- `cp src/branding_example.jsx src/branding.jsx`
- `cp build_example.sh build.sh`
- `npm install`

**Development:**

- `npm start`

**Build:**

- `./build.sh`
- Find built files in `build-finished` directory

## Browser Compatibility

The current version targets the below browsers:

- Chrome 79+
- Firefox 78+
- Safari 13+

Future versions may only target browsers within recent 5 years.

## License

This repository is distributed under [MIT License](LICENSE.md).