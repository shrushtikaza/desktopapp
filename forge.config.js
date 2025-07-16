const path = require('path');

module.exports = {
  packagerConfig: {
    icon: 'resources/icon',
    asar: false,
    name: 'happy anniversary',
    executableName: 'happyanniversary',
    extraResources: [
      {
        from: path.join(__dirname, 'songs'),
        to: 'songs'
      },
      {
        from: path.join(__dirname, 'images'),
        to: 'images'
      }
    ]
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'happy-anniversary',
        setupExe: 'happyanniversarysetup.exe',
        setupIcon: 'resources/icon.ico',
        iconUrl: 'https://your-website.com/icon.ico'
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin']
    },
    {
      name: '@electron-forge/maker-deb',
      config: {}
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {}
    }
  ]
};