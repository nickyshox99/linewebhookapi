module.exports = {
    apps: [
      {
        name: 'VueAPI',
        script: 'app.js', // Update with your main script file
        instances: 4, // Increase the number of instances
        exec_mode: 'cluster',
        watch: false,
        autorestart: true,
        max_memory_restart: '1G',
      },
    ],
  };
  