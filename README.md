# MMM-TheSpaceDevs

This is a module for [MagicMirror²](https://github.com/MichMich/MagicMirror/).

This module will show you upcoming rocket launches based on [TheSpaceDevs](https://thespacedevs.com/) API.
Unauthenticated users have access to 15 api calls per hour.

## Installation

1. Navigate to your MagicMirror's modules folder, and run the following command: `git clone https://github.com/AlexMNet/MMM-TheSpaceDevs.git`
2. Add the module and a valid configuration to your `config/config.js` file

## Using the module

This is an example configuration for your `config/config.js` file:

```js
var config = {
  modules: [
    {
      module: 'MMM-TheSpaceDevs',
      position: 'bottom_right',
      config: {
        updateInterval: (60 * 60 * 1000) / 15,
        records: 5,
        type: 'table',
        locationIds: [11],
        headerText: 'Vandenberg Space Force Base',
      },
    },
  ],
};
```

## Configuration options

| Option           | Description                                                                                                                                              |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `records`        | _Optional_ - # of launches you want returned from the api between 1 - 7 **_Default_**: 6                                                                 |
| `updateInterval` | _Optional_ - How often you want to fetch data from the API. Default is 15 times per hours                                                                |
| `apiKey`         | _Optional_ - Add apiKey for increased API rate limits visit [TheSpaceDevs](https://ll.thespacedevs.com/docs/#/launch/launch_upcoming_list) for more info |
| `type`           | _Optional_ - Template to view. "detail" or "table"                                                                                                       |
| `locationIds`    | _Optional_ - An array of locationId integers you want data from. If no location is provided you recieve launch data from all locations                   |
| `headerText`     | _Optional_ - Text you want to add to your header                                                                                                         |

## Important

1. TheSpaceDevs API is free to use but capped at 15 api calls per hour for unauthenticated users. This is important if you want to add both the detail view and table view to your magic mirror. Each module will make its own API call so set your updateIntervals accordingly. The default for this module is 15 api calls per hour.

## Screenshot

Table View: Looks best in any of the corners.
![alt text](https://github.com/AlexMNet/MMM-TheSpaceDevs/blob/main/table_view.png?raw=true)

Detail View: Coming soon...
