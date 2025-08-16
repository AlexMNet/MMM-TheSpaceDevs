Module.register('MMM-TheSpaceDevs', {
  // Default module config.
  defaults: {
    updateInterval: (60 * 60 * 1000) / 15,
    animationSpeed: 500,
    lang: config.language,
    records: 8,
    type: 'table',
    locationIds: [],
    apiKey: '',
    width: 600,
    headerText: 'Upcoming Launches',
    apiBase: 'https://ll.thespacedevs.com/2.3.0/launches/upcoming/?format=json',
    timeZone: 'UTC',
  },

  getTemplate() {
    switch (this.config.type.toLowerCase()) {
      case 'detail':
        return 'detail.njk';
      default:
        return 'table.njk';
    }
  },

  getScripts() {
    return ['moment.js', 'helpers.js'];
  },

  getStyles() {
    return ['MMM-TheSpaceDevs.css'];
  },

  getHeader() {
    if (this.config.type === 'detail') return null;
    this.data.header = this.config.headerText;
    return this.data.header;
  },

  start() {
    Log.info('Starting module: ' + this.name);

    moment.locale(config.language);

    this.launch = [];
    this.error = '';
    this.lastFetched = '';
    this.fetchLaunchData();

    // Set countdown
    this.updateCountdown();
    setInterval(() => {
      this.updateCountdown();
      this.updateDom();
    }, 1000);
  },

  updateCountdown() {
    if (this.launch.results) {
      const launchDate = moment(this.launch.results[0].net);
      const now = moment();
      const isUpcoming = now.isBefore(launchDate);
      this.isUpcoming = isUpcoming;

      if (isUpcoming) {
        const duration = moment.duration(launchDate.diff(now));

        this.days = duration.days().toString().padStart(2, '0');
        this.hours = duration.hours().toString().padStart(2, '0');
        this.minutes = duration.minutes().toString().padStart(2, '0');
        this.seconds = duration.seconds().toString().padStart(2, '0');
      } else {
        const duration = moment.duration(now.diff(launchDate));

        this.days = duration.days().toString().padStart(2, '0');
        this.hours = duration.hours().toString().padStart(2, '0');
        this.minutes = duration.minutes().toString().padStart(2, '0');
        this.seconds = duration.seconds().toString().padStart(2, '0');
      }
    }
  },

  getTemplateData() {
    if (!this.launch.results) {
      return {
        launches: [],
        upcomingLaunch: null,
        error: this.error,
      };
    }

    const launches = this.launch.results.slice(0, this.config.records).map((launch) => {
      const rocket = launch.rocket.configuration.name;
      const status = launch.status.abbrev;
      const date = formatDate(launch.net, launch.status.abbrev, this.config.timeZone);
      const window = formatLaunchWindow(
        launch.window_start,
        launch.window_end,
        status,
        this.config.timeZone
      );

      return {
        rocket,
        status,
        date,
        window,
      };
    });

    const successColor = '#4ade80';
    const warningColor = '#f59e0b';
    const errorColor = '#f87171';
    const infoColor = '#38bdf8';

    const statusColor = {
      Go: successColor,
      'In Flight': successColor,
      Success: successColor,
      TBC: warningColor,
      TBD: warningColor,
      Hold: warningColor,
      Failure: errorColor,
      'Partial Failure': errorColor,
    };

    const launch = this.launch.results[0];

    const lastUpdated = moment(launch.last_updated).format(
      'MMMM Do YYYY, h:mm:ss a'
    );

    const status = launch.status.abbrev;
    const showCountdown = !['TBD', 'Hold', 'TBC'].includes(status);

    const upcomingLaunch = {
      rocket: launch.rocket.configuration.name,
      image: launch.image,
      date: moment(launch.net).format(),
      hours: this.hours,
      days: this.days,
      minutes: this.minutes,
      seconds: this.seconds,
      company: launch.launch_service_provider.name,
      mission: launch.mission.description,
      status,
      showCountdown,
      orbit: launch.mission.orbit.abbrev,
      isUpcoming: this.isUpcoming,
      statusColor: statusColor[launch.status.abbrev],
      lastUpdated,
      lastFetched: this.lastFetched,
    };

    return {
      launches,
      upcomingLaunch,
      error: this.error,
      width: this.config.width,
    };
  },

  fetchLaunchData() {
    const nowIso = moment().toISOString();
    const url = `${this.config.apiBase}&limit=${this.config.records}${getLocationIds(this.config.locationIds)}`;

    const self = this;
    this.error = '';
    const apiKey = this.config.apiKey;

    const options = {};

    if (apiKey) {
      options.headers = {
        Authorization: `Token ${this.config.apiKey}`,
      };
    }

    fetch(url, options)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 429) {
          const error = new Error('Too many requests. Retry in 10 minutes.');
          error.name = 'TooManyRequests';
          throw error;
        }
      })
      .then((data) => {
        self.scheduleUpdate();
        self.processLaunch(data);
        this.lastFetched = moment().format('MMMM Do YYYY, h:mm:ss a');
      })
      .catch((error) => {
        if (error.name === 'TooManyRequests') {
          this.error = 'Too many Requests';
          this.updateDom();
          return self.scheduleUpdate(600000);
        }

        this.error = 'Something went wrong...';
        self.updateDom();
        self.scheduleUpdate(60 * 1000);
        Log.info('Something went wrong. Check Configuration...');
      });
  },

  processLaunch(data) {
    // Ensure we display the next upcoming launches (future nets), regardless of API ordering.
    if (!data || !Array.isArray(data.results)) {
      this.launch = data;
      this.updateDom(this.config.animationSpeed);
      return;
    }

    const now = new Date();
    const upcoming = data.results
      .filter((l) => l && l.net && new Date(l.net) >= now)
      .sort((a, b) => new Date(a.net) - new Date(b.net))
      .slice(0, this.config.records);

    // Preserve metadata but replace results with the processed upcoming list
    this.launch = Object.assign({}, data, { results: upcoming });
    this.updateDom(this.config.animationSpeed);
  },

  scheduleUpdate(delay) {
    const self = this;

    const timeoutDelay = delay || this.config.updateInterval;

    setTimeout(() => {
      self.fetchLaunchData();
    }, timeoutDelay);
  },
});
