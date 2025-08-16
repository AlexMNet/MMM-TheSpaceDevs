# MMM-TheSpaceDevs

This is a module for [MagicMirror²](https://github.com/MagicMirrorOrg/MagicMirror/).

This module will show you upcoming rocket launches based on [TheSpaceDevs](https://thespacedevs.com/) API.
Unauthenticated users have access to 15 api calls per hour.

## Installation

1. Navigate to your MagicMirror's modules folder, and run the following command: `git clone https://github.com/AlexMNet/MMM-TheSpaceDevs`
2. Add the module and a valid configuration to your `config/config.js` file

## Using the module

This is an example configuration for your `config/config.js` file:

```js
let config = {
  modules: [
    // TABLE VIEW CONFIG
    {
      module: 'MMM-TheSpaceDevs',
      position: 'bottom_right',
      config: {
        updateInterval: (60 * 60 * 1000) / 15,
        records: 5,
        type: 'table',
        locationIds: [11],
        headerText: 'Vandenberg Space Force Base - Launches',
        timeZone: 'America/New_York'
      },
    },
    // DETAIL VIEW CONFIG
    {
      module: 'MMM-TheSpaceDevs',
      position: 'middle_center',
      config: {
        updateInterval: (60 * 60 * 1000) / 15,
        type: 'detail',
        locationIds: [11],
        width: 500,
      },
    },
  ],
};
```

## Configuration options (all are optional see MMM-TheSpaceDevs.js for defaults)

| Option           | Description                                                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `records`        | # of launches you want returned from the api for table view. Between 1 - 7 looks best                                                       |
| `updateInterval` | How often you want to fetch data from the API in ms. Default is 15 times per hour                                                           |
| `apiKey`         | Add apiKey for increased API rate limits visit [TheSpaceDevs](https://ll.thespacedevs.com/docs/#/launch/launch_upcoming_list) for more info |
| `type`           | Template to view. "detail" or "table"                                                                                                       |
| `locationIds`    | An array of locationId integers you want data from. If no location is provided you will recieve launch data from all locations              |
| `headerText`     | Text you want to add to your header for table view                                                                                          |
| `width`          | Width is used for the detail template.                                                                                                      |
| `timeZone`       | Time zone for all displayed times.                                                                                                    |

## Important

1. TheSpaceDevs API is free to use but capped at 15 api calls per hour for unauthenticated users. This is important if you want to add both the detail view and table view to your magic mirror. Each module will make its own API call so set your updateIntervals accordingly. The default for this module is 15 api calls per hour which assumes you will only be using the table or detail view.

## Screenshot

Table View: Looks best in any of the corners.
![alt text](https://github.com/AlexMNet/MMM-TheSpaceDevs/blob/main/table_view.png?raw=true)

Detail View: Intended to be used for middle_center
![alt text](https://github.com/AlexMNet/MMM-TheSpaceDevs/blob/main/detail_view.png?raw=true)
