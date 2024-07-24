# Project Guiding Star: The Frontend

It is a part of the Guiding Star project.
[Learn more about the overall architecture here.](https://github.com/pku-GeekGame/guiding-star)

## Usage

Since this is a frontend project, you don't need to install requirements on the deployment server.

Install requirements on the developer's machine (or a CI worker) and copy the built files to the deployment server is okay.

**Setup:**

- Install Node.JS (≥12)
- `cp src/branding_example.jsx src/branding.jsx`
- `cp src/build_example.sh build.sh`
- `npm install`

**Development:**

- `npm start`

**Build:**

- `./build.sh`
- Find built files in `build-finished` directory

## Browser Compatibility

The current version targets the below browsers:

- Chrome 80+
- Firefox 78+
- Safari 14+

Future versions may only target browsers within recent 4 years.

## License

This repository is distributed under [MIT License](LICENSE.md).