const formatLaunchWindow = (isoDate1, isoDate2, status) => {
  if (status === 'TBD') {
    return 'TBD';
  }

  const options = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  const windowStart = new Date(isoDate1);
  const windowEnd = new Date(isoDate2);

  return `${windowStart.toLocaleTimeString(
    'en-US',
    options
  )} - ${windowEnd.toLocaleTimeString('en-US', options)}`;
};

const formatDate = (isoDate, status) => {
  if (status === 'TBD') {
    return 'TBD';
  }

  const options = {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
  };
  const date = new Date(isoDate);

  return date.toLocaleDateString('en-us', options);
};

const getLocationIds = (locations) => {
  return locations.length > 0
    ? locations.map((location) => `&location__ids=${location}`).join('')
    : '';
};
